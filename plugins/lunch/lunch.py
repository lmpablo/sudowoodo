from plugins.api.plugin_base import PluginBase
import re


class LunchPlugin(PluginBase):
    def __init__(self, *args):
        PluginBase.__init__(self, 'lunch', *args)

        self.vote_mode = False
        self.order_mode = False

    def execute(self, package, callback):
        message = package['text']

        print "lunch received a message from {}: {}".format(package['user'], package)

        patt1 = re.compile(r"(?:get|take).*order(?:s(?: )?)")
        patt2 = re.compile(r"(?:what|idea|where)?.*lunch")
        patt3 = re.compile(r"(?:want|have|order|get).*(?:a|an|the) ([\w\s]+)*")
        patt4 = re.compile(r"([\w\s]+)* for me")
        patt5 = re.compile(r"(?:want|have|order|get) ([\w\s]+)")

        if patt1.search(message):
            callback("Activated!!", package['channel'])
        elif patt2.search(message):
            callback("Did someone say lunch?", package['channel'])
        elif patt3.search(message):
            callback("Wait... did you say you want {}".format(patt3.search(message).groups()[0]), package['channel'])
