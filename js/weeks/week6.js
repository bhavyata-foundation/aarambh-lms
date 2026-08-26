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