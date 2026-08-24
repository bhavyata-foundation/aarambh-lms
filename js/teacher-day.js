/* =========================================================================
   TEACHER — MY DAY (v2, rebuilt against the extracted prototype design
   system). Uses REAL curriculum domain data (matching main.js's DOMAINS
   array). Delivery-tracking stats (sessions confirmed, week compliance,
   attendance, materials stock) are realistic PLACEHOLDER values for now —
   per the agreed "frontend first, database after" plan, none of this is
   read from a real backend yet.

   ADAPTATION FROM THE ORIGINAL PROTOTYPE: the original used hover-only
   tooltips (mouseenter/mousemove/mouseleave) for session detail — that
   doesn't work at all on phones/tablets, which real teachers will be
   using in a classroom. Replaced with tap-to-expand detail panels
   instead, same information, touch-friendly.
   ========================================================================= */

// ---------- low-level DOM helpers (matching the prototype's own) ----------
const $ = id => document.getElementById(id);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const f1 = n => (Math.round(n * 10) / 10).toFixed(1);

function grid(cls, items) { const g = el('div', 'g ' + cls); items.forEach(i => i && g.appendChild(i)); return g; }

function tile(k, v, unit, extra, formula, mtr) {
  const t = el('div', 'tile');
  t.appendChild(el('div', 'k', esc(k)));
  t.appendChild(el('div', 'v', v + (unit ? `<small> ${esc(unit)}</small>` : '')));
  if (extra) t.appendChild(el('div', 'd', extra));
  if (mtr) t.appendChild(mtr);
  if (formula) t.appendChild(el('div', 'f', esc(formula)));
  return t;
}

function pill(b) { return `<span class="pill ${b.c}">${esc(b.l)}</span>`; }
function pillTxt(l, c) { return `<span class="pill ${c || 'neu'}">${esc(l)}</span>`; }

function meter(pct, cls) {
  const m = el('div', 'meter' + (cls ? ' ' + cls : ''));
  const i = el('i'); i.style.width = Math.max(0, Math.min(100, pct)) + '%'; m.appendChild(i);
  return m;
}

function sec(title, right) {
  const s = el('div', 'sec'); s.appendChild(el('h2', null, esc(title))); s.appendChild(el('div', 'hr'));
  if (right) s.appendChild(el('div', null, right));
  return s;
}

function card(title, cap, body, extraHd) {
  const c = el('div', 'card');
  if (title) {
    const hd = el('div', 'hd');
    const box = el('div'); box.appendChild(el('h3', null, esc(title)));
    if (cap) box.appendChild(el('p', 'cap', cap));
    hd.appendChild(box);
    if (extraHd) { const sp = el('div', 'sp', extraHd); hd.appendChild(sp); }
    c.appendChild(hd);
  }
  if (body) c.appendChild(body);
  return c;
}

function statusBand(pct, good, warn) {
  if (pct >= (good || 85)) return {l:'On track', c:'good'};
  if (pct >= (warn || 70)) return {l:'Watch', c:'warn'};
  return {l:'Action', c:'crit'};
}

// Tap-to-expand detail panel, replacing the original's hover tooltip.
// Toggles a small detail box directly under the tapped card.
function bindTap(node, detailHtml) {
  node.style.cursor = 'pointer';
  node.addEventListener('click', () => {
    const existing = node.querySelector('.tapdetail');
    if (existing) { existing.remove(); return; }
    document.querySelectorAll('.tapdetail').forEach(d => d.remove());
    const d = el('div', 'tapdetail', detailHtml);
    d.style.cssText = 'margin-top:8px; padding:8px 10px; background:var(--surface-2); border-radius:8px; font-size:12px;';
    node.appendChild(d);
  });
  return node;
}

// ---------- real curriculum data (matches main.js's DOMAINS exactly) ----------
const DOMAINS = [
  {key:'welcome',  n:'Welcome & Free Play',   t:'9:00–9:20 AM',   cg:'CG-4'},
  {key:'story',    n:'Story / Rhyme',          t:'9:20–9:45 AM',   cg:'CG-9'},
  {key:'numeracy', n:'Numeracy',                t:'9:45–10:15 AM',  cg:'CG-8'},
  {key:'language', n:'Language',                t:'10:25–10:50 AM', cg:'CG-10'},
  {key:'create',   n:'Create + Fine Motor',     t:'10:50–11:20 AM', cg:'CG-12'},
  {key:'outdoor',  n:'Outdoor / Gross Motor',   t:'11:20–11:40 AM', cg:'CG-3'},
  {key:'tidy',     n:'Tidy & Put Away',          t:'11:40–11:45 AM', cg:'CG-11'},
  {key:'reflect',  n:'Reflect & Wrap',          t:'11:45 AM–12:00 PM', cg:'CG-9/10'}
];

const DAYNAMES = ['Mon','Tue','Wed','Thu','Fri'];
const WEEK_THEME = 'My Family'; // matches real Week 4 content built earlier
const CURRENT_WEEK = 4;

// Placeholder per-day delivery status — a realistic mix, clearly a
// stand-in until real attendance/delivery tracking exists in the backend.
const PLACEHOLDER_DELIVERY = {
  0: ['delivered','delivered','delivered','modified','delivered','delivered','not delivered','delivered'], // Mon
  1: ['delivered','delivered','delivered','delivered','delivered','delivered','delivered','delivered'],     // Tue
  2: ['delivered','modified','delivered','delivered','not delivered','delivered','delivered','delivered'],  // Wed
  3: ['delivered','delivered','delivered','delivered','delivered','modified','delivered','delivered'],      // Thu
  4: ['delivered','delivered','delivered','delivered','delivered','delivered','delivered','delivered']      // Fri
};
const PLACEHOLDER_REASON = {6: 'time lost to assembly'}; // index 6 = Tidy & Put Away, on Monday

const PLACEHOLDER_MATERIALS = [
  {item:'Crayon boxes', issued:10, uses:14, state:'ok'},
  {item:'Worksheet paper', issued:200, uses:88, state:'low'},
  {item:'Story picture cards', issued:1, uses:22, state:'ok'},
  {item:'Bead threading kits', issued:15, uses:6, state:'ok'},
  {item:'Clay for modelling', issued:5, uses:2, state:'damaged'}
];

let currentDay = 0; // 0=Mon

function vTeacherDay() {
  const m = $('mainWrap');
  m.innerHTML = '';

  const delivery = PLACEHOLDER_DELIVERY[currentDay];
  const done = delivery.filter(s => s !== 'not delivered').length;
  const weekPct = 87.5; // placeholder — real formula: delivered ÷ planned across the week
  const modifiedCount = Object.values(PLACEHOLDER_DELIVERY).flat().filter(s => s === 'modified').length;
  const classPresent = 26, classTotal = 28; // matches figures already shown elsewhere in the app
  const myAttendancePct = 96;

  m.appendChild(grid('g4', [
    tile('Sessions confirmed', done + ' of 8', '',
      pill(statusBand(done/8*100, 100, 75)),
      'LPC-01 · one tap per session', meter(done/8*100, done===8 ? 'good' : 'warn')),
    tile('Week compliance', f1(weekPct), '%',
      pill(statusBand(weekPct)) + pillTxt(modifiedCount + ' modified', 'info'),
      'delivered ÷ planned', meter(weekPct)),
    tile('Class present today', classPresent + ' of ' + classTotal, '',
      pillTxt('Register saved', 'good'), 'TCH-08 · persisted per date'),
    tile('My attendance', myAttendancePct, '%',
      pillTxt('Marked present 9:04 AM', 'good'), 'TCH-01 · gate at first class start')
  ]));

  const dayBar = el('div', 'fbar');
  dayBar.innerHTML = '<div class="ctl"><label>Teaching day</label><div style="display:flex;gap:5px" id="dayChips"></div></div>';
  m.appendChild(dayBar);
  const dc = $('dayChips');
  DAYNAMES.forEach((dn, i) => {
    const b = el('button', 'chip' + (i === currentDay ? ' sel' : ''), dn);
    b.onclick = () => { currentDay = i; vTeacherDay(); };
    dc.appendChild(b);
  });

  m.appendChild(sec(
    'Week ' + CURRENT_WEEK + ' · ' + WEEK_THEME + ' · ' + DAYNAMES[currentDay],
    '<span class="reqs">LPC-01…04 · TLM-03/04 · TCH-14…17</span>'
  ));

  const g = el('div', 'g g4');
  DOMAINS.forEach((d, i) => {
    const status = delivery[i];
    const c = el('div', 'per' + (status === 'delivered' ? ' done' : (status === 'not delivered' ? ' miss' : '')));
    const reason = PLACEHOLDER_REASON[i] && status === 'not delivered' ? PLACEHOLDER_REASON[i] : null;
    c.innerHTML = `<div class="ph"><span class="pn">${esc(d.n)}</span></div>
      <div class="pt">${esc(d.t)} · ${esc(d.cg)}</div>
      <div class="pf">
        <span class="chip ${status==='delivered' ? 'gd' : ''}">${status==='delivered' ? '✓ Delivered' : (status==='modified' ? '~ Modified' : '✗ Not delivered')}</span>
        ${reason ? `<span class="pill warn">${esc(reason)}</span>` : ''}
      </div>`;
    bindTap(c, `<b>${esc(d.n)}</b><div class="r"><span>Goal</span><span>${esc(d.cg)}</span></div><div class="r"><span>Time</span><span>${esc(d.t)}</span></div><div class="r"><span>Status</span><span>${esc(status)}</span></div>`);
    g.appendChild(c);
  });
  m.appendChild(g);

  m.appendChild(sec('Materials needed this week', '<span class="reqs">TLM-09</span>'));
  m.appendChild(card(null, null, el('div', 'list',
    PLACEHOLDER_MATERIALS.map(k => `<div class="row"><div class="t"><b>${esc(k.item)}</b><span>${k.issued} issued · used ${k.uses} times this term</span></div>
    <div>${k.state==='ok' ? pillTxt('In stock','good') : (k.state==='low' ? pillTxt('Low stock','warn') : pillTxt('Damaged','crit'))}</div></div>`).join(''))));

  m.appendChild(sec('Suggestions for next week', '<span class="reqs">AIR-02…07 · advisory only</span>'));
  const sg = el('div', 'g g2');
  sg.appendChild(card('Revisit a domain', 'Rule: two or more assessment points with over 40% at the lowest tier.',
    el('div', null, `<p style="margin:0 0 8px">Suggest a revisit session for <b>Numeracy</b> (28% at lowest tier this month), using the authored activities for CG-8.</p>
    <div style="display:flex;gap:6px"><span class="chip sel">Accept</span><span class="chip">Edit</span><span class="chip">Reject</span></div>
    <p class="cap" style="margin:8px 0 0">Evidence: 28 children × 2 assessment points. AIR-05 requires this line.</p>`)));
  sg.appendChild(card('A session keeps slipping', 'Pattern across the last 2 weeks.',
    el('div', null, `<p style="margin:0 0 8px"><b>Tidy & Put Away</b> was not delivered 2 times this fortnight. Most common reason: time lost to assembly.</p>
    <div style="display:flex;gap:6px"><span class="chip sel">Accept</span><span class="chip">Edit</span><span class="chip">Reject</span></div>`)));
  m.appendChild(sg);
}

// ---------- nav wiring ----------
document.querySelectorAll('.nav a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav a').forEach(x => x.classList.remove('on'));
    a.classList.add('on');
    const view = a.getAttribute('data-view');
    if (view === 't-day') {
      vTeacherDay();
    } else {
      $('mainWrap').innerHTML = '<div class="card"><p style="margin:0; color:var(--ink-3);">This screen isn\'t built yet — coming in a later pass.</p></div>';
    }
  });
});

vTeacherDay();