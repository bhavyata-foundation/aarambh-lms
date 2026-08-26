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