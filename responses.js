module.exports.randomResponse = function (responseSet) {
  var finalSet = []
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
  return finalSet[Math.floor(Math.random() * finalSet.length)];
}

module.exports.responses = {
  agree: {
    'strong': ['Yeah!!!', 'For sure!', 'Definitely!', 'Oh yeah!', 'Of course!', 'No doubt!', 'Gotcha!'],
    neutral: ['Yep!', 'Uh huh.', 'Got it.', 'Sure thing.', 'Yes sir!', 'Yeah.', 'Yeah!', 'Mhm.'],
    weak: ['Yeah, I guess...', 'Yeah, I think?', 'Sure, I guess...', 'Yeah...', 'Well, I guess...']
  },
  disagree: {
    strong: ['No way!', 'Nope!', 'Nuh-uh!', 'Nah!', 'Definitely not!', 'NO!'],
    neutral: ['Nope.', 'Nah.', 'No.', 'Uh-uh.'],
    weak: ['No...?', 'I guess not...', 'I don\'t think so...']
  },
  hesitation: ['Maybe.', 'Probably.', 'Probably?', 'Perhaps...', 'I guess so?', 'I guess that\'s possible'],
  congratulations: {
    strong: ['NICE!', 'WOOHOO!', 'SWEET!', 'VERY. NICE.', 'VERY NICE!', 'GOOD JOB!', 'ALRIGHT!'],
    neutral: ['Very nice!', 'Congratulations!', 'Whoa!', 'Great!', 'Great job!', 'Good job!', 'Awesome!', 'Sweet!'],
    weak: ['That\'s...nice.', 'Yaay?', 'That\'s cool', 'Not bad.', 'Pretty good, I suppose.', 'Oh, cool.', 'Yay, you?']
  },
  encouragement: {
    strong: ['You got this!', 'Come on!', 'Let\'s go!', 'Let\'s do this!'],
    weak: ['Don\t hurt yourself', 'Maybe try harder?', 'Maybe, just try a little harder?', 'Are you even trying, though?', 'Woo. You can do this.']
  },
  salutation: {
    neutral: ['Hey!', 'Hi!', 'Hello there!', 'Oh hey!', 'Hiya!', 'Why, hello!', 'Bonjour!', 'Howdy!', 'Greetings!', 'Heeeello.', 'Hello!'],
    annoyed: ['And you are?', 'Why are you talking to me?', 'Who gave you permission to -- ugh, nevermind.', 'What is it now?', 'OMG WHAT??']
  }
}
