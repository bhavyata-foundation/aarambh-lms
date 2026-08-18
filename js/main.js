let selectedRole = 'teacher';
  let currentWeekNum = 1;
  let currentDay = 'mon';

  // weeksWithContent, WEEKS, WEEKLY_PLAN and ACTIVITY_COMPETENCIES now
  // live in js/data/curriculum-base.js and js/data/week-NN.js — those
  // files must load before this one. See curriculum-base.js for the
  // load-order explanation.

  const DAYS = [
    {key:'mon', label:'Monday', value:{en:'Feel safe and happy in classroom', hi:'कक्षा में सुरक्षित और खुश महसूस करें', mr:'वर्गात सुरक्षित आणि आनंदी वाटणे'}, link:{en:'First week of school', hi:'स्कूल का पहला सप्ताह', mr:'शाळेचा पहिला आठवडा'}},
    {key:'tue', label:'Tuesday', value:{en:'Keep bag, books, bottle clean and dry', hi:'बैग, किताबें, बोतल साफ़ और सूखी रखें', mr:'पिशवी, पुस्तके, बाटली स्वच्छ आणि कोरडी ठेवा'}, link:{en:'Monsoon readiness', hi:'मॉनसून की तैयारी', mr:'मॉन्सूनची तयारी'}},
    {key:'wed', label:'Wednesday', value:{en:'Share toys and speak kindly', hi:'खिलौने साझा करें और विनम्रता से बोलें', mr:'खेळणी वाटून घ्या आणि प्रेमाने बोला'}, link:{en:'Classroom family value', hi:'कक्षा परिवार मूल्य', mr:'वर्गकुटुंब मूल्य'}},
    {key:'thu', label:'Thursday', value:{en:'Keep things back in proper place', hi:'चीज़ों को सही जगह पर रखें', mr:'वस्तू योग्य ठिकाणी ठेवा'}, link:{en:'Clean classroom habit', hi:'साफ़ कक्षा की आदत', mr:'स्वच्छ वर्ग सवय'}},
    {key:'fri', label:'Friday', value:{en:'Be brave, careful and responsible', hi:'वीर, सावधान और ज़िम्मेदार बनें', mr:'शूर, सावध आणि जबाबदार राहा'}, link:{en:'Shivaji Maharaj courage value', hi:'शिवाजी महाराज वीरता मूल्य', mr:'शिवाजी महाराज शौर्य मूल्य'}}
  ];

  const DOMAINS = [
    {key:'welcome',  label:{en:'Welcome & Free Play', hi:'स्वागत और मुक्त खेल', mr:'स्वागत आणि मोकळा खेळ', gu:'સ્વાગત અને મુક્ત રમત'},   time:'9:00–9:20 AM',   cg:'CG-4',    h5p:true},
    {key:'story',    label:{en:'Story / Rhyme', hi:'कहानी / कविता', mr:'गोष्ट / कविता', gu:'વાર્તા / કવિતા'},          time:'9:20–9:45 AM',   cg:'CG-9',    h5p:true},
    {key:'numeracy', label:{en:'Numeracy', hi:'गणना', mr:'अंकगणित', gu:'ગણતરી'},                time:'9:45–10:15 AM',  cg:'CG-8',    h5p:true},
    {key:'language', label:{en:'Language', hi:'भाषा', mr:'भाषा', gu:'ભાષા'},                time:'10:25–10:50 AM', cg:'CG-10',   h5p:true},
    {key:'create',   label:{en:'Create + Fine Motor', hi:'सृजन + सूक्ष्म गतिविधि', mr:'सर्जन + सूक्ष्म हालचाल', gu:'સર્જન + સૂક્ષ્મ ગતિ'},     time:'10:50–11:20 AM', cg:'CG-12',   h5p:true},
    {key:'outdoor',  label:{en:'Outdoor / Gross Motor', hi:'बाहरी / सकल गतिविधि', mr:'बाह्य / स्थूल हालचाल', gu:'બાહ્ય / સ્થૂળ ગતિ'},   time:'11:20–11:40 AM', cg:'CG-3',    h5p:true},
    {key:'tidy',     label:{en:'Tidy & Put Away', hi:'सफ़ाई और व्यवस्थित करना', mr:'स्वच्छता आणि आवरणे', gu:'સ્વચ્છતા અને ગોઠવણી'},          time:'11:40–11:45 AM', cg:'CG-11',   h5p:true},
    {key:'reflect',  label:{en:'Reflect & Wrap', hi:'चिंतन और समापन', mr:'चिंतन आणि सांगता', gu:'ચિંતન અને સમાપન'},          time:'11:45 AM–12:00 PM', cg:'CG-9/10', h5p:true}
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

  function selectRole(role, el){
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
    el.classList.add('active');
  }

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

  function enterTeacherFlow(){
    const existing = getTodayAttendanceRecord();
    if(existing){
      showDashboardAfterAttendance(existing);
      return;
    }
    if(isPastGateTime()){
      document.getElementById('view-attendance').classList.remove('hidden');
    } else {
      document.getElementById('view-dashboard').classList.remove('hidden');
      updateAttendanceBannerPending();
      renderSidebar();
      openWeek(currentWeekNum);
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
    openWeek(currentWeekNum);
  }

async function login(){
  const emailEl = document.getElementById('loginEmail');
  const passwordEl = document.getElementById('loginPassword');
  const errorEl = document.getElementById('loginError');
  const btnEl = document.getElementById('loginBtn');

  const email = emailEl.value.trim();
  const password = passwordEl.value;

  errorEl.classList.add('hidden');
  errorEl.textContent = '';

  if(!email || !password){
    errorEl.textContent = 'Please enter both email and password.';
    errorEl.classList.remove('hidden');
    return;
  }

  btnEl.disabled = true;
  btnEl.textContent = 'Signing in…';

  try{
    const res = await fetch('backend/login.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    const data = await res.json();

    if(data.status !== 'success'){
      errorEl.textContent = data.message || 'Login failed. Please try again.';
      errorEl.classList.remove('hidden');
      btnEl.disabled = false;
      btnEl.textContent = 'Sign in';
      return;
    }

    // The role that actually matters is whatever the SERVER says this
    // account is — not whichever role button was clicked. This is what
    // stops someone from clicking "Super Admin" and getting in on a
    // teacher's credentials.
    selectedRole = data.role;

    if(selectedRole === 'teacher'){
      document.getElementById('view-login').classList.add('hidden');
      enterTeacherFlow();
    } else if(selectedRole === 'supervisor'){
      window.location.href = 'supervisor.html';
    } else if(selectedRole === 'superadmin'){
      window.location.href = 'superadmin.html';
    } else if(selectedRole === 'parent'){
      window.location.href = 'parent.html';
    } else {
      errorEl.textContent = 'This role is not wired up yet in this prototype.';
      errorEl.classList.remove('hidden');
      btnEl.disabled = false;
      btnEl.textContent = 'Sign in';
    }
  } catch(err){
    errorEl.textContent = 'Could not reach the server. Check your connection and try again.';
    errorEl.classList.remove('hidden');
    btnEl.disabled = false;
    btnEl.textContent = 'Sign in';
  }
}

function logout(){
  // Cancel any pending 12:30 gate timer — it shouldn't fire while logged out,
  // and a fresh login re-checks the gate correctly anyway.
  if(gateTimerId){ clearTimeout(gateTimerId); gateTimerId = null; }

  fetch('backend/logout.php').catch(() => {}); // best-effort — proceed regardless

  document.getElementById('view-attendance').classList.add('hidden');
  document.getElementById('view-dashboard').classList.add('hidden');
  document.getElementById('view-login').classList.remove('hidden');
  // Deliberately NOT clearing today's saved attendance record here —
  // logging back in the same day should still recognise it's already marked.
}

/* =========================================================
   DEV MODE — skip login entirely while iterating on the frontend.

   NOTE: the actual auto-run trigger for this now lives at the very
   END of this file, not here — it has to run AFTER every other
   variable in this file is declared (expandedWeek, attendanceRecords,
   etc.), otherwise it fires too early and hits a "cannot access
   before initialization" error. See the bottom of the file.

   On localhost, this runs AUTOMATICALLY on every page load — no
   click needed, so a reload during frontend work drops you straight
   onto the dashboard instead of back at the login screen.

   Defaults to the teacher dashboard. To test a different role:
     index.html?dev_role=supervisor
     index.html?dev_role=superadmin
     index.html?dev_role=parent
   To see the REAL login screen on localhost, add ?no_dev=1 to the
   URL — that one flag turns the auto-bypass off for that page load.
   ========================================================= */

function devSkipLogin(){
  // Respects whichever role tab is currently selected on the login card.
  document.getElementById('view-login').classList.add('hidden');
  if(selectedRole === 'teacher'){
    enterTeacherFlow();
  } else if(selectedRole === 'supervisor'){
    window.location.href = 'supervisor.html?dev_role=supervisor';
  } else if(selectedRole === 'superadmin'){
    window.location.href = 'superadmin.html?dev_role=superadmin';
  } else if(selectedRole === 'parent'){
    window.location.href = 'parent.html?dev_role=parent';
  }
}

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

  const attendanceRecords = {}; // key: date -> {studentName: 'present'|'absent'}
  let attendanceSaved = false;
  let attendanceSearchTerm = '';

  function todayKey(){ return new Date().toISOString().slice(0,10); }

  function switchSidebarSection(section){
    document.getElementById('navWorkbook').classList.toggle('active', section === 'workbook');
    document.getElementById('navAttendance').classList.toggle('active', section === 'attendance');
    document.getElementById('navCalendar').classList.toggle('active', section === 'calendar');
    document.getElementById('navEvents').classList.toggle('active', section === 'events');
    document.getElementById('sidebar-workbook-section').classList.toggle('hidden', section !== 'workbook');

    const labelEl = document.getElementById('pageLabel');
    if(labelEl){
      labelEl.textContent = section === 'attendance' ? 'Attendance'
        : section === 'calendar' ? 'My Attendance'
        : section === 'events' ? 'School Events'
        : 'Weekly Activities';
    }

    document.getElementById('week-body').classList.add('hidden');
    document.getElementById('attendance-body').classList.add('hidden');
    document.getElementById('calendar-body').classList.add('hidden');
    document.getElementById('events-body').classList.add('hidden');

    if(section === 'attendance'){
      document.getElementById('attendance-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent =
        'Attendance · ' + new Date().toLocaleDateString([], {weekday:'long', day:'numeric', month:'short', year:'numeric'});
      renderAttendanceBody();
    } else if(section === 'calendar'){
      document.getElementById('calendar-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'My Attendance';
      renderAttendanceCalendar(calendarYear, calendarMonth);
    } else if(section === 'events'){
      document.getElementById('events-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'PTMs, trainings, and other school events';
      renderSchoolEvents();
    } else {
      document.getElementById('week-body').classList.remove('hidden');
      openWeek(currentWeekNum);
    }
    closeSidebar();
  }

  const EVENT_TYPE_COLORS = {
    'PTM': 'var(--primary)',
    'Teacher Training': '#8b5cf6',
    'Other': 'var(--text-muted)'
  };

  async function renderSchoolEvents(){
    const container = document.getElementById('events-body');
    container.innerHTML = `<p class="sub">Loading events…</p>`;

    try{
      const res = await fetch('backend/get_events.php' + window.location.search);
      const data = await res.json();

      if(data.status !== 'success'){
        container.innerHTML = `<p class="sub">Could not load events right now.</p>`;
        return;
      }

      if(!data.events.length){
        container.innerHTML = `<p class="sub">No PTMs or trainings scheduled yet — your supervisor will add them here.</p>`;
        return;
      }

      const today = new Date(); today.setHours(0,0,0,0);
      const upcoming = data.events.filter(e => new Date(e.event_date) >= today);
      const past = data.events.filter(e => new Date(e.event_date) < today);

      function eventRow(e){
        const dateObj = new Date(e.event_date + 'T00:00:00');
        const niceDate = dateObj.toLocaleDateString([], {weekday:'short', day:'numeric', month:'short', year:'numeric'});
        const timeStr = e.event_time ? ' · ' + e.event_time.slice(0,5) : '';
        const color = EVENT_TYPE_COLORS[e.event_type] || 'var(--text-muted)';
        return `
          <div class="event-card" style="border-left:4px solid ${color};">
            <div class="event-card-head">
              <span class="event-type-tag" style="background:${color};">${e.event_type}</span>
              <span class="event-date">${niceDate}${timeStr}</span>
            </div>
            <div class="event-title">${e.title}</div>
            ${e.class_name ? `<div class="event-scope">Just for: ${e.class_name}</div>` : `<div class="event-scope">Whole school</div>`}
            ${e.notes ? `<div class="event-notes">${e.notes}</div>` : ''}
          </div>`;
      }

      container.innerHTML = `
        ${upcoming.length ? `<h3 class="events-h3">Upcoming</h3>${upcoming.map(eventRow).join('')}` : `<p class="sub">No upcoming events.</p>`}
        ${past.length ? `<h3 class="events-h3" style="margin-top:24px;">Past</h3>${past.map(eventRow).join('')}` : ''}
      `;
    }catch(err){
      container.innerHTML = `<p class="sub">Could not reach the server. Check your connection and try again.</p>`;
    }
  }

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

  function renderSidebar(){
    const list = document.getElementById('week-list');
    list.innerHTML = WEEKS.map(w => {
      const isExpanded = expandedWeek === w.w;
      let dropdownHtml = '';
      if(isExpanded && weeksWithContent.includes(w.w)){
        dropdownHtml = `<div class="day-topic-list">
          <div class="day-topic-heading">Topic: ${w.theme}</div>` + DAYS.map(d => {
          const key = w.w + '-' + d.key;
          const checked = dayTopicDone[key] ? 'checked' : '';
          const doneClass = dayTopicDone[key] ? 'dt-done' : '';
          const activeClass = (w.w===currentWeekNum && d.key===currentDay) ? 'active-day' : '';
          return `<div class="day-topic-row ${activeClass}">
            <input type="checkbox" ${checked} onchange="toggleDayTopic(${w.w}, '${d.key}', this)" />
            <span class="dt-label ${doneClass}" onclick="event.stopPropagation(); selectWeekDay(${w.w}, '${d.key}')">${d.label} — ${alwaysEnglish(d.value)}</span>
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

    DOMAINS.forEach(dom => {
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

      cardsHtml += `<div class="stage-card ${done?'done':''}">
        <div class="stage-head">
          <span class="name">${pickLang(dom.label)} <span class="stage-time">${dom.time}</span></span>
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
      `<div class="topic-complete-banner ${doneCount<DOMAINS.length ? 'pending' : ''}">${doneCount===DOMAINS.length?'✓ ':''}${doneCount} of ${DOMAINS.length} domains done for ${day.label}</div>`;

    DOMAINS.forEach(dom => { if(dom.h5p) mountH5pIfNeeded(dom.key); });
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

  const ACTIVITY_RENDERERS = (function(){

    const OBJECTS = {
      bag:    {emoji:'🎒', label:{en:'Bag', hi:'बैग', mr:'पिशवी', gu:'બેગ'}},
      book:   {emoji:'📖', label:{en:'Book', hi:'किताब', mr:'पुस्तक', gu:'પુસ્તક'}},
      pencil: {emoji:'✏️', label:{en:'Pencil', hi:'पेंसिल', mr:'पेन्सिल', gu:'પેન્સિલ'}},
      bottle: {emoji:'🧴', label:{en:'Bottle', hi:'बोतल', mr:'बाटली', gu:'બોટલ'}},
      crayon: {emoji:'🖍️', label:{en:'Crayon', hi:'क्रेयॉन', mr:'क्रेयॉन', gu:'ક્રેયોન'}},
      block:  {emoji:'🧱', label:{en:'Block', hi:'ब्लॉक', mr:'ठोकळा', gu:'બ્લોક'}}
    };

    // -----------------------------------------------------------------
    // H5P UI phrases — only the Language game is fully translated for
    // now, as the proof of concept. The other 7 interactive activities
    // (numeracy sort, social scenarios, physical game, creative art,
    // life skills, reflect, welcome explore) remain English-only —
    // translating each is its own separate follow-up.
    // -----------------------------------------------------------------
    const H5P_PHRASES = {
      what_is_this: {en:'What is this?', hi:'यह क्या है?', mr:'हे काय आहे?', gu:'આ શું છે?'},
      it_is_a:      {en:'It is a...', hi:'यह एक', mr:'हे एक', gu:'આ એક છે'},
      prev:         {en:'◀ Prev', hi:'◀ पिछला', mr:'◀ मागील', gu:'◀ પાછળ'},
      reveal:       {en:'Reveal', hi:'दिखाएं', mr:'दाखवा', gu:'બતાવો'},
      next:         {en:'Next ▶', hi:'आगे ▶', mr:'पुढे ▶', gu:'આગળ ▶'},
      of:           {en:'of', hi:'में से', mr:'पैकी', gu:'માંથી'},
      this_is_my:   {en:'This is my', hi:'यह मेरा है', mr:'हे माझे आहे', gu:'આ મારું છે'}
    };

    function enableDrag(item, dropzones, onSuccess, onFail){
      item.style.touchAction = 'none';
      var origParent = item.parentElement;
      item.addEventListener('pointerdown', start);
      function start(e){
        e.preventDefault();
        item.setPointerCapture(e.pointerId);
        var rect = item.getBoundingClientRect();
        item._offX = e.clientX - rect.left;
        item._offY = e.clientY - rect.top;
        origParent = item.parentElement;
        item.style.position = 'fixed';
        item.style.zIndex = 1000;
        item.style.left = rect.left + 'px';
        item.style.top = rect.top + 'px';
        item.style.width = rect.width + 'px';
        item.style.height = rect.height + 'px';
        document.body.appendChild(item);
        item.addEventListener('pointermove', move);
        item.addEventListener('pointerup', end);
      }
      function move(e){
        item.style.left = (e.clientX - item._offX) + 'px';
        item.style.top = (e.clientY - item._offY) + 'px';
      }
      function end(e){
        item.removeEventListener('pointermove', move);
        item.removeEventListener('pointerup', end);
        try{ item.releasePointerCapture(e.pointerId); }catch(err){}
        var iRect = item.getBoundingClientRect();
        var dropped = null;
        dropzones.forEach(function(dz){
          var dRect = dz.getBoundingClientRect();
          var overlap = !(iRect.right < dRect.left || iRect.left > dRect.right ||
                          iRect.bottom < dRect.top || iRect.top > dRect.bottom);
          if(overlap) dropped = dz;
        });
        item.style.position = ''; item.style.zIndex = '';
        item.style.left = ''; item.style.top = '';
        item.style.width = ''; item.style.height = '';
        if(dropped){
          var accepts = (dropped.dataset.accepts || '').split(',');
          if(accepts.indexOf(item.dataset.key) !== -1){
            dropped.appendChild(item);
            item.classList.add('placed');
            item.removeEventListener('pointerdown', start);
            onSuccess && onSuccess(item, dropped);
          } else {
            origParent.appendChild(item);
            item.classList.add('g-shake');
            setTimeout(function(){ item.classList.remove('g-shake'); }, 400);
            onFail && onFail(item, dropped);
          }
        } else {
          origParent.appendChild(item);
        }
      }
    }

    function renderLanguageGame(container, onComplete){
      var order = ['bag','book','pencil','bottle','crayon','block'];
      var i = 0, revealed = {};
      container.innerHTML =
        '<div class="g-lang-card">' +
          '<span class="g-lang-emoji" id="gle">❓</span>' +
          '<div class="g-lang-q" id="glq">' + pickLang(H5P_PHRASES.what_is_this) + '</div>' +
          '<div class="g-lang-ans" id="gla"></div>' +
          '<div class="g-lang-sent" id="gls"></div>' +
          '<div class="g-lang-controls">' +
            '<button class="g-btn secondary" id="glp">' + pickLang(H5P_PHRASES.prev) + '</button>' +
            '<button class="g-btn" id="glr" style="background:var(--lang)">' + pickLang(H5P_PHRASES.reveal) + '</button>' +
            '<button class="g-btn secondary" id="gln">' + pickLang(H5P_PHRASES.next) + '</button>' +
          '</div>' +
          '<div class="g-lang-prog" id="glg"></div>' +
        '</div>';
      var emojiEl = container.querySelector('#gle'), qEl = container.querySelector('#glq'),
          ansEl = container.querySelector('#gla'), sentEl = container.querySelector('#gls'),
          progEl = container.querySelector('#glg');
      function render(){
        progEl.textContent = (i+1) + ' ' + pickLang(H5P_PHRASES.of) + ' ' + order.length;
        emojiEl.textContent = '❓'; qEl.textContent = pickLang(H5P_PHRASES.what_is_this);
        ansEl.textContent = ''; sentEl.textContent = '';
      }
      container.querySelector('#glr').addEventListener('click', function(){
        var key = order[i], obj = OBJECTS[key];
        var objLabel = pickLang(obj.label);
        emojiEl.textContent = obj.emoji; qEl.textContent = pickLang(H5P_PHRASES.it_is_a);
        ansEl.textContent = objLabel + '!';
        sentEl.textContent = '“' + pickLang(H5P_PHRASES.this_is_my) + ' ' + (currentLang === 'en' ? objLabel.toLowerCase() : objLabel) + '.”';
        revealed[key] = true;
        if(Object.keys(revealed).length >= order.length) onComplete();
      });
      container.querySelector('#glp').addEventListener('click', function(){ i=(i-1+order.length)%order.length; render(); });
      container.querySelector('#gln').addEventListener('click', function(){ i=(i+1)%order.length; render(); });
      render();
    }

    function renderNumeracyGame(container, onComplete){
      var groups = {
        writing:  {label:{en:'Writing', hi:'लिखना', mr:'लिहणे', gu:'લખવું'}, icon:'✏️', items:['pencil','crayon']},
        reading:  {label:{en:'Reading', hi:'पढ़ना', mr:'वाचणे', gu:'વાંચવું'}, icon:'📖', items:['book']},
        drinking: {label:{en:'Drinking', hi:'पीना', mr:'पिणे', gu:'પીવું'}, icon:'🥤', items:['bottle']},
        playing:  {label:{en:'Playing', hi:'खेलना', mr:'खेळणे', gu:'રમવું'}, icon:'🧱', items:['block']}
      };
      var T = {
        dragInstruction: {en:'Drag each item into its group', hi:'हर वस्तु को उसके समूह में खींचें', mr:'प्रत्येक वस्तू तिच्या गटात ओढा', gu:'દરેક વસ્તુને તેના જૂથમાં ખેંચો'},
        allSorted: {en:'🎉 All sorted!', hi:'🎉 सब सही जगह पर!', mr:'🎉 सर्व नीट लावले!', gu:'🎉 બધું ગોઠવાઈ ગયું!'}
      };
      var allItems = [];
      Object.keys(groups).forEach(function(g){ groups[g].items.forEach(function(k){ allItems.push(k); }); });
      var total = allItems.length, placed = 0;
      var zonesHtml = Object.keys(groups).map(function(g){
        var grp = groups[g];
        return '<div class="g-zone" data-accepts="' + grp.items.join(',') + '"><h5>' + grp.icon + ' ' + pickLang(grp.label) + '</h5></div>';
      }).join('');
      var trayHtml = allItems.map(function(key){ return '<div class="g-chip" data-key="' + key + '">' + OBJECTS[key].emoji + '</div>'; }).join('');
      container.innerHTML =
        '<div class="g-sort-status" id="gss">' + pickLang(T.dragInstruction) + ' (0 / ' + total + ')</div>' +
        '<div class="g-sort-tray">' + trayHtml + '</div>' +
        '<div class="g-zones">' + zonesHtml + '</div>';
      var statusEl = container.querySelector('#gss');
      var zones = Array.prototype.slice.call(container.querySelectorAll('.g-zone'));
      var chips = Array.prototype.slice.call(container.querySelectorAll('.g-chip'));
      chips.forEach(function(chip){
        enableDrag(chip, zones, function(){
          placed++;
          if(placed >= total){ statusEl.textContent = pickLang(T.allSorted); onComplete(); }
          else statusEl.textContent = pickLang(T.dragInstruction) + ' (' + placed + ' / ' + total + ')';
        });
      });
    }

    function renderSocialGame(container, onComplete){
      var scenarios = [
        {text:{en:'Your friend forgot their crayon. What do you do?', hi:'आपके दोस्त की क्रेयॉन खो गई है। आप क्या करेंगे?', mr:'तुझ्या मित्राचा क्रेयॉन विसरला. तू काय करशील?', gu:'તારા મિત્રનું ક્રેયોન ખોવાઈ ગયું. તું શું કરીશ?'}, options:[
          {text:{en:'Share your crayon with your friend', hi:'अपनी क्रेयॉन दोस्त के साथ साझा करें', mr:'तुझा क्रेयॉन मित्राबरोबर वाटून घे', gu:'તારું ક્રેયોન મિત્ર સાથે વહેંચ'}, correct:true, feedback:{en:'Sharing makes friends happy! 🤝', hi:'साझा करना दोस्तों को खुश करता है! 🤝', mr:'वाटून घेतल्याने मित्र आनंदी होतात! 🤝', gu:'વહેંચવાથી મિત્રો ખુશ થાય છે! 🤝'}},
          {text:{en:'Keep both crayons for yourself', hi:'दोनों क्रेयॉन अपने पास रखें', mr:'दोन्ही क्रेयॉन स्वतःकडे ठेव', gu:'બંને ક્રેયોન તારી પાસે રાખ'}, correct:false, feedback:{en:'That makes your friend feel left out.', hi:'इससे आपका दोस्त अकेला महसूस करेगा।', mr:'यामुळे तुझा मित्र दुर्लक्षित वाटेल.', gu:'આનાથી તારો મિત્ર છોડાયેલો અનુભવશે.'}}]},
        {text:{en:'Everyone wants to talk at once. What should we do?', hi:'सब एक साथ बोलना चाहते हैं। हमें क्या करना चाहिए?', mr:'सगळे एकदमच बोलू इच्छितात. आपण काय करावे?', gu:'બધા એકસાથે બોલવા માંગે છે. આપણે શું કરવું જોઈએ?'}, options:[
          {text:{en:'Shout louder than everyone else', hi:'सबसे तेज़ आवाज़ में चिल्लाएं', mr:'सर्वांपेक्षा जोरात ओरडा', gu:'બધા કરતાં વધુ જોરથી બૂમો પાડ'}, correct:false, feedback:{en:'That makes it hard for anyone to be heard.', hi:'इससे किसी की भी बात सुनना मुश्किल हो जाता है।', mr:'यामुळे कोणाचेही बोलणे ऐकणे कठीण होते.', gu:'આનાથી કોઈને સાંભળવું મુશ્કેલ બને છે.'}},
          {text:{en:'Wait for your turn to speak', hi:'बोलने के लिए अपनी बारी का इंतज़ार करें', mr:'बोलण्यासाठी तुझी पाळी येईपर्यंत थांब', gu:'બોલવાનો તારો વારો રાહ જુઓ'}, correct:true, feedback:{en:'Waiting your turn shows kindness. ✅', hi:'बारी का इंतज़ार करना दयालुता दिखाता है। ✅', mr:'पाळीची वाट पाहणे दयाळूपणा दाखवते. ✅', gu:'વારાની રાહ જોવી એ દયા દર્શાવે છે. ✅'}}]},
        {text:{en:'Your friend falls down while playing. What do you say?', hi:'खेलते समय आपका दोस्त गिर जाता है। आप क्या कहेंगे?', mr:'खेळताना तुझा मित्र पडतो. तू काय म्हणशील?', gu:'રમતી વખતે તારો મિત્ર પડી જાય છે. તું શું કહીશ?'}, options:[
          {text:{en:'"Are you okay? Let me help you!"', hi:'"क्या तुम ठीक हो? मैं तुम्हारी मदद करता हूँ!"', mr:'"तू ठीक आहेस का? मी तुला मदत करतो!"', gu:'"તું બરાબર છે? હું તને મદદ કરું!"'}, correct:true, feedback:{en:'A kind and caring response. 💛', hi:'एक दयालु और परवाह करने वाला जवाब। 💛', mr:'एक दयाळू आणि काळजी घेणारे उत्तर. 💛', gu:'એક દયાળુ અને કાળજી રાખતો જવાબ. 💛'}},
          {text:{en:'Laugh and walk away', hi:'हंसें और चले जाएं', mr:'हस आणि निघून जा', gu:'હસીને ચાલ્યો જા'}, correct:false, feedback:{en:'That would make your friend feel sad.', hi:'इससे आपका दोस्त दुखी हो जाएगा।', mr:'यामुळे तुझा मित्र दुःखी होईल.', gu:'આનાથી તારો મિત્ર દુઃખી થશે.'}}]}
      ];
      var nextBtnText = {en:'Next scenario ▶', hi:'आगे की स्थिति ▶', mr:'पुढील परिस्थिती ▶', gu:'આગળનું દ્રશ્ય ▶'};
      var i = 0, answered = {};
      container.innerHTML =
        '<div class="g-scenario">' +
          '<div class="g-scenario-text" id="gst"></div>' +
          '<div class="g-scenario-opts" id="gso"></div>' +
          '<div class="g-feedback" id="gsf"></div>' +
          '<div class="g-scenario-controls"><button class="g-btn" id="gsn" style="background:var(--soc)">' + pickLang(nextBtnText) + '</button></div>' +
        '</div>';
      var textEl = container.querySelector('#gst'), optsEl = container.querySelector('#gso'), fbEl = container.querySelector('#gsf');
      function render(){
        var s = scenarios[i], sIndex = i;
        textEl.textContent = pickLang(s.text); fbEl.textContent = ''; optsEl.innerHTML = '';
        s.options.forEach(function(opt){
          var btn = document.createElement('button');
          btn.className = 'g-opt-btn'; btn.textContent = pickLang(opt.text);
          btn.addEventListener('click', function(){
            Array.prototype.slice.call(optsEl.children).forEach(function(b){ b.disabled = true; });
            btn.classList.add(opt.correct ? 'correct' : 'incorrect');
            fbEl.textContent = pickLang(opt.feedback);
            answered[sIndex] = true;
            if(Object.keys(answered).length >= scenarios.length) onComplete();
          });
          optsEl.appendChild(btn);
        });
      }
      container.querySelector('#gsn').addEventListener('click', function(){ i=(i+1)%scenarios.length; render(); });
      render();
    }

    function renderPhysicalGame(container, onComplete){
      var cues = [
        {icon:'🚶', title:'Line Walk', cue:'Walk heel-to-toe along the line.', seconds:8},
        {icon:'🧍', title:'Balance', cue:'Stand on one foot and count to five.', seconds:6},
        {icon:'🤾', title:'Ball Play', cue:'Throw and catch gently with a partner.', seconds:8},
        {icon:'🏃', title:'Safe Running', cue:'Run in the big circle, freeze on "freeze!"', seconds:8}
      ];
      var i = 0, timerId = null, completed = {};
      container.innerHTML =
        '<div class="g-phy-card">' +
          '<div class="g-phy-icon" id="gpi"></div>' +
          '<div class="g-phy-title" id="gpt"></div>' +
          '<div class="g-phy-cue" id="gpc"></div>' +
          '<div class="g-phy-timer" id="gpm">Ready?</div>' +
          '<div class="g-phy-controls">' +
            '<button class="g-btn" id="gps" style="background:var(--phy)">Start</button>' +
            '<button class="g-btn secondary" id="gpn">Next move ▶</button>' +
          '</div>' +
          '<div class="g-phy-prog" id="gpp"></div>' +
        '</div>';
      var iconEl = container.querySelector('#gpi'), titleEl = container.querySelector('#gpt'),
          cueEl = container.querySelector('#gpc'), timerEl = container.querySelector('#gpm'),
          progEl = container.querySelector('#gpp'), startBtn = container.querySelector('#gps');
      function render(){
        if(timerId){ clearInterval(timerId); timerId = null; }
        var c = cues[i];
        iconEl.textContent = c.icon; titleEl.textContent = c.title; cueEl.textContent = c.cue;
        timerEl.textContent = 'Ready?'; progEl.textContent = (i+1) + ' of ' + cues.length;
        startBtn.disabled = false;
      }
      startBtn.addEventListener('click', function(){
        var c = cues[i], idx = i, remaining = c.seconds;
        startBtn.disabled = true;
        timerEl.textContent = remaining + 's';
        timerId = setInterval(function(){
          remaining--;
          if(remaining <= 0){
            clearInterval(timerId);
            timerEl.textContent = 'Great job! 🎉';
            completed[idx] = true;
            if(Object.keys(completed).length >= cues.length) onComplete();
          } else timerEl.textContent = remaining + 's';
        }, 1000);
      });
      container.querySelector('#gpn').addEventListener('click', function(){ i=(i+1)%cues.length; render(); });
      render();
    }

    function renderCreativeGame(container, onComplete){
      var colors = ['#E15C74','#2C8FC4','#EE8F35','#3FA669','#D89A00','#7C6FD1'];
      var colored = {};
      container.innerHTML =
        '<div class="g-color-wrap">' +
          '<div class="g-palette" id="gcp"></div>' +
          '<div class="g-canvas-frame"><svg viewBox="0 0 200 220">' +
            '<rect id="gcBody" x="40" y="60" width="120" height="130" rx="18" fill="#f2f2f2" stroke="#333" stroke-width="3"/>' +
            '<path id="gcFlap" d="M55 60 L145 60 L135 20 L65 20 Z" fill="#f2f2f2" stroke="#333" stroke-width="3"/>' +
            '<path d="M75 20 Q100 -10 125 20" fill="none" stroke="#333" stroke-width="6" stroke-linecap="round"/>' +
          '</svg></div>' +
        '</div>' +
        '<div style="text-align:center; margin-top:12px;"><button class="g-btn secondary" id="gcr">Reset colours</button></div>';
      var paletteEl = container.querySelector('#gcp');
      var current = colors[0];
      colors.forEach(function(c, idx){
        var sw = document.createElement('div');
        sw.className = 'g-swatch' + (idx===0 ? ' selected' : '');
        sw.style.background = c;
        sw.addEventListener('click', function(){
          current = c;
          Array.prototype.slice.call(paletteEl.children).forEach(function(s){ s.classList.remove('selected'); });
          sw.classList.add('selected');
        });
        paletteEl.appendChild(sw);
      });
      var paintable = [container.querySelector('#gcBody'), container.querySelector('#gcFlap')];
      paintable.forEach(function(shape){
        shape.addEventListener('click', function(){
          shape.setAttribute('fill', current);
          colored[shape.id] = true;
          if(Object.keys(colored).length >= paintable.length) onComplete();
        });
      });
      container.querySelector('#gcr').addEventListener('click', function(){
        paintable.forEach(function(shape){ shape.setAttribute('fill', '#f2f2f2'); });
      });
    }

    function renderLifeGame(container, onComplete){
      var zones = [
        {icon:'🪝', label:{en:'Hook', hi:'हुक', mr:'हूक', gu:'હૂક'},       accepts:['bag']},
        {icon:'📚', label:{en:'Book Shelf', hi:'किताब शेल्फ', mr:'पुस्तक कपाट', gu:'પુસ્તક કબાટ'}, accepts:['book']},
        {icon:'👜', label:{en:'Side Pocket', hi:'साइड पॉकेट', mr:'साइड पॉकेट', gu:'સાઇડ પોકેટ'},accepts:['bottle']},
        {icon:'✏️', label:{en:'Pencil Box', hi:'पेंसिल बॉक्स', mr:'पेन्सिल बॉक्स', gu:'પેન્સિલ બોક્સ'}, accepts:['pencil','crayon']},
        {icon:'🗑️', label:{en:'Toy Bin', hi:'खिलौना बिन', mr:'खेळणी बिन', gu:'રમકડાં ડબ્બો'},    accepts:['block']}
      ];
      var T = {
        putAway: {en:'Put each item away', hi:'हर वस्तु को उसकी जगह पर रखें', mr:'प्रत्येक वस्तू तिच्या जागी ठेवा', gu:'દરેક વસ્તુ તેની જગ્યાએ મૂકો'},
        allPlaced: {en:'🎉 Everything is in its place!', hi:'🎉 सब कुछ अपनी जगह पर है!', mr:'🎉 सर्व काही जागच्या जागी आहे!', gu:'🎉 બધું તેની જગ્યાએ છે!'}
      };
      var items = ['bag','book','bottle','pencil','crayon','block'];
      var total = items.length, placed = 0;
      var zonesHtml = zones.map(function(z){
        return '<div class="g-life-zone" data-accepts="' + z.accepts.join(',') + '"><h5>' + z.icon + ' ' + pickLang(z.label) + '</h5></div>';
      }).join('');
      var trayHtml = items.map(function(key){ return '<div class="g-chip" data-key="' + key + '">' + OBJECTS[key].emoji + '</div>'; }).join('');
      container.innerHTML =
        '<div class="g-life-status" id="gls2">' + pickLang(T.putAway) + ' (0 / ' + total + ')</div>' +
        '<div class="g-life-tray">' + trayHtml + '</div>' +
        '<div class="g-life-zones">' + zonesHtml + '</div>';
      var statusEl = container.querySelector('#gls2');
      var zoneEls = Array.prototype.slice.call(container.querySelectorAll('.g-life-zone'));
      var chips = Array.prototype.slice.call(container.querySelectorAll('.g-chip'));
      chips.forEach(function(chip){
        enableDrag(chip, zoneEls, function(){
          placed++;
          if(placed >= total){ statusEl.textContent = pickLang(T.allPlaced); onComplete(); }
          else statusEl.textContent = pickLang(T.putAway) + ' (' + placed + ' / ' + total + ')';
        });
      });
    }

    function renderReflectGame(container, onComplete){
      const prompts = [
        {en:"I can name it!", hi:'मैं इसे नाम दे सकता हूँ!', mr:'मी हे नाव सांगू शकतो!', gu:'હું તેનું નામ આપી શકું!'},
        {en:"I remember most of it", hi:'मुझे इसका ज़्यादातर हिस्सा याद है', mr:'मला याचा बराचसा भाग आठवतो', gu:'મને તેનો મોટાભાગનો ભાગ યાદ છે'},
        {en:"I'll ask my teacher to explain again", hi:'मैं अपने शिक्षक से फिर से समझाने के लिए कहूँगा', mr:'मी माझ्या शिक्षकांना पुन्हा समजावण्यास सांगेन', gu:'હું મારા શિક્ષકને ફરી સમજાવવા કહીશ'}
      ];
      const quickCheck = {en:'Quick check — how did today go?', hi:'त्वरित जांच — आज का दिन कैसा रहा?', mr:'त्वरित तपासणी — आज कसा गेला?', gu:'ઝડપી ચકાસણી — આજનો દિવસ કેવો ગયો?'};
      const wrappedUp = {en:'🎉 Nicely wrapped up!', hi:'🎉 अच्छी तरह से समाप्त!', mr:'🎉 छान समारोप!', gu:'🎉 સરસ સમાપન!'};
      container.innerHTML =
        '<div class="g-scenario">' +
          '<div class="g-scenario-text">' + pickLang(quickCheck) + '</div>' +
          '<div class="g-scenario-opts" id="grOpts"></div>' +
          '<div class="g-feedback" id="grFeedback"></div>' +
        '</div>';
      const optsEl = container.querySelector('#grOpts');
      prompts.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'g-opt-btn';
        btn.textContent = pickLang(text);
        btn.addEventListener('click', () => {
          Array.from(optsEl.children).forEach(b => b.disabled = true);
          btn.classList.add('correct');
          container.querySelector('#grFeedback').textContent = pickLang(wrappedUp);
          onComplete();
        });
        optsEl.appendChild(btn);
      });
    }

    function renderWelcomeExplore(container, onComplete){
      const hotspots = [
        {id:'board',  x:20,  y:14, w:70, h:40, emoji:'📝', label:{en:'Whiteboard — where we learn together', hi:'श्यामपट — जहाँ हम सब मिलकर सीखते हैं', mr:'फळा — जिथे आपण सगळे एकत्र शिकतो', gu:'વ્હાઇટબોર્ડ — જ્યાં આપણે સાથે શીખીએ છીએ'}},
        {id:'shelf',  x:150, y:18, w:38, h:60, emoji:'📚', label:{en:'Book shelf — our story friends live here', hi:'किताबों की अलमारी — यहाँ हमारी कहानी वाले दोस्त रहते हैं', mr:'पुस्तकांचे कपाट — इथे आपले गोष्टीतले मित्र राहतात', gu:'પુસ્તકોનું કબાટ — અહીં આપણા વાર્તા મિત્રો રહે છે'}},
        {id:'window', x:14,  y:96, w:42, h:38, emoji:'🪟', label:{en:'Window — sunshine says hello!', hi:'खिड़की — सूरज नमस्ते कहता है!', mr:'खिडकी — सूर्य नमस्कार करतो!', gu:'બારી — સૂરજ નમસ્તે કહે છે!'}},
        {id:'desk',   x:74,  y:100,w:56, h:36, emoji:'🪑', label:{en:'Your desk — your very own spot', hi:'तुम्हारी डेस्क — तुम्हारी अपनी जगह', mr:'तुझे डेस्क — तुझी स्वतःची जागा', gu:'તારું ડેસ્ક — તારી પોતાની જગ્યા'}},
        {id:'plant',  x:150, y:100,w:32, h:32, emoji:'🌱', label:{en:'Class plant — we take turns watering it', hi:'कक्षा का पौधा — हम बारी-बारी से पानी देते हैं', mr:'वर्गातील रोप — आपण आळीपाळीने पाणी घालतो', gu:'વર્ગનો છોડ — આપણે વારાફરતી પાણી આપીએ છીએ'}}
      ];
      const found = {};
      const T = {
        lyric: {en:'"Good morning, Friends!, we\'re happy today!<br>Welcome to our classroom, come on in and play!"', hi:'"सुप्रभात दोस्तों! आज हम खुश हैं!<br>हमारी कक्षा में आपका स्वागत है, आओ और खेलो!"', mr:'"सुप्रभात मित्रांनो! आज आम्ही आनंदी आहोत!<br>आमच्या वर्गात तुमचे स्वागत आहे, या आणि खेळा!"', gu:'"સુપ્રભાત મિત્રો! આજે આપણે ખુશ છીએ!<br>આપણા વર્ગમાં તમારું સ્વાગત છે, આવો અને રમો!"'},
        playBtn: {en:'▶ Play welcome song', hi:'▶ स्वागत गीत बजाएं', mr:'▶ स्वागत गीत वाजवा', gu:'▶ સ્વાગત ગીત વગાડો'},
        nextBtn: {en:"We sang it! Let's explore →", hi:'हमने गाया! अब चलो देखें →', mr:'आम्ही गायलं! चला शोधूया →', gu:'અમે ગાયું! ચાલો શોધીએ →'},
        tapToExplore: {en:'Tap around the room to explore', hi:'कमरे में खोजने के लिए टैप करें', mr:'खोलीत शोधण्यासाठी टॅप करा', gu:'રૂમમાં શોધવા માટે ટેપ કરો'},
        allFound: {en:'🎉 You explored the whole classroom!', hi:'🎉 आपने पूरी कक्षा का अन्वेषण कर लिया!', mr:'🎉 तुम्ही संपूर्ण वर्गाचा शोध घेतला!', gu:'🎉 તમે સમગ્ર વર્ગની શોધ કરી!'}
      };

      function renderStepOne(){
        container.innerHTML =
          '<div class="g-welcome-song">' +
            '<div class="g-welcome-note" id="gwNote">🎵</div>' +
            '<p class="g-welcome-lyric">' + pickLang(T.lyric) + '</p>' +
            '<div class="g-welcome-actions">' +
              '<button class="g-btn welcome-play-btn"  style="background:var(--primary)" id="gwPlay">' + pickLang(T.playBtn) + '</button>' +
              '<button class="g-btn" id="gwNext" style="background:var(--primary)">' + pickLang(T.nextBtn) + '</button>' +
            '</div>' +
          '</div>';

        const noteEl = container.querySelector('#gwNote');
        const playBtn = container.querySelector('#gwPlay');
        const audioEl = new Audio('assets/audio/welcome-song.mp3');

        function speakLyrics(){
          if(!('speechSynthesis' in window)) return;
          const utter = new SpeechSynthesisUtterance(
            "Good morning, good morning, we're happy today! Welcome to our classroom, come on in and play!"
          );
          utter.rate = 0.85;
          utter.pitch = 1.3;
          utter.onstart = () => noteEl.classList.add('playing');
          utter.onend = () => noteEl.classList.remove('playing');
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utter);
        }

        playBtn.addEventListener('click', () => {
          audioEl.currentTime = 0;
          noteEl.classList.add('playing');
          audioEl.play()
            .then(() => {})
            .catch(() => { speakLyrics(); });
        });

        audioEl.addEventListener('ended', () => noteEl.classList.remove('playing'));

        container.querySelector('#gwNext').addEventListener('click', () => {
          window.speechSynthesis && window.speechSynthesis.cancel();
          audioEl.pause();
          renderStepTwo();
        });
      }

      function renderStepTwo(){
        const hotspotsHtml = hotspots.map(h =>
          `<div class="g-welcome-hotspot ${found[h.id]?'found':''}" data-id="${h.id}"
             style="left:${h.x}px; top:${h.y}px; width:${h.w}px; height:${h.h}px;">
             ${found[h.id] ? h.emoji : '?'}
           </div>`
        ).join('');

        container.innerHTML =
          `<div class="g-welcome-status" id="gwStatus">${pickLang(T.tapToExplore)} (0 / ${hotspots.length})</div>
           <div class="g-welcome-room">${hotspotsHtml}</div>`;

        const statusEl = container.querySelector('#gwStatus');
        container.querySelectorAll('.g-welcome-hotspot').forEach(el => {
          el.addEventListener('click', () => {
            const id = el.getAttribute('data-id');
            if(found[id]) return;
            const h = hotspots.find(x => x.id === id);
            found[id] = true;
            el.textContent = h.emoji;
            el.classList.add('found');
            const count = Object.keys(found).length;
            statusEl.textContent = count < hotspots.length ? pickLang(h.label) : pickLang(T.allFound);
            if(count >= hotspots.length) onComplete();
          });
        });
      }

      renderStepOne();
    }

    return {
      welcome:  renderWelcomeExplore,
      story:    renderSocialGame,
      numeracy: renderNumeracyGame,
      language: renderLanguageGame,
      create:   renderCreativeGame,
      outdoor:  renderPhysicalGame,
      tidy:     renderLifeGame,
      reflect:  renderReflectGame
    };
  })();

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

    let html = `<div class="rating-panel">
      <p class="rp-title">Enter proficiency — ${domainLabel}, ${dayLabel}</p>
      <p class="rp-sub">Rate each student on today's topic</p>`;
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
   DEV MODE — the actual trigger (moved here deliberately).
   Runs last, after every let/const in this file is initialized —
   see the note near devSkipLogin() above for why this had to move.
   ========================================================= */
(function autoDevBypassOnLoad(){
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const params = new URLSearchParams(window.location.search);

  if(isLocal){
    const wrap = document.getElementById('devSkipLoginWrap');
    if(wrap) wrap.classList.remove('hidden');
  }

  if(!isLocal || params.has('no_dev')) return;

  const role = params.get('dev_role') || 'teacher';
  selectedRole = role;
  devSkipLogin();
})();