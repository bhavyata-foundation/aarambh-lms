/* =========================================================
   ALL WEEKS — every authored week's curriculum content lives
   in this ONE file, so adding a new week never means editing
   index.html or main.js — just add a new wkN block below and
   push its number into weeksWithContent.

   This file must load BEFORE main.js (see index.html).
   ========================================================= */

const WEEKLY_PLAN = {};
const ACTIVITY_COMPETENCIES = {};
const weeksWithContent = [];

// Per-week sidebar day topics — this is separate from WEEKLY_PLAN
// (which holds each domain's activity text). WEEK_DAY_TOPICS is
// specifically the short "value" and "link" shown in the sidebar's
// day checklist. Every authored week needs its own entry here —
// this was previously a single hardcoded list in main.js that never
// varied by week, showing Week 1's topics under every other week.
const WEEK_DAY_TOPICS = {};

WEEK_DAY_TOPICS.wk1 = {
  mon:{value:'Feel safe and happy in classroom', link:'First week of school'},
  tue:{value:'Keep bag, books, bottle clean and dry', link:'Monsoon readiness'},
  wed:{value:'Share toys and speak kindly', link:'Classroom family value'},
  thu:{value:'Keep things back in proper place', link:'Clean classroom habit'},
  fri:{value:'Be brave, careful and responsible', link:'Shivaji Maharaj courage value'}
};

WEEK_DAY_TOPICS.wk2 = {
  mon:{value:'Explore how our eyes help us see', link:'Sense of sight'},
  tue:{value:'Listen carefully with our ears', link:'Sense of hearing'},
  wed:{value:'Smell things safely with our nose', link:'Sense of smell'},
  thu:{value:'Taste sweet and salty foods carefully', link:'Sense of taste'},
  fri:{value:'Feel different textures with our skin', link:'Sense of touch'}
};

WEEK_DAY_TOPICS.wk3 = {
  mon:{value:'Learn the names of common vegetables', link:'Identifying vegetables'},
  tue:{value:'Sort vegetables by their colour', link:'Colours in nature'},
  wed:{value:'Sort vegetables by their shape', link:'Shapes in nature'},
  thu:{value:'Count vegetables up to five', link:'Early counting'},
  fri:{value:'Talk about why vegetables are healthy', link:'Healthy eating'}
};

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES — the actual content behind the vibrant
// generic game renderers in main.js (renderMatchPairsActivity,
// renderCompleteSentenceActivity). main.js contains NO week-specific
// data at all — it only knows how to render whatever "type" of
// activity is defined here, for whichever week is currently active.
// A week with nothing defined here simply falls back to main.js's
// original built-in generic games for that domain.
// -----------------------------------------------------------------
const INTERACTIVE_ACTIVITIES = {};

INTERACTIVE_ACTIVITIES.wk2 = {
  welcome: {
    type: 'tap-explore',
    days: {
      mon: {
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
        instruction: 'Tap the puzzle pieces and sound objects you can play with!',
        hotspots: [
          {emoji:'🧩', label:'A puzzle piece'},
          {emoji:'🔔', label:'A bell'},
          {emoji:'🥁', label:'A drum'},
          {emoji:'🪗', label:'A shaker'}
        ]
      },
      wed: {
        instruction: 'Tap what you can see at attendance time!',
        hotspots: [
          {emoji:'🌸', label:'A flower'},
          {emoji:'👃', label:'A nose'},
          {emoji:'👏', label:'Clapping hands'},
          {emoji:'📋', label:'The attendance list'}
        ]
      },
      thu: {
        instruction: 'Tap what helps you stay clean and healthy!',
        hotspots: [
          {emoji:'🧼', label:'Soap'},
          {emoji:'🪥', label:'A toothbrush'},
          {emoji:'🍎', label:'A fruit'},
          {emoji:'🍯', label:'Something sweet'}
        ]
      },
      fri: {
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
    type: 'tap-sequence',
    days: {
      mon: {
        instruction: 'Tap along with the rhyme, in order!',
        sequence: [
          {emoji:'🙆', label:'Head'},
          {emoji:'🙌', label:'Shoulders'},
          {emoji:'🦵', label:'Knees'},
          {emoji:'🦶', label:'Toes'}
        ]
      },
      tue: {
        instruction: 'Listen, listen! Tap each sound in order as you hear it.',
        sequence: [
          {emoji:'👂', label:'Listen'},
          {emoji:'🔔', label:'A bell rings'},
          {emoji:'👂', label:'Listen again'},
          {emoji:'🐶', label:'A dog barks'}
        ]
      },
      wed: {
        instruction: 'Clap your hands, then smell the flower — tap in order!',
        sequence: [
          {emoji:'👏', label:'Clap'},
          {emoji:'👏', label:'Clap again'},
          {emoji:'👃', label:'Smell'},
          {emoji:'🌸', label:'A flower!'}
        ]
      },
      thu: {
        instruction: 'Sit calmly, breathe, then taste — tap in order!',
        sequence: [
          {emoji:'🧘', label:'Sit calmly'},
          {emoji:'😮\u200d💨', label:'Breathe'},
          {emoji:'👅', label:'Taste'},
          {emoji:'😋', label:'Yum!'}
        ]
      },
      fri: {
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
    type: 'match-pairs',
    days: {
      mon: {
        instruction: 'Tap each arrow to match a body part to what it lets us do.',
        pairs: [
          {leftEmoji:'👁️', left:'Eyes', right:'Seeing', rightEmoji:'✨'},
          {leftEmoji:'👂', left:'Ears', right:'Hearing', rightEmoji:'🎵'},
          {leftEmoji:'🤲', left:'Hands', right:'Touching', rightEmoji:'🌟'}
        ]
      },
      tue: {
        instruction: 'Guess the sound, then match it to what made it!',
        pairs: [
          {leftEmoji:'🐶', left:'Woof woof', right:'Dog', rightEmoji:'🐕'},
          {leftEmoji:'🚗', left:'Beep beep', right:'Car', rightEmoji:'🚙'},
          {leftEmoji:'🐦', left:'Tweet tweet', right:'Bird', rightEmoji:'🕊️'}
        ]
      },
      wed: {
        instruction: 'Match each movement or smell to the right word!',
        pairs: [
          {leftEmoji:'🙆', left:'A big jump', right:'Big', rightEmoji:'⬆️'},
          {leftEmoji:'🤏', left:'A small step', right:'Small', rightEmoji:'⬇️'},
          {leftEmoji:'🌸', left:'A flower', right:'Sweet smell', rightEmoji:'😊'}
        ]
      },
      thu: {
        instruction: 'Match each taste to the right word!',
        pairs: [
          {leftEmoji:'🍯', left:'Honey', right:'Sweet', rightEmoji:'😊'},
          {leftEmoji:'🥨', left:'Pretzel', right:'Salty', rightEmoji:'😐'},
          {leftEmoji:'🍋', left:'Lemon', right:'Sour', rightEmoji:'😖'}
        ]
      },
      fri: {
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
    type: 'complete-sentence',
    days: {
      mon: {prefix:'I see with my', answer:'eyes', wrong:['ears','hands'], emoji:'👁️'},
      tue: {prefix:'I hear with my', answer:'ears', wrong:['eyes','nose'], emoji:'👂'},
      wed: {prefix:'I smell with my', answer:'nose', wrong:['ears','tongue'], emoji:'👃'},
      thu: {prefix:'I taste with my', answer:'tongue', wrong:['nose','skin'], emoji:'👅'},
      fri: {prefix:'I touch with my', answer:'skin', wrong:['eyes','tongue'], emoji:'🤚'}
    }
  },
  create: {
    type: 'colour-fill',
    days: {
      mon: {
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
        instruction: 'Pick a colour, then colour in the parts of the face near your nose!',
        palette: ['#F5C4B3','#9FE1CB','#B5D4F4'],
        regions: [
          {emoji:'👃', label:'Nose'},
          {emoji:'👀', label:'Around the eyes'},
          {emoji:'😊', label:'Cheeks'}
        ]
      },
      thu: {
        instruction: 'Pick a colour, then colour in the parts you taste with!',
        palette: ['#F5C4B3','#FAC775','#ED93B1'],
        regions: [
          {emoji:'👅', label:'Tongue'},
          {emoji:'👄', label:'Lips'},
          {emoji:'🦷', label:'Teeth'}
        ]
      },
      fri: {
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
  }
};

const WEEKS = [
  {w:1, theme:'My Classroom', dates:'15–19 Jun 2026'},
  {w:2, theme:'My Body and Senses', dates:'22–26 Jun 2026'},
  {w:3, theme:'Vegetables', dates:'29 Jun–3 Jul 2026'},
  {w:4, theme:'Fruits', dates:'6–10 Jul 2026'},
  {w:5, theme:'Nature Patterns', dates:'13–17 Jul 2026'},
  {w:6, theme:'Beads & Jewellery', dates:'20–24 Jul 2026'},
  {w:7, theme:'Animals Around Us', dates:'27–31 Jul 2026'},
  {w:8, theme:'Number, Sound & Movement', dates:'3–7 Aug 2026'},
  {w:9, theme:'My Body Counts', dates:'10–14 Aug 2026'},
  {w:10, theme:'Counting Classroom Items', dates:'17–21 Aug 2026'},
  {w:11, theme:'Food and Snacks Counting', dates:'24–28 Aug 2026'},
  {w:12, theme:'Counting with Sticks', dates:'31 Aug–4 Sep 2026'},
  {w:13, theme:'Number Line Walk', dates:'7–11 Sep 2026'},
  {w:14, theme:'Group Counting', dates:'14–18 Sep 2026'}
];


/* ============================================================
   WEEK 1 — "My Classroom" (Term 1, 15-19 Jun 2026)
   ============================================================ */

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


/* ============================================================
   WEEK 2 — "My Body and Senses" (Term 1, 22-26 Jun 2026)
   Real content from the official Bhavyata Foundation weekly
   activity completion sheet (Week 2, uploaded PDF).

   NOTE: the official sheet tracks "Snack/Hygiene" (10:15-10:25,
   CG-3/CG-4) instead of "Tidy & Put Away" — that domain isn't
   part of this week's real content, so `tidy` is deliberately
   left unset here. Pending decision: whether to add
   Snack/Hygiene as a real tracked domain in DOMAINS (main.js).
   ============================================================ */

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


/* ============================================================
   WEEK 3 — "Vegetables" (Term 1, 29 Jun-3 Jul 2026)
   ============================================================ */

WEEKLY_PLAN.wk3 = {
  welcome:  {mon:'Welcome song, explore vegetable basket', tue:'Free play — vegetable sorting toys', wed:'Attendance & vegetable talk', thu:'Free play with vegetable puzzles', fri:'Free play — vegetable market corner'},
  story:    {mon:'Story: The Big Vegetable Garden', tue:'Rhyme: Vegetable Song', wed:'Story: Why We Eat Vegetables', thu:'Rhyme: Dal and Sabzi', fri:'Story: The Farmer and His Field'},
  numeracy: {mon:'Identify and name vegetables', tue:'Sort vegetables by colour', wed:'Sort vegetables by shape', thu:'Count vegetables up to 5', fri:'Sort vegetables independently'},
  language: {mon:'Name: potato, tomato, onion, brinjal', tue:'Colour words for vegetables (green, red, purple)', wed:'Words: round, long, small', thu:'Action words: cut, wash, cook, eat', fri:'Speak: "I like to eat ___."'},
  create:   {mon:'Draw a vegetable', tue:'Colour vegetable cutouts', wed:'Vegetable printing (potato/lady finger stamps)', thu:'Vegetable basket collage', fri:'Vegetable worksheet'},
  outdoor:  {mon:'Free outdoor play', tue:'Vegetable relay race (carry and place)', wed:'Balance walk carrying a toy vegetable', thu:'Vegetable-picking pretend play', fri:'Running game — "market run"'},
  tidy:     {mon:'Put vegetable toys back in the basket', tue:'Wipe the play table after art', wed:'Return cutting tools to their place', thu:'Keep the vegetable corner organised', fri:'Tidy the whole classroom before going home'},
  reflect:  {mon:'Name one vegetable seen today', tue:'Name one colour of a vegetable', wed:'Show one round vegetable', thu:'Say why vegetables are healthy', fri:'Recap vegetables learned this week'}
};

ACTIVITY_COMPETENCIES.wk3 = {
  welcome: {
    mon:'Explores real vegetables during free play', tue:'Engages with vegetable sorting toys',
    wed:'Participates in attendance and vegetable talk', thu:'Completes simple vegetable puzzles',
    fri:'Engages in pretend vegetable-market play'
  },
  story: {
    mon:'Listens to a story about a vegetable garden', tue:'Joins a rhyme naming vegetables',
    wed:'Connects a story to healthy eating habits', thu:'Joins a rhyme about everyday food (dal, sabzi)',
    fri:'Listens to a story about farming'
  },
  numeracy: {
    mon:'Identifies and names common vegetables', tue:'Sorts vegetables into groups by colour',
    wed:'Sorts vegetables into groups by shape', thu:'Counts vegetables up to 5',
    fri:'Sorts vegetables into groups independently'
  },
  language: {
    mon:'Names common vegetables (potato, tomato, onion, brinjal)', tue:'Names colours associated with vegetables',
    wed:'Uses shape words: round, long, small', thu:'Uses action words related to cooking (cut, wash, cook, eat)',
    fri:'Speaks a simple sentence: "I like to eat ___."'
  },
  create: {
    mon:'Draws a vegetable from observation', tue:'Colours vegetable cutouts appropriately',
    wed:'Creates a print using a vegetable stamp', thu:'Creates a vegetable-basket collage',
    fri:'Completes a vegetable worksheet independently'
  },
  outdoor: {
    mon:'Engages in free physical play safely', tue:'Completes a simple relay carrying an object',
    wed:'Walks while balancing an object', thu:'Engages in cooperative pretend play',
    fri:'Runs safely in a group game'
  },
  tidy: {
    mon:'Returns toys to their designated basket', tue:'Wipes a surface after an activity',
    wed:'Returns tools to their proper place', thu:'Keeps a classroom corner organised',
    fri:'Helps tidy the whole classroom before leaving'
  },
  reflect: {
    mon:'Recalls and names one vegetable from the day', tue:'Recalls one colour of a vegetable',
    wed:'Identifies one round vegetable', thu:'States one reason vegetables are healthy',
    fri:'Recaps vegetables learned during the week'
  }
};

weeksWithContent.push(3);


/* ============================================================
   ADD NEW WEEKS BELOW THIS LINE.
   Copy the Week 3 block above as a template:
     WEEKLY_PLAN.wk4 = {...};
     ACTIVITY_COMPETENCIES.wk4 = {...};
     weeksWithContent.push(4);
   No changes needed anywhere else — not in index.html, not in
   main.js. Just add the block and save this file.
   ============================================================ */