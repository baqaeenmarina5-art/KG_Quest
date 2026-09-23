/* ---------- shared helpers ---------- */
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function pick(arr,n){ return shuffle(arr).slice(0,n); }

let stars=0, gameStars={};
try{ const saved=JSON.parse(localStorage.getItem('curriculum_progress')||'{}'); stars=saved.stars||0; gameStars=saved.gameStars||{}; }catch(e){}
function saveProgress(){ try{ localStorage.setItem('curriculum_progress', JSON.stringify({stars,gameStars})); }catch(e){} }
function renderStarsUI(){
  document.getElementById('starsCount').textContent = stars;
  Object.keys(gameStars).forEach(k=>{ const el=document.getElementById('stars-'+k); if(el) el.textContent = gameStars[k] ? '⭐':''; });
}
function awardStar(key){ if(!gameStars[key]){ gameStars[key]=true; stars+=1; saveProgress(); } renderStarsUI(); }
renderStarsUI();

let currentUnit=null;
const backBtn=document.getElementById('backBtn');
function setBack(fn){ if(fn){ backBtn.classList.add('show'); backBtn.onclick=fn; } else { backBtn.classList.remove('show'); backBtn.onclick=null; } }
function showScreen(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); document.getElementById('screen-'+id).classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
function goHome(){ showScreen('home'); setBack(null); }
function openUnit(u){ currentUnit=u; showScreen('unit'+u); setBack(goHome); }
function backToUnit(){ showScreen('unit'+currentUnit); setBack(goHome); }
function openGameScreen(id){ showScreen(id); setBack(backToUnit); }

function showModal(text, onAgain){
  document.getElementById('modalText').textContent=text;
  document.getElementById('modalBack').classList.add('show');
  document.getElementById('modalAgainBtn').onclick=()=>{ closeModal(); onAgain(); };
}
function closeModal(){ document.getElementById('modalBack').classList.remove('show'); }

/* =========================================================
   GENERIC ENGINE 1: MATCH (two-column pairing)
   ========================================================= */
let matchState={};
function runMatch(pairs, gameKey, icon, title, prompt){
  document.getElementById('match-icon').textContent=icon;
  document.getElementById('match-title').textContent=title;
  document.getElementById('match-prompt').textContent=prompt;
  matchState={selected:null, matched:0, total:pairs.length, pairs, gameKey, icon, title, prompt};
  openGameScreen('match');
  const left=shuffle(pairs), right=shuffle(pairs);
  const leftEl=document.getElementById('match-left'), rightEl=document.getElementById('match-right');
  leftEl.innerHTML=''; rightEl.innerHTML='';
  left.forEach(item=>{
    const b=document.createElement('button'); b.className='tile';
    b.innerHTML=`<span class="emoji">${item.leftEmoji}</span><span>${item.leftLabel}</span>`;
    b.onclick=()=>selectMatchTile(b,'left',item);
    leftEl.appendChild(b);
  });
  right.forEach(item=>{
    const b=document.createElement('button'); b.className='tile';
    b.innerHTML=`<span class="emoji">${item.rightEmoji}</span><span>${item.rightLabel}</span>`;
    b.onclick=()=>selectMatchTile(b,'right',item);
    rightEl.appendChild(b);
  });
  updateMatchProgress();
}
function updateMatchProgress(){ document.getElementById('match-progress').textContent=`تم المطابقة: ${matchState.matched} / ${matchState.total}`; }
function selectMatchTile(btn, side, item){
  if(btn.classList.contains('matched')) return;
  if(!matchState.selected){
    document.querySelectorAll('#screen-match .tile.selected').forEach(t=>t.classList.remove('selected'));
    btn.classList.add('selected'); matchState.selected={btn,side,item}; return;
  }
  if(matchState.selected.side===side){ matchState.selected.btn.classList.remove('selected'); btn.classList.add('selected'); matchState.selected={btn,side,item}; return; }
  const isMatch = matchState.selected.item.id === item.id;
  if(isMatch){
    matchState.selected.btn.classList.remove('selected'); matchState.selected.btn.classList.add('matched'); btn.classList.add('matched');
    matchState.matched++; matchState.selected=null; updateMatchProgress();
    if(matchState.matched===matchState.total){
      awardStar(matchState.gameKey);
      const {pairs,gameKey,icon,title,prompt}=matchState;
      setTimeout(()=>showModal('صِلت كل العناصر بشكل صحيح! أحسنت 🎉', ()=>runMatch(pairs,gameKey,icon,title,prompt)), 400);
    }
  } else {
    btn.classList.add('wrong'); matchState.selected.btn.classList.add('wrong');
    setTimeout(()=>{ btn.classList.remove('wrong'); matchState.selected.btn.classList.remove('wrong','selected'); matchState.selected=null; },400);
  }
}

/* =========================================================
   GENERIC ENGINE 2: QUIZ (letter / classification)
   ========================================================= */
let quizState={};
function runQuiz(rounds, gameKey, icon, title){
  document.getElementById('quiz-icon').textContent=icon;
  document.getElementById('quiz-title').textContent=title;
  quizState={idx:0, rounds, gameKey, icon, title, correctCount:0, locked:false};
  openGameScreen('quiz');
  renderQuizRound();
}
function renderQuizRound(){
  const s=quizState, round=s.rounds[s.idx];
  document.getElementById('quiz-progress').textContent=`السؤال ${s.idx+1} من ${s.rounds.length}`;
  const header=document.getElementById('quiz-header');
  if(round.header){ header.style.display='flex'; header.textContent=round.header; } else { header.style.display='none'; }
  const objBox=document.getElementById('quiz-objects');
  if(round.objectsRow){ objBox.style.display='flex'; objBox.innerHTML=Array(round.objectsRow.count).fill(`<span>${round.objectsRow.emoji}</span>`).join(''); } else { objBox.style.display='none'; objBox.innerHTML=''; }
  document.getElementById('quiz-prompt').textContent=round.prompt;
  const subEl=document.getElementById('quiz-sub');
  if(round.sub){ subEl.style.display='block'; subEl.textContent=round.sub; } else { subEl.style.display='none'; subEl.textContent=''; }
  const wrap=document.getElementById('quiz-options'); wrap.innerHTML=''; s.locked=false;
  shuffle(round.options).forEach(o=>{
    const b=document.createElement('button'); b.className='opt';
    b.innerHTML = o.label ? `<span class="emoji">${o.emoji}</span><span>${o.label}</span>` : `<span class="emoji">${o.emoji}</span>`;
    b.onclick=()=>answerQuiz(b,o);
    wrap.appendChild(b);
  });
}
function answerQuiz(btn,o){
  if(quizState.locked) return;
  if(o.correct){
    quizState.locked=true; btn.classList.add('correct'); quizState.correctCount++;
    setTimeout(()=>{
      if(quizState.idx < quizState.rounds.length-1){ quizState.idx++; renderQuizRound(); }
      else {
        awardStar(quizState.gameKey);
        const {rounds,gameKey,icon,title,correctCount}=quizState;
        showModal(`أجبت بشكل صحيح على ${correctCount} من ${rounds.length}! رائع 🎉`, ()=>runQuiz(rounds,gameKey,icon,title));
      }
    },500);
  } else { btn.classList.add('incorrect'); setTimeout(()=>btn.classList.remove('incorrect'),400); }
}

/* =========================================================
   GENERIC ENGINE 3: COUNT
   ========================================================= */
let countState={};
function runCount(rounds, gameKey, icon, title, choicesPool){
  document.getElementById('count-icon').textContent=icon;
  document.getElementById('count-title').textContent=title;
  countState={idx:0, rounds, gameKey, icon, title, correctCount:0, locked:false, choicesPool};
  openGameScreen('count');
  renderCountRound();
}
function renderCountRound(){
  const s=countState, round=s.rounds[s.idx];
  document.getElementById('count-progress').textContent=`السؤال ${s.idx+1} من ${s.rounds.length}`;
  document.getElementById('count-objects').innerHTML = Array(round.count).fill(`<span>${round.emoji}</span>`).join('');
  const others = s.choicesPool.filter(n=>n!==round.count);
  const choices = shuffle([round.count, ...pick(others,2)]);
  const wrap=document.getElementById('count-options'); wrap.innerHTML=''; s.locked=false;
  choices.forEach(n=>{
    const b=document.createElement('button'); b.className='num-btn'; b.textContent=n;
    b.onclick=()=>answerCount(b, n===round.count);
    wrap.appendChild(b);
  });
}
function answerCount(btn, isCorrect){
  if(countState.locked) return;
  if(isCorrect){
    countState.locked=true; btn.classList.add('correct'); countState.correctCount++;
    setTimeout(()=>{
      if(countState.idx < countState.rounds.length-1){ countState.idx++; renderCountRound(); }
      else {
        awardStar(countState.gameKey);
        const {rounds,gameKey,icon,title,correctCount,choicesPool}=countState;
        showModal(`عددت بشكل صحيح ${correctCount} من ${rounds.length}! أحسنت 🔢`, ()=>runCount(rounds,gameKey,icon,title,choicesPool));
      }
    },500);
  } else { btn.classList.add('incorrect'); setTimeout(()=>btn.classList.remove('incorrect'),400); }
}

/* =========================================================
   GENERIC ENGINE 4: SORT (binary classification)
   ========================================================= */
let sortState={};
function runSort(items, gameKey, icon, title, labelA, emojiA, labelB, emojiB){
  document.getElementById('sort-icon').textContent=icon;
  document.getElementById('sort-title').textContent=title;
  document.getElementById('sort-btnA').textContent = emojiA+' '+labelA;
  document.getElementById('sort-btnB').textContent = emojiB+' '+labelB;
  sortState={order:shuffle(items), idx:0, correctCount:0, gameKey, icon, title, labelA, emojiA, labelB, emojiB};
  openGameScreen('sort');
  renderSortRound();
}
function renderSortRound(){
  const s=sortState, item=s.order[s.idx];
  document.getElementById('sort-progress').textContent=`العنصر ${s.idx+1} من ${s.order.length}`;
  document.getElementById('sort-emoji').textContent=item.emoji;
  document.getElementById('sort-name').textContent=item.name;
}
function answerSort(saidA){
  const s=sortState, item=s.order[s.idx];
  if(saidA===item.groupA) s.correctCount++;
  if(s.idx < s.order.length-1){ s.idx++; renderSortRound(); }
  else {
    if(s.correctCount >= Math.ceil(s.order.length*0.7)) awardStar(s.gameKey);
    const {order,gameKey,icon,title,labelA,emojiA,labelB,emojiB,correctCount}=s;
    showModal(`صنّفت بشكل صحيح ${correctCount} من ${order.length}! 🎉`, ()=>runSort(order,gameKey,icon,title,labelA,emojiA,labelB,emojiB));
  }
}

/* =========================================================
   GENERIC ENGINE 5: ORDER (sequence tapping)
   ========================================================= */
let orderState={};
function runOrder(rounds, gameKey, icon, title){
  document.getElementById('order-icon').textContent=icon;
  document.getElementById('order-title').textContent=title;
  orderState={idx:0, rounds, gameKey, icon, title, expected:0};
  openGameScreen('order');
  renderOrderRound();
}
function renderOrderRound(){
  const s=orderState, round=s.rounds[s.idx];
  document.getElementById('order-progress').textContent=`الجولة ${s.idx+1} من ${s.rounds.length}`;
  document.getElementById('order-prompt').textContent=round.instruction;
  s.expected=0;
  const withPos = round.items.map((it,i)=>({...it, correctPos:i}));
  const shuffled = shuffle(withPos);
  const wrap=document.getElementById('order-row'); wrap.innerHTML='';
  shuffled.forEach(it=>{
    const b=document.createElement('button'); b.className='tile';
    b.innerHTML=`<span class="emoji">${it.emoji}</span><span>${it.label}</span>`;
    b.onclick=()=>tapOrder(b,it);
    wrap.appendChild(b);
  });
}
function tapOrder(btn,it){
  if(btn.classList.contains('matched')) return;
  const s=orderState;
  if(it.correctPos === s.expected){
    btn.classList.add('matched');
    const badge=document.createElement('span'); badge.className='order-badge'; badge.textContent=s.expected+1;
    btn.appendChild(badge);
    s.expected++;
    if(s.expected === orderState.rounds[s.idx].items.length){
      setTimeout(()=>{
        if(s.idx < s.rounds.length-1){ s.idx++; renderOrderRound(); }
        else {
          awardStar(s.gameKey);
          const {rounds,gameKey,icon,title}=s;
          showModal('رتّبت كل شيء بالترتيب الصحيح! أحسنت 🎉', ()=>runOrder(rounds,gameKey,icon,title));
        }
      },500);
    }
  } else {
    btn.classList.add('wrong');
    setTimeout(()=>btn.classList.remove('wrong'),400);
  }
}

/* =========================================================
   GENERIC ENGINE 6: PATTERN
   ========================================================= */
let patternState={};
function runPattern(rounds, gameKey){
  patternState={idx:0, rounds, gameKey, locked:false};
  openGameScreen('pattern');
  renderPatternRound();
}
function renderPatternRound(){
  const s=patternState, round=s.rounds[s.idx];
  document.getElementById('pattern-progress').textContent=`النمط ${s.idx+1} من ${s.rounds.length}`;
  document.getElementById('pattern-row').innerHTML = round.seq.map(e=>`<span>${e}</span>`).join('')+`<span class="blank">؟</span>`;
  const wrap=document.getElementById('pattern-options'); wrap.innerHTML=''; s.locked=false;
  shuffle(round.options).forEach(o=>{
    const b=document.createElement('button'); b.className='opt';
    b.innerHTML=`<span class="emoji">${o}</span>`;
    b.onclick=()=>answerPattern(b, o===round.answer);
    wrap.appendChild(b);
  });
}
function answerPattern(btn,isCorrect){
  if(patternState.locked) return;
  if(isCorrect){
    patternState.locked=true; btn.classList.add('correct');
    setTimeout(()=>{
      if(patternState.idx < patternState.rounds.length-1){ patternState.idx++; renderPatternRound(); }
      else { awardStar(patternState.gameKey); const {rounds,gameKey}=patternState; showModal('أكملت كل الأنماط بشكل صحيح 🧩', ()=>runPattern(rounds,gameKey)); }
    },500);
  } else { btn.classList.add('incorrect'); setTimeout(()=>btn.classList.remove('incorrect'),400); }
}

/* =========================================================
   HAZARD (unit 2 special multi-target spotting game)
   ========================================================= */
const hazardItems=[
  {emoji:'🔪',danger:true},{emoji:'🥄',danger:false},
  {emoji:'🔥',danger:true},{emoji:'🧸',danger:false},
  {emoji:'🧪',danger:true},{emoji:'📕',danger:false},
  {emoji:'🔌',danger:true},{emoji:'🍎',danger:false},
];
let hazard={found:0,lives:3,total:0,over:false};
function initHazard(){
  hazard={found:0,lives:3,total:hazardItems.filter(i=>i.danger).length,over:false};
  const grid=document.getElementById('hazard-grid'); grid.innerHTML='';
  shuffle(hazardItems).forEach(item=>{
    const b=document.createElement('button'); b.className='hz-tile'; b.textContent=item.emoji;
    b.onclick=()=>tapHazard(b,item); grid.appendChild(b);
  });
  updateHazardMeta();
}
function updateHazardMeta(){
  document.getElementById('hazard-found').textContent=`تم العثور: ${hazard.found} / ${hazard.total}`;
  document.getElementById('hazard-lives').textContent='❤️'.repeat(hazard.lives) || '💔';
}
function tapHazard(btn,item){
  if(hazard.over || btn.classList.contains('disabled')) return;
  if(item.danger){
    btn.classList.add('found','disabled'); hazard.found++; updateHazardMeta();
    if(hazard.found===hazard.total){ hazard.over=true; awardStar('u2-hazard'); setTimeout(()=>showModal('اكتشفت كل الأدوات الخطرة! انتبه دائماً منها ⚠️', initHazard),400); }
  } else {
    btn.classList.add('oops'); hazard.lives=Math.max(0,hazard.lives-1); updateHazardMeta();
    setTimeout(()=>btn.classList.remove('oops'),400);
    if(hazard.lives===0 && !hazard.over){ hazard.over=true; setTimeout(()=>showModal(`لنحاول مرة أخرى بحذر أكبر! وجدت ${hazard.found} من ${hazard.total}`, initHazard),400); }
  }
}

/* =========================================================
   UNIT 1 — أهلاً بالروضة
   كلمات الكتاب: تفاح، دائرة، قطار، غزال، غراب، باب، تاج، كتاب، حصان (حرف ا)
                 ورق، وردة، خروف، جرو، سرو، ولد، فول، حوت، حلو (حرف و)
   ========================================================= */
function startAlefQuiz(){
  const rounds=[
    {header:'ا', prompt:'أي كلمة تحتوي على حرف (ا)؟', options:[{emoji:'🚂',label:'قطار',correct:true},{emoji:'☀️',label:'شمس',correct:false},{emoji:'🌙',label:'قمر',correct:false}]},
    {header:'ا', prompt:'أي كلمة تحتوي على حرف (ا)؟', options:[{emoji:'🦌',label:'غزال',correct:true},{emoji:'⭐',label:'نجمة',correct:false},{emoji:'✏️',label:'قلم',correct:false}]},
    {header:'ا', prompt:'أي كلمة تحتوي على حرف (ا)؟', options:[{emoji:'🍎',label:'تفاح',correct:true},{emoji:'🐻',label:'دب',correct:false},{emoji:'🐟',label:'سمكة',correct:false}]},
    {header:'ا', prompt:'أي كلمة تحتوي على حرف (ا)؟', options:[{emoji:'⭕',label:'دائرة',correct:true},{emoji:'⚽',label:'كرة',correct:false},{emoji:'🌳',label:'شجرة',correct:false}]},
    {header:'ا', prompt:'أي كلمة تحتوي على حرف (ا)؟', options:[{emoji:'📕',label:'كتاب',correct:true},{emoji:'☀️',label:'شمس',correct:false},{emoji:'✏️',label:'قلم',correct:false}]},
  ];
  runQuiz(rounds,'u1-alef','🔤','حرف الألف (ا)');
}
function startWawQuiz(){
  const rounds=[
    {header:'و', prompt:'أي كلمة تحتوي على حرف (و)؟', options:[{emoji:'📄',label:'ورق',correct:true},{emoji:'✏️',label:'قلم',correct:false},{emoji:'☀️',label:'شمس',correct:false}]},
    {header:'و', prompt:'أي كلمة تحتوي على حرف (و)؟', options:[{emoji:'🐑',label:'خروف',correct:true},{emoji:'🍎',label:'تفاح',correct:false},{emoji:'🐱',label:'قطة',correct:false}]},
    {header:'و', prompt:'أي كلمة تحتوي على حرف (و)؟', options:[{emoji:'🐶',label:'جرو',correct:true},{emoji:'🦌',label:'غزال',correct:false},{emoji:'⭐',label:'نجمة',correct:false}]},
    {header:'و', prompt:'أي كلمة تحتوي على حرف (و)؟', options:[{emoji:'🫘',label:'فول',correct:true},{emoji:'🐻',label:'دب',correct:false},{emoji:'🌳',label:'شجرة',correct:false}]},
  ];
  runQuiz(rounds,'u1-waw','🔤','حرف الواو (و)');
}
function startU1English(){
  const rounds=[
    {header:null, prompt:'Which word starts with letter A?', options:[{emoji:'🐜',label:'ant',correct:true},{emoji:'🐱',label:'cat',correct:false}]},
    {header:null, prompt:"The word 'apple' starts with letter A.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter A?', options:[{emoji:'🍎',label:'apple',correct:true},{emoji:'🚗',label:'car',correct:false}]},
    {header:null, prompt:'Which word starts with letter C?', options:[{emoji:'🐱',label:'cat',correct:true},{emoji:'🐜',label:'ant',correct:false}]},
    {header:null, prompt:"The word 'cake' starts with letter C.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter C?', options:[{emoji:'🚗',label:'car',correct:true},{emoji:'🪓',label:'ax',correct:false}]},
  ];
  runQuiz(rounds,'u1-english','🔤','English Letters: A, C');
}
function startSchoolTools(){
  const pairs=[
    {id:'a',leftEmoji:'🖌️',leftLabel:'ريشة',rightEmoji:'🎨',rightLabel:'ألوان'},
    {id:'b',leftEmoji:'✏️',leftLabel:'قلم',rightEmoji:'📓',rightLabel:'دفتر'},
    {id:'c',leftEmoji:'🪑',leftLabel:'مكتب',rightEmoji:'🧒',rightLabel:'طالب'},
    {id:'d',leftEmoji:'🎒',leftLabel:'حقيبة',rightEmoji:'📕',rightLabel:'كتاب'},
  ];
  runMatch(pairs,'u1-tools','🎒','أدوات الروضة','صِل كل أداة بما يرتبط بها');
}
function startOddOne(){
  const rounds=[
    {header:null, prompt:'أي شكل مختلف عن البقية؟', options:[{emoji:'🔵',correct:false},{emoji:'🔵',correct:false},{emoji:'🔵',correct:false},{emoji:'🔴',correct:true}]},
    {header:null, prompt:'أي حقيبة مختلفة عن البقية؟', options:[{emoji:'🎒',correct:false},{emoji:'🎒',correct:false},{emoji:'🎒',correct:false},{emoji:'👜',correct:true}]},
    {header:null, prompt:'أي مربع مختلف عن البقية؟', options:[{emoji:'🟦',correct:false},{emoji:'🟦',correct:false},{emoji:'🟪',correct:true},{emoji:'🟦',correct:false}]},
    {header:null, prompt:'أي ممحاة مختلفة عن البقية؟', options:[{emoji:'🟨',correct:false},{emoji:'🟨',correct:false},{emoji:'🟨',correct:false},{emoji:'🟩',correct:true}]},
  ];
  runQuiz(rounds,'u1-odd','🔍','الشيء المختلف');
}
function startNumberOne(){
  const rounds=[
    {header:null, prompt:'أي مجموعة تحتوي على عنصر واحد فقط؟', options:[{emoji:'⭐',correct:true},{emoji:'⭐⭐',correct:false},{emoji:'⭐⭐⭐',correct:false}]},
    {header:null, prompt:'أي مجموعة تحتوي على عنصر واحد فقط؟', options:[{emoji:'🍎🍎',correct:false},{emoji:'🍎',correct:true},{emoji:'🍎🍎🍎',correct:false}]},
    {header:null, prompt:'أي مجموعة تحتوي على عنصر واحد فقط؟', options:[{emoji:'🚗🚗',correct:false},{emoji:'🚗🚗🚗',correct:false},{emoji:'🚗',correct:true}]},
  ];
  runQuiz(rounds,'u1-numberone','1️⃣','العدد واحد');
}
function startU1Pattern(){
  const rounds=[
    {seq:['😀','😀','😞','😀','😀'], answer:'😞', options:['😞','😴','😀']},
    {seq:['🟦','🟥','🟦','🟥','🟦'], answer:'🟥', options:['🟥','🟨','🟩']},
    {seq:['🎒','🎒','📕','🎒','🎒'], answer:'📕', options:['📕','✏️','🎒']},
  ];
  runPattern(rounds,'u1-pattern');
}
function startU1Numbers(){
  runCount([{emoji:'📕',count:1},{emoji:'✏️',count:2},{emoji:'🎒',count:3}], 'u1-numbers','🔢','أعدّ معي',[1,2,3]);
}

/* =========================================================
   UNIT 2 — من أنا؟
   ========================================================= */
function startSenses(){
  const pairs=[
    {id:'a',leftEmoji:'✋',leftLabel:'يد',rightEmoji:'🐱',rightLabel:'يلمس القطة'},
    {id:'b',leftEmoji:'👅',leftLabel:'لسان',rightEmoji:'🍦',rightLabel:'يتذوق المثلجات'},
    {id:'c',leftEmoji:'👁️',leftLabel:'عين',rightEmoji:'📖',rightLabel:'يقرأ الكتاب'},
    {id:'d',leftEmoji:'👂',leftLabel:'أذن',rightEmoji:'🎵',rightLabel:'يسمع الصوت'},
    {id:'e',leftEmoji:'👃',leftLabel:'أنف',rightEmoji:'🌸',rightLabel:'يشم الزهرة'},
  ];
  runMatch(pairs,'u2-senses','🖐️','حواسي الخمس','صِل كل عضو بما يفعله');
}
function startU2Letters(){
  const rounds=[
    {header:'ي', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🧸',label:'دمية',correct:true},{emoji:'☀️',label:'شمس',correct:false},{emoji:'✏️',label:'قلم',correct:false}]},
    {header:'ب', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🍊',label:'برتقالة',correct:true},{emoji:'🐱',label:'قطة',correct:false},{emoji:'🌙',label:'قمر',correct:false}]},
    {header:'م', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🍋',label:'ليمون',correct:true},{emoji:'📕',label:'كتاب',correct:false},{emoji:'⚽',label:'كرة',correct:false}]},
    {header:'ف', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🐘',label:'فيل',correct:true},{emoji:'🐻',label:'دب',correct:false},{emoji:'🌳',label:'شجرة',correct:false}]},
  ];
  runQuiz(rounds,'u2-letters','🔤','حروف ي ب م ف');
}
function startU2English(){
  const rounds=[
    {header:null, prompt:'Which word starts with letter T?', options:[{emoji:'☎️',label:'telephone',correct:true},{emoji:'🦆',label:'duck',correct:false}]},
    {header:null, prompt:"The word 'tiger' starts with letter T.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter D?', options:[{emoji:'🐶',label:'dog',correct:true},{emoji:'🎩',label:'hat',correct:false}]},
    {header:null, prompt:"The word 'duck' starts with letter D.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter M?', options:[{emoji:'🐒',label:'monkey',correct:true},{emoji:'🏠',label:'house',correct:false}]},
    {header:null, prompt:"The word 'milk' starts with letter M.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter H?', options:[{emoji:'🐔',label:'hen',correct:true},{emoji:'🐭',label:'mouse',correct:false}]},
    {header:null, prompt:"The word 'house' starts with letter H.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
  ];
  runQuiz(rounds,'u2-english','🔤','English Letters: T, D, M, H');
}
function startDressChild(){
  const pairs=[
    {id:'a',leftEmoji:'🧢',leftLabel:'قبعة',rightEmoji:'📍',rightLabel:'الرأس'},
    {id:'b',leftEmoji:'👕',leftLabel:'قميص',rightEmoji:'📍',rightLabel:'الجسم'},
    {id:'c',leftEmoji:'👖',leftLabel:'بنطال',rightEmoji:'📍',rightLabel:'الأرجل'},
    {id:'d',leftEmoji:'👟',leftLabel:'حذاء',rightEmoji:'📍',rightLabel:'القدمين'},
  ];
  runMatch(pairs,'u2-dress','🧢','أجزاء جسمي','صِل كل قطعة ملابس بمكانها على الجسم');
}
function startU2Numbers(){
  runCount([
    {emoji:'🪥',count:2},{emoji:'🦆',count:3},{emoji:'🧴',count:4},{emoji:'🐔',count:5},
    {emoji:'🎈',count:2},{emoji:'🍪',count:3},{emoji:'🧦',count:4},{emoji:'🌟',count:5},
  ], 'u2-numbers','🔢','أعدّ معي',[2,3,4,5]);
}
function startShapes(){
  const rounds=[
    {header:null, prompt:'أي شكل هو المثلث؟', options:[{emoji:'🔺',correct:true},{emoji:'⚪',correct:false},{emoji:'🟦',correct:false}]},
    {header:null, prompt:'أي شكل هو الدائرة؟', options:[{emoji:'⚪',correct:true},{emoji:'🔺',correct:false},{emoji:'🟦',correct:false}]},
    {header:null, prompt:'أي شكل هو المربع؟', options:[{emoji:'🟦',correct:true},{emoji:'🔺',correct:false},{emoji:'⚪',correct:false}]},
  ];
  runQuiz(rounds,'u2-shapes','🔺','الأشكال الهندسية');
}
function startFood(){
  const items=[
    {emoji:'🍎',name:'تفاحة',groupA:true},{emoji:'🍊',name:'برتقالة',groupA:true},{emoji:'🍇',name:'عنب',groupA:true},
    {emoji:'🥛',name:'حليب',groupA:true},{emoji:'🍌',name:'موز',groupA:true},{emoji:'🥕',name:'جزر',groupA:true},
    {emoji:'🍰',name:'كعكة',groupA:false},{emoji:'🥤',name:'مشروب غازي',groupA:false},{emoji:'🍟',name:'رقائق مقلية',groupA:false},
  ];
  runSort(items,'u2-food','🍎','غذائي الصحي','صحي','🟢','غير صحي','🔴');
}
function startDoctorTools(){
  const items=[
    {emoji:'🩺',name:'سماعة طبية',groupA:true},{emoji:'🌡️',name:'ميزان حرارة',groupA:true},
    {emoji:'💉',name:'حقنة',groupA:true},{emoji:'🩹',name:'ضمادة',groupA:true},
    {emoji:'🧸',name:'دمية',groupA:false},{emoji:'⚽',name:'كرة',groupA:false},{emoji:'📕',name:'كتاب',groupA:false},
  ];
  runSort(items,'u2-doctor','🩺','أدوات الطبيب','أداة طبية','🩺','ليست أداة طبية','🧸');
}
function startCleaningTools(){
  const pairs=[
    {id:'a',leftEmoji:'✋',leftLabel:'يد',rightEmoji:'🧼',rightLabel:'صابون'},
    {id:'b',leftEmoji:'🦷',leftLabel:'أسنان',rightEmoji:'🪥',rightLabel:'فرشاة أسنان'},
    {id:'c',leftEmoji:'💅',leftLabel:'ظفر',rightEmoji:'✂️',rightLabel:'مقص أظافر'},
  ];
  runMatch(pairs,'u2-cleaning','🧼','أدوات النظافة','صِل كل أداة نظافة بما يناسبها');
}
function startU2Pattern(){
  const rounds=[
    {seq:['🟥','🟨','🟥','🟨','🟥'], answer:'🟨', options:['🟨','🟦','🟩']},
    {seq:['🍎','🍌','🍎','🍌','🍎'], answer:'🍌', options:['🍌','🍇','🍊']},
    {seq:['⭐','⭐','🌙','⭐','⭐'], answer:'🌙', options:['🌙','☀️','⭐']},
    {seq:['🔺','🔵','🔺','🔵','🔺'], answer:'🔵', options:['🔵','🟩','🔺']},
  ];
  runPattern(rounds,'u2-pattern');
}

/* =========================================================
   UNIT 3 — أسرتي
   كلمات الكتاب: سلحفاة (س)، رمانة (ر)، تاج (ت)، شجرة (ش)
   ========================================================= */
function startU3Letters(){
  const rounds=[
    {header:'س', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🐢',label:'سلحفاة',correct:true},{emoji:'🌳',label:'شجرة',correct:false},{emoji:'👑',label:'تاج',correct:false}]},
    {header:'ر', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🍎',label:'رمانة',correct:true},{emoji:'🐢',label:'سلحفاة',correct:false},{emoji:'👑',label:'تاج',correct:false}]},
    {header:'ت', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'👑',label:'تاج',correct:true},{emoji:'🌳',label:'شجرة',correct:false},{emoji:'🍎',label:'رمانة',correct:false}]},
    {header:'ش', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🌳',label:'شجرة',correct:true},{emoji:'🐢',label:'سلحفاة',correct:false},{emoji:'👑',label:'تاج',correct:false}]},
  ];
  runQuiz(rounds,'u3-letters','🔤','حروف س ر ت ش');
}
function startU3English(){
  const rounds=[
    {header:null, prompt:'Which word starts with letter S?', options:[{emoji:'☀️',label:'sun',correct:true},{emoji:'👃',label:'nose',correct:false}]},
    {header:null, prompt:"The word 'snake' starts with letter S.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter N?', options:[{emoji:'🪺',label:'nest',correct:true},{emoji:'⭐',label:'star',correct:false}]},
    {header:null, prompt:"The word 'nose' starts with letter N.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter O?', options:[{emoji:'🐙',label:'octopus',correct:true},{emoji:'🦜',label:'parrot',correct:false}]},
    {header:null, prompt:"The word 'orange' starts with letter O.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter P?', options:[{emoji:'🦜',label:'parrot',correct:true},{emoji:'🐂',label:'ox',correct:false}]},
    {header:null, prompt:"The word 'pen' starts with letter P.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
  ];
  runQuiz(rounds,'u3-english','🔤','English Letters: S, N, O, P');
}
function startAgeQuiz(){
  const rounds=[
    {header:null, prompt:'من الأصغر سناً؟', options:[{emoji:'👴',label:'جد',correct:false},{emoji:'👨',label:'أب',correct:false},{emoji:'👶',label:'رضيع',correct:true}]},
    {header:null, prompt:'من الأكبر سناً؟', options:[{emoji:'👧',label:'طفلة',correct:false},{emoji:'👵',label:'جدة',correct:true},{emoji:'🧒',label:'طفل',correct:false}]},
    {header:null, prompt:'من الأصغر سناً؟', options:[{emoji:'👩',label:'أم',correct:false},{emoji:'👦',label:'ابن صغير',correct:true},{emoji:'👴',label:'جد',correct:false}]},
    {header:null, prompt:'من الأكبر سناً؟', options:[{emoji:'👶',label:'رضيع',correct:false},{emoji:'🧒',label:'طفل',correct:false},{emoji:'👨',label:'أب',correct:true}]},
  ];
  runQuiz(rounds,'u3-age','👶','الأصغر والأكبر');
}
function startProfessions(){
  const pairs=[
    {id:'a',leftEmoji:'👨‍⚕️',leftLabel:'طبيب',rightEmoji:'🩺',rightLabel:'سماعة طبية'},
    {id:'b',leftEmoji:'👨‍🍳',leftLabel:'طاهٍ',rightEmoji:'🍳',rightLabel:'مقلاة'},
    {id:'c',leftEmoji:'👨‍🌾',leftLabel:'مزارع',rightEmoji:'🌾',rightLabel:'سنبلة قمح'},
    {id:'d',leftEmoji:'👩‍🏫',leftLabel:'معلمة',rightEmoji:'📚',rightLabel:'كتب'},
  ];
  runMatch(pairs,'u3-professions','🧰','أصحاب المهن','صِل كل مهنة بأداتها');
}
function startPlaces(){
  const pairs=[
    {id:'a',leftEmoji:'🛏️',leftLabel:'سرير',rightEmoji:'📍',rightLabel:'غرفة النوم'},
    {id:'b',leftEmoji:'🍽️',leftLabel:'طاولة الطعام',rightEmoji:'📍',rightLabel:'المطبخ'},
    {id:'c',leftEmoji:'📺',leftLabel:'تلفاز',rightEmoji:'📍',rightLabel:'غرفة الجلوس'},
    {id:'d',leftEmoji:'🛁',leftLabel:'حوض استحمام',rightEmoji:'📍',rightLabel:'الحمام'},
  ];
  runMatch(pairs,'u3-places','🏠','غرف بيتي','صِل كل قطعة أثاث بمكانها الصحيح في البيت');
}
function startTrueColors(){
  const rounds=[
    {header:null, prompt:'ما اللون الحقيقي للموز؟ 🍌', options:[{emoji:'🟡',label:'أصفر',correct:true},{emoji:'🔴',label:'أحمر',correct:false},{emoji:'🔵',label:'أزرق',correct:false}]},
    {header:null, prompt:'ما اللون الحقيقي للعشب؟ 🌿', options:[{emoji:'🟢',label:'أخضر',correct:true},{emoji:'🟣',label:'بنفسجي',correct:false},{emoji:'🟤',label:'بني',correct:false}]},
    {header:null, prompt:'ما اللون الحقيقي للسماء الصافية؟ ☁️', options:[{emoji:'🔵',label:'أزرق',correct:true},{emoji:'🟢',label:'أخضر',correct:false},{emoji:'🟠',label:'برتقالي',correct:false}]},
    {header:null, prompt:'ما اللون الحقيقي للفراولة؟ 🍓', options:[{emoji:'🔴',label:'أحمر',correct:true},{emoji:'🟡',label:'أصفر',correct:false},{emoji:'🔵',label:'أزرق',correct:false}]},
  ];
  runQuiz(rounds,'u3-colors','🎨','الألوان الحقيقية');
}
function startU3Numbers(){
  runCount([
    {emoji:'⭐',count:6},{emoji:'🧦',count:7},{emoji:'🍊',count:8},{emoji:'🦜',count:9},
    {emoji:'🍬',count:6},{emoji:'🎁',count:7},{emoji:'🔔',count:8},{emoji:'🎈',count:9},
  ], 'u3-numbers','🔢','أعدّ معي',[6,7,8,9]);
}
function startU3Pattern(){
  const rounds=[
    {seq:['👶','👶','👴','👶','👶'], answer:'👴', options:['👴','👵','👶']},
    {seq:['🟪','🟧','🟪','🟧','🟪'], answer:'🟧', options:['🟧','🟩','🟦']},
  ];
  runPattern(rounds,'u3-pattern');
}
function startOrderNumbers(){
  const rounds=[
    {instruction:'رتّب الأعداد من الأصغر إلى الأكبر', items:[{emoji:'6️⃣',label:'ستة'},{emoji:'7️⃣',label:'سبعة'},{emoji:'8️⃣',label:'ثمانية'},{emoji:'9️⃣',label:'تسعة'}]},
  ];
  runOrder(rounds,'u3-orderNumbers','📶','رتّب الأعداد');
}

/* =========================================================
   UNIT 4 — الحيوانات
   كلمات الكتاب: عنب (ن)، دجاجة (د)، حوت (ح)، دعسوقة (ع)
   ========================================================= */
function startU4Letters(){
  const rounds=[
    {header:'ن', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🍇',label:'عنب',correct:true},{emoji:'🐔',label:'دجاجة',correct:false},{emoji:'🐳',label:'حوت',correct:false}]},
    {header:'د', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🐔',label:'دجاجة',correct:true},{emoji:'🍇',label:'عنب',correct:false},{emoji:'🐳',label:'حوت',correct:false}]},
    {header:'ح', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🐳',label:'حوت',correct:true},{emoji:'🍇',label:'عنب',correct:false},{emoji:'🐔',label:'دجاجة',correct:false}]},
    {header:'ع', prompt:'أي كلمة تحتوي على هذا الحرف؟', options:[{emoji:'🐞',label:'دعسوقة',correct:true},{emoji:'🐳',label:'حوت',correct:false},{emoji:'🐔',label:'دجاجة',correct:false}]},
  ];
  runQuiz(rounds,'u4-letters','🔤','حروف ن د ح ع');
}
function startU4English(){
  const rounds=[
    {header:null, prompt:'Which word starts with letter E?', options:[{emoji:'🥚',label:'egg',correct:true},{emoji:'🐦',label:'bird',correct:false}]},
    {header:null, prompt:"The word 'elephant' starts with letter E.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter B?', options:[{emoji:'🍌',label:'banana',correct:true},{emoji:'🐟',label:'fish',correct:false}]},
    {header:null, prompt:"The word 'book' starts with letter B.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter F?', options:[{emoji:'🌸',label:'flower',correct:true},{emoji:'🥚',label:'egg',correct:false}]},
    {header:null, prompt:"The word 'fish' starts with letter F.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
    {header:null, prompt:'Which word starts with letter I?', options:[{emoji:'🐛',label:'insect',correct:true},{emoji:'🍌',label:'banana',correct:false}]},
    {header:null, prompt:"The word 'ink' starts with letter I.", options:[{emoji:'✅',label:'True',correct:true},{emoji:'❌',label:'False',correct:false}]},
  ];
  runQuiz(rounds,'u4-english','🔤','English Letters: E, B, F, I');
}
function startBabies(){
  const pairs=[
    {id:'a',leftEmoji:'🐕',leftLabel:'كلب',rightEmoji:'🐶',rightLabel:'جرو'},
    {id:'b',leftEmoji:'🐈',leftLabel:'قطة',rightEmoji:'🐱',rightLabel:'هرّة صغيرة'},
    {id:'c',leftEmoji:'🐎',leftLabel:'حصان',rightEmoji:'🐴',rightLabel:'مهر'},
    {id:'d',leftEmoji:'🐔',leftLabel:'دجاجة',rightEmoji:'🐤',rightLabel:'كتكوت'},
  ];
  runMatch(pairs,'u4-babies','🐣','أمهات وصغار','صِل كل حيوان بصغيره');
}
function startHabitat(){
  const items=[
    {emoji:'🐟',name:'سمكة',groupA:true},{emoji:'🐳',name:'حوت',groupA:true},{emoji:'🐙',name:'أخطبوط',groupA:true},
    {emoji:'🐱',name:'قطة',groupA:false},{emoji:'🐔',name:'دجاجة',groupA:false},{emoji:'🐰',name:'أرنب',groupA:false},
  ];
  runSort(items,'u4-habitat','🌊','بحري أم بري؟','حيوان بحري','🐟','حيوان بري','🐰');
}
function startInsects(){
  const items=[
    {emoji:'🐝',name:'نحلة',groupA:true},{emoji:'🐞',name:'دعسوقة',groupA:true},{emoji:'🦋',name:'فراشة',groupA:true},
    {emoji:'🦟',name:'بعوضة',groupA:false},{emoji:'🪰',name:'ذبابة',groupA:false},{emoji:'🪳',name:'صرصور',groupA:false},
  ];
  runSort(items,'u4-insects','🐝','نافعة أم ضارة','نافعة','🐝','ضارة','🦟');
}
function startLifecycle(){
  const rounds=[
    {instruction:'رتّب دورة حياة الدجاجة من البداية إلى النهاية', items:[{emoji:'🥚',label:'بيضة'},{emoji:'🐤',label:'كتكوت'},{emoji:'🐔',label:'دجاجة بالغة'}]},
    {instruction:'رتّب أحداث يومي', items:[{emoji:'🌅',label:'الاستيقاظ صباحاً'},{emoji:'🏫',label:'الذهاب إلى الروضة'},{emoji:'🌙',label:'النوم ليلاً'}]},
  ];
  runOrder(rounds,'u4-lifecycle','🔄','رتّب الترتيب');
}
function startU4Numbers(){
  runCount([{emoji:'🐔',count:1},{emoji:'🐟',count:2},{emoji:'🐝',count:3}], 'u4-numbers','🔢','أعدّ معي',[1,2,3]);
}
function startU4Pattern(){
  const rounds=[
    {seq:['🐾','🐾','🐔','🐾','🐾'], answer:'🐔', options:['🐔','🐤','🐾']},
    {seq:['🐟','🐙','🐟','🐙','🐟'], answer:'🐙', options:['🐙','🦀','🐳']},
  ];
  runPattern(rounds,'u4-pattern');
}

/* =========================================================
   UNITS 5-8 + عالم الرياضيات — "أصدقاء الأرض"
   محتوى مستورَد بالكامل كما هو من ملف data.js الأصلي، ومُحوَّل
   تلقائياً إلى محرك الأسئلة العام (بدون أي تعديل يدوي على الكلمات)
   ========================================================= */
const IMPORTED_UNITS=[
  {key:'5', label:'النباتات 🌱', icon:'🌱'},
  {key:'6', label:'وطني الأردن 🏛️', icon:'🏛️'},
  {key:'7', label:'أصدقاء الأرض 🌍', icon:'🌍'},
  {key:'8', label:'شكرًا روضتي 🎓', icon:'🎓'},
  {key:'math', label:'عالم الرياضيات 🔢', icon:'🔢'},
];
const IMPORTED_LEVELS=[
  {id:'u5-letters', unit:'5', title:'حروف: ل، ز، ج', icon:'🔤',
    questions:[
      {type:'mcq', prompt:'أيّ كلمة تبدأ بحرف (ل)؟', options:[{emoji:'🍋',text:'ليمون',correct:true},{emoji:'🐱',text:'قطة',correct:false}]},
      {type:'tf', prompt:'كلمة "لبن" تبدأ بحرف (ل).', correct:true},
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (ز)؟', options:[{emoji:'🦒',text:'زرافة',correct:true},{emoji:'⚽',text:'كرة',correct:false}]},
      {type:'tf', prompt:'كلمة "منزل" تحتوي على حرف (ز).', correct:true},
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (ج)؟', options:[{emoji:'🐫',text:'جمل',correct:true},{emoji:'🐭',text:'فأر',correct:false}]},
      {type:'tf', prompt:'كلمة "جزر" تبدأ بحرف (ج).', correct:true},
    ]},
  {id:'u5-english', unit:'5', title:'English Letters: G, K', icon:'🔤',
    questions:[
      {type:'mcq', prompt:'Which word starts with letter G?', options:[{emoji:'🎁',text:'gift',correct:true},{emoji:'🐱',text:'cat',correct:false}]},
      {type:'tf', prompt:'The word "goat" starts with letter G.', correct:true},
      {type:'mcq', prompt:'Which word starts with letter G?', options:[{emoji:'👧',text:'girl',correct:true},{emoji:'🐶',text:'dog',correct:false}]},
      {type:'mcq', prompt:'Which word starts with letter K?', options:[{emoji:'🔑',text:'key',correct:true},{emoji:'☀️',text:'sun',correct:false}]},
      {type:'tf', prompt:'The word "kite" starts with letter K.', correct:true},
      {type:'mcq', prompt:'Which word starts with letter K?', options:[{emoji:'🦘',text:'kangaroo',correct:true},{emoji:'🐟',text:'fish',correct:false}]},
    ]},
  {id:'u5-numbers', unit:'5', title:'أعداد 10 – 12', icon:'🔟',
    questions:[
      {type:'count', emoji:'⭐', count:10, options:[9,10,11]},
      {type:'count', emoji:'🍊', count:11, options:[10,11,12]},
      {type:'count', emoji:'🌼', count:12, options:[11,12,13]},
      {type:'mcq', prompt:'أيّ عدد يأتي بعد 11؟', options:[{text:'10',correct:false},{text:'12',correct:true},{text:'13',correct:false}]},
      {type:'mcq', prompt:'أيّ عدد يأتي قبل 10؟', options:[{text:'9',correct:true},{text:'11',correct:false},{text:'8',correct:false}]},
    ]},
  {id:'u5-plants', unit:'5', title:'عالم النبات', icon:'🌻',
    questions:[
      {type:'mcq', prompt:'ماذا يحتاج النبات لينمو؟', options:[{text:'الماء وضوء الشمس',correct:true},{text:'الحجارة فقط',correct:false}]},
      {type:'mcq', prompt:'أيّ جزء من النبات يصنع الغذاء؟', options:[{text:'الأوراق',correct:true},{text:'الجذور',correct:false}]},
      {type:'mcq', prompt:'ماذا يبدأ نمو النبات أولًا؟', options:[{emoji:'🌱',text:'البذرة',correct:true},{emoji:'🌳',text:'النبات الكبير',correct:false}]},
      {type:'tf', prompt:'تحتاج النباتات إلى الماء لتنمو.', correct:true},
      {type:'mcq', prompt:'الجزء الذي يمتصّ الماء من التربة هو:', options:[{text:'الجذور',correct:true},{text:'الأوراق',correct:false}]},
    ]},
  {id:'u6-letters', unit:'6', title:'حروف: ق، خ، غ', icon:'🔤',
    questions:[
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (ق)؟', options:[{emoji:'🚤',text:'قارب',correct:true},{emoji:'⚽',text:'كرة',correct:false}]},
      {type:'tf', prompt:'كلمة "قمر" تبدأ بحرف (ق).', correct:true},
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (خ)؟', options:[{emoji:'🍞',text:'خبز',correct:true},{emoji:'🍎',text:'تفاحة',correct:false}]},
      {type:'tf', prompt:'كلمة "خيمة" تبدأ بحرف (خ).', correct:true},
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (غ)؟', options:[{emoji:'🐦‍⬛',text:'غراب',correct:true},{emoji:'🐔',text:'دجاجة',correct:false}]},
      {type:'tf', prompt:'كلمة "غيمة" تبدأ بحرف (غ).', correct:true},
    ]},
  {id:'u6-english', unit:'6', title:'English Letters: L, U', icon:'🔤',
    questions:[
      {type:'mcq', prompt:'Which word starts with letter L?', options:[{emoji:'🍋',text:'lemon',correct:true},{emoji:'🐶',text:'dog',correct:false}]},
      {type:'tf', prompt:'The word "lion" starts with letter L.', correct:true},
      {type:'mcq', prompt:'Which word starts with letter L?', options:[{emoji:'💡',text:'lamp',correct:true},{emoji:'⚽',text:'ball',correct:false}]},
      {type:'mcq', prompt:'Which word means the position below something?', options:[{text:'under',correct:true},{text:'up',correct:false}]},
      {type:'tf', prompt:'The word "umbrella" starts with letter U.', correct:true},
      {type:'mcq', prompt:'Which word means the position above something?', options:[{text:'up',correct:true},{text:'under',correct:false}]},
    ]},
  {id:'u6-numbers', unit:'6', title:'أعداد 13 – 15', icon:'🔢',
    questions:[
      {type:'count', emoji:'🚩', count:13, options:[12,13,14]},
      {type:'count', emoji:'🐑', count:14, options:[13,14,15]},
      {type:'count', emoji:'🏺', count:15, options:[14,15,16]},
      {type:'mcq', prompt:'أيّ عدد أكبر؟', options:[{text:'15',correct:true},{text:'13',correct:false}]},
      {type:'mcq', prompt:'العدد بين 13 و 15 هو:', options:[{text:'14',correct:true},{text:'16',correct:false},{text:'12',correct:false}]},
    ]},
  {id:'u6-jordan', unit:'6', title:'معالم وطني', icon:'🇯🇴',
    questions:[
      {type:'mcq', prompt:'ألوان علم وطني الأردن هي:', options:[{text:'الأسود والأبيض والأخضر والأحمر',correct:true},{text:'الأزرق والأصفر',correct:false}]},
      {type:'tf', prompt:'مدينة البتراء منحوتة في الصخر، وتقع في الأردن.', correct:true},
      {type:'mcq', prompt:'الكرة ⚽ شكلها:', options:[{text:'كروي',correct:true},{text:'أسطواني',correct:false}]},
      {type:'mcq', prompt:'علبة العصير 🥤 شكلها:', options:[{text:'أسطواني',correct:true},{text:'كروي',correct:false}]},
      {type:'mcq', prompt:'عاصمة وطني الأردن هي:', options:[{text:'عمّان',correct:true},{text:'بيروت',correct:false}]},
    ]},
  {id:'u7-letters', unit:'7', title:'حروف: ذ، ط، ك، ض', icon:'🔤',
    questions:[
      {type:'mcq', prompt:'أيّ كلمة تبدأ بحرف (ذ)؟', options:[{emoji:'🌽',text:'ذرة',correct:true},{emoji:'🐱',text:'قطة',correct:false}]},
      {type:'tf', prompt:'كلمة "ذبابة" تبدأ بحرف (ذ).', correct:true},
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (ط)؟', options:[{emoji:'🦚',text:'طاووس',correct:true},{emoji:'🐟',text:'سمكة',correct:false}]},
      {type:'tf', prompt:'كلمة "محيط" تحتوي على حرف (ط).', correct:true},
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (ك)؟', options:[{emoji:'⚽',text:'كرة',correct:true},{emoji:'🦆',text:'بطة',correct:false}]},
      {type:'tf', prompt:'كلمة "ديك" تنتهي بحرف (ك).', correct:true},
      {type:'mcq', prompt:'أيّ صورة تبدأ بحرف (ض)؟', options:[{emoji:'🐸',text:'ضفدع',correct:true},{emoji:'📖',text:'كتاب',correct:false}]},
      {type:'tf', prompt:'كلمة "أرض" تحتوي على حرف (ض).', correct:true},
    ]},
  {id:'u7-english', unit:'7', title:'English Letters: Y, W, X, Z', icon:'🔤',
    questions:[
      {type:'mcq', prompt:'Which word starts with letter Y?', options:[{emoji:'🥣',text:'yogurt',correct:true},{emoji:'🥛',text:'milk',correct:false}]},
      {type:'tf', prompt:'The word "yo-yo" starts with letter Y.', correct:true},
      {type:'mcq', prompt:'Which word starts with letter Y?', options:[{emoji:'🏡',text:'yard',correct:true},{emoji:'🏠',text:'house',correct:false}]},
      {type:'mcq', prompt:'Which word starts with letter W?', options:[{emoji:'🪟',text:'window',correct:true},{emoji:'🚪',text:'door',correct:false}]},
      {type:'tf', prompt:'The word "water" starts with letter W.', correct:true},
      {type:'mcq', prompt:'Which word starts with letter W?', options:[{emoji:'⌚',text:'watch',correct:true},{emoji:'📖',text:'book',correct:false}]},
      {type:'mcq', prompt:'Which word has letter X in it?', options:[{emoji:'📦',text:'box',correct:true},{emoji:'🐱',text:'cat',correct:false}]},
      {type:'tf', prompt:'The word "fox" contains letter X.', correct:true},
      {type:'mcq', prompt:'Which word has letter X in it?', options:[{emoji:'🕯️',text:'wax',correct:true},{emoji:'🖊️',text:'pen',correct:false}]},
      {type:'mcq', prompt:'Which word starts with letter Z?', options:[{emoji:'0️⃣',text:'zero',correct:true},{emoji:'1️⃣',text:'one',correct:false}]},
      {type:'tf', prompt:'The word "zoo" starts with letter Z.', correct:true},
      {type:'mcq', prompt:'Which word starts with letter Z?', options:[{emoji:'🦓',text:'zebra',correct:true},{emoji:'🐴',text:'horse',correct:false}]},
    ]},
  {id:'u7-numbers', unit:'7', title:'أعداد 17 – 20', icon:'🔢',
    questions:[
      {type:'count', emoji:'⭐', count:17, options:[16,17,18]},
      {type:'count', emoji:'🚌', count:18, options:[17,18,19]},
      {type:'count', emoji:'🌙', count:19, options:[18,19,20]},
      {type:'count', emoji:'🌳', count:20, options:[18,19,20]},
      {type:'mcq', prompt:'أيّ عدد يأتي بعد 19؟', options:[{text:'18',correct:false},{text:'20',correct:true},{text:'21',correct:false}]},
    ]},
  {id:'u7-earth', unit:'7', title:'أرضي الجميلة', icon:'🏔️',
    questions:[
      {type:'mcq', prompt:'أيّ صورة تمثّل اليابسة؟', options:[{emoji:'⛰️',text:'جبل',correct:true},{emoji:'🌊',text:'محيط',correct:false}]},
      {type:'mcq', prompt:'أيّ صورة تمثّل الماء؟', options:[{emoji:'🌊',text:'بحر',correct:true},{emoji:'🏜️',text:'صحراء',correct:false}]},
      {type:'mcq', prompt:'في فصل الشتاء يكون الجوّ غالبًا:', options:[{text:'باردًا وممطرًا',correct:true},{text:'حارًّا جدًا',correct:false}]},
      {type:'mcq', prompt:'الرمز 🌧️ يدلّ على:', options:[{text:'المطر',correct:true},{text:'الثلج',correct:false}]},
      {type:'mcq', prompt:'من استخدامات الماء المهمّة:', options:[{emoji:'💧',text:'الشرب',correct:true},{emoji:'🔥',text:'إشعال النار',correct:false}]},
      {type:'tf', prompt:'يجب أن نحافظ على الماء ولا نبذّره.', correct:true},
    ]},
  {id:'u7-recycle', unit:'7', title:'حافظ على الأرض', icon:'♻️',
    questions:[
      {type:'mcq', prompt:'نضع الزجاجة الزجاجية المكسورة في الحاوية:', options:[{text:'الخضراء',correct:true},{text:'الحمراء',correct:false}]},
      {type:'mcq', prompt:'نضع علبة الصودا المعدنية في الحاوية:', options:[{text:'الحمراء',correct:true},{text:'الصفراء',correct:false}]},
      {type:'mcq', prompt:'دخان المصانع والسيارات يسبّب تلوّث:', options:[{text:'الهواء',correct:true},{text:'الماء',correct:false}]},
      {type:'mcq', prompt:'صوت أبواق السيارات العالي يسبّب تلوّثًا:', options:[{text:'سمعيًا',correct:true},{text:'بصريًا',correct:false}]},
      {type:'tf', prompt:'من الصحيح أن نرمي القمامة في الشارع.', correct:false},
    ]},
  {id:'u8-letters', unit:'8', title:'حروف: ظ، هـ', icon:'🔤',
    questions:[
      {type:'mcq', prompt:'أيّ كلمة تبدأ بحرف (ظ)؟', options:[{emoji:'🦌',text:'ظبي',correct:true},{emoji:'🐘',text:'فيل',correct:false}]},
      {type:'tf', prompt:'كلمة "ظرف" تبدأ بحرف (ظ).', correct:true},
      {type:'mcq', prompt:'أيّ كلمة تبدأ بحرف (هـ)؟', options:[{emoji:'🎁',text:'هدية',correct:true},{emoji:'📖',text:'كتاب',correct:false}]},
      {type:'tf', prompt:'كلمة "هلال" تبدأ بحرف (هـ).', correct:true},
    ]},
  {id:'u8-skills', unit:'8', title:'مهارات وقيم', icon:'💖',
    questions:[
      {type:'mcq', prompt:'أيّ الإناءين يتّسع لكمية أكبر من الماء؟', options:[{text:'الإناء الكبير',correct:true},{text:'الإناء الصغير',correct:false}]},
      {type:'mcq', prompt:'السلحفاة 🐢 تتحرّك:', options:[{text:'ببطء',correct:true},{text:'بسرعة',correct:false}]},
      {type:'mcq', prompt:'الأرنب 🐇 يتحرّك:', options:[{text:'بسرعة',correct:true},{text:'ببطء',correct:false}]},
      {type:'tf', prompt:'من الأدب أن أشكر معلّمتي على جهدها.', correct:true},
      {type:'mcq', prompt:'عندما أرى شخصًا يحتاج مساعدة، أفعل:', options:[{text:'أساعده',correct:true},{text:'أتجاهله',correct:false}]},
    ]},
  {id:'math-addsub', unit:'math', title:'الجمع والطرح', icon:'➕',
    questions:[
      {type:'mcq', prompt:'2 + 3 = ؟', sub:'🍎🍎  +  🍎🍎🍎', options:[{text:'4',correct:false},{text:'5',correct:true},{text:'6',correct:false}]},
      {type:'mcq', prompt:'4 + 1 = ؟', sub:'🍊🍊🍊🍊  +  🍊', options:[{text:'4',correct:false},{text:'5',correct:true},{text:'6',correct:false}]},
      {type:'mcq', prompt:'5 - 2 = ؟', sub:'⭐⭐⭐⭐⭐  −  ⭐⭐', options:[{text:'2',correct:false},{text:'3',correct:true},{text:'4',correct:false}]},
      {type:'mcq', prompt:'3 + 3 = ؟', sub:'🎈🎈🎈  +  🎈🎈🎈', options:[{text:'5',correct:false},{text:'6',correct:true},{text:'7',correct:false}]},
      {type:'mcq', prompt:'4 - 1 = ؟', sub:'🍇🍇🍇🍇  −  🍇', options:[{text:'2',correct:false},{text:'3',correct:true},{text:'4',correct:false}]},
      {type:'mcq', prompt:'1 + 1 = ؟', sub:'🌼  +  🌼', options:[{text:'1',correct:false},{text:'2',correct:true},{text:'3',correct:false}]},
    ]},
  {id:'math-shapes', unit:'math', title:'الأشكال الهندسية', icon:'🔺',
    questions:[
      {type:'mcq', prompt:'الكرة ⚽ شكلها:', options:[{text:'دائرة',correct:true},{text:'مربع',correct:false}]},
      {type:'mcq', prompt:'صندوق النرد 🎲 شكله:', options:[{text:'مكعب',correct:true},{text:'دائرة',correct:false}]},
      {type:'mcq', prompt:'هذا الشكل 🔺 اسمه:', options:[{text:'مثلث',correct:true},{text:'مربع',correct:false}]},
      {type:'mcq', prompt:'هذا الشكل 🟥 اسمه:', options:[{text:'مربع',correct:true},{text:'دائرة',correct:false}]},
      {type:'mcq', prompt:'هذا الشكل 🔵 اسمه:', options:[{text:'دائرة',correct:true},{text:'مثلث',correct:false}]},
    ]},
  {id:'math-patterns', unit:'math', title:'الأنماط', icon:'🔁',
    questions:[
      {type:'mcq', prompt:'ما الشكل التالي في النمط؟', sub:'🔴🔵🔴🔵🔴 ؟', options:[{text:'🔵',correct:true},{text:'🔴',correct:false}]},
      {type:'mcq', prompt:'ما الرمز التالي في النمط؟', sub:'⭐🌙⭐🌙⭐ ؟', options:[{text:'🌙',correct:true},{text:'⭐',correct:false}]},
      {type:'mcq', prompt:'ما اللون التالي في النمط؟', sub:'🟢🟢🟡🟢🟢🟡 ؟', options:[{text:'🟡',correct:false},{text:'🟢',correct:true}]},
      {type:'mcq', prompt:'ما العدد التالي في النمط؟', sub:'1، 2، 1، 2، 1، ؟', options:[{text:'2',correct:true},{text:'1',correct:false}]},
    ]},
  {id:'math-compare', unit:'math', title:'أكبر أو أصغر', icon:'⚖️',
    questions:[
      {type:'mcq', prompt:'أيّ عدد أكبر؟', options:[{text:'8',correct:true},{text:'5',correct:false}]},
      {type:'mcq', prompt:'أيّ عدد أصغر؟', options:[{text:'12',correct:false},{text:'7',correct:true}]},
      {type:'mcq', prompt:'أيّ مجموعة فيها عناصر أكثر؟', options:[{text:'أربع تفاحات 🍎🍎🍎🍎',correct:true},{text:'تفاحتان 🍎🍎',correct:false}]},
      {type:'tf', prompt:'العدد 15 أكبر من العدد 10.', correct:true},
      {type:'tf', prompt:'العدد 9 أصغر من العدد 6.', correct:false},
    ]},
  {id:'math-order', unit:'math', title:'ترتيب الأعداد', icon:'🔢',
    questions:[
      {type:'mcq', prompt:'أيّ عدد يأتي بعد 12؟', options:[{text:'11',correct:false},{text:'13',correct:true},{text:'14',correct:false}]},
      {type:'mcq', prompt:'أيّ عدد يأتي قبل 10؟', options:[{text:'9',correct:true},{text:'11',correct:false},{text:'8',correct:false}]},
      {type:'mcq', prompt:'العدد بين 14 و 16 هو:', options:[{text:'15',correct:true},{text:'17',correct:false},{text:'13',correct:false}]},
      {type:'mcq', prompt:'أيّ ترتيب من الأصغر إلى الأكبر صحيح؟', options:[{text:'3 ، 7 ، 9',correct:true},{text:'9 ، 3 ، 7',correct:false}]},
      {type:'mcq', prompt:'أيّ عدد أكبر: 20 أم 18؟', options:[{text:'20',correct:true},{text:'18',correct:false}]},
    ]},
  {id:'math-tens', unit:'math', title:'القفز بالعشرات', icon:'🦘',
    questions:[
      {type:'mcq', prompt:'أُكمل القفز بالعشرات:', sub:'10 ، 20 ، 30 ، ؟', options:[{text:'35',correct:false},{text:'40',correct:true},{text:'50',correct:false}]},
      {type:'mcq', prompt:'أُكمل القفز بالعشرات:', sub:'10 ، 20 ، ؟ ، 40', options:[{text:'25',correct:false},{text:'30',correct:true},{text:'35',correct:false}]},
      {type:'mcq', prompt:'ما العدد الناقص في بداية القفز؟', sub:'؟ ، 20 ، 30 ، 40', options:[{text:'5',correct:false},{text:'10',correct:true},{text:'15',correct:false}]},
      {type:'mcq', prompt:'أُكمل القفز بالعشرات:', sub:'10 ، 20 ، 30 ، 40 ، ؟', options:[{text:'45',correct:false},{text:'50',correct:true},{text:'60',correct:false}]},
      {type:'tf', prompt:'عند القفز بالعشرات، العدد الذي يأتي بعد 30 هو 40.', correct:true},
      {type:'mcq', prompt:'أيّ عدد يظهر عند القفز بالعشرات ابتداءً من 10؟', options:[{text:'25',correct:false},{text:'30',correct:true}]},
    ]},
];

function toRounds(questions){
  return questions.map(q=>{
    if(q.type==='count'){
      return { prompt:'عدّ العناصر، ثم اختر العدد الصحيح:', objectsRow:{emoji:q.emoji,count:q.count}, options:q.options.map(n=>({emoji:String(n), correct:n===q.count})) };
    }
    if(q.type==='tf'){
      return { prompt:q.prompt, sub:q.sub||null, options:[{emoji:'✅',label:'صحيح',correct:q.correct===true},{emoji:'❌',label:'خطأ',correct:q.correct===false}] };
    }
    return { prompt:q.prompt, sub:q.sub||null, options:q.options.map(o=>{
      if(o.emoji) return {emoji:o.emoji, label:o.text, correct:!!o.correct};
      if(String(o.text).length<=3) return {emoji:o.text, correct:!!o.correct};
      return {emoji:'🔹', label:o.text, correct:!!o.correct};
    }) };
  });
}
function startImportedLevel(id){
  const lvl=IMPORTED_LEVELS.find(l=>l.id===id);
  runQuiz(toRounds(lvl.questions), 'imp-'+id, lvl.icon, lvl.title);
}
function renderImportedUnits(){
  IMPORTED_UNITS.forEach(u=>{
    const container=document.getElementById('grid-unit'+u.key);
    if(!container) return;
    IMPORTED_LEVELS.filter(l=>l.unit===u.key).forEach(lvl=>{
      const btn=document.createElement('button');
      btn.className='card u'+(u.key==='math'?'math':u.key);
      btn.onclick=()=>startImportedLevel(lvl.id);
      btn.innerHTML=`<span class="stars-earned" id="stars-imp-${lvl.id}"></span><div class="badge">${lvl.icon}</div><h3>${lvl.title}</h3><p>${lvl.questions.length} أسئلة متنوعة</p>`;
      container.appendChild(btn);
    });
  });
  renderStarsUI();
}
renderImportedUnits();
