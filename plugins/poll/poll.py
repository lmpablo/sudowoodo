from plugins.api.plugin_base import PluginBase
from datetime import datetime

import logging
logging.basicConfig()
logger = logging.getLogger(__name__)

class PollPlugin(PluginBase):
    def __init__(self, *args):
        PluginBase.__init__(self, 'poll', *args)

        self.active_polls = {}
        self.staging_polls = {}
        self.closed_polls = {}

    def execute(self, package, callback):
        raw_message = package["text"]
        channel = package["channel"]

        message = ""

        if channel[0] == "D":
            self.logger.info("direct message")
            message = raw_message
        elif channel[0] == "C":
            self.logger.info("channel message")
            if raw_message.startswith("sudo "):
                message = raw_message.strip("sudo ")
        else:
            self.logger.warn("Bad message source")

        if message.startswith("create poll"):
            poll_name = message[12:]
            poll = Poll(poll_name, package["user"])


        print [x for u, x in self.direct_channels.iteritems() if x['user'] == package["user"]]
        # poll = Poll("test poll", package["user"])

        pass


class Poll(object):
    def __init__(self, name, creator):
        self.name = name
        self.creator = creator
        self.id = hash(str(datetime.now()) + name + creator)
        self.options = []
        print self.id, self.name, self.creator

    def get_id(self):
        return self.id

    def add_option(self, option_name):
        self.options.append(option_name)