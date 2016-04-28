var randomResponse = function (responseSet, user) {
  var finalSet = []
  user = user || '';
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
  return finalSet[Math.floor(Math.random() * finalSet.length)].replace("$USER$", user[0] == "U" ? "<@" +  user + ">" : user);
}

var maybeRespond = function (responseSet, thresholdYes) {
  var threshold = thresholdYes || 0.5;
  var rand = Math.random()
  return rand > threshold ? randomResponse(responseSet) : '';
}

module.exports.responses = {
  agree: {
    strong: ['Yeah!!!', 'For sure!', 'Definitely!', 'Oh yeah!', 'Of course!', 'No doubt!', 'Gotcha!'],
    neutral: ['Yep!', 'Uh huh.', 'Got it.', 'Sure thing.', 'Yes sir!', 'Yeah.', 'Yeah!', 'Mhm.'],
    weak: ['Yeah, I guess...', 'Yeah, I think?', 'Sure, I guess...', 'Yeah...', 'Well, I guess...']
  },
  disagree: {
    strong: ['No way!', 'Nope!', 'Nuh-uh!', 'Nah!', 'Definitely not!', 'NO!'],
    neutral: ['Nope.', 'Nah.', 'No.', 'Uh-uh.'],
    weak: ['No...?', 'I guess not...', 'I don\'t think so...']
  },
  confirmation: ['Yep. Got it.', 'Got it!', 'Ahh. Gotcha.', 'Gotcha.', 'Alright!'],
  hesitation: ['Maybe.', 'Probably.', 'Probably?', 'Perhaps...', 'I guess so?', 'I guess that\'s possible'],
  congratulations: {
    strong: ['NICE!', 'WOOHOO!', 'SWEET!', 'VERY. NICE.', 'VERY NICE!', 'GOOD JOB!', 'ALRIGHT!', 'GODDAMN.'],
    neutral: ['Very nice!', 'Congratulations!', 'Whoa!', 'Great!', 'Great job!', 'Good job!', 'Awesome!', 'Sweet!', 'Damn!'],
    weak: ['That\'s...nice.', 'Yaay?', 'That\'s cool', 'Not bad, $USER$. Not bad.', 'Pretty good, I suppose.', 'Oh, cool.', 'Yay, you?', 'Oh. Okay.']
  },
  encouragement: {
    strong: ['You got this!', 'Come on $USER$!', 'Let\'s go $USER$!', 'Let\'s do this!'],
    weak: ['Don\t hurt yourself', 'Maybe try harder?', 'Maybe, just try a little harder?', 'Are you even trying, though?', 'Woo. You can do this.']
  },
  salutation: {
    neutral: ['Hey!', 'Hey $USER$', 'Hi!', 'Hello there!', 'Oh hey!', 'Hiya!', 'Why, hello!', 'Bonjour!', 'Howdy!', 'Greetings!', 'Heeeello.', 'Hello!', 'Guten Tag $USER$', 'Aloha', 'こんにちは', 'Hola', '你好', '안녕하세요'],
    annoyed: ['And you are?', 'Why are you talking to me $USER$?', 'Who gave you permission to -- ugh, nevermind.', 'What is it now?', 'OMG WHAT??', '$USER$. What?']
  },
  replyTo: {
    thanks: ['No problem!', 'Anytime!', 'Anything for you, $USER$.', 'No no no. Thank YOU.', 'Not a problem!', 'Sure thing!', 'I gotchu, $USER$ :fist:']
  }
}

module.exports.randomResponse = randomResponse
module.exports.maybeRespond = maybeRespond
