// =========================================================================
// SESSION GUARD — checks with the server that someone is actually logged
// in as a parent before showing anything on this page.
// =========================================================================
fetch('backend/session_check.php' + window.location.search)
  .then(r => r.json())
  .then(data => {
    if(data.status !== 'logged_in' || data.role !== 'parent'){
      window.location.href = 'index.html';
      return;
    }
    renderPreviewBanner(data.is_previewing);
  })
  .catch(() => { window.location.href = 'index.html'; });

// -------------------------------------------------------------------------
// PREVIEW BANNER — shown only when a superadmin is currently previewing
// this role (see backend/preview_as.php).
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

/* =========================================================================
   PARENT AS CO-EDUCATOR — application form + status view.

   This demo parent's own child/school/class context is fixed here for
   now (matches the header above) — in a real backend this would come
   from the logged-in parent's own session/account instead of being
   hardcoded.
   ========================================================================= */
const CURRENT_PARENT_CONTEXT = {
  parentName: 'Mrs. Patil',
  childName: 'Priya Patil',
  school: 'Triveni Sangam Municipal School',
  className: 'Jr KG'
};

function switchParentView(view){
  document.getElementById('navMyChild').classList.toggle('active', view === 'mychild');
  document.getElementById('navCoEducator').classList.toggle('active', view === 'coeducator');
  document.getElementById('parent-mychild-body').classList.toggle('hidden', view !== 'mychild');
  document.getElementById('parent-coeducator-body').classList.toggle('hidden', view !== 'coeducator');
  document.getElementById('pageLabel').textContent = view === 'coeducator' ? 'Join as Co-Educator' : 'My Child';
  closeSidebar();
  if(view === 'coeducator') renderCoEducatorSection();
}

function findMyApplication(){
  const apps = loadParentCommitteeApplications();
  return apps.find(a =>
    a.childName === CURRENT_PARENT_CONTEXT.childName &&
    a.school === CURRENT_PARENT_CONTEXT.school &&
    a.className === CURRENT_PARENT_CONTEXT.className
  );
}

const STATUS_LABELS = {
  applied: {label:'Applied — waiting for review', color:'var(--text-secondary)'},
  shortlisted: {label:'Shortlisted', color:'var(--text-accent, #185FA5)'},
  selected: {label:'Selected for the Parents Committee', color:'var(--success)'},
  not_selected: {label:'Not selected this term', color:'var(--text-muted)'}
};

function renderCoEducatorSection(){
  const container = document.getElementById('parent-coeducator-body');
  const existing = findMyApplication();

  if(existing){
    const status = STATUS_LABELS[existing.status] || STATUS_LABELS.applied;
    container.innerHTML = `
      <div class="report-table-wrap" style="padding:20px;">
        <h3 class="report-h3" style="margin-top:0;">Your application</h3>
        <p style="font-size:14px; margin:0 0 4px;">
          <strong>Status:</strong> <span style="color:${status.color};">${status.label}</span>
        </p>
        <p style="font-size:13px; color:var(--text-muted); margin:0 0 16px;">
          Submitted ${existing.submittedDate} for ${existing.childName} — ${existing.className}, ${existing.school}
        </p>
        <p style="font-size:13px; color:var(--text-muted);">
          Your child's teacher will be in touch if there's an update. You don't need to apply again.
        </p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="report-table-wrap" style="padding:20px;">
      <h3 class="report-h3" style="margin-top:0;">Join as a co-educator</h3>
      <p class="sub" style="margin-top:-4px;">Help out in ${CURRENT_PARENT_CONTEXT.childName}'s classroom a few times a term.</p>

      <div id="coEducatorFormError" class="login-error hidden" style="margin-top:12px;"></div>

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 4px;">Your name</label>
      <input type="text" id="coedParentName" value="${CURRENT_PARENT_CONTEXT.parentName}" style="width:100%;" />

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 4px;">Your child</label>
      <input type="text" value="${CURRENT_PARENT_CONTEXT.childName} — ${CURRENT_PARENT_CONTEXT.className}, ${CURRENT_PARENT_CONTEXT.school}" disabled style="width:100%; color:var(--text-muted);" />

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 4px;">Occupation</label>
      <input type="text" id="coedOccupation" placeholder="e.g. nurse, artist, engineer" style="width:100%;" />

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 4px;">Highest education</label>
      <select id="coedEducation" style="width:100%;">
        ${EDUCATION_LEVELS.map(e => `<option value="${e.value}">${e.label}</option>`).join('')}
      </select>

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 8px;">Have you done any of these before?</label>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${ACTIVITY_OPTIONS.map(a => `
          <label style="display:flex; align-items:center; gap:8px; font-size:13px;">
            <input type="checkbox" class="coed-activity" value="${a.value}" /> ${a.label}
          </label>`).join('')}
      </div>

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 8px;">Available days</label>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${DAY_OPTIONS.map(d => `<button type="button" class="chip coed-day" data-value="${d.value}" onclick="this.classList.toggle('active')">${d.label}</button>`).join('')}
      </div>

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 8px;">Interested in</label>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${INTEREST_OPTIONS.map(i => `<button type="button" class="chip coed-interest" data-value="${i.value}" onclick="this.classList.toggle('active')">${i.label}</button>`).join('')}
      </div>

      <label style="font-size:13px; color:var(--text-muted); display:block; margin:16px 0 4px;">Anything else you'd like to add</label>
      <textarea id="coedNotes" rows="2" placeholder="Optional" style="width:100%;"></textarea>

      <label style="display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-muted); margin:16px 0;">
        <input type="checkbox" id="coedConsent" /> I consent to a background and reference check
      </label>

      <button class="btn-primary" style="width:auto; padding:10px 20px;" onclick="submitCoEducatorApplication()">Submit application</button>
    </div>`;
}

function submitCoEducatorApplication(){
  const errorEl = document.getElementById('coEducatorFormError');
  errorEl.classList.add('hidden');
  errorEl.textContent = '';

  const parentName = document.getElementById('coedParentName').value.trim();
  const occupation = document.getElementById('coedOccupation').value.trim();
  const education = document.getElementById('coedEducation').value;
  const activities = Array.from(document.querySelectorAll('.coed-activity:checked')).map(el => el.value);
  const availableDays = Array.from(document.querySelectorAll('.coed-day.active')).map(el => el.getAttribute('data-value'));
  const interests = Array.from(document.querySelectorAll('.coed-interest.active')).map(el => el.getAttribute('data-value'));
  const notes = document.getElementById('coedNotes').value.trim();
  const consent = document.getElementById('coedConsent').checked;

  if(!parentName){
    errorEl.textContent = 'Please enter your name.';
    errorEl.classList.remove('hidden');
    return;
  }
  if(availableDays.length === 0){
    errorEl.textContent = 'Please select at least one available day.';
    errorEl.classList.remove('hidden');
    return;
  }
  if(interests.length === 0){
    errorEl.textContent = 'Please select at least one area of interest.';
    errorEl.classList.remove('hidden');
    return;
  }
  if(!consent){
    errorEl.textContent = 'Please consent to a background and reference check to continue.';
    errorEl.classList.remove('hidden');
    return;
  }

  const app = {
    id: 'app-' + Date.now(),
    parentName,
    childName: CURRENT_PARENT_CONTEXT.childName,
    school: CURRENT_PARENT_CONTEXT.school,
    className: CURRENT_PARENT_CONTEXT.className,
    occupation,
    education,
    activities: activities.length ? activities : ['none'],
    availableDays,
    interests,
    notes,
    status: 'applied',
    submittedDate: new Date().toISOString().slice(0, 10)
  };

  addParentCommitteeApplication(app);
  renderCoEducatorSection();
}