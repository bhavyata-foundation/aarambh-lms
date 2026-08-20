/* ============================================================
   WEEK 8 \u2014 "Beads, Jewellery & Rangoli Patterns" (Term 1, 3-7 Aug 2026)

   Rebuilt from the real spreadsheet
   (Weekly_Activity_Completion_DomainWise_Week8.xlsx). Replaces
   an earlier, incorrect "Number, Sound & Movement" version that
   was designed without a source spreadsheet. Thursday's story
   ("Lokmanya Tilak & Guru Purnima") is carried through exactly
   as planned by the curriculum team \u2014 a real, dated reference,
   not a guess on our part.
   ============================================================ */

WEEK_DAY_TOPICS.wk8 = {
  mon:{value:'Identify AB, AAB, ABB bead patterns', link:'Patterns: Bead Sequences'},
  tue:{value:'Extend circle-square-triangle patterns', link:'Patterns: Shapes'},
  wed:{value:'Complete missing rangoli and bead patterns', link:'Patterns: Missing Pieces'},
  thu:{value:'Design a bracelet with a repeated pattern', link:'Patterns: Bracelet Design'},
  fri:{value:'Create your own rangoli border pattern', link:'Patterns: Rangoli Border'}
};

WEEKLY_PLAN.wk8 = {
  welcome:  {mon:'Bead basket exploration', tue:'Rangoli cards & shape tiles', wed:'Free play with beads & buttons', thu:'Attendance, shape & colour talk', fri:'Hygiene & weather talk'},
  story:    {mon:'Rhyme: Beads and Colours', tue:'Story: Rangoli at Home', wed:'Sound rhyme: Bell and Clap', thu:'Story: Lokmanya Tilak & Guru Purnima', fri:'Story: Festivals Bring Us Together'},
  numeracy: {mon:'Identify patterns: AB, AAB, ABB beads', tue:'Observe & extend circle-square-triangle patterns', wed:'Complete missing rangoli tiles & bead lines', thu:'Design a bracelet with repeated patterns', fri:'Create own rangoli border pattern & recap'},
  language: {mon:'Listen to bell, clap & drum sounds', tue:'Name shapes & colours in designs', wed:'Loud/soft sound game; rhyming pairs', thu:'Say: "This is a circle" & "I made a pattern"', fri:'Speak: "I made a rangoli using beads"'},
  create:   {mon:'Colouring bead & rangoli patterns', tue:'Threading large beads', wed:'Dot joining & paper bead pasting', thu:'Paste shape cut-outs for paper rangoli', fri:'Bracelet making & pattern worksheets'},
  outdoor:  {mon:'Clap-jump-clap movement pattern', tue:'Shape movement & boundary games', wed:'Pass the bead & circle-square group game', thu:'Stand in triangle/circle formations', fri:'Festival unity circle & action patterns'},
  reflect:  {mon:'Name one bead or pattern colour', tue:'Make one loud/soft sound sequence', wed:'Complete one oral shape pattern', thu:'Say one way to show respect or unity', fri:'Pattern, respect & festival value recap'}
};

ACTIVITY_COMPETENCIES.wk8 = {
  welcome: {
    mon:'Explores a bead basket', tue:'Explores rangoli cards and shape tiles',
    wed:'Plays freely with beads and buttons', thu:'Participates in attendance and talks about shape and colour',
    fri:'Checks hygiene and talks about the weather'
  },
  story: {
    mon:'Joins a rhyme about beads and colours', tue:'Listens to a story about rangoli at home',
    wed:'Joins a sound rhyme about a bell and clapping', thu:'Listens to a story about Lokmanya Tilak and Guru Purnima',
    fri:'Listens to a story about festivals bringing people together'
  },
  numeracy: {
    mon:'Identifies AB, AAB and ABB bead patterns', tue:'Observes and extends circle-square-triangle patterns',
    wed:'Completes missing rangoli tiles and bead lines', thu:'Designs a bracelet with a repeated pattern',
    fri:'Creates their own rangoli border pattern and recaps'
  },
  language: {
    mon:'Listens to bell, clap and drum sounds', tue:'Names shapes and colours in designs',
    wed:'Plays a loud/soft sound game and rhyming pairs', thu:'Says "This is a circle" and "I made a pattern"',
    fri:'Says "I made a rangoli using beads"'
  },
  create: {
    mon:'Colours bead and rangoli patterns', tue:'Threads large beads',
    wed:'Joins dots and pastes paper beads', thu:'Pastes shape cut-outs for a paper rangoli',
    fri:'Makes a bracelet and completes pattern worksheets'
  },
  outdoor: {
    mon:'Moves through a clap-jump-clap pattern', tue:'Plays shape movement and boundary games',
    wed:'Plays a pass-the-bead circle-square group game', thu:'Stands in triangle and circle formations',
    fri:'Joins a festival unity circle and action patterns'
  },
  reflect: {
    mon:'Names one bead or pattern colour', tue:'Makes one loud/soft sound sequence',
    wed:'Completes one oral shape pattern', thu:'Says one way to show respect or unity',
    fri:'Recaps patterns, respect and festival values'
  }
};

weeksWithContent.push(8);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES \u2014 7 tracked domains x 5 days = 35 activities.
// complete-pattern and sorting both lean higher this week (6 each)
// since the real spreadsheet's theme is explicitly about bead/
// rangoli PATTERNS \u2014 numeracy especially is literally "identify
// AB/AAB/ABB patterns" and "complete missing rangoli tiles", which
// is exactly what the complete-pattern renderer does. Every domain
// still has >=4 distinct types across its own 5 days.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk8 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the basket to explore each bead!',
        hotspots: [
          {emoji:'\ud83d\udd34', label:'Red bead'},
          {emoji:'\ud83d\udfe1', label:'Yellow bead'},
          {emoji:'\ud83d\udfe2', label:'Green bead'},
          {emoji:'\ud83d\udd35', label:'Blue bead'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each rangoli card by its shape!',
        items: [
          {key:'circle1', emoji:'\u2b55'},
          {key:'circle2', emoji:'\ud83d\udd35'},
          {key:'square1', emoji:'\ud83d\udfe8'},
          {key:'square2', emoji:'\ud83d\udfe5'}
        ],
        baskets: [
          {emoji:'\u2b55', label:'Circles', accepts:['circle1','circle2']},
          {emoji:'\ud83d\udfe8', label:'Squares', accepts:['square1','square2']}
        ]
      },
      wed: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a bead, not a button.',
        options: [
          {emoji:'\ud83d\udd34', label:'Bead', correct:true},
          {emoji:'\ud83d\udd18', label:'Button', correct:false}
        ]
      },
      thu: {
        type: 'spot-difference',
        instruction: 'It\u2019s attendance time! Tap the shape in the second row that\u2019s different.',
        rowA: ['\ud83d\udfe8','\ud83d\udfe8','\ud83d\udfe8','\ud83d\udfe8'],
        rowB: ['\ud83d\udfe8','\ud83d\udfe8','\u25b3','\ud83d\udfe8'],
        differentIndex: 2
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\u2600\ufe0f', text:'On a sunny day, we can wash our hands and enjoy the weather.', isTrue:true},
          {emoji:'\ud83c\udf27\ufe0f', text:'Hygiene only matters on rainy days.', isTrue:false}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the beads and colours rhyme, in order!',
        sequence: [
          {emoji:'\ud83d\udd34', label:'Red bead'},
          {emoji:'\ud83d\udfe1', label:'Yellow bead'},
          {emoji:'\ud83d\udd34', label:'Red bead'},
          {emoji:'\ud83d\udfe1', label:'Yellow bead'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each rangoli design to where it\u2019s made at home!',
        pairs: [
          {leftEmoji:'\ud83c\udfe0', left:'Doorstep', right:'Welcomes guests', rightEmoji:'\ud83d\udc4b'},
          {leftEmoji:'\ud83c\udfa8', left:'Colours', right:'Make it beautiful', rightEmoji:'\u2728'}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'Bell, clap, bell \u2014 what comes next in the sound rhyme?',
        pattern: ['\ud83d\udd14','\ud83d\udc4f','\ud83d\udd14'],
        options: ['\ud83d\udc4f','\ud83e\udd41','\ud83d\udc63'],
        answer: '\ud83d\udc4f'
      },
      thu: {
        type: 'maze',
        instruction: 'Walk the Guru Purnima path to show respect, one step at a time!',
        path: [
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83d\ude4f'},
          {emoji:'\ud83d\udcda'},
          {emoji:'\ud83d\ude4f'}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\udd1d', text:'Festivals can bring people together.', isTrue:true},
          {emoji:'\ud83e\udd1d', text:'Festivals always keep people apart.', isTrue:false}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'complete-pattern',
        instruction: 'Red, yellow, red \u2014 what comes next in the AB bead pattern?',
        pattern: ['\ud83d\udd34','\ud83d\udfe1','\ud83d\udd34'],
        options: ['\ud83d\udfe1','\ud83d\udd35','\ud83d\udfe2'],
        answer: '\ud83d\udfe1'
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'Circle, square, triangle, circle \u2014 what comes next?',
        pattern: ['\u2b55','\ud83d\udfe8','\u25b3','\u2b55'],
        options: ['\ud83d\udfe8','\u2b55','\u25b3'],
        answer: '\ud83d\udfe8'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each missing rangoli tile to the gap it fills!',
        pairs: [
          {leftEmoji:'\u2753', left:'Gap one', right:'Circle tile', rightEmoji:'\u2b55'},
          {leftEmoji:'\u2753', left:'Gap two', right:'Square tile', rightEmoji:'\ud83d\udfe8'}
        ]
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag each bead onto the bracelet to build the repeating pattern!',
        items: [
          {key:'red', emoji:'\ud83d\udd34'},
          {key:'blue', emoji:'\ud83d\udd35'}
        ],
        destinations: [
          {emoji:'\ud83d\udd34', label:'Red spot', accepts:['red']},
          {emoji:'\ud83d\udd35', label:'Blue spot', accepts:['blue']}
        ]
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each rangoli piece as a corner piece or an edge piece for your border!',
        items: [
          {key:'corner1', emoji:'\u25c6'},
          {key:'corner2', emoji:'\u2b22'},
          {key:'edge1', emoji:'\u25ac'},
          {key:'edge2', emoji:'\u2015'}
        ],
        baskets: [
          {emoji:'\u25c6', label:'Corner pieces', accepts:['corner1','corner2']},
          {emoji:'\u25ac', label:'Edge pieces', accepts:['edge1','edge2']}
        ]
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'tick-choice',
        instruction: 'Tick the picture that makes a loud sound.',
        options: [
          {emoji:'\ud83d\udd14', label:'Bell', correct:true},
          {emoji:'\ud83e\udeb6', label:'Feather', correct:false}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each shape name to the correct shape!',
        pairs: [
          {leftEmoji:'\u2b55', left:'circle', right:'Round shape', rightEmoji:'\u2728'},
          {leftEmoji:'\ud83d\udfe8', left:'square', right:'Four sides', rightEmoji:'\u2728'}
        ]
      },
      wed: {
        type: 'sorting',
        instruction: 'Sort each sound as loud or soft!',
        items: [
          {key:'drum', emoji:'\ud83e\udd41'},
          {key:'bell', emoji:'\ud83d\udd14'},
          {key:'whisper', emoji:'\ud83e\udd2b'},
          {key:'feather', emoji:'\ud83e\udeb6'}
        ],
        baskets: [
          {emoji:'\ud83d\udd0a', label:'Loud', accepts:['drum','bell']},
          {emoji:'\ud83d\udd09', label:'Soft', accepts:['whisper','feather']}
        ]
      },
      thu: {
        type: 'complete-sentence', prefix:'This is a', answer:'circle', wrong:['spoon','shoe'], emoji:'\u2b55'
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83d\udde3\ufe0f', text:'Saying "I made a rangoli" tells others about your work.', isTrue:true},
          {emoji:'\ud83d\udde3\ufe0f', text:'We should never talk about what we made.', isTrue:false}
        ]
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in the bead and rangoli pattern!',
        palette: ['#D85A30','#FAC775','#639922','#378ADD'],
        regions: [
          {emoji:'\ud83d\udd34', label:'Bead one'},
          {emoji:'\u2b55', label:'Rangoli dot'}
        ]
      },
      tue: {
        type: 'drag-drop',
        instruction: 'Drag each large bead onto the string, in order!',
        items: [
          {key:'red', emoji:'\ud83d\udd34'},
          {key:'yellow', emoji:'\ud83d\udfe1'}
        ],
        destinations: [
          {emoji:'\ud83d\udd34', label:'First spot', accepts:['red']},
          {emoji:'\ud83d\udfe1', label:'Second spot', accepts:['yellow']}
        ]
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each dot to its number before joining and pasting your paper beads!',
        pairs: [
          {leftEmoji:'1\ufe0f\u20e3', left:'Dot 1', right:'Start here', rightEmoji:'\u25cf'},
          {leftEmoji:'2\ufe0f\u20e3', left:'Dot 2', right:'Next dot', rightEmoji:'\u25cf'}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each shape cut-out before pasting your paper rangoli!',
        items: [
          {key:'circle', emoji:'\u2b55'},
          {key:'triangle', emoji:'\u25b3'},
          {key:'square', emoji:'\ud83d\udfe8'},
          {key:'diamond', emoji:'\u25c6'}
        ],
        baskets: [
          {emoji:'\u2b55', label:'Round shapes', accepts:['circle']},
          {emoji:'\ud83d\udfe8', label:'Straight-edge shapes', accepts:['triangle','square','diamond']}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'What bead comes next on the bracelet you\u2019re making?',
        pattern: ['\ud83d\udd34','\ud83d\udd35','\ud83d\udd34','\ud83d\udd35'],
        options: ['\ud83d\udd34','\ud83d\udfe1','\ud83d\udfe2'],
        answer: '\ud83d\udd34'
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'step-count-find',
        instruction: 'Clap, jump, clap for five steps, then find a hidden bead!',
        targetSteps: 5,
        findEmoji: '\ud83d\udd34',
        findLabel: 'bead'
      },
      tue: {
        type: 'maze',
        instruction: 'Move through the shape boundary game, one step at a time!',
        path: [
          {emoji:'\u2b55'},
          {emoji:'\ud83d\udfe8'},
          {emoji:'\u25b3'},
          {emoji:'\ud83c\udf89'}
        ]
      },
      wed: {
        type: 'sorting',
        instruction: 'Pass the bead, then sort into the circle group or square group!',
        items: [
          {key:'bead1', emoji:'\ud83d\udd34'},
          {key:'bead2', emoji:'\ud83d\udfe1'},
          {key:'bead3', emoji:'\ud83d\udd35'},
          {key:'bead4', emoji:'\ud83d\udfe2'}
        ],
        baskets: [
          {emoji:'\u2b55', label:'Circle group', accepts:['bead1','bead2']},
          {emoji:'\ud83d\udfe8', label:'Square group', accepts:['bead3','bead4']}
        ]
      },
      thu: {
        type: 'jump-direction',
        instruction: 'Jump five times, then point to whether you\u2019ll stand in a triangle or circle formation!',
        targetJumps: 5,
        soundEmoji: '\ud83d\udc65',
        directions: [
          {arrow:'\u2b06\ufe0f', correct:true},
          {arrow:'\u2b05\ufe0f', correct:false},
          {arrow:'\u27a1\ufe0f', correct:false}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'Clap, turn, clap \u2014 what comes next in our festival unity circle pattern?',
        pattern: ['\ud83d\udc4f','\ud83d\udd04','\ud83d\udc4f'],
        options: ['\ud83d\udd04','\ud83e\udd38','\ud83d\ude0a'],
        answer: '\ud83d\udd04'
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the bead or pattern colour you\u2019d like to name today!',
        hotspots: [
          {emoji:'\ud83d\udd34', label:'Red'},
          {emoji:'\ud83d\udfe1', label:'Yellow'},
          {emoji:'\ud83d\udfe2', label:'Green'},
          {emoji:'\ud83d\udd35', label:'Blue'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a loud sound.',
        options: [
          {emoji:'\ud83e\udd41', label:'Drum', correct:true},
          {emoji:'\ud83e\udeb6', label:'Feather', correct:false}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'Complete this oral shape pattern out loud \u2014 what comes next?',
        pattern: ['\u2b55','\ud83d\udfe8','\u2b55'],
        options: ['\ud83d\udfe8','\u25b3','\u25c6'],
        answer: '\ud83d\udfe8'
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83d\ude4f', text:'Saying thank you is one way to show respect.', isTrue:true},
          {emoji:'\ud83d\ude4f', text:'Ignoring someone is a way to show respect.', isTrue:false}
        ]
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each action as respectful or not, to recap the week\u2019s values!',
        items: [
          {key:'greet', emoji:'\ud83d\ude4f'},
          {key:'share', emoji:'\ud83e\udd1d'},
          {key:'shout', emoji:'\ud83d\ude21'},
          {key:'ignore', emoji:'\ud83d\ude10'}
        ],
        baskets: [
          {emoji:'\ud83d\udc9b', label:'Respectful', accepts:['greet','share']},
          {emoji:'\ud83d\udeab', label:'Not respectful', accepts:['shout','ignore']}
        ]
      }
    }
  }
};