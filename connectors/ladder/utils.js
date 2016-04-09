var request = require('request').defaults({'baseUrl': 'http://localhost:5000/api/v1'});

module.exports.request = {
  GET: function (endpoint, callback) {
    request.get(endpoint, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var parsedJson = JSON.parse(body),
          data = parsedJson.data,
          reason = parsedJson.error,
          status = parsedJson.status;

        callback(status, reason, data);
      }
    });
  }
}
