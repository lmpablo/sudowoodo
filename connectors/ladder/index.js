var utils = require('./utils.js');
var uuid = require('node-uuid');
var responsesjs = require('../../responses.js')

var Responses = responsesjs.responses
var randomResponse = responsesjs.randomResponse

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
    add: {
      one: function(bot, message) {
        bot.api.channels.info({channel: message.channel}, function(err, response) {
          if(response.channel.name === "pingpong") {
            bot.startPrivateConversation({user: message.user}, function(response, convo) {
              convo.say("Hey <@" + message.user +">! Welcome to <#" + message.channel +  ">...");

              utils.request.GET('/players/' + message.user, function(status, reason, data) {
                  convo.say("Looks like you're already registered!")
              }, function(status, reason) {
                  convo.say("I'm gonna add you to the database. Sit tight!")
                  bot.api.users.info({ user: message.user }, function(err, response) {
                    var user_data = {
                      player_id: message.user,
                      slack_name: response.user.name,
                      real_name: response.user.profile.real_name,
                      profile_picture: response.user.profile.image_512
                    }

                    utils.request.POST('/players', user_data, function(status, reason, data) {
                      if (status === "success") {
                        convo.say("Sweet, it worked!")
                      }
                    }, function(status, reason, data) {
                      if (reason === "Player already exists") {
                        convo.say("Oops. Looks like you were already registered?");
                      } else {
                        convo.say("Oops. Something went wrong: " + reason);
                      }
                    })
                  });
              });
            });
          }
        });
      },
      manual: function(bot, message) {
        var player = message.match[1];
        var user_data = { player_id: player }

        utils.request.POST('/players', user_data, function(status, reason, data) {
          bot.reply(message, 'SUCCESS: Player <@' + player + '> added.')
        }, function(status, reason, data) {
          bot.reply(message, 'ERROR: Add failed \n>' + reason);
        })
      }
    }
  },
  ratings: {
    recalculate: function(bot, message) {
      utils.request.PUT('/ratings', {}, function(status, reason, data) {
        bot.reply(message, 'SUCCESS: ' + data)
      }, function(status, reason, data) {
        bot.reply(message, 'ERROR: ' + reason)
      })
    }
  },
  matches: {
    getAll: function(bot, message) {
      bot.reply(message, "get all matches");
    },
    add: {
      one: function(bot, message) {
        var winner, loser, score1, score2;
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
        } else {
          score1 = 9
          score2 = 11
        }

        winningScore = (score1 > score2) ? score1 : score2;
        losingScore = (score1 > score2) ? score2 : score1;

        bot.startConversation(message, function(err, convo){
          var matchData = {
            match_id: uuid.v4(),
            timestamp: new Date(),
            participants: [{
              player_id: utils.parser.user(winner),
              score: winningScore
            }, {
              player_id: utils.parser.user(loser),
              score: losingScore
            }],
            winner: utils.parser.user(winner)
          }

          console.log(matchData)
          convo.say("Gotcha. Recording results now.")
          convo.say("Aaaaaaand...")

          utils.request.POST('/matches', matchData, function(status, reason, data) {
            if (status === "success") {
              var messageWithAttachments = {
                'text': 'Congrats ' + winner + '!',
                'attachments': [{
                  title: 'Match Results - ' + winner + ' vs. ' + loser,
                  fallback: 'Please confirm match results: %WINNER% (%SCORE_WIN%) - %LOSER% (%SCORE_LOSE%)'.replace("%WINNER%", winner).replace("%LOSER%", loser).replace("%SCORE_WIN%", winningScore).replace("%SCORE_LOSE%", losingScore),
                  fields: [{
                    title: 'Winner',
                    value: winner + ' (' + winningScore + ' points)',
                    short: true
                  }, {
                    title: 'Loser',
                    value: loser + ' (' + losingScore + ' points)',
                    short: true
                  }],
                  color: '#7CD197'
                }]
              }
              convo.say(messageWithAttachments);
            }
          }, function(status, reason, data) {
            if (reason === "Match already exists") {
              convo.say("Oops. Looks like you already registered that match?");
            } else {
              convo.say("I couldn't add your match. Something went wrong: " + reason);
            }
          })
        })
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
      utils.request.GET('/rankings?top=-1', function(status, reason, data){
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
            bot.reply(message, randomResponse(Responses.congratulations.strong) + " YOU'RE NUMBER ONE!!")
          } else if (rank < 5 && rank > 1) {
            bot.reply(message, randomResponse(Responses.congratulations.neutral) + " You're currently ranked #" + rank + "!")
          } else {
            bot.reply(message, "You're currently #" + rank + "! " + randomResponse(Responses.encouragement))
          }
        } else {
          bot.reply(message, "You're currently listed as UNRANKED. Time to change that! " + randomResponse(Responses.encouragement.strong));
        }
      }, function(error, response, body) {
        bot.reply(message, "Something bad happened, please let someone know: " + error.code)
      });
    }
  }
}
