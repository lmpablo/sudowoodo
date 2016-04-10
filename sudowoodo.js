var Botkit = require('botkit');
var Ladder = require('./connectors/ladder/index.js');
mongoStorage = require('botkit-storage-mongo')({mongoUri: 'mongodb://localhost:27017/'})
var controller = Botkit.slackbot({
  debug: false,
  storage: mongoStorage
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

function processSlackPayload(payload) {

}

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
}).startRTM(function(err, bot, payload) {
  processSlackPayload(payload);
})

// give the bot something to listen for.
controller.hears('hello',['direct_message','direct_mention','mention'],function(bot,message) {
  bot.reply(message,'Hello yourself.');
});


controller.hears("(?:who|what)(?: is| 's)(?: a)?", ['mention', 'direct_mention'], function(bot, message) {
  bot.reply(message, aboutBot(message))
});


/* Ladder-related Triggers */
// debug commands
controller.hears('sudo (?:get|list)(?: all)? players', ['direct_message'], Ladder.players.getAll);
controller.hears('sudo (?:get|list)(?: all)? matches', ['direct_message'], Ladder.matches.getAll);

// Get all rankings
controller.hears(['list(?:.*) ranking(?:s)?', 'ranking(?:s)? list'],
  ['direct_mention', 'mention', 'direct_message'],
  Ladder.rankings.getAll);

// Get personal ranking
controller.hears(["(what(?:'s| is) )?my ranking", "personal ranking"],
  ['ambient', 'direct_message', 'direct_mention', 'message'],
  Ladder.rankings.personal);


controller.hears(['i won against <@(.*)>', 'i beat <@(.*)>'], ['direct_message'], function(bot, message){
  console.log(message)
  console.log(message.match[0])
})


controller.on('user_channel_join', Ladder.players.add);
