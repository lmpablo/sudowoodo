from time import sleep
import websocket
import requests
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("slack-client")

class SlackClient(object):
    def __init__(self, token, autoconnect=True, on_message=None, on_error=None, on_connect=None, on_close=None):
        self.token = token
        self.websocket_url = None
        self.websocket = None
        self.channels = {}
        self.direct_channels = {}
        self.team_members = {}

        self.connection_retries = 0
        if autoconnect:
            self.connect(on_message, on_error, on_connect, on_close)

    def connect(self, on_message, on_error, on_connect, on_close):
        self.connection_retries += 1

        resp = requests.get("https://slack.com/api/rtm.start", params={"token": self.token})

        if on_message is None:
            on_message = SlackClient.ws_on_message
        if on_error is None:
            on_error = SlackClient.ws_on_error
        if on_connect is None:
            on_connect = SlackClient.ws_on_connect
        if on_close is None:
            on_close = SlackClient.ws_on_close

        if resp.ok:
            self.connection_retries = 0
            self.parse_rtm_start(resp.json())
            ws = websocket.WebSocketApp(resp.json()["url"],
                                        on_message=on_message,
                                        on_error=on_error,
                                        on_close=on_close,
                                        on_open=on_connect)
            self.websocket = ws
            self.websocket.run_forever()
        else:
            print "Error connecting: {}".format(resp.reason)
            sleep(3)
            if self.connection_retries == 3:
                raise Exception("Failed connecting to Slack after 3 tries.")
            self.connect()

    def parse_rtm_start(self, response_json):
        self.team_members = {u["id"] for u in response_json["users"]}
        self.channels = {c["id"] for c in response_json["channels"]}
        self.direct_channels = {d["id"] for d in response_json["ims"]}

    @staticmethod
    def ws_on_connect(ws):
        logging.debug("Connected to websocket")

    @staticmethod
    def ws_on_error(ws, error):
        logging.error(error)

    @staticmethod
    def ws_on_message(ws, message):
        logging.info("Received message: {}".format(message))

    @staticmethod
    def ws_on_close(ws):
        logging.debug("Closing connection to websocket")
