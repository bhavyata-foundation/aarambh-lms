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
    mon:{en:'Welcome song, explore classroom', hi:'स्वागत गीत, कक्षा का अन्वेषण', mr:'स्वागत गीत, वर्गाचा शोध'},
    tue:{en:'Free play with classroom toys', hi:'कक्षा के खिलौनों के साथ खेल', mr:'वर्गातील खेळण्यांसह मोकळा खेळ'},
    wed:{en:'Attendance & classroom talk', hi:'उपस्थिति और कक्षा में बातचीत', mr:'हजेरी आणि वर्गात गप्पा'},
    thu:{en:'Free play with puzzles', hi:'पहेलियों के साथ खेल', mr:'कोडींसह मोकळा खेळ'},
    fri:{en:'Free play with blocks', hi:'ब्लॉक्स के साथ खेल', mr:'ठोकळ्यांसह मोकळा खेळ'}
  },
  story: {
    mon:{en:'Story: My First Day in Class', hi:'कहानी: मेरा पहला दिन कक्षा में', mr:'गोष्ट: वर्गातील माझा पहिला दिवस'},
    tue:{en:'Rhyme: Good Morning Teacher', hi:'कविता: सुप्रभात शिक्षक', mr:'कविता: सुप्रभात शिक्षक'},
    wed:{en:'Story: My Classroom Family', hi:'कहानी: मेरा कक्षा परिवार', mr:'गोष्ट: माझे वर्गकुटुंब'},
    thu:{en:'Rhyme: Keep Things Clean', hi:'कविता: चीज़ें साफ़ रखो', mr:'कविता: वस्तू स्वच्छ ठेवा'},
    fri:{en:'Story: Shivaji Maharaj & Courage', hi:'कहानी: शिवाजी महाराज और वीरता', mr:'गोष्ट: शिवाजी महाराज आणि शौर्य'}
  },
  numeracy: {
    mon:{en:'Identify classroom objects', hi:'कक्षा की वस्तुओं की पहचान', mr:'वर्गातील वस्तू ओळखणे'},
    tue:{en:'Sort objects by colour', hi:'रंग के अनुसार वस्तुओं को छाँटना', mr:'रंगानुसार वस्तूंची वर्गवारी'},
    wed:{en:'Sort objects by size', hi:'आकार के अनुसार वस्तुओं को छाँटना', mr:'आकारानुसार वस्तूंची वर्गवारी'},
    thu:{en:'Sort objects by use', hi:'उपयोग के अनुसार वस्तुओं को छाँटना', mr:'उपयोगानुसार वस्तूंची वर्गवारी'},
    fri:{en:'Sort objects independently', hi:'स्वयं वस्तुओं को छाँटना', mr:'स्वतः वस्तूंची वर्गवारी करणे'}
  },
  language: {
    mon:{en:'Name: bag, book, pencil, bottle', hi:'नाम: बैग, किताब, पेंसिल, बोतल', mr:'नावे: पिशवी, पुस्तक, पेन्सिल, बाटली'},
    tue:{en:'Colour words: red, blue, yellow', hi:'रंगों के शब्द: लाल, नीला, पीला', mr:'रंगांचे शब्द: लाल, निळा, पिवळा'},
    wed:{en:'Big / small words', hi:'बड़ा / छोटा शब्द', mr:'मोठे / लहान शब्द'},
    thu:{en:'Use words: write, drink, eat, read', hi:'शब्दों का प्रयोग: लिखो, पीयो, खाओ, पढ़ो', mr:'शब्दांचा वापर: लिही, पी, खा, वाच'},
    fri:{en:'Speak: "This is my ___."', hi:'बोलें: "यह मेरा ___ है।"', mr:'बोला: "हे माझे ___ आहे."'}
  },
  create: {
    mon:{en:'Draw my school bag', hi:'मेरा स्कूल बैग बनाना', mr:'माझी शाळेची पिशवी काढणे'},
    tue:{en:'Colour classroom objects', hi:'कक्षा की वस्तुओं को रंगना', mr:'वर्गातील वस्तू रंगवणे'},
    wed:{en:'Big-small pasting', hi:'बड़ा-छोटा चिपकाना', mr:'मोठे-लहान चिकटवणे'},
    thu:{en:'Bag item collage', hi:'बैग की वस्तुओं का कोलाज', mr:'पिशवीतील वस्तूंचा कोलाज'},
    fri:{en:'Classroom object worksheet', hi:'कक्षा की वस्तु वर्कशीट', mr:'वर्गातील वस्तू कार्यपत्रक'}
  },
  outdoor: {
    mon:{en:'Free outdoor play', hi:'खुले में मुक्त खेल', mr:'मैदानी मोकळा खेळ'},
    tue:{en:'Ball play', hi:'गेंद खेल', mr:'चेंडू खेळ'},
    wed:{en:'Balance walk', hi:'संतुलन चलना', mr:'समतोल चालणे'},
    thu:{en:'Ring play', hi:'रिंग खेल', mr:'रिंग खेळ'},
    fri:{en:'Running game', hi:'दौड़ खेल', mr:'पळण्याचा खेळ'}
  },
  tidy: {
    mon:{en:'Put bag on hook, book on shelf', hi:'बैग हुक पर, किताब शेल्फ पर रखना', mr:'पिशवी हुकवर, पुस्तक कपाटात ठेवणे'},
    tue:{en:'Return toys to the toy bin', hi:'खिलौने टॉय बिन में वापस रखना', mr:'खेळणी टॉय बिनमध्ये परत ठेवणे'},
    wed:{en:'Put pencil and crayon back in the box', hi:'पेंसिल और क्रेयॉन बॉक्स में वापस रखना', mr:'पेन्सिल आणि क्रेयॉन डब्यात परत ठेवणे'},
    thu:{en:'"Keep things back in proper place"', hi:'"चीज़ों को सही जगह पर रखो"', mr:'"वस्तू योग्य ठिकाणी ठेवा"'},
    fri:{en:'Tidy the whole classroom before going home', hi:'घर जाने से पहले पूरी कक्षा साफ़ करना', mr:'घरी जाण्यापूर्वी संपूर्ण वर्ग नीटनेटका करणे'}
  },
  reflect: {
    mon:{en:'Name one classroom object', hi:'कक्षा की एक वस्तु का नाम बताएं', mr:'वर्गातील एका वस्तूचे नाव सांगा'},
    tue:{en:'Name one colour', hi:'एक रंग का नाम बताएं', mr:'एका रंगाचे नाव सांगा'},
    wed:{en:'Show one big object', hi:'एक बड़ी वस्तु दिखाएं', mr:'एक मोठी वस्तू दाखवा'},
    thu:{en:'What do we use pencil for?', hi:'हम पेंसिल का उपयोग किसके लिए करते हैं?', mr:'आपण पेन्सिलचा उपयोग कशासाठी करतो?'},
    fri:{en:'Recap & plant-care promise', hi:'सप्ताह का सारांश और पौधे की देखभाल का वादा', mr:'आठवड्याचा आढावा आणि रोपांची काळजी घेण्याचे वचन'}
  }
};

ACTIVITY_COMPETENCIES.wk1 = {
  welcome: {
    mon:{en:'Settles into classroom routine', hi:'कक्षा की दिनचर्या में बस जाता है', mr:'वर्गाच्या दैनंदिन कार्यक्रमात स्थिरावतो'},
    tue:{en:'Explores classroom toys independently', hi:'स्वयं कक्षा के खिलौनों का अन्वेषण करता है', mr:'स्वतः वर्गातील खेळण्यांचा शोध घेतो'},
    wed:{en:'Participates in attendance and group talk', hi:'उपस्थिति और समूह बातचीत में भाग लेता है', mr:'हजेरी आणि गटचर्चेत सहभागी होतो'},
    thu:{en:'Engages with puzzles cooperatively', hi:'सहयोग से पहेलियों में शामिल होता है', mr:'सहकार्याने कोडींमध्ये सहभागी होतो'},
    fri:{en:'Plays constructively with blocks', hi:'ब्लॉक्स से रचनात्मक रूप से खेलता है', mr:'ठोकळ्यांसह रचनात्मक खेळतो'}
  },
  story: {
    mon:{en:'Listens to and follows a simple story', hi:'एक सरल कहानी सुनता और समझता है', mr:'साधी गोष्ट ऐकतो आणि समजून घेतो'},
    tue:{en:'Joins in a rhyme with actions', hi:'क्रियाओं के साथ कविता में शामिल होता है', mr:'हावभावांसह कवितेत सहभागी होतो'},
    wed:{en:'Recognises self as part of a classroom family', hi:'स्वयं को कक्षा परिवार का हिस्सा मानता है', mr:'स्वतःला वर्गकुटुंबाचा भाग मानतो'},
    thu:{en:'Connects a rhyme to a real habit (keeping things clean)', hi:'कविता को एक वास्तविक आदत (सफाई) से जोड़ता है', mr:'कवितेचा संबंध खऱ्या सवयीशी (स्वच्छता) जोडतो'},
    fri:{en:'Listens to a story about courage and values', hi:'वीरता और मूल्यों की कहानी सुनता है', mr:'शौर्य आणि मूल्यांची गोष्ट ऐकतो'}
  },
  numeracy: {
    mon:{en:'Names and identifies familiar classroom objects', hi:'परिचित कक्षा की वस्तुओं के नाम बताता और पहचानता है', mr:'ओळखीच्या वर्गातील वस्तूंची नावे सांगतो आणि ओळखतो'},
    tue:{en:'Sorts objects into groups by colour', hi:'वस्तुओं को रंग के अनुसार समूहों में छाँटता है', mr:'वस्तूंची रंगानुसार गटांमध्ये वर्गवारी करतो'},
    wed:{en:'Sorts objects into groups by size', hi:'वस्तुओं को आकार के अनुसार समूहों में छाँटता है', mr:'वस्तूंची आकारानुसार गटांमध्ये वर्गवारी करतो'},
    thu:{en:'Sorts objects into groups by use', hi:'वस्तुओं को उपयोग के अनुसार समूहों में छाँटता है', mr:'वस्तूंची उपयोगानुसार गटांमध्ये वर्गवारी करतो'},
    fri:{en:'Sorts objects into groups independently', hi:'स्वयं वस्तुओं को समूहों में छाँटता है', mr:'स्वतः वस्तूंची गटांमध्ये वर्गवारी करतो'}
  },
  language: {
    mon:{en:'Names familiar classroom objects (bag, book, pencil, bottle)', hi:'परिचित कक्षा की वस्तुओं के नाम बताता है (बैग, किताब, पेंसिल, बोतल)', mr:'ओळखीच्या वर्गातील वस्तूंची नावे सांगतो (पिशवी, पुस्तक, पेन्सिल, बाटली)'},
    tue:{en:'Recognises and names basic colour words', hi:'बुनियादी रंगों के शब्द पहचानता और बोलता है', mr:'मूलभूत रंगांचे शब्द ओळखतो आणि सांगतो'},
    wed:{en:'Uses opposite words: big / small', hi:'विपरीत शब्दों का उपयोग करता है: बड़ा / छोटा', mr:'विरुद्धार्थी शब्द वापरतो: मोठे / लहान'},
    thu:{en:'Uses action words in context (write, drink, eat, read)', hi:'संदर्भ में क्रिया शब्दों का उपयोग करता है (लिखो, पीयो, खाओ, पढ़ो)', mr:'संदर्भानुसार क्रियापद वापरतो (लिही, पी, खा, वाच)'},
    fri:{en:'Speaks a simple sentence: "This is my ___."', hi:'एक सरल वाक्य बोलता है: "यह मेरा ___ है।"', mr:'साधे वाक्य बोलतो: "हे माझे ___ आहे."'}
  },
  create: {
    mon:{en:'Draws a familiar object from memory', hi:'स्मृति से एक परिचित वस्तु बनाता है', mr:'स्मरणातून ओळखीची वस्तू काढतो'},
    tue:{en:'Colours within a shape using appropriate colours', hi:'उचित रंगों का उपयोग कर आकृति में रंग भरता है', mr:'योग्य रंग वापरून आकारात रंग भरतो'},
    wed:{en:'Pastes shapes by size (big/small)', hi:'आकार के अनुसार आकृतियाँ चिपकाता है (बड़ा/छोटा)', mr:'आकारानुसार आकृती चिकटवतो (मोठे/लहान)'},
    thu:{en:'Creates a collage from classroom-object cutouts', hi:'कक्षा की वस्तुओं के कटआउट से कोलाज बनाता है', mr:'वर्गातील वस्तूंच्या कापलेल्या चित्रांपासून कोलाज तयार करतो'},
    fri:{en:'Completes a classroom-object worksheet independently', hi:'स्वयं कक्षा की वस्तु वर्कशीट पूरी करता है', mr:'स्वतः वर्गातील वस्तू कार्यपत्रक पूर्ण करतो'}
  },
  outdoor: {
    mon:{en:'Engages in free physical play safely', hi:'सुरक्षित रूप से मुक्त शारीरिक खेल में भाग लेता है', mr:'सुरक्षितपणे मोकळ्या शारीरिक खेळात सहभागी होतो'},
    tue:{en:'Throws and catches a ball with basic control', hi:'बुनियादी नियंत्रण के साथ गेंद फेंकता और पकड़ता है', mr:'मूलभूत नियंत्रणासह चेंडू फेकतो आणि पकडतो'},
    wed:{en:'Walks along a line maintaining balance', hi:'संतुलन बनाते हुए रेखा पर चलता है', mr:'समतोल राखत रेषेवर चालतो'},
    thu:{en:'Plays a turn-based ring game', hi:'बारी-बारी से रिंग खेल खेलता है', mr:'वळणावळणाने रिंग खेळ खेळतो'},
    fri:{en:'Runs safely within a defined space', hi:'निर्धारित स्थान में सुरक्षित रूप से दौड़ता है', mr:'ठरलेल्या जागेत सुरक्षितपणे पळतो'}
  },
  tidy: {
    mon:{en:'Returns personal items (bag, book) to their place', hi:'व्यक्तिगत वस्तुओं (बैग, किताब) को उनकी जगह पर रखता है', mr:'वैयक्तिक वस्तू (पिशवी, पुस्तक) त्यांच्या जागी ठेवतो'},
    tue:{en:'Returns shared toys to the toy bin', hi:'साझा खिलौनों को टॉय बिन में वापस रखता है', mr:'सामायिक खेळणी टॉय बिनमध्ये परत ठेवतो'},
    wed:{en:'Returns stationery to its box', hi:'स्टेशनरी को उसके बॉक्स में वापस रखता है', mr:'लेखनसामग्री तिच्या डब्यात परत ठेवतो'},
    thu:{en:'Follows the instruction to keep things in their proper place', hi:'चीज़ों को सही जगह पर रखने के निर्देश का पालन करता है', mr:'वस्तू योग्य ठिकाणी ठेवण्याच्या सूचनेचे पालन करतो'},
    fri:{en:'Helps tidy the whole classroom before leaving', hi:'जाने से पहले पूरी कक्षा साफ़ करने में मदद करता है', mr:'निघण्यापूर्वी संपूर्ण वर्ग नीटनेटका करण्यास मदत करतो'}
  },
  reflect: {
    mon:{en:'Recalls and names one classroom object from the day', hi:'दिन की एक कक्षा वस्तु का नाम याद करता और बताता है', mr:'दिवसातील एका वर्गवस्तूचे नाव आठवतो आणि सांगतो'},
    tue:{en:'Recalls one colour learned during the day', hi:'दिन में सीखे एक रंग को याद करता है', mr:'दिवसात शिकलेला एक रंग आठवतो'},
    wed:{en:"Identifies one big object from the day's activities", hi:'दिन की गतिविधियों से एक बड़ी वस्तु पहचानता है', mr:'दिवसाच्या उपक्रमांमधून एक मोठी वस्तू ओळखतो'},
    thu:{en:'Explains the use of a pencil in their own words', hi:'अपने शब्दों में पेंसिल के उपयोग की व्याख्या करता है', mr:'स्वतःच्या शब्दांत पेन्सिलच्या उपयोगाचे स्पष्टीकरण देतो'},
    fri:{en:'Recaps the week and makes a simple promise (plant care)', hi:'सप्ताह का सारांश देता है और एक सरल वादा करता है (पौधे की देखभाल)', mr:'आठवड्याचा आढावा देतो आणि साधे वचन देतो (रोपांची काळजी)'}
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