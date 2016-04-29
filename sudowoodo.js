var Botkit = require('botkit');
var Ladder = require('./connectors/ladder/index.js');
var responsesjs = require('./responses.js')
var utils = require('./connectors/ladder/utils.js');

var Responses = responsesjs.responses
var randomResponse = responsesjs.randomResponse
var maybeRespond = responsesjs.maybeRespond

mongoStorage = require('botkit-storage-mongo')({mongoUri: 'mongodb://localhost:27017/'})
var controller = Botkit.slackbot({
  debug: true,
  storage: mongoStorage
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

var greetingCount = 0;
var remainingAnnoyedResponses = [];
var lastTopic = "pingpong"
var explained = false
var firstNames = {};

function processSlackPayload(payload) {
  var users = payload.users
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    firstNames[user.id] = user.profile.first_name || user.id;
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

/* Ladder-related Triggers */
// debug commands
controller.hears('sudo (?:get|list)(?: all)? players', ['direct_message'], Ladder.players.getAll);
controller.hears('sudo (?:get|list)(?: all)? matches', ['direct_message'], Ladder.matches.getAll);
controller.hears('sudo (?:force )?recalculate ratings', ['direct_message'], Ladder.ratings.recalculate);

// Get all rankings
controller.hears(['list(?:.*) ranking(?:s)?', 'ranking(?:s)? list', 'show(?:.*) leaderboard(?:s)?', 'show(?:.*) ranking(?:s)?'],
  ['direct_mention', 'mention', 'direct_message'],
  Ladder.rankings.getAll);

// Get personal ranking
controller.hears(["(what(?:'s| is) )?my ranking", "personal ranking"],
  ['ambient', 'direct_message', 'direct_mention', 'message'],
  Ladder.rankings.personal);

// match record
controller.hears('(\\S+) (won against|beat|was beaten by) (\\S+)(?:.* (\\d+)[:|-](\\d+))?', ['direct_mention', 'direct_message'], Ladder.matches.add.one)

// register user
controller.on('user_channel_join', Ladder.players.add.one);
controller.hears('sudo add player <@(\\S+)>', ['direct_message'], Ladder.players.add.manual);

controller.hears('^(hello|hey|yo$|hi|howdy|bonjour|hallo|hullo)( sudowoodo)?',
  ['direct_message','direct_mention','mention'],
  function(bot,message) {
    greetingCount++;
    var responses;

    if (greetingCount < 5) {
      responses = Responses.salutation.neutral;
      remainingAnnoyedResponses = Responses.salutation.annoyed;
    }
    else {
      responses = [remainingAnnoyedResponses.pop()];
      if (greetingCount > 8) { greetingCount = 0; }
    }
    bot.reply(message, randomResponse(responses, firstNames[message.user]));
});

controller.hears('^good (\\w+)( sudowoodo)?', ['direct_message', 'mention', 'direct_mention'],
  function(bot, message) {
    bot.reply(message, randomResponse(["Good " + message.match[1] + " to you too, $USER$"], firstNames[message.user]))
})

controller.hears(["thanks", "tyvm", "^ty", "thank you"], ['mention', 'direct_mention', 'direct_message'], function(bot, message) {
  bot.reply(message, randomResponse(Responses.replyTo.thanks, firstNames[message.user]))
})

controller.hears("(?:who|what)(?: is|'s)(?: a)?(?: sudowoodo)?", ['mention', 'ambient'], function(bot, message) {
  bot.reply(message, aboutBot(message))
});

controller.hears("how.*(calculat|comput).*ra.*ng(s)?", ["ambient", "direct_mention", "mention"], function(bot, message) {
  bot.startConversation(message, function(err, convo) {
    if (explained) {
      convo.say("I already explained it!! I DON'T WANT TO AGAIN.")
    } else {
      convo.ask("Ummm...are you sure? It's kinda long...", [
        {
          pattern: bot.utterances.yes,
          callback: function(response, convo) {
            explained = true
            convo.say("Okay...........here goes.........")
            convo.say("First, I assign a `1` to the winner and `0` to the loser -- those are their `scores`")
            convo.say("I take into the account your ratings and calculate your expected score, `exp_score`")
            convo.say("Oh, and I also take the difference of your current ratings, `rating_diff`")
            convo.say("Then, I take the absolute value of difference in your points, `point_diff`")
            convo.say("I calculate the margin of victory: `(ln(point_diff) + 1) * (2.2 / (rating_diff * 0.001 + 2.2))`")
            convo.say("Then I multiply that margin of victory to your k-factor -- just a value that affects how drastic a match affects your score")
            convo.say("Then I multiply _all_ that with the difference between your `score` and `exp_score`")
            convo.say("DONE.")
            convo.say(maybeRespond(["What a mouthful."]))
            convo.say("Oh, and then subtract or add that to your current rating.")
            convo.next()
          }
        },
        {
          pattern: bot.utterances.no,
          callback: function(response, convo) {
            convo.say("Uh...")
          }
        }
      ])
    }
  });
})

controller.hears(["ping(?:-| )?pong"], ["ambient", "direct_mention", "mention"], function(bot, message) {
  console.log(message)
  bot.reply(message, maybeRespond(["PING-PONG IS LIFE :table_tennis_paddle_and_ball:",
  "PING-PONG ROOLZ",
  ":table_tennis_paddle_and_ball: = :100:",
  "^ that message speaks to me",
  "I'm better than ping pong than any of you.", "What is life without ping pong?"]));
})

controller.hears(":(\\S+):", ["direct_mention", "mention", "ambient"], function(bot, message) {
  bot.reply(message, maybeRespond([":" + message.match[1] + ":", ":" + message.match[1] + ":!!"], 0.85))
})

controller.hears("^who", ["direct_mention", "mention"], function(bot, message) {
  var responses = ["You, $USER$!",
    "I guess it's you, $USER$",
    "It's not always about you, $USER$",
    "Not sure who that is"
  ]
  bot.reply(message, randomResponse(responses));
})

controller.hears(["\\?", '^what', '^why', '^where', '^how', '^who'], ["direct_mention", "mention"], function(bot, message) {
  var respList = ["lol idk",
    "...42. Whatever your question was, that's the answer.\nNo, it's 4.\nNope, it's definitely 42.",
    "yes. maybe? I wasn't listening to your question",
    "...:neutral_face:",
    "idk",
    "ERROR: idk how to answer your question lol :robot_face:",
    "yes. the answer is yes.\nwait. I wasn't listening.",
    "Well, you see, $USER$....",
    "Lemme think about that for a sec and I'll get back to you ;)",
    "Look, $USER$. I don't know what you want me to say.",
    "I don't know the answer to that yet. But when I do, I'll let you know."]
  bot.reply(message, randomResponse(respList, firstNames[message.user]))
})

controller.hears(["don't like you", "hate you", "do not like you", "f\\w+ you", "screw you"], ["direct_mention", "mention"], function(bot, message) {
  bot.reply(message, ":(")
})
