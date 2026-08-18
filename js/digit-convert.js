/* =========================================================
   DIGIT CONVERSION — Google Translate only translates words,
   never numeral glyphs (0-9 stays 0-9 even when translated to
   Hindi/Marathi/Gujarati). This script bolts on what Google's
   widget doesn't do: converting 0-9 into native numeral glyphs
   when a target language is active, and back to 0-9 for English.

   HOW IT DETECTS THE CURRENT LANGUAGE:
   Google's widget sets a cookie named "googtrans" (e.g. "/en/hi")
   when a language is selected — there's no other reliable signal
   it exposes, so this is checked on a short interval rather than
   a proper event, since Google's widget doesn't fire one.

   KNOWN FRAGILITY (read before relying on this):
   - Runs independently of Google's own translation timing, so
     there can be a brief flash of 0-9 right after switching
     language, until the next check/mutation catches up.
   - Uses a MutationObserver to catch numbers that appear later
     (e.g. after clicking into a different domain card) — this
     re-scans the whole page on every DOM change, which is fine
     at this app's current size but could get slow if the page
     grows much larger.
   - If Google ever changes the cookie name/format, this breaks
     silently (no error, numbers just stop converting). If that
     happens, check document.cookie manually in DevTools to see
     what Google is actually setting.
   ========================================================= */

(function(){
  var DIGIT_MAPS = {
    hi: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
    mr: {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'},
    gu: {'0':'૦','1':'૧','2':'૨','3':'૩','4':'૪','5':'૫','6':'૬','7':'૭','8':'૮','9':'૯'}
  };

  // Reverse maps — for converting native glyphs back to 0-9 when the
  // selected language is English (or anything not in DIGIT_MAPS).
  var REVERSE_MAP = {};
  Object.keys(DIGIT_MAPS).forEach(function(lang){
    Object.keys(DIGIT_MAPS[lang]).forEach(function(western){
      REVERSE_MAP[DIGIT_MAPS[lang][western]] = western;
    });
  });

  function getCurrentTranslateLang(){
    var match = document.cookie.match(/googtrans=\/[^/]*\/([a-zA-Z-]+)/);
    return match ? match[1] : 'en';
  }

  function convertTextNode(node, map){
    var text = node.nodeValue;
    var changed = false;
    var result = text.replace(/[0-9०-९૦-૯]/g, function(ch){
      if(map[ch]){ changed = true; return map[ch]; }
      return ch;
    });
    if(changed) node.nodeValue = result;
  }

  function walkAndConvert(root, map){
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node){
        var p = node.parentElement;
        if(!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if(tag === 'SCRIPT' || tag === 'STYLE' || tag === 'INPUT' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
        if(p.closest('#google_translate_element')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while((node = walker.nextNode())){
      convertTextNode(node, map);
    }
  }

  function applyDigitConversion(){
    var lang = getCurrentTranslateLang();
    var map = DIGIT_MAPS[lang] || REVERSE_MAP;
    walkAndConvert(document.body, map);
  }

  var lastLang = null;
  setInterval(function(){
    var lang = getCurrentTranslateLang();
    if(lang !== lastLang){
      lastLang = lang;
      applyDigitConversion();
    }
  }, 800);

  // Re-apply whenever the page's own content changes — this app rebuilds
  // a lot of its content via innerHTML (domain cards, attendance banner,
  // sidebar), so newly-rendered numbers need catching too, not just what
  // was on the page at load. Naturally stops re-triggering itself once
  // everything is already converted (nothing left to change = no new
  // mutation gets queued), so this doesn't loop forever.
  var observer = new MutationObserver(function(){
    applyDigitConversion();
  });

  document.addEventListener('DOMContentLoaded', function(){
    applyDigitConversion();
    observer.observe(document.body, {childList:true, subtree:true, characterData:true});
  });
})();