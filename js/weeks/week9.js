/* ============================================================
   WEEK 9 \u2014 "Number, Sound & Movement Patterns" (Term 1, 10-14 Aug 2026)

   Rebuilt from the real spreadsheet
   (Weekly_Activity_Completion_DomainWise_Week9.xlsx). Replaces
   an earlier, incorrect "My Body Counts" version that was
   designed without a source spreadsheet.

   Thursday and Friday carry the real curriculum's own patriotic
   content (Kargil Vijay Diwas story, Jai Hind march, teamwork) \u2014
   kept simple and values-focused (bravery, discipline, teamwork),
   matching the spreadsheet's own tone. Friday (14 Aug) is also
   the day the Independence Day festival banner shows (see
   js/weeks/festivals.js, FESTIVALS['wk9-fri']) \u2014 that banner and
   this day's own regular content now reinforce each other.
   ============================================================ */

WEEK_DAY_TOPICS.wk9 = {
  mon:{value:'Explore rhythm and sound patterns', link:'Number, Sound & Movement: Rhythm'},
  tue:{value:'Learn number patterns like 2, 4, 6, 8', link:'Number, Sound & Movement: Number Patterns'},
  wed:{value:'Find missing numbers in a pattern', link:'Number, Sound & Movement: Missing Numbers'},
  thu:{value:'Learn about Kargil Vijay Diwas and brave soldiers', link:'Number, Sound & Movement: Kargil Vijay Diwas'},
  fri:{value:'Celebrate with a Jai Hind march and teamwork', link:'Number, Sound & Movement: Jai Hind & Teamwork'}
};

WEEKLY_PLAN.wk9 = {
  welcome:  {mon:'Rhythm free play', tue:'Free play with number cards', wed:'Attendance and number talk', thu:'Hygiene check', fri:'Weather talk'},
  story:    {mon:'Number rhyme', tue:'Sound story', wed:'Clap name rhyme', thu:'Kargil Vijay Diwas story', fri:'Story: Brave Soldiers / We Move Together'},
  numeracy: {mon:'Clap-stomp-snap pattern', tue:'Number pattern: 2, 4, 6, 8', wed:'Complete missing number: 10, 20, 40', thu:'Create sound + number pattern', fri:'Pattern recap'},
  language: {mon:'Clap own name', tue:'Clap fruit names', wed:'Sort short & long words orally', thu:'Clap rhyme words', fri:'Speak: "I can make a pattern."'},
  create:   {mon:'Draw sound pattern', tue:'Number tracing: 2, 4, 6, 8', wed:'Paste number cards in sequence', thu:'Thank-you card for soldiers / rhythm worksheet', fri:'Pattern / pattern colouring worksheet'},
  outdoor:  {mon:'Clap-tap movement', tue:'Count and jump', wed:'Soldier march with rhythm', thu:'Action pattern game', fri:'Jai Hind march / pattern movement recap'},
  reflect:  {mon:'Show one sound pattern', tue:'Say number pattern', wed:'Clap one word', thu:'Say "Jai Hind" / make one movement pattern', fri:'Discipline value recap / teamwork'}
};

ACTIVITY_COMPETENCIES.wk9 = {
  welcome: {
    mon:'Explores rhythm through free play', tue:'Plays freely with number cards',
    wed:'Participates in attendance and talks about numbers', thu:'Checks personal hygiene',
    fri:'Talks about the weather'
  },
  story: {
    mon:'Joins a number rhyme', tue:'Listens to a sound story',
    wed:'Joins a clap-name rhyme', thu:'Listens to a Kargil Vijay Diwas story about brave soldiers',
    fri:'Listens to a story about brave soldiers and moving together'
  },
  numeracy: {
    mon:'Claps, stomps and snaps a pattern', tue:'Learns the number pattern 2, 4, 6, 8',
    wed:'Completes the missing number in 10, 20, 40', thu:'Creates a sound and number pattern',
    fri:'Recaps patterns'
  },
  language: {
    mon:'Claps out their own name', tue:'Claps out fruit names',
    wed:'Sorts short and long words orally', thu:'Claps out rhyme words',
    fri:'Says "I can make a pattern."'
  },
  create: {
    mon:'Draws a sound pattern', tue:'Traces the numbers 2, 4, 6, 8',
    wed:'Pastes number cards in sequence', thu:'Makes a thank-you card for soldiers and a rhythm worksheet',
    fri:'Completes a pattern colouring worksheet'
  },
  outdoor: {
    mon:'Moves through a clap-tap pattern', tue:'Counts while jumping',
    wed:'Marches with rhythm like a soldier', thu:'Plays an action pattern game',
    fri:'Joins a Jai Hind march and pattern movement recap'
  },
  reflect: {
    mon:'Shows one sound pattern', tue:'Says a number pattern',
    wed:'Claps out one word', thu:'Says "Jai Hind" and makes one movement pattern',
    fri:'Recaps discipline and teamwork'
  }
};

weeksWithContent.push(9);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES \u2014 7 tracked domains x 5 days = 35 activities.
// complete-pattern leans higher again (6 of 35) since numeracy this
// week is literally clap/number pattern completion. Thursday/Friday
// content stays simple and values-focused (bravery, discipline,
// teamwork) rather than depicting any conflict.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk9 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap each instrument to hear its rhythm!',
        hotspots: [
          {emoji:'\ud83e\udd41', label:'Drum'},
          {emoji:'\ud83d\udc4f', label:'Clap'},
          {emoji:'\ud83e\udd42', label:'Castanets'},
          {emoji:'\ud83d\udc63', label:'Stomp'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each number card as small or big!',
        items: [
          {key:'n1', emoji:'1\ufe0f\u20e3'},
          {key:'n2', emoji:'2\ufe0f\u20e3'},
          {key:'n8', emoji:'8\ufe0f\u20e3'},
          {key:'n9', emoji:'9\ufe0f\u20e3'}
        ],
        baskets: [
          {emoji:'\ud83d\udfe2', label:'Small numbers', accepts:['n1','n2']},
          {emoji:'\ud83d\udfe1', label:'Big numbers', accepts:['n8','n9']}
        ]
      },
      wed: {
        type: 'tick-choice',
        instruction: 'Tick the correct number card for attendance.',
        options: [
          {emoji:'5\ufe0f\u20e3', label:'Five', correct:true},
          {emoji:'\ud83d\udd24', label:'Blank card', correct:false}
        ]
      },
      thu: {
        type: 'spot-difference',
        instruction: 'It\u2019s hygiene check time! Tap the item in the second row that\u2019s different.',
        rowA: ['\ud83e\uddfc','\ud83e\uddfc','\ud83e\uddfc','\ud83e\uddfc'],
        rowB: ['\ud83e\uddfc','\ud83e\uddfc','\ud83e\udea5','\ud83e\uddfc'],
        differentIndex: 2
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\u2600\ufe0f', text:'On a bright, sunny day, we can march and celebrate outdoors.', isTrue:true},
          {emoji:'\ud83c\udf27\ufe0f', text:'Weather never matters for outdoor activities.', isTrue:false}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the number rhyme, in order!',
        sequence: [
          {emoji:'1\ufe0f\u20e3', label:'One'},
          {emoji:'2\ufe0f\u20e3', label:'Two'},
          {emoji:'3\ufe0f\u20e3', label:'Three'},
          {emoji:'4\ufe0f\u20e3', label:'Four'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'Loud, soft, loud \u2014 what comes next in the sound story?',
        pattern: ['\ud83d\udd0a','\ud83d\udd09','\ud83d\udd0a'],
        options: ['\ud83d\udd09','\ud83d\udd22','\ud83c\udfc3'],
        answer: '\ud83d\udd09'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each name to how many claps it takes!',
        pairs: [
          {leftEmoji:'\ud83d\udc64', left:'Sam', right:'One clap', rightEmoji:'\ud83d\udc4f'},
          {leftEmoji:'\ud83d\udc64', left:'Anika', right:'Three claps', rightEmoji:'\ud83d\udc4f\ud83d\udc4f\ud83d\udc4f'}
        ]
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83e\udd1d', text:'Soldiers work hard to keep our country safe.', isTrue:true},
          {emoji:'\ud83e\udd1d', text:'Soldiers do not care about our country.', isTrue:false}
        ]
      },
      fri: {
        type: 'maze',
        instruction: 'Help the brave soldiers march together along the path, one step at a time!',
        path: [
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83c\uddee\ud83c\uddf3'}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'complete-pattern',
        instruction: 'Clap, stomp, snap, clap \u2014 what comes next in the pattern?',
        pattern: ['\ud83d\udc4f','\ud83d\udc63','\ud83e\udd0c','\ud83d\udc4f'],
        options: ['\ud83d\udc63','\ud83d\udc4f','\ud83e\udd0c'],
        answer: '\ud83d\udc63'
      },
      tue: {
        type: 'complete-pattern',
        instruction: '2, 4, 6 \u2014 what comes next in the number pattern?',
        pattern: ['2\ufe0f\u20e3','4\ufe0f\u20e3','6\ufe0f\u20e3'],
        options: ['8\ufe0f\u20e3','5\ufe0f\u20e3','9\ufe0f\u20e3'],
        answer: '8\ufe0f\u20e3'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each missing number to the gap it fills!',
        pairs: [
          {leftEmoji:'\u2753', left:'10, ___, 40', right:'20', rightEmoji:'2\ufe0f\u20e30\ufe0f\u20e3'},
          {leftEmoji:'\u2753', left:'10, 20, ___', right:'40', rightEmoji:'4\ufe0f\u20e30\ufe0f\u20e3'}
        ]
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag each sound and number into your new pattern!',
        items: [
          {key:'clap', emoji:'\ud83d\udc4f'},
          {key:'two', emoji:'2\ufe0f\u20e3'}
        ],
        destinations: [
          {emoji:'\ud83d\udc4f', label:'Sound spot', accepts:['clap']},
          {emoji:'2\ufe0f\u20e3', label:'Number spot', accepts:['two']}
        ]
      },
      fri: {
        type: 'spot-difference',
        instruction: 'Look at both pattern rows \u2014 tap the one that\u2019s different in the second row!',
        rowA: ['\ud83d\udc4f','2\ufe0f\u20e3','\ud83d\udc63','4\ufe0f\u20e3'],
        rowB: ['\ud83d\udc4f','2\ufe0f\u20e3','4\ufe0f\u20e3','4\ufe0f\u20e3'],
        differentIndex: 2
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along as you clap out your own name, in order!',
        sequence: [
          {emoji:'\ud83d\udc4f', label:'Clap one'},
          {emoji:'\ud83d\udc4f', label:'Clap two'},
          {emoji:'\ud83d\ude0a', label:'Say your name'},
          {emoji:'\ud83d\udc4b', label:'Wave'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each fruit name to how many claps it takes!',
        pairs: [
          {leftEmoji:'\ud83c\udf4e', left:'apple', right:'Two claps', rightEmoji:'\ud83d\udc4f\ud83d\udc4f'},
          {leftEmoji:'\ud83e\udd6d', left:'mango', right:'Two claps', rightEmoji:'\ud83d\udc4f\ud83d\udc4f'}
        ]
      },
      wed: {
        type: 'sorting',
        instruction: 'Sort each word as short or long!',
        items: [
          {key:'cat', emoji:'\ud83d\udc31'},
          {key:'sun', emoji:'\u2600\ufe0f'},
          {key:'elephant', emoji:'\ud83d\udc18'},
          {key:'butterfly', emoji:'\ud83e\udd8b'}
        ],
        baskets: [
          {emoji:'\ud83d\udd39', label:'Short word', accepts:['cat','sun']},
          {emoji:'\ud83d\udd38', label:'Long word', accepts:['elephant','butterfly']}
        ]
      },
      thu: {
        type: 'tick-choice',
        instruction: 'Tick the word that rhymes with "clap".',
        options: [
          {emoji:'\ud83d\udc4f', label:'tap', correct:true},
          {emoji:'\ud83e\uddf8', label:'toy', correct:false}
        ]
      },
      fri: {
        type: 'complete-sentence', prefix:'I can make a', answer:'pattern', wrong:['shoe','spoon'], emoji:'\ud83d\udd01'
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then draw and colour your sound pattern!',
        palette: ['#D85A30','#FAC775','#639922','#378ADD'],
        regions: [
          {emoji:'\ud83d\udc4f', label:'Clap mark'},
          {emoji:'\ud83d\udc63', label:'Stomp mark'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'What number comes next as you trace 2, 4, 6?',
        pattern: ['2\ufe0f\u20e3','4\ufe0f\u20e3','6\ufe0f\u20e3'],
        options: ['8\ufe0f\u20e3','3\ufe0f\u20e3','9\ufe0f\u20e3'],
        answer: '8\ufe0f\u20e3'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each number card to its place in the sequence before pasting!',
        pairs: [
          {leftEmoji:'1\ufe0f\u20e3', left:'First', right:'Number 1', rightEmoji:'1\ufe0f\u20e3'},
          {leftEmoji:'2\ufe0f\u20e3', left:'Second', right:'Number 2', rightEmoji:'2\ufe0f\u20e3'}
        ]
      },
      thu: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour a thank-you card for soldiers!',
        palette: ['#FF9933','#FFFFFF','#138808'],
        regions: [
          {emoji:'\ud83d\udc9b', label:'Heart'},
          {emoji:'\u2b50', label:'Star'}
        ]
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each colour before finishing your pattern worksheet!',
        items: [
          {key:'orange', emoji:'\ud83d\udfe0'},
          {key:'white', emoji:'\u26aa'},
          {key:'green', emoji:'\ud83d\udfe2'},
          {key:'blue', emoji:'\ud83d\udd35'}
        ],
        baskets: [
          {emoji:'\ud83c\uddee\ud83c\uddf3', label:'Flag colours', accepts:['orange','white','green']},
          {emoji:'\ud83c\udf0a', label:'Other colours', accepts:['blue']}
        ]
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along the clap-tap movement, in order!',
        sequence: [
          {emoji:'\ud83d\udc4f', label:'Clap'},
          {emoji:'\ud83e\udd1a', label:'Tap'},
          {emoji:'\ud83d\udc4f', label:'Clap'},
          {emoji:'\ud83e\udd1a', label:'Tap'}
        ]
      },
      tue: {
        type: 'step-count-find',
        instruction: 'Count five jumps, then find a hidden number card!',
        targetSteps: 5,
        findEmoji: '5\ufe0f\u20e3',
        findLabel: 'number 5 card'
      },
      wed: {
        type: 'maze',
        instruction: 'March with rhythm along the path, one step at a time!',
        path: [
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83d\udc4f'},
          {emoji:'\ud83d\udeb6'},
          {emoji:'\ud83d\udc4f'}
        ]
      },
      thu: {
        type: 'jump-direction',
        instruction: 'Jump five times for the action pattern game, then point to what comes next!',
        targetJumps: 5,
        soundEmoji: '\ud83d\udc4f',
        directions: [
          {arrow:'\u2b06\ufe0f', correct:true},
          {arrow:'\u2b05\ufe0f', correct:false},
          {arrow:'\u27a1\ufe0f', correct:false}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'March, turn, march \u2014 what comes next in our Jai Hind pattern?',
        pattern: ['\ud83d\udeb6','\ud83d\udd04','\ud83d\udeb6'],
        options: ['\ud83d\udd04','\ud83e\udd38','\ud83d\ude0a'],
        answer: '\ud83d\udd04'
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the sound pattern you\u2019d like to show today!',
        hotspots: [
          {emoji:'\ud83d\udc4f', label:'Clap'},
          {emoji:'\ud83d\udc63', label:'Stomp'},
          {emoji:'\ud83e\udd0c', label:'Snap'},
          {emoji:'\ud83e\udd1a', label:'Tap'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the number that comes next: 2, 4, 6, ___.',
        options: [
          {emoji:'8\ufe0f\u20e3', label:'8', correct:true},
          {emoji:'5\ufe0f\u20e3', label:'5', correct:false}
        ]
      },
      wed: {
        type: 'tap-sequence',
        instruction: 'Tap along as you clap out one word, in order!',
        sequence: [
          {emoji:'\ud83d\udc4f', label:'Clap one'},
          {emoji:'\ud83d\udc4f', label:'Clap two'},
          {emoji:'\ud83d\ude0a', label:'Say the word'},
          {emoji:'\ud83d\udc4b', label:'Done'}
        ]
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83c\uddee\ud83c\uddf3', text:'Saying "Jai Hind" shows love for our country.', isTrue:true},
          {emoji:'\ud83c\uddee\ud83c\uddf3', text:'"Jai Hind" is just a random word with no meaning.', isTrue:false}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'Working together, working together \u2014 what comes next in our teamwork pattern?',
        pattern: ['\ud83e\udd1d','\ud83e\udd1d','\ud83e\udd1d'],
        options: ['\ud83e\udd1d','\ud83d\ude21','\ud83d\ude10'],
        answer: '\ud83e\udd1d'
      }
    }
  }
};