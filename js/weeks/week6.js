/* ============================================================
   WEEK 6 \u2014 "Habits, Hygiene & Health" (Term 1, 20-24 Jul 2026)

   Rebuilt from the real spreadsheet
   (Weekly_Activity_Completion_DomainWise_Week6.xlsx). Replaces
   an earlier, incorrect "Beads & Jewellery" version that was
   designed without a source spreadsheet \u2014 this is the real
   curriculum.
   ============================================================ */

WEEK_DAY_TOPICS.wk6 = {
  mon:{value:'Learn about fruits', link:'Habits & Health: Fruits'},
  tue:{value:'Learn about vegetables', link:'Habits & Health: Vegetables'},
  wed:{value:'Practise handwashing and brushing teeth', link:'Habits & Health: Clean Hands & Teeth'},
  thu:{value:'Learn about bathing and clean clothes', link:'Habits & Health: Bath & Clean Clothes'},
  fri:{value:'Practise yoga breathing and poses', link:'Habits & Health: Yoga & Breathing'}
};

WEEKLY_PLAN.wk6 = {
  welcome:  {mon:'Fruit picture card free play', tue:'Vegetable picture card exploration', wed:'Brush & toothpaste free play', thu:'Bath items & hygiene kit play', fri:'Yoga mat & breathing card play'},
  story:    {mon:'Story: My Healthy Plate', tue:'Rhyme: Fruits & Veggies Are Good', wed:'Story: Clean Hands, Clean Mouth', thu:'Story: Bath Time & Clean Clothes', fri:'Story: Yoga Keeps Me Healthy'},
  numeracy: {mon:'Sort fruit cards activity', tue:'Sort vegetable cards activity', wed:'Handwash & brushing sequencing steps', thu:'Sort clean & dirty clothes cards', fri:'Count breaths 1\u20135 & match poses'},
  language: {mon:'Words: apple, banana, mango', tue:'Words: carrot, tomato, potato', wed:'Words: soap, wash, brush, teeth', thu:'Words: bath, towel, comb, clean', fri:'Words: breathe, calm, stretch, pose'},
  create:   {mon:'Fruit colouring worksheet', tue:'Vegetable colouring worksheet', wed:'Handwash & brushing tracing sheet', thu:'Clean clothes matching layout', fri:'Yoga pose tracing & colouring worksheet'},
  outdoor:  {mon:'Interactive fruit walk game', tue:'Vegetable market role play', wed:'Handwash & brushing action songs', thu:'Clean-up basket sorting challenge', fri:'Simple stretching & butterfly/tree pose'},
  reflect:  {mon:'Recall one fruit name', tue:'Recall one vegetable name', wed:'Say one hygiene routine habit', thu:'Identify clean vs. dirty items', fri:'Count 5 slow breaths & show a pose'}
};

ACTIVITY_COMPETENCIES.wk6 = {
  welcome: {
    mon:'Explores fruit picture cards through free play', tue:'Explores vegetable picture cards',
    wed:'Plays freely with a brush and toothpaste', thu:'Plays with bath items and a hygiene kit',
    fri:'Explores a yoga mat and breathing cards'
  },
  story: {
    mon:'Listens to a story about a healthy plate', tue:'Joins a rhyme about fruits and vegetables',
    wed:'Listens to a story about clean hands and mouth', thu:'Listens to a story about bath time and clean clothes',
    fri:'Listens to a story about yoga and health'
  },
  numeracy: {
    mon:'Sorts fruit cards', tue:'Sorts vegetable cards',
    wed:'Sequences the steps of handwashing and brushing', thu:'Sorts clean and dirty clothes cards',
    fri:'Counts breaths from one to five and matches poses'
  },
  language: {
    mon:'Learns the words apple, banana, mango', tue:'Learns the words carrot, tomato, potato',
    wed:'Learns the words soap, wash, brush, teeth', thu:'Learns the words bath, towel, comb, clean',
    fri:'Learns the words breathe, calm, stretch, pose'
  },
  create: {
    mon:'Colours a fruit worksheet', tue:'Colours a vegetable worksheet',
    wed:'Traces a handwashing and brushing sheet', thu:'Completes a clean clothes matching layout',
    fri:'Traces and colours a yoga pose worksheet'
  },
  outdoor: {
    mon:'Plays an interactive fruit walk game', tue:'Role-plays a vegetable market',
    wed:'Joins handwashing and brushing action songs', thu:'Plays a clean-up basket sorting challenge',
    fri:'Practises simple stretching and butterfly/tree pose'
  },
  reflect: {
    mon:'Recalls one fruit name', tue:'Recalls one vegetable name',
    wed:'Says one hygiene routine habit', thu:'Identifies clean versus dirty items',
    fri:'Counts five slow breaths and shows a pose'
  }
};

weeksWithContent.push(6);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES \u2014 7 tracked domains x 5 days = 35 activities.
// Same variety discipline as other weeks \u2014 some domains lean on
// "sorting" a bit more than usual since the real spreadsheet
// literally specifies "sort fruit cards" / "sort vegetable cards" /
// "sort clean & dirty clothes cards" as the planned activity itself.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk6 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap each fruit picture card to see what it is!',
        hotspots: [
          {emoji:'\ud83c\udf4e', label:'Apple'},
          {emoji:'\ud83c\udf4c', label:'Banana'},
          {emoji:'\ud83e\udd6d', label:'Mango'},
          {emoji:'\ud83c\udf47', label:'Grapes'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each vegetable card by its colour!',
        items: [
          {key:'carrot', emoji:'\ud83e\udd55'},
          {key:'tomato', emoji:'\ud83c\udf45'},
          {key:'spinach', emoji:'\ud83e\udd6c'},
          {key:'peas', emoji:'\ud83e\uddd1'}
        ],
        baskets: [
          {emoji:'\ud83d\udfe0', label:'Orange / red', accepts:['carrot','tomato']},
          {emoji:'\ud83d\udfe2', label:'Green', accepts:['spinach','peas']}
        ]
      },
      wed: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a toothbrush.',
        options: [
          {emoji:'\ud83e\udea5', label:'Toothbrush', correct:true},
          {emoji:'\ud83c\udf74', label:'Fork', correct:false}
        ]
      },
      thu: {
        type: 'spot-difference',
        instruction: 'Look at the hygiene kit pictures \u2014 tap the one that\u2019s different in the second row!',
        rowA: ['\ud83e\uddfd','\ud83e\uddfd','\ud83e\uddfd','\ud83e\uddfd'],
        rowB: ['\ud83e\uddfd','\ud83e\uddfd','\ud83e\udea5','\ud83e\uddfd'],
        differentIndex: 2
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\uddd8', text:'A yoga mat is used for stretching and calm breathing.', isTrue:true},
          {emoji:'\ud83e\uddd8', text:'A yoga mat is used for eating snacks.', isTrue:false}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the healthy plate story, in order!',
        sequence: [
          {emoji:'\ud83c\udf4e', label:'Add a fruit'},
          {emoji:'\ud83e\udd55', label:'Add a vegetable'},
          {emoji:'\ud83c\udf5a', label:'Add some rice'},
          {emoji:'\ud83d\ude0a', label:'A healthy plate'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'Fruit, veggie, fruit \u2014 what comes next in the rhyme?',
        pattern: ['\ud83c\udf4e','\ud83e\udd55','\ud83c\udf4e'],
        options: ['\ud83e\udd55','\ud83e\udea5','\ud83e\uddfd'],
        answer: '\ud83e\udd55'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each cleaning action to the body part it cleans!',
        pairs: [
          {leftEmoji:'\ud83e\udea5', left:'Brushing', right:'Teeth', rightEmoji:'\ud83e\uddb7'},
          {leftEmoji:'\ud83e\uddfc', left:'Washing', right:'Hands', rightEmoji:'\u270b'}
        ]
      },
      thu: {
        type: 'maze',
        instruction: 'Follow the bath-time routine along the path, one step at a time!',
        path: [
          {emoji:'\ud83e\uddfd'},
          {emoji:'\ud83e\uddf4'},
          {emoji:'\ud83d\udc55'},
          {emoji:'\ud83d\ude0a'}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\uddd8', text:'Yoga can help keep our body healthy.', isTrue:true},
          {emoji:'\ud83e\uddd8', text:'Yoga makes our body less healthy.', isTrue:false}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'sorting',
        instruction: 'Sort each fruit card!',
        items: [
          {key:'apple', emoji:'\ud83c\udf4e'},
          {key:'banana', emoji:'\ud83c\udf4c'},
          {key:'grape', emoji:'\ud83c\udf47'},
          {key:'melon', emoji:'\ud83c\udf49'}
        ],
        baskets: [
          {emoji:'\ud83d\udfe2', label:'Small', accepts:['apple','grape']},
          {emoji:'\ud83d\udfe1', label:'Big', accepts:['banana','melon']}
        ]
      },
      tue: {
        type: 'drag-drop',
        instruction: 'Drag each vegetable card into the vegetable basket!',
        items: [
          {key:'carrot', emoji:'\ud83e\udd55'},
          {key:'potato', emoji:'\ud83e\udd54'}
        ],
        destinations: [
          {emoji:'\ud83e\uddfa', label:'Vegetable basket', accepts:['carrot','potato']}
        ]
      },
      wed: {
        type: 'tap-sequence',
        instruction: 'Tap along the handwashing and brushing steps, in order!',
        sequence: [
          {emoji:'\ud83d\udca7', label:'Wet hands'},
          {emoji:'\ud83e\uddfc', label:'Add soap'},
          {emoji:'\ud83e\udea5', label:'Brush teeth'},
          {emoji:'\ud83d\ude0a', label:'All clean'}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each clothes card as clean or dirty!',
        items: [
          {key:'clean1', emoji:'\ud83d\udc55'},
          {key:'clean2', emoji:'\ud83e\udde6'},
          {key:'dirty1', emoji:'\ud83e\udde6'},
          {key:'dirty2', emoji:'\ud83d\udc55'}
        ],
        baskets: [
          {emoji:'\u2728', label:'Clean', accepts:['clean1','clean2']},
          {emoji:'\ud83e\udee7', label:'Dirty', accepts:['dirty1','dirty2']}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'Count the breaths along with the poses \u2014 what comes next?',
        pattern: ['\ud83c\udf2c\ufe0f','\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f','\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f'],
        options: ['\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f','\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f','\ud83c\udf2c\ufe0f'],
        answer: '\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f\ud83c\udf2c\ufe0f'
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'match-pairs',
        instruction: 'Match each word to the correct fruit!',
        pairs: [
          {leftEmoji:'\ud83c\udf4e', left:'apple', right:'A red fruit', rightEmoji:'\u2728'},
          {leftEmoji:'\ud83e\udd6d', left:'mango', right:'A sweet fruit', rightEmoji:'\u2728'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a tomato.',
        options: [
          {emoji:'\ud83c\udf45', label:'Tomato', correct:true},
          {emoji:'\ud83e\udd54', label:'Potato', correct:false}
        ]
      },
      wed: {
        type: 'complete-sentence', prefix:'I brush my', answer:'teeth', wrong:['shoes','chairs'], emoji:'\ud83e\udea5'
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag each word onto the picture it matches!',
        items: [
          {key:'towel', emoji:'\ud83e\uddf4'},
          {key:'comb', emoji:'\ud83e\uddb0'}
        ],
        destinations: [
          {emoji:'\ud83e\uddf4', label:'towel', accepts:['towel']},
          {emoji:'\ud83e\uddb0', label:'comb', accepts:['comb']}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\uddd8', text:'Breathing slowly can help us feel calm.', isTrue:true},
          {emoji:'\ud83e\uddd8', text:'Holding your breath forever keeps you calm.', isTrue:false}
        ]
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in the fruit worksheet!',
        palette: ['#D85A30','#FAC775','#639922','#378ADD'],
        regions: [
          {emoji:'\ud83c\udf4e', label:'Apple'},
          {emoji:'\ud83c\udf4c', label:'Banana'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each vegetable to its colour before you colour the worksheet!',
        pairs: [
          {leftEmoji:'\ud83e\udd55', left:'Carrot', right:'Orange', rightEmoji:'\ud83d\udfe0'},
          {leftEmoji:'\ud83e\udd6c', left:'Spinach', right:'Green', rightEmoji:'\ud83d\udfe2'}
        ]
      },
      wed: {
        type: 'tap-sequence',
        instruction: 'Tap along tracing each handwashing and brushing step, in order!',
        sequence: [
          {emoji:'\ud83d\udca7', label:'Wet'},
          {emoji:'\ud83e\uddfc', label:'Soap'},
          {emoji:'\ud83e\udea5', label:'Brush'},
          {emoji:'\u2728', label:'Clean'}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each clothes picture before matching them on your layout!',
        items: [
          {key:'shirt', emoji:'\ud83d\udc54'},
          {key:'dress', emoji:'\ud83d\udc57'},
          {key:'dirtyshirt', emoji:'\ud83e\udee7'},
          {key:'dirtydress', emoji:'\ud83e\udee7'}
        ],
        baskets: [
          {emoji:'\u2728', label:'Clean clothes', accepts:['shirt','dress']},
          {emoji:'\ud83e\udee7', label:'Dirty clothes', accepts:['dirtyshirt','dirtydress']}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'What comes next in the pattern on your yoga pose worksheet?',
        pattern: ['\ud83e\uddd8','\ud83c\udf33','\ud83e\uddd8','\ud83c\udf33'],
        options: ['\ud83e\uddd8','\ud83e\udebf','\ud83d\udc4b'],
        answer: '\ud83e\uddd8'
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'step-count-find',
        instruction: 'Take five steps on the fruit walk, then find a hidden fruit!',
        targetSteps: 5,
        findEmoji: '\ud83c\udf47',
        findLabel: 'grapes'
      },
      tue: {
        type: 'maze',
        instruction: 'Walk through the vegetable market stalls, one step at a time!',
        path: [
          {emoji:'\ud83e\udd55'},
          {emoji:'\ud83c\udf45'},
          {emoji:'\ud83e\udd6c'},
          {emoji:'\ud83e\uddfa'}
        ]
      },
      wed: {
        type: 'tap-sequence',
        instruction: 'Tap along as you sing the handwashing and brushing song, in order!',
        sequence: [
          {emoji:'\ud83d\udca7', label:'Wet hands'},
          {emoji:'\ud83e\uddfc', label:'Soap up'},
          {emoji:'\ud83e\udea5', label:'Brush teeth'},
          {emoji:'\ud83d\ude0a', label:'All done'}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each item into the clean-up basket challenge!',
        items: [
          {key:'toy', emoji:'\ud83e\uddf8'},
          {key:'book', emoji:'\ud83d\udcd6'},
          {key:'shoe', emoji:'\ud83d\udc5f'},
          {key:'block', emoji:'\ud83e\uddf1'}
        ],
        baskets: [
          {emoji:'\ud83e\uddf8', label:'Toy basket', accepts:['toy','block']},
          {emoji:'\ud83d\udc5f', label:'Shoe & book basket', accepts:['book','shoe']}
        ]
      },
      fri: {
        type: 'jump-direction',
        instruction: 'Stretch and jump five times, then point to which pose you\u2019ll show \u2014 butterfly or tree!',
        targetJumps: 5,
        soundEmoji: '\ud83e\udebf',
        directions: [
          {arrow:'\u2b06\ufe0f', correct:true},
          {arrow:'\u2b05\ufe0f', correct:false},
          {arrow:'\u27a1\ufe0f', correct:false}
        ]
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the fruit you\u2019d like to recall today!',
        hotspots: [
          {emoji:'\ud83c\udf4e', label:'Apple'},
          {emoji:'\ud83c\udf4c', label:'Banana'},
          {emoji:'\ud83e\udd6d', label:'Mango'},
          {emoji:'\ud83c\udf47', label:'Grapes'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the vegetable you\u2019d like to recall today.',
        options: [
          {emoji:'\ud83e\udd55', label:'Carrot', correct:true},
          {emoji:'\ud83c\udf4e', label:'Apple', correct:false}
        ]
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\uddfc', text:'Washing hands before eating is a healthy habit.', isTrue:true},
          {emoji:'\ud83e\uddfc', text:'It is fine to never wash our hands.', isTrue:false}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each item as clean or dirty!',
        items: [
          {key:'clean1', emoji:'\u2728'},
          {key:'clean2', emoji:'\ud83d\udc55'},
          {key:'dirty1', emoji:'\ud83e\udee7'},
          {key:'dirty2', emoji:'\ud83e\uddf9'}
        ],
        baskets: [
          {emoji:'\u2728', label:'Clean', accepts:['clean1','clean2']},
          {emoji:'\ud83e\udee7', label:'Dirty', accepts:['dirty1','dirty2']}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'Breathe in, breathe out \u2014 count 5 slow breaths, what comes next?',
        pattern: ['\ud83c\udf2c\ufe0f','\ud83e\uddd8','\ud83c\udf2c\ufe0f','\ud83e\uddd8'],
        options: ['\ud83c\udf2c\ufe0f','\ud83d\ude21','\ud83c\udfc3'],
        answer: '\ud83c\udf2c\ufe0f'
      }
    }
  }
};