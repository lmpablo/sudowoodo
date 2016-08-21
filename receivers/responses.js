module.exports = {
    salutations: {
        neutral: ['Hey!', 'Hi!', 'Hello there!', 'Oh hey!', 'Hiya!', 'Why, hello!',
            'Bonjour!', 'Howdy!', 'Greetings!', 'Heeeello.', 'Hello!', 'Guten Tag',
            'Aloha', 'こんにちは', 'Hola', 'Ciao', 'Olá', '你好', '안녕하세요',
            'Waaaaaazzup', 'Wazzup', 'What\'s up', 'Whattup', 'Yo', 'Oi.',
            'Beep Boop :robot_face:', 'Hey $USER$!', 'Hi, $USER$!',
            'Oh hey $USER$!', 'Bonjour $USER$!', 'Howdy, $USER$!',
            '$USER$, greetings.', 'Guten Tag $USER$', 'Whattup $USER$'],
        annoyed: ['And you are?', '...What?', 'Why are you talking to me $USER$?',
            'Who gave you permission to -- ugh, nevermind.', 'What is it now?',
            'OMG WHAT??', '...$USER$. What?']
    },
    agree: {
        strong: ['Yeah!!!', 'For sure!', 'Definitely!', 'For sure, $USER$!', 'Oh yeah!', 'Of course!', 'No doubt!'],
        neutral: ['Yep!', 'Uh huh.', 'Got it.', 'Sure thing.', 'Yes sir!', 'Yeah.', 'Yeah!', 'Mhm.'],
        weak: ['Yeah, I guess...', 'Yeah, I think?', 'Sure, I guess...', 'Yeah...',
            'Well, I guess...', 'If you insist...']
    },
    disagree: {
        strong: ['No way!', 'No way, $USER$!', 'Nope!', 'Nuh-uh!', 'Nah!', 'Definitely not!', 'NO!',
            'Um, how about, NO!?', 'I don\'t think so?!', 'No EFFIN\' way, $USER$'],
        neutral: ['Nope.', 'Nah.', 'No.', 'Uh-uh.', 'I don\'t think so.'],
        weak: ['No...?', 'I guess not...', 'I don\'t think so, $USER$...']
    },
    acknowledgement: {
        strong: ['Of course!', 'Just for you, $USER$.', 'Copy that!', 'Copy that, $USER$!',
            'Roger that!', 'I hear ya, $USER$!', 'I gotchu, $USER$!'],
        neutral: ['Copy.', 'Copy that.', 'Loud and clear, $USER$.',
            'Affirmative.', 'I gotcha.', 'Beep Boop :robot_face:'],
        weak: ['Ya. k.', 'Kk.', 'Yeah k.', 'Mhm.', 'Yeah, yeah.']
    },
    hesitation: ['Maybe.', 'Probably.', 'Probably?', 'Perhaps...', 'I guess so?', 'I guess that\'s possible'],
    congratulations: {
        strong: ['NICE!', 'NICE, $USER$!', 'WOOHOO, $USER$!', 'SWEET!', 'OH MAN, $USER$!',
            'VERY. NICE.', 'VERY NICE $USER$!', 'GOOD JOB!', 'ALRIGHT, $USER$!', 'ALRIGHT!',
            'GODDAMN.', '$USER$. BRO.'],
        neutral: ['Very nice!', 'Congratulations!', 'Congratulations, $USER$!', 'Great, $USER$!',
            'Whoa!', 'Great!', 'Great job!', 'Great job, $USER$.', 'Good job!', 'Awesome!',
            'Awesome, $USER$!', 'Sweet!', 'Damn!', '~Daaamn, Daniel.~ \nI mean, Daaaamn, $USER$'],
        weak: ['That\'s...nice.', 'Yaay?', 'That\'s cool', 'Are you even trying, though?',
            'Not bad, $USER$. Not bad.', 'Lol, $USER$ :good_effort:',
            'Pretty good, I suppose.', 'Oh, cool.', 'Yay, you?', 'Oh. Okay.']
    },
    encouragement: {
        strong: ['You got this!', 'Come on $USER$!', 'Let\'s go $USER$!', 'Let\'s do this!',
            '$USER$! Listen to me. You got this.'],
        weak: ['Don\t hurt yourself', 'Maybe try harder?', 'Maybe, just try a little harder?',
            'Woo. You can do this. :face_with_rolling_eyes:']
    },
    replyTo: {
        thanks: ['No problem!', 'Anytime!', 'Anything for you, $USER$.',
            'No no no. Thank YOU.', 'Not a problem!', 'Sure thing!',
            'I gotchu, $USER$ :fist:'],
        aboutBot: ["I'm but a bot.", "I know you are, but what am I",
            "What did you just call me, $USER$?", "You rang?",
            "I think I heard someone say my name",
            "I don't go around asking what _you_ are, $USER$, so..."
        ],
        where: ["I'm right here.", 'Right behind you, $USER$', "There.", 'Over there.',
            'Hiding behind $RANDOM_OTHER$'],
        healthCheck: ['Alive and kicking.', 'I hear ya, loud and clear', 'Right here, bud.'],
        mean: [':(', 'wow. rude.', 'wow, rude af', ':cry:'],
        unknownQuestion: ["lol idk",
            "...:neutral_face:",
            "idk",
            '...Beep Boop? :robot_face:',
            "ERROR: idk how to answer your question lol :robot_face:",
            "yes. the answer is yes.\nwait. I wasn't listening.",
            "Well, you see, $USER$....",
            "Lemme think about that for a sec and I'll get back to you ;)",
            "Look, $USER$. I don't know what you want me to say.",
            "I don't know the answer to that yet. But when I do, I'll let you know."]
    },
    slackEmoji: {
      positve: [':+1:', ':grin:', ':grimacing:', ':grinning:',
          ':upside_down_face:', ':laughing:', ':slightly_smiling_face:',
          ':smile:'],
      negative: [':expressionless:', ':unamused:', ':flushed:',
          ':disappointed:', ':slightly_frowning_face:', ':white_frowning_face:',
          ':cry:']
    }
};
