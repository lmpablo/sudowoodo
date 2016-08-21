var os = require('os');
var rb = require('../response_builder.js');
var Responses = require('../responses.js');

var greetingCount = 0;
var meanCount = 0;

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = Number(uptime).toFixed(2) + ' ' + unit;
    return uptime;
}


var greet = function(bot, message) {
    greetingCount++;
    var responses;
    var remainingAnnoyedResponses = Responses.salutations.annoyed.reverse();

    if (greetingCount === 0) {
        remainingAnnoyedResponses = Responses.salutations.annoyed.reverse();
    }

    if (greetingCount < 3) {
        responses = Responses.salutations.neutral;
    }
    else {
        responses = [''];
        if (remainingAnnoyedResponses.length > 0) {
            responses = [remainingAnnoyedResponses.pop()];
        } else {
            greetingCount = -2;
        }
    }
    bot.reply(message, rb.randomResponse(responses, {
        '$USER$': bot.getRealName(message.user)
    }));
};

var aboutBot = function(bot, message) {
    bot.reply(message, rb.randomResponse(Responses.replyTo.aboutBot, {
        '$USER$': bot.getRealName(message.user)
    }));
};

var emoticon = function(bot, message) {
    var emoticonName = message.match[1];
    var response = '';
    switch (emoticonName) {
        case '+1':
            response = rb.randomResponse(Responses.slackEmoji.positive);
            break;
        case '-1':
            response = rb.randomResponse(Responses.slackEmoji.negative);
            break;
        case 'tada':
            response = rb.randomResponse([':tada:', ':raised_hands:', ':100:', ':beers:', ':beer:']);
            break;
        default:
            response = rb.maybeRespond([':smirk:', ':' + emoticonName + ':',
                ':' + emoticonName + '::' + emoticonName + ':',
                ':' + emoticonName + '::' + emoticonName + '::' + emoticonName + ':'], {},
                0.55)
    }
    bot.reply(message, response);
};

var favouriteTopic = function(bot, message, topic) {
    var responseSet = ["$WORD$ IS LIFE",
        "$WORD$ ROOLZ",
        "$WORD$ = :100:",
        "What is life without $WORD$?",
        "$WORD$ is possibly my most favourite thing on the planet."];
    bot.reply(message, rb.maybeRespond(responseSet, {
      '$WORD$': topic,
      '$USER$': bot.getRealName(message.user)
    }, 0.65));
};

var favouriteTopicHandler = function(bot, message) {
    favouriteTopic(bot, message, message.match[1]);
};

var replyToThanks = function(bot, message) {
    bot.reply(message, rb.randomResponse(Responses.replyTo.thanks))
};

var replyToGood = function(bot, message) {
    var match = message.match[1];
    var response = '';
    var replacements = {'$USER$': bot.getRealName(message.user)};
    switch (match) {
        case 'morning':
            response = rb.response('Top of the morning, $USER$', replacements);
            break;
        case 'day':
            response = rb.response('And a good day to you, too, $USER$', replacements);
            break;
        case 'afternoon':
            response = rb.response('Oh crap. It\'s afternoon already?');
            break;
        case 'evening':
            response = rb.response('Good evening, $USER$', replacements);
            break;
        case 'night':
            response = rb.response('A good night to you, too, $USER$', replacements);
            break;
        case 'job':
            response = rb.randomResponse([':grinning:', ':v:'], replacements);
            break;
        default:
            response = rb.randomResponse(Responses.emoticon.positive, replacements);
    }
    bot.reply(message, response);
};

var meanMessage = function(bot, message) {
    meanCount++;
    bot.reply(message, rb.randomResponse(Responses.replyTo.mean, {
        '$USER$': bot.getRealName(message.user)
    }));
};

var unknownQuestion = function(bot, message) {
    bot.reply(message, rb.randomResponse(Responses.replyTo.unknownQuestion, {
        '$USER$': bot.getRealName(message.user)
    }));
};

var unknownPersonQuestion = function(bot, message) {
    bot.reply(message, rb.randomResponse(["You, $USER$!",
        "I guess it's you, $USER$",
        "It's not always about you, $USER$",
        "Not sure who that is"
    ], {
        '$USER$': bot.getRealName(message.user)
    }));
};

var healthCheck = function(bot, message) {
    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message, rb.randomResponse(Responses.replyTo.healthCheck) + ' ' +
        '\nI have been running for ' + uptime + ' on ' + hostname + '.');
};

var help = function(bot, message) {
    var helpText;
    if (message.channelName === 'pingpong') {
         helpText = [
            '_(Pssst...For any of the commands that involve tagging me, putting ' +
            '`sudo` in front of it works just as well :grin:)_',
            '',
            '> To *add a match* between you and another person',
            '`@sudowoodo I beat @username` or `sudo I beat @username`',
            '',
            '> To *include the score* when adding a match:',
            '`@sudowoodo I beat @username 11-7`',
            '',
            '> To get the *current leaderboards*:',
            '`@sudowoodo list rankings` or `sudo show rankings`'
        ].join('\n');
    } else {
        helpText = rb.randomResponse(Responses.acknowledgement.weak);
    }

    bot.reply(message, helpText);
};

module.exports = {
    healthCheck: healthCheck,
    aboutBot: aboutBot,
    emoticon: emoticon,
    help: help,
    favouriteTopic: favouriteTopicHandler,
    greet: greet,
    replyToThanks: replyToThanks,
    replyToGood: replyToGood,
    meanMessage: meanMessage,
    unknownQuestion: unknownQuestion,
    unknownPersonQuestion: unknownPersonQuestion
};
