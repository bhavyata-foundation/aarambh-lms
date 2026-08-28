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
// A small, real, non-exhaustive set of fixed-date national holidays.
// Not the full festival calendar (that varies year to year and needs a
// real source) — deliberately limited to well-known fixed dates so
// this is honest sample data, not a fabricated holiday list.
const PTM_FIXED_HOLIDAYS = {
  '0-26': 'Republic Day',
  '4-1': 'Maharashtra Day',
  '7-15': 'Independence Day',
  '9-2': 'Gandhi Jayanti',
};

function PTM_buildMonthGrid(year, month){ // month is 0-indexed
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = (firstDay.getDay() + 6) % 7; // Monday-first column

  // Find the last Saturday of the month first — CAL-16: the last
  // teacher-only Saturday of the month is also a teacher holiday, so a
  // teacher works three Saturdays a month, not four.
  let lastSaturday = null;
  for(let d = daysInMonth; d >= 1; d--){
    if(new Date(year, month, d).getDay() === 6){ lastSaturday = d; break; }
  }

  const dowNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const days = [];
  for(let d = 1; d <= daysInMonth; d++){
    const dow = new Date(year, month, d).getDay();
    let student = true, teacher = true, why = null, hol = null;
    const fixedHol = PTM_FIXED_HOLIDAYS[month + '-' + d];
    if(fixedHol){
      student = false; teacher = false; hol = fixedHol;
    } else if(dow === 0){
      student = false; teacher = false; why = 'Sunday';
    } else if(dow === 6){
      if(d === lastSaturday){ teacher = false; why = 'Last Saturday — monthly teacher holiday'; }
      else { student = false; why = 'Saturday — teachers only, no children'; }
    }
    days.push({ d, dow, dowName: dowNames[dow], student, teacher, why, hol });
  }
  return { firstDow, days, year, month };
}

// items: { [dayNumber]: [{label, band}, ...] } — one or more tags to
// show on that day (a PTM, a planned session, etc.)
// items: { [dayNumber]: [{label, band, type, id}, ...] }. onDayClick(day,
// dayItems) fires when a day WITH items is tapped — used to show detail +
// a delete option, without needing a separate popup component.
function PTM_calMonth(mo, items, selectedDay, onDayClick){
  const g = PTM_el('div', 'cal');
  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(d => g.appendChild(PTM_el('div', 'dh', d)));
  for(let i = 0; i < mo.firstDow; i++) g.appendChild(PTM_el('div', 'dc pad'));
  mo.days.forEach(day => {
    let cls = 'dc';
    if(!day.student && !day.teacher) cls += day.hol ? ' hol' : ' off';
    else if(!day.student) cls += ' sat';
    if(day.d === selectedDay) cls += ' sel';
    const c = PTM_el('div', cls);
    c.appendChild(PTM_el('div', 'dn', day.d + ' <span style="font-weight:600;color:var(--ink-3)">' + day.dowName + '</span>'));
    if(!day.student) c.appendChild(PTM_el('div', 'dl', PTM_esc(day.hol || day.why)));
    const dayItems = (items && items[day.d]) || [];
    dayItems.forEach(it => c.appendChild(PTM_el('div', 'vt ' + (it.band || 'info'), PTM_esc(it.label))));
    if(dayItems.length && onDayClick){
      c.style.cursor = 'pointer';
      c.title = 'Tap for details';
      c.onclick = () => onDayClick(day.d, dayItems);
    }
    g.appendChild(c);
  });
  return g;
}

const PTM_MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Fetches this school's non-PTM events (Teacher Training, Workshop,
// Other — anything from the generic events system) for one specific
// calendar month, keyed by day number — same shape as the PTM item so
// PTM_calMonth can show both together.
async function PTM_fetchTrainingItemsForMonth(schoolId, year, month, querySuffix){
  const items = {};
  try{
    const params = new URLSearchParams(querySuffix || window.location.search);
    if(schoolId) params.set('school_id', schoolId);
    const res = await fetch('backend/get_events.php?' + params.toString());
    const data = await res.json();
    if(data.status !== 'success') return items;
    (data.events || []).forEach(e => {
      if(e.event_type === 'PTM') return; // PTM comes from ptm_meetings, not duplicated from here
      const d = new Date(e.event_date + 'T00:00:00');
      if(d.getFullYear() !== year || d.getMonth() !== month) return; // only this month's grid
      const day = d.getDate();
      if(!items[day]) items[day] = [];
      items[day].push({ label: e.event_type + ': ' + e.title, band: 'good', type: 'training', id: e.id, time: e.event_time, notes: e.notes });
    });
  } catch(err){ /* calendar just shows PTM only if this fails */ }
  return items;
}

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
  const showForm = opts.canSchedule && opts.showScheduleForm !== false;

  // The calendar always shows — even with no PTM yet — so Training
  // days aren't hidden just because nobody's scheduled a PTM.
  const calDate = meeting ? new Date(meeting.meeting_date + 'T00:00:00') : new Date();
  const calYear = calDate.getFullYear();
  const calMonthIdx = calDate.getMonth();
  const calItems = await PTM_fetchTrainingItemsForMonth(opts.schoolId, calYear, calMonthIdx, opts.querySuffix);
  let ptmDay = null;
  if(meeting){
    ptmDay = calDate.getDate();
    if(!calItems[ptmDay]) calItems[ptmDay] = [];
    calItems[ptmDay].unshift({ label: 'PTM ' + meeting.meeting_time, band: 'crit', type: 'ptm', id: meeting.id });
  }

  if(!meeting){
    container.appendChild(PTM_card('No PTM scheduled yet',
      'Once the supervisor schedules one, it will appear here for everyone — teacher, principal, and superadmin alike.',
      null));
    container.appendChild(PTM_sec('This month\u2019s calendar', '<span class="reqs">PTM-01 · CAL-05</span>'));
    container.appendChild(PTM_calMonth(PTM_buildMonthGrid(calYear, calMonthIdx), calItems, null,
      (day, dayItems) => PTM_showDayDetail(containerId, opts, day, dayItems)));
    container.appendChild(PTM_el('div', null, `<div id="ptmDayDetail-${containerId}"></div>`));
    if(showForm){
      container.appendChild(PTM_buildScheduleForm(containerId, opts, null));
    }
    return;
  }

  const meetingDateObj = calDate;
  const dayNum = ptmDay;
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

  container.appendChild(PTM_sec('The monthly PTM & Training calendar', '<span class="reqs">PTM-01 · CAL-05</span>'));
  container.appendChild(PTM_calMonth(
    PTM_buildMonthGrid(calYear, calMonthIdx),
    calItems,
    dayNum,
    (day, dayItems) => PTM_showDayDetail(containerId, opts, day, dayItems)
  ));
  container.appendChild(PTM_el('div', null, `<div id="ptmDayDetail-${containerId}"></div>`));
  container.appendChild(PTM_el('p', 'cap', 'PTM-01 · one meeting a month, on a teaching day, never on a Saturday the school is closed. Red = PTM, green = Training/Workshop. Tap a day with something on it for details. The date is set by the supervisor with the principal and cannot be moved by the teacher alone (PTM-02).'));

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

  if(showForm){
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

// Shows what's on a tapped day, with a Delete button per item — the
// "in case of mistakes" correction path. Renders into a fixed slot
// right under the calendar rather than a popup, so it works the same
// on mobile as desktop.
function PTM_showDayDetail(containerId, opts, day, dayItems){
  const slot = document.getElementById('ptmDayDetail-' + containerId);
  if(!slot) return;
  const canDelete = opts.canSchedule; // only whoever can schedule can delete — same role gate
  slot.innerHTML = '';
  const card = PTM_el('div', 'card');
  card.style.marginTop = '10px';
  card.innerHTML = `<div class="hd"><div><h3>Day ${day}</h3></div>
    <button class="chip" onclick="document.getElementById('ptmDayDetail-${containerId}').innerHTML=''">Close</button></div>`;
  const list = PTM_el('div', 'list');
  list.innerHTML = dayItems.map(it => `<div class="row"><div class="t">
      <b>${PTM_esc(it.label)}</b>${it.notes ? '<span>' + PTM_esc(it.notes) + '</span>' : ''}</div>
      <div>${canDelete ? `<button class="chip" style="color:var(--danger,#c8433f);" onclick="PTM_deleteDayItem('${it.type}', ${it.id}, '${containerId}', ${JSON.stringify(opts).replace(/"/g,'&quot;')})">Delete</button>` : ''}</div>
    </div>`).join('');
  card.appendChild(list);
  slot.appendChild(card);
}

async function PTM_deleteDayItem(type, id, containerId, opts){
  if(!confirm('Delete this ' + (type === 'ptm' ? 'PTM meeting' : 'training') + '? This cannot be undone.')) return;
  const endpoint = type === 'ptm' ? 'delete_ptm_meeting.php' : 'delete_event.php';
  const bodyKey = type === 'ptm' ? 'meeting_id' : 'event_id';
  try{
    await fetch('backend/' + endpoint + (opts.querySuffix || window.location.search), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ [bodyKey]: id })
    });
  } catch(err){ /* fall through to re-render regardless — shows current real state */ }
  renderPTMView(containerId, opts);
}

// In-memory item lists for the schedule form — one set per containerId,
// so switching between add-item inputs doesn't lose what's already typed.
const PTM_formItems = {}; // containerId -> { objectives: [], teacher_prep: [], supervisor_prep: [] }

function PTM_nextFriday(){
  const d = new Date();
  const day = d.getDay(); // 0=Sun..6=Sat
  const daysUntilFriday = (5 - day + 7) % 7 || 7; // always the NEXT Friday, not today even if today is Friday
  d.setDate(d.getDate() + daysUntilFriday);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD for <input type="date">
}

function PTM_chipListHtml(containerId, field){
  const items = PTM_formItems[containerId][field];
  return items.length
    ? items.map((text, i) => `<span class="pill neu" style="display:inline-flex; align-items:center; gap:6px;">${PTM_esc(text)}
        <span onclick="PTM_removeFormItem('${containerId}','${field}',${i})" style="cursor:pointer; font-weight:bold;" title="Remove">✕</span></span>`).join('')
    : '<span class="cap">Nothing added yet.</span>';
}

function PTM_itemListHtml(containerId, field, label, placeholder){
  return `
    <label class="field-label-admin" style="margin-top:10px; display:block;">${PTM_esc(label)}</label>
    <div style="display:flex; gap:6px;">
      <input type="text" id="ptmNewItem-${field}-${containerId}" placeholder="${PTM_esc(placeholder)}" style="flex:1;"
        onkeydown="if(event.key==='Enter'){ event.preventDefault(); PTM_addFormItem('${containerId}','${field}'); }" />
      <button type="button" class="chip" onclick="PTM_addFormItem('${containerId}','${field}')">+ Add</button>
    </div>
    <div id="ptmItemList-${field}-${containerId}" style="display:flex; flex-wrap:wrap; gap:6px; margin-top:8px;">
      ${PTM_chipListHtml(containerId, field)}
    </div>`;
}

function PTM_addFormItem(containerId, field){
  const input = document.getElementById('ptmNewItem-' + field + '-' + containerId);
  const text = input.value.trim();
  if(!text) return;
  PTM_formItems[containerId][field].push(text);
  input.value = '';
  document.getElementById('ptmItemList-' + field + '-' + containerId).innerHTML = PTM_chipListHtml(containerId, field);
  input.focus();
}

function PTM_removeFormItem(containerId, field, index){
  PTM_formItems[containerId][field].splice(index, 1);
  document.getElementById('ptmItemList-' + field + '-' + containerId).innerHTML = PTM_chipListHtml(containerId, field);
}

const PTM_EVENT_TYPES = ['PTM', 'Teacher Training', 'Workshop', 'Other'];

function PTM_buildScheduleForm(containerId, opts, prefill){
  PTM_formItems[containerId] = { objectives: [], teacher_prep: [], supervisor_prep: [] };

  const wrap = PTM_el('div', 'card');
  wrap.style.marginTop = '14px';
  wrap.innerHTML = `
    <div class="hd"><div><h3>Schedule an event</h3><p class="cap">PTM-02 · this is the actual decision — teacher/principal/superadmin will see whatever is saved here. Saves for: <b>${PTM_esc(opts.contextLabel || 'the school/class selected above')}</b>.</p></div></div>
    <div style="margin-top:10px;">
      <label class="field-label-admin">Type</label>
      <select id="ptmTypeInput-${containerId}" onchange="PTM_onTypeChange('${containerId}')" style="width:100%; max-width:240px;">
        ${PTM_EVENT_TYPES.map(t => `<option value="${PTM_esc(t)}">${PTM_esc(t)}</option>`).join('')}
      </select>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
      <div><label class="field-label-admin">Date</label><input type="date" id="ptmDateInput-${containerId}" value="${PTM_nextFriday()}" /></div>
      <div><label class="field-label-admin">Time</label><input type="text" id="ptmTimeInput-${containerId}" placeholder="2:30 PM" value="2:30 PM" /></div>
      <div><label class="field-label-admin">Venue</label><input type="text" id="ptmVenueInput-${containerId}" placeholder="Classroom" value="Classroom" /></div>
      <div id="ptmInvitedWrap-${containerId}"><label class="field-label-admin">Households invited</label><input type="number" id="ptmInvitedInput-${containerId}" min="0" value="0" /></div>
    </div>
    <div id="ptmTitleWrap-${containerId}" style="display:none; margin-top:10px;">
      <label class="field-label-admin">Title</label>
      <input type="text" id="ptmTitleInput-${containerId}" placeholder="e.g. Using the Jadui Pitara kit" style="width:100%;" />
      <label class="field-label-admin" style="margin-top:10px; display:block;">Notes (optional)</label>
      <textarea id="ptmNotesInput-${containerId}" rows="2" style="width:100%;" placeholder="Who should attend, what to bring, etc."></textarea>
    </div>
    <div id="ptmPtmFieldsWrap-${containerId}">
      ${PTM_itemListHtml(containerId, 'objectives', 'Objectives', "e.g. Share each child's growth snapshot")}
      ${PTM_itemListHtml(containerId, 'teacher_prep', "Teacher's prep checklist", 'e.g. Print growth snapshots for every child')}
      ${PTM_itemListHtml(containerId, 'supervisor_prep', "Supervisor's prep checklist", 'e.g. Confirm venue is available')}
    </div>
    <div id="ptmScheduleResult-${containerId}" style="margin-top:8px;"></div>
    <button class="btn-primary" style="width:auto; padding:10px 20px; margin-top:14px;" onclick="PTM_submitSchedule('${containerId}', ${JSON.stringify(opts).replace(/"/g,'&quot;')})">Save</button>
  `;
  return wrap;
}

// Toggles between the PTM-specific fields (invited count, objectives,
// prep checklists) and the simple title/notes fields every other event
// type uses — same form, same Date/Time/Venue, just different bottom half.
function PTM_onTypeChange(containerId){
  const type = document.getElementById('ptmTypeInput-' + containerId).value;
  const isPtm = type === 'PTM';
  document.getElementById('ptmInvitedWrap-' + containerId).style.display = isPtm ? '' : 'none';
  document.getElementById('ptmPtmFieldsWrap-' + containerId).style.display = isPtm ? '' : 'none';
  document.getElementById('ptmTitleWrap-' + containerId).style.display = isPtm ? 'none' : '';
}

async function PTM_submitSchedule(containerId, opts){
  const resultEl = document.getElementById('ptmScheduleResult-' + containerId);
  const type = document.getElementById('ptmTypeInput-' + containerId).value;
  const meetingDate = document.getElementById('ptmDateInput-' + containerId).value;
  const selectedSchoolId = opts.schoolId;
  const selectedClassId = opts.classId;
  if(!meetingDate){
    if(resultEl) resultEl.innerHTML = '<div class="au-error">Pick a date first.</div>';
    return;
  }
  if(!selectedSchoolId){
    if(resultEl) resultEl.innerHTML = '<div class="au-error">Pick a school at the top of the page first.</div>';
    return;
  }
  if(type === 'PTM' && !selectedClassId){
    if(resultEl) resultEl.innerHTML = '<div class="au-error">Pick a class at the top of the page first — a PTM needs one specific teacher\'s class.</div>';
    return;
  }

  if(type !== 'PTM'){
    // Training / Workshop / Other — the generic events system.
    const title = document.getElementById('ptmTitleInput-' + containerId).value.trim();
    if(!title){
      if(resultEl) resultEl.innerHTML = '<div class="au-error">Title is required.</div>';
      return;
    }
    if(resultEl) resultEl.innerHTML = '<p class="sub">Saving…</p>';
    try{
      const res = await fetch('backend/add_event.php' + (opts.querySuffix || window.location.search), {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          school_id: selectedSchoolId,
          class_id: selectedClassId || null,
          event_type: type,
          event_date: meetingDate,
          event_time: document.getElementById('ptmTimeInput-' + containerId).value,
          title,
          notes: document.getElementById('ptmNotesInput-' + containerId).value.trim()
        })
      });
      const data = await res.json();
      if(data.status !== 'success'){
        if(resultEl) resultEl.innerHTML = `<div class="au-error">${PTM_esc(data.message || 'Could not save.')}</div>`;
        return;
      }
      if(opts.standaloneForm){
        const parent = document.getElementById(containerId);
        if(parent){
          parent.innerHTML = '';
          const banner = PTM_el('div', null, '✓ ' + PTM_esc(type) + ' saved.');
          banner.style.cssText = 'color:var(--good,#0ca30c); font-weight:600; margin-bottom:12px;';
          parent.appendChild(banner);
          parent.appendChild(PTM_buildScheduleForm(containerId, opts, null));
        }
      } else {
        renderPTMView(containerId, opts);
      }
    } catch(err){
      if(resultEl) resultEl.innerHTML = '<div class="au-error">Could not reach the server.</div>';
    }
    return;
  }

  // type === 'PTM'
  const items = PTM_formItems[containerId] || { objectives: [], teacher_prep: [], supervisor_prep: [] };
  const body = {
    school_id: selectedSchoolId,
    class_id: selectedClassId,
    meeting_date: meetingDate,
    meeting_time: document.getElementById('ptmTimeInput-' + containerId).value,
    venue: document.getElementById('ptmVenueInput-' + containerId).value,
    invited_count: document.getElementById('ptmInvitedInput-' + containerId).value,
    objectives: items.objectives,
    teacher_prep: items.teacher_prep,
    supervisor_prep: items.supervisor_prep
  };
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
    delete PTM_formItems[containerId];
    if(opts.standaloneForm){
      const parent = document.getElementById(containerId);
      if(parent){
        parent.innerHTML = '';
        const banner = PTM_el('div', null, '✓ PTM saved — it will now show up for teacher, principal, and superadmin.');
        banner.style.cssText = 'color:var(--good,#0ca30c); font-weight:600; margin-bottom:12px;';
        parent.appendChild(banner);
        parent.appendChild(PTM_buildScheduleForm(containerId, opts, null));
      }
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