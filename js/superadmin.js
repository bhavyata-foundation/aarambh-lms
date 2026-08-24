/* =========================================================
   SESSION GUARD — checks with the server that someone is actually
   logged in as a superadmin before showing anything on this page.
   ========================================================= */
fetch('backend/session_check.php')
  .then(r => r.json())
  .then(data => {
    if(data.status !== 'logged_in' || data.role !== 'superadmin'){
      window.location.href = 'index.html';
    }
  })
  .catch(() => { window.location.href = 'index.html'; });

// -------------------------------------------------------------------------
// PREVIEW AS — lets a logged-in superadmin temporarily switch their
// session to view as Teacher / Supervisor / Parent, without logging out
// or needing a second password. See backend/preview_as.php — this only
// works because the CURRENT session is already a real superadmin login;
// it's not reachable any other way.
// -------------------------------------------------------------------------
function previewAs(role){
  closeUserMenu();
  fetch('backend/preview_as.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ role })
  })
    .then(r => r.json())
    .then(data => {
      if(data.status === 'success'){
        window.location.href = data.redirect;
      } else {
        alert(data.message || 'Could not start preview.');
      }
    })
    .catch(() => { alert('Could not reach the server.'); });
}

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
let currentReportWeek = 1;
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
   Section switching
   ========================================================= */

function switchAdminSection(section){
  const navMap = {
    overview:'navOverview', supervisors:'navSupervisors', performance:'navPerformance',
    review:'navReview', report:'navWeeklyReport', visits:'navVisits', schools:'navSchools',
    adduser:'navAddUser', events:'navEvents'
  };
  Object.values(navMap).forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById(navMap[section]).classList.add('active');

  const subMap = {
    overview:    'Overview across all schools',
    supervisors: 'Supervisor performance — achieved against plan',
    performance: 'All schools — attendance, learning and readiness',
    review:      'Quarterly and annual review',
    report:      'Weekly report generator',
    visits:      'Supervisor visit log',
    schools:     'Schools by ward',
    adduser:     'Create a new login for a teacher, supervisor, or parent',
    events:      'PTMs, teacher trainings, and other scheduled events — across every school'
  };
  const labelMap = {
    overview:    'Overview',
    supervisors: 'Supervisor Dashboard',
    performance: 'School Performance',
    review:      'Quarterly Review',
    report:      'Weekly Report',
    visits:      'Supervisor Visits',
    schools:     'Schools',
    adduser:     'Add User',
    events:      'Events'
  };
  document.getElementById('adminSubheading').textContent = subMap[section];
  const labelEl = document.getElementById('pageLabel');
  if(labelEl) labelEl.textContent = labelMap[section];
  document.getElementById('sidebar-schools-section').classList.toggle('hidden', section !== 'schools');

  if(section === 'overview') renderAdminOverview();
  else if(section === 'report') renderWeeklyReport(currentReportWeek);
  else if(section === 'visits') renderSupervisorVisitsLog();
  else if(section === 'schools'){ renderSchoolAccordion(); renderSchoolsTeachers(); }
  else if(section === 'adduser') renderAddUserForm();
  else if(section === 'events') renderEventsRecord();
  // The 3 sections below are rendered by js/superadmin-dashboards.js,
  // loaded after this file — see that file for the render functions.
  else if(section === 'supervisors') renderSupervisorDashboard();
  else if(section === 'performance') renderSchoolPerformance();
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

function renderAdminOverview(){
  const totalStudents = Object.values(STUDENT_GROWTH).reduce((sum, arr) => sum + arr.length, 0);
  const assignedTeacherCount = SCHOOLS.reduce((sum, sc) =>
    sum + sc.classes.filter(c => c.teacher).length, 0);
  const visits = SUPERVISOR_VISITS[1] || [];
  const visitedCount = visits.filter(v => v.visited).length;
  const visitRate = visits.length ? Math.round((visitedCount / visits.length) * 100) : 0;
  const completionValues = Object.values(WORKSHEET_COMPLETION[1] || {});
  const avgWorksheet = completionValues.length
    ? Math.round(completionValues.reduce((a,b) => a+b, 0) / completionValues.length) : 0;

  document.getElementById('admin-body').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><p class="label">Schools</p><p class="value">${SCHOOLS.length}</p></div>
      <div class="stat-card"><p class="label">Teachers assigned</p><p class="value">${assignedTeacherCount}</p></div>
      <div class="stat-card"><p class="label">Supervisors</p><p class="value">${SUPERVISORS_LIST.length}</p></div>
      <div class="stat-card"><p class="label">Students tracked</p><p class="value">${totalStudents}</p></div>
      <div class="stat-card"><p class="label">Supervisor visit rate (Wk 1)</p><p class="value" style="color:${visitRate>=70?'var(--success)':'var(--danger)'}">${visitRate}%</p></div>
      <div class="stat-card"><p class="label">Avg worksheet completion (Wk 1)</p><p class="value">${avgWorksheet}%</p></div>
    </div>
    <p style="font-size:12px; color:var(--text-muted); margin-top:14px;">
      Head to <b>Weekly Report</b> to generate a full report with per-class detail, visit feedback, and student growth for any week.
    </p>
  `;
}

/* =========================================================
   Weekly Report
   ========================================================= */

function renderWeeklyReport(weekNum){
  currentReportWeek = weekNum;
  const visits = SUPERVISOR_VISITS[weekNum] || [];
  const completion = WORKSHEET_COMPLETION[weekNum] || {};
  const reviewed = reviewedReports[weekNum];

  const visitRows = visits.length ? visits.map(v => `
    <tr>
      <td>${v.date} (${v.day})</td>
      <td>${supervisorName(v.supervisorId)}</td>
      <td>${schoolName(v.schoolId)}</td>
      <td><span class="visit-pill ${v.visited?'yes':'no'}">${v.visited ? '✓ Visited' : '✗ Missed'}</span></td>
      <td>${v.feedback}</td>
    </tr>`).join('') : `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No visit records logged for this week yet.</td></tr>`;

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
      <label>Week
        <select id="reportWeekSelect" onchange="renderWeeklyReport(parseInt(this.value))">
          ${Object.keys(SUPERVISOR_VISITS).map(w => `<option value="${w}" ${parseInt(w)===weekNum?'selected':''}>Week ${w}</option>`).join('')}
        </select>
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

    <div class="review-box">
      <label class="field-label-admin">Reviewer note (optional)</label>
      <textarea id="reviewNote" placeholder="e.g. Flagged Sector 8 for a follow-up visit next week">${reviewed ? reviewed.note : ''}</textarea>
      <button class="btn-primary" style="width:auto; padding:10px 20px; margin-top:10px;" onclick="markReportReviewed(${weekNum})">${reviewed ? 'Update review' : 'Mark report as reviewed'}</button>
    </div>
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
  renderWeeklyReport(weekNum);
}

/* =========================================================
   Supervisor Visits (full history across all weeks)
   ========================================================= */

function renderEventsRecord(){
  document.getElementById('admin-body').innerHTML = `<div id="superadminEventsCalendar"></div>`;
  initEventsCalendar('superadminEventsCalendar', 'backend/get_events.php');
}

function renderSupervisorVisitsLog(){
  const allVisits = [];
  Object.keys(SUPERVISOR_VISITS).forEach(w => {
    SUPERVISOR_VISITS[w].forEach(v => allVisits.push(Object.assign({week: w}, v)));
  });
  const rows = allVisits.map(v => `
    <tr>
      <td>Week ${v.week}</td>
      <td>${v.date} (${v.day})</td>
      <td>${supervisorName(v.supervisorId)}</td>
      <td>${schoolName(v.schoolId)}</td>
      <td><span class="visit-pill ${v.visited?'yes':'no'}">${v.visited ? '✓ Visited' : '✗ Missed'}</span></td>
      <td>${v.feedback}</td>
    </tr>`).join('');

  document.getElementById('admin-body').innerHTML = `
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

function getWards(){
  return [...new Set(SCHOOLS.map(s => s.ward))].sort();
}

function renderSchoolsTeachers(){
  selectedWard = null;
  document.getElementById('admin-body').innerHTML = `<div class="ward-grid" id="wardGrid"></div>`;
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
  selectedWard = ward;
  expandedSchoolCard = null;
  const count = SCHOOLS.filter(s => s.ward === ward).length;
  document.getElementById('admin-body').innerHTML = `
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
        ${sc.classes.map(c => `<div class="row"><span>👤 ${c.name} teacher</span><span>${c.teacher || 'Unassigned'}</span></div>`).join('')}
        <div class="row"><span>🧭 Supervisor assigned</span><span>${sv ? sv.name : 'Unassigned'}</span></div>
        <div>
          <span style="font-weight:bold;">🗒 Weekly visit</span>
          <select class="school-week-select" onchange="showSchoolWeekVisit('${sc.id}', this.value)">
            <option value="">Select a week —</option>
            ${Object.keys(SUPERVISOR_VISITS).map(w => `<option value="${w}">Week ${w}</option>`).join('')}
          </select>
          <div class="school-week-result" id="weekResult-${sc.id}"></div>
        </div>
      </div>` : ''}
    </div>`;
  }).join('');
}

function toggleSchoolCard(schoolId){
  expandedSchoolCard = (expandedSchoolCard === schoolId) ? null : schoolId;
  renderSchoolCards();
}

function showSchoolWeekVisit(schoolId, weekNum){
  const resultEl = document.getElementById('weekResult-' + schoolId);
  if(!resultEl) return;
  if(!weekNum){ resultEl.innerHTML = ''; return; }
  const visits = (SUPERVISOR_VISITS[weekNum] || []).filter(v => v.schoolId === schoolId);
  if(!visits.length){
    resultEl.innerHTML = 'No visit recorded for Week ' + weekNum + '.';
    return;
  }
  resultEl.innerHTML = visits.map(v => `
    <div style="margin-bottom:6px;">
      <b>${v.date} (${v.day})</b> — <span class="visit-pill ${v.visited?'yes':'no'}">${v.visited?'✓ Visited':'✗ Missed'}</span><br/>
      <span style="color:var(--text-muted);">${v.feedback}</span>
    </div>`).join('');
}

/* =========================================================
   Sidebar accordion — schools + assigned supervisor + "View report"
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
            <button class="btn-view-report-sm" onclick="event.stopPropagation(); viewSchoolReport('${sc.id}')">View report →</button>
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

function viewSchoolReport(schoolId){
  document.getElementById('adminSubheading').textContent = 'Visit report — ' + schoolName(schoolId);
  renderSchoolVisitReport(schoolId);
  closeSidebar();
}

function renderSchoolVisitReport(schoolId){
  const sc = SCHOOLS.find(s => s.id === schoolId);
  const sv = SUPERVISORS_LIST.find(s => s.schools.includes(schoolId));

  const allVisits = [];
  Object.keys(SUPERVISOR_VISITS).forEach(w => {
    SUPERVISOR_VISITS[w].forEach(v => { if(v.schoolId === schoolId) allVisits.push(Object.assign({week:w}, v)); });
  });

  const rows = allVisits.length ? allVisits.map(v => `
    <tr>
      <td>Week ${v.week}</td>
      <td>${v.date} (${v.day})</td>
      <td><span class="visit-pill ${v.visited?'yes':'no'}">${v.visited ? '✓ Visited' : '✗ Missed'}</span></td>
      <td>${v.feedback}</td>
    </tr>`).join('') : `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">No visit records logged for this school yet.</td></tr>`;

  const visitedCount = allVisits.filter(v => v.visited).length;
  const visitRate = allVisits.length ? Math.round((visitedCount / allVisits.length) * 100) : 0;

  document.getElementById('admin-body').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><p class="label">School</p><p class="value" style="font-size:15px;">${sc.name}</p></div>
      <div class="stat-card"><p class="label">Assigned supervisor</p><p class="value" style="font-size:15px;">${sv ? sv.name : 'Unassigned'}</p></div>
      <div class="stat-card"><p class="label">Visit rate</p><p class="value" style="color:${visitRate>=70?'var(--success)':'var(--danger)'}">${visitRate}%</p></div>
      <div class="stat-card"><p class="label">Total visits logged</p><p class="value">${allVisits.length}</p></div>
    </div>
    <h3 class="report-h3">Visit history — Ward ${sc.ward} · ${sc.classes.map(c => c.name + ': ' + (c.teacher || 'Unassigned')).join(', ')}</h3>
    <div class="report-table-wrap"><table class="report-table">
      <thead><tr><th>Week</th><th>Date</th><th>Status</th><th>Feedback</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
}

/* =========================================================
   Add User — creates a real login without touching any code.
   Reads unlinked classes from the server so a teacher can be
   linked to a real class right at creation time.
   ========================================================= */

function renderAddUserForm(){
  document.getElementById('admin-body').innerHTML = `
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