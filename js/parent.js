// =========================================================================
// SESSION GUARD — checks with the server that someone is actually logged
// in as a parent before showing anything on this page.
// =========================================================================
fetch('backend/session_check.php')
  .then(r => r.json())
  .then(data => {
    if(data.status !== 'logged_in' || data.role !== 'parent'){
      window.location.href = 'index.html';
    }
  })
  .catch(() => { window.location.href = 'index.html'; });

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