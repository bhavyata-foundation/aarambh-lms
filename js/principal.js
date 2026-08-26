/* =========================================================================
   PRINCIPAL.JS — the first (and so far only) screen for the new
   Principal role. Deliberately minimal: a principal's whole job on
   this app right now is seeing the PTM calendar for her own school.
   More screens can be added the same way "My Day" etc. were added to
   teacher.js, once there's something else for a principal to do.
   ========================================================================= */

function toggleUserMenu(){
  document.getElementById('userDropdown').classList.toggle('hidden');
}
document.addEventListener('click', function(e){
  const menu = document.getElementById('userMenu');
  if(menu && !menu.contains(e.target)) document.getElementById('userDropdown').classList.add('hidden');
});

fetch('backend/session_check.php' + window.location.search)
  .then(r => r.json())
  .then(data => {
    if(data.status !== 'logged_in' || data.role !== 'principal'){
      window.location.href = 'index.html';
      return;
    }
    document.getElementById('principalName').textContent = data.name;
    loadPrincipalSchoolAndRenderPTM();
  })
  .catch(() => { window.location.href = 'index.html'; });

async function loadPrincipalSchoolAndRenderPTM(){
  try{
    const res = await fetch('backend/get_my_school.php' + window.location.search);
    const data = await res.json();
    if(data.status !== 'success' || !data.school){
      document.getElementById('ptm-body').innerHTML =
        '<p class="sub">Your account isn\'t linked to a school yet — ask your superadmin to link it.</p>';
      return;
    }
    document.getElementById('principalSchoolName').textContent = data.school.name;
    renderPTMView('ptm-body', {
      schoolId: data.school.id,
      classId: null, // whole-school PTM — a principal oversees the school, not one class
      role: 'principal',
      canSchedule: false,
      canToggleTeacherPrep: false,
      canToggleSupervisorPrep: false,
      querySuffix: window.location.search
    });
  } catch(err){
    document.getElementById('ptm-body').innerHTML = '<p class="sub">Could not reach the server.</p>';
  }
}