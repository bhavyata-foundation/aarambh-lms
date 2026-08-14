/* =========================================================
   SUPER ADMIN — mock data
   (same shape as the future DB tables: schools, supervisor_assignments,
   supervisor_visits, worksheet_completion, proficiency_ratings)
   ========================================================= */

const SCHOOL_AREAS = [
  'Sector 12','Sector 8','Rampur','Shivajinagar','Ambernath','Kalyan East','Dombivli',
  'Thane West','Vashi','Nerul','Kharghar','Panvel','Uran','Taloja','Kamothe',
  'Belapur','Airoli','Ghansoli','Kopar Khairane','Sanpada','Turbhe','Mankhurd',
  'Govandi','Chembur','Wadala'
];
const TEACHER_NAMES = ['Mrs. Sharma','Mrs. Iyer','Ms. Kulkarni','Mrs. Nair','Mr. Joshi','Mrs. Deshpande','Ms. Rao','Mrs. Menon','Mr. Patil','Mrs. Reddy'];
const CLASS_NAMES = ['Jr KG A','Jr KG B','Sr KG A','Sr KG B'];

const SCHOOLS = SCHOOL_AREAS.map((area, i) => ({
  id: 's' + (i+1),
  name: 'Bhavyata Balwadi — ' + area,
  class: CLASS_NAMES[i % CLASS_NAMES.length],
  teacher: TEACHER_NAMES[i % TEACHER_NAMES.length],
  address: 'Near ' + area + ' Market Road, ' + area + ', Mumbai, Maharashtra 4000' + (10 + (i % 90)),
  strength: 24 + (i % 7) * 3
}));

const SUPERVISORS_LIST = [
  {id:'sv1', name:'Mr. Deshpande',    schools:['s1','s2','s3','s4','s5']},
  {id:'sv2', name:'Mrs. Nair',        schools:['s6','s7','s8','s9','s10']},
  {id:'sv3', name:'Mr. Kulin Maniar', schools:['s11','s12','s13','s14','s15']},
  {id:'sv4', name:'Mrs. Fernandes',   schools:['s16','s17','s18','s19','s20']},
  {id:'sv5', name:'Mr. Bhosale',      schools:['s21','s22','s23','s24','s25']}
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

/* =========================================================
   Section switching
   ========================================================= */

function switchAdminSection(section){
  const navMap = {overview:'navOverview', report:'navWeeklyReport', visits:'navVisits', schools:'navSchools'};
  Object.values(navMap).forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById(navMap[section]).classList.add('active');

  const subMap = {
    overview: 'Overview across all schools',
    report:   'Weekly report generator',
    visits:   'Supervisor visit log',
    schools:  'Schools & teachers'
  };
  document.getElementById('adminSubheading').textContent = subMap[section];
  document.getElementById('sidebar-schools-section').classList.toggle('hidden', section !== 'schools');

  if(section === 'overview') renderAdminOverview();
  else if(section === 'report') renderWeeklyReport(currentReportWeek);
  else if(section === 'visits') renderSupervisorVisitsLog();
  else if(section === 'schools'){ renderSchoolAccordion(); renderSchoolsTeachers(); }

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
  const visits = SUPERVISOR_VISITS[1] || [];
  const visitedCount = visits.filter(v => v.visited).length;
  const visitRate = visits.length ? Math.round((visitedCount / visits.length) * 100) : 0;
  const completionValues = Object.values(WORKSHEET_COMPLETION[1] || {});
  const avgWorksheet = completionValues.length
    ? Math.round(completionValues.reduce((a,b) => a+b, 0) / completionValues.length) : 0;

  document.getElementById('admin-body').innerHTML = `
    <div class="stat-grid">
      <div class="stat-card"><p class="label">Schools</p><p class="value">${SCHOOLS.length}</p></div>
      <div class="stat-card"><p class="label">Teachers</p><p class="value">${SCHOOLS.length}</p></div>
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
      <td>${sc.name}<div style="font-size:11px; color:var(--text-muted);">${sc.class} · ${sc.teacher}</div></td>
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
   Schools & Teachers — cards in the main dash
   ========================================================= */

function renderSchoolsTeachers(){
  document.getElementById('admin-body').innerHTML = `<div class="schools-grid" id="schoolsGrid"></div>`;
  renderSchoolCards();
}

function renderSchoolCards(){
  const container = document.getElementById('schoolsGrid');
  container.innerHTML = SCHOOLS.map(sc => {
    const sv = SUPERVISORS_LIST.find(s => s.schools.includes(sc.id));
    const isOpen = expandedSchoolCard === sc.id;
    return `<div class="school-card" onclick="toggleSchoolCard('${sc.id}')">
      <div class="school-card-head">
        <div>
          <h4>${sc.name}</h4>
          <div class="meta">${sc.class} · ${sc.teacher}</div>
        </div>
        <span class="cat-chevron ${isOpen?'open':''}">▶</span>
      </div>
      ${isOpen ? `<div class="school-card-details" onclick="event.stopPropagation()">
        <div class="row"><span>📍 Address</span><span>${sc.address}</span></div>
        <div class="row"><span>👶 Student strength</span><span>${sc.strength}</span></div>
        <div class="row"><span>👤 Supervisor assigned</span><span>${sv ? sv.name : 'Unassigned'}</span></div>
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
  list.innerHTML = SCHOOLS.map(sc => {
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
    <h3 class="report-h3">Visit history — ${sc.class} · ${sc.teacher}</h3>
    <div class="report-table-wrap"><table class="report-table">
      <thead><tr><th>Week</th><th>Date</th><th>Status</th><th>Feedback</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  `;
}

/* =========================================================
   Initial render
   ========================================================= */

renderAdminOverview();