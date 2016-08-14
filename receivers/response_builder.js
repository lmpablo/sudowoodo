var randomInt = function(length){
    return Math.floor(Math.random() * length);
};

var response = function(message, varMap) {
    var messageCopy = message;
    // TODO: check for replacement sources and targets; If there are sources, but no targets, replace them with blanks
    for (var source in varMap) {
        if (varMap.hasOwnProperty(source)){
            messageCopy = messageCopy.replace(source, varMap[source]);
        }
    }

    return messageCopy;
};

var randomResponse = function(responseSet, varMap){
    var finalSet = [];
    if (Object.prototype.toString.call(responseSet) === '[object Array]') {
        finalSet = responseSet;
    } else if (Object.prototype.toString.call(responseSet) === '[object Object]' ) {
        var keys = Object.keys(responseSet);
        for (var i = 0, len = keys.length; i < len; i++) {
            for (var j = 0, len2 = responseSet[keys[i]].length; j < len2; j++) {
                finalSet.push(responseSet[keys[i]][j])
            }
        }
    }

    var finalResponse = finalSet[randomInt(finalSet.length)];
    return this.response(finalResponse, varMap);
};

var maybeRespond = function(responseSet, varMap, _t) {
    var threshold = 0.5 * 100;
    if (typeof _t !== 'undefined') {
        threshold = _t * 100;
    }
    var rand = randomInt(101);
    return rand >= threshold ? this.randomResponse(responseSet, varMap) : '';
};

module.exports = {
    response: response,
    randomResponse: randomResponse,
    maybeRespond: maybeRespond
};
