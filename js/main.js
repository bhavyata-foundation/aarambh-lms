/* =========================================================================
   MAIN.JS — login page only (index.html). Every other role's actual
   dashboard now lives on its own page (teacher.html, supervisor.html,
   superadmin.html, parent.html) — this file's only job is authenticating
   someone and sending them to the right one.

   TABLE OF CONTENTS (search for "SECTION:" to jump between these)
   1. LOGIN & SESSION (role selector) — selectRole, the login form itself,
      saved-login (save/autofill/clear), dev-bypass skip-login, logout
   2. STARTUP — on page load: resume an existing session (redirect to the
      right role's page) or auto-fill a saved login; the dev-bypass
      trigger that runs after everything else is defined
   ========================================================================= */

let selectedRole = 'teacher';

  /* ===================== SECTION 1: LOGIN & SESSION (role selector) ===================== */

  function selectRole(role, el){
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(b=>b.classList.remove('active'));
    el.classList.add('active');
  }

/* ===================== SECTION 3: LOGIN & SESSION ===================== */

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
      window.location.href = 'teacher.html';
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
    window.location.href = 'teacher.html?dev_role=teacher';
  } else if(selectedRole === 'supervisor'){
    window.location.href = 'supervisor.html?dev_role=supervisor';
  } else if(selectedRole === 'superadmin'){
    window.location.href = 'superadmin.html?dev_role=superadmin';
  } else if(selectedRole === 'parent'){
    window.location.href = 'parent.html?dev_role=parent';
  }
}

  

/* ===================== SECTION 2: STARTUP ===================== */

(function checkExistingSession(){
  fetch('backend/session_check.php' + window.location.search)
    .then(r => r.json())
    .then(data => {
      if(data.status !== 'logged_in'){
        autoFillSavedLogin();
        return;
      }
      const rolePages = {
        teacher: 'teacher.html',
        supervisor: 'supervisor.html',
        superadmin: 'superadmin.html',
        parent: 'parent.html'
      };
      window.location.href = rolePages[data.role] || 'teacher.html';
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