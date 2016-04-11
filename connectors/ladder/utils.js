var request = require('request').defaults({'baseUrl': 'http://localhost:5000/api/v1'});

module.exports.parser = {
  user: function(userString) {
    var pattern = /<@(\w+)>/;
    var result = userString.match(pattern);

    if (result && result.length > 1) { return result[1]; }
    else { return null; }
  }
}

module.exports.formatter = {
  player: function(p) {
    return "<@%PLAYER_ID%>: %RATING% (%K_FACTOR%) - %LAST_GAME_PLAYED% - %NUM_GAMES_PLAYED% games"
      .replace("%PLAYER_ID%", p.player_id)
      .replace("%RATING%", p.rating)
      .replace("%K_FACTOR%", p.k_factor)
      .replace("%LAST_GAME_PLAYED%", p.last_game_played ? new Date(p.last_game_played) : "UNRANKED")
      .replace("%NUM_GAMES_PLAYED%", p.num_games_played) + "\n"
  },
  ranking: function(r) {
    return "[%RANK%] <@%PLAYER_ID%> (%RATING%)"
      .replace("%RANK%", r.rank)
      .replace("%PLAYER_ID%", r.player_id)
      .replace("%RATING%", r.rating.toFixed(1)) + "\n"
  }
}

module.exports.request = {
  GET: function (endpoint, callback, errorCallback) {
    request({
      method: 'get',
      url: endpoint,
      json: true
    }, function (error, response, body) {
      var d = body.data,
        r = body.reason,
        s = body.status;
      if (!error && response.statusCode == 200) { callback(s, r, d); }
      else { errorCallback(s, r, d); }
    });
  },
  POST: function(endpoint, data, callback, errorCallback) {
    request({
      method: 'post',
      url: endpoint,
      body: data,
      json: true
    }, function (error, response, body) {
      var d = body.data,
        r = body.reason,
        s = body.status;
      if (!error && response.statusCode == 200) { callback(s, r, d); }
      else { errorCallback(s, r, d); }
    });
  }
}
