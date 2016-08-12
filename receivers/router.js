var General = require('./general/index.js');

// message type shortcuts
var AB = 'ambient',
    AT = 'mention',
    DN = 'direct_mention',
    DM = 'direct_message';

var meanCount = 0;

// Insert all pattern check and corresponding responses here.
// ORDER MATTERS!
module.exports = function(sudowoodo) {
    sudowoodo.hears('(testing(?: )?)+',
        [DM], function(bot, message){
            bot.reply(message, 'I hear ya, loud and clear!')
        });
    sudowoodo.hears(["don't like you", "hate you", "do not like you", "f.ck you", "screw you"],
        [DN, AT, DM], function(bot, message) {
            meanCount++;
            // do something with the count
            General.meanMessage(bot, message);
        });

    // Catch-all patterns
    sudowoodo.hears(":(\\S+):",
        [DM, AB, AT, DN], General.emoticon);
    sudowoodo.hears(['^who'],
        [DN, AT, DM], General.unknownPersonQuestion);
    sudowoodo.hears(["\\?", '^what', '^why', '^where', '^how', '^who'],
        [DN, AT, DM], General.unknownQuestion)
};
