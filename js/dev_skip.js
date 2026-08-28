/* =========================================================================
   DEV-SKIP.JS — recreates the "Skip login (dev mode)" feature as a
   standalone script, loaded AFTER main.js on purpose.

   WHY SEPARATE FROM main.js: I don't have main.js's actual content, so
   rewriting it wholesale risks breaking the real login POST/error
   handling I can't see. This file only defines selectRole() and
   devSkipLogin() — if main.js already defines functions with those
   exact names, this file's versions win (it loads second), which is
   safe here since role selection is purely cosmetic (login.php's own
   comment confirms the real role always comes from the database, never
   from what the browser sent).

   WHAT THIS DOES NOT FIX: if something in main.js redirects away from
   index.html unconditionally (e.g. on an existing session) BEFORE this
   script gets a chance to run, this file can't stop that — by the time
   dev-skip.js executes, the browser may have already navigated away.
   That's a separate bug living in main.js itself.
   ========================================================================= */

let selectedDevRole = 'teacher'; // matches the default .active role-btn in index.html

function selectRole(role, el){
  selectedDevRole = role;
  document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');
}

function devSkipLogin(){
  const pageForRole = {
    teacher: 'teacher.html',
    supervisor: 'supervisor.html',
    parent: 'parent.html',
    superadmin: 'superadmin.html',
    principal: 'principal.html'
  };
  const page = pageForRole[selectedDevRole] || 'teacher.html';
  window.location.href = page + '?dev_role=' + selectedDevRole;
}

// Show the dev-skip UI only on localhost — same hostname-gating
// convention used by session_check.php and every other dev-bypass in
// this project.
if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
  const wrap = document.getElementById('devSkipLoginWrap');
  if (wrap) wrap.classList.remove('hidden');
}