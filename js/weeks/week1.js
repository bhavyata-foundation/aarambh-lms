/* ============================================================
   WEEK 1 — "My Classroom" (Term 1, 15-19 Jun 2026)

   Requires js/weeks/weeks-core.js loaded first (see index.html).
   ============================================================ */

WEEK_DAY_TOPICS.wk1 = {
  mon:{value:'Feel safe and happy in classroom', link:'First week of school'},
  tue:{value:'Keep bag, books, bottle clean and dry', link:'Monsoon readiness'},
  wed:{value:'Share toys and speak kindly', link:'Classroom family value'},
  thu:{value:'Keep things back in proper place', link:'Clean classroom habit'},
  fri:{value:'Be brave, careful and responsible', link:'Shivaji Maharaj courage value'}
};

WEEKLY_PLAN.wk1 = {
  welcome: {
    mon:'Welcome song, explore classroom',
    tue:'Free play with classroom toys',
    wed:'Attendance & classroom talk',
    thu:'Free play with puzzles',
    fri:'Free play with blocks'
  },
  story: {
    mon:'Story: My First Day in Class',
    tue:'Rhyme: Good Morning Teacher',
    wed:'Story: My Classroom Family',
    thu:'Rhyme: Keep Things Clean',
    fri:'Story: Shivaji Maharaj & Courage'
  },
  numeracy: {
    mon:'Identify classroom objects',
    tue:'Sort objects by colour',
    wed:'Sort objects by size',
    thu:'Sort objects by use',
    fri:'Sort objects independently'
  },
  language: {
    mon:'Name: bag, book, pencil, bottle',
    tue:'Colour words: red, blue, yellow',
    wed:'Big / small words',
    thu:'Use words: write, drink, eat, read',
    fri:'Speak: "This is my ___."'
  },
  create: {
    mon:'Draw my school bag',
    tue:'Colour classroom objects',
    wed:'Big-small pasting',
    thu:'Bag item collage',
    fri:'Classroom object worksheet'
  },
  outdoor: {
    mon:'Free outdoor play',
    tue:'Ball play',
    wed:'Balance walk',
    thu:'Ring play',
    fri:'Running game'
  },
  tidy: {
    mon:'Put bag on hook, book on shelf',
    tue:'Return toys to the toy bin',
    wed:'Put pencil and crayon back in the box',
    thu:'"Keep things back in proper place"',
    fri:'Tidy the whole classroom before going home'
  },
  reflect: {
    mon:'Name one classroom object',
    tue:'Name one colour',
    wed:'Show one big object',
    thu:'What do we use pencil for?',
    fri:'Recap & plant-care promise'
  }
};

ACTIVITY_COMPETENCIES.wk1 = {
  welcome: {
    mon:'Settles into classroom routine',
    tue:'Explores classroom toys independently',
    wed:'Participates in attendance and group talk',
    thu:'Engages with puzzles cooperatively',
    fri:'Plays constructively with blocks'
  },
  story: {
    mon:'Listens to and follows a simple story',
    tue:'Joins in a rhyme with actions',
    wed:'Recognises self as part of a classroom family',
    thu:'Connects a rhyme to a real habit (keeping things clean)',
    fri:'Listens to a story about courage and values'
  },
  numeracy: {
    mon:'Names and identifies familiar classroom objects',
    tue:'Sorts objects into groups by colour',
    wed:'Sorts objects into groups by size',
    thu:'Sorts objects into groups by use',
    fri:'Sorts objects into groups independently'
  },
  language: {
    mon:'Names familiar classroom objects (bag, book, pencil, bottle)',
    tue:'Recognises and names basic colour words',
    wed:'Uses opposite words: big / small',
    thu:'Uses action words in context (write, drink, eat, read)',
    fri:'Speaks a simple sentence: "This is my ___."'
  },
  create: {
    mon:'Draws a familiar object from memory',
    tue:'Colours within a shape using appropriate colours',
    wed:'Pastes shapes by size (big/small)',
    thu:'Creates a collage from classroom-object cutouts',
    fri:'Completes a classroom-object worksheet independently'
  },
  outdoor: {
    mon:'Engages in free physical play safely',
    tue:'Throws and catches a ball with basic control',
    wed:'Walks along a line maintaining balance',
    thu:'Plays a turn-based ring game',
    fri:'Runs safely within a defined space'
  },
  tidy: {
    mon:'Returns personal items (bag, book) to their place',
    tue:'Returns shared toys to the toy bin',
    wed:'Returns stationery to its box',
    thu:'Follows the instruction to keep things in their proper place',
    fri:'Helps tidy the whole classroom before leaving'
  },
  reflect: {
    mon:'Recalls and names one classroom object from the day',
    tue:'Recalls one colour learned during the day',
    wed:"Identifies one big object from the day's activities",
    thu:'Explains the use of a pencil in their own words',
    fri:'Recaps the week and makes a simple promise (plant care)'
  }
};

weeksWithContent.push(1);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES — 6 domains × 5 days = 30 activities,
// matching Week 1's real "My Classroom" content.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk1 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'First sing the welcome song, then tap what you can see!',
        song: {
          lyrics: '"Good morning, friends! We\'re happy today! Welcome to our classroom, come on in and play!"',
          spoken: 'Good morning, friends! We are happy today! Welcome to our classroom, come on in and play!'
        },
        hotspots: [
          {emoji:'📖', label:'A book'},
          {emoji:'🪟', label:'A window'},
          {emoji:'🖍️', label:'A chalkboard'},
          {emoji:'🌱', label:'A plant'}
        ]
      },
      tue: {
        type: 'spot-difference',
        instruction: 'One toy is different in the second row — tap it!',
        rowA: ['🚗','🧸','🧩','🧱'],
        rowB: ['🚗','🧸','🎈','🧱'],
        differentIndex: 2
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'📋', text:'We say our name for attendance.', isTrue:true},
          {emoji:'📋', text:'We shout during attendance.', isTrue:false}
        ]
      },
      thu: {
        type: 'match-pairs',
        instruction: 'Match each item to where you find it!',
        pairs: [
          {leftEmoji:'🧩', left:'Puzzle', right:'Picture', rightEmoji:'🖼️'},
          {leftEmoji:'📦', left:'Box', right:'Table', rightEmoji:'🗄️'}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'What comes next in the block pattern?',
        pattern: ['🟥','🟦','🟥','🟦'],
        options: ['🟥','🟩','🔺'],
        answer: '🟥'
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the story, in order!',
        sequence: [
          {emoji:'👋', label:'Wave hello'},
          {emoji:'🪑', label:'Find my seat'},
          {emoji:'🤝', label:'Meet a friend'},
          {emoji:'😊', label:'Sit down'}
        ]
      },
      tue: {
        type: 'tap-sequence',
        instruction: 'Tap along with the rhyme, in order!',
        sequence: [
          {emoji:'☀️', label:'Good morning'},
          {emoji:'😊', label:'Smile'},
          {emoji:'👋', label:'Wave'},
          {emoji:'🪑', label:'Sit down'}
        ]
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'👩‍🏫', text:'A teacher is part of our classroom family.', isTrue:true},
          {emoji:'🐘', text:'An elephant works in our classroom.', isTrue:false}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each action into clean or messy!',
        baskets: [
          {emoji:'✨', label:'Clean', accepts:['wipe','putaway']},
          {emoji:'🌀', label:'Messy', accepts:['spill']}
        ],
        items: [
          {key:'wipe', emoji:'🧽'},
          {key:'putaway', emoji:'📦'},
          {key:'spill', emoji:'💧'}
        ]
      },
      fri: {
        type: 'spot-difference',
        instruction: 'One symbol of courage is different in the second row — tap it!',
        rowA: ['💪','🦾','💛','👑'],
        rowB: ['💪','🛡️','💛','👑'],
        differentIndex: 1
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'sorting',
        instruction: 'Sort each classroom object into the correct basket!',
        baskets: [
          {emoji:'✍️', label:'For writing', accepts:['pencil','crayon']},
          {emoji:'👀', label:'For reading', accepts:['book']}
        ],
        items: [
          {key:'pencil', emoji:'✏️'},
          {key:'crayon', emoji:'🖍️'},
          {key:'book', emoji:'📖'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each object into its colour basket!',
        baskets: [
          {emoji:'🟥', label:'Red', accepts:['apple']},
          {emoji:'🟦', label:'Blue', accepts:['pencil']},
          {emoji:'🟨', label:'Yellow', accepts:['sun']}
        ],
        items: [
          {key:'apple', emoji:'🍎'},
          {key:'pencil', emoji:'✏️'},
          {key:'sun', emoji:'☀️'}
        ]
      },
      wed: {
        type: 'complete-pattern',
        instruction: 'What comes next — big or small?',
        pattern: ['🐘','🐜','🐘','🐜'],
        options: ['🐘','🌳','🎈'],
        answer: '🐘'
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'✏️', text:'We use a pencil for writing.', isTrue:true},
          {emoji:'🍼', text:'We use a bottle for reading.', isTrue:false}
        ]
      },
      fri: {
        type: 'drag-drop',
        instruction: 'Drag each object to what it is used for!',
        destinations: [
          {emoji:'🎨', label:'Colouring', accepts:['crayon']},
          {emoji:'💧', label:'Drinking', accepts:['cup']}
        ],
        items: [
          {key:'crayon', emoji:'🖍️'},
          {key:'cup', emoji:'🥤'}
        ]
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'true-false',
        statements: [
          {emoji:'🎒', text:'This is a bag.', isTrue:true},
          {emoji:'📖', text:'This is a bottle.', isTrue:false},
          {emoji:'✏️', text:'This is a pencil.', isTrue:true}
        ]
      },
      tue: {
        type: 'complete-sentence',prefix:'The apple is', answer:'red', wrong:['blue','yellow'], emoji:'🍎'},
      wed: {
        type: 'spot-difference',
        instruction: 'One object is a different size in the second row — tap it!',
        rowA: ['🐘','🐜','🌳'],
        rowB: ['🐘','🐘','🌳'],
        differentIndex: 1
      },
      thu: {
        type: 'match-pairs',
        instruction: 'Match each action word to what it means!',
        pairs: [
          {leftEmoji:'✏️', left:'Write', right:'Using a pencil', rightEmoji:'✍️'},
          {leftEmoji:'🥤', left:'Drink', right:'Using a bottle', rightEmoji:'💧'}
        ]
      },
      fri: {
        type: 'complete-sentence',prefix:'This is my', answer:'book', wrong:['shoe','hat'], emoji:'📚'}
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in the parts of your school bag!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4','#FAC775'],
        regions: [
          {emoji:'🎒', label:'Main body'},
          {emoji:'👜', label:'Front pocket'},
          {emoji:'➖', label:'Strap'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'What comes next in the pattern?',
        pattern: ['📖','✏️','📖','✏️'],
        options: ['📖','🍼','🧸'],
        answer: '📖'
      },
      wed: {
        type: 'sorting',
        instruction: 'Sort each shape into the big or small basket!',
        baskets: [
          {emoji:'⬆️', label:'Big', accepts:['big']},
          {emoji:'⬇️', label:'Small', accepts:['small']}
        ],
        items: [
          {key:'big', emoji:'⬛'},
          {key:'small', emoji:'▪️'}
        ]
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag each item into your school bag!',
        destinations: [
          {emoji:'🎒', label:'School bag', accepts:['book','pencil','bottle']}
        ],
        items: [
          {key:'book', emoji:'📖'},
          {key:'pencil', emoji:'✏️'},
          {key:'bottle', emoji:'🍼'}
        ]
      },
      fri: {
        type: 'match-pairs',
        instruction: 'Match each piece of furniture to where it belongs!',
        pairs: [
          {leftEmoji:'🗄️', left:'Desk', right:'For working', rightEmoji:'✍️'},
          {leftEmoji:'🪑', left:'Chair', right:'For sitting', rightEmoji:'🧍'}
        ]
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'step-count-find',
        instruction: 'Take five steps outside, then find the hidden ball!',
        targetSteps: 5,
        findEmoji: '⚽',
        findLabel: 'ball'
      },
      tue: {
        type: 'maze',
        instruction: 'Help the ball roll through the playground to the goal!',
        path: [
          {emoji:'⚽'},
          {emoji:'🌳'},
          {emoji:'🪑'},
          {emoji:'🥅'}
        ]
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'🧍', text:'We walk carefully on the balance line.', isTrue:true},
          {emoji:'🧍', text:'We run fast on the balance line.', isTrue:false}
        ]
      },
      thu: {
        type: 'match-pairs',
        instruction: 'Match each ring to its matching peg!',
        pairs: [
          {leftEmoji:'🔴', left:'Red ring', right:'Red peg', rightEmoji:'🔴'},
          {leftEmoji:'🔵', left:'Blue ring', right:'Blue peg', rightEmoji:'🔵'}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'What comes next in the running pattern?',
        pattern: ['🏃','🚶','🏃','🚶'],
        options: ['🏃','🧍','🚗'],
        answer: '🏃'
      }
    }
  },
  tidy: {
    days: {
      mon: {
        type: 'drag-drop',
        instruction: 'Drag each item to where it belongs!',
        destinations: [
          {emoji:'🪝', label:'Hook', accepts:['bag']},
          {emoji:'📚', label:'Book shelf', accepts:['book']}
        ],
        items: [
          {key:'bag', emoji:'🎒'},
          {key:'book', emoji:'📖'}
        ]
      },
      tue: {
        type: 'drag-drop',
        instruction: 'Drag each toy into the toy bin!',
        destinations: [
          {emoji:'🗑️', label:'Toy bin', accepts:['car','teddy','block']}
        ],
        items: [
          {key:'car', emoji:'🚗'},
          {key:'teddy', emoji:'🧸'},
          {key:'block', emoji:'🧱'}
        ]
      },
      wed: {
        type: 'drag-drop',
        instruction: 'Drag the pencil and crayon back into the box!',
        destinations: [
          {emoji:'📦', label:'Pencil box', accepts:['pencil','crayon']}
        ],
        items: [
          {key:'pencil', emoji:'✏️'},
          {key:'crayon', emoji:'🖍️'}
        ]
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Keep things back in their proper place!',
        destinations: [
          {emoji:'🪝', label:'Hook', accepts:['bag']},
          {emoji:'🗑️', label:'Toy bin', accepts:['toy']}
        ],
        items: [
          {key:'bag', emoji:'🎒'},
          {key:'toy', emoji:'🧸'}
        ]
      },
      fri: {
        type: 'drag-drop',
        instruction: 'Tidy the whole classroom before going home!',
        destinations: [
          {emoji:'🪝', label:'Hook', accepts:['bag']},
          {emoji:'📚', label:'Book shelf', accepts:['book']},
          {emoji:'📦', label:'Pencil box', accepts:['pencil']}
        ],
        items: [
          {key:'bag', emoji:'🎒'},
          {key:'book', emoji:'📖'},
          {key:'pencil', emoji:'✏️'}
        ]
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'true-false',
        statements: [
          {emoji:'📖', text:'A book is a classroom object.', isTrue:true},
          {emoji:'🍌', text:'A banana is a classroom object.', isTrue:false}
        ]
      },
      tue: {
        type: 'true-false',
        statements: [
          {emoji:'☀️', text:'The sun is yellow.', isTrue:true},
          {emoji:'🌱', text:'Grass is purple.', isTrue:false}
        ]
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'🐘', text:'An elephant is big.', isTrue:true},
          {emoji:'🐜', text:'An ant is big.', isTrue:false}
        ]
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'✏️', text:'We use a pencil to write.', isTrue:true},
          {emoji:'✏️', text:'We use a pencil to eat.', isTrue:false}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'🌱', text:'We should water our plants.', isTrue:true},
          {emoji:'🌱', text:'We should ignore our plants.', isTrue:false}
        ]
      }
    }
  }
};