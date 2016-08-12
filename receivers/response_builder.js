var randomInt = function(length){
    return Math.floor(Math.random() * length);
};

var ResponseBuilder = function() {};

ResponseBuilder.prototype.randomResponse = function(responseSet, varMap){
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

    var withReplacements = finalSet[randomInt(finalSet.length)];
    // TODO: check for replacement sources and targets; If there are sources, but no targets, replace them with blanks
    for (var source in varMap) {
        withReplacements = withReplacements.replace(source, varMap[source]);
    }
    return withReplacements;
};

ResponseBuilder.prototype.maybeRespond = function(responseSet, varMap, _t) {
    var threshold = 0.5;
    if (typeof _t !== 'undefined') {
        threshold = _t;
    }
    var rand = Math.random();
    return rand >= threshold ? this.randomResponse(responseSet, varMap) : '';
};

module.exports = ResponseBuilder;
