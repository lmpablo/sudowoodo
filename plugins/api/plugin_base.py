from abc import ABCMeta, abstractmethod
import logging
logging.basicConfig()
logger = logging.getLogger(__name__)


class PluginBase(object):
    __metaclass__ = ABCMeta

    def __init__(self, name, channels, direct_channels, team_members):
        logger.info("Registering as {}".format(name))
        self.name = name
        self.channels = channels
        self.direct_channels = direct_channels
        self.team_members = team_members

    def get_status(self):
        return "{}: OK".format(self.name)

    @abstractmethod
    def execute(self, package, callback):
        pass
