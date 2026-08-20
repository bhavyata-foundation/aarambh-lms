/* ============================================================
   WEEK 5 \u2014 "Fruits & Vegetables" (Term 1, 13-17 Jul 2026)

   Rebuilt from the real spreadsheet
   (Weekly_Activity_Completion_DomainWise_Week5.xlsx). Replaces
   an earlier, incorrect "Nature Patterns" version that was
   designed without a source spreadsheet \u2014 this is the real
   curriculum, including its "Wari" (walking-together) theme
   on Friday.
   ============================================================ */

WEEK_DAY_TOPICS.wk5 = {
  mon:{value:'Identify and count fruits and vegetables', link:'Fruits & Vegetables: Names & Counting'},
  tue:{value:'Sort produce by colour', link:'Fruits & Vegetables: Colour'},
  wed:{value:'Learn healthy habits from the doctor\u2019s story', link:'Fruits & Vegetables: Healthy Habits'},
  thu:{value:'Compare more and less, and sort leafy/root vegetables', link:'Fruits & Vegetables: Comparing & Sorting'},
  fri:{value:'Learn the Wari value of helping each other', link:'Fruits & Vegetables: Sharing & Kindness'}
};

WEEKLY_PLAN.wk5 = {
  welcome:  {mon:'Fruit & vegetable basket exploration', tue:'Free play', wed:'Hygiene check', thu:'Attendance', fri:'Weather talk'},
  story:    {mon:'Rhyme: Fruits & Vegetables', tue:'Story: The Mango Tree / Helpful Vegetable Seller', wed:'Story: Doctor Says Eat Healthy', thu:'Story: Sharing Fruits; Rhyme: Carrot, Tomato, Potato', fri:'Wari story: Walking together; Story: Healthy Plate'},
  numeracy: {mon:'Identify and count fruits & vegetables', tue:'Sort fruits & vegetables by colour', wed:'Sort fruits & vegetables by size', thu:'Compare more/less; sort leafy/root vegetables', fri:'Counting recap & compare groups'},
  language: {mon:'Fruit & vegetable names', tue:'Colour words with produce', wed:'Taste words: sweet, sour, juicy, spicy, fresh', thu:'Hygiene words: wash, clean, cut; "I eat..."', fri:'Speak: "My favourite is..."; "I like..."'},
  create:   {mon:'Produce colouring / finger painting', tue:'Stamp printing / thumb painting', wed:'Clay fruit basket & thank-you card for doctor', thu:'Produce collage / stamp printing', fri:'Fruit & vegetable basket worksheet'},
  outdoor:  {mon:'Basket game / tip-toe walking', tue:'Running game / heel walking', wed:'Passing produce & doctor-helper role play', thu:'Balance walk carrying produce basket', fri:'Clap-step Wari pattern & passing game'},
  reflect:  {mon:'Name one fruit / vegetable', tue:'Name one yellow / green produce', wed:'Why do doctors help us? & big/small produce', thu:'More/less fruits & wash before eating', fri:'Wari value: help each other & healthy food promise'}
};

ACTIVITY_COMPETENCIES.wk5 = {
  welcome: {
    mon:'Explores a fruit and vegetable basket', tue:'Plays freely, exploring produce and toys',
    wed:'Checks personal hygiene', thu:'Participates in attendance',
    fri:'Talks about the weather'
  },
  story: {
    mon:'Joins a rhyme about fruits and vegetables', tue:'Listens to a story about a mango tree or vegetable seller',
    wed:'Listens to a story about a doctor and healthy eating', thu:'Listens to a story about sharing fruit and joins a rhyme about vegetables',
    fri:'Listens to a Wari story about walking together and a story about a healthy plate'
  },
  numeracy: {
    mon:'Identifies and counts fruits and vegetables', tue:'Sorts produce by colour',
    wed:'Sorts produce by size', thu:'Compares more and less, and sorts leafy and root vegetables',
    fri:'Recaps counting and comparing groups of produce'
  },
  language: {
    mon:'Learns fruit and vegetable names', tue:'Learns colour words using produce',
    wed:'Learns taste words: sweet, sour, juicy, spicy, fresh', thu:'Learns hygiene words and says "I eat..."',
    fri:'Says "My favourite is..." and "I like..."'
  },
  create: {
    mon:'Colours or finger-paints produce', tue:'Stamp-prints or thumb-paints produce',
    wed:'Makes a clay fruit basket and a thank-you card for the doctor', thu:'Makes a produce collage or stamp print',
    fri:'Completes a fruit and vegetable basket worksheet'
  },
  outdoor: {
    mon:'Plays a basket game and practises tip-toe walking', tue:'Plays a running game and practises heel walking',
    wed:'Passes produce and role-plays being a doctor\u2019s helper', thu:'Walks in balance while carrying a produce basket',
    fri:'Claps and steps a Wari pattern and plays a passing game'
  },
  reflect: {
    mon:'Names one fruit or vegetable', tue:'Names one yellow or green produce item',
    wed:'Talks about why doctors help us, and about big/small produce', thu:'Talks about more/less fruits and washing before eating',
    fri:'Shares the Wari value of helping each other and a healthy food promise'
  }
};

weeksWithContent.push(5);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES \u2014 7 tracked domains x 5 days = 35 activities.
// Same variety discipline as other weeks.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk5 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the basket to explore each fruit and vegetable!',
        hotspots: [
          {emoji:'\ud83c\udf4e', label:'Apple'},
          {emoji:'\ud83e\udd55', label:'Carrot'},
          {emoji:'\ud83c\udf4c', label:'Banana'},
          {emoji:'\ud83c\udf45', label:'Tomato'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each item you find during free play!',
        items: [
          {key:'apple', emoji:'\ud83c\udf4e'},
          {key:'potato', emoji:'\ud83e\udd54'},
          {key:'ball', emoji:'\u26bd'},
          {key:'block', emoji:'\ud83e\uddf1'}
        ],
        baskets: [
          {emoji:'\ud83e\uddfa', label:'Produce', accepts:['apple','potato']},
          {emoji:'\ud83e\uddf8', label:'Toys', accepts:['ball','block']}
        ]
      },
      wed: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows washed, clean hands.',
        options: [
          {emoji:'\ud83e\uddfc', label:'Washing hands', correct:true},
          {emoji:'\ud83e\udee7', label:'Muddy hands', correct:false}
        ]
      },
      thu: {
        type: 'spot-difference',
        instruction: 'It\u2019s attendance time! Tap the produce in the second row that\u2019s different.',
        rowA: ['\ud83c\udf4e','\ud83c\udf4e','\ud83c\udf4e','\ud83c\udf4e'],
        rowB: ['\ud83c\udf4e','\ud83c\udf4e','\ud83e\udd55','\ud83c\udf4e'],
        differentIndex: 2
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\u2600\ufe0f', text:'On a sunny day, fruits and vegetables can be enjoyed outdoors.', isTrue:true},
          {emoji:'\ud83c\udf27\ufe0f', text:'Weather never affects what we do together.', isTrue:false}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the fruits and vegetables rhyme, in order!',
        sequence: [
          {emoji:'\ud83c\udf4e', label:'Apple'},
          {emoji:'\ud83e\udd55', label:'Carrot'},
          {emoji:'\ud83c\udf46', label:'Brinjal'},
          {emoji:'\ud83c\udf4c', label:'Banana'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each character to their story!',
        pairs: [
          {leftEmoji:'\ud83c\udf33', left:'Mango tree', right:'Grows sweet mangoes', rightEmoji:'\ud83e\udd6d'},
          {leftEmoji:'\ud83e\uddd1', left:'Vegetable seller', right:'Sells fresh vegetables', rightEmoji:'\ud83e\udd55'}
        ]
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\ude7a', text:'The doctor says eating healthy food is good for us.', isTrue:true},
          {emoji:'\ud83c\udf6c', text:'The doctor says eating only sweets keeps us healthy.', isTrue:false}
        ]
      },
      thu: {
        type: 'complete-pattern',
        instruction: 'Carrot, tomato, potato, carrot \u2014 what comes next in the rhyme?',
        pattern: ['\ud83e\udd55','\ud83c\udf45','\ud83e\udd54','\ud83e\udd55'],
        options: ['\ud83c\udf45','\ud83c\udf46','\ud83c\udf3d'],
        answer: '\ud83c\udf45'
      },
      fri: {
        type: 'maze',
        instruction: 'Walk together on the Wari path, one step at a time!',
        path: [
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83e\udd1d'},
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83c\udf7d\ufe0f'}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'complete-pattern',
        instruction: 'Count along with the fruits and vegetables \u2014 how many come next?',
        pattern: ['\ud83c\udf4e','\ud83c\udf4e\ud83c\udf4e','\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e'],
        options: ['\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e','\ud83c\udf4e\ud83c\udf4e','\ud83c\udf4e'],
        answer: '\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e\ud83c\udf4e'
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each item by its colour!',
        items: [
          {key:'tomato', emoji:'\ud83c\udf45'},
          {key:'apple', emoji:'\ud83c\udf4e'},
          {key:'lemon', emoji:'\ud83c\udf4b'},
          {key:'banana', emoji:'\ud83c\udf4c'}
        ],
        baskets: [
          {emoji:'\ud83d\udd34', label:'Red', accepts:['tomato','apple']},
          {emoji:'\ud83d\udfe1', label:'Yellow', accepts:['lemon','banana']}
        ]
      },
      wed: {
        type: 'drag-drop',
        instruction: 'Drag each item to Big or Small!',
        items: [
          {key:'pumpkin', emoji:'\ud83c\udf83'},
          {key:'pea', emoji:'\ud83e\uddd1'}
        ],
        destinations: [
          {emoji:'\ud83d\udfe2', label:'Big', accepts:['pumpkin']},
          {emoji:'\ud83d\udd35', label:'Small', accepts:['pea']}
        ]
      },
      thu: {
        type: 'match-pairs',
        instruction: 'Match each vegetable to where it grows!',
        pairs: [
          {leftEmoji:'\ud83e\udd6c', left:'Spinach', right:'Leafy vegetable', rightEmoji:'\ud83c\udf43'},
          {leftEmoji:'\ud83e\udd55', left:'Carrot', right:'Root vegetable', rightEmoji:'\u23f3'}
        ]
      },
      fri: {
        type: 'spot-difference',
        instruction: 'Look at both rows of counted produce \u2014 tap the one that\u2019s different in the second row!',
        rowA: ['\ud83c\udf4e','\ud83e\udd55','\ud83c\udf45','\ud83c\udf4c'],
        rowB: ['\ud83c\udf4e','\ud83e\udd55','\ud83c\udf4c','\ud83c\udf4c'],
        differentIndex: 2
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'match-pairs',
        instruction: 'Match each name to the correct produce!',
        pairs: [
          {leftEmoji:'\ud83c\udf4e', left:'apple', right:'A fruit', rightEmoji:'\u2728'},
          {leftEmoji:'\ud83e\udd55', left:'carrot', right:'A vegetable', rightEmoji:'\u2728'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the produce that is yellow.',
        options: [
          {emoji:'\ud83c\udf4c', label:'Banana', correct:true},
          {emoji:'\ud83c\udf45', label:'Tomato', correct:false}
        ]
      },
      wed: {
        type: 'sorting',
        instruction: 'Sort each taste word to the correct produce!',
        items: [
          {key:'sweet', emoji:'\ud83c\udf4c'},
          {key:'juicy', emoji:'\ud83c\udf49'},
          {key:'sour', emoji:'\ud83c\udf4b'},
          {key:'spicy', emoji:'\ud83c\udf36\ufe0f'}
        ],
        baskets: [
          {emoji:'\ud83d\ude0a', label:'Sweet / juicy', accepts:['sweet','juicy']},
          {emoji:'\ud83d\ude16', label:'Sour / spicy', accepts:['sour','spicy']}
        ]
      },
      thu: {
        type: 'complete-sentence', prefix:'I eat', answer:'vegetables', wrong:['shoes','chairs'], emoji:'\ud83e\udd55'
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83d\udde3\ufe0f', text:'Saying "I like carrots" tells others your favourite food.', isTrue:true},
          {emoji:'\ud83d\udde3\ufe0f', text:'We should never say what food we like.', isTrue:false}
        ]
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour or finger-paint the produce!',
        palette: ['#D85A30','#FAC775','#639922','#378ADD'],
        regions: [
          {emoji:'\ud83c\udf4e', label:'Apple'},
          {emoji:'\ud83e\udd55', label:'Carrot'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each stamp shape to the produce it prints before you thumb-paint!',
        pairs: [
          {leftEmoji:'\u2b55', left:'Round stamp', right:'Apple print', rightEmoji:'\ud83c\udf4e'},
          {leftEmoji:'\ud83d\udd39', left:'Long stamp', right:'Carrot print', rightEmoji:'\ud83e\udd55'}
        ]
      },
      wed: {
        type: 'sorting',
        instruction: 'Sort each item into the fruit basket or the thank-you card!',
        items: [
          {key:'apple', emoji:'\ud83c\udf4e'},
          {key:'banana', emoji:'\ud83c\udf4c'},
          {key:'heart', emoji:'\u2764\ufe0f'},
          {key:'thanks', emoji:'\ud83d\udcdd'}
        ],
        baskets: [
          {emoji:'\ud83e\uddfa', label:'Fruit basket', accepts:['apple','banana']},
          {emoji:'\ud83d\udc8c', label:'Thank-you card', accepts:['heart','thanks']}
        ]
      },
      thu: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then make a produce collage!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4','#FAC775'],
        regions: [
          {emoji:'\ud83c\udf45', label:'Tomato piece'},
          {emoji:'\ud83c\udf3d', label:'Corn piece'}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'What comes next in the pattern on your fruit and vegetable basket worksheet?',
        pattern: ['\ud83c\udf4e','\ud83e\udd55','\ud83c\udf4e','\ud83e\udd55'],
        options: ['\ud83c\udf4e','\ud83c\udf4c','\ud83c\udf45'],
        answer: '\ud83c\udf4e'
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'step-count-find',
        instruction: 'Tip-toe five steps for the basket game, then find a hidden fruit!',
        targetSteps: 5,
        findEmoji: '\ud83c\udf4c',
        findLabel: 'banana'
      },
      tue: {
        type: 'jump-direction',
        instruction: 'Heel-walk then jump five times for the running game, then point to the fastest runner!',
        targetJumps: 5,
        soundEmoji: '\ud83c\udfc3',
        directions: [
          {arrow:'\u27a1\ufe0f', correct:true},
          {arrow:'\u2b05\ufe0f', correct:false},
          {arrow:'\u2b06\ufe0f', correct:false}
        ]
      },
      wed: {
        type: 'tap-sequence',
        instruction: 'Tap along as you pass the produce and play doctor\u2019s helper, in order!',
        sequence: [
          {emoji:'\ud83e\udd55', label:'Pass the carrot'},
          {emoji:'\ud83e\ude7a', label:'Doctor checks up'},
          {emoji:'\ud83c\udf4e', label:'Pass the apple'},
          {emoji:'\ud83d\ude0a', label:'All healthy'}
        ]
      },
      thu: {
        type: 'maze',
        instruction: 'Balance-walk while carrying the produce basket, one step at a time!',
        path: [
          {emoji:'\ud83e\uddfa'},
          {emoji:'\ud83e\uddfa'},
          {emoji:'\ud83e\uddfa'},
          {emoji:'\ud83c\udf89'}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'Clap, step, clap \u2014 what comes next in the Wari pattern?',
        pattern: ['\ud83d\udc4f','\ud83d\udc63','\ud83d\udc4f'],
        options: ['\ud83d\udc63','\ud83e\udd38','\ud83e\udd1d'],
        answer: '\ud83d\udc63'
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the fruit or vegetable you\u2019d like to name today!',
        hotspots: [
          {emoji:'\ud83c\udf4e', label:'Apple'},
          {emoji:'\ud83e\udd55', label:'Carrot'},
          {emoji:'\ud83c\udf4c', label:'Banana'},
          {emoji:'\ud83c\udf45', label:'Tomato'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the produce that is yellow or green.',
        options: [
          {emoji:'\ud83e\udd6c', label:'Spinach (green)', correct:true},
          {emoji:'\ud83c\udf45', label:'Tomato (red)', correct:false}
        ]
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\ude7a', text:'Doctors help keep us healthy.', isTrue:true},
          {emoji:'\ud83e\ude7a', text:'Doctors never help anyone.', isTrue:false}
        ]
      },
      thu: {
        type: 'spot-difference',
        instruction: 'Look at both rows of fruit groups \u2014 which one has a different amount in the second row?',
        rowA: ['\ud83c\udf4e','\ud83c\udf4e','\ud83c\udf4e'],
        rowB: ['\ud83c\udf4e','\ud83c\udf4e','\ud83c\udf4e\ud83c\udf4e'],
        differentIndex: 2
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each action as helping each other or not!',
        items: [
          {key:'share', emoji:'\ud83e\udd1d'},
          {key:'walk', emoji:'\ud83d\udeb6'},
          {key:'grab', emoji:'\u270a'},
          {key:'ignore', emoji:'\ud83d\ude10'}
        ],
        baskets: [
          {emoji:'\ud83d\udc9b', label:'Helping each other', accepts:['share','walk']},
          {emoji:'\ud83d\udeab', label:'Not helping', accepts:['grab','ignore']}
        ]
      }
    }
  }
};