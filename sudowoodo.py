from slack_client import SlackClient
import yaml


class Sudowoodo(object):
    def __init__(self, config):
        self.config = config
        self.message_id = 0
        self.plugins = {}

        self.slack = SlackClient(config['token'], on_message=self.receive_message)
        self._load_core_plugins()

        # once everything is loaded, begin listening
        self.slack.run_forever()

    def _load_core_plugins(self):
        with open('plugins/plugins.yaml', 'r') as config_file:
            plugins = yaml.safe_load(config_file)
        for plugin, settings in plugins.iteritems():
            if settings['active']:
                module = __import__("plugins", fromlist=[plugin])
                class_ = getattr(getattr(module, plugin), settings['class'])
                self.plugins[plugin] = class_(self.slack.channels,
                                              self.slack.direct_channels,
                                              self.slack.team_members)

    def receive_message(self, ws, message):
        print message
        pass

    def send_message(self, message, channel):
        self.message_id += 1
        pass


def main():
    with open('config.yaml', 'r') as config_file:
        config = yaml.safe_load(config_file)
    s = Sudowoodo(config)


if __name__ == '__main__':
    main()
