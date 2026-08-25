/* =========================================================================
   PARENT COMMITTEE — shared data model, scoring, and storage used by both
   parent.js (the application form) and main.js (the teacher's view).

   FRONTEND-ONLY FOR NOW: uses localStorage as a stand-in for a real
   backend table, specifically so the parent-side form and the
   teacher-side list genuinely reflect the same data right now, not just
   in theory. Swapping this for real backend/get_volunteer_applications.php
   and add_volunteer_application.php calls later is a drop-in replacement
   for the load()/save() functions below — nothing else needs to change.
   ========================================================================= */

const EDUCATION_LEVELS = [
  {value:'below10th',    label:'Below 10th',                      points:0.5},
  {value:'tenth12th',    label:'10th or 12th pass',                points:1.0},
  {value:'graduate',     label:'Graduate',                         points:1.5},
  {value:'postgraduate', label:'Postgraduate',                     points:1.8},
  {value:'professional', label:'Professional (doctor, engineer, etc.)', points:2.0}
];

const ACTIVITY_OPTIONS = [
  {value:'taught',    label:'Taught or tutored children'},
  {value:'ngo',       label:'Volunteered with an NGO or community group'},
  {value:'organized', label:'Organized or run a school or community event'},
  {value:'none',      label:'None of these yet'}
];

const INTEREST_OPTIONS = [
  {value:'storytelling', label:'Storytelling'},
  {value:'art',          label:'Art and craft'},
  {value:'health',       label:'Health talks'},
  {value:'music',        label:'Music'},
  {value:'outdoor',      label:'Outdoor play'}
];

const DAY_OPTIONS = [
  {value:'mon', label:'Mon'}, {value:'tue', label:'Tue'}, {value:'wed', label:'Wed'},
  {value:'thu', label:'Thu'}, {value:'fri', label:'Fri'}
];

// Which activities plausibly demonstrate which interests, for the
// "demonstrated activity match" score component.
const ACTIVITY_INTEREST_MAP = {
  taught:    ['storytelling', 'music'],
  organized: ['art', 'health'],
  ngo:       ['health', 'outdoor']
};

// Loose occupation-to-interest keyword matching, for the "occupation to
// need match" score component. Deliberately simple substring matching —
// a real backend version could use an LLM call here instead, but the
// score should stay just as explainable either way.
const OCCUPATION_INTEREST_KEYWORDS = {
  nurse: ['health'], doctor: ['health'], health: ['health'],
  artist: ['art'], craft: ['art'], design: ['art'],
  teacher: ['storytelling'], tutor: ['storytelling'], librarian: ['storytelling'],
  music: ['music'], singer: ['music'], musician: ['music'],
  coach: ['outdoor'], sports: ['outdoor'], trainer: ['outdoor']
};

/* -------------------------------------------------------------------------
   SCORING — four components, each capped, always summing to a score out
   of 10. Every component is stored alongside the total so the UI can show
   *why* someone scored what they did, not just the number.
   ------------------------------------------------------------------------- */
function calculateSuitabilityScore(app, existingCommitteeForClass){
  // 1. Education (max 2)
  const eduMatch = EDUCATION_LEVELS.find(e => e.value === app.education);
  const educationScore = eduMatch ? eduMatch.points : 0;

  // 2. Demonstrated activity match (max 4) — base credit for having done
  // anything at all, plus a bonus when a checked activity plausibly
  // demonstrates one of their stated interests.
  const realActivities = (app.activities || []).filter(a => a !== 'none');
  let activityScore = Math.min(1, realActivities.length * 0.5);
  realActivities.forEach(act => {
    const mapped = ACTIVITY_INTEREST_MAP[act] || [];
    if(mapped.some(i => (app.interests || []).includes(i))){
      activityScore += 1.5;
    }
  });
  activityScore = Math.min(4, activityScore);

  // 3. Availability fills a gap (max 2) — compares against days already
  // covered by this class's EXISTING selected committee members.
  const coveredDays = new Set();
  (existingCommitteeForClass || []).forEach(member => {
    (member.availableDays || []).forEach(d => coveredDays.add(d));
  });
  const appDays = app.availableDays || [];
  const newDaysCovered = appDays.filter(d => !coveredDays.has(d)).length;
  const availabilityScore = appDays.length === 0 ? 0
    : Math.min(2, (newDaysCovered / appDays.length) * 2);

  // 4. Occupation to need match (max 2)
  const occLower = (app.occupation || '').toLowerCase().trim();
  let occupationScore = occLower ? 0.5 : 0; // small baseline for stating any occupation at all
  Object.keys(OCCUPATION_INTEREST_KEYWORDS).forEach(keyword => {
    if(occLower.includes(keyword)){
      const mapped = OCCUPATION_INTEREST_KEYWORDS[keyword];
      if(mapped.some(i => (app.interests || []).includes(i))){
        occupationScore = 2;
      }
    }
  });

  const total = educationScore + activityScore + availabilityScore + occupationScore;

  return {
    total: Math.round(total * 10) / 10,
    breakdown: {
      education:    { score: Math.round(educationScore * 10) / 10, max: 2 },
      activity:     { score: Math.round(activityScore * 10) / 10, max: 4 },
      availability: { score: Math.round(availabilityScore * 10) / 10, max: 2 },
      occupation:   { score: Math.round(occupationScore * 10) / 10, max: 2 }
    }
  };
}

/* -------------------------------------------------------------------------
   STORAGE — localStorage-backed for now (see file header). Seed data
   ships with a few realistic applications so the teacher view isn't
   empty on first load.
   ------------------------------------------------------------------------- */
const PARENT_COMMITTEE_STORAGE_KEY = 'parentCommitteeApplications_v1';

function seedParentCommitteeApplications(){
  return [
    {
      id: 'seed-1',
      parentName: 'Sunita Rao',
      childName: 'Aarav Rao',
      school: 'Triveni Sangam Municipal School',
      className: 'Jr KG',
      occupation: 'Nurse',
      education: 'postgraduate',
      activities: ['taught', 'organized'],
      availableDays: ['tue', 'thu'],
      interests: ['storytelling', 'health'],
      notes: '',
      status: 'selected',
      submittedDate: '2026-08-05'
    },
    {
      id: 'seed-2',
      parentName: 'Farah Sheikh',
      childName: 'Zara Sheikh',
      school: 'Triveni Sangam Municipal School',
      className: 'Jr KG',
      occupation: 'Artist',
      education: 'graduate',
      activities: ['none'],
      availableDays: ['mon', 'wed', 'fri'],
      interests: ['art', 'music'],
      notes: '',
      status: 'applied',
      submittedDate: '2026-08-12'
    }
  ];
}

function loadParentCommitteeApplications(){
  try{
    const raw = localStorage.getItem(PARENT_COMMITTEE_STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  } catch(e){ /* fall through to reseed */ }
  const seeded = seedParentCommitteeApplications();
  saveParentCommitteeApplications(seeded);
  return seeded;
}

function saveParentCommitteeApplications(apps){
  try{
    localStorage.setItem(PARENT_COMMITTEE_STORAGE_KEY, JSON.stringify(apps));
  } catch(e){ /* localStorage unavailable — data just won't persist across reloads */ }
}

function addParentCommitteeApplication(app){
  const apps = loadParentCommitteeApplications();
  apps.push(app);
  saveParentCommitteeApplications(apps);
}

function updateParentCommitteeApplicationStatus(id, newStatus){
  const apps = loadParentCommitteeApplications();
  const target = apps.find(a => a.id === id);
  if(target) target.status = newStatus;
  saveParentCommitteeApplications(apps);
}