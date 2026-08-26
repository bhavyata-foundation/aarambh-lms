/* ============================================================
   WEEK 11 \u2014 "Plants, Seeds & Flowers" (Term 1, 24-28 Aug 2026)

   Built from the real spreadsheet
   (Weekly_Activity_Completion_DomainWise_Week11.xlsx). Friday
   this week (28 Aug) is also when the Raksha Bandhan festival
   banner shows (see js/weeks/festivals.js, FESTIVALS['wk11-fri'])
   \u2014 the banner sits above these regular cards, same as
   Independence Day does on Week 9 Friday; the two don't need to
   share a theme, they just coexist on the same day.
   ============================================================ */

WEEK_DAY_TOPICS.wk11 = {
  mon:{value:'Explore seeds and how plants begin', link:'Plants, Seeds & Flowers: Seeds'},
  tue:{value:'Explore leaves and petals', link:'Plants, Seeds & Flowers: Leaves & Petals'},
  wed:{value:'Learn how a seed grows into a plant', link:'Plants, Seeds & Flowers: Germination'},
  thu:{value:'Learn the parts of a plant', link:'Plants, Seeds & Flowers: Parts of a Plant'},
  fri:{value:'Celebrate flowers and recap the week', link:'Plants, Seeds & Flowers: Flowers & Recap'}
};

WEEKLY_PLAN.wk11 = {
  welcome:  {mon:'Seed sorting free play (kidney beans, green gram)', tue:'Exploring textures of real leaves & petals', wed:'Play with garden tool props & watering cans', thu:'Observing kitchen sprouts with magnifying lenses', fri:'Flower flashcard matching & garden box play'},
  story:    {mon:'Story: The Tiny Seed\u2019s Big Journey', tue:'Rhyme: Little Plant in the Deep Heart of a Seed', wed:'Story: Grandpa\u2019s Magical Monsoon Garden', thu:'Rhyme: Roots, Stem, Leaves & Flowers Song', fri:'Story: The Sunflower That Followed the Sun'},
  numeracy: {mon:'Count & group seeds into sets of 5', tue:'Sort real green leaves by size', wed:'Sequence the 4 stages of seed germination', thu:'Match flower cut-outs to leaf shadows', fri:'Plant lifecycle sorting recap'},
  language: {mon:'Vocabulary: seed, soil, root, stem', tue:'Vocabulary: leaf, flower, petal, bud', wed:'Vocabulary: sprout, growth, sunlight, water', thu:'Sentence: "Plants need sunlight and water to grow."', fri:'Sentence: "I must take care of my little plant."'},
  create:   {mon:'Seed pasting inside a leaf outline', tue:'Thumbprint painting on flower cluster', wed:'Leaf rubbing art with green crayons', thu:'Tearing brown paper for roots & stems', fri:'Flower bouquet collage worksheet'},
  outdoor:  {mon:'\u201cGrow Like a Seed\u201d curl-to-stretch game', tue:'Carrying mini watering cans to school patches', wed:'\u201cSwaying Flowers in the Wind\u201d balancing walk', thu:'Hopscotch on chalk-drawn leaf patterns', fri:'\u201cPollen Gathering Bees\u201d directional tag game'},
  reflect:  {mon:'Name one crucial part of a plant', tue:'State what a seed needs to sprout', wed:'Identify your favourite flower colour', thu:'Repeat \u201cPlants need sun\u201d sentence', fri:'Week 11 concepts & gardening recap'}
};

ACTIVITY_COMPETENCIES.wk11 = {
  welcome: {
    mon:'Sorts real seeds through free play', tue:'Explores the textures of real leaves and petals',
    wed:'Plays with garden tool props and watering cans', thu:'Observes kitchen sprouts using magnifying lenses',
    fri:'Matches flower flashcards and plays with a garden box'
  },
  story: {
    mon:'Listens to a story about a seed\u2019s journey', tue:'Joins a rhyme about a plant inside a seed',
    wed:'Listens to a story about a monsoon garden', thu:'Joins a rhyme about roots, stems, leaves and flowers',
    fri:'Listens to a story about a sunflower following the sun'
  },
  numeracy: {
    mon:'Counts and groups seeds into sets of 5', tue:'Sorts real leaves by size',
    wed:'Sequences the four stages of seed germination', thu:'Matches flower cut-outs to leaf shadows',
    fri:'Recaps sorting the plant lifecycle'
  },
  language: {
    mon:'Learns the words seed, soil, root, stem', tue:'Learns the words leaf, flower, petal, bud',
    wed:'Learns the words sprout, growth, sunlight, water', thu:'Completes the sentence "Plants need sunlight and water to grow."',
    fri:'Completes the sentence "I must take care of my little plant."'
  },
  create: {
    mon:'Pastes seeds inside a leaf outline', tue:'Thumbprint-paints a flower cluster',
    wed:'Makes leaf rubbing art with green crayons', thu:'Tears brown paper for roots and stems',
    fri:'Completes a flower bouquet collage worksheet'
  },
  outdoor: {
    mon:'Plays a "grow like a seed" curl-to-stretch game', tue:'Carries mini watering cans to school patches',
    wed:'Plays a "swaying flowers in the wind" balancing walk', thu:'Hops on chalk-drawn leaf patterns',
    fri:'Plays a "pollen gathering bees" directional tag game'
  },
  reflect: {
    mon:'Names one crucial part of a plant', tue:'States what a seed needs to sprout',
    wed:'Identifies their favourite flower colour', thu:'Repeats "Plants need sun"',
    fri:'Recaps Week 11\u2019s concepts and gardening'
  }
};

weeksWithContent.push(11);


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