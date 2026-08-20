/* =========================================================
   FESTIVALS \u2014 Indian festivals celebrated on specific school
   days during Term 1. Each entry is keyed "wkN-day" and shows as
   a highlighted banner at the top of that day's activities, above
   the regular 8 domain cards for that day \u2014 it never replaces
   them.

   PHOTOS: this file only references image PATHS
   (assets/festivals/<file>.jpg) \u2014 it does not contain any actual
   image data. Drop a real, high-resolution photo at each path for
   it to appear; until then a plain placeholder box shows instead
   (see the .festival-photo-fallback CSS), so a missing file never
   breaks the page.

   DATES:
   - Independence Day (15 August) is a fixed national holiday \u2014
     always 15 August, every year. In 2026 that date is a
     Saturday, so it isn't a school day at all; it's scheduled on
     Friday 14 Aug (Week 9's last school day before the actual
     holiday), which is the usual convention when a fixed holiday
     falls on a non-school day.
   - Lunar-calendar festivals (Raksha Bandhan, Janmashtami, Ganesh
     Chaturthi, Onam, Teej, etc.) shift every year and are
     deliberately NOT included here yet \u2014 baking in a guessed
     2026 date would risk teaching the wrong day. Add each one the
     same way, once its real 2026 date is confirmed:
       FESTIVALS['wkN-day'] = { title, subtitle, image, activity };
   ========================================================= */

const FESTIVALS = {};

FESTIVALS['wk9-fri'] = {
  title: 'Independence Day',
  subtitle: '15 August \u2014 celebrated today, the last school day before the holiday',
  image: 'assets/festivals/independence-day.png',
  activity: 'Talk about India\u2019s Independence Day, then colour the tricolour flag.',

  // A real colour-fill activity (same engine as every other week's
  // colouring activities) \u2014 mounted directly below the photo on
  // this one day, not tied to a domain/day lookup like the regular
  // 8 activity cards below it.
  colouringActivity: {
    instruction: 'Pick a colour, then tap each part of the flag to colour it!',
    palette: ['#FF9933','#FFFFFF','#138808','#000080'],
    regions: [
      {emoji:'\ud83d\udfe0', label:'Saffron stripe'},
      {emoji:'\u26aa', label:'White stripe'},
      {emoji:'\ud83d\udfe2', label:'Green stripe'},
      {emoji:'\ud83d\udd35', label:'Ashoka Chakra'}
    ]
  },

  // The significance of each part \u2014 shown as plain text under the
  // colouring activity, kept short and age-appropriate.
  significance: [
    {part:'Saffron (top stripe)', meaning:'Stands for courage and sacrifice.'},
    {part:'White (middle stripe)', meaning:'Stands for peace and truth.'},
    {part:'Green (bottom stripe)', meaning:'Stands for growth and the land\u2019s fertility.'},
    {part:'Ashoka Chakra (navy blue wheel)', meaning:'A 24-spoke wheel in the centre, standing for the eternal wheel of law (dharma) and continuous progress.'}
  ]
};


/* =========================================================
   RAKSHA BANDHAN \u2014 confirmed for 28 Aug 2026 (Week 11, Friday).
   ========================================================= */

const FESTIVAL_RAKSHA_BANDHAN = {
  title: 'Raksha Bandhan',
  subtitle: '28 August \u2014 celebrated today',
  image: 'assets/festivals/raksha-bandhan.png',
  activity: 'Talk about Raksha Bandhan, then colour a rakhi.',

  colouringActivity: {
    instruction: 'Pick a colour, then tap each part of the rakhi to colour it!',
    palette: ['#D85A30','#FAC775','#E24B4A','#FFD700'],
    regions: [
      {emoji:'\ud83e\uddf5', label:'Rakhi thread'},
      {emoji:'\u2b50', label:'Rakhi charm'},
      {emoji:'\ud83c\udf80', label:'Bow decoration'}
    ]
  },

  significance: [
    {part:'The rakhi thread', meaning:'Tied by a sister on her brother\u2019s wrist, as a sign of the bond between them.'},
    {part:'The promise', meaning:'The brother promises to protect and care for his sister in return.'},
    {part:'The colours and charms', meaning:'Chosen to make the rakhi bright and special \u2014 a small gift made with love.'}
  ]
};

// Confirmed: 28 Aug 2026 is a Friday, falling in Week 11
// (24\u201328 Aug 2026 \u2014 see WEEKS in weeks-core.js).
FESTIVALS['wk11-fri'] = FESTIVAL_RAKSHA_BANDHAN;