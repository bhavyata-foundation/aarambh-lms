/* =========================================================
   SUPER ADMIN DASHBOARDS — add-on
   Loads AFTER js/superadmin.js. Everything below reads SCHOOLS,
   SUPERVISORS_LIST, and RATING_LEVELS from that file — it does not
   redeclare them, so your real 23-school seed data is untouched.

   ---------------------------------------------------------------
   COMPATIBILITY SHIM — real data has a slightly different shape
   than this add-on expects, so this block bridges the two:

   - Real SCHOOLS entries have `classes: [{name, teacher}, ...]`
     (one row for Jr KG, one for Sr KG). This add-on was written
     for one class per school, so `.class` / `.teacher` below are
     computed as a combined label across both.
   - Real SCHOOLS entries have no `.strength` (class size) field
     yet — a placeholder of 25 is used until real enrolment counts
     exist. Replace this the moment that data is available.
   ========================================================= */
SCHOOLS.forEach(function (sc) {
  if (!sc.class) {
    sc.class = sc.classes.map(function (c) { return c.name; }).join(' + ');
  }
  if (!sc.teacher) {
    sc.teacher = sc.classes.map(function (c) { return c.teacher || 'Unassigned'; }).join(' / ');
  }
  if (!sc.strength) {
    sc.strength = 25; // PLACEHOLDER — no real enrolment count in the seed data yet
  }
});

/* ============================================================
   SUPER ADMIN — dashboards add-on

   Three new sections:
     · Supervisor Dashboard  — all 5 supervisors, achieved vs planned
     · School Performance    — all 25 schools, one streamlined table
     · Quarterly Review      — period-on-period, with sign-off

   Loads AFTER js/superadmin.js and reads SCHOOLS, SUPERVISORS_LIST,
   RATING_LEVELS, schoolName() and supervisorName() from it.

   All figures are generated deterministically from a seeded LCG (no
   Math.random, so the numbers are stable across reloads and reviews).
   In production every ADMIN_* accessor below is one API call.

   ---- METRIC DEFINITIONS (agreed 14 Aug 2026) -------------------
   Domain score        mean of the 8 domain proficiency ratings
                       (Emerging=1 … Exceeding=4), normalised:
                       (mean - 1) / 3 * 100
   Curriculum coverage planned slots delivered / planned slots
                       (8 slots x 5 days x weeks in period)
   Student Readiness   0.50 * domain score
     Index (SRI)     + 0.25 * attendance %
                     + 0.25 * curriculum coverage %
                       A class scores well only if children are
                       learning AND present AND the plan is delivered.
   Class Performance   SRI(class) / SRI(programme mean), 2dp.
     Ratio             1.00 = at par. Shown beside the raw
                       proportion at or above 'Achieving'.
   ---------------------------------------------------------------
   These are NOT signed off. Gate G5 (end of week 10) is where
   programme leads fix the impact indicator definitions. Until then
   treat every SRI and ratio on screen as illustrative.
   ============================================================ */

/* ---------- periods ---------- */

const ADM_MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* Jun 2025 → Aug 2026. The prior academic year is complete, which is
   what makes quarter-on-quarter and annual comparison demonstrable. */
const ADMIN_MONTHS = (function () {
  const out = [];
  for (let i = 0; i < 15; i++) {
    const d = new Date(2025, 5 + i, 1);
    out.push({ idx: i, y: d.getFullYear(), m: d.getMonth(), label: ADM_MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear() });
  }
  return out;
})();

const ADMIN_CURRENT_MONTH = 14;            // Aug 2026, month to date
const ADMIN_PARTIAL_FROM  = 14;            // months >= this are incomplete

const ADMIN_QUARTERS = [
  { key: 'q1-2526', label: 'Q1 2025–26', span: 'Jun–Aug 2025', months: [0, 1, 2] },
  { key: 'q2-2526', label: 'Q2 2025–26', span: 'Sep–Nov 2025', months: [3, 4, 5] },
  { key: 'q3-2526', label: 'Q3 2025–26', span: 'Dec 2025–Feb 2026', months: [6, 7, 8] },
  { key: 'q4-2526', label: 'Q4 2025–26', span: 'Mar–May 2026', months: [9, 10, 11] },
  { key: 'q1-2627', label: 'Q1 2026–27', span: 'Jun–Aug 2026', months: [12, 13, 14], partial: true }
];

const ADMIN_YEARS = [
  { key: 'y2526', label: '2025–26', span: 'Jun 2025 – May 2026', months: [0,1,2,3,4,5,6,7,8,9,10,11] },
  { key: 'y2627', label: '2026–27', span: 'Jun – Aug 2026', months: [12, 13, 14], partial: true }
];

/* ---------- the 8 curriculum domains (same as the teacher view) ---------- */

const ADMIN_DOMAINS = [
  'Welcome & Free Play', 'Story / Rhyme', 'Numeracy', 'Language',
  'Create + Fine Motor', 'Outdoor / Gross Motor', 'Tidy & Put Away', 'Reflect & Wrap'
];

/* ---------- deterministic generator ---------- */

function admLcg(seed) {
  let s = (seed | 0) || 1;
  return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
}
function admHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) & 0x7fffffff; }
  return h;
}
function admClamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* Each school gets a stable latent quality so rankings hold month to
   month, plus a slow improving trend and per-month noise. */
const ADMIN_SCHOOL_PROFILE = {};
SCHOOLS.forEach(function (sc, i) {
  const r = admLcg(admHash(sc.id) + 7);
  ADMIN_SCHOOL_PROFILE[sc.id] = {
    quality: 0.30 + r() * 0.62,      // 0.30–0.92
    attendBias: -0.06 + r() * 0.14,
    coverBias: -0.08 + r() * 0.16,
    trend: 0.004 + r() * 0.012       // improvement per month
  };
});

/* A common shock every school feels in the same month — monsoon dips,
   festival weeks, exam months. Without this the programme mean rises in a
   perfectly straight line and the quarterly chart looks synthetic. */
const ADMIN_MONTH_SHOCK = (function () {
  const r = admLcg(90210);
  return ADMIN_MONTHS.map(function () { return (r() - 0.5) * 0.10; });
})();

const ADMIN_SCHOOL_MONTH_CACHE = {};

function admSchoolMonth(schoolId, monthIdx) {
  const key = schoolId + '|' + monthIdx;
  if (ADMIN_SCHOOL_MONTH_CACHE[key]) return ADMIN_SCHOOL_MONTH_CACHE[key];

  const p = ADMIN_SCHOOL_PROFILE[schoolId];
  const r = admLcg(admHash(key));
  const shock = ADMIN_MONTH_SHOCK[monthIdx] || 0;
  const base = admClamp(p.quality + p.trend * monthIdx + shock, 0.05, 0.99);

  const attendance = Math.round(admClamp(base * 0.28 + 0.66 + p.attendBias + (r() - 0.5) * 0.09, 0.55, 0.99) * 100);
  const coverage   = Math.round(admClamp(base * 0.36 + 0.58 + p.coverBias + (r() - 0.5) * 0.11, 0.40, 1.00) * 100);
  const worksheets = Math.round(admClamp(base * 0.42 + 0.52 + (r() - 0.5) * 0.13, 0.35, 1.00) * 100);

  /* 8 domain ratings on the 1–4 scale, centred on the school's quality */
  const domains = ADMIN_DOMAINS.map(function () {
    const raw = 1 + base * 2.7 + (r() - 0.5) * 1.1;
    return admClamp(Math.round(raw * 10) / 10, 1, 4);
  });
  const domainMean = domains.reduce(function (a, b) { return a + b; }, 0) / domains.length;
  const domainScore = Math.round((domainMean - 1) / 3 * 100);

  /* Student-level: enrolment from the school record, share at/above Achieving
     driven by the same latent quality. */
  const sc = SCHOOLS.find(function (x) { return x.id === schoolId; });
  const enrolled = sc.strength;
  const atAchieving = Math.round(admClamp(base * 0.78 + 0.06 + (r() - 0.5) * 0.12, 0.02, 0.96) * enrolled);

  const out = {
    monthIdx: monthIdx, schoolId: schoolId,
    attendance: attendance, coverage: coverage, worksheets: worksheets,
    domains: domains, domainMean: domainMean, domainScore: domainScore,
    enrolled: enrolled, atAchieving: atAchieving
  };
  ADMIN_SCHOOL_MONTH_CACHE[key] = out;
  return out;
}

/* Supervisor activity per month. Visit targets scale with the 5 schools
   each supervisor holds; trainings are monthly, PTMs quarterly. */
function admSupervisorMonth(supId, monthIdx) {
  const r = admLcg(admHash(supId + '|' + monthIdx) + 31);
  const sup = SUPERVISORS_LIST.find(function (s) { return s.id === supId; });
  const reliability = 0.62 + admLcg(admHash(supId) + 3)() * 0.34;

  const visitsPlanned = sup.schools.length * 3;                     // 3 visits per school per month
  const visitsDone = Math.round(admClamp(reliability + (r() - 0.5) * 0.22, 0.35, 1) * visitsPlanned);

  const trainingsPlanned = 1;
  const trainingsDone = (r() < reliability + 0.12) ? 1 : 0;

  const isPtmMonth = [2, 5, 8, 11, 14].indexOf(monthIdx) > -1;      // end of each quarter
  const ptmPlanned = isPtmMonth ? sup.schools.length : 0;
  const ptmDone = ptmPlanned ? Math.round(admClamp(reliability + (r() - 0.5) * 0.18, 0.3, 1) * ptmPlanned) : 0;

  return {
    monthIdx: monthIdx, supId: supId,
    visitsPlanned: visitsPlanned, visitsDone: visitsDone,
    trainingsPlanned: trainingsPlanned, trainingsDone: trainingsDone,
    ptmPlanned: ptmPlanned, ptmDone: ptmDone
  };
}

/* ---------- aggregation over a set of months ---------- */

function admAvg(arr) { return arr.length ? arr.reduce(function (a, b) { return a + b; }, 0) / arr.length : 0; }

function admSchoolAgg(schoolId, months) {
  const rows = months.map(function (mi) { return admSchoolMonth(schoolId, mi); });
  const attendance = Math.round(admAvg(rows.map(function (r) { return r.attendance; })));
  const coverage   = Math.round(admAvg(rows.map(function (r) { return r.coverage; })));
  const worksheets = Math.round(admAvg(rows.map(function (r) { return r.worksheets; })));
  const domainScore = Math.round(admAvg(rows.map(function (r) { return r.domainScore; })));
  const domains = ADMIN_DOMAINS.map(function (_, di) {
    return Math.round(admAvg(rows.map(function (r) { return r.domains[di]; })) * 10) / 10;
  });
  const enrolled = rows.length ? rows[rows.length - 1].enrolled : 0;
  const atAchieving = Math.round(admAvg(rows.map(function (r) { return r.atAchieving; })));

  /* SRI — the agreed composite. Components kept so any score can be unpacked. */
  const sri = Math.round(0.50 * domainScore + 0.25 * attendance + 0.25 * coverage);

  return {
    schoolId: schoolId, attendance: attendance, coverage: coverage, worksheets: worksheets,
    domainScore: domainScore, domains: domains, enrolled: enrolled, atAchieving: atAchieving,
    propAchieving: enrolled ? Math.round(atAchieving / enrolled * 100) : 0,
    sri: sri
  };
}

function admSupervisorAgg(supId, months) {
  const rows = months.map(function (mi) { return admSupervisorMonth(supId, mi); });
  const sum = function (k) { return rows.reduce(function (a, r) { return a + r[k]; }, 0); };
  const sup = SUPERVISORS_LIST.find(function (s) { return s.id === supId; });
  const schoolAggs = sup.schools.map(function (sid) { return admSchoolAgg(sid, months); });

  const vP = sum('visitsPlanned'), vD = sum('visitsDone');
  const tP = sum('trainingsPlanned'), tD = sum('trainingsDone');
  const pP = sum('ptmPlanned'), pD = sum('ptmDone');

  return {
    supId: supId, name: sup.name, schoolCount: sup.schools.length,
    visitsPlanned: vP, visitsDone: vD, visitPct: vP ? Math.round(vD / vP * 100) : null,
    trainingsPlanned: tP, trainingsDone: tD, trainingPct: tP ? Math.round(tD / tP * 100) : null,
    ptmPlanned: pP, ptmDone: pD, ptmPct: pP ? Math.round(pD / pP * 100) : null,
    coverage: Math.round(admAvg(schoolAggs.map(function (s) { return s.coverage; }))),
    sri: Math.round(admAvg(schoolAggs.map(function (s) { return s.sri; }))),
    attendance: Math.round(admAvg(schoolAggs.map(function (s) { return s.attendance; })))
  };
}

/* Programme mean SRI — the denominator of the performance ratio */
function admProgrammeSri(months) {
  return admAvg(SCHOOLS.map(function (sc) { return admSchoolAgg(sc.id, months).sri; }));
}

/* ---------- period state ---------- */

let admPeriodMode = 'month';        // 'month' | 'quarter' | 'year'
let admMonthIdx = ADMIN_CURRENT_MONTH;
let admQuarterKey = 'q1-2627';
let admYearKey = 'y2627';

function admCurrentPeriod() {
  if (admPeriodMode === 'quarter') {
    const q = ADMIN_QUARTERS.find(function (x) { return x.key === admQuarterKey; });
    const i = ADMIN_QUARTERS.indexOf(q);
    return { label: q.label, span: q.span, months: q.months, partial: !!q.partial,
             prev: i > 0 ? ADMIN_QUARTERS[i - 1] : null };
  }
  if (admPeriodMode === 'year') {
    const y = ADMIN_YEARS.find(function (x) { return x.key === admYearKey; });
    const i = ADMIN_YEARS.indexOf(y);
    return { label: y.label, span: y.span, months: y.months, partial: !!y.partial,
             prev: i > 0 ? ADMIN_YEARS[i - 1] : null };
  }
  const m = ADMIN_MONTHS[admMonthIdx];
  return { label: m.label, span: m.label, months: [m.idx],
           partial: m.idx >= ADMIN_PARTIAL_FROM,
           prev: m.idx > 0 ? { label: ADMIN_MONTHS[m.idx - 1].label, months: [m.idx - 1] } : null };
}

function setAdmPeriodMode(mode) { admPeriodMode = mode; admRerender(); }
function setAdmMonth(v) { admMonthIdx = parseInt(v, 10); admRerender(); }
function setAdmQuarter(v) { admQuarterKey = v; admRerender(); }
function setAdmYear(v) { admYearKey = v; admRerender(); }

let admActiveSection = null;
function admRerender() {
  if (admActiveSection === 'supervisors') renderSupervisorDashboard();
  else if (admActiveSection === 'performance') renderSchoolPerformance();
  else if (admActiveSection === 'review') renderQuarterlyReview();
}

/* One filter row above everything it scopes (never per-card filters). */
function admPeriodBar() {
  const p = admCurrentPeriod();
  return `<div class="adm-filter-row no-print">
    <div class="adm-seg" role="group" aria-label="Period">
      ${['month', 'quarter', 'year'].map(function (m) {
        return `<button class="adm-seg-btn ${admPeriodMode === m ? 'active' : ''}" onclick="setAdmPeriodMode('${m}')">${m.charAt(0).toUpperCase() + m.slice(1)}</button>`;
      }).join('')}
    </div>
    ${admPeriodMode === 'month' ? `<label class="adm-sel">Month
      <select onchange="setAdmMonth(this.value)">
        ${ADMIN_MONTHS.map(function (m) { return `<option value="${m.idx}" ${m.idx === admMonthIdx ? 'selected' : ''}>${m.label}${m.idx >= ADMIN_PARTIAL_FROM ? ' (to date)' : ''}</option>`; }).join('')}
      </select></label>` : ''}
    ${admPeriodMode === 'quarter' ? `<label class="adm-sel">Quarter
      <select onchange="setAdmQuarter(this.value)">
        ${ADMIN_QUARTERS.map(function (q) { return `<option value="${q.key}" ${q.key === admQuarterKey ? 'selected' : ''}>${q.label} · ${q.span}${q.partial ? ' (in progress)' : ''}</option>`; }).join('')}
      </select></label>` : ''}
    ${admPeriodMode === 'year' ? `<label class="adm-sel">Year
      <select onchange="setAdmYear(this.value)">
        ${ADMIN_YEARS.map(function (y) { return `<option value="${y.key}" ${y.key === admYearKey ? 'selected' : ''}>${y.label} · ${y.span}${y.partial ? ' (in progress)' : ''}</option>`; }).join('')}
      </select></label>` : ''}
    <span class="adm-period-tag">${p.span}${p.partial ? ' · incomplete period' : ''}</span>
    <button class="btn-sup-outline" onclick="window.print()">🖨 Print</button>
  </div>`;
}

/* ---------- small chart primitives ----------
   Marks follow the data-viz spec: 2px lines, >=8px end markers with a
   2px surface ring, meter tracks a lighter step of the fill's own ramp,
   status colour always paired with a text label (never colour alone). */

function admSparkline(values, opts) {
  opts = opts || {};
  const w = opts.w || 96, h = opts.h || 26, pad = 3;
  if (!values.length) return '';
  const min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  const range = (max - min) || 1;
  const step = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;
  const pts = values.map(function (v, i) {
    return [pad + i * step, h - pad - ((v - min) / range) * (h - pad * 2)];
  });
  const d = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
  const last = pts[pts.length - 1];
  return `<svg class="adm-spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"
      aria-label="Trend, ${values.length} points, latest ${values[values.length - 1]}">
    <polyline points="${d}" fill="none" stroke="var(--adm-series-1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="4"
      fill="var(--adm-series-1)" stroke="var(--card)" stroke-width="2"/>
  </svg>`;
}

/* Meter: fill carries severity, track is a lighter step of the same ramp. */
function admMeterClass(pct, good, warn) {
  if (pct >= good) return 'ok';
  if (pct >= warn) return 'warn';
  return 'bad';
}
function admMeter(pct, good, warn) {
  const cls = admMeterClass(pct, good === undefined ? 85 : good, warn === undefined ? 70 : warn);
  return `<span class="adm-meter ${cls}"><i style="width:${admClamp(pct, 0, 100)}%"></i></span>`;
}

/* Ratio deviation bar — position around a 1.00 baseline, so the value is
   readable without relying on hue. Range shown is 0.70–1.30. */
function admRatioBar(ratio) {
  const lo = 0.65, hi = 1.35, mid = 1.00;
  const clamped = admClamp(ratio, lo, hi);
  const pctOf = function (v) { return (v - lo) / (hi - lo) * 100; };
  const midPct = pctOf(mid), valPct = pctOf(clamped);
  const left = Math.min(midPct, valPct), width = Math.abs(valPct - midPct);
  const dir = ratio >= mid ? 'above' : 'below';
  return `<span class="adm-ratiobar ${dir}" title="${ratio.toFixed(2)} — ${dir} par">
    <i class="bar" style="left:${left}%; width:${Math.max(width, 0.8)}%"></i>
    <i class="mid" style="left:${midPct}%"></i>
  </span>`;
}

/* Deltas on an index or a percentage are POINT changes, not percentages —
   labelling "1%" when a rate moved 80% -> 79% is simply wrong. */
function admDelta(now, prev) {
  if (prev === null || prev === undefined || !isFinite(prev)) return '';
  const d = now - prev;
  if (Math.abs(d) < 0.5) return `<span class="adm-delta same">→ no change</span>`;
  const up = d > 0, n = Math.abs(Math.round(d));
  return `<span class="adm-delta ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${n} pt${n === 1 ? '' : 's'}</span>`;
}

/* ---------- one-line plain-language read of a school ---------- */

function admBriefReport(a) {
  /* Score each component against its own target, then name the weak link.
     Bucketing into two generic sentences made 15 of 25 rows read identically,
     which defeats the point of a per-school note. */
  const comps = [
    { label: 'learning levels', v: a.domainScore, target: 72 },
    { label: 'attendance',      v: a.attendance,  target: 92 },
    { label: 'plan delivery',   v: a.coverage,    target: 92 }
  ];
  comps.forEach(function (c) { c.rel = c.v / c.target; });
  const sorted = comps.slice().sort(function (x, y) { return x.rel - y.rel; });
  const worst = sorted[0], mid = sorted[1], best = sorted[2];
  const cap = function (str) { return str.charAt(0).toUpperCase() + str.slice(1); };

  if (worst.rel >= 0.95) {
    return 'All three components at target; ' + best.label + ' strongest at ' + best.v + '.';
  }
  if (worst.rel < 0.68) {
    return mid.rel < 0.80
      ? 'Serious gap in ' + worst.label + ' (' + worst.v + ') and ' + mid.label + ' (' + mid.v + ') — needs a supervisor review.'
      : 'Serious gap in ' + worst.label + ' (' + worst.v + '), though ' + best.label + ' holds at ' + best.v + '.';
  }
  if (mid.rel < 0.85) {
    return cap(worst.label) + ' (' + worst.v + ') and ' + mid.label + ' (' + mid.v + ') both below target.';
  }
  return cap(worst.label) + ' is the weak link at ' + worst.v + '; ' + best.label + ' fine at ' + best.v + '.';
}

/* ============================================================
   SECTION 1 — Supervisor Dashboard
   ============================================================ */

function renderSupervisorDashboard() {
  admActiveSection = 'supervisors';
  const p = admCurrentPeriod();
  const aggs = SUPERVISORS_LIST.map(function (s) { return admSupervisorAgg(s.id, p.months); });
  const prevAggs = p.prev ? SUPERVISORS_LIST.map(function (s) { return admSupervisorAgg(s.id, p.prev.months); }) : null;

  const progSri = Math.round(admProgrammeSri(p.months));
  const prevProgSri = p.prev ? Math.round(admProgrammeSri(p.prev.months)) : null;

  const totVisitsDone = aggs.reduce(function (a, s) { return a + s.visitsDone; }, 0);
  const totVisitsPlanned = aggs.reduce(function (a, s) { return a + s.visitsPlanned; }, 0);
  const totTrainDone = aggs.reduce(function (a, s) { return a + s.trainingsDone; }, 0);
  const totTrainPlanned = aggs.reduce(function (a, s) { return a + s.trainingsPlanned; }, 0);
  const totPtmDone = aggs.reduce(function (a, s) { return a + s.ptmDone; }, 0);
  const totPtmPlanned = aggs.reduce(function (a, s) { return a + s.ptmPlanned; }, 0);
  const avgCoverage = Math.round(admAvg(aggs.map(function (s) { return s.coverage; })));

  /* 12-month trailing trend for the hero sparkline */
  const trailStart = Math.max(0, (p.months[p.months.length - 1]) - 11);
  const trailMonths = [];
  for (let i = trailStart; i <= p.months[p.months.length - 1]; i++) trailMonths.push(i);
  const sriTrail = trailMonths.map(function (mi) { return Math.round(admProgrammeSri([mi])); });

  document.getElementById('admin-body').innerHTML = `
    ${admPeriodBar()}

    <div class="adm-hero">
      <div>
        <p class="adm-hero-label">Student Readiness Index — programme mean</p>
        <p class="adm-hero-value">${progSri}<span class="adm-hero-unit">/100</span></p>
        <p class="adm-hero-sub">${p.label} · ${SCHOOLS.length} schools · ${admDelta(progSri, prevProgSri) || 'no prior period'}${p.prev ? ' vs ' + p.prev.label : ''}</p>
      </div>
      <div class="adm-hero-trend">
        ${admSparkline(sriTrail, { w: 180, h: 46 })}
        <p class="adm-hero-trendlabel">SRI, trailing ${sriTrail.length} months</p>
      </div>
    </div>

    <div class="stat-grid adm-tiles">
      <div class="stat-card">
        <p class="label">Visits achieved</p>
        <p class="value">${totVisitsDone}<span class="adm-of"> / ${totVisitsPlanned}</span></p>
        ${admMeter(totVisitsPlanned ? totVisitsDone / totVisitsPlanned * 100 : 0)}
        <p class="adm-tile-foot">${totVisitsPlanned ? Math.round(totVisitsDone / totVisitsPlanned * 100) : 0}% of plan</p>
      </div>
      <div class="stat-card">
        <p class="label">Teacher trainings held</p>
        <p class="value">${totTrainDone}<span class="adm-of"> / ${totTrainPlanned}</span></p>
        ${admMeter(totTrainPlanned ? totTrainDone / totTrainPlanned * 100 : 0)}
        <p class="adm-tile-foot">${totTrainPlanned ? Math.round(totTrainDone / totTrainPlanned * 100) : 0}% of plan</p>
      </div>
      <div class="stat-card">
        <p class="label">Parent meets held</p>
        <p class="value">${totPtmDone}<span class="adm-of"> / ${totPtmPlanned}</span></p>
        ${admMeter(totPtmPlanned ? totPtmDone / totPtmPlanned * 100 : 0)}
        <p class="adm-tile-foot">${totPtmPlanned ? Math.round(totPtmDone / totPtmPlanned * 100) : 0}% of plan${totPtmPlanned ? '' : ' — none due this period'}</p>
      </div>
      <div class="stat-card">
        <p class="label">Weekly plan implementation</p>
        <p class="value">${avgCoverage}%</p>
        ${admMeter(avgCoverage, 85, 70)}
        <p class="adm-tile-foot">mean across all ${SCHOOLS.length} schools</p>
      </div>
    </div>

    <h3 class="report-h3">Per supervisor — achieved against plan</h3>
    <p class="adm-note">Each meter is achieved ÷ planned for the period. Green ≥ 85%, amber 70–84%, red below 70%. The label carries the number, so the colour is never the only cue.</p>

    <div class="adm-sup-grid">
      ${aggs.map(function (a, i) {
        const prev = prevAggs ? prevAggs[i] : null;
        const trail = trailMonths.map(function (mi) { return admSupervisorAgg(a.supId, [mi]).visitPct || 0; });
        return `<div class="adm-sup-card">
          <div class="adm-sup-head">
            <div>
              <strong>${supEscAdm(a.name)}</strong>
              <span class="adm-sup-meta">${a.schoolCount} schools</span>
            </div>
            <div class="adm-sup-spark">
              ${admSparkline(trail, { w: 88, h: 24 })}
              <span class="adm-sup-sparklabel">visit %, ${trail.length} mo</span>
            </div>
          </div>
          <div class="adm-sup-rows">
            ${admSupRow('Visits', a.visitsDone, a.visitsPlanned, a.visitPct, prev ? prev.visitPct : null)}
            ${admSupRow('Trainings', a.trainingsDone, a.trainingsPlanned, a.trainingPct, prev ? prev.trainingPct : null)}
            ${admSupRow('Parent meets', a.ptmDone, a.ptmPlanned, a.ptmPct, prev ? prev.ptmPct : null)}
            ${admSupRow('Plan implementation', null, null, a.coverage, prev ? prev.coverage : null)}
          </div>
          <div class="adm-sup-foot">
            <span>SRI across their schools <b>${a.sri}</b> ${admDelta(a.sri, prev ? prev.sri : null)}</span>
            <span>Attendance <b>${a.attendance}%</b></span>
          </div>
        </div>`;
      }).join('')}
    </div>

    <h3 class="report-h3">Table view — same figures</h3>
    <div class="report-table-wrap"><table class="report-table adm-table">
      <thead><tr>
        <th>Supervisor</th><th>Schools</th>
        <th>Visits</th><th>Visit %</th>
        <th>Trainings</th><th>Parent meets</th>
        <th>Plan impl.</th><th>Attendance</th><th>SRI</th>
      </tr></thead>
      <tbody>
        ${aggs.map(function (a) {
          return `<tr>
            <td><strong>${supEscAdm(a.name)}</strong></td>
            <td>${a.schoolCount}</td>
            <td>${a.visitsDone} / ${a.visitsPlanned}</td>
            <td>${admPctCell(a.visitPct)}</td>
            <td>${a.trainingsDone} / ${a.trainingsPlanned}</td>
            <td>${a.ptmPlanned ? a.ptmDone + ' / ' + a.ptmPlanned : '—'}</td>
            <td>${admPctCell(a.coverage, 85, 70)}</td>
            <td>${a.attendance}%</td>
            <td><strong>${a.sri}</strong></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>

    ${admMetricFootnote()}
  `;
}

function admSupRow(label, done, planned, pct, prevPct) {
  const shown = pct === null || pct === undefined ? null : pct;
  const good = label === 'Plan implementation' ? 85 : 85;
  const warn = 70;
  return `<div class="adm-sup-row">
    <span class="adm-sup-rowlabel">${label}</span>
    ${shown === null
      ? '<span class="adm-sup-rowmeter"></span><span class="adm-sup-rowval muted">none due</span>'
      : `<span class="adm-sup-rowmeter">${admMeter(shown, good, warn)}</span>
         <span class="adm-sup-rowval">
           <b>${shown}%</b>${done !== null && planned !== null ? ' <span class="adm-of">' + done + '/' + planned + '</span>' : ''}
           ${admDelta(shown, prevPct)}
         </span>`}
  </div>`;
}

function admPctCell(pct, good, warn) {
  if (pct === null || pct === undefined) return '—';
  const cls = admMeterClass(pct, good === undefined ? 85 : good, warn === undefined ? 70 : warn);
  const word = cls === 'ok' ? 'on track' : cls === 'warn' ? 'behind' : 'well behind';
  return `<span class="adm-pct ${cls}" title="${word}">${pct}%</span>`;
}

function supEscAdm(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function admMetricFootnote() {
  return `<div class="adm-footnote">
    <strong>How these are calculated</strong>
    <ul>
      <li><b>Domain score</b> — mean of the 8 domain proficiency ratings (Emerging 1 … Exceeding 4), rescaled to 0–100.</li>
      <li><b>Plan implementation / coverage</b> — planned lesson slots actually delivered ÷ planned slots.</li>
      <li><b>Student Readiness Index (SRI)</b> — 50% domain score + 25% attendance + 25% plan implementation.</li>
      <li><b>Class Performance Ratio</b> — class SRI ÷ programme mean SRI. 1.00 is at par.</li>
      <li><b>≥ Achieving</b> — share of children rated Achieving or Exceeding.</li>
    </ul>
    <p class="adm-footnote-warn">⚠ Illustrative definitions only — impact indicators are due to be signed off by programme leads at Gate G5 (end of week 10). Figures on this page are generated demo data, not real records.</p>
  </div>`;
}

/* ============================================================
   SECTION 2 — School Performance (all 25, streamlined)
   ============================================================ */

let admSort = { key: 'sri', dir: -1 };
let admSchoolFilter = '';

function setAdmSort(key) {
  if (admSort.key === key) admSort.dir *= -1;
  else admSort = { key: key, dir: key === 'name' ? 1 : -1 };
  renderSchoolPerformance();
}
function setAdmSchoolFilter(v) {
  admSchoolFilter = v;
  renderSchoolPerformance();
  const el = document.getElementById('admSchoolSearch');
  if (el) { el.focus(); el.setSelectionRange(v.length, v.length); }
}

function renderSchoolPerformance() {
  admActiveSection = 'performance';
  const p = admCurrentPeriod();
  const progSri = admProgrammeSri(p.months);

  let rows = SCHOOLS.map(function (sc) {
    const a = admSchoolAgg(sc.id, p.months);
    const sv = SUPERVISORS_LIST.find(function (s) { return s.schools.indexOf(sc.id) > -1; });
    return {
      id: sc.id, name: sc.name, area: sc.name.replace('Bhavyata Balwadi — ', ''),
      division: sc.class, teacher: sc.teacher, supervisor: sv ? sv.name : 'Unassigned',
      attendance: a.attendance, coverage: a.coverage, domainScore: a.domainScore,
      sri: a.sri, ratio: progSri ? a.sri / progSri : 0,
      propAchieving: a.propAchieving, atAchieving: a.atAchieving, enrolled: a.enrolled,
      brief: admBriefReport(a)
    };
  });

  if (admSchoolFilter) {
    const q = admSchoolFilter.toLowerCase();
    rows = rows.filter(function (r) {
      return (r.area + ' ' + r.teacher + ' ' + r.division + ' ' + r.supervisor).toLowerCase().indexOf(q) > -1;
    });
  }

  const k = admSort.key, dir = admSort.dir;
  rows.sort(function (x, y) {
    const a = x[k], b = y[k];
    if (typeof a === 'string') return a.localeCompare(b) * dir;
    return (a - b) * dir;
  });

  const belowPar = rows.filter(function (r) { return r.ratio < 0.9; }).length;
  const atOrAbove = rows.filter(function (r) { return r.ratio >= 1; }).length;

  const th = function (key, label, hint) {
    const active = admSort.key === key;
    return `<th class="adm-th ${active ? 'sorted' : ''}" onclick="setAdmSort('${key}')" title="${hint || 'Sort by ' + label}">
      ${label}${active ? (admSort.dir === 1 ? ' ▲' : ' ▼') : ''}</th>`;
  };

  document.getElementById('admin-body').innerHTML = `
    ${admPeriodBar()}

    <div class="stat-grid adm-tiles">
      <div class="stat-card"><p class="label">Schools</p><p class="value">${SCHOOLS.length}</p><p class="adm-tile-foot">${rows.length} shown</p></div>
      <div class="stat-card"><p class="label">Programme mean SRI</p><p class="value">${Math.round(progSri)}</p><p class="adm-tile-foot">the ratio denominator</p></div>
      <div class="stat-card"><p class="label">At or above par</p><p class="value" style="color:var(--success)">${atOrAbove}</p><p class="adm-tile-foot">ratio ≥ 1.00</p></div>
      <div class="stat-card"><p class="label">More than 10% below par</p><p class="value" style="color:var(--danger)">${belowPar}</p><p class="adm-tile-foot">ratio &lt; 0.90 — review first</p></div>
    </div>

    <div class="adm-table-toolbar no-print">
      <input id="admSchoolSearch" class="adm-search" type="text" placeholder="Filter by area, teacher, division or supervisor"
        value="${supEscAdm(admSchoolFilter)}" oninput="setAdmSchoolFilter(this.value)" />
      <span class="adm-note-inline">Click any column heading to sort</span>
    </div>

    <div class="report-table-wrap"><table class="report-table adm-table adm-perf-table">
      <thead><tr>
        ${th('name', 'School / area')}
        ${th('division', 'Division')}
        ${th('teacher', 'Teacher')}
        ${th('attendance', 'Attend.', 'Mean attendance for the period')}
        ${th('domainScore', 'Domain score', 'Mean of the 8 domain ratings, 0–100')}
        ${th('coverage', 'Plan impl.', 'Planned slots delivered')}
        ${th('sri', 'Readiness index', 'SRI: 50% domain + 25% attendance + 25% plan implementation')}
        ${th('ratio', 'Perf. ratio', 'Class SRI ÷ programme mean SRI. 1.00 = at par')}
        ${th('propAchieving', '≥ Achieving', 'Share of children rated Achieving or Exceeding')}
        <th>Brief report</th>
      </tr></thead>
      <tbody>
        ${rows.length ? rows.map(function (r) {
          return `<tr>
            <td><strong>${supEscAdm(r.area)}</strong><div class="adm-sub">${supEscAdm(r.supervisor)}</div></td>
            <td>${supEscAdm(r.division)}</td>
            <td>${supEscAdm(r.teacher)}</td>
            <td>${admPctCell(r.attendance, 88, 78)}</td>
            <td><span class="adm-cellmeter">${admMeter(r.domainScore, 65, 50)}<b>${r.domainScore}</b></span></td>
            <td>${admPctCell(r.coverage, 85, 70)}</td>
            <td><span class="adm-cellmeter">${admMeter(r.sri, 75, 62)}<b>${r.sri}</b></span></td>
            <td class="adm-ratio-cell">
              ${admRatioBar(r.ratio)}
              <b>${r.ratio.toFixed(2)}</b>
              <span class="adm-ratio-word">${r.ratio >= 1 ? 'above par' : 'below par'}</span>
            </td>
            <td>${r.propAchieving}%<div class="adm-sub">${r.atAchieving} of ${r.enrolled}</div></td>
            <td class="adm-brief">${supEscAdm(r.brief)}</td>
          </tr>`;
        }).join('') : '<tr><td colspan="10" style="text-align:center; color:var(--text-muted); padding:24px;">No schools match that filter.</td></tr>'}
      </tbody>
    </table></div>

    ${admMetricFootnote()}
  `;
}

/* ============================================================
   SECTION 3 — Quarterly / Annual Review, with sign-off
   ============================================================ */

const admSignOffs = {};   // key: periodKey -> {by, date, note}

function admPeriodKey() {
  if (admPeriodMode === 'quarter') return 'Q:' + admQuarterKey;
  if (admPeriodMode === 'year') return 'Y:' + admYearKey;
  return 'M:' + admMonthIdx;
}

function admSignOff() {
  const note = document.getElementById('admReviewNote').value.trim();
  admSignOffs[admPeriodKey()] = {
    by: 'Super Admin',
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    note: note
  };
  renderQuarterlyReview();
}

function renderQuarterlyReview() {
  admActiveSection = 'review';
  const p = admCurrentPeriod();
  const signed = admSignOffs[admPeriodKey()];

  const nowAgg = SUPERVISORS_LIST.map(function (s) { return admSupervisorAgg(s.id, p.months); });
  const prevAgg = p.prev ? SUPERVISORS_LIST.map(function (s) { return admSupervisorAgg(s.id, p.prev.months); }) : null;

  const roll = function (aggs, months) {
    if (!aggs) return null;
    const sum = function (k) { return aggs.reduce(function (a, s) { return a + s[k]; }, 0); };
    return {
      visitPct: sum('visitsPlanned') ? Math.round(sum('visitsDone') / sum('visitsPlanned') * 100) : null,
      trainPct: sum('trainingsPlanned') ? Math.round(sum('trainingsDone') / sum('trainingsPlanned') * 100) : null,
      ptmPct: sum('ptmPlanned') ? Math.round(sum('ptmDone') / sum('ptmPlanned') * 100) : null,
      coverage: Math.round(admAvg(aggs.map(function (s) { return s.coverage; }))),
      attendance: Math.round(admAvg(aggs.map(function (s) { return s.attendance; }))),
      sri: Math.round(admProgrammeSri(months))
    };
  };
  const now = roll(nowAgg, p.months);
  const prev = prevAgg ? roll(prevAgg, p.prev.months) : null;

  const MEASURES = [
    { key: 'sri',        label: 'Student Readiness Index', unit: '', good: 75, warn: 62 },
    { key: 'visitPct',   label: 'Supervisor visits achieved', unit: '%', good: 85, warn: 70 },
    { key: 'trainPct',   label: 'Teacher trainings held', unit: '%', good: 85, warn: 70 },
    { key: 'ptmPct',     label: 'Parent meets held', unit: '%', good: 85, warn: 70 },
    { key: 'coverage',   label: 'Weekly plan implementation', unit: '%', good: 85, warn: 70 },
    { key: 'attendance', label: 'Student attendance', unit: '%', good: 88, warn: 78 }
  ];

  /* Quarter-by-quarter series for the comparison chart (2 series max:
     current selection highlighted against the rest). */
  const qSeries = ADMIN_QUARTERS.map(function (q) {
    return { label: q.label, sri: Math.round(admProgrammeSri(q.months)), partial: !!q.partial, key: q.key };
  });
  const qMax = Math.max.apply(null, qSeries.map(function (q) { return q.sri; })) || 1;

  const bestSup = nowAgg.slice().sort(function (a, b) { return b.sri - a.sri; })[0];
  const worstSup = nowAgg.slice().sort(function (a, b) { return a.sri - b.sri; })[0];
  const progSriNow = admProgrammeSri(p.months);
  const laggards = SCHOOLS.map(function (sc) {
    const a = admSchoolAgg(sc.id, p.months);
    return { area: sc.name.replace('Bhavyata Balwadi — ', ''), sri: a.sri,
             ratio: progSriNow ? a.sri / progSriNow : 0, brief: admBriefReport(a) };
  }).sort(function (a, b) { return a.ratio - b.ratio; }).slice(0, 5);

  document.getElementById('admin-body').innerHTML = `
    ${admPeriodBar()}

    ${admPeriodMode === 'month' ? `<div class="adm-callout">
      This is a review page — switch the period control to <b>Quarter</b> or <b>Year</b> for a period-on-period comparison and sign-off.
    </div>` : ''}

    ${signed ? `<div class="adm-signed">
      ✓ Signed off by <b>${supEscAdm(signed.by)}</b> on ${supEscAdm(signed.date)}
      ${signed.note ? '<div class="adm-signed-note">“' + supEscAdm(signed.note) + '”</div>' : ''}
    </div>` : ''}

    <h3 class="report-h3">${supEscAdm(p.label)} review${p.partial ? ' — period still in progress' : ''}</h3>

    <div class="report-table-wrap"><table class="report-table adm-table">
      <thead><tr>
        <th>Measure</th><th>${supEscAdm(p.label)}</th>
        <th>${p.prev ? supEscAdm(p.prev.label) : 'Prior period'}</th>
        <th>Change</th><th>Status</th>
      </tr></thead>
      <tbody>
        ${MEASURES.map(function (m) {
          const a = now[m.key], b = prev ? prev[m.key] : null;
          if (a === null || a === undefined) {
            return `<tr><td>${m.label}</td><td colspan="4" class="adm-sub">none due this period</td></tr>`;
          }
          const cls = admMeterClass(a, m.good, m.warn);
          const word = cls === 'ok' ? 'On track' : cls === 'warn' ? 'Behind' : 'Well behind';
          return `<tr>
            <td><strong>${m.label}</strong></td>
            <td><span class="adm-cellmeter">${admMeter(a, m.good, m.warn)}<b>${a}${m.unit}</b></span></td>
            <td>${b === null ? '—' : b + m.unit}</td>
            <td>${admDelta(a, b) || '—'}</td>
            <td><span class="adm-status ${cls}">${cls === 'ok' ? '●' : cls === 'warn' ? '▲' : '■'} ${word}</span></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>

    <h3 class="report-h3">Readiness index by quarter</h3>
    <div class="adm-chart-card">
      <div class="adm-legend">
        <span class="adm-key"><i class="sw s1"></i> Completed quarter</span>
        <span class="adm-key"><i class="sw s2"></i> Selected quarter</span>
        <span class="adm-key"><i class="sw partial"></i> In progress</span>
      </div>
      <div class="adm-qbars">
        ${qSeries.map(function (q) {
          const selected = admPeriodMode === 'quarter' && q.key === admQuarterKey;
          return `<div class="adm-qbar-col">
            <div class="adm-qbar-track">
              <div class="adm-qbar ${selected ? 'sel' : ''} ${q.partial ? 'partial' : ''}"
                   style="height:${Math.round(q.sri / qMax * 100)}%"
                   title="${q.label}: SRI ${q.sri}"></div>
            </div>
            <div class="adm-qbar-val">${q.sri}</div>
            <div class="adm-qbar-label">${q.label.replace(' 20', ' ’')}</div>
          </div>`;
        }).join('')}
      </div>
      <p class="adm-note">One measure, one axis — SRI 0 to ${qMax}. Values are labelled on every bar because there are only five.</p>
    </div>

    <h3 class="report-h3">What stands out</h3>
    <div class="adm-standout-grid">
      <div class="adm-standout ok">
        <span class="adm-standout-label">Strongest supervisor cluster</span>
        <strong>${supEscAdm(bestSup.name)}</strong>
        <p>SRI ${bestSup.sri} across ${bestSup.schoolCount} schools · visits ${bestSup.visitPct}% of plan</p>
      </div>
      <div class="adm-standout bad">
        <span class="adm-standout-label">Weakest supervisor cluster</span>
        <strong>${supEscAdm(worstSup.name)}</strong>
        <p>SRI ${worstSup.sri} across ${worstSup.schoolCount} schools · visits ${worstSup.visitPct}% of plan</p>
      </div>
    </div>

    <h4 class="adm-h4">Five schools furthest below par</h4>
    <div class="report-table-wrap"><table class="report-table adm-table">
      <thead><tr><th>School / area</th><th>SRI</th><th>Ratio</th><th>Brief report</th></tr></thead>
      <tbody>
        ${laggards.map(function (l) {
          return `<tr>
            <td><strong>${supEscAdm(l.area)}</strong></td>
            <td>${l.sri}</td>
            <td class="adm-ratio-cell">${admRatioBar(l.ratio)}<b>${l.ratio.toFixed(2)}</b></td>
            <td class="adm-brief">${supEscAdm(l.brief)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>

    <div class="review-box">
      <label class="field-label-admin">Reviewer note</label>
      <textarea id="admReviewNote" placeholder="e.g. Kharghar and Uran to be re-visited before the next quarter; plan implementation is the common gap">${signed ? supEscAdm(signed.note) : ''}</textarea>
      <button class="btn-primary" style="width:auto; padding:10px 20px; margin-top:10px;" onclick="admSignOff()">
        ${signed ? 'Update sign-off' : 'Sign off ' + supEscAdm(p.label)}
      </button>
      ${p.partial ? '<p class="adm-note" style="margin-top:8px;">This period is still in progress — signing off now records a mid-period review.</p>' : ''}
    </div>

    ${admMetricFootnote()}
  `;
}