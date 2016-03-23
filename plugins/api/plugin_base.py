from abc import ABCMeta, abstractmethod
import logging
logging.basicConfig()
logger = logging.getLogger(__name__)


class PluginBase(object):
    __metaclass__ = ABCMeta

    def __init__(self, name, channels, direct_channels, team_members):
        logger.info("Registering plugin: {}".format(name))
        self.name = name
        self.channels = channels
        self.direct_channels = direct_channels
        self.team_members = team_members
        self.logger = logger

    def get_status(self):
        return "{}: OK".format(self.name)

    @abstractmethod
    def execute(self, package, callback):
        raise NotImplementedError

    def can_receive(self, package):
        if 'subtype' in package or 'reply_to' in package:
            return False
        if 'text' in package and 'ignore' in package['text']:
            return False
        return True
