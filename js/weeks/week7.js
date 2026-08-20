/* ============================================================
   WEEK 7 — "Nature Patterns" (Term 1, 27-31 Jul 2026)

   Rebuilt from the real spreadsheet
   (Weekly_Activity_Completion_DomainWise_Week7.xlsx). Replaces
   an earlier, incorrect "Animals Around Us" version that was
   designed without a source spreadsheet.
   ============================================================ */

WEEK_DAY_TOPICS.wk7 = {
  mon:{value:'Explore leaves and flowers', link:'Nature Patterns: Leaves & Flowers'},
  tue:{value:'Notice and extend patterns', link:'Nature Patterns: Extending Patterns'},
  wed:{value:'Find what is missing in a pattern', link:'Nature Patterns: Missing Piece'},
  thu:{value:'Create your own nature pattern', link:'Nature Patterns: Make Your Own'},
  fri:{value:'Promise to care for nature', link:'Nature Patterns: Caring for Nature'}
};

WEEKLY_PLAN.wk7 = {
  welcome:  {mon:'Leaf & flower basket exploration', tue:'Free play with nature cards', wed:'Attendance and nature talk', thu:'Hygiene check', fri:'Weather talk'},
  story:    {mon:'Rhyme: Leaves and Flowers', tue:'Story: The Little Seed', wed:'Rhyme: Rain and Trees', thu:'Story: Caring for Nature', fri:'Story: Plants Need Love'},
  numeracy: {mon:'Observe patterns in leaves, flowers, petals & pebbles', tue:'Extend leaf-flower-stone pattern', wed:'Find missing object in pattern strip', thu:'Create own nature pattern', fri:'Nature pattern recap'},
  language: {mon:'Name: leaf, flower, stone', tue:'Shape words: round, long, small', wed:'Sentence: "This is a leaf."', thu:'Talk: "Plants need water."', fri:'Speak: "I made a pattern."'},
  create:   {mon:'Leaf rubbing', tue:'Flower pattern colouring', wed:'Pebble pattern drawing', thu:'Nature collage', fri:'Pattern worksheet'},
  outdoor:  {mon:'Walk-jump-walk pattern', tue:'Leaf collection walk', wed:'Clap-step-clap pattern', thu:'Nature hunt', fri:'Pattern movement game'},
  reflect:  {mon:'Name one nature object', tue:'Name one pattern', wed:'Complete one oral pattern', thu:'Say one nature-care habit', fri:'Nature care promise'}
};

ACTIVITY_COMPETENCIES.wk7 = {
  welcome: {
    mon:'Explores a leaf and flower basket', tue:'Plays freely with nature cards',
    wed:'Participates in attendance and talks about nature', thu:'Checks personal hygiene',
    fri:'Talks about the weather'
  },
  story: {
    mon:'Joins a rhyme about leaves and flowers', tue:'Listens to a story about a little seed',
    wed:'Joins a rhyme about rain and trees', thu:'Listens to a story about caring for nature',
    fri:'Listens to a story about plants needing love'
  },
  numeracy: {
    mon:'Observes patterns in leaves, flowers, petals and pebbles', tue:'Extends a leaf-flower-stone pattern',
    wed:'Finds the missing object in a pattern strip', thu:'Creates their own nature pattern',
    fri:'Recaps nature patterns'
  },
  language: {
    mon:'Learns the words leaf, flower, stone', tue:'Learns the shape words round, long, small',
    wed:'Completes the sentence "This is a leaf."', thu:'Talks about how plants need water',
    fri:'Says "I made a pattern."'
  },
  create: {
    mon:'Makes a leaf rubbing', tue:'Colours a flower pattern',
    wed:'Draws a pebble pattern', thu:'Makes a nature collage',
    fri:'Completes a pattern worksheet'
  },
  outdoor: {
    mon:'Walks a walk-jump-walk pattern', tue:'Goes on a leaf collection walk',
    wed:'Claps a clap-step-clap pattern', thu:'Goes on a nature hunt',
    fri:'Plays a pattern movement game'
  },
  reflect: {
    mon:'Names one nature object', tue:'Names one pattern',
    wed:'Completes one oral pattern', thu:'Says one nature-care habit',
    fri:'Makes a nature care promise'
  }
};

weeksWithContent.push(7);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES — 7 tracked domains x 5 days = 35 activities.
// complete-pattern is used more than usual this week (6 of 35) since
// the real spreadsheet's theme IS pattern recognition/completion —
// numeracy especially is literally "extend the pattern" / "find the
// missing object in the pattern strip", which is exactly what the
// complete-pattern renderer does. Every domain still has >=4 distinct
// types across its own 5 days.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk7 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the basket to explore each leaf and flower!',
        hotspots: [
          {emoji:'🍂', label:'Leaf'},
          {emoji:'🌺', label:'Flower'},
          {emoji:'🌻', label:'Sunflower'},
          {emoji:'🍃', label:'Fallen leaf'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each nature card during free play!',
        items: [
          {key:'leaf1', emoji:'🍂'},
          {key:'leaf2', emoji:'🍃'},
          {key:'flower1', emoji:'🌺'},
          {key:'flower2', emoji:'🌷'}
        ],
        baskets: [
          {emoji:'🍂', label:'Leaves', accepts:['leaf1','leaf2']},
          {emoji:'🌺', label:'Flowers', accepts:['flower1','flower2']}
        ]
      },
      wed: {
        type: 'spot-difference',
        instruction: 'It’s attendance time! Tap the leaf in the second row that’s different.',
        rowA: ['🍂','🍂','🍂','🍂'],
        rowB: ['🍂','🍂','🍃','🍂'],
        differentIndex: 2
      },
      thu: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows clean, washed hands.',
        options: [
          {emoji:'🧼', label:'Washing hands', correct:true},
          {emoji:'🪨', label:'Muddy stone', correct:false}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'☀️', text:'Sunny weather helps plants grow.', isTrue:true},
          {emoji:'🌧️', text:'Plants never need sunlight or rain.', isTrue:false}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the leaves and flowers rhyme, in order!',
        sequence: [
          {emoji:'🍂', label:'A leaf falls'},
          {emoji:'🌺', label:'A flower blooms'},
          {emoji:'🍃', label:'Another leaf'},
          {emoji:'🌷', label:'Another flower'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each stage of the little seed to what happens next!',
        pairs: [
          {leftEmoji:'🌱', left:'Little seed', right:'Gets water', rightEmoji:'💧'},
          {leftEmoji:'🌿', left:'Sprout', right:'Grows into a plant', rightEmoji:'🌿'}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'Rain, tree, rain — what comes next in the rhyme?',
        pattern: ['🌧️','🌳','🌧️'],
        options: ['🌳','☀️','🌺'],
        answer: '🌳'
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'💚', text:'Caring for nature means not littering.', isTrue:true},
          {emoji:'💚', text:'It is fine to throw rubbish on plants.', isTrue:false}
        ]
      },
      fri: {
        type: 'maze',
        instruction: 'Help the water reach the plant that needs love, one step at a time!',
        path: [
          {emoji:'💧'},
          {emoji:'💧'},
          {emoji:'🌱'},
          {emoji:'🌿'}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'complete-pattern',
        instruction: 'Look at the pattern of leaves, flowers, petals and pebbles — what comes next?',
        pattern: ['🍂','🌺','🍂'],
        options: ['🌺','🪨','💧'],
        answer: '🌺'
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each object to its place in the pattern!',
        pairs: [
          {leftEmoji:'🍂', left:'Leaf', right:'First in line', rightEmoji:'1️⃣'},
          {leftEmoji:'🌺', left:'Flower', right:'Second in line', rightEmoji:'2️⃣'}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'Find the missing object in the pattern strip!',
        pattern: ['🍂','🌺','🪨','🍂','🌺'],
        options: ['🪨','💧','🌳'],
        answer: '🪨'
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag each object to build your own nature pattern!',
        items: [
          {key:'leaf', emoji:'🍂'},
          {key:'stone', emoji:'🪨'}
        ],
        destinations: [
          {emoji:'🍂', label:'Leaf spot', accepts:['leaf']},
          {emoji:'🪨', label:'Stone spot', accepts:['stone']}
        ]
      },
      fri: {
        type: 'spot-difference',
        instruction: 'Look at both pattern rows — tap the one that’s different in the second row!',
        rowA: ['🍂','🌺','🪨','🍂'],
        rowB: ['🍂','🌺','🌺','🍂'],
        differentIndex: 2
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'match-pairs',
        instruction: 'Match each name to the correct nature object!',
        pairs: [
          {leftEmoji:'🍂', left:'leaf', right:'Grows on a tree', rightEmoji:'🌳'},
          {leftEmoji:'🪨', left:'stone', right:'Feels hard', rightEmoji:'💪'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a round shape.',
        options: [
          {emoji:'⚪', label:'Round pebble', correct:true},
          {emoji:'🌿', label:'Long grass', correct:false}
        ]
      },
      wed: {
        type: 'complete-sentence', prefix:'This is a', answer:'leaf', wrong:['shoe','spoon'], emoji:'🍂'
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag the word to what plants need!',
        items: [
          {key:'water', emoji:'💧'},
          {key:'sun', emoji:'☀️'}
        ],
        destinations: [
          {emoji:'🌱', label:'Plants need this', accepts:['water','sun']}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'🗣️', text:'Saying "I made a pattern" tells others what you did.', isTrue:true},
          {emoji:'🗣️', text:'We should never talk about our work.', isTrue:false}
        ]
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in your leaf rubbing!',
        palette: ['#639922','#FAC775','#D85A30','#378ADD'],
        regions: [
          {emoji:'🍂', label:'Leaf one'},
          {emoji:'🍃', label:'Leaf two'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each flower shape to its colour before you colour the pattern!',
        pairs: [
          {leftEmoji:'🌻', left:'Sunflower', right:'Yellow', rightEmoji:'🟡'},
          {leftEmoji:'🌷', left:'Tulip', right:'Red', rightEmoji:'🔴'}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'What comes next in the pebble pattern you’re drawing?',
        pattern: ['⚪','⚫','⚪','⚫'],
        options: ['⚪','🍂','🌺'],
        answer: '⚪'
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each item before you glue your nature collage!',
        items: [
          {key:'leaf', emoji:'🍂'},
          {key:'flower', emoji:'🌺'},
          {key:'pebble', emoji:'🪨'},
          {key:'twig', emoji:'🪵'}
        ],
        baskets: [
          {emoji:'🍂', label:'Soft nature bits', accepts:['leaf','flower']},
          {emoji:'🪨', label:'Hard nature bits', accepts:['pebble','twig']}
        ]
      },
      fri: {
        type: 'spot-difference',
        instruction: 'Spot the different pattern before finishing your worksheet!',
        rowA: ['🍂','🌺','🍂','🌺'],
        rowB: ['🍂','🌺','🌺','🌺'],
        differentIndex: 2
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along the walk-jump-walk pattern, in order!',
        sequence: [
          {emoji:'🚶', label:'Walk'},
          {emoji:'🤸', label:'Jump'},
          {emoji:'🚶', label:'Walk'},
          {emoji:'🤸', label:'Jump'}
        ]
      },
      tue: {
        type: 'step-count-find',
        instruction: 'Take five steps on your leaf collection walk, then find a hidden leaf!',
        targetSteps: 5,
        findEmoji: '🍂',
        findLabel: 'leaf'
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'Clap, step, clap — what comes next in the pattern?',
        pattern: ['👏','👣','👏'],
        options: ['👣','🤸','😊'],
        answer: '👣'
      },
      thu: {
        type: 'maze',
        instruction: 'Go on a nature hunt along the path, one step at a time!',
        path: [
          {emoji:'🍂'},
          {emoji:'🌺'},
          {emoji:'🪨'},
          {emoji:'🎉'}
        ]
      },
      fri: {
        type: 'jump-direction',
        instruction: 'Jump five times for the pattern game, then point to what comes next!',
        targetJumps: 5,
        soundEmoji: '🍂',
        directions: [
          {arrow:'➡️', correct:true},
          {arrow:'⬅️', correct:false},
          {arrow:'⬆️', correct:false}
        ]
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the nature object you’d like to name today!',
        hotspots: [
          {emoji:'🍂', label:'Leaf'},
          {emoji:'🌺', label:'Flower'},
          {emoji:'🪨', label:'Stone'},
          {emoji:'🪵', label:'Twig'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a pattern.',
        options: [
          {emoji:'🍂', label:'Leaf, flower, leaf, flower', correct:true},
          {emoji:'🍂', label:'One plain leaf', correct:false}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'Complete this oral pattern out loud — what comes next?',
        pattern: ['🍂','🌺','🍂'],
        options: ['🌺','🪨','💧'],
        answer: '🌺'
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'💚', text:'Watering plants is a way to care for nature.', isTrue:true},
          {emoji:'💚', text:'Stepping on flowers on purpose is caring for nature.', isTrue:false}
        ]
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each action as a promise to nature or not!',
        items: [
          {key:'water', emoji:'💧'},
          {key:'plant', emoji:'🌱'},
          {key:'litter', emoji:'🗑️'},
          {key:'pluck', emoji:'✊'}
        ],
        baskets: [
          {emoji:'💚', label:'I promise to do this', accepts:['water','plant']},
          {emoji:'🚫', label:'I promise NOT to do this', accepts:['litter','pluck']}
        ]
      }
    }
  }
};