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
// INTERACTIVE ACTIVITIES — 6 domains x 5 days = 30 activities.
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
        type: 'tap-explore',
        instruction: 'Tap the puzzle pieces and sound objects you can play with!',
        hotspots: [
          {emoji:'🧩', label:'A puzzle piece'},
          {emoji:'🔔', label:'A bell'},
          {emoji:'🥁', label:'A drum'},
          {emoji:'🪗', label:'A shaker'}
        ]
      },
      wed: {
        type: 'tap-explore',
        instruction: 'Tap what you can see at attendance time!',
        hotspots: [
          {emoji:'🌸', label:'A flower'},
          {emoji:'👃', label:'A nose'},
          {emoji:'👏', label:'Clapping hands'},
          {emoji:'📋', label:'The attendance list'}
        ]
      },
      thu: {
        type: 'tap-explore',
        instruction: 'Tap what helps you stay clean and healthy!',
        hotspots: [
          {emoji:'🧼', label:'Soap'},
          {emoji:'🪥', label:'A toothbrush'},
          {emoji:'🍎', label:'A fruit'},
          {emoji:'🍯', label:'Something sweet'}
        ]
      },
      fri: {
        type: 'tap-explore',
        instruction: 'Tap the weather and the things you can feel!',
        hotspots: [
          {emoji:'☀️', label:'Sunny weather'},
          {emoji:'🌧️', label:'Rainy weather'},
          {emoji:'🧶', label:'Something soft'},
          {emoji:'🪨', label:'Something rough'}
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
        type: 'tap-sequence',
        instruction: 'Listen, listen! Tap each sound in order as you hear it.',
        sequence: [
          {emoji:'👂', label:'Listen'},
          {emoji:'🔔', label:'A bell rings'},
          {emoji:'👂', label:'Listen again'},
          {emoji:'🐶', label:'A dog barks'}
        ]
      },
      wed: {
        type: 'tap-sequence',
        instruction: 'Clap your hands, then smell the flower — tap in order!',
        sequence: [
          {emoji:'👏', label:'Clap'},
          {emoji:'👏', label:'Clap again'},
          {emoji:'👃', label:'Smell'},
          {emoji:'🌸', label:'A flower!'}
        ]
      },
      thu: {
        type: 'tap-sequence',
        instruction: 'Sit calmly, breathe, then taste — tap in order!',
        sequence: [
          {emoji:'🧘', label:'Sit calmly'},
          {emoji:'😮\u200d💨', label:'Breathe'},
          {emoji:'👅', label:'Taste'},
          {emoji:'😋', label:'Yum!'}
        ]
      },
      fri: {
        type: 'tap-sequence',
        instruction: 'Feel each texture in order, from soft to warm!',
        sequence: [
          {emoji:'🧶', label:'Soft wool'},
          {emoji:'🪨', label:'Rough stone'},
          {emoji:'🧊', label:'Cold ice'},
          {emoji:'☀️', label:'Warm sun'}
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
        type: 'match-pairs',
        instruction: 'Guess the sound, then match it to what made it!',
        pairs: [
          {leftEmoji:'🐶', left:'Woof woof', right:'Dog', rightEmoji:'🐕'},
          {leftEmoji:'🚗', left:'Beep beep', right:'Car', rightEmoji:'🚙'},
          {leftEmoji:'🐦', left:'Tweet tweet', right:'Bird', rightEmoji:'🕊️'}
        ]
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each movement or smell to the right word!',
        pairs: [
          {leftEmoji:'🙆', left:'A big jump', right:'Big', rightEmoji:'⬆️'},
          {leftEmoji:'🤏', left:'A small step', right:'Small', rightEmoji:'⬇️'},
          {leftEmoji:'🌸', left:'A flower', right:'Sweet smell', rightEmoji:'😊'}
        ]
      },
      thu: {
        type: 'match-pairs',
        instruction: 'Match each taste to the right word!',
        pairs: [
          {leftEmoji:'🍯', left:'Honey', right:'Sweet', rightEmoji:'😊'},
          {leftEmoji:'🥨', left:'Pretzel', right:'Salty', rightEmoji:'😐'},
          {leftEmoji:'🍋', left:'Lemon', right:'Sour', rightEmoji:'😖'}
        ]
      },
      fri: {
        type: 'match-pairs',
        instruction: 'Match each object to how it feels!',
        pairs: [
          {leftEmoji:'🧶', left:'Wool', right:'Soft', rightEmoji:'☁️'},
          {leftEmoji:'🪨', left:'Stone', right:'Hard', rightEmoji:'💪'},
          {leftEmoji:'🧸', left:'Teddy bear', right:'Soft', rightEmoji:'☁️'}
        ]
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'complete-sentence',prefix:'I see with my', answer:'eyes', wrong:['ears','hands'], emoji:'👁️'},
      tue: {
        type: 'complete-sentence',prefix:'I hear with my', answer:'ears', wrong:['eyes','nose'], emoji:'👂'},
      wed: {
        type: 'complete-sentence',prefix:'I smell with my', answer:'nose', wrong:['ears','tongue'], emoji:'👃'},
      thu: {
        type: 'complete-sentence',prefix:'I taste with my', answer:'tongue', wrong:['nose','skin'], emoji:'👅'},
      fri: {
        type: 'complete-sentence',prefix:'I touch with my', answer:'skin', wrong:['eyes','tongue'], emoji:'🤚'}
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
        type: 'colour-fill',
        instruction: 'Pick a colour, then press each finger to make a handprint!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4','#FAC775','#ED93B1'],
        regions: [
          {emoji:'👍', label:'Thumb'},
          {emoji:'☝️', label:'Pointer'},
          {emoji:'🖕', label:'Middle'},
          {emoji:'💍', label:'Ring'},
          {emoji:'🤙', label:'Pinky'}
        ]
      },
      wed: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in the parts of the face near your nose!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4'],
        regions: [
          {emoji:'👃', label:'Nose'},
          {emoji:'👀', label:'Around the eyes'},
          {emoji:'😊', label:'Cheeks'}
        ]
      },
      thu: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in the parts you taste with!',
        palette: ['#F5C4B3','#FAC775','#ED93B1'],
        regions: [
          {emoji:'👅', label:'Tongue'},
          {emoji:'👄', label:'Lips'},
          {emoji:'🦷', label:'Teeth'}
        ]
      },
      fri: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then colour in the parts you feel with!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4'],
        regions: [
          {emoji:'✋', label:'Hand'},
          {emoji:'🦶', label:'Foot'},
          {emoji:'😊', label:'Face'}
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
        type: 'step-count-find',
        instruction: 'Balance and walk five steps, then find something that smells nice!',
        targetSteps: 5,
        findEmoji: '🌸',
        findLabel: 'flower'
      },
      thu: {
        type: 'step-count-find',
        instruction: 'Do five careful yoga steps, then find something yummy to taste!',
        targetSteps: 5,
        findEmoji: '🍯',
        findLabel: 'honey jar'
      },
      fri: {
        type: 'step-count-find',
        instruction: 'Clap, jump, sit, and stand five times, then find something fun to touch!',
        targetSteps: 5,
        findEmoji: '🧶',
        findLabel: 'soft wool ball'
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
        type: 'true-false',
        statements: [
          {emoji:'👂', text:'We hear with our ears.', isTrue:true},
          {emoji:'👂', text:'We hear with our nose.', isTrue:false}
        ]
      },
      wed: {
        type: 'true-false',
        statements: [
          {emoji:'👃', text:'We smell with our nose.', isTrue:true},
          {emoji:'👃', text:'We smell with our eyes.', isTrue:false}
        ]
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'👅', text:'We taste with our tongue.', isTrue:true},
          {emoji:'👅', text:'We taste with our ears.', isTrue:false}
        ]
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