/* =========================================================
   WEEKS CORE — shared containers and the master list of every
   week (theme, dates). This file must load FIRST, before any
   individual week file (week1.js, week2.js, ...), since those
   files ADD to these objects rather than declaring their own.

   Adding a new week now means:
     1. Create js/weeks/weekN.js (copy week1.js as a template)
     2. Add its <script> tag in index.html, after this file
   No changes needed in main.js for a new week's plain content —
   only its own interactive activities need designing there.
   ========================================================= */

const WEEKLY_PLAN = {};
const ACTIVITY_COMPETENCIES = {};
const weeksWithContent = [];

// Per-week sidebar day topics — separate from WEEKLY_PLAN (which
// holds each domain's activity text). This is the short "value"
// and "link" shown in the sidebar's day checklist.
const WEEK_DAY_TOPICS = {};

// The actual interactive H5P-style activities (match-pairs,
// complete-sentence, tap-explore, etc.) — see main.js's generic
// renderers for what "type" values are supported. Each week file
// fills in INTERACTIVE_ACTIVITIES.wkN with its own 30 activities
// (6 domains × 5 days).
const INTERACTIVE_ACTIVITIES = {};

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