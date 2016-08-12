module.exports = function(controller) {
  controller.hears('(testing(?: )?)+', ['direct_message'], function(bot, message){
    bot.reply(message, 'I hear ya, loud and clear!')
  })

}
