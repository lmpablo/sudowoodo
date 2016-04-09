utils = require('./utils.js')

module.exports = {
  players: {
    getAll: function(bot, message) {
      bot.reply(message, "get all players")
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
            messageString += ("[" + rankings[i].rank + "] " + rankings[i].player_id + " (" + rankings[i].rating.toFixed(1)  + ")\n")
          }

          bot.reply(message, messageString);
      });
    }
  }
}
