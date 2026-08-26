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