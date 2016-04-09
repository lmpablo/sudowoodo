var Botkit = require('botkit');
var Ladder = require('./connectors/ladder/index.js');

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

function aboutBot(message) {
  var response = [
    "I'm but a bot.",
    "One of you. But cooler.",
    "What did you just call me, <@" + message.user + ">?",
    "You rang?",
    "I think I heard someone say my name",
    "I don't go around asking what _you_ are, <@" + message.user + ">, so..."
  ]

  return response[Math.floor(Math.random() * response.length)];
}


// connect the bot to a stream of messages
controller.spawn({
  token: process.env.token,
}).startRTM()

// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,'Hello yourself.');
});


controller.hears("(?:who|what)(?: is| 's)(?: a)?", ['mention', 'direct_mention'], function(bot, message) {
  bot.reply(message, aboutBot(message))
});


/* Ladder-related Triggers */
// Get all rankings
controller.hears(['list(?:.*) ranking(?:s)?', 'ranking(?:s)? list'], ['direct_message'], Ladder.rankings.getAll);


controller.on('channel_join', function(bot, message) {
  bot.reply(message, "Welcome @" + message.user)
})
