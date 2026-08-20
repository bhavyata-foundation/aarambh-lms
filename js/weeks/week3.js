/* ============================================================
   WEEK 3 — "Emotions and Feelings" (Term 1, 29 Jun-3 Jul 2026)

   Requires js/weeks/weeks-core.js loaded first (see index.html).
   Same pattern as week1.js/week2.js — copy this whole file's
   structure for any future week.
   ============================================================ */

WEEK_DAY_TOPICS.wk3 = {
  mon:{value:'Explore how happy feels', link:'Feeling: Happy'},
  tue:{value:'Notice when we feel sad', link:'Feeling: Sad'},
  wed:{value:'Talk about feeling angry or scared', link:'Feeling: Angry / Scared'},
  thu:{value:'Practise calming down when upset', link:'Feeling: Calm'},
  fri:{value:'Show kindness to others', link:'Feeling: Kindness'}
};

WEEKLY_PLAN.wk3 = {
  welcome:  {mon:'Feeling cards free play', tue:'Hygiene check and calm start', wed:'Attendance with feeling check', thu:'Mirror face play', fri:'Weather and mood talk'},
  story:    {mon:'Story: I Feel Happy', tue:'Rhyme: If You\u2019re Happy', wed:'Story: When I Feel Sad', thu:'Story: Calm Down Little Child', fri:'Story: Kind Words Help'},
  numeracy: {mon:'Match happy and sad faces', tue:'Sort happy/sad/angry/scared faces', wed:'Count feeling faces', thu:'Match situation with feeling', fri:'Feelings sorting recap'},
  language: {mon:'Words: happy, sad', tue:'Words: angry, scared', wed:'Sentence: "I feel ___."', thu:'Sentence: "I am calm."', fri:'Feeling sentence recap'},
  create:   {mon:'Happy-sad face colouring', tue:'Emotion face matching', wed:'Draw my feeling face', thu:'Situation-feeling worksheet', fri:'My feelings card'},
  outdoor:  {mon:'Happy-sad action walk', tue:'Emotion freeze game', wed:'Feeling circle game', thu:'Calm breathing with stretch', fri:'Kindness movement game'},
  reflect:  {mon:'Name one feeling', tue:'Show one feeling face', wed:'Say "I feel ___."', thu:'Say "I am calm."', fri:'Share one kind action'}
};

ACTIVITY_COMPETENCIES.wk3 = {
  welcome: {
    mon:'Explores feeling cards through free play', tue:'Checks personal hygiene and begins the day calmly',
    wed:'Participates in attendance and names a feeling', thu:'Uses a mirror to explore facial expressions',
    fri:'Connects weather to mood'
  },
  story: {
    mon:'Listens to a story about feeling happy', tue:'Joins a rhyme about happiness',
    wed:'Listens to a story about feeling sad', thu:'Listens to a story about calming down',
    fri:'Listens to a story about kind words'
  },
  numeracy: {
    mon:'Matches happy and sad faces', tue:'Sorts faces by four basic feelings',
    wed:'Counts feeling faces', thu:'Matches a situation to the feeling it causes',
    fri:'Recaps sorting feelings'
  },
  language: {
    mon:'Learns the words happy and sad', tue:'Learns the words angry and scared',
    wed:'Completes the sentence "I feel ___."', thu:'Completes the sentence "I am calm."',
    fri:'Recaps feeling sentences'
  },
  create: {
    mon:'Colours happy and sad faces', tue:'Matches emotion faces to their names',
    wed:'Draws their own feeling face', thu:'Completes a situation-feeling worksheet',
    fri:'Makes a feelings card'
  },
  outdoor: {
    mon:'Walks while acting out happy and sad', tue:'Plays an emotion freeze game',
    wed:'Plays a feeling circle game', thu:'Practises calm breathing with a stretch',
    fri:'Plays a kindness movement game'
  },
  reflect: {
    mon:'Names one feeling', tue:'Shows one feeling face',
    wed:'Says "I feel ___."', thu:'Says "I am calm."',
    fri:'Shares one kind action'
  }
};

weeksWithContent.push(3);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES — 7 tracked domains x 5 days = 35 activities.
// Deliberately varied activity types across the week within each
// domain (not the same game repeated 5x) — same discipline as
// week1.js/week2.js. Includes maze, sorting, counting (via
// complete-pattern) and tick/true-false throughout, as requested.
// See activity-renderers.js for what each "type" needs.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk3 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the feeling cards to see how each face feels!',
        hotspots: [
          {emoji:'\ud83d\ude0a', label:'Happy face'},
          {emoji:'\ud83d\ude22', label:'Sad face'},
          {emoji:'\ud83d\ude20', label:'Angry face'},
          {emoji:'\ud83d\ude28', label:'Scared face'}
        ]
      },
      tue: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\uddfc', text:'Washing our hands helps us start the day calm.', isTrue:true},
          {emoji:'\ud83d\ude21', text:'Shouting is the best way to start the day.', isTrue:false}
        ]
      },
      wed: {
        type: 'spot-difference',
        instruction: 'It\u2019s attendance time! Tap the feeling face in the second row that\u2019s different.',
        rowA: ['\ud83d\ude0a','\ud83d\ude0a','\ud83d\ude0a','\ud83d\ude0a'],
        rowB: ['\ud83d\ude0a','\ud83d\ude22','\ud83d\ude0a','\ud83d\ude0a'],
        differentIndex: 1
      },
      thu: {
        type: 'tap-explore',
        instruction: 'Look in the mirror! Tap each part of your face as you make a feeling.',
        hotspots: [
          {emoji:'\ud83d\udc40', label:'Eyes'},
          {emoji:'\ud83d\udc44', label:'Mouth'},
          {emoji:'\ud83e\udd28', label:'Eyebrows'},
          {emoji:'\ud83d\ude0a', label:'Whole face'}
        ]
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort the weather and mood pictures into the right basket!',
        items: [
          {key:'sun', emoji:'\u2600\ufe0f'},
          {key:'smile', emoji:'\ud83d\ude0a'},
          {key:'rain', emoji:'\ud83c\udf27\ufe0f'},
          {key:'sad', emoji:'\ud83d\ude22'}
        ],
        baskets: [
          {emoji:'\ud83d\ude0a', label:'Happy mood', accepts:['sun','smile']},
          {emoji:'\ud83d\ude22', label:'Gloomy mood', accepts:['rain','sad']}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the happy story, in order!',
        sequence: [
          {emoji:'\ud83d\ude0a', label:'Feel happy'},
          {emoji:'\ud83d\ude4c', label:'Cheer'},
          {emoji:'\ud83d\udc83', label:'Dance'},
          {emoji:'\ud83d\ude04', label:'Smile big'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'If you\u2019re happy, clap your hands! What comes next in the rhyme?',
        pattern: ['\ud83d\udc4f','\ud83d\udc4f','\ud83e\uddb6','\ud83d\udc4f'],
        options: ['\ud83d\udc4f','\ud83d\ude22','\ud83e\udd1a'],
        answer: '\ud83d\udc4f'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each story moment to how it made the character feel!',
        pairs: [
          {leftEmoji:'\ud83e\uddf8', left:'Lost a toy', right:'Sad', rightEmoji:'\ud83d\udca7'},
          {leftEmoji:'\ud83e\udd17', left:'Got a hug', right:'Better', rightEmoji:'\ud83d\ude0a'},
          {leftEmoji:'\ud83d\ude0c', left:'Took deep breaths', right:'Calm', rightEmoji:'\ud83c\udf43'}
        ]
      },
      thu: {
        type: 'maze',
        instruction: 'Help the little child walk the calm-down path, one step at a time!',
        path: [
          {emoji:'\ud83d\ude2e\u200d\ud83d\udca8'},
          {emoji:'\ud83e\uddd8'},
          {emoji:'\ud83d\ude0c'},
          {emoji:'\ud83d\ude0a'}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83d\udc9b', text:'Kind words can help a friend feel better.', isTrue:true},
          {emoji:'\ud83d\udc9b', text:'Being unkind makes everyone happy.', isTrue:false}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'match-pairs',
        instruction: 'Match each face to the correct feeling word!',
        pairs: [
          {leftEmoji:'\ud83d\ude0a', left:'Happy face', right:'Happy', rightEmoji:'\u2728'},
          {leftEmoji:'\ud83d\ude22', left:'Sad face', right:'Sad', rightEmoji:'\ud83d\udca7'},
          {leftEmoji:'\ud83d\ude20', left:'Angry face', right:'Angry', rightEmoji:'\ud83d\udd25'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each face into the correct feeling basket!',
        items: [
          {key:'h1', emoji:'\ud83d\ude0a'},
          {key:'s1', emoji:'\ud83d\ude22'},
          {key:'a1', emoji:'\ud83d\ude20'},
          {key:'sc1', emoji:'\ud83d\ude28'}
        ],
        baskets: [
          {emoji:'\ud83d\ude0a', label:'Happy / Sad', accepts:['h1','s1']},
          {emoji:'\ud83d\ude20', label:'Angry / Scared', accepts:['a1','sc1']}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'Count along with the pattern \u2014 how many feeling faces come next?',
        pattern: ['\ud83d\ude0a','\ud83d\ude0a\ud83d\ude0a','\ud83d\ude0a\ud83d\ude0a\ud83d\ude0a'],
        options: ['\ud83d\ude0a\ud83d\ude0a\ud83d\ude0a\ud83d\ude0a','\ud83d\ude0a\ud83d\ude0a','\ud83d\ude0a'],
        answer: '\ud83d\ude0a\ud83d\ude0a\ud83d\ude0a\ud83d\ude0a'
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag each situation to the feeling it matches!',
        items: [
          {key:'gift', emoji:'\ud83c\udf81'},
          {key:'rain', emoji:'\ud83c\udf27\ufe0f'}
        ],
        destinations: [
          {emoji:'\ud83d\ude0a', label:'Happy', accepts:['gift']},
          {emoji:'\ud83d\ude22', label:'Sad', accepts:['rain']}
        ]
      },
      fri: {
        type: 'spot-difference',
        instruction: 'Look at both rows of sorted faces \u2014 tap the one that\u2019s different in the second row!',
        rowA: ['\ud83d\ude0a','\ud83d\ude22','\ud83d\ude20','\ud83d\ude28'],
        rowB: ['\ud83d\ude0a','\ud83d\ude22','\ud83d\ude28','\ud83d\ude28'],
        differentIndex: 2
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'match-pairs',
        instruction: 'Match each word to the correct face!',
        pairs: [
          {leftEmoji:'\ud83d\ude0a', left:'happy', right:'Feels good', rightEmoji:'\u2728'},
          {leftEmoji:'\ud83d\ude22', left:'sad', right:'Feels down', rightEmoji:'\ud83d\udca7'}
        ]
      },
      tue: {
        type: 'drag-drop',
        instruction: 'Drag each word onto the face it describes!',
        items: [
          {key:'angry', emoji:'\ud83d\ude20'},
          {key:'scared', emoji:'\ud83d\ude28'}
        ],
        destinations: [
          {emoji:'\ud83d\ude20', label:'Angry', accepts:['angry']},
          {emoji:'\ud83d\ude28', label:'Scared', accepts:['scared']}
        ]
      },
      wed: {
        type: 'complete-sentence', prefix:'I feel', answer:'happy', wrong:['table','shoe'], emoji:'\ud83d\ude0a'
      },
      thu: {
        type: 'complete-sentence', prefix:'I am', answer:'calm', wrong:['loud','fast'], emoji:'\ud83d\ude0c'
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83d\udde3\ufe0f', text:'Saying "I feel sad" is one way to share your feelings.', isTrue:true},
          {emoji:'\ud83e\udd10', text:'We should never tell anyone how we feel.', isTrue:false}
        ]
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in the happy and sad faces!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4','#FAC775'],
        regions: [
          {emoji:'\ud83d\ude0a', label:'Happy face'},
          {emoji:'\ud83d\ude22', label:'Sad face'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each emotion face to its name before you colour it!',
        pairs: [
          {leftEmoji:'\ud83d\ude20', left:'Angry', right:'Fists clenched', rightEmoji:'\u270a'},
          {leftEmoji:'\ud83d\ude28', left:'Scared', right:'Eyes wide', rightEmoji:'\ud83d\udc40'}
        ]
      },
      wed: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then draw and colour your own feeling face!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4','#FAC775','#ED93B1'],
        regions: [
          {emoji:'\ud83d\ude00', label:'Mouth'},
          {emoji:'\ud83d\udc40', label:'Eyes'},
          {emoji:'\ud83e\udd28', label:'Eyebrows'}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each situation card by how it would make you feel!',
        items: [
          {key:'party', emoji:'\ud83c\udf89'},
          {key:'brokenToy', emoji:'\ud83e\uddf8'},
          {key:'newFriend', emoji:'\ud83e\udd1d'},
          {key:'lostBalloon', emoji:'\ud83c\udf88'}
        ],
        baskets: [
          {emoji:'\ud83d\ude0a', label:'Happy', accepts:['party','newFriend']},
          {emoji:'\ud83d\ude22', label:'Sad', accepts:['brokenToy','lostBalloon']}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'What colour comes next in the pattern on your feelings card?',
        pattern: ['\ud83d\udfe1','\ud83d\udd35','\ud83d\udfe1','\ud83d\udd35'],
        options: ['\ud83d\udfe1','\ud83d\udd34','\ud83d\udfe2'],
        answer: '\ud83d\udfe1'
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'step-count-find',
        instruction: 'Take five happy steps, then find something that makes you smile!',
        targetSteps: 5,
        findEmoji: '\ud83e\uddf8',
        findLabel: 'teddy bear'
      },
      tue: {
        type: 'jump-direction',
        instruction: 'Jump five times for the freeze game, then point which way your friend is feeling!',
        targetJumps: 5,
        soundEmoji: '\ud83d\ude32',
        directions: [
          {arrow:'\u2b05\ufe0f', correct:false},
          {arrow:'\u27a1\ufe0f', correct:true},
          {arrow:'\u2b06\ufe0f', correct:false}
        ]
      },
      wed: {
        type: 'maze',
        instruction: 'Walk the feelings circle, one step at a time!',
        path: [
          {emoji:'\ud83d\ude0a'},
          {emoji:'\ud83d\ude22'},
          {emoji:'\ud83d\ude20'},
          {emoji:'\ud83d\ude0c'}
        ]
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83c\udf2c\ufe0f', text:'Taking deep breaths can help us feel calm.', isTrue:true},
          {emoji:'\ud83c\udfc3', text:'Running very fast is the only way to calm down.', isTrue:false}
        ]
      },
      fri: {
        type: 'tap-sequence',
        instruction: 'Tap along as you do each kind action, in order!',
        sequence: [
          {emoji:'\ud83d\udc4b', label:'Wave hello'},
          {emoji:'\ud83e\udd17', label:'Give a hug'},
          {emoji:'\ud83d\ude4f', label:'Say please'},
          {emoji:'\ud83d\ude0a', label:'Smile'}
        ]
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83d\ude0a', text:'It is okay to feel happy.', isTrue:true},
          {emoji:'\ud83d\ude0a', text:'We are only allowed to feel one feeling ever.', isTrue:false}
        ]
      },
      tue: {
        type: 'tap-explore',
        instruction: 'Tap the face that shows how you feel right now!',
        hotspots: [
          {emoji:'\ud83d\ude0a', label:'Happy'},
          {emoji:'\ud83d\ude22', label:'Sad'},
          {emoji:'\ud83d\ude20', label:'Angry'},
          {emoji:'\ud83d\ude28', label:'Scared'}
        ]
      },
      wed: {
        type: 'spot-difference',
        instruction: 'Look at both rows \u2014 which feeling face is different in the second row?',
        rowA: ['\ud83d\ude20','\ud83d\ude28','\ud83d\ude0a','\ud83d\ude22'],
        rowB: ['\ud83d\ude20','\ud83d\ude28','\ud83d\ude0a','\ud83d\ude0a'],
        differentIndex: 3
      },
      thu: {
        type: 'complete-pattern',
        instruction: 'Breathe in, breathe out \u2014 what comes next in our calm-down pattern?',
        pattern: ['\ud83d\ude2e\u200d\ud83d\udca8','\ud83e\uddd8','\ud83d\ude2e\u200d\ud83d\udca8','\ud83e\uddd8'],
        options: ['\ud83d\ude2e\u200d\ud83d\udca8','\ud83d\ude22','\ud83d\ude21'],
        answer: '\ud83d\ude2e\u200d\ud83d\udca8'
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each action as kind or unkind!',
        items: [
          {key:'share', emoji:'\ud83e\udd1d'},
          {key:'hug', emoji:'\ud83e\udd17'},
          {key:'grab', emoji:'\u270a'},
          {key:'push', emoji:'\ud83d\ude45'}
        ],
        baskets: [
          {emoji:'\ud83d\udc9b', label:'Kind', accepts:['share','hug']},
          {emoji:'\ud83d\udeab', label:'Unkind', accepts:['grab','push']}
        ]
      }
    }
  }
};