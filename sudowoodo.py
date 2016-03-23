import json
from slack_client import SlackClient
import yaml
import logging
logging.basicConfig()
logger = logging.getLogger(__name__)

class Sudowoodo(object):
    def __init__(self, config):
        self.config = config
        self.message_id = 0
        self.plugins = {}

        self.slack = SlackClient(config['token'], on_message=self.receive_message)
        self.id = self.slack
        self._load_core_plugins()

        # once everything is loaded, begin listening
        self.slack.run_forever()

    def _load_core_plugins(self):
        with open('plugins/plugins.yaml', 'r') as config_file:
            plugins = yaml.safe_load(config_file)
        for plugin, settings in plugins.iteritems():
            if settings['active']:
                module = __import__("plugins.{}".format(settings.get('package', plugin)), fromlist=[plugin])
                class_ = getattr(getattr(module, plugin), settings['class'])
                self.plugins[plugin] = class_(self.slack.channels,
                                              self.slack.direct_channels,
                                              self.slack.team_members)

    def receive_message(self, ws, _message):
        print _message
        message = json.loads(_message)
        sender = message.get('user', None)
        message_type = message.get('type', 'UNKNOWN')

        if message_type == 'message' and sender not in [None, self.slack.id]:
            for plugin_name, plugin in self.plugins.iteritems():
                can_receive = plugin.can_receive(message)
                logger.debug("{}-can_receive: {}".format(plugin_name, can_receive))
                if can_receive:
                    plugin.execute(message, self.send_message)

    def send_message(self, text, channel):
        self.message_id += 1

        # TODO: sanitize output
        self.slack.send({
            'id': self.message_id,
            'type': 'message',
            'channel': channel,
            'text': text
        })


def main():
    with open('config.yaml', 'r') as config_file:
        config = yaml.safe_load(config_file)
    s = Sudowoodo(config)


if __name__ == '__main__':
    main()
