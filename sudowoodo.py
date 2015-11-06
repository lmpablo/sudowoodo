from slack_client import SlackClient
import yaml


class Sudowoodo(object):
    def __init__(self, config):
        self.config = config
        self.message_id = 0
        self.plugins = {}

        self.slack = SlackClient(config['token'], on_message=self.receive_message)

        self._load_core_plugins()

    def _load_core_plugins(self):
        pass

    def receive_message(self, ws, message):
        pass

    def send_message(self, message, channel):
        self.message_id += 1
        pass


def main():
    config = None
    with open('config.yaml', 'r') as config_file:
        config = yaml.safe_load(config_file)
    s = Sudowoodo(config)


if __name__ == '__main__':
    main()
