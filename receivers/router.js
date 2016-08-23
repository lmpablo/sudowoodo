var General = require('./general/index.js');
var Ladder = require('./ladder/index.js');
var LadderAPI = require('./ladder/api.js');
var Responses = require('./responses.js');
var rb = require('./response_builder.js');
var sentiment = require('sentiment');

// message type shortcuts
var AB = 'ambient',
    AT = 'mention',
    DN = 'direct_mention',
    DM = 'direct_message';

// Insert all pattern check and corresponding responses here.
// ORDER MATTERS!
module.exports = function(sudowoodo) {
    /**
     * Special functions
     */
    sudowoodo.middleware.receive.use(function(bot, message, next) {
        var senRes = sentiment(message.text);
        if (senRes.score <= -5) {
            bot.api.reactions.add({
                timestamp: message.ts,
                name: 'disappointed',
                channel: message.channel
            });
        } else if (senRes.score > 5) {
            bot.api.reactions.add({
                timestamp: message.ts,
                name: 'grin',
                channel: message.channel
            });
        }
        bot.api.channels.info({channel: message.channel}, function(err, response) {
            if(!err) {
                message.channelName = response.channel.name;
            }
            next();
        });
    });
    sudowoodo.hears('sudo health check', [DM, AB], General.healthCheck);
    sudowoodo.hears('health check', [DN, AT, DM], General.healthCheck);
    sudowoodo.hears('sudo help', [AB, DM], General.help);
    sudowoodo.hears('^help', [AT, DN, DM], General.help);

    /**
     * General functions
     */
    sudowoodo.hears('^(hello|hey|yo$|hi|howdy|bonjour|hallo|hullo)( sudowoodo)?',
        [DM, DN, AT], General.greet);
    sudowoodo.hears("(?:who|what)(?: is|'s)(?: a)?(?: sudowoodo)?",
        [AT, AB], General.aboutBot);
    sudowoodo.hears('^good (\\w+)( sudowoodo)?',
        [AT, DN, DM], General.replyToGood);
    sudowoodo.hears(['no thanks', '^no$', '^nevermind'],
        [AT, DN], function(bot, message) {
            bot.reply(message, ':(');
        });
    sudowoodo.hears(['thanks', 'thank you', '^ty ', 'tyvm'],
        [DN, AT, DM], General.replyToThanks);
    sudowoodo.hears(["don't like you", "hate you", "do not like you", "f.ck you", "screw you"],
        [DN, AT, DM], General.meanMessage);
    sudowoodo.hears(['ping pong', 'pingpong', 'ping-pong', 'roti'],
        [AB, AT, DN], General.favouriteTopic);
    sudowoodo.hears(['meaning of life'],
        [AT, DN, DM], function(bot, message) {
            bot.reply(message, rb.randomResponse(['pingpong', '42',
                rb.maybeRespond(['Does everything need to have a meaning?'], {}, 0.95)]));
    });

    /**
     * Ladder-specific functions
     */
    var recalculatePattern = '(force )?recalculate (rankings|ratings|matches)';
    var matchRecordPattern = '(\\S+) (beat|lost to|won against|was beaten by) (\\S+)(?:.* (\\d+)[:|-](\\d+))?';

    sudowoodo.hears('sudo get all players',
        [DM, AB], Ladder.getAllPlayers);
    sudowoodo.hears('sudo get rankings',
        [DM, AB], Ladder.getRankingsDebug);
    sudowoodo.hears('sudo add (\\S+)',
        [DM, AB], Ladder.addPlayerManual);

    sudowoodo.on('user_channel_join', Ladder.addPlayerChannelJoin);

    sudowoodo.hears('sudo ' + recalculatePattern,
        [DM, AB], Ladder.recalculateRatings);
    sudowoodo.hears(recalculatePattern,
        [DN, AT, DM], Ladder.recalculateRatings);

    sudowoodo.hears('sudo ' + matchRecordPattern,
        [DM, AB], Ladder.addMatch);
    sudowoodo.hears(matchRecordPattern,
        [DN, AT, DM], Ladder.addMatch);

    sudowoodo.hears('sudo (list|show) (rankings|rankings|leaderboard)',
        [DM, AB], Ladder.getRankings);
    sudowoodo.hears('(list|show) (rankings|rankings|leaderboard)',
        [DN, AT, DM], Ladder.getRankings);

    sudowoodo.hears([':table_tennis_paddle_and_ball:.*\\?', 'game.*?'],
        [AB], Ladder.matchAsk);

    sudowoodo.hears('^sudo make me a (\\S+)',
        [AB, DM, DN, AT], function(bot, message) {
            bot.reply(message, rb.randomResponse(Responses.disagree.neutral))
        });
    sudowoodo.hears('sudo echo ["|\'|“]?(.*)["|”]?\\b',
        [DM, AB, AT], function(bot, message) {
            bot.reply(message, message.match[1]);
        });
    sudowoodo.hears('^sudo (.*)',
        [DM, AB, DN, AT], function(bot, message){
            var response = 'Unknown command `' + message.match[1] +
                '`\nThis instance will be reported.';
            bot.reply(message, response);
        });

    /**
     * Catch-call patterns
     */
    sudowoodo.hears(":(\\S+):",
        [DM, AB, AT, DN], General.emoticon);
    sudowoodo.hears(['^who'],
        [DN, AT, DM], General.unknownPersonQuestion);
    sudowoodo.hears(["\\?", '^what', '^why', '^where', '^how', '^who'],
        [DN, AT, DM], General.unknownQuestion)
};
