var Botkit = require('botkit');
var responsesjs = require('./responses.js')
var Router = require('./receivers/router.js')
var config = require('./config.js');

var maybeRespond = responsesjs.maybeRespond

mongoStorage = require('botkit-storage-mongo')({mongoUri: 'mongodb://localhost:27017/'})
var controller = Botkit.slackbot({
  debug: true,
  storage: mongoStorage
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

var lastTopic = "pingpong"
var explained = false

function processSlackPayload(payload) {
  var firstNames = {};
  var users = payload.users;
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    firstNames[user.id] = user.profile.first_name || '<@' + user.id + '>';
  }
  return firstNames;
}

// connect the bot to a stream of messages
controller.spawn({
  token: process.env.token
}).startRTM(function(err, bot, payload) {
    var environment = process.env.environment || 'dev';
    bot.apiConfig = config[environment];
    bot.realNames = processSlackPayload(payload);
    bot.getRealName = function(uid) {
        return bot.realNames[uid];
    };
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

Router(controller);
