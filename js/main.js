let selectedRole = 'teacher';
  let currentWeekNum = 1;
  let currentDay = 'mon';

  // weeksWithContent, WEEKS, WEEKLY_PLAN and ACTIVITY_COMPETENCIES now
  // live in js/data/curriculum-base.js and js/data/week-NN.js — those
  // files must load before this one. See curriculum-base.js for the
  // load-order explanation.

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

// Wrapping the real login() logic in a form submit handler — rather
// than a bare button onclick — is what lets the browser's own
// password manager recognize this as a genuine login and offer to
// save the credentials, then auto-fill them on future visits. The
// preventDefault stops an actual page reload; login() still runs via
// fetch() exactly as before.
function handleLoginSubmit(event){
  event.preventDefault();
  login();
  return false;
}

/* =========================================================
   SAVED LOGIN — stores email + password in this browser's
   localStorage so the fields can be auto-filled next visit.

   Deliberately NOT the same thing as the browser's own "Save
   password?" prompt (already wired up separately) — that one is
   encrypted by the browser/OS. This one is plain localStorage,
   readable by anyone with access to this browser or DevTools on
   this device. Only meant for a personal device, never a shared
   or public computer — the prompt below says so directly.
   ========================================================= */
const SAVED_LOGIN_KEY = 'savedLoginCredentials';

function getSavedLoginCredentials(){
  try{
    const raw = localStorage.getItem(SAVED_LOGIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e){ return null; }
}

function saveLoginCredentials(email, password){
  try{ localStorage.setItem(SAVED_LOGIN_KEY, JSON.stringify({email, password})); }
  catch(e){ /* localStorage unavailable — just won't persist */ }
}

function clearSavedLoginCredentials(){
  try{ localStorage.removeItem(SAVED_LOGIN_KEY); } catch(e){}
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  const link = document.getElementById('clearSavedLoginLink');
  if(link) link.remove();
}

function autoFillSavedLogin(){
  const saved = getSavedLoginCredentials();
  if(!saved) return;
  document.getElementById('loginEmail').value = saved.email;
  document.getElementById('loginPassword').value = saved.password;

  const footer = document.querySelector('.login-footer');
  if(footer && !document.getElementById('clearSavedLoginLink')){
    const link = document.createElement('div');
    link.id = 'clearSavedLoginLink';
    link.style.cssText = 'text-align:center; margin-top:8px;';
    link.innerHTML = `<a href="#" onclick="clearSavedLoginCredentials(); return false;" style="font-size:12px; color:var(--text-muted); text-decoration:underline;">Not you? Clear saved login</a>`;
    footer.insertAdjacentElement('afterend', link);
  }
}

function showSaveLoginPrompt(email, password){
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.id = 'saveLoginModalWrap';
    wrap.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center; z-index:1000;';
    wrap.innerHTML = `
      <div style="background:#fff; border-radius:12px; padding:22px 24px; max-width:380px; width:90%;">
        <h3 style="margin:0 0 8px; font-size:16px;">Save this login on this device?</h3>
        <p style="font-size:13px; color:var(--text-muted); margin:0 0 6px;">Next time, your email and password will be filled in automatically here.</p>
        <p style="font-size:12px; color:var(--danger, #c8433f); margin:0 0 18px;">Only do this on your own personal device — anyone else using this browser afterward could see your password.</p>
        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button id="saveLoginNoBtn" style="padding:8px 16px; border-radius:8px; border:1px solid var(--border); background:#fff; font-size:13px;">No, don't save</button>
          <button id="saveLoginYesBtn" class="btn-primary" style="width:auto; padding:8px 16px; font-size:13px;">Yes, save it</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);

    document.getElementById('saveLoginYesBtn').onclick = () => { wrap.remove(); resolve(true); };
    document.getElementById('saveLoginNoBtn').onclick = () => { wrap.remove(); resolve(false); };
  });
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

    const alreadySaved = getSavedLoginCredentials();
    const isSameAsSaved = alreadySaved && alreadySaved.email === email && alreadySaved.password === password;
    if(!isSameAsSaved){
      const wantsToSave = await showSaveLoginPrompt(email, password);
      if(wantsToSave) saveLoginCredentials(email, password);
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
    document.getElementById('navWorkbook').classList.toggle('active', section === 'workbook');
    document.getElementById('navAttendance').classList.toggle('active', section === 'attendance');
    document.getElementById('navCalendar').classList.toggle('active', section === 'calendar');
    document.getElementById('navEvents').classList.toggle('active', section === 'events');
    document.getElementById('navUploadPhoto').classList.toggle('active', section === 'uploadphoto');
    document.getElementById('navMaterials').classList.toggle('active', section === 'materials');
    document.getElementById('navVolunteers').classList.toggle('active', section === 'volunteers');
    document.getElementById('sidebar-workbook-section').classList.toggle('hidden', section !== 'workbook');

    const labelEl = document.getElementById('pageLabel');
    if(labelEl){
      labelEl.textContent = section === 'attendance' ? 'Attendance'
        : section === 'calendar' ? 'My Attendance'
        : section === 'events' ? 'School Events'
        : section === 'uploadphoto' ? 'Upload Activity Photo'
        : section === 'materials' ? 'Materials'
        : section === 'volunteers' ? 'Parent Volunteers'
        : 'Weekly Activities';
    }

    document.getElementById('week-body').classList.add('hidden');
    document.getElementById('attendance-body').classList.add('hidden');
    document.getElementById('calendar-body').classList.add('hidden');
    document.getElementById('events-body').classList.add('hidden');
    document.getElementById('upload-photo-body').classList.add('hidden');
    document.getElementById('materials-body').classList.add('hidden');
    document.getElementById('volunteers-body').classList.add('hidden');

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
    } else if(section === 'uploadphoto'){
      document.getElementById('upload-photo-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent = 'Photos go straight to your class\'s Google Drive';
      renderUploadPhotoForm();
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
      openWeek(currentWeekNum);
    }
    closeSidebar();
  }

  // EVENT_TYPE_COLORS now lives in js/events-calendar.js, shared with
  // the supervisor and superadmin pages so all three stay visually
  // identical rather than three separate implementations drifting apart.

  function renderSchoolEvents(){
    initEventsCalendar('events-body', 'backend/get_events.php' + window.location.search);
  }

  function renderUploadPhotoForm(){
    const container = document.getElementById('upload-photo-body');
    container.innerHTML = `
      <div class="visit-banner" style="margin-bottom:20px;">
        <div><strong>Upload a photo of today's activity</strong><br/>This goes straight to your class's own Google Drive — nothing is kept on this app's servers.</div>
      </div>

      <form id="uploadPhotoForm" onsubmit="return submitActivityPhoto(event)" style="background:var(--card); border-radius:10px; padding:18px 20px; max-width:420px;">
        <label class="field-label-admin">Photo</label>
        <input type="file" id="photoFile" accept="image/jpeg,image/png,image/webp" capture="environment" required />

        <label class="field-label-admin">Note (optional — becomes part of the filename)</label>
        <input type="text" id="photoNote" placeholder="e.g. Numeracy sorting activity" />

        <div id="uploadPhotoResult" style="margin-top:10px;"></div>
        <button type="submit" class="btn-primary" style="width:auto; padding:10px 20px; margin-top:10px;">Upload photo</button>
      </form>
    `;
  }

  async function submitActivityPhoto(event){
    event.preventDefault();
    const fileInput = document.getElementById('photoFile');
    const resultEl = document.getElementById('uploadPhotoResult');
    resultEl.innerHTML = '';

    if(!fileInput.files.length){
      resultEl.innerHTML = `<div class="au-error">Choose a photo first.</div>`;
      return false;
    }

    const formData = new FormData();
    formData.append('photo', fileInput.files[0]);
    formData.append('note', document.getElementById('photoNote').value.trim());

    resultEl.innerHTML = `<p class="sub">Uploading…</p>`;

    try{
      const res = await fetch('backend/upload_activity_photo.php' + window.location.search, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if(data.status !== 'success'){
        resultEl.innerHTML = `<div class="au-error">${data.message}</div>`;
        return false;
      }

      resultEl.innerHTML = `<div class="au-success">${data.message}</div>`;
      document.getElementById('uploadPhotoForm').reset();
    }catch(err){
      resultEl.innerHTML = `<div class="au-error">Could not reach the server.</div>`;
    }
    return false;
  }

  // ===== Materials — localStorage for now, not the database. Same
  // reasoning as My Attendance and the textbook-progress bookmark:
  // personal to this browser for now, easy to move to the real
  // backend later (the SQL table and 3 PHP endpoints from earlier
  // are still sitting there, untouched, ready to wire back up
  // whenever that's actually wanted). =====

  function getMaterialsList(){
    try{
      const raw = localStorage.getItem('materialsList');
      return raw ? JSON.parse(raw) : [];
    }catch(e){
      return [];
    }
  }

  function saveMaterialsList(list){
    try{
      localStorage.setItem('materialsList', JSON.stringify(list));
    }catch(e){ /* localStorage unavailable — list just won't persist this session */ }
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

  function renderMaterials(){
    const container = document.getElementById('materials-body');
    const materials = getMaterialsList().sort((a, b) => b.received_date.localeCompare(a.received_date));
    const distributedCount = materials.filter(m => m.distributed).length;
    const rows = materials.map(materialRowHtml).join('');

    container.innerHTML = `
      <div class="visit-banner" style="margin-bottom:16px;">
        <div><strong>Materials received from BMC</strong><br/>${materials.length ? distributedCount + ' of ' + materials.length + ' items distributed' : 'Nothing logged yet'}</div>
        <button class="btn-primary" style="width:auto; padding:9px 16px;" onclick="toggleAddMaterialForm()">+ Add material</button>
      </div>
      <div id="addMaterialFormWrap" class="hidden"></div>
      <div id="materialsList">${rows || '<p class="sub">No materials logged yet — tap "+ Add material" once something arrives.</p>'}</div>
    `;
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

  function submitNewMaterial(event){
    event.preventDefault();
    const resultEl = document.getElementById('addMaterialResult');
    resultEl.innerHTML = '';

    const itemName = document.getElementById('matItemName').value.trim();
    const receivedDate = document.getElementById('matReceivedDate').value;

    if(!itemName || !receivedDate){
      resultEl.innerHTML = `<div class="au-error">Item name and received date are both required.</div>`;
      return false;
    }

    const materials = getMaterialsList();
    materials.push({
      id: Date.now(),
      item_name: itemName,
      quantity: document.getElementById('matQuantity').value.trim(),
      received_date: receivedDate,
      distributed: false
    });
    saveMaterialsList(materials);
    renderMaterials();
    return false;
  }

  function toggleMaterialDistributed(materialId){
    const materials = getMaterialsList();
    const material = materials.find(m => String(m.id) === String(materialId));
    if(!material) return;
    material.distributed = !material.distributed;
    saveMaterialsList(materials);
    renderMaterials();
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
(function checkExistingSession(){
  fetch('backend/session_check.php' + window.location.search)
    .then(r => r.json())
    .then(data => {
      if(data.status !== 'logged_in' || data.role !== 'teacher'){
        autoFillSavedLogin();
        return;
      }
      selectedRole = 'teacher';
      document.getElementById('view-login').classList.add('hidden');
      enterTeacherFlow();
      renderPreviewBanner(data.is_previewing);

      // Coming from Textbooks' sidebar (e.g. index.html?section=materials) —
      // jump straight to that section, but only if the dashboard itself is
      // actually showing (enterTeacherFlow sometimes shows the attendance
      // gate screen instead, which has no sidebar to switch within).
      const params = new URLSearchParams(window.location.search);
      const requestedSection = params.get('section');
      if(requestedSection && !document.getElementById('view-dashboard').classList.contains('hidden')){
        switchSidebarSection(requestedSection);
      }
    })
    .catch(() => { autoFillSavedLogin(); });
})();

/* =========================================================
   DEV MODE — the actual trigger (restored). Runs last, after every
   let/const in this file is initialized.

   Also activates on the GitHub Pages demo URL
   (bhavyata-foundation.github.io) — deliberately, for showing
   officials the frontend without needing real credentials.
   This is SAFE specifically because GitHub Pages serves static
   files only (no PHP, no database) — there is no real student
   or teacher data behind this URL for a bypass to expose.
   This check must NEVER be widened to include the real live domain
   (bhavyatafoundation.com), since that one IS connected to a
   real database.
   ========================================================= */
(function autoDevBypassOnLoad(){
  const DEMO_HOSTNAMES = ['localhost', '127.0.0.1', 'bhavyata-foundation.github.io'];
  const isLocal = DEMO_HOSTNAMES.includes(window.location.hostname);
  const params = new URLSearchParams(window.location.search);

  if(isLocal){
    const wrap = document.getElementById('devSkipLoginWrap');
    if(wrap) wrap.classList.remove('hidden');
  }

  if(!isLocal || params.has('no_dev')) return;

  const role = params.get('dev_role') || 'teacher';
  selectedRole = role;

  if(!params.has('dev_role')){
    history.replaceState(null, '', window.location.pathname + '?dev_role=' + role);
  }

  devSkipLogin();
})();

// -------------------------------------------------------------------------
// PREVIEW BANNER — shown only when a superadmin is currently previewing
// the teacher role (see backend/preview_as.php). Lets them get back to
// their real superadmin session with one click, no re-login needed.
// -------------------------------------------------------------------------
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