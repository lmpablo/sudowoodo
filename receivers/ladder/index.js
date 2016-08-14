var rb = require('../response_builder.js');
var Responses = require('../responses.js');
var LadderAPI = require('./api.js');
var utils = require('./utils.js');
var uuid = require('node-uuid');

function randInt(max) {
    return Math.floor(Math.random() * max)
}

function parseMatchOutcomes(parts, currUser) {
    var outcome = {};
    var verb = parts[2] || '';
    if (verb === 'beat' || verb === 'won against') {
        outcome.winner = parts[1].toUpperCase();
        outcome.loser = parts[3].toUpperCase();
    } else if (verb === 'was beaten by' || verb === 'lost to') {
        outcome.winner = parts[3].toUpperCase();
        outcome.loser = parts[1].toUpperCase();
    } else {
        outcome.winner = null;
        outcome.loser = null;
    }

    // check for 1st personal pronoun use
    if (outcome.winner === 'I' || outcome.winner === 'ME') {
        outcome.winner = '<@' + currUser + '>';
    }
    if (outcome.loser === 'I' || outcome.loser === 'ME') {
        outcome.loser = '<@' + currUser + '>';
    }

    var scores = [9, 11];
    // check for scores
    if (parts.length == 6) {
        if (parts[4] && parts[5]) {
            scores[0] = parseInt(parts[4]);
            scores[1] = parseInt(parts[5]);
        }
    }

    outcome.winningScore = Math.max(scores[0], scores[1]);
    outcome.losingScore = Math.min(scores[0], scores[1]);

    return outcome;
}

function addMatchResultsSummaryGen(match, congratulations) {
    var replacements = {
        '$WINNER$': match.winner,
        '$LOSER$': match.loser,
        '$SCORE_W$': match.winningScore,
        '$SCORE_L$': match.losingScore
    };

    return {
        text: congratulations,
        attachments: [{
            title: rb.response('Match Results - $WINNER$ vs. $LOSER$', replacements),
            fallback: rb.response('$WINNER$ ($SCORE_W$) - $LOSER$ ($SCORE_L$)', replacements),
            fields: [{
                title: 'Winner',
                value: rb.response('$WINNER$ ($SCORE_W$ pts)', replacements),
                short: true
            }, {
                title: 'Loser',
                value: rb.response('$LOSER$ ($SCORE_L$ pts)', replacements),
                short: true
            }],
            color: '#7CD197'
        }]
    }
}

function addMatchRespAckGen(bot, message) {
    var acknowledgement = rb.randomResponse(Responses.acknowledgement.neutral, {
        '$USER$': bot.getRealName(message.user)
    });
    var record = rb.maybeRespond(['Recording it now.', '_Leaf_ it to me',
        '_Logging_ the results.', 'Recording results.', 'Processing.',
        '..._does bot stuff_...', '..._types stuff_...'], {}, 0.3);

    var properResponse = acknowledgement + ' ' + record;
    var properResponseStrong = rb.randomResponse(Responses.acknowledgement.strong, {
            '$USER$': bot.getRealName(message.user)
        }) + ' ' + record;
    var lazyResponse = rb.randomResponse(Responses.acknowledgement.weak, {
        '$USER$': bot.getRealName(message.user)
    });

    return rb.randomResponse([properResponseStrong, properResponse, lazyResponse]);
}

function addMatchResultRemarkGen(winner, loser, scoreDiff) {
    var replacements = {
        '$USER$': winner,
        '$LOSER$': loser
    };
    if (scoreDiff <= 5) {
        return rb.randomResponse(Responses.congratulations.neutral.concat([
            "You'll get 'em next time, $LOSER$",
            'DW about it too much, $LOSER$']), replacements);

    } else if (scoreDiff < 9) {
        return rb.randomResponse(Responses.congratulations.strong.concat([
            'Damn, $USER$. You\'re _root_less.'
        ]), replacements);
    } else {
        return rb.randomResponse(['$LOSER$, ...a-are you..okay?',
            '$LOSER$, don\'t worry. I\'m sure you\'re good at other things...right?',
            '$LOSER$. I\'m sorry to hear that.',
            '...$LOSER$. Condolences.'], replacements);
    }
}

function buildRankingField(rankInfo, isUser, diffFromFirst) {
    var GOLD = '#FFD700',
        SILVER = '#C9C0BB',
        BRONZE = '#A57164';
    var replacements = {
        '$RANK$': rankInfo.rank === 1 ? ':crown:' : '#' + rankInfo.rank,
        '$USER$': '@' + rankInfo.slack_name,
        '$DIFF$': diffFromFirst == 0 ? '' : '(' + Number(diffFromFirst).toFixed(0) + ')'
    };
    var field = {
        'fallback': rb.response('$RANK$ - $USER$', replacements),
        'title': rb.response('$RANK$ - $USER$ $DIFF$', replacements),
        'title_link': 'http://localhost:5000/profile/' + rankInfo.player_id
    };
    if (rankInfo.rank === 1) {
        field.color = GOLD;
    } else if (rankInfo.rank === 2) {
        field.color = SILVER;
    } else if (rankInfo.rank === 3) {
        field.color = BRONZE;
    }

    if (isUser) {
        field.color = '#7CD197';
    }

    return field;
}

var getAllPlayersHandler = function(bot, message){
    LadderAPI.players.getAll(function(success, reason, players){
        if (success){
            bot.reply(message, 'Success:');
            var playerNames = [];
            for(var i = 0, len = players.length; i < len; i++){
                playerNames.push(players[i].player_id + ' (' + players[i].real_name + ')')
            }
            bot.reply(message, '```' + playerNames.join(', ') + '```')
        } else {
            bot.reply(message, 'Uh oh, something went wrong:\n ```' + reason + '```')
        }
    });
};

var getRankingsDebug = function(bot, message) {
    LadderAPI.rankings.getLatest(function(success, reason, data) {
        if (success) {
            var ranks = [];
            var rankings = data.rankings;
            for (var i = 0, len = rankings.length; i < len; i++) {
                ranks.push(rankings[i].player_id + ' - ' + rankings[i].rating);
            }
            bot.reply(message, 'Success:\n```' + ranks.join('\n') + '```');
        } else {
            bot.reply(message, 'Uh oh, something went wrong:\n ```' + reason + '```')
        }
    })
};

var getRankings = function(bot, message) {
    LadderAPI.rankings.getLatest(function(success, reason, data) {
        if (success) {
            var msg = {'attachments': []};
            var rankings = data.rankings;
            var joke = randInt(100) === 77;

            var topRating = 0;

            for (var i = 0, len = rankings.length; i < len; i++) {
                var rank = rankings[i];
                if (i == 0) {
                    topRating = rank.rating;
                }
                var isPlayer = rank.player_id === message.user;
                if (joke) {
                    rank.slack_name = 'sudowoodo :tada:';
                    msg.attachments.push(buildRankingField(rank, isPlayer, rank.rating - topRating));
                    break;
                }
                msg.attachments.push(buildRankingField(rank, isPlayer, rank.rating - topRating));
            }
            bot.reply(message, msg);
        } else {
            bot.reply(message, 'Uh oh, something went wrong:\n ```' + reason + '```')
        }
    });
};

var addPlayerManual = function(bot, message) {
    bot.api.users.info({user: utils.parser.user(message.match[1])}, function(err, response) {
        if (!err) {
            var user_data = {
                player_id: message.user,
                slack_name: response.user.name,
                real_name: response.user.profile.real_name,
                profile_picture: response.user.profile.image_512
            };

            LadderAPI.players.addOne(user_data, function(success, reason) {
                if (success) {
                    bot.reply(message, ':white_check_mark: Success.');
                } else {
                    if (reason === 'player_already_exists') {
                        bot.reply(message, ":x: Failure: Player already registered");
                    } else {
                        bot.reply(message, ":x: Failure: " + reason);
                    }
                }
            });
        } else {
            bot.reply(message, ':x: Something bad happened: ' + err);
        }
    })

};

var addPlayerChannelJoin = function(bot, message) {
    if (message.channelName === 'pingpong') {
        bot.startPrivateConversation(message, function(response, convo) {
            convo.say("Hey <@" + message.user +">! Welcome to <#" + message.channel +  ">...");

            LadderAPI.players.getOne(message.user, function(success, reason, data) {
                if (success) {
                    convo.say("Looks like you're already registered!");
                    convo.say("The leaderboard is on http://159.203.8.121:5000");
                    convo.say("Your user profile is on http://159.203.8.121:5000/profile/" + message.user);
                    convo.say("In the meantime, head on over to <#" + message.channel + ">!");
                } else {
                    convo.say("I'm gonna add you to the database. Sit tight!");
                    bot.api.users.info({user: message.user}, function(err, response) {
                        if (!err) {
                            var user_data = {
                                player_id: message.user,
                                slack_name: response.user.name,
                                real_name: response.user.profile.real_name,
                                profile_picture: response.user.profile.image_512
                            };

                            LadderAPI.players.addOne(user_data, function(success, reason) {
                                if (success) {
                                    convo.say("Sweet, it worked!");
                                    convo.say("The leaderboard is on http://159.203.8.121:5000");
                                    convo.say("Your user profile is http://159.203.8.121:5000/profile/" + message.user);
                                    convo.say("In the meantime, head on over to <#pingpong>!");
                                } else {
                                    if (reason === 'player_already_exists') {
                                        convo.say("Oops. Looks like you were already registered?");
                                    } else {
                                        convo.say("Oops. Something went wrong: " + reason);
                                    }
                                }
                            });
                        } else {
                            convo.say(':x: Something bad happened: ' + err);
                        }
                    });
                }
            });
        });
    }

};


var addMatchHandler = function(bot, message) {
    if (['pingpong', 'ping-pong', 'ladder'].indexOf(message.channelName) === -1 &&
        message.event !== 'direct_message') {
        bot.reply(message, ':x: Sorry, you can\'t do that here.');
        return;
    }
    var outcome = parseMatchOutcomes(message.match);
    if (!outcome.winner && !outcome.loser) {
        bot.reply(message, "Uhhh...I actually have no idea what you're talking about. I'm _stumped_.");
    } else {
        var matchData = {
            match_id: uuid.v4(),
            timestamp: new Date(),
            participants: [{
                player_id: utils.parser.user(outcome.winner),
                score: outcome.winningScore
            }, {
                player_id: utils.parser.user(outcome.loser),
                score: outcome.losingScore
            }],
            winner: utils.parser.user(outcome.winner)
        };

        var ack = addMatchRespAckGen(bot, message);
        var congrats = addMatchResultRemarkGen(outcome.winner, outcome.loser,
            outcome.winningScore - outcome.losingScore);
        var summary = addMatchResultsSummaryGen(outcome, congrats);

        bot.reply(message, ack);
        LadderAPI.matches.addOne(matchData, function(success, reason, data) {
            if (success) {
                bot.reply(message, summary);
            } else {
                var error = data;
                if (reason === 'player_not_found') {
                    error = 'Could not find one of the players in the database.'
                }
                bot.reply(message, 'Uhhh. Tried. Couldn\'t do it: ' + error);
            }
        });

    }

};

var recalculateRatings = function(bot, message) {
    bot.reply(message, ':robot_face: Recalculating...');
    LadderAPI.ratings.recalculateRatings(function(success, reason, data) {
        if (success) {
            bot.reply(message, ':white_check_mark: Recalculation success:');
            bot.reply(message, '> ' + data);
        } else {
            bot.reply(message, ':x: Recalculation failed:');
            bot.reply(message, '> ' + reason);
        }
    })
};

var matchAskHandler = function(bot, message) {
    LadderAPI.stats.getPlayerStats(message.user, function(success, reason, data) {
        if (success) {
            var matchUps = data.match_ups;
            if (matchUps.length > 0) {
                var randomInt = randInt(matchUps.length);
                var candidate = matchUps[randomInt];
                var proposal = rb.randomResponse([
                    'May I suggest, $USER$?',
                    'Why not $USER$? You have a $PERCENT$% chance to win..',
                    'How about $USER$? You guys haven\'t played since $LAST$',
                    'Hmm, what about $USER$? You\'ve won $NUM$ games against them!'
                ], {
                    '$USER$': bot.getRealName(candidate.opp_id),
                    '$PERCENT$': Number(candidate.pr_win_against * 100).toFixed(0),
                    '$NUM$': candidate.games_won_against,
                    '$LAST$': (new Date(candidate.last_played_against)).toDateString()
                });
                bot.reply(message, proposal)
            } else {
                bot.reply(message, 'Okay. :raised_hand:')
            }
        } else {
            bot.reply(message, 'Okay. :raised_hand:')
        }
    })
};

module.exports = {
    addMatch: addMatchHandler,
    addPlayerManual: addPlayerManual,
    addPlayerChannelJoin: addPlayerChannelJoin,
    getAllPlayers: getAllPlayersHandler,
    getRankingsDebug: getRankingsDebug,
    getRankings: getRankings,
    matchAsk: matchAskHandler,
    recalculateRatings: recalculateRatings
};
