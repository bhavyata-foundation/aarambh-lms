const CATEGORIES = [
  {key:'A', label:'CLASS FUNCTIONING', items:[
    'Shift started on time, teacher present',
    'Teacher actively engaging children, not idle',
    'Planned activity of the day actually taught',
    'Free play / outdoor activity held'
  ]},
  {key:'B', label:'CURRICULUM & WEEKLY PLAN', items:[
    'Weekly plan displayed and being followed',
    'Monthly theme reflected in activity and display',
    'Worksheets and assessment records up to date',
    "Teacher's diary / lesson notes current"
  ]},
  {key:'C', label:'LEARNING AIDS (TLM)', items:[
    'TLM available for the current theme',
    "TLM actually used in today's session",
    'Charts at child height; aids in good condition'
  ]},
  {key:'D', label:'STATIONERY & MATERIAL', items:[
    'Stock adequate; issue register signed',
    "Children's material in active use",
    'No wastage; stored tidily and accessibly'
  ]},
  {key:'E', label:'CLEANLINESS & HYGIENE', items:[
    'Classroom, mats and furniture clean',
    'Drinking water clean and covered',
    'Toilet clean, usable, child-accessible',
    'Handwashing before snack; children groomed'
  ]},
  {key:'F', label:'DISCIPLINE & BEHAVIOUR', items:[
    'Daily routine followed, class orderly',
    'Behaviour managed positively, no harsh action',
    'No incident, hazard or child-protection concern'
  ]}
];

const TEACHERS = [
  {name:'Mrs. Sharma', cls:'Jr KG B', status:'pending'},
  {name:'Mrs. Iyer', cls:'Sr KG A', status:'pending'},
  {name:'Ms. Fernandes', cls:'Jr KG A', status:'pending'},
  {name:'Mrs. Nair', cls:'Sr KG B', status:'done'},
  {name:'Mr. Rane', cls:'Jr KG C', status:'done'}
];

const ATTENDANCE_ROWS = [
  {div:'Jr KG A', enrl:24, pres:22, followUp:''},
  {div:'Jr KG B', enrl:28, pres:26, followUp:''},
  {div:'Sr KG A', enrl:25, pres:24, followUp:''},
  {div:'Sr KG B', enrl:23, pres:19, followUp:''}
];

const HISTORY = [
  {date:'11 Aug', teacher:'Mrs. Nair — Sr KG B', score:94, flag:false},
  {date:'11 Aug', teacher:'Mr. Rane — Jr KG C', score:72, flag:true},
  {date:'8 Aug', teacher:'Mrs. Sharma — Jr KG B', score:88, flag:false},
  {date:'7 Aug', teacher:'Ms. Fernandes — Jr KG A', score:65, flag:true},
  {date:'5 Aug', teacher:'Mrs. Iyer — Sr KG A', score:91, flag:false}
];

let activeTeacherIdx = 0;
const ratings = {};
const observations = {};
let expandedCats = {A:true, B:false, C:false, D:false, E:false, F:false, attendance:true};

function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarBackdrop').classList.toggle('show');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').classList.remove('show');
}

function switchSection(section){
  document.getElementById('navVisits').classList.toggle('active', section === 'visits');
  document.getElementById('navHistory').classList.toggle('active', section === 'history');
  document.getElementById('section-visits').classList.toggle('hidden', section !== 'visits');
  document.getElementById('section-history').classList.toggle('hidden', section !== 'history');
  if(section === 'history') renderHistory();
  closeSidebar();
}

function renderTeacherList(){
  const list = document.getElementById('teacher-list');
  list.innerHTML = TEACHERS.map((t, i) => `
    <div class="teacher-item ${i===activeTeacherIdx?'active':''} ${t.status==='done'?'visited':''}" onclick="selectTeacher(${i})">
      <div class="teacher-avatar">${t.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
      <div class="teacher-info">
        <div class="teacher-name">${t.name}</div>
        <div class="teacher-meta">${t.cls}</div>
      </div>
      <div class="teacher-badge ${t.status}">${t.status==='done'?'Visited':'Pending'}</div>
    </div>
  `).join('');
  document.getElementById('pendingStat').textContent = TEACHERS.filter(t => t.status === 'pending').length;
}

function selectTeacher(i){
  activeTeacherIdx = i;
  const t = TEACHERS[i];
  document.getElementById('activeTeacherName').textContent = `${t.name} — ${t.cls}`;
  renderTeacherList();
  closeSidebar();
}

function toggleCat(key){
  expandedCats[key] = !expandedCats[key];
  if(key === 'attendance'){
    document.getElementById('body-attendance').classList.toggle('collapsed', !expandedCats[key]);
    document.getElementById('chev-attendance').classList.toggle('open', expandedCats[key]);
  } else {
    renderChecklist();
  }
}

function expandAll(){
  Object.keys(expandedCats).forEach(k => expandedCats[k] = true);
  document.getElementById('body-attendance').classList.remove('collapsed');
  document.getElementById('chev-attendance').classList.add('open');
  renderChecklist();
}

function setRating(catKey, idx, level){
  ratings[catKey + '-' + idx] = level;
  renderChecklist();
}

function setObservation(catKey, idx, val){
  observations[catKey + '-' + idx] = val;
  updateCompletion();
}

function renderChecklist(){
  const container = document.getElementById('checklist-container');
  container.innerHTML = CATEGORIES.map(cat => {
    const total = cat.items.length;
    const rated = cat.items.filter((_, i) => ratings[cat.key + '-' + i]).length;
    const isOpen = expandedCats[cat.key];
    const rows = cat.items.map((text, i) => {
      const key = cat.key + '-' + i;
      const r = ratings[key] || '';
      return `<div class="check-row">
        <span class="check-num">${i+1}</span>
        <span class="check-text">${text}</span>
        <div class="check-controls">
          <button class="rate-btn good ${r==='good'?'active':''}" title="Good" onclick="setRating('${cat.key}',${i},'good')">✓</button>
          <button class="rate-btn bad ${r==='bad'?'active':''}" title="Needs attention" onclick="setRating('${cat.key}',${i},'bad')">✕</button>
          <button class="rate-btn na ${r==='na'?'active':''}" title="Not applicable" onclick="setRating('${cat.key}',${i},'na')">–</button>
        </div>
        <div class="obs-row"><input type="text" placeholder="Observation / evidence (optional)" oninput="setObservation('${cat.key}',${i},this.value)" /></div>
      </div>`;
    }).join('');

    return `<div class="checklist-cat">
      <div class="cat-head" onclick="toggleCat('${cat.key}')">
        <span>${cat.key} · ${cat.label} <span class="cat-progress">— ${rated}/${total} rated</span></span>
        <span class="cat-chevron ${isOpen?'open':''}">▶</span>
      </div>
      <div class="cat-body ${isOpen?'':'collapsed'}">${rows}</div>
    </div>`;
  }).join('');
  updateCompletion();
}

function renderAttendance(){
  const rows = ATTENDANCE_ROWS.map((r, i) => {
    const pct = Math.round((r.pres / r.enrl) * 100);
    const pctClass = pct >= 90 ? 'high' : 'low';
    return `<tr>
      <td><strong>${r.div}</strong></td>
      <td><input type="number" value="${r.enrl}" disabled /></td>
      <td><input type="number" value="${r.pres}" onchange="updateAttendance(${i}, this.value)" /></td>
      <td><span class="pct-pill ${pctClass}">${pct}%</span></td>
      <td><input type="text" placeholder="e.g. 2 absentees called, on leave"
      value="${r.followUp}" oninput="updateFollowUp(${i}, this.value)" /></td>
    </tr>`;
  }).join('');
  document.getElementById('attendance-rows').innerHTML = rows;
}

function updateAttendance(i, val){
  ATTENDANCE_ROWS[i].pres = parseInt(val) || 0;
  renderAttendance();
}

function updateFollowUp(i, val){
  ATTENDANCE_ROWS[i].followUp = val;
}

function updateCompletion(){
  const totalItems = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
  const ratedItems = Object.keys(ratings).length;
  const pct = totalItems ? Math.round((ratedItems / totalItems) * 100) : 0;
  document.getElementById('completionPct').textContent = pct + '%';
}

function submitChecklist(){
  const totalItems = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0);
  const ratedItems = Object.keys(ratings).length;
  if(ratedItems < totalItems){
    alert(`Only ${ratedItems} of ${totalItems} items rated. In the live version this would prompt you to complete the checklist before submitting.`);
  }
  TEACHERS[activeTeacherIdx].status = 'done';
  renderTeacherList();
  alert("Visit report submitted (demo only — not sent to server). This would post to the backend and update the teacher's supervisor rating.");
}

function renderHistory(){
  document.getElementById('history-list').innerHTML = HISTORY.map(h => `
    <div class="vh-row">
      <span class="vh-date">${h.date}</span>
      <span class="vh-teacher">${h.teacher}</span>
      <span class="vh-score ${h.score>=80?'good':'warn'}">${h.score}%</span>
      <span class="vh-flag">${h.flag ? '🚩 Flagged' : '—'}</span>
      <span></span>
    </div>
  `).join('');
}

renderTeacherList();
renderChecklist();
renderAttendance();