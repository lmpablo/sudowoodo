var defaults = {'baseUrl': 'http://localhost:5000/api/v2'};
var request = require('request').defaults(defaults);
var utils = require('./utils.js');

var getAllPlayers = function(cb) {
    utils.request.GET('/players', function(status, reason, data){
        cb(status === 'success', reason, data.players);
    }, function(status, reason, data){
        cb(status === 'success', reason, []);
    })
};

var getOnePlayer = function(playerID, cb) {
    utils.request.GET('/players/' + playerID, function(status, reason, data){
        cb(status === 'success', reason, data);
    }, function(status, reason, data){
        cb(status === 'success', reason, {});
    });
};

var addOnePlayer = function(playerInfo, cb) {
    utils.request.POST('/players', playerInfo, function(status, reason, data){
        cb(status === 'success', reason, data);
    }, function(status, reason, data) {
        cb(status === 'success', reason, {});
    });
};

var addOneMatch = function(matchInfo, cb) {
    utils.request.POST('/matches', matchInfo, function(status, reason, data){
        cb(status === 'success', reason, data);
    }, function(status, reason, data) {
        cb(status === 'success', reason, data);
    });
};

var forceRecalculate = function(cb) {
    utils.request.PUT('/ratings', '', function(status, reason, data) {
        cb(status === 'success', reason, data);
    }, function(status, reason) {
        cb(status === 'success', reason);
    });
};

var getLatestRankings = function(cb) {
    utils.request.GET('/rankings', function(status, reason, data) {
        cb(status === 'success', reason, data);
    }, function(status, reason, data) {
        cb(status === 'success', reason, {});
    });
};

var getPlayerStats = function(playerID, cb) {
    utils.request.GET('/players/' + playerID + '/stats', function(status, reason, data) {
        cb(status === 'success', reason, data);
    }, function(status, reason, data) {
        cb(status === 'success', reason, {});
    });
};


module.exports = {
    players: {
        getAll: getAllPlayers,
        getOne: getOnePlayer,
        addOne: addOnePlayer
    },
    matches: {
        addOne: addOneMatch
    },
    ratings: {
        recalculateRatings: forceRecalculate
    },
    rankings: {
        getLatest: getLatestRankings
    },
    stats: {
        getPlayerStats: getPlayerStats
    }
};
