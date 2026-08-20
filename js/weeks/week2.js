/* ============================================================
   WEEK 2 — "My Body and Senses" (Term 1, 22-26 Jun 2026)

   Requires js/weeks/weeks-core.js loaded first (see index.html).
   This is the exact same pattern as week1.js — copy this whole
   file's structure for any future week.
   ============================================================ */

WEEK_DAY_TOPICS.wk2 = {
  mon:{value:'Explore how our eyes help us see', link:'Sense of sight'},
  tue:{value:'Listen carefully with our ears', link:'Sense of hearing'},
  wed:{value:'Smell things safely with our nose', link:'Sense of smell'},
  thu:{value:'Taste sweet and salty foods carefully', link:'Sense of taste'},
  fri:{value:'Feel different textures with our skin', link:'Sense of touch'}
};

WEEKLY_PLAN.wk2 = {
  welcome:  {mon:'Body action song; picture observation with eyes', tue:'Free play with body puzzles & sound objects', wed:'Attendance clap count; flower & nose picture play', thu:'Hygiene check; food picture & taste card play', fri:'Weather & body movement; texture object play'},
  story:    {mon:'Rhyme: Head, Shoulders…; Story: My Eyes Can See', tue:'Story: My Healthy Body; Rhyme: Listen, Listen', wed:'Rhyme: Clap Your Hands; Story: My Nose Smells Flowers', thu:'Story: Yoga Keeps Us Calm; Story: My Tongue Tastes Food', fri:'Shahu Maharaj: Every child can learn; Story: My Skin Can Feel'},
  numeracy: {mon:'Count eyes, ears, hands; match eyes to seeing', tue:'Count fingers & toes; guess sound & match to object', wed:'Compare big/small movements; smell flower/lemon safely', thu:'Count claps, jumps, steps; sweet/salty taste talk', fri:'Body counting recap; sort soft/hard by touch'},
  language: {mon:'Body part names; "I see with my eyes."', tue:'Action words clap/jump/sit/stand; "I hear with my ears."', wed:'Healthy-habit words; "I smell with my nose."', thu:'Yoga words breathe/stretch/calm; "I taste with my tongue."', fri:'Words skin, touch; "I touch with my skin."'},
  create:   {mon:'Draw my face; eyes colouring worksheet', tue:'Handprint activity; ears/sound worksheet', wed:'Body parts matching; nose colouring & smell worksheet', thu:'Yoga pose colouring; tongue/taste worksheet', fri:'My body worksheet; texture pasting worksheet'},
  outdoor:  {mon:'Walk & count steps; look & find game', tue:'Jump count; sound direction game', wed:'Balance walk; smell walk', thu:'Yoga pose walk/stretch; taste expression action', fri:'Action game clap/jump/sit/stand; texture walk'},
  reflect:  {mon:'Name one body part; "I see with my eyes."', tue:'Count fingers; "I hear with my ears."', wed:'Show clap/jump; "I smell with my nose."', thu:'Take 3 calm breaths; "I taste with my tongue."', fri:'Equality circle & bye-bye; "I touch with my skin."'}
};

ACTIVITY_COMPETENCIES.wk2 = {
  welcome: {
    mon:'Observes and describes objects using sight', tue:'Explores sound and touch through free play',
    wed:'Participates in attendance and explores smell (flower/nose play)', thu:'Checks personal hygiene and explores taste through pictures',
    fri:'Connects weather to body movement and explores texture'
  },
  story: {
    mon:'Joins a body-parts rhyme and listens to a story about sight', tue:'Listens to a story about a healthy body and joins a listening rhyme',
    wed:'Joins a clapping rhyme and listens to a story about smell', thu:'Listens to stories connecting calmness (yoga) and taste',
    fri:'Listens to a story about equal opportunity and a story about touch'
  },
  numeracy: {
    mon:'Counts eyes, ears and hands; connects eyes to the sense of sight', tue:'Counts fingers and toes; matches a sound to its source',
    wed:'Compares movements as big/small; explores smell safely', thu:'Counts claps, jumps and steps; discusses sweet and salty tastes',
    fri:'Recaps counting body parts; sorts objects as soft or hard by touch'
  },
  language: {
    mon:'Names body parts and says "I see with my eyes."', tue:'Uses action words (clap, jump, sit, stand) and says "I hear with my ears."',
    wed:'Uses healthy-habit words and says "I smell with my nose."', thu:'Uses calming words (breathe, stretch, calm) and says "I taste with my tongue."',
    fri:'Uses touch-related words and says "I touch with my skin."'
  },
  create: {
    mon:'Draws a face and completes an eyes colouring worksheet', tue:'Completes a handprint activity and an ears/sound worksheet',
    wed:'Matches body parts and completes a nose colouring/smell worksheet', thu:'Colours a yoga pose and completes a tongue/taste worksheet',
    fri:'Completes a body worksheet and a texture pasting worksheet'
  },
  outdoor: {
    mon:'Walks while counting steps and plays a look-and-find game', tue:'Jumps while counting and plays a sound-direction game',
    wed:'Walks while maintaining balance and explores smell outdoors', thu:'Performs a yoga-pose walk/stretch and expresses taste through action',
    fri:'Plays an action game (clap/jump/sit/stand) and explores texture on a walk'
  },
  reflect: {
    mon:'Recalls one body part and says "I see with my eyes."', tue:'Counts fingers and says "I hear with my ears."',
    wed:'Demonstrates clap/jump and says "I smell with my nose."', thu:'Takes three calm breaths and says "I taste with my tongue."',
    fri:'Joins an equality circle and says "I touch with my skin."'
  }
};

weeksWithContent.push(2);

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES — 7 tracked domains x 5 days = 35 activities.
// Deliberately varied activity types across the week within each
// domain (not the same game repeated 5x) — same discipline as
// week1.js. See activity-renderers.js for what each "type" needs.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk2 = {
  welcome: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'First sing the welcome song, then tap what you can see.',
        song: {
          lyrics: '"Good morning, friends! We\'re happy today! Welcome to our classroom, come on in and play!"',
          spoken: 'Good morning, friends! We are happy today! Welcome to our classroom, come on in and play!'
        },
        hotspots: [
          {emoji:'📚', label:'A book'},
          {emoji:'🪟', label:'A window'},
          {emoji:'🌳', label:'A tree outside'},
          {emoji:'👦', label:'A friend'}
        ]
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each toy into the right basket — does it make a sound, or is it quiet?',
        items: [
          {key:'bell', emoji:'🔔'},
          {key:'drum', emoji:'🥁'},
          {key:'puzzle', emoji:'🧩'},
          {key:'book', emoji:'📖'}
        ],
        baskets: [
          {emoji:'🔊', label:'Makes a sound', accepts:['bell','drum']},
          {emoji:'🤫', label:'Quiet toy', accepts:['puzzle','book']}
        ]
      },
      wed: {
        type: 'spot-difference',
        instruction: 'It\'s attendance time! Look at both rows of flowers — tap the one in the second row that\'s different.',
        rowA: ['🌸','🌸','🌸','🌸','🌸'],
        rowB: ['🌸','🌸','🌼','🌸','🌸'],
        differentIndex: 2
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'🧼', text:'Washing hands keeps us healthy.', isTrue:true},
          {emoji:'🍬', text:'Eating lots of sweets every day is a healthy habit.', isTrue:false}
        ]
      },
      fri: {
        type: 'maze',
        instruction: 'Walk the weather-and-texture path! Tap each step in order.',
        path: [
          {emoji:'☀️'},
          {emoji:'🧶'},
          {emoji:'🪨'},
          {emoji:'🧊'}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the rhyme, in order!',
        sequence: [
          {emoji:'🙆', label:'Head'},
          {emoji:'🙌', label:'Shoulders'},
          {emoji:'🦵', label:'Knees'},
          {emoji:'🦶', label:'Toes'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'Listen, listen! What sound comes next in the pattern?',
        pattern: ['🔔','🐶','🔔','🐶'],
        options: ['🔔','🐱','🐦'],
        answer: '🔔'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each part of the story to what it means!',
        pairs: [
          {leftEmoji:'👏', left:'Clap your hands', right:'Ready to smell', rightEmoji:'👃'},
          {leftEmoji:'🌸', left:'A pretty flower', right:'Smells sweet', rightEmoji:'😊'},
          {leftEmoji:'👃', left:'My nose', right:'Helps me smell', rightEmoji:'✨'}
        ]
      },
      thu: {
        type: 'spot-difference',
        instruction: 'Look at the story pictures — find the one that\'s different in the second row!',
        rowA: ['🧘','😮\u200d💨','👅','😋'],
        rowB: ['🧘','🧘','👅','😋'],
        differentIndex: 1
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'🤝', text:'Every child deserves a chance to learn.', isTrue:true},
          {emoji:'🤚', text:'We cannot feel anything with our skin.', isTrue:false}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'match-pairs',
        instruction: 'Tap each arrow to match a body part to what it lets us do.',
        pairs: [
          {leftEmoji:'👁️', left:'Eyes', right:'Seeing', rightEmoji:'✨'},
          {leftEmoji:'👂', left:'Ears', right:'Hearing', rightEmoji:'🎵'},
          {leftEmoji:'🤲', left:'Hands', right:'Touching', rightEmoji:'🌟'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'Count along with the pattern — what number comes next?',
        pattern: ['1️⃣','2️⃣','3️⃣','4️⃣'],
        options: ['5️⃣','2️⃣','8️⃣'],
        answer: '5️⃣'
      },
      wed: {
        type: 'sorting',
        instruction: 'Sort each movement or thing as Big or Small!',
        items: [
          {key:'b1', emoji:'🤸'},
          {key:'b2', emoji:'🐘'},
          {key:'s1', emoji:'🐜'},
          {key:'s2', emoji:'🤏'}
        ],
        baskets: [
          {emoji:'⬆️', label:'Big', accepts:['b1','b2']},
          {emoji:'⬇️', label:'Small', accepts:['s1','s2']}
        ]
      },
      thu: {
        type: 'drag-drop',
        instruction: 'Drag each food to Sweet or Salty!',
        items: [
          {key:'honey', emoji:'🍯'},
          {key:'pretzel', emoji:'🥨'}
        ],
        destinations: [
          {emoji:'😊', label:'Sweet', accepts:['honey']},
          {emoji:'😐', label:'Salty', accepts:['pretzel']}
        ]
      },
      fri: {
        type: 'spot-difference',
        instruction: 'One of these feels different from the rest — find the odd one out!',
        rowA: ['🧸','🧸','🧸','🧸'],
        rowB: ['🧸','🪨','🧸','🧸'],
        differentIndex: 1
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'complete-sentence', prefix:'I see with my', answer:'eyes', wrong:['ears','hands'], emoji:'👁️'
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each action word to what it means!',
        pairs: [
          {leftEmoji:'👏', left:'Clap', right:'Hands together', rightEmoji:'🙌'},
          {leftEmoji:'🤸', left:'Jump', right:'Up in the air', rightEmoji:'⬆️'},
          {leftEmoji:'🧍', left:'Stand', right:'Up tall', rightEmoji:'📏'}
        ]
      },
      wed: {
        type: 'complete-sentence', prefix:'I smell with my', answer:'nose', wrong:['ears','tongue'], emoji:'👃'
      },
      thu: {
        type: 'maze',
        instruction: 'Walk the calm-words path — breathe, stretch, calm, taste!',
        path: [
          {emoji:'😮\u200d💨'},
          {emoji:'🧘'},
          {emoji:'😌'},
          {emoji:'👅'}
        ]
      },
      fri: {
        type: 'complete-sentence', prefix:'I touch with my', answer:'skin', wrong:['eyes','tongue'], emoji:'🤚'
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then tap a part of the face to colour it!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4','#FAC775'],
        regions: [
          {emoji:'👁️', label:'Eyes'},
          {emoji:'💇', label:'Hair'},
          {emoji:'👄', label:'Mouth'},
          {emoji:'😊', label:'Cheeks'}
        ]
      },
      tue: {
        type: 'drag-drop',
        instruction: 'Drag each finger sticker onto its matching spot to make a handprint!',
        items: [
          {key:'thumb', emoji:'👍'},
          {key:'pointer', emoji:'☝️'},
          {key:'pinky', emoji:'🤙'}
        ],
        destinations: [
          {emoji:'👍', label:'Thumb spot', accepts:['thumb']},
          {emoji:'☝️', label:'Pointer spot', accepts:['pointer']},
          {emoji:'🤙', label:'Pinky spot', accepts:['pinky']}
        ]
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each body part to what it does, before you colour it in!',
        pairs: [
          {leftEmoji:'👃', left:'Nose', right:'Smells things', rightEmoji:'🌸'},
          {leftEmoji:'👀', left:'Eyes', right:'See colours', rightEmoji:'🎨'},
          {leftEmoji:'😊', left:'Cheeks', right:'Feel warm', rightEmoji:'☀️'}
        ]
      },
      thu: {
        type: 'complete-pattern',
        instruction: 'What colour comes next in the pattern for your yoga-pose colouring?',
        pattern: ['🔴','🔵','🔴','🔵'],
        options: ['🔴','🟡','🟢'],
        answer: '🔴'
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each texture before pasting it onto your worksheet!',
        items: [
          {key:'wool', emoji:'🧶'},
          {key:'cotton', emoji:'☁️'},
          {key:'stone', emoji:'🪨'},
          {key:'wood', emoji:'🪵'}
        ],
        baskets: [
          {emoji:'🧸', label:'Soft', accepts:['wool','cotton']},
          {emoji:'💪', label:'Rough / Hard', accepts:['stone','wood']}
        ]
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'step-count-find',
        instruction: 'Take five steps, then find the hidden toy!',
        targetSteps: 5,
        findEmoji: '🧸',
        findLabel: 'teddy bear'
      },
      tue: {
        type: 'jump-direction',
        instruction: 'Jump five times, then listen for where the sound comes from!',
        targetJumps: 5,
        soundEmoji: '🔔',
        directions: [
          {arrow:'⬅️', correct:false},
          {arrow:'➡️', correct:true},
          {arrow:'⬆️', correct:false}
        ]
      },
      wed: {
        type: 'maze',
        instruction: 'Balance and walk the path, one step at a time, to reach the flower!',
        path: [
          {emoji:'🚶'},
          {emoji:'🚶'},
          {emoji:'⚖️'},
          {emoji:'🌸'}
        ]
      },
      thu: {
        type: 'step-count-find',
        instruction: 'Do five careful yoga steps, then find something yummy to taste!',
        targetSteps: 5,
        findEmoji: '🍯',
        findLabel: 'honey jar'
      },
      fri: {
        type: 'tap-sequence',
        instruction: 'Tap along as you clap, jump, sit, and stand — in order!',
        sequence: [
          {emoji:'👏', label:'Clap'},
          {emoji:'🤸', label:'Jump'},
          {emoji:'🪑', label:'Sit'},
          {emoji:'🧍', label:'Stand'}
        ]
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'true-false',
        statements: [
          {emoji:'👁️', text:'We see with our eyes.', isTrue:true},
          {emoji:'👁️', text:'We see with our ears.', isTrue:false}
        ]
      },
      tue: {
        type: 'complete-sentence', prefix:'I hear with my', answer:'ears', wrong:['eyes','nose'], emoji:'👂'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each recap picture to what we learned today!',
        pairs: [
          {leftEmoji:'👏', left:'Clap or jump', right:'Show me!', rightEmoji:'🙌'},
          {leftEmoji:'👃', left:'Nose', right:'Smelling', rightEmoji:'🌸'}
        ]
      },
      thu: {
        type: 'complete-pattern',
        instruction: 'Take three calm breaths — what comes next in our calm-down pattern?',
        pattern: ['😮\u200d💨','🧘','😮\u200d💨','🧘'],
        options: ['😮\u200d💨','😢','😡'],
        answer: '😮\u200d💨'
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'🤚', text:'We touch with our skin.', isTrue:true},
          {emoji:'🤚', text:'We touch with our eyes.', isTrue:false}
        ]
      }
    }
  }
};