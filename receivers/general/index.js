var ResponseBuilder = require('../response_builder.js');
var Responses = require('../responses.js');
var rb = new ResponseBuilder();

var emoticon = function(bot, message) {
    var emoticonName = message.match[1];
    var response = '';
    switch (emoticonName) {
        case '+1':
            response = rb.randomResponse([':+1:', ':grin:', ':grimacing:', ':grinning:',
                ':upside_down_face:', ':laughing:', ':slightly_smiling_face:', ':smile:']);
            break;
        case '-1':
            response = rb.randomResponse([':expressionless:', ':unamused:', ':flushed:',
                ':disappointed:', ':slightly_frowning_face:', ':white_frowning_face:',
                ':cry:']);
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
    bot.reply(message, response)
};

var meanMessage = function(bot, message) {
    bot.reply(message, rb.randomResponse(Responses.replyTo.mean, {
        '$USER$': '<@' + message.user + '>'
    }))
};

var unknownQuestion = function(bot, message) {
    bot.reply(message, rb.randomResponse(Responses.replyTo.unknownQuestion, {
        '$USER$': '<@' + message.user + '>'
    }))
};

var unknownPersonQuestion = function(bot, message) {
    bot.reply(message, rb.randomResponse(["You, $USER$!",
        "I guess it's you, $USER$",
        "It's not always about you, $USER$",
        "Not sure who that is"
    ], {
        '$USER$': '<@' + message.user + '>'
    }))
};

module.exports = {
    emoticon: emoticon,
    meanMessage: meanMessage,
    unknownQuestion: unknownQuestion,
    unknownPersonQuestion: unknownPersonQuestion
};
