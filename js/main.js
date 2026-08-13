let selectedRole = 'teacher';
  let currentWeekNum = 1;
  let currentDay = 'mon';

  const weeksWithContent = [1];

  const WEEKS = [
    {w:1, theme:'My Classroom', dates:'15–19 Jun 2026'},
    {w:2, theme:'My Body', dates:'22–26 Jun 2026'},
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


  const DAYS = [
    {key:'mon', label:'Monday', value:'Feel safe and happy in classroom', link:'First week of school'},
    {key:'tue', label:'Tuesday', value:'Keep bag, books, bottle clean and dry', link:'Monsoon readiness'},
    {key:'wed', label:'Wednesday', value:'Share toys and speak kindly', link:'Classroom family value'},
    {key:'thu', label:'Thursday', value:'Keep things back in proper place', link:'Clean classroom habit'},
    {key:'fri', label:'Friday', value:'Be brave, careful and responsible', link:'Shivaji Maharaj courage value'}
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

  // Real content from the Week 1 daily lesson plan you uploaded.
  // Same tasks apply Mon-Fri in this workbook; only the day's Value/Link changes.
  const WEEKLY_PLAN = {
    wk1: {
      welcome:  {mon:'Welcome song, explore classroom', tue:'Free play with classroom toys', wed:'Attendance & classroom talk', thu:'Free play with puzzles', fri:'Free play with blocks'},
      story:    {mon:'Story: My First Day in Class', tue:'Rhyme: Good Morning Teacher', wed:'Story: My Classroom Family', thu:'Rhyme: Keep Things Clean', fri:'Story: Shivaji Maharaj & Courage'},
      numeracy: {mon:'Identify classroom objects', tue:'Sort objects by colour', wed:'Sort objects by size', thu:'Sort objects by use', fri:'Sort objects independently'},
      language: {mon:'Name: bag, book, pencil, bottle', tue:'Colour words: red, blue, yellow', wed:'Big / small words', thu:'Use words: write, drink, eat, read', fri:'Speak: "This is my ___."'},
      create:   {mon:'Draw my school bag', tue:'Colour classroom objects', wed:'Big-small pasting', thu:'Bag item collage', fri:'Classroom object worksheet'},
      outdoor:  {mon:'Free outdoor play', tue:'Ball play', wed:'Balance walk', thu:'Ring play', fri:'Running game'},
      tidy:     {mon:'Put bag on hook, book on shelf', tue:'Return toys to the toy bin', wed:'Put pencil and crayon back in the box', thu:'"Keep things back in proper place"', fri:'Tidy the whole classroom before going home'},
      reflect:  {mon:'Name one classroom object', tue:'Name one colour', wed:'Show one big object', thu:'What do we use pencil for?', fri:'Recap & plant-care promise'}
    }
  };

  function currentWeekKey(){ return 'wk' + currentWeekNum; }

  function todaysActivity(domainKey){
    const wk = WEEKLY_PLAN[currentWeekKey()];
    if(!wk || !wk[domainKey]) return 'Not planned yet';
    return wk[domainKey][currentDay] || 'Not planned yet';
  }

  const SAMPLE_STUDENTS = ['Aarav Sharma','Priya Patil','Rohan Desai','Ananya Joshi','Kabir Mehta'];
  const RATING_LEVELS = ['Emerging','Progressing','Achieving','Exceeding'];

  function selectRole(role, el){
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
    el.classList.add('active');
  }

  function markAttendance(){
    document.getElementById('view-attendance').classList.add('hidden');
    document.getElementById('view-dashboard').classList.remove('hidden');
    const now = new Date();
    document.getElementById('attend-time').textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    renderSidebar();
    openWeek(currentWeekNum);
  }

function login(){
  if(selectedRole === 'teacher'){
    document.getElementById('view-login').classList.add('hidden');
    document.getElementById('view-attendance').classList.remove('hidden');
  } else if(selectedRole === 'supervisor'){
    window.location.href = 'supervisor.html';
  } else {
    alert('Parent flow not wired up yet in this prototype.');
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

  const attendanceRecords = {}; // key: date -> {studentName: 'present'|'absent'}
  let attendanceSaved = false;
  let attendanceSearchTerm = '';

  function todayKey(){ return new Date().toISOString().slice(0,10); }

  function switchSidebarSection(section){
    document.getElementById('navWorkbook').classList.toggle('active', section === 'workbook');
    document.getElementById('navAttendance').classList.toggle('active', section === 'attendance');
    document.getElementById('sidebar-workbook-section').classList.toggle('hidden', section !== 'workbook');

    if(section === 'attendance'){
      document.getElementById('week-body').classList.add('hidden');
      document.getElementById('attendance-body').classList.remove('hidden');
      document.getElementById('week-subheading').textContent =
        'Attendance · ' + new Date().toLocaleDateString([], {weekday:'long', day:'numeric', month:'short', year:'numeric'});
      renderAttendanceBody();
    } else {
      document.getElementById('attendance-body').classList.add('hidden');
      document.getElementById('week-body').classList.remove('hidden');
      openWeek(currentWeekNum);
    }
    closeSidebar();
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
            <span class="dt-label ${doneClass}" onclick="event.stopPropagation(); selectWeekDay(${w.w}, '${d.key}')">${d.label} — ${d.value}</span>
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
    document.getElementById('value-banner').innerHTML = `<strong>Value:</strong> ${day.value} &nbsp;·&nbsp; <strong>Link:</strong> ${day.link}`;

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
            <span class="name">${dom.label} <span class="stage-time">${dom.time}</span></span>
            <span class="stage-tag ${done?'done':''}">${done ? 'Done' : 'Not done'}</span>
          </div>
          <div class="materials-line">Planned activity: ${activity}</div>
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
          <span class="name">${dom.label} <span class="stage-time">${dom.time}</span></span>
          <span class="stage-tag ${done?'done':''}">${done ? 'Done today' : 'Pending'}</span>
        </div>
        <div class="materials-line">Planned activity: ${activity}</div>
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
        <span class="overview-domain">${dom.label}</span>
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
      bag:    {emoji:'🎒', label:'Bag'},
      book:   {emoji:'📖', label:'Book'},
      pencil: {emoji:'✏️', label:'Pencil'},
      bottle: {emoji:'🧴', label:'Bottle'},
      crayon: {emoji:'🖍️', label:'Crayon'},
      block:  {emoji:'🧱', label:'Block'}
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
          '<div class="g-lang-q" id="glq">What is this?</div>' +
          '<div class="g-lang-ans" id="gla"></div>' +
          '<div class="g-lang-sent" id="gls"></div>' +
          '<div class="g-lang-controls">' +
            '<button class="g-btn secondary" id="glp">◀ Prev</button>' +
            '<button class="g-btn" id="glr" style="background:var(--lang)">Reveal</button>' +
            '<button class="g-btn secondary" id="gln">Next ▶</button>' +
          '</div>' +
          '<div class="g-lang-prog" id="glg"></div>' +
        '</div>';
      var emojiEl = container.querySelector('#gle'), qEl = container.querySelector('#glq'),
          ansEl = container.querySelector('#gla'), sentEl = container.querySelector('#gls'),
          progEl = container.querySelector('#glg');
      function render(){
        progEl.textContent = (i+1) + ' of ' + order.length;
        emojiEl.textContent = '❓'; qEl.textContent = 'What is this?';
        ansEl.textContent = ''; sentEl.textContent = '';
      }
      container.querySelector('#glr').addEventListener('click', function(){
        var key = order[i], obj = OBJECTS[key];
        emojiEl.textContent = obj.emoji; qEl.textContent = 'It is a...';
        ansEl.textContent = obj.label + '!';
        sentEl.textContent = '“This is my ' + obj.label.toLowerCase() + '.”';
        revealed[key] = true;
        if(Object.keys(revealed).length >= order.length) onComplete();
      });
      container.querySelector('#glp').addEventListener('click', function(){ i=(i-1+order.length)%order.length; render(); });
      container.querySelector('#gln').addEventListener('click', function(){ i=(i+1)%order.length; render(); });
      render();
    }

    function renderNumeracyGame(container, onComplete){
      var groups = {
        writing:  {label:'Writing', icon:'✏️', items:['pencil','crayon']},
        reading:  {label:'Reading', icon:'📖', items:['book']},
        drinking: {label:'Drinking', icon:'🥤', items:['bottle']},
        playing:  {label:'Playing', icon:'🧱', items:['block']}
      };
      var allItems = [];
      Object.keys(groups).forEach(function(g){ groups[g].items.forEach(function(k){ allItems.push(k); }); });
      var total = allItems.length, placed = 0;
      var zonesHtml = Object.keys(groups).map(function(g){
        var grp = groups[g];
        return '<div class="g-zone" data-accepts="' + grp.items.join(',') + '"><h5>' + grp.icon + ' ' + grp.label + '</h5></div>';
      }).join('');
      var trayHtml = allItems.map(function(key){ return '<div class="g-chip" data-key="' + key + '">' + OBJECTS[key].emoji + '</div>'; }).join('');
      container.innerHTML =
        '<div class="g-sort-status" id="gss">Drag each item into its group (0 / ' + total + ')</div>' +
        '<div class="g-sort-tray">' + trayHtml + '</div>' +
        '<div class="g-zones">' + zonesHtml + '</div>';
      var statusEl = container.querySelector('#gss');
      var zones = Array.prototype.slice.call(container.querySelectorAll('.g-zone'));
      var chips = Array.prototype.slice.call(container.querySelectorAll('.g-chip'));
      chips.forEach(function(chip){
        enableDrag(chip, zones, function(){
          placed++;
          if(placed >= total){ statusEl.textContent = '🎉 All sorted!'; onComplete(); }
          else statusEl.textContent = 'Drag each item into its group (' + placed + ' / ' + total + ')';
        });
      });
    }

    function renderSocialGame(container, onComplete){
      var scenarios = [
        {text:'Your friend forgot their crayon. What do you do?', options:[
          {text:'Share your crayon with your friend', correct:true, feedback:'Sharing makes friends happy! 🤝'},
          {text:'Keep both crayons for yourself', correct:false, feedback:'That makes your friend feel left out.'}]},
        {text:'Everyone wants to talk at once. What should we do?', options:[
          {text:'Shout louder than everyone else', correct:false, feedback:'That makes it hard for anyone to be heard.'},
          {text:'Wait for your turn to speak', correct:true, feedback:'Waiting your turn shows kindness. ✅'}]},
        {text:'Your friend falls down while playing. What do you say?', options:[
          {text:'"Are you okay? Let me help you!"', correct:true, feedback:'A kind and caring response. 💛'},
          {text:'Laugh and walk away', correct:false, feedback:'That would make your friend feel sad.'}]}
      ];
      var i = 0, answered = {};
      container.innerHTML =
        '<div class="g-scenario">' +
          '<div class="g-scenario-text" id="gst"></div>' +
          '<div class="g-scenario-opts" id="gso"></div>' +
          '<div class="g-feedback" id="gsf"></div>' +
          '<div class="g-scenario-controls"><button class="g-btn" id="gsn" style="background:var(--soc)">Next scenario ▶</button></div>' +
        '</div>';
      var textEl = container.querySelector('#gst'), optsEl = container.querySelector('#gso'), fbEl = container.querySelector('#gsf');
      function render(){
        var s = scenarios[i], sIndex = i;
        textEl.textContent = s.text; fbEl.textContent = ''; optsEl.innerHTML = '';
        s.options.forEach(function(opt){
          var btn = document.createElement('button');
          btn.className = 'g-opt-btn'; btn.textContent = opt.text;
          btn.addEventListener('click', function(){
            Array.prototype.slice.call(optsEl.children).forEach(function(b){ b.disabled = true; });
            btn.classList.add(opt.correct ? 'correct' : 'incorrect');
            fbEl.textContent = opt.feedback;
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
        {icon:'🪝', label:'Hook',       accepts:['bag']},
        {icon:'📚', label:'Book Shelf', accepts:['book']},
        {icon:'👜', label:'Side Pocket',accepts:['bottle']},
        {icon:'✏️', label:'Pencil Box', accepts:['pencil','crayon']},
        {icon:'🗑️', label:'Toy Bin',    accepts:['block']}
      ];
      var items = ['bag','book','bottle','pencil','crayon','block'];
      var total = items.length, placed = 0;
      var zonesHtml = zones.map(function(z){
        return '<div class="g-life-zone" data-accepts="' + z.accepts.join(',') + '"><h5>' + z.icon + ' ' + z.label + '</h5></div>';
      }).join('');
      var trayHtml = items.map(function(key){ return '<div class="g-chip" data-key="' + key + '">' + OBJECTS[key].emoji + '</div>'; }).join('');
      container.innerHTML =
        '<div class="g-life-status" id="gls2">Put each item away (0 / ' + total + ')</div>' +
        '<div class="g-life-tray">' + trayHtml + '</div>' +
        '<div class="g-life-zones">' + zonesHtml + '</div>';
      var statusEl = container.querySelector('#gls2');
      var zoneEls = Array.prototype.slice.call(container.querySelectorAll('.g-life-zone'));
      var chips = Array.prototype.slice.call(container.querySelectorAll('.g-chip'));
      chips.forEach(function(chip){
        enableDrag(chip, zoneEls, function(){
          placed++;
          if(placed >= total){ statusEl.textContent = '🎉 Everything is in its place!'; onComplete(); }
          else statusEl.textContent = 'Put each item away (' + placed + ' / ' + total + ')';
        });
      });
    }

    function renderReflectGame(container, onComplete){
      const prompts = [
        "I can name it!",
        "I remember most of it",
        "I'll ask my teacher to explain again"
      ];
      container.innerHTML =
        '<div class="g-scenario">' +
          '<div class="g-scenario-text">Quick check — how did today go?</div>' +
          '<div class="g-scenario-opts" id="grOpts"></div>' +
          '<div class="g-feedback" id="grFeedback"></div>' +
        '</div>';
      const optsEl = container.querySelector('#grOpts');
      prompts.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'g-opt-btn';
        btn.textContent = text;
        btn.addEventListener('click', () => {
          Array.from(optsEl.children).forEach(b => b.disabled = true);
          btn.classList.add('correct');
          container.querySelector('#grFeedback').textContent = '🎉 Nicely wrapped up!';
          onComplete();
        });
        optsEl.appendChild(btn);
      });
    }

    function renderWelcomeExplore(container, onComplete){
      const hotspots = [
        {id:'board',  x:20,  y:14, w:70, h:40, emoji:'📝', label:'Whiteboard — where we learn together'},
        {id:'shelf',  x:150, y:18, w:38, h:60, emoji:'📚', label:'Book shelf — our story friends live here'},
        {id:'window', x:14,  y:96, w:42, h:38, emoji:'🪟', label:'Window — sunshine says hello!'},
        {id:'desk',   x:74,  y:100,w:56, h:36, emoji:'🪑', label:'Your desk — your very own spot'},
        {id:'plant',  x:150, y:100,w:32, h:32, emoji:'🌱', label:'Class plant — we take turns watering it'}
      ];
      const found = {};

      function renderStepOne(){
        container.innerHTML =
          '<div class="g-welcome-song">' +
            '<div class="g-welcome-note" id="gwNote">🎵</div>' +
            '<p class="g-welcome-lyric">"Good morning, Friends!, we\'re happy today!<br>Welcome to our classroom, come on in and play!"</p>' +
            '<div class="g-welcome-actions">' +
              '<button class="g-btn welcome-play-btn"  style="background:var(--primary)" id="gwPlay">▶ Play welcome song</button>' +
              '<button class="g-btn" id="gwNext" style="background:var(--primary)">We sang it! Let\'s explore →</button>' +
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
          `<div class="g-welcome-status" id="gwStatus">Tap around the room to explore (0 / ${hotspots.length})</div>
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
            statusEl.textContent = count < hotspots.length ? h.label : '🎉 You explored the whole classroom!';
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