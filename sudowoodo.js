var Botkit = require('botkit');
var Ladder = require('./connectors/ladder/index.js');
var responsesjs = require('./responses.js')
var utils = require('./ladder/utils.js');

var Responses = responsesjs.responses
var randomResponse = responsesjs.randomResponse

mongoStorage = require('botkit-storage-mongo')({mongoUri: 'mongodb://localhost:27017/'})
var controller = Botkit.slackbot({
  debug: false,
  storage: mongoStorage
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

var greetingCount = 0;



function processSlackPayload(payload) {
  var users = payload.users
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    // do stuff
  }
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

controller.hears('^(hello|hey|yo|hi|howdy|bonjour|hallo|hullo)( sudowoodo)?$',['direct_message','direct_mention','mention'],function(bot,message) {
  greetingCount++;
  var responses;
  if (greetingCount < 5) { responses = Responses.salutation.neutral; }
  else {
    responses = Responses.salutation.annoyed;
    if (greetingCount > 8) { greetingCount = 0; }
  }
  bot.reply(message, randomResponse(responses));
});


controller.hears("(?:who|what)(?: is| 's)(?: a)?", ['mention', 'direct_mention'], function(bot, message) {
  bot.reply(message, aboutBot(message))
});


/* Ladder-related Triggers */
// debug commands
controller.hears('sudo (?:get|list)(?: all)? players', ['direct_message'], Ladder.players.getAll);
controller.hears('sudo (?:get|list)(?: all)? matches', ['direct_message'], Ladder.matches.getAll);
controller.hears('sudo (?:force )?recalculate ratings', ['direct_message'], Ladder.ratings.recalculate);

// Get all rankings
controller.hears(['list(?:.*) ranking(?:s)?', 'ranking(?:s)? list'],
  ['direct_mention', 'mention', 'direct_message'],
  Ladder.rankings.getAll);

// Get personal ranking
controller.hears(["(what(?:'s| is) )?my ranking", "personal ranking"],
  ['ambient', 'direct_message', 'direct_mention', 'message'],
  Ladder.rankings.personal);

// match record
controller.hears('(\\S+) (won against|beat|was beaten by) (\\S+)(?:.* (\\d+):(\\d+))?', ['direct_mention', 'direct_message'], Ladder.matches.add.one)

// register user
controller.on('user_channel_join', Ladder.players.add.one);
controller.hears('sudo add player <@(\\S+)>', ['direct_message'], Ladder.players.add.manual);
