/* ============================================================
   WEEK 3 — "Emotions and Feelings" (Term 1, 29 Jun-3 Jul 2026)

   Requires js/weeks/weeks-core.js loaded first (see index.html).
   Same pattern as week1.js/week2.js — copy this whole file's
   structure for any future week.
   ============================================================ */

WEEK_DAY_TOPICS.wk3 = {
  mon:{value:'Explore how happy feels', link:'Feeling: Happy'},
  tue:{value:'Notice when we feel sad', link:'Feeling: Sad'},
  wed:{value:'Talk about feeling angry or scared', link:'Feeling: Angry / Scared'},
  thu:{value:'Practise calming down when upset', link:'Feeling: Calm'},
  fri:{value:'Show kindness to others', link:'Feeling: Kindness'}
};

WEEKLY_PLAN.wk3 = {
  welcome:  {mon:'Feeling cards free play', tue:'Hygiene check and calm start', wed:'Attendance with feeling check', thu:'Mirror face play', fri:'Weather and mood talk'},
  story:    {mon:'Story: I Feel Happy', tue:'Rhyme: If You\u2019re Happy', wed:'Story: When I Feel Sad', thu:'Story: Calm Down Little Child', fri:'Story: Kind Words Help'},
  numeracy: {mon:'Match happy and sad faces', tue:'Sort happy/sad/angry/scared faces', wed:'Count feeling faces', thu:'Match situation with feeling', fri:'Feelings sorting recap'},
  language: {mon:'Words: happy, sad', tue:'Words: angry, scared', wed:'Sentence: "I feel ___."', thu:'Sentence: "I am calm."', fri:'Feeling sentence recap'},
  create:   {mon:'Happy-sad face colouring', tue:'Emotion face matching', wed:'Draw my feeling face', thu:'Situation-feeling worksheet', fri:'My feelings card'},
  outdoor:  {mon:'Happy-sad action walk', tue:'Emotion freeze game', wed:'Feeling circle game', thu:'Calm breathing with stretch', fri:'Kindness movement game'},
  reflect:  {mon:'Name one feeling', tue:'Show one feeling face', wed:'Say "I feel ___."', thu:'Say "I am calm."', fri:'Share one kind action'}
};

ACTIVITY_COMPETENCIES.wk3 = {
  welcome: {
    mon:'Explores feeling cards through free play', tue:'Checks personal hygiene and begins the day calmly',
    wed:'Participates in attendance and names a feeling', thu:'Uses a mirror to explore facial expressions',
    fri:'Connects weather to mood'
  },
  story: {
    mon:'Listens to a story about feeling happy', tue:'Joins a rhyme about happiness',
    wed:'Listens to a story about feeling sad', thu:'Listens to a story about calming down',
    fri:'Listens to a story about kind words'
  },
  numeracy: {
    mon:'Matches happy and sad faces', tue:'Sorts faces by four basic feelings',
    wed:'Counts feeling faces', thu:'Matches a situation to the feeling it causes',
    fri:'Recaps sorting feelings'
  },
  language: {
    mon:'Learns the words happy and sad', tue:'Learns the words angry and scared',
    wed:'Completes the sentence "I feel ___."', thu:'Completes the sentence "I am calm."',
    fri:'Recaps feeling sentences'
  },
  create: {
    mon:'Colours happy and sad faces', tue:'Matches emotion faces to their names',
    wed:'Draws their own feeling face', thu:'Completes a situation-feeling worksheet',
    fri:'Makes a feelings card'
  },
  outdoor: {
    mon:'Walks while acting out happy and sad', tue:'Plays an emotion freeze game',
    wed:'Plays a feeling circle game', thu:'Practises calm breathing with a stretch',
    fri:'Plays a kindness movement game'
  },
  reflect: {
    mon:'Names one feeling', tue:'Shows one feeling face',
    wed:'Says "I feel ___."', thu:'Says "I am calm."',
    fri:'Shares one kind action'
  }
};

weeksWithContent.push(3);


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