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
    },
    add: {
      one: function(bot, message) {
        var winner, loser;
        var verb = message.match[2] || '';
        if (verb === 'beat' || verb === 'won against') {
          winner = message.match[1].toUpperCase();
          loser = message.match[3].toUpperCase();
        } else if (verb === 'was beaten by') {
          winner = message.match[3].toUpperCase();
          loser = message.match[1].toUpperCase();
        } else {
          bot.reply("I'm not sure I understand what actually happened here.")
          return
        }

        if (winner === "I" || winner === "ME") { winner = "<@" + message.user + ">"}
        if (loser === "ME" || loser === "I") { loser = "<@" + message.user + ">" }

        console.log(message)
        console.log(winner)
        console.log(loser)

        if (message.match[4] && message.match[5]) {
          score1 = parseInt(message.match[4])
          score2 = parseInt(message.match[5])
          winningScore = (score1 > score2) ? score1 : score2;
          losingScore = (score1 > score2) ? score2 : score1;

          bot.startConversation(message, function(err, convo){
            var res = "Hey <@%USER%>, so:\n*Winner*: %WINNER% (%SCORE_WIN%)\n*Loser*: %LOSER% (%SCORE_LOSE%)\nCan you confirm this is correct?".replace("%USER%", message.user).replace("%WINNER%", winner).replace("%LOSER%", loser).replace("%SCORE_WIN%", winningScore).replace("%SCORE_LOSE%", losingScore)
            convo.ask(res, [{
              pattern: bot.utterances.yes,
              callback: function(res, convo) {
                convo.say('Sweet! Congrats ' + winner + "!")
                // Insert it
                convo.next()
              }
            }, {
              pattern: bot.utterances.no,
              callback: function(res, convo) {
                convo.say('Oh, oops?')
                convo.next();
              }
            }])
          })
        } else {
          bot.reply(message, "Sorry, do you mind repeating that, but add the scores as well? Thanks.")
        }
      }
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
