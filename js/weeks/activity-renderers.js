/* =========================================================
   ACTIVITY RENDERERS — the actual interactive-game rendering
   machinery (match-pairs, complete-sentence, tap-explore, etc.)
   lives here, in the weeks folder, not in main.js. main.js only
   ever calls ACTIVITY_RENDERERS[domainKey](...) — it has zero
   knowledge of how any specific activity type actually works.

   Must load AFTER main.js (see index.html) — it uses main.js's
   shared helpers (pickLang, currentDay, currentWeekKey, DAYS,
   DOMAINS), which are genuine top-level declarations in that
   file, not hidden inside any wrapper.
   ========================================================= */


  const OBJECTS = {
    bag:    {emoji:'🎒', label:'Bag'},
    book:   {emoji:'📖', label:'Book'},
    pencil: {emoji:'✏️', label:'Pencil'},
    bottle: {emoji:'🧴', label:'Bottle'},
    crayon: {emoji:'🖍️', label:'Crayon'},
    block:  {emoji:'🧱', label:'Block'}
  };

  // -----------------------------------------------------------------
  // H5P UI phrases — only the Language game is fully translated for
  // now, as the proof of concept. The other 7 interactive activities
  // (numeracy sort, social scenarios, physical game, creative art,
  // life skills, reflect, welcome explore) remain English-only —
  // translating each is its own separate follow-up.
  // -----------------------------------------------------------------
  const H5P_PHRASES = {
    what_is_this: 'What is this?',
    it_is_a:      'It is a...',
    prev:         '◀ Prev',
    reveal:       'Reveal',
    next:         'Next ▶',
    of:           'of',
    this_is_my:   'This is my'
  };

  function enableDrag(item, dropzones, onSuccess, onFail){
    item.style.touchAction = 'none';
    var origParent = item.parentElement;
    item.addEventListener('pointerdown', start);
    function start(e){
      e.preventDefault();
      item.setPointerCapture(e.pointerId);
      var rect = item.getBoundingClientRect();
      item._offX = e.clientX - rect.left;
      item._offY = e.clientY - rect.top;
      origParent = item.parentElement;
      item.style.position = 'fixed';
      item.style.zIndex = 1000;
      item.style.left = rect.left + 'px';
      item.style.top = rect.top + 'px';
      item.style.width = rect.width + 'px';
      item.style.height = rect.height + 'px';
      document.body.appendChild(item);
      item.addEventListener('pointermove', move);
      item.addEventListener('pointerup', end);
    }
    function move(e){
      item.style.left = (e.clientX - item._offX) + 'px';
      item.style.top = (e.clientY - item._offY) + 'px';
    }
    function end(e){
      item.removeEventListener('pointermove', move);
      item.removeEventListener('pointerup', end);
      try{ item.releasePointerCapture(e.pointerId); }catch(err){}
      var iRect = item.getBoundingClientRect();
      var dropped = null;
      dropzones.forEach(function(dz){
        var dRect = dz.getBoundingClientRect();
        var overlap = !(iRect.right < dRect.left || iRect.left > dRect.right ||
                        iRect.bottom < dRect.top || iRect.top > dRect.bottom);
        if(overlap) dropped = dz;
      });
      item.style.position = ''; item.style.zIndex = '';
      item.style.left = ''; item.style.top = '';
      item.style.width = ''; item.style.height = '';
      if(dropped){
        var accepts = (dropped.dataset.accepts || '').split(',');
        if(accepts.indexOf(item.dataset.key) !== -1){
          dropped.appendChild(item);
          item.classList.add('placed');
          item.removeEventListener('pointerdown', start);
          onSuccess && onSuccess(item, dropped);
        } else {
          origParent.appendChild(item);
          item.classList.add('g-shake');
          setTimeout(function(){ item.classList.remove('g-shake'); }, 400);
          onFail && onFail(item, dropped);
        }
      } else {
        origParent.appendChild(item);
      }
    }
  }

  // -----------------------------------------------------------------
  // GENERIC "complete the sentence" renderer — takes its actual
  // content from INTERACTIVE_ACTIVITIES (defined per week in
  // all-weeks.js), not hardcoded here. Works for any week that
  // defines a language activity of this type; this file has no
  // knowledge of which week is currently active.
  // -----------------------------------------------------------------
  function renderActivityNotConfigured(container){
    container.innerHTML = '<p class="sub">This activity has not been set up yet for this week.</p>';
  }

  function renderCompleteSentenceActivity(container, onComplete, item){
    var options = [item.answer].concat(item.wrong);
    options.sort(function(){ return Math.random() - 0.5; });

    container.innerHTML =
      '<div style="background:#E6F1FB; border:3px solid #378ADD; border-radius:16px; padding:16px; text-align:center;">' +
        '<div style="font-size:13px; font-weight:500; color:#042C53; margin-bottom:10px;">✏️ Complete the sentence</div>' +
        '<div style="background:#fff; border-radius:12px; padding:16px; font-size:16px; margin-bottom:14px;">' +
          item.prefix + ' <span id="csBlank" style="display:inline-block; min-width:70px; border-bottom:3px solid #378ADD; font-weight:500; color:#378ADD;">___</span>' + (item.suffix || '') + ' <button id="csSpeak" style="background:none; border:none; font-size:18px; cursor:pointer; vertical-align:middle;">🔊</button>' +
        '</div>' +
        '<div id="csOpts" style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;"></div>' +
        '<div id="csFeedback" style="margin-top:12px; font-size:14px; font-weight:500;"></div>' +
      '</div>';

    container.querySelector('#csSpeak').addEventListener('click', function(){ speakText(item.prefix + ' ' + item.answer + (item.suffix || '')); });

    var optsEl = container.querySelector('#csOpts');
    options.forEach(function(opt){
      var btn = document.createElement('button');
      btn.style.cssText = 'background:#fff; border:3px solid #85B7EB; border-radius:12px; padding:10px 16px; font-size:14px; cursor:pointer;';
      btn.textContent = opt;
      btn.addEventListener('click', function(){
        var isCorrect = opt === item.answer;
        if(isCorrect){
          Array.prototype.forEach.call(optsEl.children, function(b){ b.disabled = true; });
          btn.style.background = '#9FE1CB'; btn.style.borderColor = '#1D9E75';
          container.querySelector('#csBlank').textContent = item.answer;
          container.querySelector('#csFeedback').innerHTML = '<span style="color:#0F6E56;">✓ ' + (item.emoji || '') + ' That\'s right!</span>';
          onComplete();
        } else {
          // Wrong answer: lock out just this option, but leave the
          // others enabled so the child gets to try again — never
          // completes the activity on an incorrect guess.
          btn.disabled = true;
          btn.style.background = '#F5C4B3'; btn.style.borderColor = '#D85A30'; btn.style.cursor = 'default';
          container.querySelector('#csFeedback').innerHTML = '<span style="color:#993C1D;">Not quite — try another one!</span>';
        }
      });
      optsEl.appendChild(btn);
    });
  }

  function renderLanguageGame(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.language && weekConfig.language.days && weekConfig.language.days[currentDay]){
      var todayConfig = weekConfig.language.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  // -----------------------------------------------------------------
  // GENERIC "match the pairs" renderer — takes its pairs from
  // INTERACTIVE_ACTIVITIES (defined per week in all-weeks.js), not
  // hardcoded here. Reusable for any week that defines a numeracy
  // (or other domain) activity of this type.
  // -----------------------------------------------------------------
  function renderMatchPairsActivity(container, onComplete, config){
    var pairs = config.pairs;
    var matched = 0;

    var rowsHtml = pairs.map(function(p, idx){
      return '<div class="mp-row" data-idx="' + idx + '" style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">' +
        '<div style="flex:1; background:#fff; border:3px dashed #D3D1C7; border-radius:14px; padding:12px; display:flex; align-items:center; gap:10px;">' +
          '<span style="font-size:32px;">' + p.leftEmoji + '</span><span style="font-size:15px; font-weight:500;">' + p.left + '</span>' +
        '</div>' +
        '<button class="mp-connect" data-idx="' + idx + '" style="background:#fff; border:2px solid #AFA9EC; border-radius:50%; width:36px; height:36px; font-size:16px; cursor:pointer;">➜</button>' +
        '<div style="flex:1; background:#fff; border:3px dashed #D3D1C7; border-radius:14px; padding:12px; display:flex; align-items:center; gap:10px; justify-content:flex-end;">' +
          '<span style="font-size:15px; font-weight:500;">' + p.right + '</span><span style="font-size:32px;">' + p.rightEmoji + '</span>' +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div style="background:#EEEDFE; border:3px solid #AFA9EC; border-radius:16px; padding:16px;">' +
        '<div style="font-size:13px; font-weight:500; color:#3C3489; margin-bottom:2px;">🔗 Match the pairs</div>' +
        '<div style="font-size:13px; color:#534AB7; margin-bottom:14px;">' + (config.instruction || 'Tap each arrow to match the pairs.') + '</div>' +
        rowsHtml +
        '<div style="display:flex; align-items:center; gap:10px; margin-top:6px; background:#fff; border-radius:12px; padding:10px 14px;">' +
          '<span id="mpProgress" style="font-size:13px; font-weight:500; color:#3C3489;">0 of ' + pairs.length + ' matched</span>' +
          '<div style="flex:1; height:10px; background:#D3D1C7; border-radius:5px; overflow:hidden;"><div id="mpBar" style="width:0%; height:100%; background:#1D9E75;"></div></div>' +
        '</div>' +
      '</div>';

    container.querySelectorAll('.mp-connect').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(btn.disabled) return;
        btn.disabled = true;
        btn.style.background = '#1D9E75'; btn.style.color = '#fff'; btn.style.borderColor = '#1D9E75';
        var row = container.querySelector('.mp-row[data-idx="' + btn.getAttribute('data-idx') + '"]');
        row.querySelectorAll('div').forEach(function(box){
          box.style.border = '3px solid #1D9E75'; box.style.background = '#9FE1CB';
        });
        matched++;
        container.querySelector('#mpProgress').textContent = matched + ' of ' + pairs.length + ' matched';
        container.querySelector('#mpBar').style.width = Math.round((matched / pairs.length) * 100) + '%';
        if(matched >= pairs.length) onComplete();
      });
    });
  }

  function renderNumeracyGame(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.numeracy && weekConfig.numeracy.days && weekConfig.numeracy.days[currentDay]){
      var todayConfig = weekConfig.numeracy.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  function renderSocialGame(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.story && weekConfig.story.days && weekConfig.story.days[currentDay]){
      var todayConfig = weekConfig.story.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  // -----------------------------------------------------------------
  // GENERIC "jump count then guess the direction" renderer — tap to
  // count jumps up to a target, then guess which side a sound came
  // from. A different mechanic from step-count-find above, for
  // variety across days.
  // -----------------------------------------------------------------
  function renderJumpDirectionActivity(container, onComplete, dayConfig){
    var jumps = 0;

    container.innerHTML =
      '<div style="background:#EAF3DE; border:3px solid #639922; border-radius:16px; padding:16px; text-align:center;">' +
        '<div style="font-size:13px; font-weight:500; color:#173404; margin-bottom:2px;">🐸 Jump and listen</div>' +
        '<div style="font-size:13px; color:#3B6D11; margin-bottom:14px;">' + dayConfig.instruction + '</div>' +
        '<div id="jdMain">' +
          '<div id="jdCount" style="font-size:36px; font-weight:500; color:#173404; margin-bottom:10px;">0 / ' + dayConfig.targetJumps + '</div>' +
          '<button id="jdJumpBtn" class="btn-primary" style="width:auto; padding:10px 22px;">🐸 Jump!</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#jdJumpBtn').addEventListener('click', function(){
      jumps++;
      container.querySelector('#jdCount').textContent = jumps + ' / ' + dayConfig.targetJumps;
      if(jumps >= dayConfig.targetJumps){
        var optsHtml = dayConfig.directions.map(function(d, idx){
          return '<button class="jd-dir" data-idx="' + idx + '" style="background:#fff; border:3px solid #97C459; border-radius:14px; padding:16px; font-size:28px; cursor:pointer;">' + d.arrow + '</button>';
        }).join('');
        container.querySelector('#jdMain').innerHTML =
          '<div style="font-size:13px; font-weight:500; color:#173404; margin-bottom:10px;">' + dayConfig.soundEmoji + ' Which way did the sound come from?</div>' +
          '<div style="display:flex; gap:10px; justify-content:center;">' + optsHtml + '</div>' +
          '<div id="jdFeedback" style="margin-top:12px; font-size:14px; font-weight:500;"></div>';
        container.querySelectorAll('.jd-dir').forEach(function(btn){
          btn.addEventListener('click', function(){
            var idx = parseInt(btn.getAttribute('data-idx'), 10);
            var isCorrect = dayConfig.directions[idx].correct;
            if(isCorrect){
              container.querySelectorAll('.jd-dir').forEach(function(b){ b.disabled = true; });
              btn.style.background = '#C0DD97'; btn.style.borderColor = '#3B6D11';
              container.querySelector('#jdFeedback').innerHTML = '<span style="color:#27500A;">That\'s right!</span>';
              onComplete();
            } else {
              // Wrong direction: lock out just this option, leave
              // the rest tappable so the child can try again.
              btn.disabled = true;
              btn.style.background = '#F5C4B3'; btn.style.borderColor = '#D85A30'; btn.style.cursor = 'default';
              container.querySelector('#jdFeedback').innerHTML = '<span style="color:#993C1D;">Not quite — try another direction!</span>';
            }
          });
        });
      }
    });
  }

  function renderPhysicalGame(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.outdoor && weekConfig.outdoor.days && weekConfig.outdoor.days[currentDay]){
      var todayConfig = weekConfig.outdoor.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  function renderCreativeGame(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.create && weekConfig.create.days && weekConfig.create.days[currentDay]){
      var todayConfig = weekConfig.create.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  function renderLifeGame(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.tidy && weekConfig.tidy.days && weekConfig.tidy.days[currentDay]){
      var todayConfig = weekConfig.tidy.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  function renderReflectGame(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.reflect && weekConfig.reflect.days && weekConfig.reflect.days[currentDay]){
      var todayConfig = weekConfig.reflect.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  // -----------------------------------------------------------------
  // GENERIC "tap to explore" renderer — tap each hotspot to reveal
  // it, in any order. Content comes from all-weeks.js.
  // -----------------------------------------------------------------
  function renderTapExploreActivity(container, onComplete, dayConfig){
    var seen = 0, total = dayConfig.hotspots.length;
    var itemsHtml = dayConfig.hotspots.map(function(h, idx){
      return '<button class="te-spot" data-idx="' + idx + '" style="background:#fff; border:3px dashed #9FE1CB; border-radius:14px; padding:16px 10px; cursor:pointer; text-align:center;">' +
        '<div style="font-size:36px;">' + h.emoji + '</div>' +
        '<div class="te-label" style="font-size:12px; font-weight:500; color:#5F5E5A; margin-top:6px; visibility:hidden;">' + h.label + '</div>' +
      '</button>';
    }).join('');

    var songHtml = '';
    if(dayConfig.song){
      songHtml =
        '<div style="background:#fff; border-radius:12px; padding:16px; text-align:center; margin-bottom:14px;">' +
          '<div style="font-size:32px; margin-bottom:6px;">🎶</div>' +
          '<div style="font-size:14px; color:#5F5E5A; margin-bottom:10px;">' + dayConfig.song.lyrics + '</div>' +
          '<button id="teSongBtn" style="background:#1D9E75; color:#fff; border:none; padding:9px 18px;">▶ Play welcome song</button>' +
        '</div>';
    }

    container.innerHTML =
      '<div style="background:#E1F5EE; border:3px solid #1D9E75; border-radius:16px; padding:16px;">' +
        '<div style="font-size:13px; font-weight:500; color:#04342C; margin-bottom:2px;">👀 Tap to explore</div>' +
        '<div style="font-size:13px; color:#0F6E56; margin-bottom:12px;">' + dayConfig.instruction + '</div>' +
        songHtml +
        '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(90px,1fr)); gap:10px;">' + itemsHtml + '</div>' +
        '<div style="display:flex; align-items:center; gap:10px; margin-top:14px; background:#fff; border-radius:12px; padding:10px 14px;">' +
          '<span id="teProgress" style="font-size:13px; font-weight:500; color:#04342C;">0 of ' + total + ' found</span>' +
          '<div style="flex:1; height:10px; background:#D3D1C7; border-radius:5px; overflow:hidden;"><div id="teBar" style="width:0%; height:100%; background:#1D9E75;"></div></div>' +
        '</div>' +
      '</div>';

    if(dayConfig.song){
      container.querySelector('#teSongBtn').addEventListener('click', function(){
        if(!('speechSynthesis' in window)) return;
        var utter = new SpeechSynthesisUtterance(dayConfig.song.spoken || dayConfig.song.lyrics.replace(/"/g, ''));
        utter.rate = 0.85; utter.pitch = 1.3;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      });
    }

    container.querySelectorAll('.te-spot').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(btn.disabled) return;
        btn.disabled = true;
        btn.style.background = '#9FE1CB'; btn.style.borderStyle = 'solid'; btn.style.borderColor = '#1D9E75';
        btn.querySelector('.te-label').style.visibility = 'visible';
        seen++;
        container.querySelector('#teProgress').textContent = seen + ' of ' + total + ' found';
        container.querySelector('#teBar').style.width = Math.round((seen / total) * 100) + '%';
        if(seen >= total) onComplete();
      });
    });
  }

  // -----------------------------------------------------------------
  // GENERIC "tap along in order" renderer — tap each step in the
  // correct sequence; only the next expected step is tappable.
  // -----------------------------------------------------------------
  function renderTapSequenceActivity(container, onComplete, dayConfig){
    var next = 0, total = dayConfig.sequence.length;

    function renderRow(){
      var itemsHtml = dayConfig.sequence.map(function(s, idx){
        var isDone = idx < next, isNext = idx === next;
        var style = isDone ? 'background:#9FE1CB; border:3px solid #1D9E75;'
                  : isNext ? 'background:#fff; border:3px solid #7F77DD; box-shadow:0 0 0 3px #EEEDFE;'
                  : 'background:#fff; border:3px dashed #D3D1C7; opacity:0.6;';
        return '<button class="ts-step" data-idx="' + idx + '" style="' + style + ' border-radius:14px; padding:14px 10px; cursor:pointer; text-align:center; flex:1;">' +
          '<div style="font-size:32px;">' + s.emoji + '</div>' +
          '<div style="font-size:12px; font-weight:500; margin-top:4px;">' + s.label + '</div>' +
        '</button>';
      }).join('');
      container.querySelector('#tsRow').innerHTML = itemsHtml;
      container.querySelectorAll('.ts-step').forEach(function(btn){
        btn.addEventListener('click', function(){
          var idx = parseInt(btn.getAttribute('data-idx'), 10);
          if(idx !== next) return; // only the highlighted next step responds
          next++;
          container.querySelector('#tsProgress').textContent = next + ' of ' + total;
          if(next >= total) onComplete();
          else renderRow();
        });
      });
    }

    container.innerHTML =
      '<div style="background:#FAECE7; border:3px solid #D85A30; border-radius:16px; padding:16px;">' +
        '<div style="font-size:13px; font-weight:500; color:#4A1B0C; margin-bottom:2px;">🎵 Tap along</div>' +
        '<div style="font-size:13px; color:#993C1D; margin-bottom:14px;">' + dayConfig.instruction + '</div>' +
        '<div id="tsRow" style="display:flex; gap:8px;"></div>' +
        '<div id="tsProgress" style="margin-top:12px; font-size:13px; font-weight:500; color:#4A1B0C;">0 of ' + total + '</div>' +
      '</div>';
    renderRow();
  }

  // -----------------------------------------------------------------
  // GENERIC "colour and fill" renderer — pick a colour, tap a
  // region to fill it. Content (regions, palette) from all-weeks.js.
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // GENERIC "drag and drop" renderer — real HTML5 drag, not just tap.
  // Drag each item onto its correct destination.
  // -----------------------------------------------------------------
  function renderDragDropActivity(container, onComplete, dayConfig){
    var placed = 0, total = dayConfig.items.length;

    var destHtml = dayConfig.destinations.map(function(d, idx){
      return '<div class="dd-dest" data-accepts="' + d.accepts.join(',') + '" style="flex:1; background:#fff; border:3px dashed #9FE1CB; border-radius:14px; padding:14px; text-align:center; min-height:70px;">' +
        '<div style="font-size:32px;">' + d.emoji + '</div>' +
        '<div style="font-size:12px; font-weight:500; margin-top:4px;">' + d.label + '</div>' +
      '</div>';
    }).join('');

    var itemsHtml = dayConfig.items.map(function(it){
      return '<div class="dd-item" draggable="true" data-key="' + it.key + '" style="background:#fff; border:2px solid #D3D1C7; border-radius:10px; padding:10px; font-size:28px; cursor:grab; text-align:center;">' + it.emoji + '</div>';
    }).join('');

    container.innerHTML =
      '<div style="background:#E1F5EE; border:3px solid #1D9E75; border-radius:16px; padding:16px;">' +
        '<div style="font-size:13px; font-weight:500; color:#04342C; margin-bottom:2px;">✋ Drag and drop</div>' +
        '<div style="font-size:13px; color:#0F6E56; margin-bottom:12px;">' + dayConfig.instruction + '</div>' +
        '<div style="display:flex; gap:10px; margin-bottom:14px;">' + destHtml + '</div>' +
        '<div style="display:flex; gap:10px; flex-wrap:wrap;">' + itemsHtml + '</div>' +
        '<div style="display:flex; align-items:center; gap:10px; margin-top:14px; background:#fff; border-radius:12px; padding:10px 14px;">' +
          '<span id="ddProgress" style="font-size:13px; font-weight:500; color:#04342C;">0 of ' + total + ' placed</span>' +
          '<div style="flex:1; height:10px; background:#D3D1C7; border-radius:5px; overflow:hidden;"><div id="ddBar" style="width:0%; height:100%; background:#1D9E75;"></div></div>' +
        '</div>' +
      '</div>';

    var dests = Array.prototype.slice.call(container.querySelectorAll('.dd-dest'));
    var items = Array.prototype.slice.call(container.querySelectorAll('.dd-item'));

    items.forEach(function(item){
      item.addEventListener('dragstart', function(e){
        e.dataTransfer.setData('text/plain', item.getAttribute('data-key'));
      });
      // Touch-device fallback: tap the item, then tap a destination.
      item.addEventListener('click', function(){
        container.__ddSelected = item;
        items.forEach(function(i){ i.style.outline = 'none'; });
        item.style.outline = '3px solid #1D9E75';
      });
    });

    dests.forEach(function(dest){
      dest.addEventListener('dragover', function(e){ e.preventDefault(); });
      dest.addEventListener('drop', function(e){
        e.preventDefault();
        var key = e.dataTransfer.getData('text/plain');
        var item = items.find(function(i){ return i.getAttribute('data-key') === key; });
        tryPlace(item, dest);
      });
      dest.addEventListener('click', function(){
        if(container.__ddSelected) tryPlace(container.__ddSelected, dest);
      });
    });

    function tryPlace(item, dest){
      if(!item || item.getAttribute('data-placed')) return;
      var accepts = dest.getAttribute('data-accepts').split(',');
      if(accepts.indexOf(item.getAttribute('data-key')) === -1) return; // wrong destination, ignore
      item.setAttribute('data-placed', '1');
      item.style.opacity = '0.3'; item.style.cursor = 'default';
      dest.style.borderStyle = 'solid'; dest.style.borderColor = '#1D9E75'; dest.style.background = '#9FE1CB';
      placed++;
      container.querySelector('#ddProgress').textContent = placed + ' of ' + total + ' placed';
      container.querySelector('#ddBar').style.width = Math.round((placed / total) * 100) + '%';
      if(placed >= total) onComplete();
    }
  }

  // -----------------------------------------------------------------
  // GENERIC "sorting" renderer — sort items into 2+ category baskets.
  // -----------------------------------------------------------------
  function renderSortingActivity(container, onComplete, dayConfig){
    var sorted = 0, total = dayConfig.items.length;

    var basketsHtml = dayConfig.baskets.map(function(b){
      return '<div class="sort-basket" data-accepts="' + b.accepts.join(',') + '" style="flex:1; background:#fff; border:3px dashed #B5D4F4; border-radius:14px; padding:14px; text-align:center; min-height:70px;">' +
        '<div style="font-size:32px;">' + b.emoji + '</div>' +
        '<div style="font-size:12px; font-weight:500; margin-top:4px;">' + b.label + '</div>' +
      '</div>';
    }).join('');

    var itemsHtml = dayConfig.items.map(function(it){
      return '<div class="sort-item" data-key="' + it.key + '" style="background:#fff; border:2px solid #D3D1C7; border-radius:10px; padding:10px; font-size:28px; cursor:pointer; text-align:center;">' + it.emoji + '</div>';
    }).join('');

    container.innerHTML =
      '<div style="background:#E6F1FB; border:3px solid #378ADD; border-radius:16px; padding:16px;">' +
        '<div style="font-size:13px; font-weight:500; color:#042C53; margin-bottom:2px;">🧺 Sorting</div>' +
        '<div style="font-size:13px; color:#185FA5; margin-bottom:12px;">' + dayConfig.instruction + '</div>' +
        '<div style="display:flex; gap:10px; margin-bottom:14px;">' + basketsHtml + '</div>' +
        '<div style="display:flex; gap:10px; flex-wrap:wrap;">' + itemsHtml + '</div>' +
        '<div style="display:flex; align-items:center; gap:10px; margin-top:14px; background:#fff; border-radius:12px; padding:10px 14px;">' +
          '<span id="sortProgress" style="font-size:13px; font-weight:500; color:#042C53;">0 of ' + total + ' sorted</span>' +
          '<div style="flex:1; height:10px; background:#D3D1C7; border-radius:5px; overflow:hidden;"><div id="sortBar" style="width:0%; height:100%; background:#378ADD;"></div></div>' +
        '</div>' +
      '</div>';

    var baskets = Array.prototype.slice.call(container.querySelectorAll('.sort-basket'));
    var items = Array.prototype.slice.call(container.querySelectorAll('.sort-item'));
    var selected = null;

    items.forEach(function(item){
      item.addEventListener('click', function(){
        if(item.getAttribute('data-sorted')) return;
        items.forEach(function(i){ i.style.outline = 'none'; });
        selected = item;
        item.style.outline = '3px solid #378ADD';
      });
    });

    baskets.forEach(function(basket){
      basket.addEventListener('click', function(){
        if(!selected) return;
        var accepts = basket.getAttribute('data-accepts').split(',');
        if(accepts.indexOf(selected.getAttribute('data-key')) === -1) return; // wrong basket, ignore
        selected.setAttribute('data-sorted', '1');
        selected.style.opacity = '0.3'; selected.style.outline = 'none'; selected.style.cursor = 'default';
        basket.style.borderStyle = 'solid'; basket.style.borderColor = '#378ADD'; basket.style.background = '#B5D4F4';
        sorted++;
        selected = null;
        container.querySelector('#sortProgress').textContent = sorted + ' of ' + total + ' sorted';
        container.querySelector('#sortBar').style.width = Math.round((sorted / total) * 100) + '%';
        if(sorted >= total) onComplete();
      });
    });
  }

  // -----------------------------------------------------------------
  // GENERIC "true or false" renderer — a series of statements, one
  // at a time, with big True/False buttons.
  // -----------------------------------------------------------------
  // Reusable "read this aloud" helper — same browser text-to-speech
  // mechanism as the welcome song, available to any activity that
  // benefits from audio support for pre-readers.
  function speakText(text){
    if(!('speechSynthesis' in window)) return;
    var utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.85; utter.pitch = 1.15;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  function renderTrueFalseActivity(container, onComplete, dayConfig){
    var i = 0, total = dayConfig.statements.length;

    function renderStatement(){
      var s = dayConfig.statements[i];
      container.innerHTML =
        '<div style="background:#FCEBEB; border:3px solid #E24B4A; border-radius:16px; padding:16px; text-align:center;">' +
          '<div style="font-size:13px; font-weight:500; color:#501313; margin-bottom:2px;">✅❌ True or false</div>' +
          '<div style="font-size:12px; color:#A32D2D; margin-bottom:10px;">Statement ' + (i+1) + ' of ' + total + '</div>' +
          '<div style="background:#fff; border-radius:12px; padding:18px; font-size:16px; font-weight:500; margin-bottom:14px;">' +
            (s.emoji ? s.emoji + ' ' : '') + s.text + ' <button id="tfSpeak" style="background:none; border:none; font-size:18px; cursor:pointer; vertical-align:middle;">🔊</button>' +
          '</div>' +
          '<div style="display:flex; gap:12px; justify-content:center;">' +
            '<button id="tfTrue" style="background:#C0DD97; border:3px solid #3B6D11; border-radius:12px; padding:12px 24px; font-size:15px; font-weight:500; cursor:pointer; color:#173404;">✓ True</button>' +
            '<button id="tfFalse" style="background:#F7C1C1; border:3px solid #A32D2D; border-radius:12px; padding:12px 24px; font-size:15px; font-weight:500; cursor:pointer; color:#501313;">✗ False</button>' +
          '</div>' +
          '<div id="tfFeedback" style="margin-top:12px; font-size:14px; font-weight:500;"></div>' +
        '</div>';

      function answer(said){
        var correct = said === s.isTrue;
        container.querySelector('#tfTrue').disabled = true;
        container.querySelector('#tfFalse').disabled = true;
        container.querySelector('#tfFeedback').innerHTML = correct
          ? '<span style="color:#27500A;">✓ That\'s right!</span>'
          : '<span style="color:#993C1D;">Not quite — try the next one!</span>';
        setTimeout(function(){
          i++;
          if(i >= total) onComplete();
          else renderStatement();
        }, 900);
      }
      container.querySelector('#tfTrue').addEventListener('click', function(){ answer(true); });
      container.querySelector('#tfFalse').addEventListener('click', function(){ answer(false); });
      container.querySelector('#tfSpeak').addEventListener('click', function(){ speakText(s.text); });
    }
    renderStatement();
  }

  // -----------------------------------------------------------------
  // GENERIC "maze" renderer — tap each cell of the correct path, in
  // order, to walk from start to the goal.
  // -----------------------------------------------------------------
  function renderMazeActivity(container, onComplete, dayConfig){
    var next = 0, total = dayConfig.path.length;

    function renderGrid(){
      var cellsHtml = dayConfig.path.map(function(step, idx){
        var isDone = idx < next, isNext = idx === next, isGoal = idx === total - 1;
        var style = isDone ? 'background:#9FE1CB; border:3px solid #1D9E75;'
                  : isNext ? 'background:#fff; border:3px solid #7F77DD; box-shadow:0 0 0 3px #EEEDFE;'
                  : 'background:#fff; border:3px dashed #D3D1C7; opacity:0.5;';
        return '<button class="maze-step" data-idx="' + idx + '" style="' + style + ' border-radius:12px; padding:14px; font-size:' + (isGoal ? '32px' : '26px') + '; cursor:pointer;">' + step.emoji + '</button>';
      }).join('<span style="font-size:20px; color:#AFA9EC; align-self:center;">→</span>');

      container.innerHTML =
        '<div style="background:#EEEDFE; border:3px solid #AFA9EC; border-radius:16px; padding:16px;">' +
          '<div style="font-size:13px; font-weight:500; color:#3C3489; margin-bottom:2px;">🧭 Maze</div>' +
          '<div style="font-size:13px; color:#534AB7; margin-bottom:14px;">' + dayConfig.instruction + '</div>' +
          '<div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">' + cellsHtml + '</div>' +
        '</div>';

      container.querySelectorAll('.maze-step').forEach(function(btn){
        btn.addEventListener('click', function(){
          var idx = parseInt(btn.getAttribute('data-idx'), 10);
          if(idx !== next) return; // only the highlighted next step responds
          next++;
          if(next >= total) onComplete();
          else renderGrid();
        });
      });
    }
    renderGrid();
  }

  // -----------------------------------------------------------------
  // GENERIC "complete the pattern" renderer — a repeating sequence
  // with the last item missing; pick the correct one to finish it.
  // -----------------------------------------------------------------
  function renderCompletePatternActivity(container, onComplete, dayConfig){
    var patternHtml = dayConfig.pattern.map(function(emoji){
      return '<span style="font-size:32px;">' + emoji + '</span>';
    }).join(' ');

    var options = dayConfig.options.slice();
    options.sort(function(){ return Math.random() - 0.5; });

    container.innerHTML =
      '<div style="background:#FAEEDA; border:3px solid #BA7517; border-radius:16px; padding:16px; text-align:center;">' +
        '<div style="font-size:13px; font-weight:500; color:#412402; margin-bottom:2px;">🔁 Complete the pattern</div>' +
        '<div style="font-size:13px; color:#854F0B; margin-bottom:14px;">' + dayConfig.instruction + '</div>' +
        '<div style="background:#fff; border-radius:12px; padding:16px; margin-bottom:14px;">' + patternHtml + ' <span style="font-size:32px; border:2px dashed #BA7517; border-radius:8px; padding:2px 12px;">?</span></div>' +
        '<div id="cpOpts" style="display:flex; gap:10px; justify-content:center;"></div>' +
        '<div id="cpFeedback" style="margin-top:12px; font-size:14px; font-weight:500;"></div>' +
      '</div>';

    var optsEl = container.querySelector('#cpOpts');
    options.forEach(function(opt){
      var btn = document.createElement('button');
      btn.style.cssText = 'background:#fff; border:3px solid #FAC775; border-radius:12px; padding:10px 16px; font-size:28px; cursor:pointer;';
      btn.textContent = opt;
      btn.addEventListener('click', function(){
        var isCorrect = opt === dayConfig.answer;
        if(isCorrect){
          Array.prototype.forEach.call(optsEl.children, function(b){ b.disabled = true; });
          btn.style.background = '#FAC775'; btn.style.borderColor = '#854F0B';
          container.querySelector('#cpFeedback').innerHTML = '<span style="color:#633806;">✓ That\'s right!</span>';
          onComplete();
        } else {
          btn.disabled = true;
          btn.style.background = '#F5C4B3'; btn.style.borderColor = '#D85A30'; btn.style.cursor = 'default';
          container.querySelector('#cpFeedback').innerHTML = '<span style="color:#993C1D;">Not quite — try another one!</span>';
        }
      });
      optsEl.appendChild(btn);
    });
  }

  // -----------------------------------------------------------------
  // GENERIC "spot the difference" renderer — two rows of the same
  // items, except one item differs; tap the different one.
  // -----------------------------------------------------------------
  function renderSpotDifferenceActivity(container, onComplete, dayConfig){
    var rowAHtml = dayConfig.rowA.map(function(emoji){
      return '<span style="font-size:28px;">' + emoji + '</span>';
    }).join(' ');

    var rowBHtml = dayConfig.rowB.map(function(emoji, idx){
      return '<button class="sd-item" data-idx="' + idx + '" style="background:none; border:2px solid transparent; border-radius:8px; padding:2px 4px; font-size:28px; cursor:pointer;">' + emoji + '</button>';
    }).join(' ');

    container.innerHTML =
      '<div style="background:#FBEAF0; border:3px solid #D4537E; border-radius:16px; padding:16px; text-align:center;">' +
        '<div style="font-size:13px; font-weight:500; color:#4B1528; margin-bottom:2px;">🔍 Spot the difference</div>' +
        '<div style="font-size:13px; color:#993556; margin-bottom:14px;">' + dayConfig.instruction + '</div>' +
        '<div style="background:#fff; border-radius:12px; padding:14px; margin-bottom:8px;">' + rowAHtml + '</div>' +
        '<div style="background:#fff; border-radius:12px; padding:14px;">' + rowBHtml + '</div>' +
        '<div id="sdFeedback" style="margin-top:12px; font-size:14px; font-weight:500;"></div>' +
      '</div>';

    container.querySelectorAll('.sd-item').forEach(function(btn){
      btn.addEventListener('click', function(){
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        if(idx === dayConfig.differentIndex){
          container.querySelectorAll('.sd-item').forEach(function(b){ b.disabled = true; });
          btn.style.borderColor = '#993556'; btn.style.background = '#F4C0D1';
          container.querySelector('#sdFeedback').innerHTML = '<span style="color:#72243E;">✓ Found it!</span>';
          onComplete();
        } else {
          container.querySelector('#sdFeedback').innerHTML = '<span style="color:#993C1D;">Not that one — keep looking!</span>';
        }
      });
    });
  }

  function renderColourFillActivity(container, onComplete, dayConfig){
    var filled = 0, total = dayConfig.regions.length, currentColour = dayConfig.palette[0];

    var paletteHtml = dayConfig.palette.map(function(c, idx){
      return '<button class="cf-swatch" data-idx="' + idx + '" style="width:34px; height:34px; border-radius:50%; background:' + c + '; border:3px solid ' + (idx===0 ? '#4B1528' : 'transparent') + '; cursor:pointer;"></button>';
    }).join('');

    var regionsHtml = dayConfig.regions.map(function(r, idx){
      return '<button class="cf-region" data-idx="' + idx + '" style="background:#fff; border:3px dashed #D3D1C7; border-radius:14px; padding:16px 10px; cursor:pointer; text-align:center; flex:1;">' +
        '<div style="font-size:28px;">' + (r.emoji || '⬜') + '</div>' +
        '<div style="font-size:12px; font-weight:500; margin-top:4px;">' + r.label + '</div>' +
      '</button>';
    }).join('');

    container.innerHTML =
      '<div style="background:#FBEAF0; border:3px solid #D4537E; border-radius:16px; padding:16px;">' +
        '<div style="font-size:13px; font-weight:500; color:#4B1528; margin-bottom:2px;">🖍️ Draw and colour</div>' +
        '<div style="font-size:13px; color:#993556; margin-bottom:12px;">' + dayConfig.instruction + '</div>' +
        '<div style="display:flex; gap:8px; margin-bottom:14px;">' + paletteHtml + '</div>' +
        '<div style="display:flex; gap:10px;">' + regionsHtml + '</div>' +
        '<div style="margin-top:12px; font-size:13px; font-weight:500; color:#4B1528;" id="cfProgress">0 of ' + total + ' coloured</div>' +
      '</div>';

    container.querySelectorAll('.cf-swatch').forEach(function(btn){
      btn.addEventListener('click', function(){
        container.querySelectorAll('.cf-swatch').forEach(function(s){ s.style.borderColor = 'transparent'; });
        btn.style.borderColor = '#4B1528';
        currentColour = dayConfig.palette[parseInt(btn.getAttribute('data-idx'), 10)];
      });
    });
    container.querySelectorAll('.cf-region').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(btn.getAttribute('data-filled')) return;
        btn.setAttribute('data-filled', '1');
        btn.style.background = currentColour; btn.style.border = '3px solid #4B1528';
        filled++;
        container.querySelector('#cfProgress').textContent = filled + ' of ' + total + ' coloured';
        if(filled >= total) onComplete();
      });
    });
  }

  // -----------------------------------------------------------------
  // GENERIC "count steps then find" renderer — tap to count up to
  // a target, then a single tap-to-find reveal.
  // -----------------------------------------------------------------
  function renderStepCountFindActivity(container, onComplete, dayConfig){
    var steps = 0;

    container.innerHTML =
      '<div style="background:#EAF3DE; border:3px solid #639922; border-radius:16px; padding:16px; text-align:center;">' +
        '<div style="font-size:13px; font-weight:500; color:#173404; margin-bottom:2px;">👣 Count and play</div>' +
        '<div style="font-size:13px; color:#3B6D11; margin-bottom:14px;">' + dayConfig.instruction + '</div>' +
        '<div id="scfMain">' +
          '<div id="scfCount" style="font-size:36px; font-weight:500; color:#173404; margin-bottom:10px;">0 / ' + dayConfig.targetSteps + '</div>' +
          '<button id="scfStepBtn" class="btn-primary" style="width:auto; padding:10px 22px;">👣 Take a step</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#scfStepBtn').addEventListener('click', function(){
      steps++;
      container.querySelector('#scfCount').textContent = steps + ' / ' + dayConfig.targetSteps;
      if(steps >= dayConfig.targetSteps){
        container.querySelector('#scfMain').innerHTML =
          '<div style="font-size:13px; font-weight:500; color:#173404; margin-bottom:10px;">Now find the ' + dayConfig.findLabel + '!</div>' +
          '<button id="scfFindBtn" style="background:none; border:3px dashed #639922; border-radius:14px; padding:20px; font-size:48px; cursor:pointer;">' + dayConfig.findEmoji + '</button>';
        container.querySelector('#scfFindBtn').addEventListener('click', function(){
          this.style.border = '3px solid #3B6D11'; this.style.background = '#C0DD97';
          onComplete();
        });
      }
    });
  }

  // -----------------------------------------------------------------
  // GENERIC "tick the box" renderer — one or more picture options,
  // each with its own checkbox. Tap the correct picture(s) to tick
  // them; wrong ones lock out with a cross but never block trying
  // again, same "never complete on a wrong guess" rule as
  // complete-sentence. Distinct from true-false: this shows several
  // pictures side by side to choose from, not one statement to judge.
  // -----------------------------------------------------------------
  function renderTickChoiceActivity(container, onComplete, dayConfig){
    var totalCorrect = dayConfig.options.filter(function(o){ return o.correct; }).length;
    var tickedCorrect = 0;

    var optsHtml = dayConfig.options.map(function(o, idx){
      return '<button class="tc-opt" data-idx="' + idx + '" style="background:#fff; border:3px dashed #D3D1C7; border-radius:14px; padding:14px 10px; cursor:pointer; text-align:center;">' +
        '<div style="font-size:36px;">' + o.emoji + '</div>' +
        '<div style="font-size:12px; font-weight:500; color:#5F5E5A; margin:6px 0;">' + (o.label || '') + '</div>' +
        '<div class="tc-box" style="width:26px; height:26px; margin:0 auto; border:2px solid #AFA9EC; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:16px;"></div>' +
      '</button>';
    }).join('');

    container.innerHTML =
      '<div style="background:#EEEDFE; border:3px solid #AFA9EC; border-radius:16px; padding:16px;">' +
        '<div style="font-size:13px; font-weight:500; color:#3C3489; margin-bottom:2px;">☑️ Tick the box</div>' +
        '<div style="font-size:13px; color:#534AB7; margin-bottom:14px;">' + dayConfig.instruction + '</div>' +
        '<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); gap:10px;">' + optsHtml + '</div>' +
        '<div id="tcFeedback" style="margin-top:12px; font-size:14px; font-weight:500;"></div>' +
      '</div>';

    container.querySelectorAll('.tc-opt').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(btn.disabled) return;
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        var opt = dayConfig.options[idx];
        var box = btn.querySelector('.tc-box');
        btn.disabled = true;
        if(opt.correct){
          box.style.background = '#9FE1CB'; box.style.borderColor = '#1D9E75'; box.textContent = '✓';
          btn.style.borderStyle = 'solid'; btn.style.borderColor = '#1D9E75';
          tickedCorrect++;
          if(tickedCorrect >= totalCorrect){
            container.querySelector('#tcFeedback').innerHTML = '<span style="color:#0F6E56;">✓ All correct!</span>';
            onComplete();
          }
        } else {
          box.style.background = '#F5C4B3'; box.style.borderColor = '#D85A30'; box.textContent = '✗';
          btn.style.borderColor = '#D85A30'; btn.style.cursor = 'default';
          container.querySelector('#tcFeedback').innerHTML = '<span style="color:#993C1D;">Not that one — try another!</span>';
        }
      });
    });
  }

  // Every activity type, mapped to its renderer — any domain can use
  // any of these, since the type actually decides how it renders,
  // not which domain it happens to be attached to.
  var GENERIC_TYPE_RENDERERS = {
    'tap-explore': renderTapExploreActivity,
    'tap-sequence': renderTapSequenceActivity,
    'match-pairs': renderMatchPairsActivity,
    'complete-sentence': renderCompleteSentenceActivity,
    'colour-fill': renderColourFillActivity,
    'step-count-find': renderStepCountFindActivity,
    'jump-direction': renderJumpDirectionActivity,
    'drag-drop': renderDragDropActivity,
    'sorting': renderSortingActivity,
    'true-false': renderTrueFalseActivity,
    'maze': renderMazeActivity,
    'complete-pattern': renderCompletePatternActivity,
    'spot-difference': renderSpotDifferenceActivity,
    'tick-choice': renderTickChoiceActivity
  };

  function renderWelcomeExplore(container, onComplete){
    var weekConfig = (typeof INTERACTIVE_ACTIVITIES !== 'undefined' && INTERACTIVE_ACTIVITIES[currentWeekKey()]) || {};
    if(weekConfig.welcome && weekConfig.welcome.days && weekConfig.welcome.days[currentDay]){
      var todayConfig = weekConfig.welcome.days[currentDay];
      var renderer = GENERIC_TYPE_RENDERERS[todayConfig.type];
      if(renderer){ renderer(container, onComplete, todayConfig); return; }
    }
    renderActivityNotConfigured(container);
  }

  const ACTIVITY_RENDERERS = {
    welcome:  renderWelcomeExplore,
    story:    renderSocialGame,
    numeracy: renderNumeracyGame,
    language: renderLanguageGame,
    create:   renderCreativeGame,
    outdoor:  renderPhysicalGame,
    tidy:     renderLifeGame,
    reflect:  renderReflectGame
  };