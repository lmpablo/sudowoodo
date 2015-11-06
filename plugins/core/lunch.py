from plugins.plugin_base import PluginBase


class LunchPlugin(PluginBase):
    def __init__(self, *args):
        PluginBase.__init__(self, 'lunch', *args)

    def execute(self, package, callback):
        pass
