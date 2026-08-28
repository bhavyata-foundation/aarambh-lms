/* =========================================================================
   TEACHER.JS — every function/data structure that runs the teacher
   dashboard itself (curriculum, attendance, materials, my day, parent
   volunteers, weekly activities). Login mechanics (login form, saved
   password, dev-bypass trigger) live in main.js on index.html instead —
   this file assumes someone is ALREADY a logged-in teacher by the time
   it runs, and checks that for real below before showing anything.
   ========================================================================= */

/* =========================================================================
   SESSION GUARD — checks with the server that someone is actually logged
   in as a teacher before showing anything on this page. Forwards this
   page's own query string (e.g. ?dev_role=teacher) so the dev-bypass
   still works when landing here directly.
   ========================================================================= */
function logout(){
  fetch('backend/logout.php').catch(() => {});
  // Plain index.html would immediately re-trigger main.js's auto-dev-
  // bypass on localhost and bounce straight back into this dashboard —
  // making logout look broken. ?no_dev=1 shows the real login page.
  window.location.href = 'index.html?no_dev=1';
}

fetch('backend/session_check.php' + window.location.search)
  .then(r => r.json())
  .then(data => {
    if(data.status !== 'logged_in' || data.role !== 'teacher'){
      window.location.href = 'index.html';
      return;
    }
    enterTeacherFlow();
    renderPreviewBanner(data.is_previewing);

    // Coming from Textbooks' sidebar (e.g. teacher.html?section=materials) —
    // jump straight to that section, but only if the dashboard itself is
    // actually showing (enterTeacherFlow sometimes shows the attendance
    // gate screen instead, which has no sidebar to switch within).
    const params = new URLSearchParams(window.location.search);
    const requestedSection = params.get('section');
    if(requestedSection && !document.getElementById('view-dashboard').classList.contains('hidden')){
      switchSidebarSection(requestedSection);
    }
  })
  .catch(() => { window.location.href = 'index.html'; });

/* ===================== SECTION 1: CURRICULUM DATA & HELPERS ===================== */

  // These got lost in the original main.js/teacher.js split — every
  // curriculum function below (and i18n.js) depends on them existing.
  let currentWeekNum = 1;
  let currentDay = 'mon';

  const DAYS = [
    {key:'mon', label:'Monday'},
    {key:'tue', label:'Tuesday'},
    {key:'wed', label:'Wednesday'},
    {key:'thu', label:'Thursday'},
    {key:'fri', label:'Friday'}
  ];

  const DOMAINS = [
    {key:'welcome',  label:'Welcome & Free Play',   time:'9:00–9:20 AM',   cg:'CG-4',    h5p:true},
    {key:'story',    label:'Story / Rhyme',          time:'9:20–9:45 AM',   cg:'CG-9',    h5p:true},
    {key:'numeracy', label:'Numeracy',                time:'9:45–10:15 AM',  cg:'CG-8',    h5p:true},
    {key:'language', label:'Language',                time:'10:25–10:50 AM', cg:'CG-10',   h5p:true},
    {key:'create',   label:'Create + Fine Motor',     time:'10:50–11:20 AM', cg:'CG-12',   h5p:true},
    {key:'outdoor',  label:'Outdoor / Gross Motor',   time:'11:20–11:40 AM', cg:'CG-3',    h5p:true},
    {key:'tidy',     label:'Tidy & Put Away',          time:'11:40–11:45 AM', cg:'CG-11',   h5p:true},
    {key:'reflect',  label:'Reflect & Wrap',          time:'11:45 AM–12:00 PM', cg:'CG-9/10', h5p:true}
  ];

  // -----------------------------------------------------------------
  // DATABASE POCKET — this small lookup is genuinely tiny (a few
  // dozen short text rows even at full scale), so storage size was
  // never the deciding factor for where it lives. It's kept here as
  // hardcoded frontend data for now since we're doing frontend-only
  // work right now — but this maps 1:1 onto the `curricular_goals`
  // table already designed in the schema, and should move there once
  // the backend for this page gets built, so it can be edited/
  // translated without redeploying code.
  //   Real call would look like:
  //     fetch('backend/get_curricular_goals.php')
  // -----------------------------------------------------------------
  const CG_LABELS = {
    'CG-3':    'Physical & Motor — builds strength, balance and coordination',
    'CG-4':    'Physical & Motor — builds habits that keep them healthy and safe',
    'CG-8':    'Cognitive — builds mathematical understanding using quantities and shapes',
    'CG-9':    'Socio-Emotional — builds emotional intelligence and social awareness',
    'CG-10':   'Language — builds effective communication in two languages',
    'CG-11':   'Life Skills — builds responsibility and care for shared spaces',
    'CG-12':   'Creative & Aesthetic — expresses emotions through visual and performing arts',
    'CG-9/10': 'Socio-Emotional & Language — reflects on the day and communicates learning'
  };

  function broadCompetencyFallback(domainKey){
    const dom = DOMAINS.find(d => d.key === domainKey);
    if(!dom || !dom.cg) return 'Not mapped yet';
    return CG_LABELS[dom.cg] || 'Not mapped yet';
  }

  // -----------------------------------------------------------------
  // DATABASE POCKET — same reasoning as CG_LABELS above: this is small
  // text data, hardcoded here only because we're doing frontend-only
  // work right now. Maps onto the `competencies` table already
  // designed in the schema (linked to curricular_goals), once this
  // page gets a real backend.
  //
  // Unlike CG_LABELS (fixed per domain slot, same every day), this is
  // specific to what's ACTUALLY being done that day — matching the
  // real Week 1 activity content in WEEKLY_PLAN above, one to one.
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------
  // Reads the current UI language from i18n.js's global `currentLang`
  // (loaded before this file — see index.html). A day's value can be
  // either a plain string (older/untranslated content — shown as-is
  // regardless of selected language) or an {en, hi, mr} object (fully
  // translated content — returns whichever language is selected,
  // falling back to English if that specific language is missing).
  // -----------------------------------------------------------------
  function pickLang(value){
    // Defensive: falls back to English if i18n.js hasn't loaded (e.g.
    // its file is missing on the server) rather than throwing and
    // breaking the whole dashboard over a language-switcher problem.
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'en';
    if(typeof value === 'string') return value;
    if(value && typeof value === 'object'){
      return value[lang] || value.en || Object.values(value)[0] || 'Not available';
    }
    return 'Not available';
  }

  // The language switcher ONLY affects the interactive H5P activities —
  // nothing else. "Planned activity" and "Covers" text always stays
  // English, regardless of which language tab is selected.
  function alwaysEnglish(value){
    if(typeof value === 'string') return value;
    if(value && typeof value === 'object') return value.en || Object.values(value)[0] || 'Not available';
    return 'Not available';
  }

  function competencyFor(domainKey){
    const wk = ACTIVITY_COMPETENCIES[currentWeekKey()];
    if(wk && wk[domainKey] && wk[domainKey][currentDay] !== undefined){
      return pickLang(wk[domainKey][currentDay]);
    }
    // No activity-specific competency authored for this week yet —
    // fall back to the broad domain-level label rather than showing nothing.
    return broadCompetencyFallback(domainKey);
  }


  function currentWeekKey(){ return 'wk' + currentWeekNum; }

  function todaysActivity(domainKey){
    const wk = WEEKLY_PLAN[currentWeekKey()];
    if(!wk || !wk[domainKey] || wk[domainKey][currentDay] === undefined) return 'Not planned yet';
    return pickLang(wk[domainKey][currentDay]);
  }

  // Called by i18n.js's applyTranslations() whenever the language
  // switches, so activity text on-screen updates immediately instead
  // of only changing after the next click/re-render.
  function onLanguageChanged(){
    if(typeof renderSidebar === 'function') renderSidebar();
    if(typeof renderWeekBody === 'function' && document.getElementById('week-body') && !document.getElementById('week-body').classList.contains('hidden')){
      renderWeekBody();
    }
  }

  const SAMPLE_STUDENTS = ['Aarav Sharma','Priya Patil','Rohan Desai','Ananya Joshi','Kabir Mehta'];
  const RATING_LEVELS = ['Emerging','Progressing','Achieving','Exceeding'];
  /* =========================================================
     TEACHER'S OWN ATTENDANCE — gated at HER class's actual start
     time, not a fixed clock time for everyone. A teacher whose
     class runs 9:30–12:30 gets gated at 9:30; one whose class
     runs 1:00–4:00 gets gated at 1:00.

     If a teacher owns two classes (e.g. Jr KG + Sr KG) with
     different start times, the gate uses the EARLIER of the two
     — she should have marked her own attendance by the time her
     first session of the day begins.

     DATABASE POCKET — until the real backend call exists, this
     falls back to a placeholder. Once connected, replace with:
       const res = await fetch('backend/get_my_classes.php');
       const classes = await res.json();
       const startTimes = classes.map(c => c.start_time); // "09:30:00" etc.
       gateHour/gateMinute = the earliest one, parsed
     ========================================================= */

  let ATTENDANCE_GATE_HOUR = 9;    // PLACEHOLDER — replace with the teacher's real class start time
  let ATTENDANCE_GATE_MINUTE = 30; // PLACEHOLDER — same

  
/* ===================== SECTION 2: ATTENDANCE — GATE & MY RECORD ===================== */

  function setGateFromClassStartTimes(startTimesList){
    // startTimesList: array of "HH:MM:SS" strings, one per class this teacher owns
    if(!startTimesList || !startTimesList.length) return;
    const parsed = startTimesList.map(t => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    });
    const earliestMinutes = Math.min(...parsed);
    ATTENDANCE_GATE_HOUR = Math.floor(earliestMinutes / 60);
    ATTENDANCE_GATE_MINUTE = earliestMinutes % 60;
  }

  function todayDateKey(){ return new Date().toISOString().slice(0,10); }

  function getGateTimeToday(){
    const d = new Date();
    d.setHours(ATTENDANCE_GATE_HOUR, ATTENDANCE_GATE_MINUTE, 0, 0);
    return d;
  }

  function isPastGateTime(){
    return new Date() >= getGateTimeToday();
  }

  // ---------------------------------------------------------
  // DATABASE POCKET — this is the one function to swap out
  // once a real backend exists.
  //   Table: teacher_attendance
  //   Columns: id, teacher_id, date, status ('present'|'absent'), marked_at
  //   Constraint: UNIQUE (teacher_id, date) — one record per teacher per day
  //   Real call would look like:
  //     fetch('/api/teacher-attendance', {
  //       method: 'POST',
  //       headers: {'Content-Type':'application/json'},
  //       body: JSON.stringify(record)
  //     });
  // For now it's saved to localStorage so the gate persists
  // correctly across refreshes/logins on the same day.
  // ---------------------------------------------------------
  function saveTeacherAttendanceRecord(record){
    try{ localStorage.setItem('teacherAttendance_' + record.date, JSON.stringify(record)); }
    catch(e){ /* localStorage unavailable — record still applies for this session */ }
  }

  function getTodayAttendanceRecord(){
    try{
      const raw = localStorage.getItem('teacherAttendance_' + todayDateKey());
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  }

  // ---------------------------------------------------------
  // DATABASE POCKET — same swap-out note as above. Once a real
  // backend exists, this becomes:
  //   fetch(`/api/teacher-attendance?month=${year}-${month+1}`)
  // For now it scans localStorage for every saved day in the
  // given month.
  // ---------------------------------------------------------
  function getMonthAttendanceRecords(year, month){
    const records = {};
    const prefix = 'teacherAttendance_' + year + '-' + String(month + 1).padStart(2, '0');
    for(let i = 0; i < localStorage.length; i++){
      const key = localStorage.key(i);
      if(key && key.indexOf(prefix) === 0){
        try{
          const rec = JSON.parse(localStorage.getItem(key));
          const dateStr = key.replace('teacherAttendance_', '');
          records[dateStr] = rec; // full record: {status, markedAt, ...}
        }catch(e){ /* skip malformed entry */ }
      }
    }
    return records;
  }

  let calendarYear = new Date().getFullYear();
  let calendarMonth = new Date().getMonth();

  function renderAttendanceCalendar(year, month){
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = firstDay.toLocaleDateString([], {month:'long', year:'numeric'});
    const todayStr = todayDateKey();
    const records = getMonthAttendanceRecords(year, month);

    let present = 0, absent = 0, marked = 0;
    let cellsHtml = '';

    for(let i = 0; i < startWeekday; i++) cellsHtml += '<div></div>';

    for(let d = 1; d <= daysInMonth; d++){
      const dateObj = new Date(year, month, d);
      const dayOfWeek = dateObj.getDay();
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const record = records[dateStr];
      const status = record ? record.status : undefined;
      const isToday = dateStr === todayStr;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let cellClass = 'cal-day';
      if(status === 'present'){ cellClass += ' cal-present'; present++; marked++; }
      else if(status === 'absent'){ cellClass += ' cal-absent'; absent++; marked++; }
      else if(isWeekend){ cellClass += ' cal-noschool'; }
      if(isToday) cellClass += ' cal-today';

      cellsHtml += `<div class="${cellClass}" onclick="showAttendanceDayDetail('${dateStr}')">${d}</div>`;
    }

    const rate = marked > 0 ? Math.round((present / marked) * 100) : 0;

    document.getElementById('calendar-body').innerHTML = `
      <div class="cal-header">
        <div>
          <h1>My attendance</h1>
          <p class="sub">${monthName}</p>
        </div>
        <div class="cal-nav">
          <button onclick="shiftCalendarMonth(-1)">‹</button>
          <button onclick="shiftCalendarMonth(1)">›</button>
        </div>
      </div>
      <div class="cal-summary">
        <div class="stat-card"><p class="label">Present</p><p class="value" style="color:var(--primary-dark)">${present}</p></div>
        <div class="stat-card"><p class="label">Absent</p><p class="value" style="color:#d9534f">${absent}</p></div>
        <div class="stat-card"><p class="label">Attendance rate</p><p class="value">${rate}%</p></div>
      </div>
      <div class="cal-weekdays">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div class="cal-grid">${cellsHtml}</div>
      <div id="cal-day-detail"></div>
      <div class="cal-legend">
        <span><i class="dot present"></i>Present</span>
        <span><i class="dot absent"></i>Absent</span>
        <span><i class="dot today"></i>Today</span>
        <span><i class="dot noschool"></i>No school</span>
      </div>
    `;
  }

  function showAttendanceDayDetail(dateStr){
    const [y, m] = dateStr.split('-').map(Number);
    const records = getMonthAttendanceRecords(y, m - 1);
    const record = records[dateStr];
    const dateObj = new Date(dateStr + 'T00:00:00');
    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
    const niceDate = dateObj.toLocaleDateString([], {weekday:'long', day:'numeric', month:'long', year:'numeric'});

    let message;
    if(record){
      const time = new Date(record.markedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      message = record.status === 'present'
        ? `✓ Marked present at ${time}`
        : `Marked absent / on leave, at ${time}`;
    } else if(isWeekend){
      message = 'No school on this day';
    } else {
      message = 'Not marked yet';
    }

    document.getElementById('cal-day-detail').innerHTML =
      `<div class="cal-day-detail-box"><strong>${niceDate}</strong><br>${message}</div>`;
  }

  function shiftCalendarMonth(delta){
    calendarMonth += delta;
    if(calendarMonth > 11){ calendarMonth = 0; calendarYear++; }
    if(calendarMonth < 0){ calendarMonth = 11; calendarYear--; }
    renderAttendanceCalendar(calendarYear, calendarMonth);
  }

  let gateTimerId = null;

  function scheduleAttendanceGate(){
    if(gateTimerId) clearTimeout(gateTimerId);
    const msUntilGate = getGateTimeToday() - new Date();
    if(msUntilGate <= 0) return; // already past 12:30 — handled at entry instead
    gateTimerId = setTimeout(function(){
      if(!getTodayAttendanceRecord()){
        document.getElementById('view-dashboard').classList.add('hidden');
        document.getElementById('view-attendance').classList.remove('hidden');
      }
    }, msUntilGate);
  }

  function updateAttendanceBannerPending(){
    const bannerEl = document.querySelector('.banner-success');
    const bannerTextEl = document.querySelector('.banner-success span:first-child');
    const timeEl = document.getElementById('attend-time');
    if(bannerEl) bannerEl.classList.add('pending');
    if(bannerTextEl) bannerTextEl.textContent = '🕐 Attendance opens at 12:30 PM — you can use the dashboard until then';
    if(timeEl) timeEl.textContent = '';
  }

  // ---------------------------------------------------------
  // Plain placeholder values for the filter bar — deliberately NOT
  // wired to the database for now. Wiring this to real per-teacher
  // data (backend/get_my_class.php) needs a real teacher-to-class
  // link in the `classes` table first, which doesn't exist yet in
  // this environment. Revisit once that data gap is closed.
  // ---------------------------------------------------------
  const myClassInfo = {
    school_name: 'Triveni Sangam Municipal School',
    class_name: 'Jr KG'
  };

  function enterTeacherFlow(){
    const existing = getTodayAttendanceRecord();
    if(existing){
      showDashboardAfterAttendance(existing);
      renderSidebar();
      switchSidebarSection('myday');
      return;
    }
    if(isPastGateTime()){
      document.getElementById('view-attendance').classList.remove('hidden');
    } else {
      document.getElementById('view-dashboard').classList.remove('hidden');
      updateAttendanceBannerPending();
      renderSidebar();
      switchSidebarSection('myday');
      scheduleAttendanceGate();
    }
  }

  function markAttendance(status){
    const record = {
      teacherId: 'mrs-sharma', // placeholder until real login/auth exists
      date: todayDateKey(),
      status: status,
      markedAt: new Date().toISOString()
    };
    saveTeacherAttendanceRecord(record);
    showDashboardAfterAttendance(record);
  }

  function showDashboardAfterAttendance(record){
    document.getElementById('view-attendance').classList.add('hidden');
    document.getElementById('view-dashboard').classList.remove('hidden');

    const markedTime = new Date(record.markedAt);
    document.getElementById('attend-time').textContent =
      markedTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

    const bannerEl = document.querySelector('.banner-success');
    const bannerTextEl = document.querySelector('.banner-success span:first-child');
    if(bannerEl) bannerEl.classList.remove('pending');
    if(bannerTextEl){
      bannerTextEl.textContent = record.status === 'present'
        ? '✓ Attendance marked for today — Present'
        : '✓ Attendance marked for today — Absent';
    }

    renderSidebar();
    switchSidebarSection('myday');
  }

// Wrapping the real login() logic in a form submit handler — rather
// than a bare button onclick — is what lets the browser's own
// password manager recognize this as a genuine login and offer to
// save the credentials, then auto-fill them on future visits. The
// preventDefault stops an actual page reload; login() still runs via
// fetch() exactly as before.
  
/* ===================== SECTION 4: SIDEBAR & TOPBAR CHROME ===================== */

  function toggleSidebar(){
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarBackdrop').classList.toggle('show');
  }

  function closeSidebar(){
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarBackdrop').classList.remove('show');
  }

  // Real browser Fullscreen API — this is the actual production app,
  // not a preview widget, so requestFullscreen() works normally here.
  function toggleCardFullscreen(cardId){
    const card = document.getElementById(cardId);
    if(!card) return;
    if(!document.fullscreenElement){
      card.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  // Keeps every fullscreen button's icon/label correct, whichever
  // card is currently expanded (or none), including when a child
  // exits via the Escape key rather than tapping the button again.
  document.addEventListener('fullscreenchange', () => {
    document.querySelectorAll('.stage-card').forEach(card => {
      const btn = card.querySelector('.fullscreen-btn');
      if(!btn) return;
      const isThisCardFullscreen = document.fullscreenElement === card;
      btn.textContent = isThisCardFullscreen ? '⤢' : '⛶';
      btn.title = isThisCardFullscreen ? 'Exit full screen' : 'View full screen';
    });
  });

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

  const attendanceRecords = {}; // key: date -> {studentName: 'present'|'absent'}
  let attendanceSaved = false;
  let attendanceSearchTerm = '';

  function todayKey(){ return new Date().toISOString().slice(0,10); }

  function switchSidebarSection(section){
    document.getElementById('navMyDay').classList.toggle('active', section === 'myday');
    document.getElementById('navDailyPlan').classList.toggle('active', section === 'dailyplan');
    document.getElementById('navPtm').classList.toggle('active', section === 'ptm');
    document.getElementById('navMyClass').classList.toggle('active', section === 'myclass');
    document.getElementById('navClassProgress').classList.toggle('active', section === 'classprogress');
    document.getElementById('navAttendanceRegister').classList.toggle('active', section === 'attendanceregister');
    document.getElementById('navMyCompliance').classList.toggle('active', section === 'mycompliance');
    document.getElementById('navTeacherProfile').classList.toggle('active', section === 'teacherprofile');
    document.getElementById('navFamilyParents').classList.toggle('active', section === 'familyparents');
    document.getElementById('navCheckAttendance').classList.toggle('active', section === 'checkattendance');
    document.getElementById('navAdmissions').classList.toggle('active', section === 'admissions');
    document.getElementById('navMonthlyEffective').classList.toggle('active', section === 'monthlyeffective');
    document.getElementById('navMonthlyAssessment').classList.toggle('active', section === 'monthlyassessment');
    document.getElementById('navChildRecord').classList.toggle('active', section === 'childrecord');
    document.getElementById('navTransition').classList.toggle('active', section === 'transition');
    document.getElementById('navAttendance').classList.toggle('active', section === 'attendance');
    document.getElementById('navCalendar').classList.toggle('active', section === 'calendar');
    document.getElementById('navMaterials').classList.toggle('active', section === 'materials');
    document.getElementById('navVolunteers').classList.toggle('active', section === 'volunteers');
    document.getElementById('sidebar-workbook-section').classList.toggle('hidden', section !== 'workbook');

    const labelEl = document.getElementById('pageLabel');
    if(labelEl){
      labelEl.textContent = section === 'myday' ? 'My Day'
        : section === 'dailyplan' ? 'Daily Plan'
        : section === 'ptm' ? 'PTM Schedule & Agenda'
        : section === 'myclass' ? 'My Class'
        : section === 'classprogress' ? 'Class Progress'
        : section === 'attendanceregister' ? 'Attendance Register'
        : section === 'mycompliance' ? 'My Compliance'
        : section === 'teacherprofile' ? 'Teacher Profile'
        : section === 'familyparents' ? 'Family & Parents'
        : section === 'checkattendance' ? 'Check Attendance'
        : section === 'admissions' ? 'Admissions'
        : section === 'monthlyeffective' ? 'Monthly Effective'
        : section === 'monthlyassessment' ? 'Monthly Assessment'
        : section === 'childrecord' ? 'Child Record'
        : section === 'transition' ? 'Transition'
        : section === 'attendance' ? 'Attendance'
        : section === 'calendar' ? 'My Attendance'
        : section === 'materials' ? 'Materials'
        : section === 'volunteers' ? 'Parent Volunteers'
        : 'My Day';
    }

    document.getElementById('week-body').classList.add('hidden');
    document.getElementById('attendance-body').classList.add('hidden');
    document.getElementById('calendar-body').classList.add('hidden');
    document.getElementById('myday-body').classList.add('hidden');
    document.getElementById('dailyplan-body').classList.add('hidden');
    document.getElementById('ptm-body').classList.add('hidden');
    document.getElementById('myclass-body').classList.add('hidden');
    document.getElementById('classprogress-body').classList.add('hidden');
    document.getElementById('attendanceregister-body').classList.add('hidden');
    document.getElementById('mycompliance-body').classList.add('hidden');
    document.getElementById('teacherprofile-body').classList.add('hidden');
    document.getElementById('familyparents-body').classList.add('hidden');
    document.getElementById('checkattendance-body').classList.add('hidden');
    document.getElementById('admissions-body').classList.add('hidden');
    document.getElementById('monthlyeffective-body').classList.add('hidden');
    document.getElementById('monthlyassessment-body').classList.add('hidden');
    document.getElementById('childrecord-body').classList.add('hidden');
    document.getElementById('transition-body').classList.add('hidden');
    document.getElementById('materials-body').classList.add('hidden');
    document.getElementById('volunteers-body').classList.add('hidden');
    document.getElementById('today-overview').classList.add('hidden');
    document.querySelector('.stat-grid').classList.add('hidden');
    document.querySelector('.banner-success').classList.add('hidden');

    if(section === 'attendance'){
      document.getElementById('attendance-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent =
        'Attendance · ' + new Date().toLocaleDateString([], {weekday:'long', day:'numeric', month:'short', year:'numeric'});
      renderAttendanceBody();
    } else if(section === 'calendar'){
      document.getElementById('calendar-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'My Attendance';
      renderAttendanceCalendar(calendarYear, calendarMonth);
    } else if(section === 'dailyplan'){
      document.getElementById('dailyplan-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Plan today\'s sessions — start from a suggestion or write your own';
      renderDailyPlan();
    } else if(section === 'myday'){
      document.getElementById('myday-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Today\'s sessions, attendance, and materials at a glance';
      renderMyDay();
    } else if(section === 'ptm'){
      document.getElementById('ptm-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'When is the meeting, what is on the agenda, and am I ready for it?';
      renderTeacherPTM();
    } else if(section === 'myclass'){
      document.getElementById('myclass-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Every child in your class, at a glance';
      renderMyClass();
    } else if(section === 'classprogress'){
      document.getElementById('classprogress-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'How the class is doing, domain by domain';
      renderClassProgress();
    } else if(section === 'attendanceregister'){
      document.getElementById('attendanceregister-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'The last 10 school days, one row per child';
      renderAttendanceRegister();
    } else if(section === 'mycompliance'){
      document.getElementById('mycompliance-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Your own SOP compliance, rolled up';
      renderMyCompliance();
    } else if(section === 'teacherprofile'){
      document.getElementById('teacherprofile-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Your qualifications, contact details, and training record';
      renderTeacherProfile();
    } else if(section === 'familyparents'){
      document.getElementById('familyparents-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Who to call for each child';
      renderFamilyParents();
    } else if(section === 'checkattendance'){
      document.getElementById('checkattendance-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'A read-only review of what has been marked';
      renderCheckAttendance();
    } else if(section === 'admissions'){
      document.getElementById('admissions-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Children admitted mid-year, and their entitlement status';
      renderAdmissions();
    } else if(section === 'monthlyeffective'){
      document.getElementById('monthlyeffective-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'The monthly return: what it says, and have you signed it?';
      renderMonthlyEffective();
    } else if(section === 'monthlyassessment'){
      document.getElementById('monthlyassessment-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Rate every child on every domain, once a month';
      renderMonthlyAssessment();
    } else if(section === 'childrecord'){
      document.getElementById('childrecord-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'One child\'s full picture in one place';
      renderChildRecord();
    } else if(section === 'transition'){
      document.getElementById('transition-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Readiness for the move to the next grade';
      renderTransition();
    } else if(section === 'materials'){
      document.getElementById('materials-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Items received from BMC, and whether they\'ve reached your class';
      renderMaterials();
    } else if(section === 'volunteers'){
      document.getElementById('volunteers-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Parents interested in helping out as co-educators in your class';
      renderParentVolunteers();
    } else {
      document.getElementById('week-body').classList.remove('hidden');
      document.getElementById('today-overview').classList.remove('hidden');
      document.querySelector('.stat-grid').classList.remove('hidden');
      document.querySelector('.banner-success').classList.remove('hidden');
      openWeek(currentWeekNum);
    }
    closeSidebar();
  }

  // EVENT_TYPE_COLORS now lives in js/events-calendar.js, shared with
  // the supervisor and superadmin pages so all three stay visually
  // identical rather than three separate implementations drifting apart.

  /* ===================== SECTION 5: SCHOOL EVENTS ===================== */

  function renderSchoolEvents(){
    initEventsCalendar('events-body', 'backend/get_events.php' + window.location.search);
  }

  /* ===================== SECTION 5b: PTM SCHEDULE & AGENDA ===================== */
  // Uses backend/get_my_class.php for a REAL school_id/class_id — unlike
  // the My Day filter bar (deliberately left as placeholder text, see
  // that section's comment), the PTM view genuinely needs to know which
  // school/class it's asking about, since the data actually lives in
  // the database now (ptm_meetings etc.). Falls back to a clear message
  // rather than guessing if the teacher isn't linked to a class yet.
  async function renderTeacherPTM(){
    const container = document.getElementById('ptm-body');
    container.innerHTML = '<p class="sub">Loading…</p>';
    try{
      const res = await fetch('backend/get_my_class.php' + window.location.search);
      const data = await res.json();
      if(data.status !== 'success' || !data.classes || !data.classes.length){
        container.innerHTML = '<p class="sub">Your account isn\'t linked to a class yet — ask your admin to link it.</p>';
        return;
      }
      const myClass = data.classes[0]; // multi-class teachers: first one, same simplification used elsewhere
      renderPTMView('ptm-body', {
        schoolId: myClass.school_id,
        classId: myClass.class_id,
        role: 'teacher',
        canSchedule: false,
        canToggleTeacherPrep: true,
        canToggleSupervisorPrep: false,
        querySuffix: window.location.search
      });
    } catch(err){
      container.innerHTML = '<p class="sub">Could not reach the server.</p>';
    }
  }

  /* ===================== SECTION 6: ACTIVITY PHOTO UPLOAD ===================== */
  // Lives directly on each Weekly Activities session card now — no more
  // separate "Upload Activity Photo" sidebar page. Selecting a file
  // uploads immediately (no separate submit step), tagged with exactly
  // which domain/day/week it belongs to, so a photo is always tied to
  // a specific session rather than just "today, some activity."

  async function uploadSessionActivityPhoto(domainKey, dayKey, inputEl){
    const statusEl = document.getElementById('sessionPhotoStatus-' + domainKey + '-' + dayKey);
    if(!inputEl.files.length) return;

    const d = DOMAINS.find(x => x.key === domainKey);
    const formData = new FormData();
    formData.append('photo', inputEl.files[0]);
    formData.append('week', currentWeekNum);
    formData.append('day', dayKey);
    formData.append('domain', domainKey);
    formData.append('note', d ? d.label : domainKey);

    if(statusEl) statusEl.textContent = 'Uploading…';

    try{
      const res = await fetch('backend/upload_activity_photo.php' + window.location.search, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(statusEl){
        statusEl.textContent = data.status === 'success' ? '✓ Uploaded' : (data.message || 'Upload failed');
        statusEl.style.color = data.status === 'success' ? 'var(--good, #0ca30c)' : 'var(--danger, #c8433f)';
      }
    } catch(err){
      if(statusEl){
        statusEl.textContent = 'Could not reach the server.';
        statusEl.style.color = 'var(--danger, #c8433f)';
      }
    }
    inputEl.value = ''; // allow uploading another photo to the same session afterward
  }

  // ===== Materials — localStorage for now, not the database. Same
  // reasoning as My Attendance and the textbook-progress bookmark:
  // personal to this browser for now, easy to move to the real
  // backend later (the SQL table and 3 PHP endpoints from earlier
  // are still sitting there, untouched, ready to wire back up
  // whenever that's actually wanted). =====

  /* ===================== SECTION 7: MATERIALS ===================== */

  // Fetches the real materials list from the database. Previously this
  // read from localStorage instead — meaning "+ Add material" and the
  // CSV import were both writing real rows to the real materials
  // table, while this function kept reading a completely separate,
  // never-synced local copy. Fixed to actually match.
  async function getMaterialsList(){
    try{
      const res = await fetch('backend/get_materials.php' + window.location.search);
      const data = await res.json();
      return (data.status === 'success' && data.materials) ? data.materials : [];
    } catch(err){
      return [];
    }
  }

  function materialRowHtml(m){
    return `
      <div class="material-row" data-material-id="${m.id}">
        <div>
          <div class="material-name">${m.item_name}</div>
          <div class="material-meta">${m.quantity ? 'Qty ' + m.quantity + ' · ' : ''}received ${new Date(m.received_date + 'T00:00:00').toLocaleDateString([], {day:'numeric', month:'short'})}</div>
        </div>
        <button class="material-toggle-btn ${m.distributed ? 'is-distributed' : ''}" onclick="toggleMaterialDistributed('${m.id}')">
          ${m.distributed ? 'Distributed' : 'Mark distributed'}
        </button>
      </div>`;
  }

  // Sample categorized breakdown — TLM/Stationery/Workbooks, matching
  // the specific fields requested for the demo. Deliberately separate
  // from the real materials list below (add_materials.php etc.) —
  // that flow is genuinely backend-driven already; this is a
  // frontend-only sample summary sitting alongside it.
  function sampleMaterialsBreakdown(){
    return {
      tlmPresentQty: 42,
      stationery: [
        { item: 'Chair', qty: 28 },
        { item: 'Duster', qty: 5 },
        { item: 'Register', qty: 3 },
        { item: 'Cleaning supplies', qty: 12 }
      ],
      workbookSets: 27
    };
  }

  async function renderMaterials(){
    const container = document.getElementById('materials-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderMaterials);
    const b = sampleMaterialsBreakdown();

    const breakdownWrap = document.createElement('div');
    breakdownWrap.appendChild(mdSec('Materials breakdown', '<span class="reqs">INV-01…08 · sample data</span>'));
    breakdownWrap.appendChild(mdGrid('g3', [
      mdTile('TLM present', b.tlmPresentQty, 'quantity', mdPill('In stock', 'good'), 'INV-01'),
      mdTile('Workbooks', b.workbookSets, 'sets', mdPill('In stock', 'good'), 'INV-03'),
      mdTile('Stationery & supplies', b.stationery.length, 'item types', mdPill('See breakdown', 'info'), 'INV-02')
    ]));
    const stationeryList = document.createElement('div'); stationeryList.className = 'list';
    stationeryList.innerHTML = b.stationery.map(s => `<div class="row"><div class="t"><b>${esc(s.item)}</b></div><div>${s.qty}</div></div>`).join('');
    breakdownWrap.appendChild(mdCard('Stationery & supplies — quantity', null, stationeryList));
    container.appendChild(breakdownWrap);

    const materials = await getMaterialsList();
    materials.sort((a, b) => b.received_date.localeCompare(a.received_date));
    const distributedCount = materials.filter(m => m.distributed).length;
    const rows = materials.map(materialRowHtml).join('');

    const realWrap = document.createElement('div');
    realWrap.innerHTML = `
      <div class="visit-banner" style="margin-bottom:16px;">
        <div><strong>Materials received from BMC</strong><br/>${materials.length ? distributedCount + ' of ' + materials.length + ' items distributed' : 'Nothing logged yet'}</div>
        <button class="btn-primary" style="width:auto; padding:9px 16px;" onclick="toggleAddMaterialForm()">+ Add material</button>
      </div>
      <div id="addMaterialFormWrap" class="hidden"></div>
      <div id="materialsList">${rows || '<p class="sub">No materials logged yet — tap "+ Add material" once something arrives.</p>'}</div>
    `;
    container.appendChild(realWrap);

    container.appendChild(renderMaterialsImportCard());
  }

  // ---------------------------------------------------------
  // IMPORT MATERIALS FROM CSV — bulk version of "+ Add material".
  // CSV must have exactly this header: item_name,quantity,received_date
  // (received_date as YYYY-MM-DD). Real backend (import_materials_csv.php),
  // writes into the same real materials table as the single-item form.
  // ---------------------------------------------------------
  function renderMaterialsImportCard(){
    const wrap = document.createElement('div');
    wrap.className = 'card';
    wrap.style.marginTop = '16px';
    wrap.innerHTML = `
      <div class="hd"><div><h3>Import materials from CSV</h3><p class="cap">Header row must be exactly: item_name,quantity,received_date (date as YYYY-MM-DD).</p></div></div>
      <input type="file" id="materialsCsvInput" accept=".csv" style="margin-top:8px;" />
      <div id="materialsImportResult" style="margin-top:10px;"></div>
      <button class="btn-primary" style="width:auto; padding:9px 16px; margin-top:10px;" onclick="importMaterialsCsv()">Import</button>
    `;
    return wrap;
  }

  async function importMaterialsCsv(){
    const input = document.getElementById('materialsCsvInput');
    const resultEl = document.getElementById('materialsImportResult');
    if(!input.files.length){
      resultEl.innerHTML = '<div class="au-error">Choose a CSV file first.</div>';
      return;
    }
    resultEl.innerHTML = '<p class="sub">Importing…</p>';

    const formData = new FormData();
    formData.append('csv_file', input.files[0]);

    try{
      const res = await fetch('backend/import_materials_csv.php' + window.location.search, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if(data.status !== 'success'){
        resultEl.innerHTML = `<div class="au-error">${esc(data.message || 'Import failed.')}</div>`;
        return;
      }
      let html = `<div class="au-success">✓ Imported ${data.imported} item${data.imported === 1 ? '' : 's'}.</div>`;
      if(data.skipped_count > 0){
        html += `<div class="au-error" style="margin-top:6px;">${data.skipped_count} row(s) skipped:<ul style="margin:4px 0 0 18px;">${data.skipped.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>`;
      }
      resultEl.innerHTML = html;
      renderMaterials(); // reload the real list with the newly imported rows
    } catch(err){
      resultEl.innerHTML = '<div class="au-error">Could not reach the server.</div>';
    }
  }

  /* =========================================================
     PARENT VOLUNTEERS — this teacher's class context is fixed here
     for now (matches "Mrs. Sharma — Jr KG B" above) — in a real
     backend this would come from the logged-in teacher's own class
     assignment instead of being hardcoded. Reads/writes the same
     shared storage the parent dashboard uses (parent-committee.js),
     so a parent's real submission shows up here without a page
     reload needed on the parent's side.
     ========================================================= */
  const CURRENT_TEACHER_CLASS = {
    school: 'Triveni Sangam Municipal School',
    className: 'Jr KG'
  };
  const COMMITTEE_SOFT_CAP = 2;

  /* ===================== SECTION 8: PARENT VOLUNTEERS / COMMITTEE ===================== */

  function renderParentVolunteers(){
    const container = document.getElementById('volunteers-body');
    const all = loadParentCommitteeApplications().filter(a =>
      a.school === CURRENT_TEACHER_CLASS.school && a.className === CURRENT_TEACHER_CLASS.className
    );
    const committee = all.filter(a => a.status === 'selected');
    const applicants = all.filter(a => a.status !== 'selected');

    const scoredApplicants = applicants.map(a => ({
      app: a,
      result: calculateSuitabilityScore(a, committee)
    })).sort((x, y) => y.result.total - x.result.total);

    const committeeRows = committee.map(a => `
      <div class="material-row">
        <div>
          <strong>${a.parentName}</strong> — ${a.childName}
          <div class="sub" style="margin-top:2px;">${a.occupation || 'No occupation given'} · Available ${(a.availableDays||[]).join(', ') || 'not specified'}</div>
        </div>
        <span class="visit-pill yes">On committee</span>
      </div>`).join('');

    const applicantRows = scoredApplicants.map(({app, result}) => `
      <div class="material-row" style="align-items:flex-start;">
        <div style="flex:1;">
          <strong>${app.parentName}</strong>
          <span class="cg-tag" style="margin-left:6px;">${result.total.toFixed(1)}</span>
          — ${app.childName}
          <div class="sub" style="margin-top:2px;">${app.occupation || 'No occupation given'} · Available ${(app.availableDays||[]).join(', ') || 'not specified'}</div>
          <button style="font-size:12px; background:none; border:none; color:var(--text-muted); text-decoration:underline; padding:4px 0; cursor:pointer;" onclick="toggleScoreBreakdown('${app.id}')">See score breakdown</button>
          <div id="score-breakdown-${app.id}" class="hidden" style="font-size:12px; color:var(--text-muted); margin-top:4px; padding:8px 10px; background:var(--bg); border-radius:8px;">
            Education ${result.breakdown.education.score}/${result.breakdown.education.max} ·
            Demonstrated activity ${result.breakdown.activity.score}/${result.breakdown.activity.max} ·
            Fills a gap ${result.breakdown.availability.score}/${result.breakdown.availability.max} ·
            Occupation match ${result.breakdown.occupation.score}/${result.breakdown.occupation.max}
          </div>
        </div>
        <button class="btn-primary" style="width:auto; padding:7px 14px; font-size:13px;" onclick="addToParentsCommittee('${app.id}')">Add to committee</button>
      </div>`).join('');

    container.innerHTML = `
      <div class="visit-banner" style="margin-bottom:16px;">
        <div><strong>Parents Committee</strong><br/>${committee.length} of ${COMMITTEE_SOFT_CAP} slots filled</div>
      </div>
      <div id="committeeList">${committeeRows || '<p class="sub">No one selected yet for this class.</p>'}</div>

      <h3 class="report-h3" style="margin-top:24px;">Applicants</h3>
      <div id="applicantsList">${applicantRows || '<p class="sub">No applications for this class yet.</p>'}</div>
    `;
  }

  function toggleScoreBreakdown(appId){
    const el = document.getElementById('score-breakdown-' + appId);
    if(el) el.classList.toggle('hidden');
  }

  function addToParentsCommittee(appId){
    const all = loadParentCommitteeApplications().filter(a =>
      a.school === CURRENT_TEACHER_CLASS.school && a.className === CURRENT_TEACHER_CLASS.className
    );
    const currentCommitteeSize = all.filter(a => a.status === 'selected').length;

    if(currentCommitteeSize >= COMMITTEE_SOFT_CAP){
      const proceed = confirm(
        `This class already has ${currentCommitteeSize} parents on the committee. Add another anyway?`
      );
      if(!proceed) return;
    }

    updateParentCommitteeApplicationStatus(appId, 'selected');
    renderParentVolunteers();
  }

  /* =========================================================
     MY DAY — rebuilt against the extracted prototype design system
     (tile/pill/meter/sec/card classes, now merged into style.css).
     Uses the REAL DOMAINS array above (real times, real CG codes,
     real week/theme data) — only the delivery-tracking numbers
     (sessions confirmed, week compliance, attendance) are realistic
     PLACEHOLDER values for now, per the agreed "frontend first,
     database after" plan. Nothing here reads from a real backend yet.

     ADAPTED FROM THE ORIGINAL PROTOTYPE: the original used hover-only
     tooltips for session detail, which don't work on phones/tablets.
     Replaced with tap-to-expand panels instead.
     ========================================================= */
  /* ===================== SECTION 9: MY DAY ===================== */

  function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function f1(n){ return (Math.round(n * 10) / 10).toFixed(1); }

  function mdGrid(cls, items){ const g = document.createElement('div'); g.className = 'g ' + cls; items.forEach(i => i && g.appendChild(i)); return g; }

  function mdTile(k, v, unit, extra, formula, mtr){
    const t = document.createElement('div'); t.className = 'tile';
    t.innerHTML = `<div class="k">${esc(k)}</div><div class="v">${v}${unit ? `<small> ${esc(unit)}</small>` : ''}</div>`;
    if(extra){ const d = document.createElement('div'); d.className = 'd'; d.innerHTML = extra; t.appendChild(d); }
    if(mtr) t.appendChild(mtr);
    if(formula){ const f = document.createElement('div'); f.className = 'f'; f.textContent = formula; t.appendChild(f); }
    return t;
  }

  function mdPill(l, c){ return `<span class="pill ${c}">${esc(l)}</span>`; }

  function mdMeter(pct, cls){
    const m = document.createElement('div'); m.className = 'meter' + (cls ? ' ' + cls : '');
    const i = document.createElement('i'); i.style.width = Math.max(0, Math.min(100, pct)) + '%'; m.appendChild(i);
    return m;
  }

  function mdSec(title, right){
    const s = document.createElement('div'); s.className = 'sec';
    s.innerHTML = `<h2>${esc(title)}</h2><div class="hr"></div>${right || ''}`;
    return s;
  }

  function mdCard(title, cap, bodyEl){
    const c = document.createElement('div'); c.className = 'card';
    if(title){
      c.innerHTML = `<div class="hd"><div><h3>${esc(title)}</h3>${cap ? `<p class="cap">${cap}</p>` : ''}</div></div>`;
    }
    if(bodyEl) c.appendChild(bodyEl);
    return c;
  }

  function mdStatusBand(pct, good, warn){
    if(pct >= (good || 85)) return {l:'On track', c:'good'};
    if(pct >= (warn || 70)) return {l:'Watch', c:'warn'};
    return {l:'Action', c:'crit'};
  }

  // A representative material per domain, matching the "chip under each
  // session card" pattern in the reference design.
  const MYDAY_DOMAIN_MATERIAL = {
    welcome:'Greeting song cards', story:'Story picture book', numeracy:'Counting beads, number cards',
    language:'Phonics flash cards', create:'Clay, crayons, paper', outdoor:'Hoops, bean bags',
    tidy:'Labelled storage trays', reflect:'Feelings faces chart'
  };
  const MYDAY_PLACEHOLDER_MATERIALS = [
    {item:'Crayon boxes', issued:10, uses:14, state:'ok'},
    {item:'Worksheet paper', issued:200, uses:88, state:'low'},
    {item:'Story picture cards', issued:1, uses:22, state:'ok'},
    {item:'Bead threading kits', issued:15, uses:6, state:'ok'},
    {item:'Clay for modelling', issued:5, uses:2, state:'damaged'}
  ];
  let myDayIndex = 0; // 0=mon ... matches DAYS[] order

  // ---- Shared with Daily Plan: these read the SAME dailyPlanEntries data
  // Daily Plan writes to, so My Day's stats genuinely reflect whatever the
  // teacher has actually planned — not a separate, disconnected number. ----
  function countPlannedSessionsForDay(weekNum, dayKey){
    return DOMAINS.filter(d => {
      const key = dailyPlanKey(weekNum, dayKey, d.key);
      return dailyPlanEntries[key] && dailyPlanEntries[key].text.trim();
    }).length;
  }

  function countCustomSessionsForDay(weekNum, dayKey){
    return DOMAINS.filter(d => {
      const key = dailyPlanKey(weekNum, dayKey, d.key);
      return dailyPlanEntries[key] && dailyPlanEntries[key].text.trim() && !dailyPlanEntries[key].usedSuggestion;
    }).length;
  }

  function computeWeekCompliancePct(weekNum){
    const dayKeysArr = ['mon','tue','wed','thu','fri'];
    let totalPlanned = 0;
    dayKeysArr.forEach(dk => { totalPlanned += countPlannedSessionsForDay(weekNum, dk); });
    return (totalPlanned / (dayKeysArr.length * DOMAINS.length)) * 100;
  }

  function aggregateMaterialsForWeek(weekNum){
    const dayKeysArr = ['mon','tue','wed','thu','fri'];
    const seen = new Set();
    const list = [];
    dayKeysArr.forEach(dk => {
      DOMAINS.forEach(d => {
        const key = dailyPlanKey(weekNum, dk, d.key);
        const entry = dailyPlanEntries[key];
        if(entry && entry.materials){
          entry.materials.forEach(m => { if(!seen.has(m)){ seen.add(m); list.push(m); } });
        }
      });
    });
    return list;
  }

  // ---------------------------------------------------------
  // SHARED FILTER BAR — School/Division/Academic Year/Week, the same
  // chrome the real prototype shows at the top of every teacher screen.
  // Previously this only existed inside renderMyDay() — an oversight,
  // not a deliberate choice, since every other screen built afterward
  // never got it. Now every screen calls this the same way.
  //
  // School/Division/Academic Year are read-only (a real teacher only
  // ever has the one they're assigned to); Week is real and functional
  // — changing it re-renders whichever screen is currently open via
  // onWeekChange, so switching weeks works consistently everywhere,
  // not just on My Day/Daily Plan.
  // ---------------------------------------------------------
  const SELECT_STYLE = "padding:6px 28px 6px 10px !important; border:1px solid #0b0b0b33 !important; border-radius:6px !important; background-color:#fff !important; background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22 viewBox=%220 0 10 6%22><path d=%22M1 1l4 4 4-4%22 stroke=%22%2352514e%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>') !important; background-repeat:no-repeat !important; background-position:right 10px center !important; background-size:10px 6px !important; -webkit-appearance:none !important; -moz-appearance:none !important; appearance:none !important; cursor:pointer !important; font-size:13px !important; color:#0b0b0b !important; display:inline-block !important;";

  // The real 23 BMC schools this programme serves, pulled straight from
  // the prototype's own SCHOOLS list — used ONLY to populate this
  // dropdown for show. Selecting a different one does not change any
  // data on screen: a real teacher only ever has the one school she's
  // actually assigned to (myClassInfo.school_name), same as before.
  const ALL_SCHOOLS = [
    'Triveni Sangam Municipal School', 'South Sewri MPS', 'Shastri Nagar MPS', 'Khernagar MPS',
    'Juhu Gandhigram MPS', 'Jogeshwari MPS', 'Andheri MPS',
    'Nehru Nagar MPS (L)', 'Mohili Village MPS', 'Kajupada MPS', 'S.G Barve Marg MPS', 'Chunabhatti MPS',
    'Vikhroli Park Site MPS', 'Maneklal Mehta Municipal School', 'Barve Nagar Municipal School No 3', 'Sainath nagar MPS', 'Rajawadi MPS',
    'Bhandup Tank Road', 'Nehru Nagar MPS (S)',
    'Goshala MPS', 'D D Upadhyay MPS', 'P.K.Road MPS', 'Mithagar MPS'
  ];

  // Same treatment as ALL_SCHOOLS above — Division and Academic Year
  // now list every real option too, cosmetic only (no onchange, no
  // re-render). Week is different on purpose: it's genuinely
  // functional (curriculum content actually varies by week), so it
  // keeps its onWeekChange wiring — just broadened to list every week
  // 1–14, not only the ones with authored content yet. Picking an
  // unauthored week already falls back gracefully everywhere ("Not
  // planned yet" per session) since that fallback was built in from
  // the start — nothing new needed there.
  const DIVS = ['Jr KG', 'Sr KG'];
  const ACADEMIC_YEARS = ['Term 1, 2026', 'Term 2, 2026'];

  function renderTeacherFilterBar(container, onWeekChange){
    const filterBar = document.createElement('div'); filterBar.className = 'fbar';
    filterBar.innerHTML = `
      <div class="ctl"><label>School</label><select id="filterBarSchoolSelect" style="${SELECT_STYLE} min-width:220px !important;"></select></div>
      <div class="ctl"><label>Division</label><select id="filterBarDivisionSelect" style="${SELECT_STYLE} min-width:100px !important;"></select></div>
      <div class="ctl"><label>Academic Year</label><select id="filterBarYearSelect" style="${SELECT_STYLE} min-width:140px !important;"></select></div>
      <div class="ctl"><label>Week</label><select id="filterBarWeekSelect" style="${SELECT_STYLE} min-width:220px !important;"></select></div>
    `;
    container.appendChild(filterBar);

    const schoolSel = filterBar.querySelector('#filterBarSchoolSelect');
    ALL_SCHOOLS.forEach(name => {
      const opt = document.createElement('option'); opt.textContent = name;
      if(name === myClassInfo.school_name) opt.selected = true;
      schoolSel.appendChild(opt);
    });
    // Deliberately no onchange handler — cosmetic only, per the comment
    // on ALL_SCHOOLS above. The selection stays wherever you leave it;
    // it never triggers a re-render or changes any data on screen.

    const divisionSel = filterBar.querySelector('#filterBarDivisionSelect');
    DIVS.forEach(name => {
      const opt = document.createElement('option'); opt.textContent = name;
      if(name === myClassInfo.class_name) opt.selected = true;
      divisionSel.appendChild(opt);
    });
    // Cosmetic only, same reasoning as School.

    const yearSel = filterBar.querySelector('#filterBarYearSelect');
    ACADEMIC_YEARS.forEach(name => {
      const opt = document.createElement('option'); opt.textContent = name;
      if(name === ACADEMIC_YEARS[0]) opt.selected = true;
      yearSel.appendChild(opt);
    });
    // Cosmetic only, same reasoning as School.

    const weekSel = filterBar.querySelector('#filterBarWeekSelect');
    WEEKS.forEach(wk => {
      const opt = document.createElement('option');
      opt.value = wk.w; opt.textContent = 'Week ' + wk.w + ' — ' + wk.theme;
      if(wk.w === currentWeekNum) opt.selected = true;
      weekSel.appendChild(opt);
    });
    weekSel.onchange = () => { currentWeekNum = parseInt(weekSel.value, 10); onWeekChange(); };
    return filterBar;
  }

  function renderMyDay(){
    const container = document.getElementById('myday-body');
    container.innerHTML = '';

    const dayKeysArr = ['mon','tue','wed','thu','fri'];
    const dayLabels = ['Mon','Tue','Wed','Thu','Fri'];
    const currentDayKey = dayKeysArr[myDayIndex];
    const done = countPlannedSessionsForDay(currentWeekNum, currentDayKey);
    const weekPct = computeWeekCompliancePct(currentWeekNum);
    const customCount = countCustomSessionsForDay(currentWeekNum, currentDayKey);
    const classPresent = 26, classTotal = 28;
    const myAttendancePct = 96;
    const w = WEEKS.find(x => x.w === currentWeekNum) || WEEKS[0];

    const heading = document.createElement('div');
    heading.style.cssText = 'display:flex; align-items:baseline; gap:10px; margin-bottom:2px;';
    heading.innerHTML = `<h2 style="margin:0; font-family:var(--disp);">My Day</h2><span class="reqs">LPC · TLM · AIR</span>`;
    container.appendChild(heading);

    renderTeacherFilterBar(container, renderMyDay);

    container.appendChild(mdGrid('g4', [
      mdTile('Sessions confirmed', done + ' of ' + DOMAINS.length, '',
        mdPill(mdStatusBand(done/DOMAINS.length*100, 100, 75).l, mdStatusBand(done/DOMAINS.length*100, 100, 75).c),
        'One tap per session', mdMeter(done/DOMAINS.length*100, done===DOMAINS.length ? 'good' : 'warn')),
      mdTile('Week compliance', f1(weekPct), '%',
        mdPill(mdStatusBand(weekPct).l, mdStatusBand(weekPct).c) + mdPill(customCount + ' custom today', 'info'),
        'delivered ÷ planned', mdMeter(weekPct)),
      mdTile('Class present today', classPresent + ' of ' + classTotal, '',
        mdPill('Register saved', 'good'), 'Persisted per date'),
      mdTile('My attendance', myAttendancePct, '%',
        mdPill('Marked present 9:04 AM', 'good'), 'Gate at first class start')
    ]));

    const dayBar = document.createElement('div'); dayBar.className = 'fbar';
    dayBar.innerHTML = '<div class="ctl"><label>Teaching day</label><div style="display:flex;gap:5px" id="mdDayChips"></div></div>';
    container.appendChild(dayBar);
    const dc = document.getElementById('mdDayChips');
    dayLabels.forEach((dn, i) => {
      const b = document.createElement('button');
      b.className = 'chip' + (i === myDayIndex ? ' sel' : '');
      b.textContent = dn;
      b.onclick = () => { myDayIndex = i; renderMyDay(); };
      dc.appendChild(b);
    });

    container.appendChild(mdSec(
      'Week ' + w.w + ' · ' + w.theme + ' · ' + dayLabels[myDayIndex],
      '<span class="reqs">LPC-01…04 · TLM-03/04 · TCH-14…17</span>'
    ));

    const weekPlan = WEEKLY_PLAN['wk' + currentWeekNum] || {};
    const dayKey = dayKeysArr[myDayIndex];
    const sessionsGrid = document.createElement('div'); sessionsGrid.className = 'g g4';
    DOMAINS.forEach(d => {
      const dpKey = dailyPlanKey(currentWeekNum, dayKey, d.key);
      const dpEntry = dailyPlanEntries[dpKey];
      const hasPlan = !!(dpEntry && dpEntry.text && dpEntry.text.trim());
      const planText = hasPlan ? dpEntry.text.trim() : '';
      const usedSuggestion = hasPlan && dpEntry.usedSuggestion;
      const competencyText = (ACTIVITY_COMPETENCIES['wk' + currentWeekNum] &&
        ACTIVITY_COMPETENCIES['wk' + currentWeekNum][d.key] &&
        ACTIVITY_COMPETENCIES['wk' + currentWeekNum][d.key][dayKey]) || (weekPlan[d.key] ? weekPlan[d.key][dayKey] : '') || '';
      const material = (hasPlan && dpEntry.materials && dpEntry.materials.length)
        ? dpEntry.materials.join(', ')
        : (MYDAY_DOMAIN_MATERIAL[d.key] || '');

      const c = document.createElement('div');
      c.className = 'per' + (hasPlan ? ' done' : ' miss');
      c.innerHTML = `
        <div class="ph"><span class="pn">${esc(d.label)}</span></div>
        <div class="pt">${esc(d.time)} · ${esc(d.cg)}</div>
        <div class="pa">${hasPlan ? esc(planText) : (competencyText ? esc(competencyText) + ' — not planned yet' : 'Not planned yet')}</div>
        <div class="pf">
          <span class="chip ${hasPlan ? 'gd' : ''}">${hasPlan ? (usedSuggestion ? '✓ Using suggestion' : '✓ Your own plan') : '○ Not planned yet'}</span>
          ${material ? `<span class="chip">${esc(material)}</span>` : ''}
        </div>
        <div class="pf" style="margin-top:6px; align-items:center;">
          <label class="chip" style="cursor:pointer;">
            📷 Add photo
            <input type="file" accept="image/jpeg,image/png,image/webp" capture="environment"
              style="display:none;" onchange="uploadSessionActivityPhoto('${d.key}', '${dayKey}', this)" />
          </label>
          <span id="sessionPhotoStatus-${d.key}-${dayKey}" style="font-size:12px; color:var(--ink-3);"></span>
        </div>`;
      sessionsGrid.appendChild(c);
    });
    container.appendChild(sessionsGrid);

    const realMaterials = aggregateMaterialsForWeek(currentWeekNum);
    const usingRealMaterials = realMaterials.length > 0;
    container.appendChild(mdSec(
      usingRealMaterials ? 'Materials you\'ve added this week' : 'Materials needed this week',
      usingRealMaterials ? '<span class="reqs">From Daily Plan</span>' : '<span class="reqs">TLM-09 · sample data</span>'
    ));
    const matList = document.createElement('div'); matList.className = 'list';
    if(usingRealMaterials){
      matList.innerHTML = realMaterials.map(m => `<div class="row"><div class="t"><b>${esc(m)}</b></div></div>`).join('');
    } else {
      matList.innerHTML = MYDAY_PLACEHOLDER_MATERIALS.map(k => `<div class="row"><div class="t"><b>${esc(k.item)}</b><span>${k.issued} issued · used ${k.uses} times this term</span></div>
        <div>${k.state==='ok' ? mdPill('In stock','good') : (k.state==='low' ? mdPill('Low stock','warn') : mdPill('Damaged','crit'))}</div></div>`).join('');
    }
    container.appendChild(mdCard(null, null, matList));

    container.appendChild(mdSec('Suggestions for next week', '<span class="reqs">AIR-02…07 · advisory only</span>'));
    const sg = document.createElement('div'); sg.className = 'g g2';
    const c1 = document.createElement('div');
    c1.innerHTML = `<p style="margin:0 0 8px">Suggest a revisit session for <b>Numeracy</b>, using the authored activities for its curricular goal.</p>
      <div style="display:flex;gap:6px"><span class="chip sel">Accept</span><span class="chip">Edit</span><span class="chip">Reject</span></div>
      <p class="cap" style="margin:8px 0 0">Evidence: 28 children × 2 assessment points. AIR-05 requires this line.</p>`;
    sg.appendChild(mdCard('Revisit a domain', 'Rule: two or more assessment points with over 40% at the lowest tier.', c1));
    const c2 = document.createElement('div');
    c2.innerHTML = `<p style="margin:0 0 8px"><b>Tidy &amp; Put Away</b> was not delivered or modified 2 times this fortnight. Most common reason: children absent at wrap-up.</p>
      <div style="display:flex;gap:6px"><span class="chip sel">Accept</span><span class="chip">Edit</span><span class="chip">Reject</span></div>
      <p class="cap" style="margin:8px 0 0">Rejection reason is stored — AIR-07.</p>`;
    sg.appendChild(mdCard('Protect a dropped session', 'Rule: a session not delivered in 3 or more of the last 10 school days.', c2));
    container.appendChild(sg);

    // Reference-info legend — static, non-personal glossary/benchmark data
    // straight from the SOP (not per-teacher, doesn't change day to day).
    // Matches the prototype's .ftr bar; built with inline styles rather
    // than relying on a .ftr class that may not exist yet in
    // style-new-design.css.
    const footerLegend = document.createElement('div');
    footerLegend.style.cssText = 'display:flex; flex-wrap:wrap; gap:16px; margin-top:16px; padding-top:10px; border-top:1px solid var(--line, #0b0b0b1a); font-size:12px; color:var(--ink-3, #6d6b67);';
    footerLegend.innerHTML = [
      '<span><b>Scale</b> E/P/A three-tier · weights 1 · 2 · 3</span>',
      '<span><b>DSI</b> 0–200 · benchmark 133.3</span>',
      '<span><b>Domains</b> 10 → 5 koshas → 6 HPC domains → 13 curricular goals</span>',
      '<span><b>Year</b> June to April · May vacation · <b>210</b> computed teaching days</span>',
      '<span><b>Teacher days</b> 246 · Saturdays are teacher-only, last Saturday off</span>',
      '<span><b>Built to</b> BRD v3.3 · SOP · calendar · principal · Effective cycle</span>',
      '<span>Bhavyata Foundation × MCGM</span>'
    ].join('');
    container.appendChild(footerLegend);
  }

  /* =========================================================
     DAILY PLAN — entry-level planning screen. Each session shows a
     starting-point suggestion pulled from the REAL authored curriculum
     (WEEKLY_PLAN + ACTIVITY_COMPETENCIES) — this is pre-written content
     acting as a sensible default, not a live AI call. The teacher can
     accept it as-is, edit it, or clear it and write something entirely
     her own (e.g. a voice-to-text activity) — nothing here is locked.

     Voice input uses the browser's real SpeechRecognition API (not a
     simulation). Support varies by browser — solid in Chrome/Edge,
     partial in Safari, largely absent in Firefox — so the mic button
     hides itself gracefully where it isn't available, rather than
     showing something that would silently fail.

     All plan text/materials are held in dailyPlanEntries, keyed by
     week-day-domain — placeholder client-side storage until this
     becomes a real backend-saved plan.
     ========================================================= */
  const dailyPlanEntries = {}; // key -> {text, materials:[], usedSuggestion}
  let dailyPlanDayIndex = 0;   // 0=mon ... matches DAYS[] order
  let planInsightsExpanded = false;
  let activeVoiceRecognition = null;
  let activeVoiceDomainKey = null;

  function dailyPlanKey(week, dayKey, domainKey){
    return week + '-' + dayKey + '-' + domainKey;
  }

  function getSuggestedActivity(domainKey, dayKey){
    const weekPlan = WEEKLY_PLAN['wk' + currentWeekNum] || {};
    const short = weekPlan[domainKey] ? weekPlan[domainKey][dayKey] : '';
    const longer = (ACTIVITY_COMPETENCIES['wk' + currentWeekNum] &&
      ACTIVITY_COMPETENCIES['wk' + currentWeekNum][domainKey])
      ? ACTIVITY_COMPETENCIES['wk' + currentWeekNum][domainKey][dayKey] : '';
    return longer || short || '';
  }

  function voiceInputSupported(){
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  function toggleVoiceInput(domainKey, btnEl){
    // Stop and clear if this same session's mic is already listening.
    if(activeVoiceRecognition && activeVoiceDomainKey === domainKey){
      activeVoiceRecognition.stop();
      return;
    }
    // Switching sessions while another mic is live — stop the old one first.
    if(activeVoiceRecognition){
      activeVoiceRecognition.stop();
    }

    if(!voiceInputSupported()){
      btnEl.textContent = '🎤 Voice input not supported in this browser';
      return;
    }

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;
    try {
      recognition = new SpeechRecognitionCtor();
    } catch(e){
      btnEl.textContent = '🎤 Could not start voice input';
      return;
    }

    recognition.lang = 'en-IN';
    recognition.interimResults = true;  // show text live, while still speaking
    recognition.continuous = false;     // continuous mode has known reliability issues
                                         // in some Chrome/Edge versions — one complete
                                         // phrase per click is more reliable
    console.log('[voice] starting recognition for', domainKey);
    recognition.maxAlternatives = 1;

    activeVoiceRecognition = recognition;
    activeVoiceDomainKey = domainKey;
    btnEl.classList.add('listening');
    btnEl.textContent = '🔴 Listening… (click to stop)';

    const textarea = document.getElementById('planText-' + domainKey);
    const baseText = textarea ? textarea.value.trim() : '';
    let finalTranscript = '';

    recognition.onresult = (event) => {
      console.log('[voice] onresult fired', event.results);
      let interimTranscript = '';
      for(let i = event.resultIndex; i < event.results.length; i++){
        const piece = event.results[i][0].transcript;
        if(event.results[i].isFinal){
          finalTranscript += piece + ' ';
        } else {
          interimTranscript += piece;
        }
      }
      if(textarea){
        textarea.value = [baseText, finalTranscript.trim(), interimTranscript].filter(Boolean).join(' ');
        console.log('[voice] textarea now contains:', JSON.stringify(textarea.value));
      } else {
        console.log('[voice] WARNING: could not find textarea planText-' + domainKey);
      }
    };

    recognition.onerror = (event) => {
      console.log('[voice] onerror fired:', event.error, event);
      const reasons = {
        'not-allowed': 'Microphone permission denied — check your browser\'s site settings',
        'no-speech': 'No speech detected — try again',
        'audio-capture': 'No microphone found',
        'network': 'Needs an internet connection'
      };
      btnEl.textContent = '🎤 ' + (reasons[event.error] || ('Error: ' + event.error));
    };

    recognition.onend = () => {
      console.log('[voice] onend fired. Final textarea value:', textarea ? textarea.value : '(no textarea)');
      btnEl.classList.remove('listening');
      btnEl.textContent = '🎤 Speak activity';
      activeVoiceRecognition = null;
      activeVoiceDomainKey = null;
      if(textarea) savePlanText(domainKey, textarea.value);
    };

    recognition.onstart = () => {
      console.log('[voice] onstart fired - microphone is actually active now');
    };

    recognition.start();
  }

  function savePlanText(domainKey, text){
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const key = dailyPlanKey(currentWeekNum, dayKey, domainKey);
    if(!dailyPlanEntries[key]) dailyPlanEntries[key] = {text:'', materials:[], usedSuggestion:false};
    dailyPlanEntries[key].text = text;
    const suggested = getSuggestedActivity(domainKey, dayKey);
    dailyPlanEntries[key].usedSuggestion = (text.trim() === suggested.trim() && text.trim() !== '');
    updatePlanBadge(domainKey);
  }

  // Explicit "Save activity" button — the textarea already auto-saves as
  // you type (savePlanText fires on every keystroke), but that's easy to
  // miss. This gives a deliberate action with a clear, visible
  // confirmation, and is also what a teacher would naturally reach for
  // after finishing a voice-dictated activity.
  function saveActivityWithConfirmation(domainKey){
    const textarea = document.getElementById('planText-' + domainKey);
    if(!textarea) return;
    savePlanText(domainKey, textarea.value);
    const msg = document.getElementById('planSaveMsg-' + domainKey);
    if(msg){
      msg.textContent = '✓ Saved — synced to My Day';
      setTimeout(() => { msg.textContent = ''; }, 2500);
    }
    // Fires the moment an activity is saved/confirmed — the closest
    // thing this screen has to a "submit" action.
    checkActivityMatch(domainKey);
  }

  // ---------------------------------------------------------------
  // Activity match check — asks an AI agent whether what the teacher
  // actually wrote matches the suggested activity + domain (yes/no).
  //
  // Deliberately NOT wired to the database: matchCheckResults lives
  // only in this tab's memory, and backend/check_activity_match.php
  // (see that file) never reads or writes any table either. Refreshing
  // the page or switching devices loses the result — that's intentional
  // until this is redesigned as a persisted feature.
  //
  // The endpoint itself is currently a stub (no real agent call yet —
  // that's the "pocket" left for wiring one in later).
  // ---------------------------------------------------------------
  const matchCheckResults = {}; // key -> {status, match, reason} — in-memory only

  function renderMatchBadge(domainKey){
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const key = dailyPlanKey(currentWeekNum, dayKey, domainKey);
    const badge = document.getElementById('matchBadge-' + domainKey);
    if(!badge) return;
    const result = matchCheckResults[key];

    if(!result){
      badge.style.display = 'none';
      badge.textContent = '';
      badge.className = 'pill';
      return;
    }

    badge.style.display = 'inline-block';
    if(result.status === 'checking'){
      badge.textContent = 'Checking match…';
      badge.className = 'pill info';
    } else if(result.match === true){
      badge.textContent = '✓ Matches suggestion/domain';
      badge.className = 'pill good';
    } else if(result.match === false){
      badge.textContent = '✕ Doesn\u2019t match suggestion/domain';
      badge.className = 'pill warn';
    } else {
      badge.textContent = 'Match check: pending (agent not wired yet)';
      badge.className = 'pill';
    }
  }

  async function checkActivityMatch(domainKey){
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const key = dailyPlanKey(currentWeekNum, dayKey, domainKey);
    const entry = dailyPlanEntries[key];
    if(!entry || !entry.text.trim()){
      delete matchCheckResults[key];
      renderMatchBadge(domainKey);
      return;
    }

    matchCheckResults[key] = { status: 'checking', match: null, reason: '' };
    renderMatchBadge(domainKey);

    const suggested = getSuggestedActivity(domainKey, dayKey);
    const d = DOMAINS.find(x => x.key === domainKey);

    try {
      const res = await fetch('backend/check_activity_match.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: d ? d.label : domainKey,
          suggested_activity: suggested,
          actual_activity: entry.text
        })
      });
      const data = await res.json();
      matchCheckResults[key] = {
        status: data.status || 'pending',
        match: (typeof data.match === 'boolean') ? data.match : null,
        reason: data.reason || ''
      };
    } catch (err) {
      matchCheckResults[key] = { status: 'pending', match: null, reason: 'Could not reach match-check service.' };
    }
    renderMatchBadge(domainKey);
  }

  function useSuggestionForSession(domainKey){
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const suggested = getSuggestedActivity(domainKey, dayKey);
    const textarea = document.getElementById('planText-' + domainKey);
    if(textarea){ textarea.value = suggested; savePlanText(domainKey, suggested); }
  }

  function clearPlanText(domainKey){
    const textarea = document.getElementById('planText-' + domainKey);
    if(textarea){ textarea.value = ''; savePlanText(domainKey, ''); }
  }

  function updatePlanBadge(domainKey){
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const key = dailyPlanKey(currentWeekNum, dayKey, domainKey);
    const entry = dailyPlanEntries[key];
    const badge = document.getElementById('planBadge-' + domainKey);
    if(!badge) return;
    if(!entry || !entry.text.trim()){
      badge.textContent = 'Not planned yet';
      badge.className = 'pill';
    } else if(entry.usedSuggestion){
      badge.textContent = 'Using suggestion';
      badge.className = 'pill good';
    } else {
      badge.textContent = 'Your own activity';
      badge.className = 'pill info';
    }
  }

  function addMaterialChip(domainKey, inputEl){
    const value = inputEl.value.trim();
    if(!value) return;
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const key = dailyPlanKey(currentWeekNum, dayKey, domainKey);
    if(!dailyPlanEntries[key]) dailyPlanEntries[key] = {text:'', materials:[], usedSuggestion:false};
    dailyPlanEntries[key].materials.push(value);
    inputEl.value = '';
    renderMaterialChips(domainKey);
  }

  function removeMaterialChip(domainKey, idx){
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const key = dailyPlanKey(currentWeekNum, dayKey, domainKey);
    if(dailyPlanEntries[key]) dailyPlanEntries[key].materials.splice(idx, 1);
    renderMaterialChips(domainKey);
  }

  function renderMaterialChips(domainKey){
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const key = dailyPlanKey(currentWeekNum, dayKey, domainKey);
    const materials = (dailyPlanEntries[key] && dailyPlanEntries[key].materials) || [];
    const wrap = document.getElementById('planMaterials-' + domainKey);
    if(!wrap) return;
    wrap.innerHTML = materials.map((m, i) =>
      `<span class="chip">${esc(m)} <span style="cursor:pointer; color:var(--ink-3);" onclick="removeMaterialChip('${domainKey}', ${i})">✕</span></span>`
    ).join('');
  }

  function togglePlanInsights(){
    planInsightsExpanded = !planInsightsExpanded;
    renderDailyPlan();
  }

  // Parses WEEKS[].dates strings like "15–19 Jun 2026" (same month) or
  // "29 Jun–3 Jul 2026" (crosses a month boundary) into the week's
  // actual Monday date. Finds the FIRST day-number and FIRST month
  // abbreviation in the string, which is always the start of the
  // range in both formats.
  function parseWeekStartDate(datesStr){
    const monthNames = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
    const yearMatch = datesStr.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
    const dayMatch = datesStr.match(/^(\d+)/);
    const startDay = dayMatch ? parseInt(dayMatch[1], 10) : 1;
    const monthMatch = datesStr.match(/[A-Za-z]{3}/);
    const startMonth = monthMatch && monthNames[monthMatch[0]] !== undefined ? monthNames[monthMatch[0]] : 0;
    return new Date(year, startMonth, startDay);
  }

  function renderDailyPlan(){
    const container = document.getElementById('dailyplan-body');
    container.innerHTML = '';

    const dayLabels = ['Mon','Tue','Wed','Thu','Fri'];
    const dayKey = ['mon','tue','wed','thu','fri'][dailyPlanDayIndex];
    const w = WEEKS.find(x => x.w === currentWeekNum) || WEEKS[0];

    // Day selector
    const dayBar = document.createElement('div'); dayBar.className = 'fbar';
    dayBar.innerHTML = '<div class="ctl"><label>Planning for</label><div style="display:flex;gap:5px" id="dpDayChips"></div></div>';
    container.appendChild(dayBar);
    const dc = dayBar.querySelector('#dpDayChips');
    dayLabels.forEach((dn, i) => {
      const b = document.createElement('button');
      b.className = 'chip' + (i === dailyPlanDayIndex ? ' sel' : '');
      b.textContent = dn;
      b.onclick = () => { dailyPlanDayIndex = i; renderDailyPlan(); };
      dc.appendChild(b);
    });

    container.appendChild(mdSec('Week ' + w.w + ' · ' + w.theme + ' · ' + dayLabels[dailyPlanDayIndex]));

    // ---------------------------------------------------------
    // PLANNED SESSIONS CALENDAR — reuses the exact same calendar
    // renderer as PTM Schedule & Agenda (PTM_calMonth / PTM_buildMonthGrid
    // from ptm-view.js), so both calendars look and behave identically.
    // Each day shows how many of the 8 domains have a saved plan.
    // ---------------------------------------------------------
    (function renderDailyPlanCalendar(){
      const startDate = parseWeekStartDate(w.dates);
      const monthIdx = startDate.getMonth();
      const monthYear = startDate.getFullYear();
      const mo = PTM_buildMonthGrid(monthYear, monthIdx);
      const items = {};
      const dayKeysArr = ['mon','tue','wed','thu','fri'];
      let selectedCalDay = null;
      dayKeysArr.forEach((dk, i) => {
        const d = new Date(startDate); d.setDate(d.getDate() + i);
        if(d.getMonth() !== monthIdx) return; // week crosses into next month — only this month's days shown here
        const dateDay = d.getDate();
        if(i === dailyPlanDayIndex) selectedCalDay = dateDay;
        const plannedCount = DOMAINS.filter(dom => {
          const key = dailyPlanKey(currentWeekNum, dk, dom.key);
          const entry = dailyPlanEntries[key];
          return entry && entry.text && entry.text.trim();
        }).length;
        if(plannedCount > 0){
          items[dateDay] = [{
            label: plannedCount + '/' + DOMAINS.length + ' planned',
            band: plannedCount === DOMAINS.length ? 'good' : 'warn'
          }];
        }
      });
      container.appendChild(PTM_sec('Planned sessions this month', '<span class="reqs">LPC-01…04</span>'));
      container.appendChild(PTM_calMonth(mo, items, selectedCalDay));
      container.appendChild(PTM_el('p', 'cap', 'A day shows how many of the 8 sessions have a saved plan. Tap a day chip above to plan for it — this calendar is a summary, not editable directly.'));
    })();

    // One card per session
    DOMAINS.forEach(d => {
      const key = dailyPlanKey(currentWeekNum, dayKey, d.key);
      const entry = dailyPlanEntries[key] || {text:'', materials: (MYDAY_DOMAIN_MATERIAL[d.key] ? [] : []), usedSuggestion:false};
      const suggested = getSuggestedActivity(d.key, dayKey);
      const defaultMaterial = MYDAY_DOMAIN_MATERIAL[d.key];

      const card = document.createElement('div'); card.className = 'card'; card.style.marginBottom = '14px';
      card.innerHTML = `
        <div class="hd">
          <div>
            <h3>${esc(d.label)}</h3>
            <p class="cap">${esc(d.time)} · ${esc(d.cg)} · ${esc(broadCompetencyFallback(d.key))}</p>
          </div>
          <span id="planBadge-${d.key}" class="pill">Not planned yet</span>
        </div>
        <div style="background:var(--surface-2); border-radius:8px; padding:10px 12px; margin-bottom:10px; font-size:13px;">
          <b>Suggested activity:</b> ${suggested ? esc(suggested) : '<span style="color:var(--ink-3);">No suggestion authored for this session yet.</span>'}
          ${suggested ? `<button class="chip" style="margin-left:8px;" onclick="useSuggestionForSession('${d.key}')">Use this</button>` : ''}
        </div>
        <label style="font-size:12px; color:var(--ink-3); display:block; margin-bottom:4px;">Your plan for this session</label>
        <div style="display:flex; gap:8px; align-items:flex-start;">
          <textarea id="planText-${d.key}" rows="2" style="flex:1;" placeholder="Write your own activity here, or use the suggestion above"></textarea>
          ${voiceInputSupported() ? `<button type="button" class="chip" style="white-space:nowrap;" onclick="toggleVoiceInput('${d.key}', this)">🎤 Speak activity</button>` : ''}
        </div>
        <div style="display:flex; gap:6px; margin:8px 0; align-items:center;">
          <button class="chip" style="background:var(--fill-accent, var(--brand)); color:#fff; border-color:transparent;" onclick="saveActivityWithConfirmation('${d.key}')">✓ Save activity</button>
          <button class="chip" onclick="clearPlanText('${d.key}')">Clear</button>
          <span id="planSaveMsg-${d.key}" style="font-size:12px; color:var(--good, #0ca30c);"></span>
          <span id="matchBadge-${d.key}" class="pill" style="display:none;"></span>
        </div>
        <label style="font-size:12px; color:var(--ink-3); display:block; margin-bottom:4px;">Materials needed</label>
        <div id="planMaterials-${d.key}" style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:6px;"></div>
        <div style="display:flex; gap:6px;">
          <input type="text" id="planMaterialInput-${d.key}" placeholder="${defaultMaterial ? 'e.g. ' + esc(defaultMaterial) : 'Add a material'}" style="flex:1; padding:6px 8px; font-size:12px;" onkeydown="if(event.key==='Enter'){ addMaterialChip('${d.key}', this); }" />
          <button class="chip" onclick="addMaterialChip('${d.key}', document.getElementById('planMaterialInput-${d.key}'))">Add</button>
        </div>
      `;
      container.appendChild(card);

      // Wire up textarea persistence and initial state after insertion.
      const ta = card.querySelector('#planText-' + d.key);
      ta.value = entry.text;
      ta.addEventListener('input', () => savePlanText(d.key, ta.value));
    });

    // Populate material chips and badges now that all DOM nodes exist.
    DOMAINS.forEach(d => { renderMaterialChips(d.key); updatePlanBadge(d.key); renderMatchBadge(d.key); });

    // ---- Collapsed-by-default insights section ----
    const insightsToggle = document.createElement('button');
    insightsToggle.className = 'chip';
    insightsToggle.style.cssText = 'margin-top:10px;';
    insightsToggle.textContent = (planInsightsExpanded ? '▾ Hide' : '▸ Show') + ' plan insights for the week';
    insightsToggle.onclick = togglePlanInsights;
    container.appendChild(insightsToggle);

    if(planInsightsExpanded){
      const plannedCount = DOMAINS.filter(d => {
        const k = dailyPlanKey(currentWeekNum, dayKey, d.key);
        return dailyPlanEntries[k] && dailyPlanEntries[k].text.trim();
      }).length;
      const suggestionCount = DOMAINS.filter(d => {
        const k = dailyPlanKey(currentWeekNum, dayKey, d.key);
        return dailyPlanEntries[k] && dailyPlanEntries[k].usedSuggestion;
      }).length;

      const insightsCard = document.createElement('div'); insightsCard.className = 'card'; insightsCard.style.marginTop = '10px';
      insightsCard.innerHTML = `
        <div class="hd"><div><h3>Today's planning snapshot</h3><p class="cap">${dayLabels[dailyPlanDayIndex]} · Week ${w.w}</p></div></div>
        <div class="g g4" style="margin-top:8px;">
          <div class="tile"><div class="k">Sessions planned</div><div class="v">${plannedCount}<small> of ${DOMAINS.length}</small></div></div>
          <div class="tile"><div class="k">Using suggestions</div><div class="v">${suggestionCount}<small> of ${plannedCount || 0}</small></div></div>
          <div class="tile"><div class="k">Your own activities</div><div class="v">${Math.max(0, plannedCount - suggestionCount)}</div></div>
        </div>
        <p class="cap" style="margin-top:10px;">This is a lightweight snapshot, not a performance score — customizing an activity isn't flagged as a problem here, it's just shown for your own reference.</p>
      `;
      container.appendChild(insightsCard);
    }
  }

  function toggleAddMaterialForm(){
    const wrap = document.getElementById('addMaterialFormWrap');
    const isHidden = wrap.classList.contains('hidden');
    if(!isHidden){ wrap.classList.add('hidden'); wrap.innerHTML = ''; return; }

    wrap.classList.remove('hidden');
    wrap.innerHTML = `
      <form onsubmit="return submitNewMaterial(event)" style="background:var(--card); border-radius:10px; padding:16px 18px; margin-bottom:16px;">
        <label class="field-label-admin">Item name</label>
        <input type="text" id="matItemName" placeholder="e.g. Workbook set — Jr KG" required />

        <label class="field-label-admin">Quantity (optional)</label>
        <input type="text" id="matQuantity" placeholder="e.g. 28, or 3 sets" />

        <label class="field-label-admin">Received date</label>
        <input type="date" id="matReceivedDate" required />

        <div id="addMaterialResult" style="margin-top:8px;"></div>
        <div style="display:flex; gap:8px; margin-top:10px;">
          <button type="submit" class="btn-primary" style="width:auto; padding:9px 16px;">Add material</button>
          <button type="button" class="btn-sup-outline" onclick="toggleAddMaterialForm()">Cancel</button>
        </div>
      </form>
    `;
    document.getElementById('matReceivedDate').value = todayKey();
  }

  async function submitNewMaterial(event){
    event.preventDefault();
    const resultEl = document.getElementById('addMaterialResult');
    resultEl.innerHTML = '';

    const itemName = document.getElementById('matItemName').value.trim();
    const receivedDate = document.getElementById('matReceivedDate').value;

    if(!itemName || !receivedDate){
      resultEl.innerHTML = `<div class="au-error">Item name and received date are both required.</div>`;
      return false;
    }

    resultEl.innerHTML = '<p class="sub">Saving…</p>';
    try{
      const res = await fetch('backend/add_materials.php' + window.location.search, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          item_name: itemName,
          quantity: document.getElementById('matQuantity').value.trim(),
          received_date: receivedDate
        })
      });
      const data = await res.json();
      if(data.status !== 'success'){
        resultEl.innerHTML = `<div class="au-error">${esc(data.message || 'Could not save.')}</div>`;
        return false;
      }
      renderMaterials();
    } catch(err){
      resultEl.innerHTML = '<div class="au-error">Could not reach the server.</div>';
    }
    return false;
  }

  async function toggleMaterialDistributed(materialId){
    try{
      await fetch('backend/toggle_material.php' + window.location.search, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ material_id: materialId })
      });
    } catch(err){ /* fall through to re-render regardless — shows the real current state */ }
    renderMaterials();
  }

  /* ===================== SECTION 10: ATTENDANCE — CLASS REGISTER ===================== */

  function renderAttendanceBody(){
    const key = todayKey();
    if(!attendanceRecords[key]) attendanceRecords[key] = {};
    const records = attendanceRecords[key];
    let presentCount = 0, absentCount = 0;

    const rows = SAMPLE_STUDENTS.map(name => {
      const status = records[name] || 'present';
      if(status === 'present') presentCount++; else absentCount++;
      const hidden = attendanceSearchTerm && !name.toLowerCase().includes(attendanceSearchTerm.toLowerCase());
      return `<div class="attendance-row ${hidden ? 'filtered-out' : ''}">
        <span class="name">${name}</span>
        <div class="attendance-toggle">
          <button class="att-btn present ${status==='present'?'active':''}" onclick="setAttendance('${name}','present')">Present</button>
          <button class="att-btn absent ${status==='absent'?'active':''}" onclick="setAttendance('${name}','absent')">Absent</button>
        </div>
      </div>`;
    }).join('');

    document.getElementById('attendance-body').innerHTML = `
      <div class="attendance-header">
        <h1>Attendance</h1>
        <button class="btn-mark-all" onclick="markAllPresent()">Mark all present</button>
      </div>
      <div class="attendance-summary">
        <div class="stat-card"><p class="label">Total students</p><p class="value">${SAMPLE_STUDENTS.length}</p></div>
        <div class="stat-card"><p class="label">Present</p><p class="value" style="color:var(--primary-dark)">${presentCount}</p></div>
        <div class="stat-card"><p class="label">Absent</p><p class="value" style="color:#d9534f">${absentCount}</p></div>
      </div>
      <input class="attendance-search" type="text" placeholder="Search student by name"
        value="${attendanceSearchTerm}" oninput="filterAttendance(this.value)" />
      <div class="attendance-roster">${rows}</div>
      <div class="attendance-footer">
        <span class="marked-count">${SAMPLE_STUDENTS.length} of ${SAMPLE_STUDENTS.length} marked</span>
        <button class="btn-save-attendance" onclick="saveAttendanceToServer()">
          ${attendanceSaved ? 'Saved ✓' : 'Save attendance'}
        </button>
      </div>
    `;

    const classAttendEl = document.getElementById('classAttendanceValue');
    if(classAttendEl) classAttendEl.textContent = presentCount + '/' + SAMPLE_STUDENTS.length;
  }

  function setAttendance(name, status){
    const key = todayKey();
    if(!attendanceRecords[key]) attendanceRecords[key] = {};
    attendanceRecords[key][name] = status;
    attendanceSaved = false;
    renderAttendanceBody();
  }

  function markAllPresent(){
    const key = todayKey();
    attendanceRecords[key] = {};
    SAMPLE_STUDENTS.forEach(name => { attendanceRecords[key][name] = 'present'; });
    attendanceSaved = false;
    renderAttendanceBody();
  }

  function filterAttendance(term){
    attendanceSearchTerm = term;
    renderAttendanceBody();
    const input = document.querySelector('.attendance-search');
    if(input){ input.focus(); input.setSelectionRange(term.length, term.length); }
  }

  function saveAttendanceToServer(){
    const key = todayKey();
    const records = attendanceRecords[key];
    console.log('Would POST to server:', { date: key, records });
    attendanceSaved = true;
    renderAttendanceBody();
  }

  let expandedWeek = 1;
  const dayTopicDone = {}; // key: week-dayKey -> true/false (manual sidebar tick, separate from granular task tracking)

  /* ===================== SECTION 11: WEEKLY ACTIVITIES / CURRICULUM ===================== */

  function renderSidebar(){
    const list = document.getElementById('week-list');
    list.innerHTML = WEEKS.map(w => {
      const isExpanded = expandedWeek === w.w;
      let dropdownHtml = '';
      if(isExpanded && weeksWithContent.includes(w.w)){
        const weekTopics = WEEK_DAY_TOPICS['wk' + w.w] || {};
        dropdownHtml = `<div class="day-topic-list">
          <div class="day-topic-heading">Topic: ${w.theme}</div>` + DAYS.map(d => {
          const key = w.w + '-' + d.key;
          const checked = dayTopicDone[key] ? 'checked' : '';
          const doneClass = dayTopicDone[key] ? 'dt-done' : '';
          const activeClass = (w.w===currentWeekNum && d.key===currentDay) ? 'active-day' : '';
          const topic = weekTopics[d.key];
          const topicText = topic ? alwaysEnglish(topic.value) : 'Topic not yet added';
          return `<div class="day-topic-row ${activeClass}">
            <input type="checkbox" ${checked} onchange="toggleDayTopic(${w.w}, '${d.key}', this)" />
            <span class="dt-label ${doneClass}" onclick="event.stopPropagation(); selectWeekDay(${w.w}, '${d.key}')">${d.label} — ${topicText}</span>
          </div>`;
        }).join('') + `</div>`;
      } else if(isExpanded){
        dropdownHtml = `<div class="day-topic-list" style="color:var(--text-muted); font-size:11px;">No topics authored for this week yet.</div>`;
      }
      return `<div class="week-item ${w.w===currentWeekNum?'active':''} ${weeksWithContent.includes(w.w)?'has-content':''}" style="flex-direction:column; align-items:stretch;">
        <div style="display:flex; align-items:center; gap:10px;" onclick="toggleWeekExpand(${w.w})">
          <div class="week-num">${w.w}</div>
          <div class="week-info">
            <div class="week-title">WEEK-${w.w}</div>
            <div class="week-dates">${w.theme} · ${w.dates}</div>
          </div>
          <span class="chevron ${isExpanded?'open':''}">▶</span>
        </div>
        ${dropdownHtml}
      </div>`;
    }).join('');
  }

  function toggleWeekExpand(wnum){
    expandedWeek = (expandedWeek === wnum) ? null : wnum;
    if(weeksWithContent.includes(wnum)) openWeek(wnum);
    else renderSidebar();
  }

  function toggleDayTopic(wnum, dayKey, el){
    dayTopicDone[wnum + '-' + dayKey] = el.checked;
    renderSidebar();
  }

  function selectWeekDay(wnum, dayKey){
    expandedWeek = wnum;
    currentDay = dayKey;
    openWeek(wnum);
    closeSidebar();
  }

  function openWeek(wnum){
    currentWeekNum = wnum;
    renderSidebar();
    const w = WEEKS.find(x => x.w === wnum);
    document.getElementById('week-subheading').textContent = `Week ${w.w} · Term 1 · ${w.dates} · Theme: ${w.theme}`;
    const body = document.getElementById('week-body');
    if(weeksWithContent.includes(wnum)){
      renderWeekBody();
    } else {
      body.innerHTML = `<div class="empty-state">Content for "${w.theme}" hasn't been authored in this rough demo yet — only Week 1 ("My Classroom") has the full daily lesson plan wired up.</div>`;
    }
  }

  function renderWeekBody(){
    const body = document.getElementById('week-body');
    body.innerHTML = `
      <div class="value-banner" id="value-banner"></div>
      <div id="day-summary"></div>
      <div id="rating-panel-container"></div>
      <div class="domain-grid" id="domain-grid"></div>
    `;
    renderDailyView();
  }

  const domainDone = {};   // key: day-domain -> true/false
  const dayRatings = {};   // key: day-domain -> {studentName: rating}

  function renderDailyView(){
    const day = DAYS.find(d => d.key === currentDay);
    document.getElementById('value-banner').innerHTML = `<strong>Value:</strong> ${alwaysEnglish(day.value)} &nbsp;·&nbsp; <strong>Link:</strong> ${alwaysEnglish(day.link)}`;

    let doneCount = 0;
    let cardsHtml = '';

    // Only render a card for domains that actually have content for
    // this specific week — e.g. Week 2's real plan doesn't include
    // Tidy & Put Away at all, so it should disappear rather than
    // show an empty "Not planned yet" placeholder.
    const weekPlan = WEEKLY_PLAN['wk' + currentWeekNum];
    const trackedDomains = DOMAINS.filter(dom => weekPlan && weekPlan[dom.key] !== undefined);

    trackedDomains.forEach(dom => {
      const activity = todaysActivity(dom.key);
      const key = currentDay + '-' + dom.key;
      const done = !!domainDone[key];
      if(done) doneCount++;

      if(!dom.h5p){
        // Plain checklist item, no game, no proficiency rating
        cardsHtml += `<div class="stage-card ${done?'done':''}">
          <div class="stage-head">
            <span class="name">${pickLang(dom.label)} <span class="stage-time">${dom.time}</span></span>
            <span class="stage-tag ${done?'done':''}">${done ? 'Done' : 'Not done'}</span>
          </div>
          <div class="materials-line">Planned activity: ${activity}</div>
          <div class="competency-tag">Covers: ${competencyFor(dom.key)}</div>
          <div class="stage-foot">
            <label class="mark-taught">
              <input type="checkbox" ${done?'checked':''} onchange="toggleDomainDone('${dom.key}', this)" />
              Mark as done today
            </label>
          </div>
        </div>`;
        return;
      }

      cardsHtml += `<div class="stage-card ${done?'done':''}" id="stage-card-${key}">
        <div class="stage-head">
          <span class="name">${pickLang(dom.label)} <span class="stage-time">${dom.time}</span></span>
          <button class="fullscreen-btn" onclick="toggleCardFullscreen('stage-card-${key}')" title="View full screen" aria-label="View full screen">⛶</button>
          <span class="stage-tag ${done?'done':''}">${done ? 'Done today' : 'Pending'}</span>
        </div>
        <div class="materials-line">Planned activity: ${activity}</div>
        <div class="competency-tag">Covers: ${competencyFor(dom.key)}</div>
        <div class="h5p-block">
          <div class="h5p-frame" id="${mountId(key)}">${done ? '<div class="h5p-done-msg">✓ Practised — nice work!</div>' : ''}</div>
        </div>
        <div class="stage-foot">
          <label class="mark-taught">
            <input type="checkbox" ${done?'checked':''} onchange="toggleDomainDone('${dom.key}', this)" />
            Mark as done today
          </label>
          <button class="btn-rate-open small" onclick="openRatingPanel('${dom.key}')">Enter proficiency</button>
        </div>
      </div>`;
    });

    document.getElementById('domain-grid').innerHTML = cardsHtml;
    document.getElementById('day-summary').innerHTML =
      `<div class="topic-complete-banner ${doneCount<trackedDomains.length ? 'pending' : ''}">${doneCount===trackedDomains.length?'✓ ':''}${doneCount} of ${trackedDomains.length} domains done for ${day.label}</div>`;

    trackedDomains.forEach(dom => { if(dom.h5p) mountH5pIfNeeded(dom.key); });
    document.getElementById('pending-count').textContent = DOMAINS.length - doneCount;

    renderTodayOverview();
  }

  function toggleDomainDone(domainKey, el){
    domainDone[currentDay + '-' + domainKey] = el.checked;
    renderDailyView();
  }

  function renderTodayOverview(){
    const el = document.getElementById('today-overview');
    if(!el) return;
    const day = DAYS.find(d => d.key === currentDay);

    const rows = DOMAINS.map(dom => {
      const activity = todaysActivity(dom.key);
      const done = !!domainDone[currentDay + '-' + dom.key];
      return `<div class="overview-row ${done ? 'done' : ''}">
        <span class="overview-time">${dom.time}</span>
        <span class="overview-domain">${pickLang(dom.label)}</span>
        <span class="overview-activity">${activity}</span>
        <span class="overview-status">${done ? '✓' : '•'}</span>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div class="overview-header">
        <span>Today's plan — ${day.label}</span>
        <span class="overview-toggle" onclick="toggleOverview()">${overviewCollapsed ? 'Show' : 'Hide'}</span>
      </div>
      <div class="overview-body ${overviewCollapsed ? 'hidden' : ''}">${rows}</div>
    `;
  }

  let overviewCollapsed = false;
  function toggleOverview(){
    overviewCollapsed = !overviewCollapsed;
    renderTodayOverview();
  }


  function mountId(key){ return 'h5p-mount-' + key.replace(/[^a-zA-Z0-9]/g,'_'); }

  function mountH5pIfNeeded(domainKey){
    const key = currentDay + '-' + domainKey;
    if(domainDone[key]) return; // already taught — done message is shown instead
    const el = document.getElementById(mountId(key));
    const renderer = ACTIVITY_RENDERERS[domainKey];
    if(el && renderer){
      renderer(el, function(){
        domainDone[key] = true;
        renderDailyView();
      });
    }
  }

  function openRatingPanel(domainKey){
    const key = currentDay + '-' + domainKey;
    const existing = dayRatings[key] || {};
    const domainLabel = DOMAINS.find(d=>d.key===domainKey).label;
    const dayLabel = DAYS.find(d=>d.key===currentDay).label;
    const competencyText = competencyFor(domainKey);

    let html = `<div class="rating-panel">
      <p class="rp-title">Enter proficiency — ${domainLabel}, ${dayLabel}</p>
      <p class="rp-competency"><strong>Covers:</strong> ${competencyText}</p>`;
    SAMPLE_STUDENTS.forEach(name => {
      const current = existing[name] || '';
      html += `<div class="rp-row"><span>${name}</span>
        <select id="rate-${name.replace(/\s/g,'_')}">
          <option value="">— Select —</option>
          ${RATING_LEVELS.map(l => `<option value="${l}" ${current===l?'selected':''}>${l}</option>`).join('')}
        </select></div>`;
    });
    html += `<div class="rp-actions">
        <button class="btn-save" onclick="saveRatings('${domainKey}')">Save ratings</button>
        <button class="btn-cancel" onclick="closeRatingPanel()">Cancel</button>
      </div></div>`;
    document.getElementById('rating-panel-container').innerHTML = html;
    document.getElementById('rating-panel-container').scrollIntoView({behavior:'smooth', block:'center'});
  }

  function saveRatings(domainKey){
    const key = currentDay + '-' + domainKey;
    const ratings = {};
    SAMPLE_STUDENTS.forEach(name => {
      const sel = document.getElementById(`rate-${name.replace(/\s/g,'_')}`);
      if(sel && sel.value) ratings[name] = sel.value;
    });
    dayRatings[key] = ratings;
    closeRatingPanel();
  }

  function closeRatingPanel(){
    document.getElementById('rating-panel-container').innerHTML = '';
  }

/* =========================================================
   SESSION RESUME — on page load, check whether there's already a
   real logged-in session (e.g. after clicking "Preview as Teacher"
   from Super Admin, or simply reloading this page while logged in)
   and skip straight to the dashboard instead of showing the login
   form again. If not logged in, the login form just stays visible,
   same as before this existed.

   Runs last, after every function/variable it calls is already
   defined — same ordering reason the old dev-bypass trigger used
   to need this position.
   ========================================================= */
  
// -------------------------------------------------------------------------
// PREVIEW BANNER — shown only when a superadmin is currently previewing
// the teacher role (see backend/preview_as.php). Lets them get back to
// their real superadmin session with one click, no re-login needed.
// -------------------------------------------------------------------------
  /* ===================== SECTION 12: REMAINING SIDEBAR SCREENS ===================== */
  // All 11 of these are deliberately frontend-only placeholder views —
  // sample/computed data, no new backend endpoints, same "frontend
  // first" pattern used everywhere else in this app so far. The 5
  // student-dependent ones (My Class, Class Progress, Attendance
  // Register, Admissions, Monthly Assessment, Child Record, Transition)
  // are blocked on a real `students` table — this reuses the existing
  // SAMPLE_STUDENTS list as a stand-in until that table exists.
  //
  // Deterministic pseudo-random helper — same purpose as the old
  // prototype's rng(): stable sample numbers that don't re-shuffle on
  // every render, without needing a real backend or true randomness.
  function sampleHash(str){
    let h = 2166136261;
    for(let i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0);
  }
  function sampleRand(seed){ return (sampleHash(seed) % 1000) / 1000; }
  function samplePick(seed, arr){ return arr[Math.floor(sampleRand(seed) * arr.length)]; }

  // ---------- 1. MY CLASS ----------
  // Matches the real prototype's vTeacherClass exactly: same tiles, same
  // table columns, same wording/req codes — pulled directly from the
  // prototype's source rather than guessed at from a screenshot.
  const OCCUPATIONS = ['Daily wage labour','Auto / taxi driver','Domestic work','Tailoring','Homemaker','Unemployed','Self-employed / small trade','Salaried'];
  const LANGUAGES_AT_HOME = ['Hindi','Marathi','Telugu','Bhojpuri','Gujarati'];
  const INCOME_BANDS = ['Under ₹5,000','₹5,000–10,000','₹15,000–25,000','Prefer not to say'];

  function sampleFamily(name){
    const occA = samplePick(name + 'occA', OCCUPATIONS);
    const occB = samplePick(name + 'occB', OCCUPATIONS);
    const langCount = 1 + Math.floor(sampleRand(name + 'langn') * 2);
    const langs = [samplePick(name + 'lang1', LANGUAGES_AT_HOME)];
    if(langCount > 1){
      const second = samplePick(name + 'lang2', LANGUAGES_AT_HOME);
      if(!langs.includes(second)) langs.push(second);
    }
    return {
      guardians: [{occ: occA}, {occ: occB}],
      langs,
      reads: sampleRand(name + 'reads') > 0.3,
      income: samplePick(name + 'inc', INCOME_BANDS),
      complete: Math.round(40 + sampleRand(name + 'complete') * 60),
      consent: sampleRand(name + 'consent') > 0.15,
      photoConsent: sampleRand(name + 'photoconsent') > 0.35
    };
  }
  function sampleHomeActStatus(name){
    return samplePick(name + 'homeact', ['done', 'partly done', 'not done', 'not asked']);
  }

  function renderMyClass(){
    const container = document.getElementById('myclass-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderMyClass);

    const fams = SAMPLE_STUDENTS.map(sampleFamily);
    const profDone = fams.filter(f => f.complete >= 80).length;
    const presentToday = SAMPLE_STUDENTS.filter(name => sampleRand(name + 'today') > 0.1).length;

    container.appendChild(mdGrid('g4', [
      mdTile('Enrolled', SAMPLE_STUDENTS.length, 'children', mdPill('Jr KG', 'info'), 'DAT-03 · pupil entity'),
      mdTile('Present today', presentToday, 'of ' + SAMPLE_STUDENTS.length,
        mdPill(mdStatusBand(presentToday/SAMPLE_STUDENTS.length*100).l, mdStatusBand(presentToday/SAMPLE_STUDENTS.length*100).c),
        'TCH-07 · mark all present in one action', mdMeter(presentToday/SAMPLE_STUDENTS.length*100)),
      mdTile('Family profiles 80%+', profDone, 'of ' + SAMPLE_STUDENTS.length,
        mdPill(mdStatusBand(profDone/SAMPLE_STUDENTS.length*100, 80, 60).l, mdStatusBand(profDone/SAMPLE_STUDENTS.length*100, 80, 60).c),
        'FAM-12 · completeness per child', mdMeter(profDone/SAMPLE_STUDENTS.length*100)),
      mdTile('Consent recorded', fams.filter(f => f.consent).length, 'of ' + SAMPLE_STUDENTS.length,
        mdPill(fams.filter(f => f.photoConsent).length + ' photo consent', 'info'), 'FAM-11 · withdrawable')
    ]));

    container.appendChild(mdSec('Class roster', '<span class="reqs">TCH-06/07 · FAM-01…12 · PTC-06</span>'));

    let table = '<div class="report-table-wrap"><table class="report-table"><thead><tr>' +
      '<th>Child</th><th>Today</th><th>Att %</th><th>Guardian occupation</th><th>Languages at home</th>' +
      '<th>Income band</th><th>Home activity</th><th>Profile</th></tr></thead><tbody>';

    SAMPLE_STUDENTS.forEach((name, i) => {
      const f = fams[i];
      const present = sampleRand(name + 'today') > 0.1;
      const attPct = Math.round(70 + sampleRand(name + 'att') * 28);
      const homeStatus = sampleHomeActStatus(name);
      const homePill = homeStatus === 'done' ? mdPill('Done', 'good')
        : homeStatus === 'partly done' ? mdPill('Partly', 'warn')
        : homeStatus === 'not done' ? mdPill('Not done', 'crit')
        : mdPill('Not asked', 'neu');
      table += `<tr style="cursor:pointer;" onclick="switchSidebarSection('familyparents')">
        <td><b>${esc(name)}</b></td>
        <td>${present ? mdPill('Present', 'good') : mdPill('Absent', 'crit')}</td>
        <td>${attPct}</td>
        <td class="dim">${esc(f.guardians[0].occ)} / ${esc(f.guardians[1].occ)}</td>
        <td>${esc(f.langs.join(', '))}${f.reads ? '' : ' <span class="pill warn">no literate adult</span>'}</td>
        <td class="dim">${esc(f.income)}</td>
        <td>${homePill}</td>
        <td><div class="meter" style="width:52px"><i style="width:${f.complete}%"></i></div></td>
      </tr>`;
    });
    table += '</tbody></table></div>';

    const wrap = document.createElement('div'); wrap.innerHTML = table;
    container.appendChild(mdCard(null, 'Household income and full address are suppressed from exports by default (DAT-36). Tap a row to open the family profile.', wrap));
  }


  // ---------- 2. CLASS PROGRESS ----------
  // Matches the real prototype's vTeacherProgress structure — same
  // tile set and the same E/P/A tier grid per child per domain. The
  // underlying SRI/CPI/ARI formulas and dumbbell/stack charts from the
  // original are NOT reproduced (they depend on a full assessment
  // history this app doesn't have yet) — tile numbers here are sample
  // data shaped to look the same, not the real formula output.
  const TIER_INFO = { E: {n:'Emerging', c:'crit'}, P: {n:'Proficient', c:'warn'}, A: {n:'Advanced', c:'good'} };
  // The real assessment domains (ASM screens) — 10 developmental
  // domains, DIFFERENT from the app's existing DOMAINS array (which is
  // the 8 time-of-day session slots for My Day/Daily Plan). Matches
  // the prototype's own column headers exactly: HEAL PHYS SENS ENVI
  // EMOT PART LOGI MATH LANG ARTS.
  const ASSESSMENT_DOMAINS = [
    {key:'heal', label:'HEAL', full:'Health'},
    {key:'phys', label:'PHYS', full:'Physical'},
    {key:'sens', label:'SENS', full:'Sensory'},
    {key:'envi', label:'ENVI', full:'Environmental awareness'},
    {key:'emot', label:'EMOT', full:'Emotional'},
    {key:'part', label:'PART', full:'Participation'},
    {key:'logi', label:'LOGI', full:'Logical / cognitive'},
    {key:'math', label:'MATH', full:'Numeracy'},
    {key:'lang', label:'LANG', full:'Language'},
    {key:'arts', label:'ARTS', full:'Creative arts'}
  ];
  // Tap-to-open-popup grading: tapping a domain cell's badge opens a
  // small popup with 3 direct buttons (E/P/A) — 2 taps total, but the
  // cell itself stays compact (matters here since each row has 10 of
  // these). openAssessmentPopupKey tracks which single cell's popup is
  // open at a time; the whole table re-renders on every interaction,
  // same pattern as the rest of this screen.
  let openAssessmentPopupKey = null; // 'studentName|domainKey', or null
  function assessmentTierCell(name, domainKey, recorded, tier){
    const cellKey = name + '|' + domainKey;
    const isOpen = openAssessmentPopupKey === cellKey;
    const badgeHtml = recorded
      ? `<span onclick="toggleAssessmentPopup('${name}','${domainKey}')" class="pill ${TIER_INFO[tier].c}" style="cursor:pointer; display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; font-size:12px; font-weight:600;" title="${TIER_INFO[tier].n} — tap to change">${tier}</span>`
      : `<span onclick="toggleAssessmentPopup('${name}','${domainKey}')" class="dim" style="cursor:pointer; display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; border:1px dashed #0b0b0b55;" title="Not observed — tap to record">·</span>`;
    const popupHtml = isOpen ? `
      <div style="position:absolute; top:30px; left:50%; transform:translateX(-50%); z-index:20; background:#fff; border:1px solid #0b0b0b33; border-radius:8px; padding:4px; display:flex; gap:4px; box-shadow:0 4px 12px rgba(0,0,0,0.15); white-space:nowrap;">
        ${['E','P','A'].map(t => `<span onclick="setAssessmentTier('${name}','${domainKey}','${t}')" class="pill ${TIER_INFO[t].c}" style="cursor:pointer; width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; border-radius:6px; font-size:12px; font-weight:600;" title="${TIER_INFO[t].n}">${t}</span>`).join('')}
      </div>` : '';
    return `<td style="text-align:center; position:relative;">${badgeHtml}${popupHtml}</td>`;
  }
  function toggleAssessmentPopup(name, domainKey){
    const cellKey = name + '|' + domainKey;
    openAssessmentPopupKey = (openAssessmentPopupKey === cellKey) ? null : cellKey;
    renderMonthlyAssessment();
  }
  function setAssessmentTier(name, domainKey, tier){
    monthlyAssessmentEntries[name][domainKey] = tier;
    openAssessmentPopupKey = null;
    renderMonthlyAssessment();
  }

  function sampleTier(seed){ return samplePick(seed, ['E','P','A']); }

  function renderClassProgress(){
    const container = document.getElementById('classprogress-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderClassProgress);

    const classSRI = Math.round((72 + sampleRand('sri') * 20) * 10) / 10;
    const classCPI = Math.round((110 + sampleRand('cpi') * 60) * 10) / 10;
    const advancedPct = Math.round((18 + sampleRand('ari') * 30) * 10) / 10;
    const epConversion = Math.round((30 + sampleRand('ep') * 40) * 10) / 10;
    const paConversion = Math.round((20 + sampleRand('pa') * 30) * 10) / 10;
    const assessmentComplete = Math.round(60 + sampleRand('asmc') * 35);

    container.appendChild(mdSec('Class Progress', '<span class="reqs">ASM-02…04 · WBK-02</span>'));
    container.appendChild(mdGrid('g5', [
      mdTile('Class SRI', classSRI, '%', mdPill(mdStatusBand(classSRI).l, mdStatusBand(classSRI).c), 'SRI = (P+A) ÷ N × 100', mdMeter(classSRI)),
      mdTile('Class CPI', classCPI, '/200', mdPill(mdStatusBand(classCPI/2).l, mdStatusBand(classCPI/2).c), 'Σ Domain DSI ÷ 10', mdMeter(classCPI/2)),
      mdTile('Advanced', advancedPct, '%', mdPill('sample', 'info'), 'ARI = A ÷ N × 100', mdMeter(advancedPct)),
      mdTile('E → P conversion', epConversion, '%', mdPill('P→A ' + paConversion + '%', 'neu'), 'x ÷ E(SEM I) × 100', mdMeter(epConversion)),
      mdTile('Assessment complete', assessmentComplete, '%', mdPill(mdStatusBand(assessmentComplete).l, mdStatusBand(assessmentComplete).c), 'ASM-03 · children × domains', mdMeter(assessmentComplete))
    ]));

    container.appendChild(mdSec('Child by domain', '<span class="reqs">ASM-02…04 · WBK-02</span>'));
    let table = '<div class="report-table-wrap"><table class="report-table"><thead><tr><th>Child</th>' +
      ASSESSMENT_DOMAINS.map(d => `<th title="${esc(d.full)}">${esc(d.label)}</th>`).join('') + '<th>P+A</th><th>Band</th></tr></thead><tbody>';
    SAMPLE_STUDENTS.forEach(name => {
      const tiers = ASSESSMENT_DOMAINS.map(d => sampleTier(name + d.key + 'tier'));
      const paCount = tiers.filter(t => t !== 'E').length;
      const cells = ASSESSMENT_DOMAINS.map((d, j) => {
        const tier = tiers[j];
        return `<td><span class="pill ${TIER_INFO[tier].c}" title="${TIER_INFO[tier].n}">${tier}</span></td>`;
      }).join('');
      table += `<tr><td><b>${esc(name)}</b></td>${cells}<td>${paCount}/${ASSESSMENT_DOMAINS.length}</td><td>${mdPill(mdStatusBand(paCount/ASSESSMENT_DOMAINS.length*100).l, mdStatusBand(paCount/ASSESSMENT_DOMAINS.length*100).c)}</td></tr>`;
    });
    table += '</tbody></table></div>';
    const wrap = document.createElement('div'); wrap.innerHTML = table;
    container.appendChild(mdCard(null, 'E Emerging · P Proficient · A Advanced. Sample data — the real dumbbell/stack charts from the prototype need a full assessment history this app doesn\'t track yet.', wrap));
  }


  // ---------- 3. ATTENDANCE REGISTER ----------
  // Matches the real prototype's vTeacherRegister: same 4 tiles, same
  // day-by-day register table (P/A marks + totals), same caption.
  // Sample data — real streak/threshold detection needs a real
  // attendance history this app doesn't store long-term yet.
  function renderAttendanceRegister(){
    const container = document.getElementById('attendanceregister-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderAttendanceRegister);
    const teachingDays = 22;
    const rows = SAMPLE_STUDENTS.map(name => {
      const marks = Array.from({length: teachingDays}, (_, i) => sampleRand(name + 'reg' + i) > 0.12 ? 'P' : 'A');
      const pres = marks.filter(m => m === 'P').length;
      let run = 0, maxRun = 0;
      marks.forEach(m => { run = m === 'A' ? run + 1 : 0; maxRun = Math.max(maxRun, run); });
      return { name, marks, pres, pct: Math.round(pres / teachingDays * 100), maxRun };
    });
    const classAvg = Math.round(rows.reduce((a, r) => a + r.pct, 0) / rows.length * 10) / 10;
    const below60 = rows.filter(r => r.pct < 60).length;
    const threeOrMore = rows.filter(r => r.maxRun >= 3).length;

    container.appendChild(mdSec('Attendance Register — this month', '<span class="reqs">REG-01…04 · printable</span>'));
    container.appendChild(mdGrid('g4', [
      mdTile('Class attendance', classAvg, '%', mdPill(mdStatusBand(classAvg).l, mdStatusBand(classAvg).c), 'month average', mdMeter(classAvg)),
      mdTile('Teaching days', teachingDays, 'this month', mdPill('holidays excluded', 'info'), 'LPC-11 · holiday calendar'),
      mdTile('Children below 60%', below60, 'flagged', mdPill('follow-up required', 'warn'), 'REG-06'),
      mdTile('Three or more absences', threeOrMore, 'children', mdPill('consecutive', 'crit'), 'REG-06 · early warning')
    ]));

    let table = '<div class="report-table-wrap"><table class="report-table"><thead><tr><th>Child</th>' +
      Array.from({length: teachingDays}, (_, i) => `<th>${i+1}</th>`).join('') + '<th>P</th><th>A</th><th>%</th></tr></thead><tbody>';
    rows.forEach(r => {
      const cells = r.marks.map(m => `<td style="text-align:center;">${m === 'P' ? '<span class="pill good">P</span>' : '<span class="pill crit">A</span>'}</td>`).join('');
      table += `<tr><td><b>${esc(r.name)}</b></td>${cells}<td>${r.pres}</td><td>${teachingDays - r.pres}</td><td><b>${r.pct}</b></td></tr>`;
    });
    table += '</tbody></table></div>';
    const wrap = document.createElement('div'); wrap.innerHTML = table;
    container.appendChild(mdCard(null, 'Laid out as an education officer would expect: school, class, teacher, month and totals in the header when printed (REG-04).', wrap));
  }

  // ---------- 4. MY COMPLIANCE ----------
  // Matches vTeacherCompliance: the same ten compliance dimensions
  // shown separately (never combined into one score), plus data
  // freshness / training record / open supervisor actions cards.
  // The real chBars bar-chart widget isn't reproduced — shown as tiles
  // + a simple list instead, same numbers, simpler chrome.
  const COMPLIANCE_DIMENSIONS = ['Daily plan', 'TLM plan', 'Attendance register', 'Assessment', 'Home activity', 'PTM prep', 'Monthly Effective', 'Photo evidence', 'Materials logged', 'Training attendance'];
  function renderMyCompliance(){
    const container = document.getElementById('mycompliance-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderMyCompliance);
    const dims = COMPLIANCE_DIMENSIONS.map(k => ({ k, v: Math.round(55 + sampleRand(k + 'comp') * 42) }));

    container.appendChild(mdSec('What my supervisor sees', '<span class="reqs">TCM-01…12</span>'));
    container.appendChild(mdCard(null, 'The same ten dimensions as the supervisor\u2019s view. Deliberately shown as dimensions, never combined into one ranked score \u2014 the dimensions are not equally within a teacher\u2019s control (RPT-15).',
      (() => { const d = document.createElement('div'); d.className = 'list';
        d.innerHTML = dims.map(x => `<div class="row"><div class="t"><b>${esc(x.k)}</b></div><div>${mdPill(x.v + '%', mdStatusBand(x.v).c)}</div></div>`).join('');
        return d; })()));

    container.appendChild(mdGrid('g4', dims.slice(0, 4).map(d => mdTile(d.k, d.v, '%', mdPill(mdStatusBand(d.v).l, mdStatusBand(d.v).c), '', mdMeter(d.v, mdStatusBand(d.v).c)))));

    container.appendChild(mdGrid('g3', [
      mdCard('Data freshness', 'TCM-11 · an unrecorded value is never shown as a zero.',
        (() => { const d = document.createElement('div'); d.className = 'list';
          d.innerHTML = ['Daily plan — updated today', 'Assessment — updated 3 days ago', 'Workbooks — updated 6 days ago', 'Home activity — updated today']
            .map(x => `<div class="row"><div class="t"><b>${esc(x.split(' — ')[0])}</b><span>${esc(x.split(' — ')[1])}</span></div></div>`).join('');
          return d; })()),
      mdCard('My training record', 'TRN-08 · forms a professional development record.',
        (() => { const d = document.createElement('div'); d.className = 'list';
          d.innerHTML = [['Classroom management basics', 'Attended'], ['Using the Jadui Pitara kit', 'Attended'], ['Parent engagement techniques', 'Did not attend']]
            .map(([topic, status]) => `<div class="row"><div class="t"><b>${esc(topic)}</b></div><div>${mdPill(status, status === 'Attended' ? 'good' : 'warn')}</div></div>`).join('');
          return d; })()),
      mdCard('Open actions from my last visit', 'SVR-14 · reviewed at the next visit.',
        (() => { const d = document.createElement('div'); d.className = 'list';
          d.innerHTML = [['Display the weekly plan where parents can see it', 'Due in 4 days'], ['Use the number cards in every numeracy session', 'Due in 11 days']]
            .map(([a, b]) => `<div class="row"><div class="t"><b>${esc(a)}</b><span>${esc(b)}</span></div><div>${mdPill('Open', 'warn')}</div></div>`).join('');
          return d; })())
    ]));
  }

  // ---------- 5. FAMILY & PARENTS ----------
  // Matches vTeacherFamily: a child picker, a "Household" card (kv
  // list) and a "Parents and guardians" card, plus consent pills.
  const HOUSEHOLD_SKILLS = ['Tailoring', 'Cooking', 'Driving', 'Masonry', 'Farming'];
  const HOME_RESOURCES = ['Smartphone', 'Radio', 'Television', 'Books at home', 'None of these'];
  function sampleHousehold(name){
    const f = sampleFamily(name);
    const familyStructure = samplePick(name + 'fstruct', ['Two parents', 'Single parent', 'Guardian']);
    return Object.assign(f, {
      locality: samplePick(name + 'loc', ['Ambedkar Nagar', 'Kamgar Vasahat', 'Shanti Nagar', 'Ganesh Nagar']),
      walk: 5 + Math.floor(sampleRand(name + 'walk') * 20),
      skills: [samplePick(name + 'sk1', HOUSEHOLD_SKILLS), samplePick(name + 'sk2', HOUSEHOLD_SKILLS)],
      res: [samplePick(name + 'res1', HOME_RESOURCES)],
      siblings: Math.floor(sampleRand(name + 'sib') * 3),
      familyStructure,
      maritalStatus: familyStructure === 'Two parents' ? 'Married' : samplePick(name + 'marstat', ['Single', 'Married']),
      motherTongue: samplePick(name + 'mt', ['Hindi', 'Marathi', 'Telugu', 'Bhojpuri', 'Gujarati']),
      annualIncome: Math.round((30000 + sampleRand(name + 'annincome') * 150000) / 1000) * 1000,
      guardianNames: [{name: 'Mrs. ' + name.split(' ')[1], rel: 'Mother', edu: samplePick(name+'edu1', ['No formal education','Primary school','Secondary school']), phone: '98'+String(Math.floor(sampleRand(name+'ph1')*90000000)+10000000), smart: sampleRand(name+'sm1')>0.4, primary: true},
                      {name: 'Mr. ' + name.split(' ')[1], rel: 'Father', edu: samplePick(name+'edu2', ['No formal education','Primary school','Secondary school']), phone: '98'+String(Math.floor(sampleRand(name+'ph2')*90000000)+10000000), smart: sampleRand(name+'sm2')>0.4, primary: false}]
    });
  }
  function renderFamilyParents(selectedName){
    const container = document.getElementById('familyparents-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderFamilyParents);
    const name = selectedName || SAMPLE_STUDENTS[0];
    const f = sampleHousehold(name);

    const pick = document.createElement('div'); pick.className = 'fbar';
    pick.innerHTML = `<div class="ctl"><label>Child</label><select id="famChildSel" style="padding:6px 10px; border:1px solid #0b0b0b33; border-radius:6px;"></select></div>
      <div class="grow" style="flex:1;"></div>
      <div>${f.consent ? mdPill('Consent recorded', 'good') : mdPill('Consent not recorded', 'crit')}
      ${f.photoConsent ? mdPill('Photo consent', 'good') : mdPill('No photo consent', 'warn')}</div>`;
    container.appendChild(pick);
    const sel = pick.querySelector('#famChildSel');
    SAMPLE_STUDENTS.forEach(n => {
      const opt = document.createElement('option'); opt.value = n; opt.textContent = n;
      if(n === name) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = () => renderFamilyParents(sel.value);

    const g = document.createElement('div'); g.className = 'g g2';
    const householdBody = document.createElement('dl'); householdBody.className = 'kv';
    householdBody.innerHTML = `
      <dt>Locality</dt><dd>${esc(f.locality)}</dd>
      <dt>Walk to school</dt><dd>${f.walk} minutes</dd>
      <dt>Family structure</dt><dd>${esc(f.familyStructure)}${f.familyStructure !== 'Guardian' ? ' · ' + esc(f.maritalStatus) : ''}</dd>
      <dt>Mother tongue</dt><dd>${esc(f.motherTongue)}</dd>
      <dt>Annual income</dt><dd>₹${f.annualIncome.toLocaleString('en-IN')} <span class="pill neu">exact — internal only, DAT-36 suppresses this on exports</span></dd>
      <dt>Income band</dt><dd>${esc(f.income)} <span class="pill neu">band shown elsewhere — FAM-05</span></dd>
      <dt>Languages at home</dt><dd>${esc(f.langs.join(', '))}</dd>
      <dt>Adult reads programme language</dt><dd>${f.reads ? 'Yes' : '<b>No</b> — guidance must be audio or pictorial (PTC-05)'}</dd>
      <dt>Household skills</dt><dd>${esc(f.skills.join(', '))}</dd>
      <dt>Home resources</dt><dd>${esc(f.res.join(', '))}</dd>
      <dt>Siblings in programme</dt><dd>${f.siblings}</dd>
      <dt>Profile completeness</dt><dd>${f.complete}%</dd>`;
    g.appendChild(mdCard('Household — ' + name, 'FAM-01 · one household per child; siblings share it.', householdBody));

    const guardianList = document.createElement('div'); guardianList.className = 'list';
    guardianList.innerHTML = f.guardianNames.map((gd, i) => `<div class="row"><div class="t"><b>${esc(gd.name)} · ${esc(gd.rel)}</b><span>${esc(f.guardians[i].occ)} · ${esc(gd.edu)} · ${esc(gd.phone)}</span></div>
      <div>${gd.smart ? mdPill('Smartphone', 'good') : mdPill('Basic phone', 'warn')} ${gd.primary ? mdPill('Primary', 'info') : ''}</div></div>`).join('');
    g.appendChild(mdCard('Parents and guardians', 'FAM-02…04 · occupation and education on controlled lists.', guardianList));
    container.appendChild(g);
  }

  // ---------- 6. CHECK ATTENDANCE ----------
  // Matches vTeacherAttCheck: a fuller monthly register than the plain
  // Attendance Register — distinguishes "not yet admitted" (dot) from
  // "no register taken yet" (dash) from actual P/A marks, plus a
  // footer row of daily present-of-roll totals.
  function renderCheckAttendance(){
    const container = document.getElementById('checkattendance-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderCheckAttendance);
    const teachingDays = 22;
    const enrolled = SAMPLE_STUDENTS.length;
    const rows = SAMPLE_STUDENTS.map((name, i) => {
      const admittedFrom = (i === SAMPLE_STUDENTS.length - 1) ? Math.floor(teachingDays * 0.4) : 0; // last child = a mid-month admission, for realism
      const marks = Array.from({length: teachingDays}, (_, d) => {
        if(d < admittedFrom) return '·';
        return sampleRand(name + 'chk' + d) > 0.1 ? 'P' : 'A';
      });
      const markedDays = marks.filter(m => m !== '·').length;
      const pres = marks.filter(m => m === 'P').length;
      return { name, marks, pres, markedDays, pct: markedDays ? Math.round(pres / markedDays * 100) : null };
    });
    const ada = Math.round(rows.reduce((a, r) => a + r.pres, 0) / teachingDays * 10) / 10;
    const overallPct = Math.round(rows.reduce((a, r) => a + (r.pct || 0), 0) / rows.length);
    const below70 = rows.filter(r => r.pct !== null && r.pct < 70).length;

    container.appendChild(mdSec('Check Attendance — this month', '<span class="reqs">REG-15 · CAL-13</span>'));
    container.appendChild(mdGrid('g4', [
      mdTile('On roll', enrolled, 'end of month', mdPill('+1 this month', 'info'), 'ADB-12'),
      mdTile('Average daily attendance', ada, 'children', mdPill('the effective strength', 'good'), 'ADB-14', mdMeter(ada / enrolled * 100)),
      mdTile('Attendance', overallPct, '% present', mdPill(mdStatusBand(overallPct).l, mdStatusBand(overallPct).c), 'REG-05', mdMeter(overallPct)),
      mdTile('Below 70%', below70, 'children', mdPill('follow-up list', 'warn'), 'REG-06')
    ]));

    let table = '<div class="report-table-wrap"><table class="report-table"><thead><tr><th>Child</th>' +
      Array.from({length: teachingDays}, (_, i) => `<th>${i+1}</th>`).join('') + '<th>%</th></tr></thead><tbody>';
    rows.forEach(r => {
      const cells = r.marks.map(m => {
        if(m === '·') return '<td style="text-align:center;" title="not yet admitted"><span class="dim">·</span></td>';
        return `<td style="text-align:center;">${m === 'P' ? '<span class="pill good">P</span>' : '<span class="pill crit">A</span>'}</td>`;
      }).join('');
      table += `<tr><td><b>${esc(r.name)}</b></td>${cells}<td><b>${r.pct === null ? '—' : r.pct + '%'}</b></td></tr>`;
    });
    table += '</tbody></table></div>';
    const wrap = document.createElement('div'); wrap.innerHTML = table;
    container.appendChild(mdCard(null, 'A dot is a day before that child was admitted — not an absence, and excluded from her denominator (ADB-13).', wrap));
  }

  // ---------- 7. ADMISSIONS ----------
  // Matches vTeacherAdmissions: on-roll/June-start/mid-year/no-baseline
  // tiles, an explanatory note, a month-by-month roll curve (as a
  // simple list, not the real bar chart), and the every-admission table.
  function sampleAdmissionExtra(name){
    return {
      dob: samplePick(name + 'dob', ['12-04-2022', '03-09-2021', '27-01-2022', '18-06-2021', '09-11-2022']),
      age: 3 + Math.floor(sampleRand(name + 'age') * 2),
      gender: samplePick(name + 'gender', ['Female', 'Male']),
      address: samplePick(name + 'addr', ['Ambedkar Nagar, Sion', 'Kamgar Vasahat, Sion', 'Shanti Nagar, Wadala', 'Ganesh Nagar, Wadala']),
      speciallyAbled: sampleRand(name + 'sabled') > 0.92,
      previouslyStudied: sampleRand(name + 'prev') > 0.6 ? samplePick(name + 'prevwhere', ['Anganwadi', 'Private preschool']) : 'None'
    };
  }

  function renderAdmissions(){
    const container = document.getElementById('admissions-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderAdmissions);
    const juneStart = SAMPLE_STUDENTS.length - 1;
    const midYear = [{ name: 'Meher Khan', month: 'Aug 2026', baseline: false, how: 'Family moved into the area' }];
    const total = juneStart + midYear.length;
    const noBaseline = midYear.filter(a => !a.baseline);

    container.appendChild(mdSec('Admissions', '<span class="reqs">ADB-11…16</span>'));
    container.appendChild(mdGrid('g4', [
      mdTile('On roll now', total, 'children', mdPill('Jr KG', 'neu'), 'ADB-11'),
      mdTile('Admitted at the start', juneStart, 'in June', mdPill(mdStatusBand(juneStart/total*100, 70, 50).l, mdStatusBand(juneStart/total*100, 70, 50).c), 'ADB-11', mdMeter(juneStart/total*100)),
      mdTile('Admitted during the year', midYear.length, 'after June', mdPill(Math.round(midYear.length/total*100) + '% of the class', 'info'), 'ADB-12', mdMeter(midYear.length/total*100)),
      mdTile('Without a baseline', noBaseline.length, 'mid-year admissions', noBaseline.length ? mdPill('ADB-15 breached', 'crit') : mdPill('All baselined', 'good'), 'ADB-15')
    ]));

    container.appendChild(mdCard('Why this screen exists',
      'The roll is not a number set in June. Children arrive all year — families move into the area, a child turns four, an anganwadi refers one across. Every attendance, assessment and curriculum figure has a denominator that changes underneath it, and a portal that stores one enrolment count will report all of them wrongly for the rest of the year.', null));

    container.appendChild(mdSec('Every admission', '<span class="reqs">ADB-16 · REG-16</span>'));
    const allAdmissions = SAMPLE_STUDENTS.slice(0, juneStart).map(n => ({ name: n, month: 'Jun 2026', baseline: true, how: 'Start of year' })).concat(midYear);

    let table = '<div class="report-table-wrap"><table class="report-table"><thead><tr>' +
      '<th>Child</th><th>Admitted</th><th>Standard</th><th>DOB (Age)</th><th>Gender</th><th>Address</th><th>Previously studied</th><th>Specially abled</th><th>Baseline</th></tr></thead><tbody>';
    allAdmissions.forEach(a => {
      const extra = sampleAdmissionExtra(a.name);
      table += `<tr>
        <td><b>${esc(a.name)}</b></td>
        <td>${esc(a.month)} · ${esc(a.how)}</td>
        <td>Jr KG</td>
        <td>${esc(extra.dob)} (${extra.age})</td>
        <td>${esc(extra.gender)}</td>
        <td class="dim">${esc(extra.address)}</td>
        <td>${esc(extra.previouslyStudied)}</td>
        <td>${extra.speciallyAbled ? mdPill('Yes', 'info') : 'No'}</td>
        <td>${a.baseline ? mdPill('Done', 'good') : mdPill('Pending', 'warn')}</td>
      </tr>`;
    });
    table += '</tbody></table></div>';
    const wrap = document.createElement('div'); wrap.innerHTML = table;
    container.appendChild(mdCard(null, 'Workbooks and TLM entitlement follow the child\'s own admission date, not the June headcount.', wrap));
  }

  // ---------- 8. MONTHLY EFFECTIVE ----------
  // Matches vTeacherEffective: reporting-month tiles, an incomplete-
  // register warning, and "the return" as a computed line-item table
  // rather than a form to fill in by hand.
  function renderMonthlyEffective(){
    const container = document.getElementById('monthlyeffective-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderMonthlyEffective);
    const dueDay = 25;
    const today = new Date().getDate();
    const registerMarked = 19, studentDays = 22;
    const unmarkedDays = studentDays - registerMarked;
    const enrolled = SAMPLE_STUDENTS.length;
    const ada = Math.round((enrolled * 0.88) * 10) / 10;

    container.appendChild(mdSec('Monthly Effective Return', '<span class="reqs">EFF-02…06</span>'));
    container.appendChild(mdGrid('g4', [
      mdTile('Reporting month', new Date().toLocaleDateString([], {month:'long'}), new Date().getFullYear() + ' · Jr KG', mdPill(dueDay - today > 0 ? 'Not yet due' : 'Overdue', dueDay - today > 0 ? 'neu' : 'crit'), 'EFF-02'),
      mdTile('Due to my supervisor', dueDay - today > 0 ? (dueDay - today) + ' days left' : 'Overdue', 'the 25th, or the last school day before it', mdPill(dueDay - today > 0 ? 'Not yet due' : 'Overdue', dueDay - today > 0 ? 'neu' : 'crit'), 'EFF-03'),
      mdTile('Effective strength', Math.round(ada/enrolled*100*10)/10, '%', mdPill(ada + ' of ' + enrolled + ' children', 'neu'), 'ADB-14', mdMeter(ada/enrolled*100)),
      mdTile('Register complete', registerMarked, 'of ' + studentDays + ' days', unmarkedDays ? mdPill(unmarkedDays + ' days open', 'crit') : mdPill('Complete', 'good'), 'REG-04', mdMeter(registerMarked/studentDays*100))
    ]));

    if(unmarkedDays){
      container.appendChild(mdCard('The register for this month is not complete',
        unmarkedDays + ' of ' + studentDays + ' student days have no register. EFF-06 will not let the Effective be submitted on an incomplete register — every figure below is computed on ' + registerMarked + ' days, and submitting it would put a number on the MCGM file that nobody can reproduce.', null));
    }

    container.appendChild(mdSec('The return', '<span class="reqs">EFF-05</span>'));
    const linesWrap = document.createElement('div'); linesWrap.className = 'list';
    linesWrap.innerHTML = [
      ['Children on roll at month end', enrolled, ''],
      ['Average daily attendance', ada, 'children'],
      ['Workbook completion (class average)', '61', '%'],
      ['TLM usage verified', 'Yes', '']
    ].map(([k, v, unit]) => `<div class="row"><div class="t"><b>${esc(k)}</b></div><div>${esc(String(v))} ${esc(unit)}</div></div>`).join('');
    container.appendChild(mdCard('What the portal will print', 'Every line is computed from what has already been entered this month, and names the requirement it comes from. Nothing here is typed twice — the point of the return is the signature, not the arithmetic.', linesWrap));

    const btn = document.createElement('button');
    btn.className = 'btn-primary'; btn.style.cssText = 'width:auto; padding:10px 20px; margin-top:14px;';
    btn.textContent = 'Sign & submit this month\'s return';
    btn.onclick = () => { btn.textContent = '✓ Submitted (not yet backed by a real endpoint)'; btn.disabled = true; };
    container.appendChild(btn);
  }

  // ---------- 9. MONTHLY ASSESSMENT ----------
  // Matches vClassAssess EXACTLY as screenshotted: Child / Att% / 10
  // domain columns (HEAL PHYS SENS ENVI EMOT PART LOGI MATH LANG ARTS)
  // / Rec (x of 10 recorded) / Moved (verdict pill). A blank cell means
  // "not observed this month" — shown as a dim dot, never as Emerging.
  const monthlyAssessmentEntries = {}; // studentName -> {domainKey: 'E'|'P'|'A'|null} — in-memory only
  function renderMonthlyAssessment(){
    const container = document.getElementById('monthlyassessment-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderMonthlyAssessment);

    SAMPLE_STUDENTS.forEach(name => {
      if(!monthlyAssessmentEntries[name]){
        monthlyAssessmentEntries[name] = {};
        ASSESSMENT_DOMAINS.forEach(d => {
          const recorded = sampleRand(name + d.key + 'rec') > 0.1; // ~90% of cells recorded, a few blank
          monthlyAssessmentEntries[name][d.key] = recorded ? samplePick(name + d.key + 'ma', ['E','P','A']) : null;
        });
      }
    });

    const totalCells = SAMPLE_STUDENTS.length * ASSESSMENT_DOMAINS.length;
    let recordedCells = 0;
    const tot = {E:0,P:0,A:0};
    SAMPLE_STUDENTS.forEach(name => ASSESSMENT_DOMAINS.forEach(d => {
      const v = monthlyAssessmentEntries[name][d.key];
      if(v){ recordedCells++; tot[v]++; }
    }));
    const completeness = Math.round(recordedCells / totalCells * 100);
    const dsi = Math.round(((tot.A*3 + tot.P*2 + tot.E*1) / (3 * recordedCells) * 200) * 10) / 10;
    const sriPct = Math.round((tot.P + tot.A) / recordedCells * 100);
    const noMovementCount = SAMPLE_STUDENTS.filter(name => {
      const eCount = ASSESSMENT_DOMAINS.filter(d => monthlyAssessmentEntries[name][d.key] === 'E').length;
      return eCount < 5;
    }).length;

    container.appendChild(mdSec('Monthly Assessment', '<span class="reqs">ASM-11…14</span>'));
    container.appendChild(mdGrid('g5', [
      mdTile('Month', new Date().toLocaleDateString([], {month:'long'}), new Date().getFullYear() + ' · semester I', mdPill('Open for recording', 'info'), 'ASM-11'),
      mdTile('Recording complete', completeness, '% of cells', mdPill(mdStatusBand(completeness, 90, 70).l, mdStatusBand(completeness, 90, 70).c), 'ASM-13', mdMeter(completeness)),
      mdTile('Class DSI', dsi, 'of 200', mdPill(mdStatusBand(dsi/2).l, mdStatusBand(dsi/2).c), 'DSI', mdMeter(dsi/2)),
      mdTile('At Proficient or above', sriPct, '% SRI', mdPill(mdStatusBand(sriPct).l, mdStatusBand(sriPct).c), 'SRI', mdMeter(sriPct)),
      mdTile('Children with no movement', noMovementCount, 'of ' + SAMPLE_STUDENTS.length, noMovementCount > SAMPLE_STUDENTS.length/3 ? mdPill('Look at the teaching', 'crit') : mdPill('Expected at this point', 'neu'), 'ASM-17')
    ]));

    if(completeness < 100){
      container.appendChild(mdCard((totalCells - recordedCells) + ' of ' + totalCells + ' observations not recorded this month',
        'ASM-13 asks for them by the 5th of next month. Every figure above is computed only on what is recorded, so an incomplete month reads better than it is.', null));
    }

    container.appendChild(mdSec('Every child against every domain', '<span class="reqs">ASM-12…14</span>'));
    let table = '<div class="report-table-wrap"><table class="report-table"><thead><tr><th>Child</th><th>Att %</th>' +
      ASSESSMENT_DOMAINS.map(d => `<th title="${esc(d.full)}">${esc(d.label)}</th>`).join('') + '<th>Rec</th><th>Moved</th></tr></thead><tbody>';
    SAMPLE_STUDENTS.forEach(name => {
      const attPct = Math.round(sampleRand(name + 'asmatt') * 100);
      const cells = ASSESSMENT_DOMAINS.map(d => {
        const tier = monthlyAssessmentEntries[name][d.key];
        return assessmentTierCell(name, d.key, !!tier, tier);
      }).join('');
      const recCount = ASSESSMENT_DOMAINS.filter(d => monthlyAssessmentEntries[name][d.key]).length;
      const eCount = ASSESSMENT_DOMAINS.filter(d => monthlyAssessmentEntries[name][d.key] === 'E').length;
      const movedPill = eCount >= 5 ? mdPill('Needs support', 'crit') : mdPill('No movement', 'warn');
      const attBand = mdStatusBand(attPct, 85, 50); // green ≥85, amber ≥50, red below — matches real screenshot's banding, not the app's usual 85/70
      table += `<tr><td><b>${esc(name)}</b></td><td>${mdPill(String(attPct), attBand.c)}</td>${cells}<td>${recCount}/${ASSESSMENT_DOMAINS.length}</td><td>${movedPill}</td></tr>`;
    });
    table += '</tbody></table></div>';
    const wrap = document.createElement('div'); wrap.innerHTML = table;
    container.appendChild(mdCard(null, 'Tap a cell to open E / P / A and pick the exact tier. A blank cell (·) has not been observed this month and is not counted anywhere — ASM-14 will not let a blank be read as Emerging, because "I have not looked" and "she cannot do it yet" are different findings.', wrap));
  }

  // ---------- 10. CHILD RECORD ----------
  // Matches vStudent: a child picker, DSI/SRI/movement/attendance/
  // stuck-domain tiles, and a domain-by-domain table with an
  // observation note per domain.
  function renderChildRecord(selectedName){
    const container = document.getElementById('childrecord-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderChildRecord);
    const name = selectedName || SAMPLE_STUDENTS[0];

    const selectWrap = document.createElement('div'); selectWrap.className = 'fbar';
    selectWrap.innerHTML = `<div class="ctl"><label>Child</label><select id="childRecordSelect" style="padding:6px 10px; border:1px solid #0b0b0b33; border-radius:6px;"></select></div>
      <div class="grow" style="flex:1;"></div><div class="cap">Roll ${SAMPLE_STUDENTS.indexOf(name)+1} of ${SAMPLE_STUDENTS.length} · Jr KG · Triveni Sangam Municipal School</div>`;
    container.appendChild(selectWrap);
    const sel = selectWrap.querySelector('#childRecordSelect');
    SAMPLE_STUDENTS.forEach(n => {
      const opt = document.createElement('option'); opt.value = n; opt.textContent = n;
      if(n === name) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.onchange = () => renderChildRecord(sel.value);

    const tiers = ASSESSMENT_DOMAINS.map(d => (monthlyAssessmentEntries[name] && monthlyAssessmentEntries[name][d.key]) || sampleTier(name+d.key+'tier'));
    const paCount = tiers.filter(t => t !== 'E').length;
    const dsi = Math.round((tiers.filter(t=>t==='A').length*3 + tiers.filter(t=>t==='P').length*2 + tiers.filter(t=>t==='E').length*1) / (3*ASSESSMENT_DOMAINS.length) * 200 * 10) / 10;
    const attMean = Math.round(70 + sampleRand(name + 'attmean') * 28);
    const stuck = tiers.filter(t => t === 'E').length > 2 ? 1 : 0;

    container.appendChild(mdGrid('g5', [
      mdTile('Domain Strength', dsi, 'of 200', mdPill(mdStatusBand(dsi/2).l, mdStatusBand(dsi/2).c), 'DSI', mdMeter(dsi/2)),
      mdTile('At Proficient or above', paCount, 'of ' + ASSESSMENT_DOMAINS.length + ' domains', mdPill(mdStatusBand(paCount/ASSESSMENT_DOMAINS.length*100).l, mdStatusBand(paCount/ASSESSMENT_DOMAINS.length*100).c), 'SRI', mdMeter(paCount/ASSESSMENT_DOMAINS.length*100)),
      mdTile('Moved up this term', stuck ? 0 : 2, 'domains', stuck ? mdPill('No movement', 'warn') : mdPill('Progressing', 'good'), 'ASM-22'),
      mdTile('Attendance', attMean, '% year to date', mdPill(mdStatusBand(attMean).l, mdStatusBand(attMean).c), 'REG-05', mdMeter(attMean)),
      mdTile('Still Emerging', tiers.filter(t=>t==='E').length, 'domains', tiers.filter(t=>t==='E').length>=3 ? mdPill('Needs a plan', 'crit') : mdPill('Watch', 'warn'), 'ASM-24')
    ]));

    container.appendChild(mdSec('Domain by domain', '<span class="reqs">ASM-21…23</span>'));
    let table = '<div class="report-table-wrap"><table class="report-table"><thead><tr><th>Domain</th><th>Last term</th><th>This term</th><th>Change</th></tr></thead><tbody>';
    ASSESSMENT_DOMAINS.forEach((d, i) => {
      const prevTier = sampleTier(name + d.key + 'prevtier');
      const curTier = tiers[i];
      const w = {E:1,P:2,A:3};
      const up = w[curTier] > w[prevTier];
      table += `<tr><td><b>${esc(d.full)}</b></td>
        <td><span class="pill ${TIER_INFO[prevTier].c}">${prevTier}</span></td>
        <td><span class="pill ${TIER_INFO[curTier].c}">${curTier}${up ? ' ↑' : ''}</span></td>
        <td>${up ? mdPill('Up a tier', 'good') : mdPill('No change', 'neu')}</td></tr>`;
    });
    table += '</tbody></table></div>';
    const wrap = document.createElement('div'); wrap.innerHTML = table;
    container.appendChild(mdCard('Where ' + name.split(' ')[0] + ' is now, and where she was',
      'An arrow marks a tier gained since last term. E Emerging · P Proficient · A Advanced.', wrap));
  }

  // ---------- 12. TEACHER PROFILE ----------
  // New screen — no equivalent existed anywhere in the app before this.
  // Sample data for the currently logged-in teacher (Mrs. Sharma), same
  // deterministic-sample pattern as everything else. A real version of
  // this would read from users.* plus a new teacher_profile table —
  // neither of which exist yet.
  function sampleTeacherProfile(){
    return {
      name: 'Mrs. Sharma',
      qualification: 'D.El.Ed (Diploma in Elementary Education)',
      dob: '14-03-1991',
      age: 35,
      gender: 'Female',
      maritalStatus: 'Married',
      contactNormal: '98' + String(23456780),
      contactEmergency: '98' + String(76543210),
      experience: '6 years',
      languages: ['Hindi', 'Marathi', 'English'],
      address: 'Room 12, Kamgar Vasahat, Sion, Mumbai 400022',
      training: [
        { name: 'Classroom management basics', date: 'Apr 2026', cert: true },
        { name: 'Using the Jadui Pitara kit', date: 'Jun 2026', cert: true },
        { name: 'Parent engagement techniques', date: 'Jul 2026', cert: false }
      ]
    };
  }

  function renderTeacherProfile(){
    const container = document.getElementById('teacherprofile-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderTeacherProfile);
    const p = sampleTeacherProfile();

    container.appendChild(mdSec('Teacher Profile', '<span class="reqs">STF-01…08 · sample data</span>'));

    const g = document.createElement('div'); g.className = 'g g2';

    const basicsBody = document.createElement('dl'); basicsBody.className = 'kv';
    basicsBody.innerHTML = `
      <dt>Qualification</dt><dd>${esc(p.qualification)}</dd>
      <dt>Date of birth</dt><dd>${esc(p.dob)} (${p.age} years)</dd>
      <dt>Gender</dt><dd>${esc(p.gender)}</dd>
      <dt>Marital status</dt><dd>${esc(p.maritalStatus)}</dd>
      <dt>Experience</dt><dd>${esc(p.experience)}</dd>
      <dt>Languages spoken</dt><dd>${esc(p.languages.join(', '))}</dd>`;
    g.appendChild(mdCard('Basics', 'STF-01…04', basicsBody));

    const contactBody = document.createElement('dl'); contactBody.className = 'kv';
    contactBody.innerHTML = `
      <dt>Contact number (normal)</dt><dd>${esc(p.contactNormal)}</dd>
      <dt>Contact number (emergency)</dt><dd>${esc(p.contactEmergency)}</dd>
      <dt>Address</dt><dd>${esc(p.address)}</dd>`;
    g.appendChild(mdCard('Contact', 'STF-05', contactBody));

    container.appendChild(g);

    container.appendChild(mdSec('Activities / workshops done till date', '<span class="reqs">STF-06 · training certifications</span>'));
    const trainingList = document.createElement('div'); trainingList.className = 'list';
    trainingList.innerHTML = p.training.map(t => `<div class="row"><div class="t"><b>${esc(t.name)}</b><span>${esc(t.date)}</span></div>
      <div>${t.cert ? mdPill('Certified', 'good') : mdPill('Attended, no certificate', 'warn')}</div></div>`).join('');
    container.appendChild(mdCard(null, null, trainingList));
  }

  // ---------- 11. TRANSITION ----------
  // Matches vTransition: Jr KG → Sr KG promotion tiles + outcome
  // table, plus a Sr KG → Grade 1 readiness section.
  function renderTransition(){
    const container = document.getElementById('transition-body');
    container.innerHTML = '';
    renderTeacherFilterBar(container, renderTransition);

    const jrCount = 3, srCount = 2;
    const jrOutcomes = { promoted: 3, 'left the area': 0, 'needs tracing': 0 };
    const jrTotal = Object.values(jrOutcomes).reduce((a,b) => a+b, 0);
    const jrRate = Math.round(jrOutcomes.promoted / jrTotal * 100);
    const readyRate = 78, traced = 92;

    container.appendChild(mdSec('Transition — Jr KG to Sr KG', '<span class="reqs">BAL-09…12 · DAT-52</span>'));
    container.appendChild(mdGrid('g4', [
      mdTile('Jr KG children', jrCount, 'Balvatika 2', mdPill('1 school', 'neu'), 'BAL-09'),
      mdTile('Promoted to Sr KG', jrRate, '%', mdPill(mdStatusBand(jrRate, 92, 85).l, mdStatusBand(jrRate, 92, 85).c), 'BAL-10', mdMeter(jrRate)),
      mdTile('School Ready', readyRate, '% of Sr KG', mdPill(mdStatusBand(readyRate, 70, 50).l, mdStatusBand(readyRate, 70, 50).c), 'BAL-06', mdMeter(readyRate)),
      mdTile('Destination traced', traced, '% of Sr KG', mdPill(mdStatusBand(traced, 90, 75).l, mdStatusBand(traced, 90, 75).c), 'BAL-12', mdMeter(traced))
    ]));

    const outcomeList = document.createElement('div'); outcomeList.className = 'list';
    outcomeList.innerHTML = Object.entries(jrOutcomes).map(([k, v]) => `<div class="row"><div class="t"><b>${esc(k[0].toUpperCase() + k.slice(1))}</b></div>
      <div>${v} <span class="dim">(${Math.round(v/jrTotal*100)}%)</span> ${k === 'promoted' ? mdPill('Continued', 'good') : (k === 'left the area' ? mdPill('Migration', 'warn') : mdPill('Needs tracing', 'crit'))}</div></div>`).join('');
    container.appendChild(mdCard('What happened to last year\'s Balvatika 2', 'A child who does not appear in Sr KG has either left the area or been lost track of — migration and a programme failure are kept apart on purpose (BAL-10).', outcomeList));

    container.appendChild(mdSec('Sr KG → Grade 1', '<span class="reqs">BAL-06/12</span>'));
    container.appendChild(mdCard('Readiness of this year\'s Sr KG', 'Not a gate — records what the Grade 1 teacher is receiving so the transition can be planned, nothing here holds a child back.',
      (() => { const d = document.createElement('div'); d.className = 'list';
        d.innerHTML = `<div class="row"><div class="t"><b>Three or fewer domains at Emerging</b></div><div>${Math.round(srCount*readyRate/100)} children</div></div>
          <div class="row"><div class="t"><b>Four or more at Emerging</b></div><div>${srCount - Math.round(srCount*readyRate/100)} children</div></div>`;
        return d; })()));
  }



function renderPreviewBanner(isPreviewing){
  const el = document.getElementById('preview-banner');
  if(!el) return;
  el.innerHTML = isPreviewing ? `
    <div class="preview-banner">
      <span>👁️ Previewing as this role</span>
      <button onclick="returnToSuperAdmin()">Return to Super Admin</button>
    </div>` : '';
}

function returnToSuperAdmin(){
  fetch('backend/return_to_admin.php', { method: 'POST' })
    .then(r => r.json())
    .then(data => {
      if(data.status === 'success') window.location.href = 'superadmin.html';
    })
    .catch(() => {});
}