utils = require('./utils.js')

module.exports = {
  players: {
    getAll: function(bot, message) {
      utils.request.GET('/players', function(status, reason, data) {
        players = data.players;
        var playerList = ""
        for (var i = 0, len = players.length; i < len; i++) {
          var player = players[i];
          playerList += utils.formatter.player(player)
        }
        bot.reply(message, playerList)
      }, function(status, reason, data) {
        bot.reply(message, reason);
      });
    },
    add: function(bot, message) {
      bot.api.channels.info({channel: message.channel}, function(err, response) {
        if(response.channel.name === "pingpong") {
          bot.startPrivateConversation({user: message.user}, function(response, convo) {
            convo.say("Hey <@" + message.user +">! I noticed you joined <#" + message.channel +  ">...");
            convo.say("I'm gonna add you to the database. Sit tight!")

            var user_data = {
              player_id: message.user,
              rating: 1000.0,
              k_factor: 12
            }

            utils.request.POST('/players', user_data, function(status, reason, data) {
              if (status === "success") {
                convo.say("Sweet, it worked!")
              }
            }, function(status, reason, data) {
              if (reason === "Player already exists") {
                convo.say("Oops. Looks like you were already registered!");
              } else {
                convo.say("Oops. Something went wrong: " + reason);
              }
            })
          });
        }
      });
    }
  },
  matches: {
    getAll: function(bot, message) {
      bot.reply(message, "get all matches");
    }
  },
  rankings: {
    getAll: function(bot, message) {
      utils.request.GET('/rankings', function(status, reason, data){
        var messageString = "";
        rankings = data.rankings;
        for (var i = 0, len = rankings.length; i < len; i++) {
          messageString += utils.formatter.ranking(rankings[i])
        }
        bot.reply(message, messageString);
      }, function(error, response, body) {
        bot.reply(message, "Something bad happened, please let someone know: " + error.code)
      });
    },
    personal: function(bot, message) {
      utils.request.GET('/rankings', function(status, reason, data){
        var thisUser = message.user;
        rankings = data.rankings;

        var rank = null;
        for (var i = 0, len = rankings.length; i < len; i++) {
          if (rankings[i].player_id === thisUser) {
            rank = rankings[i].rank;
          }
        }

        if (rank) {
          if (rank === 1) {
            bot.reply(message, "YOU'RE NUMBER ONE!!")
          } else if (rank < 5 && rank > 1) {
            bot.reply(message, "Pretty good! You're currently ranked #" + rank + "!")
          } else {
            bot.reply(message, "You're currently #" + rank + "!")
          }
        } else {
          bot.reply(message, "You're currently listed as UNRANKED. Time to change that!");
        }
      }, function(error, response, body) {
        bot.reply(message, "Something bad happened, please let someone know: " + error.code)
      });
    }
  }
}
