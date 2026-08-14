// ===== Textbook data =====
const TEXTBOOKS = {
  'jrkg': [
    { id:'vaani-jr-alphabets',   title:'Vaani — Alphabets',        subject:'Language', color:'#1d9e75', file:'https://bhavyatafoundation.com/workbooks/vaani-jr-alphabets.pdf' },
    { id:'vaani-jr-phonics',   title:'Vaani — Phonics & Alphabets',        subject:'Language', color:'#2C8FC4', file:'https://bhavyatafoundation.com/workbooks/vaani-jr-phonics.pdf' },
    { id:'khelika-jrkg', title:'Khelika Activity Book', subject:'Activity', color:'#EE8F35', file:'https://bhavyatafoundation.com/workbooks/khelika-activity-jrkg.pdf' }
  ],
  'srkg': [
    { id:'sopanika-srkg',       title:'Sopanika — All Activity', subject:'Activity', color:'#1d9e75', file:'https://bhavyatafoundation.com/workbooks/sopanika-activity-srkg.pdf' },
    { id:'uvach-alphabets-srkg', title:'Uvach — Alphabets',      subject:'Language', color:'#EE8F35', file:'https://bhavyatafoundation.com/workbooks/uvach-alphabets-srkg.pdf' },
    { id:'uvach-phonics-srkg',   title:'Uvach — Phonics',        subject:'Language', color:'#2C8FC4', file:'https://bhavyatafoundation.com/workbooks/uvach-phonics-srkg.pdf' }
  ]
};

const DIVISION_LABELS = { jrkg:'Jr KG', srkg:'Sr KG' };
let activeDivision = 'jrkg';
let currentBook = null;
let currentPageIdx = 0;
let currentNumPages = 1;
let isFlipping = false;

const pdfCache = {};
const pageImageCache = {};

// ===== PDF loading & rendering =====
async function loadPdf(bookId){
  if(pdfCache[bookId]) return pdfCache[bookId];
  const book = findBook(bookId);
  const pdf = await pdfjsLib.getDocument(book.file).promise;
  pdfCache[bookId] = pdf;
  return pdf;
}

async function renderPageToImage(bookId, pageNum){
  const cacheKey = bookId + '-' + pageNum;
  if(pageImageCache[cacheKey]) return pageImageCache[cacheKey];
  const pdf = await loadPdf(bookId);
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.5 });
  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  pageImageCache[cacheKey] = dataUrl;
  return dataUrl;
}

function prefetchNeighbours(bookId, pageIdx, numPages){
  if(pageIdx + 1 < numPages) renderPageToImage(bookId, pageIdx + 2).catch(()=>{});
  if(pageIdx - 1 >= 0) renderPageToImage(bookId, pageIdx).catch(()=>{});
}

// ===== Flip sound (synthesized — no audio file needed) =====
let flipAudioCtx = null;
let flipSoundEnabled = true;
function playFlipSound(){
  if(!flipSoundEnabled) return;
  try{
    if(!flipAudioCtx) flipAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = flipAudioCtx;
    if(ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    // --- Part 1: the swish — smoothed ("pinkish") noise instead of raw white noise,
    // which is what made the old version sound harsh/staticky rather than soft.
    const swishDuration = 0.26;
    const bufferSize = Math.floor(ctx.sampleRate * swishDuration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let prev = 0;
    for(let i = 0; i < bufferSize; i++){
      const white = Math.random() * 2 - 1;
      // Simple leaky-integrator smoothing turns sharp white noise into a
      // softer, breathier texture — closer to fabric/paper than radio static.
      prev = prev * 0.92 + white * 0.08;
      data[i] = prev * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(900, now);
    bandpass.frequency.linearRampToValueAtTime(1400, now + swishDuration * 0.5);
    bandpass.frequency.linearRampToValueAtTime(600, now + swishDuration);
    bandpass.Q.value = 0.4;

    const swishGain = ctx.createGain();
    swishGain.gain.setValueAtTime(0, now);
    swishGain.gain.linearRampToValueAtTime(0.11, now + 0.06);
    swishGain.gain.exponentialRampToValueAtTime(0.001, now + swishDuration);

    noise.connect(bandpass).connect(swishGain).connect(ctx.destination);
    noise.start(now);
    noise.stop(now + swishDuration + 0.02);

    // --- Part 2: a soft landing "thump" as the page settles, like a fingertip
    // pressing a page flat — gives the ear a sense of completion instead of
    // the sound just trailing off into nothing.
    const thumpStart = now + swishDuration * 0.75;
    const thump = ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(160, thumpStart);
    thump.frequency.exponentialRampToValueAtTime(70, thumpStart + 0.09);

    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(0, thumpStart);
    thumpGain.gain.linearRampToValueAtTime(0.05, thumpStart + 0.015);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, thumpStart + 0.1);

    thump.connect(thumpGain).connect(ctx.destination);
    thump.start(thumpStart);
    thump.stop(thumpStart + 0.12);
  } catch(e){
    // Web Audio unsupported or blocked — flip just proceeds silently.
  }
}

// ===== Division tabs & grid =====
function switchTextbookDivision(div){
  activeDivision = div;
  renderDivisionTabs();
  renderBookGrid();
}

function renderDivisionTabs(){
  const el = document.getElementById('division-tabs');
  if(!el) return;
  el.innerHTML = Object.keys(DIVISION_LABELS).map(d => `
    <button class="division-tab ${d===activeDivision?'active':''}" onclick="switchTextbookDivision('${d}')">${DIVISION_LABELS[d]}</button>
  `).join('');
}

function renderBookGrid(){
  const el = document.getElementById('textbook-body');
  if(!el) return;
  const books = TEXTBOOKS[activeDivision] || [];
  el.innerHTML = `
    <h1>${DIVISION_LABELS[activeDivision]} Textbooks</h1>
    <p class="sub">${books.length} book${books.length===1?'':'s'} available</p>
    <div class="book-grid">
      ${books.map(b => `
        <div class="book-card" onclick="openBookReader('${b.id}')">
          <div class="book-cover" id="book-cover-${b.id}" style="background-color:${b.color};">
            <span class="book-cover-emoji">📖</span>
          </div>
          <div class="book-info">
            <div class="book-title">${b.title}</div>
            <div class="book-subject">${b.subject}</div>
            <div class="book-pagecount">Tap to open</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  books.forEach(b => {
    renderPageToImage(b.id, 1).then(url => {
      const coverEl = document.getElementById(`book-cover-${b.id}`);
      if(coverEl){
        coverEl.style.backgroundImage = `url(${url})`;
        coverEl.querySelector('.book-cover-emoji').style.display = 'none';
      }
    }).catch(() => {});
  });
}

function findBook(id){
  for(const div in TEXTBOOKS){
    const found = TEXTBOOKS[div].find(b => b.id === id);
    if(found) return found;
  }
  return null;
}

// ===== Reader overlay =====
async function openBookReader(bookId){
  currentBook = findBook(bookId);
  if(!currentBook) return;
  currentPageIdx = 0;
  document.getElementById('book-reader-overlay').classList.remove('hidden');
  document.getElementById('reader-title').textContent = currentBook.title;
  document.getElementById('reader-page-count').textContent = 'Loading…';
  showStatus('Loading book…');

  try{
    const pdf = await loadPdf(bookId);
    currentNumPages = pdf.numPages;
    const url = await renderPageToImage(bookId, 1);
    hideStatus();
    document.getElementById('page-base-img').src = url;
    document.getElementById('page-leaf-img').src = url;
    resetLeaf();
    updateReaderChrome();
    prefetchNeighbours(bookId, 0, currentNumPages);
  } catch(err){
    showStatus(`Couldn't load this PDF. Check that <code>${currentBook.file}</code> exists in your assets folder.`);
    document.getElementById('reader-page-count').textContent = '';
  }
}

function closeBookReader(){
  if(document.fullscreenElement) document.exitFullscreen();
  document.getElementById('book-reader-overlay').classList.add('hidden');
  currentBook = null;
}

function showStatus(html){
  const el = document.getElementById('page-status');
  el.innerHTML = html;
  el.classList.remove('hidden');
}
function hideStatus(){
  document.getElementById('page-status').classList.add('hidden');
}

function resetLeaf(){
  const leaf = document.getElementById('page-leaf');
  leaf.classList.remove('flip-fwd', 'flip-back');
  leaf.style.transform = 'rotateY(0deg)';
}

function updateReaderChrome(){
  document.getElementById('reader-page-count').textContent = `Page ${currentPageIdx+1} of ${currentNumPages}`;
  document.getElementById('reader-prev').disabled = currentPageIdx === 0;
  document.getElementById('reader-next').disabled = currentPageIdx === currentNumPages - 1;
}

// ===== The actual page-turn: leaf (current page) rotates away on top of the
// base layer (which already holds the destination page underneath) =====
async function flipPage(direction){
  if(isFlipping || !currentBook) return;
  const nextIdx = currentPageIdx + direction;
  if(nextIdx < 0 || nextIdx >= currentNumPages) return;

  isFlipping = true;
  playFlipSound();

  const leaf = document.getElementById('page-leaf');
  const baseImg = document.getElementById('page-base-img');

  let destUrl;
  try{
    destUrl = await renderPageToImage(currentBook.id, nextIdx + 1);
  } catch(e){
    isFlipping = false;
    return;
  }

  baseImg.src = destUrl;
  leaf.style.transformOrigin = direction > 0 ? 'left center' : 'right center';
  resetLeaf();

  requestAnimationFrame(() => {
    leaf.classList.add(direction > 0 ? 'flip-fwd' : 'flip-back');
  });

  setTimeout(() => {
    currentPageIdx = nextIdx;
    document.getElementById('page-leaf-img').src = destUrl;
    resetLeaf();
    updateReaderChrome();
    prefetchNeighbours(currentBook.id, currentPageIdx, currentNumPages);
    isFlipping = false;
  }, 620);
}

function toggleFlipSound(){
  flipSoundEnabled = !flipSoundEnabled;
  const btn = document.getElementById('soundToggleBtn');
  if(btn) btn.textContent = flipSoundEnabled ? '🔊' : '🔇';
}

// ===== Fullscreen =====
function toggleFullscreen(){
  const overlay = document.getElementById('book-reader-overlay');
  if(!document.fullscreenElement){
    overlay.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}
document.addEventListener('fullscreenchange', () => {
  const btn = document.getElementById('fullscreenBtn');
  if(btn) btn.textContent = document.fullscreenElement ? '⤢' : '⛶';
});

document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('book-reader-overlay');
  if(!overlay || overlay.classList.contains('hidden')) return;
  if(e.key === 'ArrowRight') flipPage(1);
  if(e.key === 'ArrowLeft') flipPage(-1);
  if(e.key === 'Escape') closeBookReader();
});

renderDivisionTabs();
renderBookGrid();