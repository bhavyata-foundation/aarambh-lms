/* =========================================================
   SESSION GUARD — checks with the server that someone is actually
   logged in as a superadmin before showing anything on this page.

   Forwards this page's own query string (e.g. ?dev_role=superadmin)
   to the session check — without this, a dev-mode role selected on
   the login page never actually reaches session_check.php, since a
   query param on THIS page's URL isn't automatically attached to a
   separate fetch() call.
   ========================================================= */
fetch('backend/session_check.php' + window.location.search)
  .then(r => r.json())
  .then(data => {
    if(data.status !== 'logged_in' || data.role !== 'superadmin'){
      window.location.href = 'index.html';
    }
  })
  .catch(() => { window.location.href = 'index.html'; });

/* =========================================================
   SUPER ADMIN — data
   ========================================================= */

// -----------------------------------------------------------------
// DATABASE POCKET — this function is the one thing to swap out once
// a real backend exists. Right now it returns the hardcoded list
// below; later it becomes something like:
//
//   async function loadSchools(){
//     const res = await fetch('/api/schools');
//     return await res.json();
//   }
//
// The shape below matches seed_schools.sql exactly — same schools,
// same wards, same Jr KG / Sr KG teacher names — so swapping this
// one function for a real fetch() later requires no other changes
// anywhere else in this file.
// -----------------------------------------------------------------
function loadSchools(){
  return SCHOOLS_SEED;
}

// Real data, from 26-27 MPS Data school.xlsx ("August - 2026" sheet).
// 23 confirmed schools across 7 BMC wards. `teacher: null` means no
// named teacher is assigned yet for that class (shown as "Unassigned").
const SCHOOLS_SEED = [
  {id:'s1', name:'Triveni Sangam Municipal School', ward:'F/S', address:'Currey Rd Bridge, east, Mumbai, Maharashtra 400012', classes:[
    {name:'Jr KG', teacher:'Reena Chinchankar'},
    {name:'Sr KG', teacher:null}
  ]},
  {id:'s2', name:'South Sewri MPS', ward:'F/S', address:'Khimji Vishram Building .T j.road Ashok garden building near by swan mill bus stop, Shivare 400015', classes:[
    {name:'Jr KG', teacher:'Shifa Shaikh'},
    {name:'Sr KG', teacher:'Sumiya'}
  ]},
  {id:'s3', name:'Shastri Nagar MPS', ward:'H/E', address:'Church Rd, Kolivery Village, Kunchi Kurve Nagar, Kalina, Santacruz East, Mumbai, Maharashtra 400029', classes:[
    {name:'Jr KG', teacher:'Sarika Mothiya'},
    {name:'Sr KG', teacher:'Hanumati Bhandari'}
  ]},
  {id:'s4', name:'Khernagar MPS', ward:'H/E', address:'Unit 2, khernagar road no 4, kherwadi bandra east mumbai 400051', classes:[
    {name:'Jr KG', teacher:'BMC teacher'},
    {name:'Sr KG', teacher:'BMC teacher'}
  ]},
  {id:'s5', name:'Juhu Gandhigram MPS', ward:'K/W', address:'Azad Ln, New Sarvottam Society, Azad Nagar, Vile Parle West, Mumbai, Maharashtra 400058', classes:[
    {name:'Jr KG', teacher:'Ankita singh'},
    {name:'Sr KG', teacher:'Shakuntala Rajbhar'}
  ]},
  {id:'s6', name:'Jogeshwari MPS', ward:'K/W', address:'Hemu Meadows Opposite Amboli police station patel estate road, Nr. Pushtikar society, Jogeshwari West, BMC garden is there 400102', classes:[
    {name:'Jr KG', teacher:'Shaheen Shaikh'},
    {name:'Sr KG', teacher:null}
  ]},
  {id:'s7', name:'Andheri MPS', ward:'K/W', address:'Dawood Baug Rd, J. P. Road, Dawood Baug, Fish Market Area, Navneeth Colony, Andheri West, Mumbai, Maharashtra 400058', classes:[
    {name:'Jr KG', teacher:'Rubina Mola Baksh'},
    {name:'Sr KG', teacher:'Shaista Shaikh'}
  ]},
  {id:'s8', name:'Nehru Nagar MPS', ward:'L', address:'Shiv Shrusti School, 16, Shiv Shrusti Rd, G.T.B.Nagar, Nehru Nagar, Kurla, Mumbai, Maharashtra 400024', classes:[
    {name:'Jr KG', teacher:'Rukhsar Shaikh'},
    {name:'Sr KG', teacher:'Rashida Khatoon'}
  ]},
  {id:'s9', name:'Mohili Village MPS', ward:'L', address:'Opp. APEX HOSPITAL, Pereira Wadi, Saki Naka, Mumbai, Maharashtra 400072', classes:[
    {name:'Jr KG', teacher:'Deepika Dubey'},
    {name:'Sr KG', teacher:'Yasmeen Shaikh'}
  ]},
  {id:'s10', name:'Kajupada MPS', ward:'L', address:'Shivaji Vidhayala, Indira Nagar, Kajupada, Mumbai, Maharashtra 400072', classes:[
    {name:'Jr KG', teacher:'Sancheti Gole'},
    {name:'Sr KG', teacher:'Leenatha (BMC Teacher)'}
  ]},
  {id:'s11', name:'S.G Barve Marg MPS', ward:'L', address:'Brahmanwadi, opp. Kurla Station Kurla West, Mumbai, Maharashtra 400070', classes:[
    {name:'Jr KG', teacher:'Khushboo Mulani'},
    {name:'Sr KG', teacher:'Sana Ruksar Shaikh'}
  ]},
  {id:'s12', name:'Chunabhatti MPS', ward:'L', address:'Darawade Chawl, VN Purav Marg, Samarth Nagar, Chunabhatti, Sion, Mumbai, Maharashtra 400022', classes:[
    {name:'Jr KG', teacher:'Radha Yadav'},
    {name:'Sr KG', teacher:'Tasleem Shaikh'}
  ]},
  {id:'s13', name:'Vikhroli Park Site MPS', ward:'N', address:'Vikhroli Fire Station, Near L.B.S. Road, Vikhroli Park Site, L.B.S. Marg, BMC Colony, Vikhroli West, Mumbai, Maharashtra 400079', classes:[
    {name:'Jr KG', teacher:'BMC Teacher'},
    {name:'Sr KG', teacher:'BMC Teacher'}
  ]},
  {id:'s14', name:'Maneklal Mehta Municipal School', ward:'N', address:'New Maneklal Estate, Near Ghatkopar pipeline bus Stop, Ghatkopar West 400086', classes:[
    {name:'Jr KG', teacher:'Reshamabi  Nadaf'},
    {name:'Sr KG', teacher:'Anisha Bano Shaikh'}
  ]},
  {id:'s15', name:'Barve Nagar Municipal School No 3', ward:'N', address:'RB Kadam Road, Barve Nagar, Near Bhatwadi Ganpati Mandir Ghatkopar West, Mumbai, Maharashtra 400084', classes:[
    {name:'Jr KG', teacher:'Rajanigandha Pawase'},
    {name:'Sr KG', teacher:'Divya Ghatkar'}
  ]},
  {id:'s16', name:'Sainath nagar MPS', ward:'N', address:'Sainath Nagar Rd, Near by KVK School,Sainath Nagar, Indira Nagar, Ghatkopar West, Mumbai, Maharashtra 400086', classes:[
    {name:'Jr KG', teacher:'Shahin Shaikh'},
    {name:'Sr KG', teacher:'Sanabanu Shaikh'}
  ]},
  {id:'s17', name:'Rajawadi MPS', ward:'N', address:'RB Mehta Marg, Saibaba Nagar, Pant Nagar, Ghatkopar East, Mumbai, Maharashtra 400077', classes:[
    {name:'Jr KG', teacher:'Ankita Kadam'},
    {name:'Sr KG', teacher:'Sandhya khatai'}
  ]},
  {id:'s18', name:'Bhandup Tank Road', ward:'S', address:'Ishwar Nagar, Opposite MSEB Office, Bhandup West-400078', classes:[
    {name:'Jr KG', teacher:null},
    {name:'Sr KG', teacher:'Usha Daniel'}
  ]},
  {id:'s19', name:'Nehru Nagar MPS', ward:'S', address:'Nehrunagar MPS, Next to Nehru Nagar Police Station, Near Ankur Hospital, Kanjurmarg (East). 400042', classes:[
    {name:'Jr KG', teacher:'Suvarna Kokane'},
    {name:'Sr KG', teacher:'Jyotsana Patkar'}
  ]},
  {id:'s20', name:'Goshala MPS', ward:'T', address:'Sevaram Lalwani Rd, Mulund West, Mumbai, Maharashtra 400080', classes:[
    {name:'Jr KG', teacher:'Kiran Kamble(BMC teacher)'},
    {name:'Sr KG', teacher:'Sneha gupta'}
  ]},
  {id:'s21', name:'D D Upadhyay MPS', ward:'T', address:'Jagjivan Ram Nagar, Mulund West, Mumbai, Maharashtra 400604', classes:[
    {name:'Jr KG', teacher:'Geetadevi Yadav'},
    {name:'Sr KG', teacher:'Hina Kausar Sayed'}
  ]},
  {id:'s22', name:'P.K.Road MPS', ward:'T', address:'Shifetd to Keshav pada MPS, Mulund West  Keshavpada ,near Zenith Building, Mulund West 400080', classes:[
    {name:'Jr KG', teacher:'Nilima Chaudhari'},
    {name:'Sr KG', teacher:'BMC Teacher'}
  ]},
  {id:'s23', name:'Mithagar MPS', ward:'T', address:'Gavanpada Rd, Mahatma Phule Road, Gurupushyamrut Society, Gavanpada, Mahakali Nagar, Mulund East, Mumbai, Maharashtra 400081', classes:[
    {name:'Jr KG', teacher:'Bhagyashree Tikhute'},
    {name:'Sr KG', teacher:'Vidya Verma'}
  ]}
];

const SCHOOLS = loadSchools();

// Supervisor-to-ward assignment is still a PLACEHOLDER — the real
// spreadsheet had no supervisor data, so this just groups schools by
// ward as a sensible guess until real assignments exist.
const SUPERVISORS_LIST = [
  {id:'sv1', name:'Mr. Deshpande',    schools:['s1','s2','s3','s4']},               // F/S, H/E
  {id:'sv2', name:'Mrs. Nair',        schools:['s5','s6','s7']},                    // K/W
  {id:'sv3', name:'Mr. Kulin Maniar', schools:['s8','s9','s10','s11','s12']},       // L
  {id:'sv4', name:'Mrs. Fernandes',   schools:['s13','s14','s15','s16','s17']},     // N
  {id:'sv5', name:'Mr. Bhosale',      schools:['s18','s19','s20','s21','s22','s23']} // S, T
];


// Daily supervisor visit log, keyed by week number
const SUPERVISOR_VISITS = {
  1: [
    {date:'2026-06-15', day:'Mon', supervisorId:'sv1', schoolId:'s1', visited:true,  feedback:'Classroom well organised; attendance register up to date.'},
    {date:'2026-06-15', day:'Mon', supervisorId:'sv1', schoolId:'s2', visited:false, feedback:'Could not visit — travel delay.'},
    {date:'2026-06-15', day:'Mon', supervisorId:'sv2', schoolId:'s3', visited:true,  feedback:'Good use of storytelling; suggested more outdoor time.'},
    {date:'2026-06-17', day:'Wed', supervisorId:'sv1', schoolId:'s1', visited:true,  feedback:'Worksheet corner needs restocking.'},
    {date:'2026-06-17', day:'Wed', supervisorId:'sv1', schoolId:'s2', visited:true,  feedback:'Attendance improved this week.'},
    {date:'2026-06-18', day:'Thu', supervisorId:'sv2', schoolId:'s3', visited:false, feedback:'Rescheduled due to local holiday.'},
    {date:'2026-06-19', day:'Fri', supervisorId:'sv1', schoolId:'s1', visited:true,  feedback:'Children engaged well in the Creative activity.'}
  ]
};

// Worksheet completion % per school, keyed by week number
const WORKSHEET_COMPLETION = {
  1: {s1: 82, s2: 61, s3: 74}
};

// Student growth — Week 1 rating vs latest rating, per school
const RATING_LEVELS = ['Emerging','Progressing','Achieving','Exceeding'];
const STUDENT_GROWTH = {
  s1: [
    {name:'Aarav Sharma', week1:'Emerging',    latest:'Progressing'},
    {name:'Priya Patil',  week1:'Progressing', latest:'Achieving'},
    {name:'Rohan Desai',  week1:'Emerging',    latest:'Emerging'}
  ],
  s2: [
    {name:'Sana Khan',  week1:'Progressing', latest:'Achieving'},
    {name:'Yash Verma', week1:'Emerging',    latest:'Progressing'}
  ],
  s3: [
    {name:'Meera Joshi', week1:'Achieving',   latest:'Exceeding'},
    {name:'Karan Gupta', week1:'Progressing', latest:'Progressing'}
  ]
};

// Per-class attendance + growth, keyed by school id then class name.
// Used by the School → Class lookup in the Weekly Report.
const CLASS_OPTIONS = ['Jr KG', 'Sr KG'];
const CLASS_LOOKUP = {
  s1: {
    'Jr KG': {enrolled:24, present:22, students:[
      {name:'Aarav Sharma', week1:'Emerging', latest:'Progressing'},
      {name:'Rohan Desai',  week1:'Emerging', latest:'Emerging'}
    ]},
    'Sr KG': {enrolled:20, present:18, students:[
      {name:'Priya Patil', week1:'Progressing', latest:'Achieving'}
    ]}
  },
  s2: {
    'Jr KG': {enrolled:22, present:19, students:[
      {name:'Sana Khan', week1:'Progressing', latest:'Achieving'}
    ]},
    'Sr KG': {enrolled:18, present:16, students:[
      {name:'Yash Verma', week1:'Emerging', latest:'Progressing'}
    ]}
  },
  s3: {
    'Jr KG': {enrolled:20, present:17, students:[
      {name:'Karan Gupta', week1:'Progressing', latest:'Progressing'}
    ]},
    'Sr KG': {enrolled:19, present:18, students:[
      {name:'Meera Joshi', week1:'Achieving', latest:'Exceeding'}
    ]}
  }
};

const reviewedReports = {}; // key: weekNum -> {by, date, note}
let currentReportWeekRange = {from: 1, to: 1};
let expandedSchool = null;
let expandedSchoolCard = null;

/* =========================================================
   Sidebar (same pattern as supervisor.js — each page owns its own copy)
   ========================================================= */

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('show');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');
}

function toggleUserMenu(){
  document.getElementById('userDropdown').classList.toggle('hidden');
}
function closeUserMenu(){
  document.getElementById('userDropdown').classList.add('hidden');
}
document.addEventListener('click', function(e){
  const menu = document.getElementById('userMenu');
  if(menu && !menu.contains(e.target)) closeUserMenu();
});

/* =========================================================
   DURATION PICKER — a reusable grouped dropdown ("Select
   Duration" style: a trigger showing the current selection,
   opening a panel with quick-pick options under small section
   headers). Used by Weekly Report and Supervisor Visits (both
   week-based) and, with a different option set, by the
   Supervisor Dashboard / School Performance / Quarterly Review
   period bar in superadmin-dashboards.js (month/quarter/year).

   Each caller supplies:
     id       — unique string, so multiple pickers can exist and
                only one opens at a time
     groups   — [{label, options:[{value,label,selected?}]}, ...]
     trigger  — the label text shown on the closed trigger button
     onSelect — function(value) called when an option is chosen;
                the caller decides what that value means and how
                to re-render itself
     customHtml — optional extra HTML appended inside the open
                panel (e.g. the "From week / To week" custom-range
                controls), rendered by the caller
   ========================================================= */

let openDurationPickerId = null;

function durationPickerHtml(id, trigger, groups, customHtml){
  const isOpen = openDurationPickerId === id;
  const groupsHtml = groups.map(g => `
    <div class="dp-group-label">${g.label}</div>
    ${g.options.map(o => `<button type="button" class="dp-option ${o.selected?'selected':''}" onclick="event.stopPropagation(); durationPickerSelect('${id}','${o.value}')">${o.label}</button>`).join('')}
  `).join('<div class="dp-divider"></div>');

  return `
    <div class="dp-wrap" data-dp-id="${id}">
      <button type="button" class="dp-trigger ${isOpen?'open':''}" onclick="event.stopPropagation(); toggleDurationPicker('${id}')">
        <span>${trigger}</span>
        <span class="dp-caret">${isOpen ? '▲' : '▼'}</span>
      </button>
      ${isOpen ? `<div class="dp-panel" onclick="event.stopPropagation()">${groupsHtml}${customHtml || ''}</div>` : ''}
    </div>`;
}

function toggleDurationPicker(id){
  openDurationPickerId = (openDurationPickerId === id) ? null : id;
  durationPickerRerender(id);
}

// Each picker's owning report knows how to re-render just itself;
// registered here so toggleDurationPicker/durationPickerSelect can
// reach the right one without hardcoding a big if/else chain.
const durationPickerRerenderers = {};

function durationPickerRerender(id){
  if(durationPickerRerenderers[id]) durationPickerRerenderers[id]();
}

function durationPickerSelect(id, value){
  openDurationPickerId = null;
  if(durationPickerRerenderers[id + ':select']) durationPickerRerenderers[id + ':select'](value);
}

document.addEventListener('click', function(e){
  if(openDurationPickerId && !e.target.closest('.dp-wrap')){
    const id = openDurationPickerId;
    openDurationPickerId = null;
    durationPickerRerender(id);
  }
});

/* ---- shared week-range helpers (curriculum Weeks 1–14) ---- */

// Week 1's Monday, matching WEEKS[0].dates ("15–19 Jun 2026") —
// every subsequent week is exactly 7 days later, so this is enough
// to compute which curriculum week any date falls in without
// parsing every week's display string.
// Term 1 runs 14 curriculum weeks (matches WEEKS.length in the
// teacher-facing js/weeks/weeks-core.js) — duplicated as a plain
// number here since superadmin.html doesn't load that file.
const TOTAL_CURRICULUM_WEEKS = 14;

const TERM_WEEK1_MONDAY = new Date(2026, 5, 15);

function weekNumberForDate(d){
  const diffDays = Math.floor((d - TERM_WEEK1_MONDAY) / 86400000);
  const wk = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(TOTAL_CURRICULUM_WEEKS, wk));
}

function currentCurriculumWeek(){
  return weekNumberForDate(new Date());
}

function weekRangeLabel(from, to){
  return from === to ? `Week ${from}` : `Week ${from}–${to}`;
}


function switchAdminSection(section){
  const navMap = {
    overview:'navOverview', supervisors:'navSupervisors',
    review:'navReview', report:'navWeeklyReport', visits:'navVisits', schools:'navSchools',
    adduser:'navAddUser', events:'navEvents'
  };
  Object.values(navMap).forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById(navMap[section]).classList.add('active');

  const subMap = {
    overview:    'Overview across all schools',
    supervisors: 'Supervisor performance — achieved against plan',
    review:      'Quarterly and annual review',
    report:      'Weekly report generator',
    visits:      'Supervisor visit log',
    schools:     'Schools by ward, teacher assignment, and performance',
    adduser:     'Create a new login, or add a new school to the programme',
    events:      'PTMs, teacher trainings, and other scheduled events — across every school'
  };
  const labelMap = {
    overview:    'Overview',
    supervisors: 'Supervisor Dashboard',
    review:      'Quarterly Review',
    report:      'Weekly Report',
    visits:      'Supervisor Visits',
    schools:     'Schools & Teachers',
    adduser:     'Add User',
    events:      'Events'
  };
  document.getElementById('adminSubheading').textContent = subMap[section];
  const labelEl = document.getElementById('pageLabel');
  if(labelEl) labelEl.textContent = labelMap[section];
  document.getElementById('sidebar-schools-section').classList.toggle('hidden', section !== 'schools');

  if(section === 'overview') renderAdminOverview();
  else if(section === 'report') renderWeeklyReport(currentReportWeekRange);
  else if(section === 'visits') renderSupervisorVisitsLog();
  else if(section === 'schools'){ renderSchoolAccordion(); renderSchoolsTeachers(); }
  else if(section === 'adduser') renderAddUserForm();
  else if(section === 'events') renderEventsRecord();
  // The 2 sections below are rendered by js/superadmin-dashboards.js,
  // loaded after this file — see that file for the render functions.
  // (School Performance used to be a 3rd section here — it now lives
  // inside 'schools' as a toggle, see renderSchoolsTeachers().)
  else if(section === 'supervisors') renderSupervisorDashboard();
  else if(section === 'review') renderQuarterlyReview();

  closeSidebar();
}

/* =========================================================
   Helpers
   ========================================================= */

function schoolName(id){ const s = SCHOOLS.find(x => x.id === id); return s ? s.name : id; }
function supervisorName(id){ const s = SUPERVISORS_LIST.find(x => x.id === id); return s ? s.name : id; }

/* =========================================================
   Overview
   ========================================================= */

let overviewWeekRange = null; // null = auto (latest week with any real data)

function resolveOverviewWeek(){
  if(overviewWeekRange) return overviewWeekRange;
  const visitWeeks = Object.keys(SUPERVISOR_VISITS).map(Number);
  const worksheetWeeks = Object.keys(WORKSHEET_COMPLETION).map(Number);
  const dataWeeks = visitWeeks.concat(worksheetWeeks);
  const latest = dataWeeks.length ? Math.max(...dataWeeks) : 1;
  return {from: latest, to: latest};
}

function overviewDurationGroups(range){
  const cur = currentCurriculumWeek();
  const sel = w => range.from === w && range.to === w;
  const quick = [{value: `${cur}-${cur}`, label: `This week (Week ${cur})`, selected: sel(cur)}];
  const allWeeks = [];
  for(let w = 1; w <= TOTAL_CURRICULUM_WEEKS; w++){
    allWeeks.push({value: `${w}-${w}`, label: `Week ${w}`, selected: sel(w)});
  }
  return [{label: 'Quick picks', options: quick}, {label: 'All weeks', options: allWeeks}];
}

durationPickerRerenderers['overviewPeriod'] = () => renderAdminOverview();
durationPickerRerenderers['overviewPeriod:select'] = (value) => {
  const [from, to] = value.split('-').map(Number);
  overviewWeekRange = {from, to};
  renderAdminOverview();
};

function renderAdminOverview(){
  const cur = currentCurriculumWeek();
  const range = resolveOverviewWeek();
  const viewingWeek = range.from;

  // Growth data (STUDENT_GROWTH) is only ever seeded for the schools
  // that have actually had a check-in logged so far — it is NOT the
  // total student population across all 23 schools. Showing it as a
  // bare "Students tracked" number next to "Schools: 23" makes it
  // look like something is broken (e.g. "7" students across 23
  // schools). Being explicit about the sample size here instead of
  // implying full coverage.
  const schoolsWithGrowthData = Object.keys(STUDENT_GROWTH).length;
  const totalStudentsTracked = Object.values(STUDENT_GROWTH).reduce((sum, arr) => sum + arr.length, 0);

  const assignedTeacherCount = SCHOOLS.reduce((sum, sc) =>
    sum + sc.classes.filter(c => c.teacher).length, 0);

  const visits = SUPERVISOR_VISITS[viewingWeek] || [];
  const visitedCount = visits.filter(v => v.visited).length;
  const missedVisits = visits.filter(v => !v.visited);
  const visitRate = visits.length ? Math.round((visitedCount / visits.length) * 100) : 0;

  const completionValues = Object.values(WORKSHEET_COMPLETION[viewingWeek] || {});
  const avgWorksheet = completionValues.length
    ? Math.round(completionValues.reduce((a,b) => a+b, 0) / completionValues.length) : 0;

  // ----- Needs attention — computed from the FULL 23-school dataset,
  // not just the schools with week-by-week sample data. These are
  // real, actionable gaps: an unassigned class, or a teacher name
  // that's still a placeholder from the original ward-sheet import.
  // Ordered by how actionable/urgent each is, most first. -----
  const unassignedClasses = [];
  const placeholderTeacherClasses = [];
  SCHOOLS.forEach(sc => {
    sc.classes.forEach(c => {
      if(!c.teacher){
        unassignedClasses.push(`${sc.name} — ${c.name}`);
      } else if(/bmc/i.test(c.teacher)){
        placeholderTeacherClasses.push(`${sc.name} — ${c.name} (${c.teacher})`);
      }
    });
  });

  const attentionRows = [];
  if(unassignedClasses.length){
    attentionRows.push(`
      <div class="material-row">
        <div>
          <div class="material-name">👤 ${unassignedClasses.length} class${unassignedClasses.length===1?'':'es'} still need a teacher assigned</div>
          <div class="material-meta">${unassignedClasses.slice(0,3).join(' · ')}${unassignedClasses.length>3?' · …':''}</div>
        </div>
        <button class="material-toggle-btn" onclick="switchAdminSection('adduser')">Add User</button>
      </div>`);
  }
  if(placeholderTeacherClasses.length){
    attentionRows.push(`
      <div class="material-row">
        <div>
          <div class="material-name">🏷️ ${placeholderTeacherClasses.length} class${placeholderTeacherClasses.length===1?'':'es'} have a placeholder teacher name to confirm</div>
          <div class="material-meta">${placeholderTeacherClasses.slice(0,3).join(' · ')}${placeholderTeacherClasses.length>3?' · …':''}</div>
        </div>
        <button class="material-toggle-btn" onclick="switchAdminSection('schools')">Schools & Teachers</button>
      </div>`);
  }
  if(missedVisits.length){
    attentionRows.push(`
      <div class="material-row">
        <div>
          <div class="material-name">🚗 ${missedVisits.length} missed visit${missedVisits.length===1?'':'s'} in Week ${viewingWeek}</div>
          <div class="material-meta">${missedVisits.slice(0,3).map(v => schoolName(v.schoolId)).join(' · ')}${missedVisits.length>3?' · …':''}</div>
        </div>
        <button class="material-toggle-btn" onclick="switchAdminSection('visits')">Supervisor Visits</button>
      </div>`);
  }
  const attentionCount = unassignedClasses.length + placeholderTeacherClasses.length + missedVisits.length;

  document.getElementById('admin-body').innerHTML = `
    <div class="visit-banner" style="margin-bottom:18px;">
      <div><strong>Week ${cur} of ${TOTAL_CURRICULUM_WEEKS}</strong> · Term 1</div>
    </div>

    <div class="adm-sel" style="margin-bottom:8px;">Programme</div>
    <div class="stat-grid">
      <div class="stat-card" style="cursor:pointer;" onclick="switchAdminSection('schools')"><p class="label">Schools</p><p class="value">${SCHOOLS.length}</p></div>
      <div class="stat-card" style="cursor:pointer;" onclick="switchAdminSection('schools')"><p class="label">Teachers assigned</p><p class="value">${assignedTeacherCount}</p></div>
      <div class="stat-card" style="cursor:pointer;" onclick="switchAdminSection('supervisors')"><p class="label">Supervisors</p><p class="value">${SUPERVISORS_LIST.length}</p></div>
    </div>

    <div style="display:flex; align-items:center; justify-content:space-between; margin-top:22px; margin-bottom:8px; flex-wrap:wrap; gap:10px;">
      <div class="adm-sel" style="margin-bottom:0;">${weekRangeLabel(viewingWeek, viewingWeek)}'s performance</div>
      ${durationPickerHtml('overviewPeriod', weekRangeLabel(viewingWeek, viewingWeek), overviewDurationGroups(range))}
    </div>
    <div class="stat-grid">
      <div class="stat-card" style="cursor:pointer;" onclick="schoolsTeachersView='performance'; switchAdminSection('schools')">
        <p class="label">Students tracked</p>
        <p class="value">${totalStudentsTracked}</p>
        <p style="font-size:10px; color:var(--text-muted); margin:2px 0 0;">across ${schoolsWithGrowthData} of ${SCHOOLS.length} schools with growth data logged so far</p>
      </div>
      <div class="stat-card" style="cursor:pointer;" onclick="switchAdminSection('visits')"><p class="label">Supervisor visit rate</p><p class="value ${visits.length ? (visitRate>=70?'':'warn') : ''}">${visits.length ? visitRate + '%' : '—'}</p>${!visits.length ? `<p style="font-size:10px; color:var(--text-muted); margin:2px 0 0;">No visits logged for Week ${viewingWeek}</p>` : ''}</div>
      <div class="stat-card" style="cursor:pointer;" onclick="schoolsTeachersView='performance'; switchAdminSection('schools')"><p class="label">Avg worksheet completion</p><p class="value ${completionValues.length ? (avgWorksheet>=70?'':'warn') : ''}">${completionValues.length ? avgWorksheet + '%' : '—'}</p>${!completionValues.length ? `<p style="font-size:10px; color:var(--text-muted); margin:2px 0 0;">No completion data for Week ${viewingWeek}</p>` : ''}</div>
    </div>

    <div class="adm-sel" style="margin-top:22px; margin-bottom:8px;">Upcoming events</div>
    <div id="overviewEventsStrip" class="events-strip">
      <p style="font-size:12px; color:var(--text-muted);">Loading…</p>
    </div>

    <div class="visit-banner" style="margin-top:22px; display:block;">
      <strong>Needs attention${attentionCount ? ' (' + attentionCount + ')' : ''}</strong>
    </div>
    ${attentionRows.length ? `
      <div style="background:var(--card); border:1px solid var(--border); border-radius:10px; padding:4px 16px; margin-bottom:16px;">
        ${attentionRows.join('')}
      </div>
    ` : `
      <p style="font-size:13px; color:var(--success); margin-top:8px;">✓ Nothing needs attention right now.</p>
    `}

    <p style="font-size:12px; color:var(--text-muted); margin-top:4px;">
      Head to <b>Weekly Report</b> to generate a full report with per-class detail, visit feedback, and student growth for any week.
    </p>
  `;

  renderUpcomingEventsStrip();
}

// Real events, fetched the same way the Events tab's calendar does —
// filtered to today-or-later, soonest first, capped at 3. Clicking any
// card (or the strip having nothing to show) just points at the full
// Events tab rather than trying to deep-link into a specific date.
function renderUpcomingEventsStrip(){
  const el = document.getElementById('overviewEventsStrip');
  if(!el) return;
  const todayStr = new Date().toISOString().slice(0, 10);

  fetch('backend/get_events.php' + window.location.search)
    .then(r => r.json())
    .then(data => {
      if(data.status !== 'success'){
        el.innerHTML = `<p style="font-size:12px; color:var(--text-muted);">Could not load events right now.</p>`;
        return;
      }
      const upcoming = data.events
        .filter(e => e.event_date >= todayStr)
        .sort((a, b) => a.event_date.localeCompare(b.event_date))
        .slice(0, 3);

      if(!upcoming.length){
        el.innerHTML = `<p style="font-size:12px; color:var(--text-muted);">No upcoming events scheduled.</p>`;
        return;
      }

      el.innerHTML = upcoming.map(e => {
        const niceDate = new Date(e.event_date + 'T00:00:00').toLocaleDateString([], {day:'numeric', month:'short'});
        const color = EVENT_TYPE_COLORS[e.event_type] || 'var(--text-muted)';
        return `
          <div class="event-strip-card" onclick="switchAdminSection('events')">
            <div class="event-strip-type" style="color:${color};">${e.event_type} · ${niceDate}</div>
            <div class="event-strip-title">${e.class_name ? e.school_name + ' — ' + e.class_name : e.school_name}</div>
          </div>`;
      }).join('') + `<div class="event-strip-more" onclick="switchAdminSection('events')">See all →</div>`;
    })
    .catch(() => {
      el.innerHTML = `<p style="font-size:12px; color:var(--text-muted);">Could not reach the server.</p>`;
    });
}

/* =========================================================
   Weekly Report
   ========================================================= */

let weeklyReportCustomOpen = false;
let weeklyReportCustomFrom = 1;
let weeklyReportCustomTo = 1;

function weeklyReportDurationGroups(range){
  const cur = currentCurriculumWeek();
  const clamp = n => Math.max(1, Math.min(TOTAL_CURRICULUM_WEEKS, n));
  const sel = v => v.from === range.from && v.to === range.to;

  const quick = [
    {from: cur, to: cur},
    {from: clamp(cur-1), to: cur},
    {from: clamp(cur-3), to: cur}
  ].map(v => ({
    value: `${v.from}-${v.to}`,
    label: v.from === v.to ? `This week (Week ${v.from})` : `Past ${v.to-v.from+1} weeks (${weekRangeLabel(v.from, v.to)})`,
    selected: sel(v)
  }));

  const allWeeks = [];
  for(let w = 1; w <= TOTAL_CURRICULUM_WEEKS; w++){
    allWeeks.push({value: `${w}-${w}`, label: `Week ${w}`, selected: sel({from:w, to:w})});
  }

  return [
    {label: 'Quick picks', options: quick},
    {label: 'All weeks', options: allWeeks},
    {label: 'Other', options: [{value:'custom', label:'Custom week range…', selected:false}]}
  ];
}

function weeklyReportCustomRangeHtml(){
  if(!weeklyReportCustomOpen) return '';
  let opts = '';
  for(let w = 1; w <= TOTAL_CURRICULUM_WEEKS; w++) opts += `<option value="${w}">Week ${w}</option>`;
  let fromOpts = '', toOpts = '';
  for(let w = 1; w <= TOTAL_CURRICULUM_WEEKS; w++){
    fromOpts += `<option value="${w}" ${w===weeklyReportCustomFrom?'selected':''}>From: Week ${w}</option>`;
    toOpts   += `<option value="${w}" ${w===weeklyReportCustomTo?'selected':''}>To: Week ${w}</option>`;
  }
  return `
    <div class="dp-divider"></div>
    <div class="dp-custom-range">
      <select onchange="weeklyReportCustomFrom=parseInt(this.value)">${fromOpts}</select>
      <select onchange="weeklyReportCustomTo=parseInt(this.value)">${toOpts}</select>
      <button type="button" onclick="applyWeeklyReportCustomRange()">Apply</button>
    </div>`;
}

function applyWeeklyReportCustomRange(){
  const from = Math.min(weeklyReportCustomFrom, weeklyReportCustomTo);
  const to = Math.max(weeklyReportCustomFrom, weeklyReportCustomTo);
  weeklyReportCustomOpen = false;
  renderWeeklyReport({from, to});
}

durationPickerRerenderers['weeklyReportDuration'] = () => renderWeeklyReport(currentReportWeekRange);
durationPickerRerenderers['weeklyReportDuration:select'] = (value) => {
  if(value === 'custom'){
    weeklyReportCustomOpen = true;
    weeklyReportCustomFrom = currentReportWeekRange.from;
    weeklyReportCustomTo = currentReportWeekRange.to;
    openDurationPickerId = 'weeklyReportDuration'; // keep the panel open so the custom controls are visible
    renderWeeklyReport(currentReportWeekRange);
    return;
  }
  const [from, to] = value.split('-').map(Number);
  renderWeeklyReport({from, to});
};

function renderWeeklyReport(range){
  currentReportWeekRange = range;
  const weeksInRange = [];
  for(let w = range.from; w <= range.to; w++) weeksInRange.push(w);
  const isSingleWeek = range.from === range.to;

  // Combine visits across every week in the selected range.
  let visits = [];
  weeksInRange.forEach(w => {
    (SUPERVISOR_VISITS[w] || []).forEach(v => visits.push(Object.assign({week: w}, v)));
  });

  // Average worksheet completion per school across whichever weeks
  // in range actually have data logged — schools with no data in
  // ANY week of the range still show '—', same as before.
  const completionSums = {};
  weeksInRange.forEach(w => {
    const c = WORKSHEET_COMPLETION[w];
    if(!c) return;
    Object.keys(c).forEach(schoolId => {
      if(!completionSums[schoolId]) completionSums[schoolId] = [];
      completionSums[schoolId].push(c[schoolId]);
    });
  });
  const completion = {};
  Object.keys(completionSums).forEach(schoolId => {
    const arr = completionSums[schoolId];
    completion[schoolId] = Math.round(arr.reduce((a,b) => a+b, 0) / arr.length);
  });

  // A sign-off is inherently tied to ONE week's report — only show
  // it (and only look up an existing review) when a single week is
  // selected, not an aggregated multi-week range.
  const reviewed = isSingleWeek ? reviewedReports[range.from] : null;

  const visitRows = visits.length ? visits.map(v => `
    <tr>
      <td>${weeksInRange.length > 1 ? 'Wk ' + v.week + ' · ' : ''}${v.date} (${v.day})</td>
      <td>${supervisorName(v.supervisorId)}</td>
      <td>${schoolName(v.schoolId)}</td>
      <td><span class="visit-pill ${v.visited?'yes':'no'}">${v.visited ? '✓ Visited' : '✗ Missed'}</span></td>
      <td>${v.feedback}</td>
    </tr>`).join('') : `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No visit records logged for ${weekRangeLabel(range.from, range.to)} yet.</td></tr>`;

  const classRows = SCHOOLS.map(sc => {
    const pct = completion[sc.id] !== undefined ? completion[sc.id] : null;
    const visitCount = visits.filter(v => v.schoolId === sc.id && v.visited).length;
    const totalAttempts = visits.filter(v => v.schoolId === sc.id).length;
    let note = '—';
    if(pct !== null){
      if(pct < 65 && visitCount < 2) note = '⚠ Low completion & few visits';
      else if(pct >= 80 && visitCount >= 2) note = '✓ Strong on both';
      else note = 'Mixed';
    }
    return `<tr>
      <td>${sc.name}<div style="font-size:11px; color:var(--text-muted);">Ward ${sc.ward} · ${sc.classes.map(c => c.name + ': ' + (c.teacher || 'Unassigned')).join(', ')}</div></td>
      <td>${pct !== null ? pct + '%' : '—'}</td>
      <td>${visitCount} / ${totalAttempts}</td>
      <td>${note}</td>
    </tr>`;
  }).join('');

  document.getElementById('admin-body').innerHTML = `
    <div class="report-toolbar">
      <label>Report period
        ${durationPickerHtml('weeklyReportDuration', weekRangeLabel(range.from, range.to), weeklyReportDurationGroups(range), weeklyReportCustomRangeHtml())}
      </label>
      <button class="btn-sup-outline" onclick="window.print()">🖨 Print report</button>
    </div>

    ${reviewed ? `<div class="topic-complete-banner">✓ Reviewed by ${reviewed.by} on ${reviewed.date}${reviewed.note ? ' — "' + reviewed.note + '"' : ''}</div>` : ''}

    <h3 class="report-h3">Daily supervisor visits</h3>
    <div class="report-table-wrap"><table class="report-table">
      <thead><tr><th>Date</th><th>Supervisor</th><th>School</th><th>Status</th><th>Feedback</th></tr></thead>
      <tbody>${visitRows}</tbody>
    </table></div>

    <h3 class="report-h3">Worksheet completion vs supervisor visits (per class)</h3>
    <div class="report-table-wrap"><table class="report-table">
      <thead><tr><th>School / Class</th><th>Worksheets completed</th><th>Visits (actual / scheduled)</th><th>Note</th></tr></thead>
      <tbody>${classRows}</tbody>
    </table></div>

    <h3 class="report-h3">Look up a class — attendance &amp; student growth</h3>
    <div class="class-lookup">
      <div class="class-lookup-selects">
        <label>School
          <select id="lookupSchool" onchange="onLookupSchoolChange()">
            <option value="">Select a school —</option>
            ${SCHOOLS.map(sc => `<option value="${sc.id}">${sc.name}</option>`).join('')}
          </select>
        </label>
        <label>Class
          <select id="lookupClass" onchange="renderClassLookupResult()" disabled>
            <option value="">Select class —</option>
          </select>
        </label>
      </div>
      <div id="classLookupResult"></div>
    </div>

    ${isSingleWeek ? `
      <div class="review-box">
        <label class="field-label-admin">Reviewer note (optional)</label>
        <textarea id="reviewNote" placeholder="e.g. Flagged Sector 8 for a follow-up visit next week">${reviewed ? reviewed.note : ''}</textarea>
        <button class="btn-primary" style="width:auto; padding:10px 20px; margin-top:10px;" onclick="markReportReviewed(${range.from})">${reviewed ? 'Update review' : 'Mark report as reviewed'}</button>
      </div>
    ` : `
      <p style="font-size:12px; color:var(--text-muted); margin-top:16px;">Sign-off is only available when viewing a single week — pick one week above to review and sign off on it.</p>
    `}
  `;
}

function onLookupSchoolChange(){
  const schoolId = document.getElementById('lookupSchool').value;
  const classSelect = document.getElementById('lookupClass');
  document.getElementById('classLookupResult').innerHTML = '';

  if(!schoolId){
    classSelect.innerHTML = '<option value="">Select class —</option>';
    classSelect.disabled = true;
    return;
  }
  classSelect.disabled = false;
  classSelect.innerHTML = '<option value="">Select class —</option>' +
    CLASS_OPTIONS.map(c => `<option value="${c}">${c}</option>`).join('');
}

function renderClassLookupResult(){
  const schoolId = document.getElementById('lookupSchool').value;
  const className = document.getElementById('lookupClass').value;
  const resultEl = document.getElementById('classLookupResult');
  if(!schoolId || !className){ resultEl.innerHTML = ''; return; }

  const data = (CLASS_LOOKUP[schoolId] || {})[className];
  if(!data){
    resultEl.innerHTML = `<div class="empty-state">No attendance or growth data recorded yet for ${schoolName(schoolId)} — ${className}.</div>`;
    return;
  }

  const pct = data.enrolled ? Math.round((data.present / data.enrolled) * 100) : 0;
  const growthRows = data.students.map(st => {
    const w1 = RATING_LEVELS.indexOf(st.week1);
    const w2 = RATING_LEVELS.indexOf(st.latest);
    const trend = w2 > w1 ? '↑ Improved' : (w2 < w1 ? '↓ Declined' : '→ Same');
    return `<tr><td>${st.name}</td><td>${st.week1}</td><td>${st.latest}</td><td>${trend}</td></tr>`;
  }).join('');

  resultEl.innerHTML = `
    <div class="stat-grid" style="margin-top:16px;">
      <div class="stat-card"><p class="label">Enrolled</p><p class="value">${data.enrolled}</p></div>
      <div class="stat-card"><p class="label">Present today</p><p class="value">${data.present}</p></div>
      <div class="stat-card"><p class="label">Attendance</p><p class="value" style="color:${pct>=85?'var(--success)':'var(--warning)'}">${pct}%</p></div>
    </div>
    <h4 style="font-size:13px; margin:16px 0 8px;">Student growth — ${className}</h4>
    <div class="report-table-wrap"><table class="report-table">
      <thead><tr><th>Student</th><th>Week 1 level</th><th>Latest level</th><th>Trend</th></tr></thead>
      <tbody>${growthRows}</tbody>
    </table></div>
  `;
}

function markReportReviewed(weekNum){
  const note = document.getElementById('reviewNote').value;
  reviewedReports[weekNum] = {by: 'Super Admin', date: new Date().toLocaleDateString(), note};
  renderWeeklyReport({from: weekNum, to: weekNum});
}

/* =========================================================
   Supervisor Visits (full history across all weeks)
   ========================================================= */

function renderEventsRecord(){
  document.getElementById('admin-body').innerHTML = `<div id="superadminEventsCalendar"></div>`;
  initEventsCalendar('superadminEventsCalendar', 'backend/get_events.php' + window.location.search);
}

let visitsLogRange = null; // null = All weeks (default, matches old behavior)
let visitsLogCustomOpen = false;
let visitsLogCustomFrom = 1;
let visitsLogCustomTo = 1;

function visitsLogDurationGroups(range){
  const cur = currentCurriculumWeek();
  const clamp = n => Math.max(1, Math.min(TOTAL_CURRICULUM_WEEKS, n));
  const sel = v => range && v.from === range.from && v.to === range.to;

  const quick = [
    {from: cur, to: cur},
    {from: clamp(cur-1), to: cur},
    {from: clamp(cur-3), to: cur}
  ].map(v => ({
    value: `${v.from}-${v.to}`,
    label: v.from === v.to ? `This week (Week ${v.from})` : `Past ${v.to-v.from+1} weeks (${weekRangeLabel(v.from, v.to)})`,
    selected: sel(v)
  }));

  const allWeeks = [];
  for(let w = 1; w <= TOTAL_CURRICULUM_WEEKS; w++){
    allWeeks.push({value: `${w}-${w}`, label: `Week ${w}`, selected: sel({from:w, to:w})});
  }

  return [
    {label: 'Quick picks', options: [{value:'all', label:'All weeks', selected: range===null}].concat(quick)},
    {label: 'Individual weeks', options: allWeeks},
    {label: 'Other', options: [{value:'custom', label:'Custom week range…', selected:false}]}
  ];
}

function visitsLogCustomRangeHtml(){
  if(!visitsLogCustomOpen) return '';
  let fromOpts = '', toOpts = '';
  for(let w = 1; w <= TOTAL_CURRICULUM_WEEKS; w++){
    fromOpts += `<option value="${w}" ${w===visitsLogCustomFrom?'selected':''}>From: Week ${w}</option>`;
    toOpts   += `<option value="${w}" ${w===visitsLogCustomTo?'selected':''}>To: Week ${w}</option>`;
  }
  return `
    <div class="dp-divider"></div>
    <div class="dp-custom-range">
      <select onchange="visitsLogCustomFrom=parseInt(this.value)">${fromOpts}</select>
      <select onchange="visitsLogCustomTo=parseInt(this.value)">${toOpts}</select>
      <button type="button" onclick="applyVisitsLogCustomRange()">Apply</button>
    </div>`;
}

function applyVisitsLogCustomRange(){
  const from = Math.min(visitsLogCustomFrom, visitsLogCustomTo);
  const to = Math.max(visitsLogCustomFrom, visitsLogCustomTo);
  visitsLogCustomOpen = false;
  visitsLogRange = {from, to};
  renderSupervisorVisitsLog();
}

durationPickerRerenderers['visitsLogDuration'] = () => renderSupervisorVisitsLog();
durationPickerRerenderers['visitsLogDuration:select'] = (value) => {
  if(value === 'all'){ visitsLogRange = null; renderSupervisorVisitsLog(); return; }
  if(value === 'custom'){
    visitsLogCustomOpen = true;
    visitsLogCustomFrom = visitsLogRange ? visitsLogRange.from : 1;
    visitsLogCustomTo = visitsLogRange ? visitsLogRange.to : 1;
    openDurationPickerId = 'visitsLogDuration';
    renderSupervisorVisitsLog();
    return;
  }
  const [from, to] = value.split('-').map(Number);
  visitsLogRange = {from, to};
  renderSupervisorVisitsLog();
};

function renderSupervisorVisitsLog(){
  const allVisits = [];
  Object.keys(SUPERVISOR_VISITS).forEach(w => {
    const wNum = parseInt(w, 10);
    if(visitsLogRange && (wNum < visitsLogRange.from || wNum > visitsLogRange.to)) return;
    SUPERVISOR_VISITS[w].forEach(v => allVisits.push(Object.assign({week: w}, v)));
  });
  const rows = allVisits.length ? allVisits.map(v => `
    <tr>
      <td>Week ${v.week}</td>
      <td>${v.date} (${v.day})</td>
      <td>${supervisorName(v.supervisorId)}</td>
      <td>${schoolName(v.schoolId)}</td>
      <td><span class="visit-pill ${v.visited?'yes':'no'}">${v.visited ? '✓ Visited' : '✗ Missed'}</span></td>
      <td>${v.feedback}</td>
    </tr>`).join('') : `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No visit records logged${visitsLogRange ? ' for ' + weekRangeLabel(visitsLogRange.from, visitsLogRange.to) : ''}.</td></tr>`;

  const triggerLabel = visitsLogRange ? weekRangeLabel(visitsLogRange.from, visitsLogRange.to) : 'All weeks';

  document.getElementById('admin-body').innerHTML = `
    <div class="report-toolbar">
      <label>Period
        ${durationPickerHtml('visitsLogDuration', triggerLabel, visitsLogDurationGroups(visitsLogRange), visitsLogCustomRangeHtml())}
      </label>
      <button class="btn-sup-outline" onclick="window.print()">🖨 Print</button>
    </div>
    <div class="report-table-wrap"><table class="report-table">
      <thead><tr><th>Week</th><th>Date</th><th>Supervisor</th><th>School</th><th>Status</th><th>Feedback</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
}

/* =========================================================
   Schools — classified by ward first, teachers live inside
   each school's card (no separate Teachers list anymore)
   ========================================================= */

let selectedWard = null;
let schoolsTeachersView = 'browse'; // 'browse' | 'performance'

function getWards(){
  return [...new Set(SCHOOLS.map(s => s.ward))].sort();
}

function setSchoolsTeachersView(view){
  schoolsTeachersView = view;
  renderSchoolsTeachers();
}

function schoolsTeachersToggleBarHtml(){
  return `
    <div class="adm-seg" role="group" aria-label="Schools & Teachers view" style="margin-bottom:16px;">
      <button class="adm-seg-btn ${schoolsTeachersView==='browse'?'active':''}" onclick="setSchoolsTeachersView('browse')">Browse by ward</button>
      <button class="adm-seg-btn ${schoolsTeachersView==='performance'?'active':''}" onclick="setSchoolsTeachersView('performance')">Performance table</button>
    </div>`;
}

function renderSchoolsTeachers(){
  selectedWard = null;
  expandedSchoolCard = null;

  if(schoolsTeachersView === 'performance'){
    // renderSchoolPerformance() (in superadmin-dashboards.js) now
    // renders into #schoolsPerfBody instead of replacing all of
    // #admin-body, so the toggle above stays put while its own
    // period bar / sort / filter controls re-render inside it.
    document.getElementById('admin-body').innerHTML = schoolsTeachersToggleBarHtml() + `<div id="schoolsPerfBody"></div>`;
    renderSchoolPerformance();
    return;
  }

  document.getElementById('admin-body').innerHTML = schoolsTeachersToggleBarHtml() + `<div class="ward-grid" id="wardGrid"></div>`;
  renderWardCards();
}

function renderWardCards(){
  const container = document.getElementById('wardGrid');
  container.innerHTML = getWards().map(w => {
    const count = SCHOOLS.filter(s => s.ward === w).length;
    return `<div class="ward-card" onclick="selectWard('${w}')">
      <div class="ward-card-code">${w}</div>
      <div class="ward-card-count">${count} school${count===1?'':'s'}</div>
    </div>`;
  }).join('');
}

function selectWard(ward){
  // Drilling into a ward is always a "browse" action — force this
  // explicitly so the view can never get stuck showing the wrong
  // thing no matter what was selected before.
  schoolsTeachersView = 'browse';
  selectedWard = ward;
  expandedSchoolCard = null;
  const count = SCHOOLS.filter(s => s.ward === ward).length;
  // The toggle bar stays visible here too — this used to disappear
  // once you drilled into a ward, leaving only the small "← All
  // wards" text link as the sole way back.
  document.getElementById('admin-body').innerHTML = schoolsTeachersToggleBarHtml() + `
    <button class="btn-sup-outline" style="margin-bottom:16px;" onclick="renderSchoolsTeachers()">← All wards</button>
    <h3 class="report-h3">Ward ${ward} — ${count} school${count===1?'':'s'}</h3>
    <div class="schools-grid" id="schoolsGrid"></div>
  `;
  renderSchoolCards();
}

function renderSchoolCards(){
  const container = document.getElementById('schoolsGrid');
  const list = selectedWard ? SCHOOLS.filter(s => s.ward === selectedWard) : SCHOOLS;
  container.innerHTML = list.map(sc => {
    const sv = SUPERVISORS_LIST.find(s => s.schools.includes(sc.id));
    const isOpen = expandedSchoolCard === sc.id;
    const classSummary = sc.classes.map(c => `${c.name}: ${c.teacher || 'Unassigned'}`).join(' · ');
    return `<div class="school-card" onclick="toggleSchoolCard('${sc.id}')">
      <div class="school-card-head">
        <div>
          <h4>${sc.name}</h4>
          <div class="meta">Ward ${sc.ward} · ${classSummary}</div>
        </div>
        <span class="cat-chevron ${isOpen?'open':''}">▶</span>
      </div>
      ${isOpen ? `<div class="school-card-details" onclick="event.stopPropagation()">
        <div class="row"><span>📍 Address</span><span>${sc.address || '—'}</span></div>
        ${sc.classes.map(c => {
          const strength = CLASS_LOOKUP[sc.id] && CLASS_LOOKUP[sc.id][c.name] ? CLASS_LOOKUP[sc.id][c.name].enrolled : null;
          return `<div class="row"><span>👤 ${c.name} teacher</span><span>${c.teacher || 'Unassigned'}</span></div>
        <div class="row"><span>👥 ${c.name} strength</span><span>${strength !== null ? strength + ' students' : 'Not recorded yet'}</span></div>`;
        }).join('')}
        <div class="row"><span>🧭 Supervisor assigned</span><span>${sv ? sv.name : 'Unassigned'}</span></div>
      </div>` : ''}
    </div>`;
  }).join('');
}

function toggleSchoolCard(schoolId){
  expandedSchoolCard = (expandedSchoolCard === schoolId) ? null : schoolId;
  renderSchoolCards();
}

/* =========================================================
   Sidebar accordion — schools + assigned supervisor. Visit
   history/reports live in Supervisor Visits only, not here —
   this tab is strictly Schools & Teachers information.
   ========================================================= */

function renderSchoolAccordion(){
  const list = document.getElementById('school-accordion-list');
  list.innerHTML = getWards().map(ward => {
    const schoolsInWard = SCHOOLS.filter(s => s.ward === ward);
    const rows = schoolsInWard.map(sc => {
      const sv = SUPERVISORS_LIST.find(s => s.schools.includes(sc.id));
      const isOpen = expandedSchool === sc.id;
      return `<div class="school-accordion-item">
        <div class="school-accordion-head" onclick="toggleSchoolAccordion('${sc.id}')">
          <span>${sc.name}</span>
          <span class="cat-chevron ${isOpen?'open':''}">▶</span>
        </div>
        ${isOpen ? `<div class="school-accordion-body">
          <div class="school-supervisor-row">
            <span>👤 ${sv ? sv.name : 'Unassigned'}</span>
          </div>
        </div>` : ''}
      </div>`;
    }).join('');
    return `<div class="ward-group-label">Ward ${ward}</div>${rows}`;
  }).join('');
}

function toggleSchoolAccordion(schoolId){
  expandedSchool = (expandedSchool === schoolId) ? null : schoolId;
  renderSchoolAccordion();
}

/* =========================================================
   Add User — creates a real login without touching any code.
   Reads unlinked classes from the server so a teacher can be
   linked to a real class right at creation time.
   ========================================================= */

let addUserPageView = 'user'; // 'user' | 'school'

function setAddUserPageView(view){
  addUserPageView = view;
  renderAddUserForm();
}

function addUserPageToggleHtml(){
  return `
    <div class="adm-seg" role="group" aria-label="Add user or school" style="margin-bottom:18px;">
      <button class="adm-seg-btn ${addUserPageView==='user'?'active':''}" onclick="setAddUserPageView('user')">Add user</button>
      <button class="adm-seg-btn ${addUserPageView==='school'?'active':''}" onclick="setAddUserPageView('school')">Add school</button>
    </div>`;
}

function renderAddUserForm(){
  if(addUserPageView === 'school'){
    renderAddSchoolForm();
    return;
  }

  document.getElementById('admin-body').innerHTML = `
    ${addUserPageToggleHtml()}
    <div class="add-user-card">
      <div id="addUserResult"></div>
      <form id="addUserForm" onsubmit="return submitAddUser(event)">
        <label class="field-label-admin">Full name</label>
        <input type="text" id="auName" required />

        <label class="field-label-admin">Email address</label>
        <input type="email" id="auEmail" required />

        <label class="field-label-admin">Role</label>
        <select id="auRole" onchange="toggleAddUserClassField()">
          <option value="teacher">Teacher</option>
          <option value="supervisor">Supervisor</option>
          <option value="superadmin">Super Admin</option>
          <option value="parent">Parent</option>
        </select>

        <div id="auClassWrap">
          <label class="field-label-admin">Assign to class (optional)</label>
          <select id="auClass">
            <option value="">— Loading classes… —</option>
          </select>
        </div>

        <button type="submit" class="btn-primary" style="width:auto; padding:10px 20px; margin-top:10px;">
          Create account
        </button>
      </form>
    </div>
  `;
  loadUnlinkedClassesIntoDropdown();
}

// A school is the actual unit of classification here — classes (and the
// teachers linked to them) belong to a school, not the other way round.
// So a brand new school needs to exist BEFORE there's anything for
// Add User's "assign to class" dropdown to offer. This creates the
// school plus its two starting classes (Jr KG, Sr KG), both unassigned —
// they show up in that dropdown immediately afterward, no other change
// needed there.
function renderAddSchoolForm(){
  document.getElementById('admin-body').innerHTML = `
    ${addUserPageToggleHtml()}
    <div class="add-user-card">
      <div id="addSchoolResult"></div>
      <form id="addSchoolForm" onsubmit="return submitAddSchool(event)">
        <label class="field-label-admin">School name</label>
        <input type="text" id="asName" placeholder="e.g. Andheri MPS" required />

        <label class="field-label-admin">Ward</label>
        <input type="text" id="asWard" placeholder="e.g. F/S, H/E, K/W, L, N, S, T" list="wardSuggestions" required />
        <datalist id="wardSuggestions">
          ${getWards().map(w => `<option value="${w}"></option>`).join('')}
        </datalist>

        <label class="field-label-admin">Address (optional)</label>
        <input type="text" id="asAddress" placeholder="e.g. J.P. Road, Andheri West, Mumbai" />

        <p style="font-size:12px; color:var(--text-muted); margin:10px 0 4px;">
          Jr KG and Sr KG classes are created automatically, unassigned — link a teacher to either one from <b>Add user</b> right after.
        </p>

        <button type="submit" class="btn-primary" style="width:auto; padding:10px 20px; margin-top:10px;">
          Create school
        </button>
      </form>
    </div>
  `;
}

async function submitAddSchool(event){
  event.preventDefault();
  const name = document.getElementById('asName').value.trim();
  const ward = document.getElementById('asWard').value.trim();
  const address = document.getElementById('asAddress').value.trim();
  const resultEl = document.getElementById('addSchoolResult');
  resultEl.innerHTML = '';

  try{
    const res = await fetch('backend/add_school.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, ward, address })
    });
    const data = await res.json();

    if(data.status !== 'success'){
      resultEl.innerHTML = `<div class="au-error">${data.message}</div>`;
      return false;
    }

    // Optimistic local update so the new school shows up immediately in
    // Schools & Teachers etc. without a reload — it's already safely
    // saved server-side by this point. (SCHOOLS itself is still loaded
    // once at page load from a hardcoded seed, not re-fetched from the
    // server, so this in-memory push is what keeps this session's view
    // in sync until that gets switched over to a real fetch.)
    SCHOOLS.push({
      id: 's' + data.school_id,
      name: data.name,
      ward: data.ward,
      address: data.address,
      classes: [
        {name: 'Jr KG', teacher: null},
        {name: 'Sr KG', teacher: null}
      ]
    });

    resultEl.innerHTML = `<div class="au-success"><strong>${data.name}</strong> added to Ward ${data.ward}, with Jr KG and Sr KG ready to be assigned a teacher.</div>`;
    document.getElementById('addSchoolForm').reset();
  }catch(err){
    resultEl.innerHTML = `<div class="au-error">Could not reach the server. Check your connection and try again.</div>`;
  }
  return false;
}

function toggleAddUserClassField(){
  const role = document.getElementById('auRole').value;
  document.getElementById('auClassWrap').style.display = (role === 'teacher') ? 'block' : 'none';
}

async function loadUnlinkedClassesIntoDropdown(){
  const select = document.getElementById('auClass');
  try{
    const res = await fetch('backend/get_unlinked_classes.php');
    const data = await res.json();
    if(data.status !== 'success' || !data.classes.length){
      select.innerHTML = '<option value="">No unlinked classes available</option>';
      return;
    }
    select.innerHTML = '<option value="">— None —</option>' +
      data.classes.map(c =>
        `<option value="${c.id}">${c.school_name} — ${c.name}</option>`
      ).join('');
  }catch(err){
    select.innerHTML = '<option value="">Could not load classes</option>';
  }
}

async function submitAddUser(event){
  event.preventDefault();
  const name = document.getElementById('auName').value.trim();
  const email = document.getElementById('auEmail').value.trim();
  const role = document.getElementById('auRole').value;
  const classId = document.getElementById('auClass').value;
  const resultEl = document.getElementById('addUserResult');

  resultEl.innerHTML = '';

  try{
    const res = await fetch('backend/add_user.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, role, class_id: classId || null })
    });
    const data = await res.json();

    if(data.status !== 'success'){
      resultEl.innerHTML = `<div class="au-error">${data.message}</div>`;
      return false;
    }

    resultEl.innerHTML = `
      <div class="au-success">
        <strong>Account created.</strong> Copy this password now — it can't be shown again.<br>
        Email: <b>${data.email}</b><br>
        Temporary password: <b style="font-family:monospace;">${data.temp_password}</b>
      </div>`;
    document.getElementById('addUserForm').reset();
    toggleAddUserClassField();
    loadUnlinkedClassesIntoDropdown();
  }catch(err){
    resultEl.innerHTML = `<div class="au-error">Could not reach the server. Check your connection and try again.</div>`;
  }
  return false;
}

/* =========================================================
   Initial render
   ========================================================= */

renderAdminOverview();