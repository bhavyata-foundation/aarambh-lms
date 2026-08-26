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


/* ------------------------------------------------------------
   INTERACTIVE_ACTIVITIES.wkN block removed on purpose — the H5P-
   style interactive activities (match-pairs, complete-sentence,
   tap-explore, true-false, etc.) aren't needed right now.

   Everything else this week's file provides (WEEK_DAY_TOPICS,
   WEEKLY_PLAN, ACTIVITY_COMPETENCIES, weeksWithContent) is left
   exactly as it was — My Day, Daily Plan suggestions, and the
   session cards all still work off that data.

   If these interactive activities are wanted again later, restore
   this file from git history rather than re-authoring by hand.
   ------------------------------------------------------------ */