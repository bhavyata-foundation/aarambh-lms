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

// -----------------------------------------------------------------
// INTERACTIVE ACTIVITIES \u2014 7 tracked domains x 5 days = 35 activities.
// Numeracy leans on sequencing/sorting this week since the real
// content is literally "sequence the 4 stages of germination" and
// "sort leaves by size" \u2014 exact fits for tap-sequence and sorting.
// -----------------------------------------------------------------
INTERACTIVE_ACTIVITIES.wk11 = {
  welcome: {
    days: {
      mon: {
        type: 'sorting',
        instruction: 'Sort each seed by its type!',
        items: [
          {key:'kidney1', emoji:'\ud83e\udd58'},
          {key:'kidney2', emoji:'\ud83e\udd58'},
          {key:'green1', emoji:'\ud83c\udf31'},
          {key:'green2', emoji:'\ud83c\udf31'}
        ],
        baskets: [
          {emoji:'\ud83e\udd58', label:'Kidney beans', accepts:['kidney1','kidney2']},
          {emoji:'\ud83c\udf31', label:'Green gram', accepts:['green1','green2']}
        ]
      },
      tue: {
        type: 'tap-explore',
        instruction: 'Tap each leaf and petal to feel its texture!',
        hotspots: [
          {emoji:'\ud83c\udf42', label:'Rough leaf'},
          {emoji:'\ud83c\udf3a', label:'Soft petal'},
          {emoji:'\ud83c\udf43', label:'Smooth leaf'},
          {emoji:'\ud83c\udf37', label:'Delicate petal'}
        ]
      },
      wed: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a watering can.',
        options: [
          {emoji:'\ud83e\udea3', label:'Watering can', correct:true},
          {emoji:'\ud83e\udea4', label:'Basket', correct:false}
        ]
      },
      thu: {
        type: 'spot-difference',
        instruction: 'Look at the sprout pictures under the magnifying lens \u2014 tap the one that\u2019s different in the second row!',
        rowA: ['\ud83c\udf31','\ud83c\udf31','\ud83c\udf31','\ud83c\udf31'],
        rowB: ['\ud83c\udf31','\ud83c\udf31','\ud83c\udf3f','\ud83c\udf31'],
        differentIndex: 2
      },
      fri: {
        type: 'match-pairs',
        instruction: 'Match each flower flashcard to its name!',
        pairs: [
          {leftEmoji:'\ud83c\udf3b', left:'Sunflower', right:'Yellow and round', rightEmoji:'\u2600\ufe0f'},
          {leftEmoji:'\ud83c\udf37', left:'Tulip', right:'Cup-shaped', rightEmoji:'\ud83c\udf6f'}
        ]
      }
    }
  },
  story: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along with the tiny seed\u2019s big journey, in order!',
        sequence: [
          {emoji:'\ud83c\udf31', label:'A tiny seed'},
          {emoji:'\ud83c\udf27\ufe0f', label:'Gets rain'},
          {emoji:'\u2600\ufe0f', label:'Gets sun'},
          {emoji:'\ud83c\udf3f', label:'Grows up'}
        ]
      },
      tue: {
        type: 'complete-pattern',
        instruction: 'Seed, sprout, seed \u2014 what comes next in the rhyme?',
        pattern: ['\ud83c\udf31','\ud83c\udf3f','\ud83c\udf31'],
        options: ['\ud83c\udf3f','\ud83c\udf3a','\u2600\ufe0f'],
        answer: '\ud83c\udf3f'
      },
      wed: {
        type: 'match-pairs',
        instruction: 'Match each item to grandpa\u2019s garden!',
        pairs: [
          {leftEmoji:'\ud83c\udf27\ufe0f', left:'Monsoon rain', right:'Waters the garden', rightEmoji:'\ud83c\udf31'},
          {leftEmoji:'\ud83e\udea3', left:'Watering can', right:'Helps plants grow', rightEmoji:'\ud83c\udf3f'}
        ]
      },
      thu: {
        type: 'maze',
        instruction: 'Follow the plant\u2019s journey \u2014 roots, stem, leaves, flowers \u2014 one step at a time!',
        path: [
          {emoji:'\ud83c\udfaf'},
          {emoji:'\ud83c\udf3e'},
          {emoji:'\ud83c\udf42'},
          {emoji:'\ud83c\udf3a'}
        ]
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83c\udf3b', text:'A sunflower turns to follow the sun.', isTrue:true},
          {emoji:'\ud83c\udf3b', text:'A sunflower never needs any sunlight.', isTrue:false}
        ]
      }
    }
  },
  numeracy: {
    days: {
      mon: {
        type: 'complete-pattern',
        instruction: 'Count and group the seeds \u2014 how many make the next set of 5?',
        pattern: ['\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31','\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31'],
        options: ['\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31','\ud83c\udf31\ud83c\udf31','\ud83c\udf31'],
        answer: '\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31\ud83c\udf31'
      },
      tue: {
        type: 'sorting',
        instruction: 'Sort each leaf by its size!',
        items: [
          {key:'big1', emoji:'\ud83c\udf42'},
          {key:'big2', emoji:'\ud83c\udf43'},
          {key:'small1', emoji:'\ud83c\udf3f'},
          {key:'small2', emoji:'\u2618\ufe0f'}
        ],
        baskets: [
          {emoji:'\ud83d\udfe2', label:'Big leaf', accepts:['big1','big2']},
          {emoji:'\ud83d\udfe1', label:'Small leaf', accepts:['small1','small2']}
        ]
      },
      wed: {
        type: 'tap-sequence',
        instruction: 'Tap along the 4 stages of seed germination, in order!',
        sequence: [
          {emoji:'\ud83c\udf31', label:'Seed'},
          {emoji:'\ud83c\udf3e', label:'Root grows'},
          {emoji:'\ud83c\udf3f', label:'Sprout'},
          {emoji:'\ud83c\udf3a', label:'Young plant'}
        ]
      },
      thu: {
        type: 'match-pairs',
        instruction: 'Match each flower cut-out to its leaf shadow!',
        pairs: [
          {leftEmoji:'\ud83c\udf3b', left:'Sunflower', right:'Round shadow', rightEmoji:'\u26ab'},
          {leftEmoji:'\ud83c\udf37', left:'Tulip', right:'Long shadow', rightEmoji:'\u2b1b'}
        ]
      },
      fri: {
        type: 'sorting',
        instruction: 'Sort each picture into the correct stage of the plant lifecycle!',
        items: [
          {key:'seed', emoji:'\ud83c\udf31'},
          {key:'sprout', emoji:'\ud83c\udf3f'},
          {key:'flower', emoji:'\ud83c\udf3a'},
          {key:'tree', emoji:'\ud83c\udf33'}
        ],
        baskets: [
          {emoji:'\ud83c\udf31', label:'Early stage', accepts:['seed','sprout']},
          {emoji:'\ud83c\udf33', label:'Grown stage', accepts:['flower','tree']}
        ]
      }
    }
  },
  language: {
    days: {
      mon: {
        type: 'match-pairs',
        instruction: 'Match each word to the correct picture!',
        pairs: [
          {leftEmoji:'\ud83c\udf31', left:'seed', right:'Grows into a plant', rightEmoji:'\ud83c\udf3f'},
          {leftEmoji:'\ud83c\udf3e', left:'root', right:'Grows underground', rightEmoji:'\u2b07\ufe0f'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick the picture that shows a petal.',
        options: [
          {emoji:'\ud83c\udf38', label:'Petal', correct:true},
          {emoji:'\ud83c\udf42', label:'Leaf', correct:false}
        ]
      },
      wed: {
        type: 'drag-drop',
        instruction: 'Drag each word to what a plant needs to grow!',
        items: [
          {key:'sunlight', emoji:'\u2600\ufe0f'},
          {key:'water', emoji:'\ud83d\udca7'}
        ],
        destinations: [
          {emoji:'\ud83c\udf31', label:'A growing plant needs this', accepts:['sunlight','water']}
        ]
      },
      thu: {
        type: 'complete-sentence', prefix:'Plants need sunlight and', answer:'water', wrong:['shoes','chairs'], emoji:'\ud83d\udca7'
      },
      fri: {
        type: 'true-false',
        statements: [
          {emoji:'\ud83c\udf3f', text:'Taking care of a little plant helps it grow.', isTrue:true},
          {emoji:'\ud83c\udf3f', text:'Ignoring a little plant helps it grow.', isTrue:false}
        ]
      }
    }
  },
  create: {
    days: {
      mon: {
        type: 'colour-fill',
        instruction: 'Pick a colour, then paste seeds inside your leaf outline!',
        palette: ['#639922','#FAC775','#D85A30'],
        regions: [
          {emoji:'\ud83c\udf31', label:'Seed one'},
          {emoji:'\ud83c\udf31', label:'Seed two'}
        ]
      },
      tue: {
        type: 'match-pairs',
        instruction: 'Match each thumbprint colour to the flower part before you paint!',
        pairs: [
          {leftEmoji:'\ud83d\udd34', left:'Red thumbprint', right:'Petal', rightEmoji:'\ud83c\udf3a'},
          {leftEmoji:'\ud83d\udfe1', left:'Yellow thumbprint', right:'Centre', rightEmoji:'\u2600\ufe0f'}
        ]
      },
      wed: {
        type: 'colour-fill',
        instruction: 'Pick a green crayon, then rub and colour your leaf art!',
        palette: ['#639922','#3B6D11','#97C459'],
        regions: [
          {emoji:'\ud83c\udf42', label:'Leaf outline'},
          {emoji:'\ud83c\udf43', label:'Leaf vein'}
        ]
      },
      thu: {
        type: 'sorting',
        instruction: 'Sort each torn paper piece before making roots and stems!',
        items: [
          {key:'long1', emoji:'\ud83e\udeb5'},
          {key:'long2', emoji:'\ud83e\udeb5'},
          {key:'short1', emoji:'\ud83c\udf3e'},
          {key:'short2', emoji:'\ud83c\udf3e'}
        ],
        baskets: [
          {emoji:'\ud83e\udeb5', label:'For stems', accepts:['long1','long2']},
          {emoji:'\ud83c\udf3e', label:'For roots', accepts:['short1','short2']}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'What comes next in the pattern on your flower bouquet collage?',
        pattern: ['\ud83c\udf3a','\ud83c\udf37','\ud83c\udf3a','\ud83c\udf37'],
        options: ['\ud83c\udf3a','\ud83c\udf42','\u2600\ufe0f'],
        answer: '\ud83c\udf3a'
      }
    }
  },
  outdoor: {
    days: {
      mon: {
        type: 'tap-sequence',
        instruction: 'Tap along as you curl up small, then stretch tall like a seed growing!',
        sequence: [
          {emoji:'\ud83e\udee3', label:'Curl up small'},
          {emoji:'\ud83c\udf31', label:'Like a seed'},
          {emoji:'\ud83e\udd38', label:'Stretch tall'},
          {emoji:'\ud83c\udf3f', label:'Like a plant'}
        ]
      },
      tue: {
        type: 'step-count-find',
        instruction: 'Carry the watering can for five steps, then find the school garden patch!',
        targetSteps: 5,
        findEmoji: '\ud83c\udfe1',
        findLabel: 'garden patch'
      },
      wed: {
        type: 'maze',
        instruction: 'Sway like a flower in the wind along the path, one step at a time!',
        path: [
          {emoji:'\ud83c\udf3a'},
          {emoji:'\ud83d\udca8'},
          {emoji:'\ud83c\udf3a'},
          {emoji:'\ud83d\udca8'}
        ]
      },
      thu: {
        type: 'jump-direction',
        instruction: 'Jump five times through the chalk-drawn leaf pattern, then point to which way it goes!',
        targetJumps: 5,
        soundEmoji: '\ud83c\udf42',
        directions: [
          {arrow:'\u27a1\ufe0f', correct:true},
          {arrow:'\u2b05\ufe0f', correct:false},
          {arrow:'\u2b06\ufe0f', correct:false}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'Buzz, land, buzz \u2014 what comes next in the pollen-gathering bee pattern?',
        pattern: ['\ud83d\udc1d','\ud83c\udf3a','\ud83d\udc1d'],
        options: ['\ud83c\udf3a','\ud83c\udf42','\u2600\ufe0f'],
        answer: '\ud83c\udf3a'
      }
    }
  },
  reflect: {
    days: {
      mon: {
        type: 'tap-explore',
        instruction: 'Tap the plant part you\u2019d like to name today!',
        hotspots: [
          {emoji:'\ud83c\udf3e', label:'Root'},
          {emoji:'\ud83e\udeb5', label:'Stem'},
          {emoji:'\ud83c\udf42', label:'Leaf'},
          {emoji:'\ud83c\udf3a', label:'Flower'}
        ]
      },
      tue: {
        type: 'tick-choice',
        instruction: 'Tick what a seed needs to sprout.',
        options: [
          {emoji:'\ud83d\udca7', label:'Water', correct:true},
          {emoji:'\ud83e\uddf1', label:'A block', correct:false}
        ]
      },
      wed: {
        type: 'spot-difference',
        instruction: 'Look at both rows of flowers \u2014 which colour is different in the second row?',
        rowA: ['\ud83c\udf3a','\ud83c\udf37','\ud83c\udf38','\ud83c\udf3a'],
        rowB: ['\ud83c\udf3a','\ud83c\udf37','\ud83c\udf37','\ud83c\udf3a'],
        differentIndex: 2
      },
      thu: {
        type: 'true-false',
        statements: [
          {emoji:'\u2600\ufe0f', text:'Plants need sun to grow.', isTrue:true},
          {emoji:'\u2600\ufe0f', text:'Plants grow better in complete darkness.', isTrue:false}
        ]
      },
      fri: {
        type: 'complete-pattern',
        instruction: 'Seed, plant, flower \u2014 what comes next in our Week 11 recap pattern?',
        pattern: ['\ud83c\udf31','\ud83c\udf3f','\ud83c\udf3a'],
        options: ['\ud83c\udf31','\ud83c\udf42','\u2600\ufe0f'],
        answer: '\ud83c\udf31'
      }
    }
  }
};