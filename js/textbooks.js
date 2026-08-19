// ===== Textbook data =====
const TEXTBOOKS = {
  'jrkg': [
    { id:'vaani-jr-alphabets',   title:'Vaani — Alphabets',        subject:'Language', color:'#1d9e75', file:'assets/textbooks/vaani-jr-alphabets.pdf' },
    { id:'vaani-jr-phonics',   title:'Vaani — Phonics & Alphabets',        subject:'Language', color:'#2C8FC4', file:'assets/textbooks/vaani-jr-phonics.pdf' },
    { id:'khelika-jrkg', title:'Khelika Activity Book', subject:'Activity', color:'#EE8F35', file:'assets/textbooks/khelika-activity-jrkg.pdf' }
  ],
  'srkg': [
    { id:'sopanika-srkg',       title:'Sopanika — All Activity', subject:'Activity', color:'#1d9e75', file:'assets/textbooks/sopanika-activity-srkg.pdf' },
    { id:'uvach-alphabets-srkg', title:'Uvach — Alphabets',      subject:'Language', color:'#EE8F35', file:'assets/textbooks/uvach-alphabets-srkg.pdf' },
    { id:'uvach-phonics-srkg',   title:'Uvach — Phonics',        subject:'Language', color:'#2C8FC4', file:'assets/textbooks/uvach-phonics-srkg.pdf' }
  ]
};

const DIVISION_LABELS = { jrkg:'Jr KG', srkg:'Sr KG' };
let activeDivision = 'jrkg';
let currentBook = null;
let currentPageIdx = 0;
let currentNumPages = 1;
let isFlipping = false;
let completedPagesForCurrentBook = [];

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

// ===== Progress tracking — localStorage for now, not the database.
// Same reasoning as "My Attendance": this is personal to the teacher
// using this specific browser, not something another role needs to
// see yet. Keyed per book, so each book tracks its own bookmark and
// completed pages independently. =====
function getBookProgress(bookId){
  try{
    const raw = localStorage.getItem('textbookProgress_' + bookId);
    return raw ? JSON.parse(raw) : { lastViewedPage: 1, completedPages: [] };
  }catch(e){
    return { lastViewedPage: 1, completedPages: [] };
  }
}

function saveBookProgress(bookId, progress){
  try{
    localStorage.setItem('textbookProgress_' + bookId, JSON.stringify(progress));
  }catch(e){ /* localStorage unavailable — progress just won't persist this session */ }
}

// ===== Reader overlay =====
async function openBookReader(bookId){
  currentBook = findBook(bookId);
  if(!currentBook) return;
  currentPageIdx = 0;
  document.getElementById('book-reader-overlay').classList.remove('hidden');
  document.getElementById('page-complete-toggle').classList.remove('hidden');
  document.getElementById('reader-title').textContent = currentBook.title;
  document.getElementById('reader-page-count').textContent = 'Loading…';
  showStatus('Loading book…');

  try{
    const pdf = await loadPdf(bookId);
    currentNumPages = pdf.numPages;

    // Resume from wherever this teacher last left off, rather than
    // always starting at page 1 — the same behaviour as a phone's
    // reading apps.
    const progress = getBookProgress(bookId);
    const resumePage = Math.min(Math.max(progress.lastViewedPage || 1, 1), currentNumPages);
    completedPagesForCurrentBook = progress.completedPages || [];

    currentPageIdx = resumePage - 1;
    const url = await renderPageToImage(bookId, resumePage);
    hideStatus();
    document.getElementById('page-base-img').src = url;
    document.getElementById('page-leaf-img').src = url;
    resetLeaf();
    updateReaderChrome();
    prefetchNeighbours(bookId, currentPageIdx, currentNumPages);
    saveBookProgress(bookId, { lastViewedPage: resumePage, completedPages: completedPagesForCurrentBook });
  } catch(err){
    showStatus(`Couldn't load this PDF. Check that <code>${currentBook.file}</code> exists in your assets folder.`);
    document.getElementById('reader-page-count').textContent = '';
  }
}

function closeBookReader(){
  if(document.fullscreenElement) document.exitFullscreen();
  document.getElementById('book-reader-overlay').classList.add('hidden');
  document.getElementById('page-complete-toggle').classList.add('hidden');
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
  const pageNum = currentPageIdx + 1;
  const isDone = completedPagesForCurrentBook.includes(pageNum);
  document.getElementById('reader-page-count').innerHTML =
    `Page ${pageNum} of ${currentNumPages} · ${completedPagesForCurrentBook.length} page${completedPagesForCurrentBook.length===1?'':'s'} completed`;
  document.getElementById('reader-prev').disabled = currentPageIdx === 0;
  document.getElementById('reader-next').disabled = currentPageIdx === currentNumPages - 1;

  const toggleEl = document.getElementById('page-complete-toggle');
  if(toggleEl){
    toggleEl.classList.toggle('is-done', isDone);
    toggleEl.querySelector('.pct-label').textContent = isDone ? 'Marked as completed' : 'Mark this page as completed';
  }
}

function saveProgress(payload){
  if(!currentBook) return;
  const progress = getBookProgress(currentBook.id);
  if(payload.last_viewed_page !== undefined) progress.lastViewedPage = payload.last_viewed_page;
  progress.completedPages = completedPagesForCurrentBook;
  saveBookProgress(currentBook.id, progress);
}

function toggleCurrentPageComplete(){
  const pageNum = currentPageIdx + 1;
  if(completedPagesForCurrentBook.includes(pageNum)){
    completedPagesForCurrentBook = completedPagesForCurrentBook.filter(p => p !== pageNum);
  } else {
    completedPagesForCurrentBook.push(pageNum);
  }
  updateReaderChrome();
  saveProgress({});
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
    saveProgress({ last_viewed_page: currentPageIdx + 1 });
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