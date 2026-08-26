/* =========================================================================
   PTM-VIEW.JS — shared rendering for the PTM (Parent-Teacher Meeting)
   feature: tiles, a month calendar highlighting the meeting date, and
   an Agenda section (objectives + teacher/supervisor prep checklists).

   Deliberately self-contained: every helper here is PTM_-prefixed so
   this file is safe to load alongside teacher.js, superadmin.js, etc.
   without any risk of colliding with THEIR global function/const names
   (that exact class of collision — two scripts declaring the same
   top-level name — is what caused the WEEKLY_PLAN crash earlier in
   this project; this file avoids it on purpose).

   Calendar markup/classes (.cal .dh .dc .dn .dl .vt) match the classes
   already styled in css/style-new-design.css — nothing new to add there.

   USAGE:
     renderPTMView('containerId', {
       schoolId: 1,
       classId: 5,           // optional — omit for a whole-school meeting
       role: 'teacher',      // 'teacher' | 'principal' | 'supervisor' | 'superadmin'
       canSchedule: false,   // true for supervisor/superadmin — shows the schedule/edit form
       canToggleTeacherPrep: true,   // true only when role === 'teacher'
       canToggleSupervisorPrep: false, // true for supervisor/superadmin
       querySuffix: window.location.search  // forwards ?dev_role=... etc.
     });
   ========================================================================= */

function PTM_el(t, c, h){ const e = document.createElement(t); if(c) e.className = c; if(h !== undefined) e.innerHTML = h; return e; }
function PTM_esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function PTM_pillTxt(l, c){ return `<span class="pill ${c || 'neu'}">${PTM_esc(l)}</span>`; }
function PTM_grid(cls, items){ const g = PTM_el('div', 'g ' + cls); items.forEach(i => i && g.appendChild(i)); return g; }

function PTM_tile(k, v, unit, extraHtml, formula, mtr){
  const t = PTM_el('div', 'tile');
  t.appendChild(PTM_el('div', 'k', PTM_esc(k)));
  t.appendChild(PTM_el('div', 'v', v + (unit ? `<small> ${PTM_esc(unit)}</small>` : '')));
  if(extraHtml){ const d = PTM_el('div', 'd'); d.innerHTML = extraHtml; t.appendChild(d); }
  if(mtr) t.appendChild(mtr);
  if(formula){ const f = PTM_el('div', 'f'); f.textContent = formula; t.appendChild(f); }
  return t;
}

function PTM_meter(pct, cls){
  const m = PTM_el('div', 'meter' + (cls ? ' ' + cls : ''));
  const i = PTM_el('i'); i.style.width = Math.max(0, Math.min(100, pct)) + '%'; m.appendChild(i);
  return m;
}

function PTM_sec(title, right){
  const s = PTM_el('div', 'sec');
  s.innerHTML = `<h2>${PTM_esc(title)}</h2><div class="hr"></div>${right || ''}`;
  return s;
}

function PTM_card(title, cap, bodyEl){
  const c = PTM_el('div', 'card');
  if(title) c.innerHTML = `<div class="hd"><div><h3>${PTM_esc(title)}</h3>${cap ? `<p class="cap">${cap}</p>` : ''}</div></div>`;
  if(bodyEl) c.appendChild(bodyEl);
  return c;
}

function PTM_statusBand(pct, good, warn){
  if(pct >= (good || 85)) return {l:'On track', c:'good'};
  if(pct >= (warn || 70)) return {l:'Watch', c:'warn'};
  return {l:'Action', c:'crit'};
}

// Simple, self-built month grid — deliberately NOT the original
// prototype's full academic-calendar engine (student/teacher day
// types, holiday lists, etc.). Every day is just a plain calendar day
// here; only Sundays are marked "off." Good enough to show WHEN the
// PTM falls in the month, which is the only thing this view needs.
function PTM_buildMonthGrid(year, month){ // month is 0-indexed
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (firstDay.getDay() + 6) % 7; // Monday-first column
  const days = [];
  for(let d = 1; d <= daysInMonth; d++){
    const dow = new Date(year, month, d).getDay();
    days.push({ d, isSunday: dow === 0, isSaturday: dow === 6 });
  }
  return { firstDow, days, year, month };
}

function PTM_calMonth(mo, highlightDay, tipLabel){
  const g = PTM_el('div', 'cal');
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d => g.appendChild(PTM_el('div', 'dh', d)));
  for(let i = 0; i < mo.firstDow; i++) g.appendChild(PTM_el('div', 'dc pad'));
  mo.days.forEach(day => {
    let cls = 'dc';
    if(day.isSunday) cls += ' off';
    else if(day.isSaturday) cls += ' sat';
    if(day.d === highlightDay) cls += ' sel';
    const c = PTM_el('div', cls);
    c.appendChild(PTM_el('div', 'dn', String(day.d)));
    if(day.d === highlightDay){
      c.appendChild(PTM_el('div', 'vt info', PTM_esc(tipLabel || 'PTM')));
    }
    g.appendChild(c);
  });
  return g;
}

const PTM_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

async function renderPTMView(containerId, opts){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '<p class="sub">Loading PTM schedule…</p>';

  const params = new URLSearchParams(opts.querySuffix || window.location.search);
  params.set('school_id', opts.schoolId);
  if(opts.classId) params.set('class_id', opts.classId);

  let meeting = null;
  try{
    const res = await fetch('backend/get_ptm_meeting.php?' + params.toString());
    const data = await res.json();
    if(data.status === 'success') meeting = data.meeting;
  } catch(err){
    container.innerHTML = '<p class="sub">Could not reach the server.</p>';
    return;
  }

  container.innerHTML = '';

  if(!meeting){
    container.appendChild(PTM_card('No PTM scheduled yet',
      'Once the supervisor schedules one, it will appear here for everyone — teacher, principal, and superadmin alike.',
      null));
    if(opts.canSchedule){
      container.appendChild(PTM_buildScheduleForm(containerId, opts, null));
    }
    return;
  }

  const meetingDateObj = new Date(meeting.meeting_date + 'T00:00:00');
  const dayNum = meetingDateObj.getDate();
  const monthLabel = PTM_MONTH_NAMES[meetingDateObj.getMonth()] + ' ' + meetingDateObj.getFullYear();

  const teacherPrep = meeting.prep_items.filter(p => p.for_role === 'teacher');
  const supervisorPrep = meeting.prep_items.filter(p => p.for_role === 'supervisor');
  const teacherPrepDone = teacherPrep.filter(p => p.is_done == 1).length;
  const supervisorPrepDone = supervisorPrep.filter(p => p.is_done == 1).length;

  const statusPill = meeting.status === 'held' ? PTM_pillTxt('Held', 'good')
    : meeting.status === 'cancelled' ? PTM_pillTxt('Cancelled', 'crit')
    : PTM_pillTxt('Scheduled', 'info');

  const attendanceRate = (meeting.status === 'held' && meeting.invited_count > 0)
    ? Math.round((meeting.attended_count / meeting.invited_count) * 100) : null;

  container.appendChild(PTM_grid('g4', [
    PTM_tile('Meeting', dayNum + ' ' + PTM_MONTH_NAMES[meetingDateObj.getMonth()].slice(0,3), meeting.meeting_time, statusPill, 'PTM-01'),
    PTM_tile('Households invited', meeting.invited_count, '', PTM_pillTxt(meeting.venue, 'neu'), 'PTM-02'),
    PTM_tile('Attended', meeting.status === 'held' ? meeting.attended_count : '—',
      meeting.status === 'held' ? 'of ' + meeting.invited_count : '',
      meeting.status === 'held' ? PTM_pillTxt(attendanceRate + '%', PTM_statusBand(attendanceRate, 70, 50).c) : PTM_pillTxt('not yet', 'neu'),
      'PTM-05', meeting.status === 'held' ? PTM_meter(attendanceRate) : null),
    (opts.role === 'teacher') ? PTM_tile('My preparation', teacherPrepDone, 'of ' + teacherPrep.length + ' items',
      PTM_pillTxt(PTM_statusBand(teacherPrep.length ? teacherPrepDone/teacherPrep.length*100 : 0).l, PTM_statusBand(teacherPrep.length ? teacherPrepDone/teacherPrep.length*100 : 0).c),
      'PTM-03', PTM_meter(teacherPrep.length ? teacherPrepDone/teacherPrep.length*100 : 0))
      : PTM_tile('Supervisor preparation', supervisorPrepDone, 'of ' + supervisorPrep.length + ' items',
      PTM_pillTxt(PTM_statusBand(supervisorPrep.length ? supervisorPrepDone/supervisorPrep.length*100 : 0).l, PTM_statusBand(supervisorPrep.length ? supervisorPrepDone/supervisorPrep.length*100 : 0).c),
      'PTM-04', PTM_meter(supervisorPrep.length ? supervisorPrepDone/supervisorPrep.length*100 : 0))
  ]));

  container.appendChild(PTM_sec('The PTM in the calendar', '<span class="reqs">PTM-01</span>'));
  container.appendChild(PTM_calMonth(PTM_buildMonthGrid(meetingDateObj.getFullYear(), meetingDateObj.getMonth()), dayNum, 'PTM ' + meeting.meeting_time));
  container.appendChild(PTM_el('p', 'cap', 'PTM-02 · one meeting a month, set by the supervisor. ' + monthLabel + '.'));

  container.appendChild(PTM_sec('Agenda', '<span class="reqs">PTM-06/07</span>'));
  const agendaGrid = PTM_el('div', 'g g3');

  agendaGrid.appendChild(PTM_card('Objectives for this meeting', 'PTM-06 · what this meeting is for.',
    PTM_el('div', 'list', meeting.objectives.length
      ? meeting.objectives.map((o, i) => `<div class="row"><div class="t"><b>${i+1}. ${PTM_esc(o.objective_text)}</b></div></div>`).join('')
      : '<div class="row"><div class="t">No objectives set yet.</div></div>')));

  agendaGrid.appendChild(PTM_card('What the teacher must have ready', 'PTM-03 · her preparation checklist.',
    PTM_el('div', 'list', teacherPrep.length
      ? teacherPrep.map(p => `<div class="row"><div class="t">
          ${opts.canToggleTeacherPrep ? `<input type="checkbox" ${p.is_done == 1 ? 'checked' : ''} onchange="PTM_toggleItem(${p.id}, '${containerId}', ${JSON.stringify(opts).replace(/"/g,'&quot;')})" />` : ''}
          <b style="margin-left:6px;">${PTM_esc(p.item_text)}</b></div>
          <div>${p.is_done == 1 ? PTM_pillTxt('Ready','good') : PTM_pillTxt('Pending','warn')}</div></div>`).join('')
      : '<div class="row"><div class="t">No prep items set yet.</div></div>')));

  agendaGrid.appendChild(PTM_card('What the supervisor must have ready', 'PTM-04 · she is accountable for the meeting happening at all.',
    PTM_el('div', 'list', supervisorPrep.length
      ? supervisorPrep.map(p => `<div class="row"><div class="t">
          ${opts.canToggleSupervisorPrep ? `<input type="checkbox" ${p.is_done == 1 ? 'checked' : ''} onchange="PTM_toggleItem(${p.id}, '${containerId}', ${JSON.stringify(opts).replace(/"/g,'&quot;')})" />` : ''}
          <b style="margin-left:6px;">${PTM_esc(p.item_text)}</b></div>
          <div>${p.is_done == 1 ? PTM_pillTxt('Ready','good') : PTM_pillTxt('Pending','warn')}</div></div>`).join('')
      : '<div class="row"><div class="t">No prep items set yet.</div></div>')));

  container.appendChild(agendaGrid);

  // Outcome recording — anyone (teacher/supervisor/superadmin) can log
  // what actually happened, once the meeting date has passed.
  if(meeting.status === 'scheduled' && ['teacher','supervisor','superadmin'].includes(opts.role)){
    const outcomeWrap = PTM_el('div', 'card', '');
    outcomeWrap.style.marginTop = '14px';
    outcomeWrap.innerHTML = `
      <div class="hd"><div><h3>Record the outcome</h3><p class="cap">Once the meeting has actually happened.</p></div></div>
      <div style="display:flex; gap:8px; align-items:center; margin-top:8px;">
        <input type="number" id="ptmAttendedInput-${containerId}" min="0" max="${meeting.invited_count}" placeholder="Households attended" style="padding:6px 10px; width:160px;" />
        <button class="chip" onclick="PTM_recordOutcome(${meeting.id}, '${containerId}', ${JSON.stringify(opts).replace(/"/g,'&quot;')})">Mark meeting held</button>
      </div>`;
    container.appendChild(outcomeWrap);
  }

  if(opts.canSchedule){
    const rescheduleToggle = PTM_el('button', 'chip', '▸ Schedule the next PTM');
    rescheduleToggle.style.marginTop = '14px';
    rescheduleToggle.onclick = () => {
      const form = PTM_buildScheduleForm(containerId, opts, null);
      container.appendChild(form);
      rescheduleToggle.remove();
    };
    container.appendChild(rescheduleToggle);
  }
}

function PTM_buildScheduleForm(containerId, opts, prefill){
  const wrap = PTM_el('div', 'card');
  wrap.style.marginTop = '14px';
  wrap.innerHTML = `
    <div class="hd"><div><h3>Schedule a PTM</h3><p class="cap">PTM-02 · this is the actual decision — teacher/principal/superadmin will see whatever is saved here.</p></div></div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
      <div><label class="field-label-admin">Date</label><input type="date" id="ptmDateInput-${containerId}" /></div>
      <div><label class="field-label-admin">Time</label><input type="text" id="ptmTimeInput-${containerId}" placeholder="2:30 PM" value="2:30 PM" /></div>
      <div><label class="field-label-admin">Venue</label><input type="text" id="ptmVenueInput-${containerId}" placeholder="Classroom" value="Classroom" /></div>
      <div><label class="field-label-admin">Households invited</label><input type="number" id="ptmInvitedInput-${containerId}" min="0" value="0" /></div>
    </div>
    <label class="field-label-admin" style="margin-top:10px; display:block;">Objectives (one per line)</label>
    <textarea id="ptmObjectivesInput-${containerId}" rows="3" style="width:100%;" placeholder="e.g. Share each child's growth snapshot"></textarea>
    <label class="field-label-admin" style="margin-top:10px; display:block;">Teacher's prep checklist (one per line)</label>
    <textarea id="ptmTeacherPrepInput-${containerId}" rows="3" style="width:100%;" placeholder="e.g. Print growth snapshots for every child"></textarea>
    <label class="field-label-admin" style="margin-top:10px; display:block;">Supervisor's prep checklist (one per line)</label>
    <textarea id="ptmSupervisorPrepInput-${containerId}" rows="3" style="width:100%;" placeholder="e.g. Confirm venue is available"></textarea>
    <div id="ptmScheduleResult-${containerId}" style="margin-top:8px;"></div>
    <button class="btn-primary" style="width:auto; padding:10px 20px; margin-top:10px;" onclick="PTM_submitSchedule('${containerId}', ${JSON.stringify(opts).replace(/"/g,'&quot;')})">Save PTM</button>
  `;
  return wrap;
}

async function PTM_submitSchedule(containerId, opts){
  const resultEl = document.getElementById('ptmScheduleResult-' + containerId);
  const body = {
    school_id: opts.schoolId,
    class_id: opts.classId || null,
    meeting_date: document.getElementById('ptmDateInput-' + containerId).value,
    meeting_time: document.getElementById('ptmTimeInput-' + containerId).value,
    venue: document.getElementById('ptmVenueInput-' + containerId).value,
    invited_count: document.getElementById('ptmInvitedInput-' + containerId).value,
    objectives: document.getElementById('ptmObjectivesInput-' + containerId).value.split('\n').map(s => s.trim()).filter(Boolean),
    teacher_prep: document.getElementById('ptmTeacherPrepInput-' + containerId).value.split('\n').map(s => s.trim()).filter(Boolean),
    supervisor_prep: document.getElementById('ptmSupervisorPrepInput-' + containerId).value.split('\n').map(s => s.trim()).filter(Boolean)
  };
  if(!body.meeting_date){
    if(resultEl) resultEl.innerHTML = '<div class="au-error">Pick a date first.</div>';
    return;
  }
  if(resultEl) resultEl.innerHTML = '<p class="sub">Saving…</p>';
  try{
    const res = await fetch('backend/save_ptm_meeting.php' + (opts.querySuffix || window.location.search), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if(data.status !== 'success'){
      if(resultEl) resultEl.innerHTML = `<div class="au-error">${PTM_esc(data.message || 'Could not save.')}</div>`;
      return;
    }
    renderPTMView(containerId, opts); // reload with the freshly saved meeting
  } catch(err){
    if(resultEl) resultEl.innerHTML = '<div class="au-error">Could not reach the server.</div>';
  }
}

async function PTM_toggleItem(itemId, containerId, opts){
  try{
    await fetch('backend/toggle_ptm_prep_item.php' + (opts.querySuffix || window.location.search), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({item_id: itemId})
    });
  } catch(err){ /* re-render below shows whatever the server actually has, even on a hiccup */ }
  renderPTMView(containerId, opts);
}

async function PTM_recordOutcome(meetingId, containerId, opts){
  const input = document.getElementById('ptmAttendedInput-' + containerId);
  const attended = input ? input.value : null;
  if(attended === null || attended === ''){ return; }
  try{
    await fetch('backend/record_ptm_outcome.php' + (opts.querySuffix || window.location.search), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({meeting_id: meetingId, attended_count: attended})
    });
  } catch(err){ /* fall through to re-render regardless */ }
  renderPTMView(containerId, opts);
}