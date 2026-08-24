/* =========================================================
   SHARED EVENTS CALENDAR — one component, used identically on
   the teacher, supervisor, and superadmin pages.

   READ-ONLY MODE (teacher, superadmin):
     initEventsCalendar('containerId', fetchUrl);
   Tap a day to see what's scheduled. No add capability.

   ADD-ENABLED MODE (supervisor):
     initEventsCalendar('containerId', fetchUrl, {
       canAdd: true,
       schools: [...],                          // already fetched by the caller
       addEventEndpoint: 'backend/add_event.php',
       classesEndpointBase: 'backend/get_classes_for_school.php'
     });
   Tap a day to see what's scheduled AND get a compact
   "+ Add event" button right there — no separate form sitting
   elsewhere on the page. The date is implied by which day was
   tapped, so it's never re-typed.
   ========================================================= */

const EVENT_TYPE_COLORS = {
  'PTM': 'var(--primary)',
  'Teacher Training': '#8b5cf6',
  'Other': 'var(--text-muted)'
};

function initEventsCalendar(containerId, fetchUrl, options = {}){
  const container = document.getElementById(containerId);
  if(!container) return;

  const canAdd = !!options.canAdd;
  const schools = options.schools || [];
  const addEventEndpoint = options.addEventEndpoint || '';
  const classesEndpointBase = options.classesEndpointBase || '';

  const state = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    events: [],
    selectedDateKey: null,
    addFormOpen: false
  };

  container.innerHTML = `<p class="sub">Loading events…</p>`;

  function loadEvents(){
    return fetch(fetchUrl)
      .then(r => r.json())
      .then(data => {
        if(data.status !== 'success'){
          container.innerHTML = `<p class="sub">Could not load events right now.</p>`;
          return false;
        }
        state.events = data.events;
        return true;
      })
      .catch(() => {
        container.innerHTML = `<p class="sub">Could not reach the server.</p>`;
        return false;
      });
  }

  loadEvents().then(ok => { if(ok) renderMonth(); });

  function eventsOnDate(dateKey){
    return state.events.filter(e => e.event_date === dateKey);
  }

  function shiftMonth(delta){
    state.month += delta;
    if(state.month > 11){ state.month = 0; state.year++; }
    if(state.month < 0){ state.month = 11; state.year--; }
    state.selectedDateKey = null;
    state.addFormOpen = false;
    renderMonth();
  }

  function selectDay(dateKey){
    state.selectedDateKey = (state.selectedDateKey === dateKey) ? null : dateKey;
    state.addFormOpen = false;
    renderMonth();
  }

  function toggleAddForm(){
    state.addFormOpen = !state.addFormOpen;
    renderMonth();
    if(state.addFormOpen) loadClassesForPicker();
  }

  window.__eventsCalendarShiftMonth = shiftMonth;
  window.__eventsCalendarSelectDay = selectDay;
  window.__eventsCalendarToggleAddForm = toggleAddForm;
  window.__eventsCalendarPickType = function(type){
    document.getElementById('ecEvType').value = type;
    document.querySelectorAll('#ecTypeToggle button').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-type') === type);
    });
    const titleEl = document.getElementById('ecTitle');
    if(!titleEl.value || ['PTM','Teacher Training','Other'].includes(titleEl.value)){
      titleEl.value = type;
    }
  };
  window.__eventsCalendarLoadClasses = loadClassesForPicker;
  window.__eventsCalendarSubmit = submitNewEventFromCalendar;

  function loadClassesForPicker(){
    const schoolId = document.getElementById('ecSchool')?.value;
    const classSelect = document.getElementById('ecClass');
    if(!classSelect) return;
    classSelect.innerHTML = `<option value="">— Whole school —</option>`;
    if(!schoolId) return;

    fetch(classesEndpointBase + (classesEndpointBase.includes('?') ? '&' : '?') + 'school_id=' + schoolId)
      .then(r => r.json())
      .then(data => {
        if(data.status === 'success'){
          data.classes.forEach(c => {
            classSelect.innerHTML += `<option value="${c.id}">${c.name} — ${c.teacher_name}</option>`;
          });
        }
      })
      .catch(() => {});
  }

  function submitNewEventFromCalendar(event){
    event.preventDefault();
    const resultEl = document.getElementById('ecAddResult');
    resultEl.innerHTML = '';

    const payload = {
      school_id: document.getElementById('ecSchool').value,
      class_id: document.getElementById('ecClass').value || null,
      event_type: document.getElementById('ecEvType').value,
      event_date: state.selectedDateKey,
      event_time: document.getElementById('ecTime').value || null,
      title: document.getElementById('ecTitle').value.trim(),
      notes: document.getElementById('ecNotes').value.trim()
    };

    if(!payload.school_id || !payload.title){
      resultEl.innerHTML = `<div class="au-error">School and title are both required.</div>`;
      return false;
    }

    fetch(addEventEndpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(data => {
        if(data.status !== 'success'){
          resultEl.innerHTML = `<div class="au-error">${data.message}</div>`;
          return;
        }
        state.addFormOpen = false;
        loadEvents().then(ok => { if(ok) renderMonth(); });
      })
      .catch(() => {
        resultEl.innerHTML = `<div class="au-error">Could not reach the server.</div>`;
      });

    return false;
  }

  function renderAddFormHtml(){
    if(!canAdd) return '';
    if(!state.addFormOpen){
      return `<button class="ec-add-btn" onclick="window.__eventsCalendarToggleAddForm()">+ Add event on this day</button>`;
    }
    return `
      <form onsubmit="return window.__eventsCalendarSubmit(event)" style="margin-top:10px; padding:14px; background:var(--surface-1, #f7f7f5); border-radius:10px;">
        <div class="add-event-quick-toggle" id="ecTypeToggle">
          <button type="button" class="active" data-type="PTM" onclick="window.__eventsCalendarPickType('PTM')">PTM</button>
          <button type="button" data-type="Teacher Training" onclick="window.__eventsCalendarPickType('Teacher Training')">Training</button>
          <button type="button" data-type="Other" onclick="window.__eventsCalendarPickType('Other')">Other</button>
        </div>
        <input type="hidden" id="ecEvType" value="PTM" />

        <label class="field-label-admin">School</label>
        <select id="ecSchool" onchange="window.__eventsCalendarLoadClasses()" required>
          <option value="">— Select a school —</option>
          ${schools.map(s => `<option value="${s.id}">${s.name} (Ward ${s.ward})</option>`).join('')}
        </select>

        <label class="field-label-admin">Title</label>
        <input type="text" id="ecTitle" placeholder="e.g. First Term PTM" value="PTM" required />

        <label class="field-label-admin">Class (optional — leave blank for whole school)</label>
        <select id="ecClass"><option value="">— Whole school —</option></select>

        <label class="field-label-admin">Time (optional)</label>
        <input type="time" id="ecTime" />

        <label class="field-label-admin">Notes (optional)</label>
        <textarea id="ecNotes" rows="2" style="width:100%; padding:9px 10px; border:1px solid var(--border); border-radius:7px; font-family:inherit; font-size:13px;"></textarea>

        <div id="ecAddResult"></div>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button type="submit" class="btn-sup">Add event</button>
          <button type="button" class="btn-sup-outline" onclick="window.__eventsCalendarToggleAddForm()">Cancel</button>
        </div>
      </form>`;
  }

  function renderMonth(){
    const firstDay = new Date(state.year, state.month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
    const monthName = firstDay.toLocaleDateString([], {month:'long', year:'numeric'});
    const todayKey = new Date().toISOString().slice(0,10);

    let cellsHtml = '';
    for(let i = 0; i < startWeekday; i++) cellsHtml += '<div></div>';

    for(let d = 1; d <= daysInMonth; d++){
      const dateKey = `${state.year}-${String(state.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dayEvents = eventsOnDate(dateKey);
      const isToday = dateKey === todayKey;
      const isSelected = dateKey === state.selectedDateKey;

      let cellClass = 'cal-day';
      if(isToday) cellClass += ' cal-today';
      if(isSelected) cellClass += ' cal-day-selected';
      if(dayEvents.length) cellClass += ' has-events';

      const dots = dayEvents.slice(0,3).map(e =>
        `<span class="ev-dot" style="background:${EVENT_TYPE_COLORS[e.event_type] || 'var(--text-muted)'}"></span>`
      ).join('');

      cellsHtml += `
        <div class="${cellClass}" onclick="window.__eventsCalendarSelectDay('${dateKey}')">
          <span class="cal-day-num">${d}</span>
          ${dots ? `<span class="ev-dots">${dots}</span>` : ''}
        </div>`;
    }

    const selectedEvents = state.selectedDateKey ? eventsOnDate(state.selectedDateKey) : [];
    const selectedNiceDate = state.selectedDateKey
      ? new Date(state.selectedDateKey + 'T00:00:00').toLocaleDateString([], {weekday:'long', day:'numeric', month:'long', year:'numeric'})
      : null;

    container.innerHTML = `
      <div class="cal-header">
        <div><h1 style="font-size:18px;">${monthName}</h1></div>
        <div class="cal-nav">
          <button onclick="window.__eventsCalendarShiftMonth(-1)">‹</button>
          <button onclick="window.__eventsCalendarShiftMonth(1)">›</button>
        </div>
      </div>
      <div class="cal-weekdays">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div class="cal-grid events-cal-grid">${cellsHtml}</div>
      <div class="cal-legend">
        <span><i class="dot" style="background:${EVENT_TYPE_COLORS['PTM']}"></i>PTM</span>
        <span><i class="dot" style="background:${EVENT_TYPE_COLORS['Teacher Training']}"></i>Teacher Training</span>
        <span><i class="dot" style="background:${EVENT_TYPE_COLORS['Other']}"></i>Other</span>
      </div>
      <div id="eventsCalDayDetail">
        ${state.selectedDateKey ? `
          <div class="cal-day-detail-box">
            <strong>${selectedNiceDate}</strong>
            ${selectedEvents.length ? selectedEvents.map(e => `
              <div class="event-card" style="border-left:4px solid ${EVENT_TYPE_COLORS[e.event_type] || 'var(--text-muted)'}; margin-top:10px;">
                <div class="event-card-head">
                  <span class="event-type-tag" style="background:${EVENT_TYPE_COLORS[e.event_type] || 'var(--text-muted)'};">${e.event_type}</span>
                  <span class="event-date">${e.event_time ? e.event_time.slice(0,5) : ''}</span>
                </div>
                <div class="event-title">${e.title}</div>
                <div class="event-scope">${e.school_name}${e.class_name ? ' — ' + e.class_name : ' — whole school'}</div>
                ${e.notes ? `<div class="event-notes">${e.notes}</div>` : ''}
              </div>
            `).join('') : '<p class="sub" style="margin-top:8px;">No events on this day.</p>'}
            ${renderAddFormHtml()}
          </div>
        ` : `<p class="sub" style="margin-top:14px;">Tap a day to see what's scheduled${canAdd ? ' or add something new' : ''}.</p>`}
      </div>
    `;
  }
}