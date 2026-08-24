// =========================================================================
// SESSION GUARD — checks with the server that someone is actually logged
// in as a parent before showing anything on this page.
// =========================================================================
fetch('backend/session_check.php')
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