/* =========================================================
   i18n — minimal translation system, no build tools, no libraries.

   HOW TO USE IN HTML:
   Add data-i18n="key" to any element whose TEXT should translate:
     <button data-i18n="login_button">Sign in</button>
   The English text stays in the HTML as a fallback — i18n.js
   overwrites it once the selected language's file loads.

   For placeholder text on inputs, use data-i18n-placeholder:
     <input data-i18n-placeholder="login_email_label" />

   HOW TO USE IN JAVASCRIPT (main.js), for text built dynamically:
     t('present')   // returns the current language's word for "present"

   Language choice is remembered in localStorage so it persists
   across page loads and logins.
   ========================================================= */

let currentTranslations = {};
let currentLang = localStorage.getItem('bhavyataLang') || 'en';

const SUPPORTED_LANGS = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  gu: 'ગુજરાતી'
};

async function loadLanguage(lang){
  try{
    const res = await fetch('lang/' + lang + '.json');
    currentTranslations = await res.json();
    currentLang = lang;
    localStorage.setItem('bhavyataLang', lang);
    applyTranslations();
  }catch(e){
    console.error('Could not load language file for', lang, e);
  }
}

function t(key){
  return currentTranslations[key] || key; // falls back to the key itself if missing
}

function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(currentTranslations[key]) el.textContent = currentTranslations[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if(currentTranslations[key]) el.setAttribute('placeholder', currentTranslations[key]);
  });
  document.documentElement.lang = currentLang;

  // If a page has its own re-render functions for dynamic content
  // (e.g. the attendance calendar), call them again so that content
  // picks up the new language too.
  if(typeof onLanguageChanged === 'function') onLanguageChanged();
}

function renderLanguageSwitcher(containerId){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = Object.keys(SUPPORTED_LANGS).map(code =>
    `<button class="lang-btn ${code===currentLang?'active':''}" onclick="loadLanguage('${code}')">${SUPPORTED_LANGS[code]}</button>`
  ).join('');
}

// Load the saved (or default) language as soon as this script runs.
loadLanguage(currentLang);