/* =========================================================
   KG Quest — إضافات: تمرين التطبيع، ضع دائرة، المعدود المناسب،
   الاستماع والنطق، الأصوات المفرحة والعبارات التشجيعية
   (ملف مستقل يُحمَّل بعد app.js ولا يغيّر محتوى الألعاب الأصلية)
   ========================================================= */
(function(){
'use strict';

/* ---------------------------------------------------------
   1) بيانات الدروس (كلمات الكتاب نفسها المستعملة في الألعاب)
   --------------------------------------------------------- */
const AR_NUM={1:'واحد',2:'اثنان',3:'ثلاثة',4:'أربعة',5:'خمسة',6:'ستة',7:'سبعة',8:'ثمانية',9:'تسعة',10:'عشرة',11:'أحد عشر',12:'اثنا عشر',13:'ثلاثة عشر',14:'أربعة عشر',15:'خمسة عشر',16:'ستة عشر',17:'سبعة عشر',18:'ثمانية عشر',19:'تسعة عشر',20:'عشرون'};
const EN_NUM={1:'one',2:'two',3:'three',4:'four',5:'five',6:'six',7:'seven',8:'eight',9:'nine',10:'ten',11:'eleven',12:'twelve',13:'thirteen',14:'fourteen',15:'fifteen',16:'sixteen',17:'seventeen',18:'eighteen',19:'nineteen',20:'twenty'};

const LESSONS={
 '1':{
  title:'أهلاً بالروضة', gk:'u1',
  ar:[{l:'ا',w:[['تفاح','🍎'],['قطار','🚂'],['غزال','🦌'],['دائرة','⭕']]},{l:'و',w:[['ورق','📄'],['خروف','🐑'],['جرو','🐶'],['فول','🫘']]}],
  en:[{l:'A',w:[['ant','🐜'],['apple','🍎'],['ax','🪓']]},{l:'C',w:[['cat','🐱'],['cake','🍰'],['car','🚗']]}],
  nums:[1,2,3], objs:['📕','✏️','🎒','⭐']},
 '2':{
  title:'من أنا؟', gk:'u2',
  ar:[{l:'ي',w:[['دمية','🧸']]},{l:'ب',w:[['برتقالة','🍊']]},{l:'م',w:[['ليمون','🍋']]},{l:'ف',w:[['فيل','🐘']]}],
  en:[{l:'T',w:[['table','🪑'],['tiger','🐯'],['telephone','☎️']]},{l:'D',w:[['duck','🦆'],['doll','🪆'],['dog','🐶']]},{l:'M',w:[['milk','🥛'],['monkey','🐒'],['mouse','🐭']]},{l:'H',w:[['hat','🎩'],['hen','🐔'],['house','🏠']]}],
  nums:[2,3,4,5], objs:['🍎','⚽','🌸','🧸']},
 '3':{
  title:'أسرتي', gk:'u3',
  ar:[{l:'س',w:[['سلحفاة','🐢']]},{l:'ر',w:[['رمانة','🍎']]},{l:'ت',w:[['تاج','👑']]},{l:'ش',w:[['شجرة','🌳']]}],
  en:[{l:'S',w:[['sun','☀️'],['snake','🐍'],['star','⭐']]},{l:'N',w:[['nest','🪺'],['nose','👃'],['net','🥅']]},{l:'O',w:[['ox','🐂'],['octopus','🐙'],['orange','🍊']]},{l:'P',w:[['pen','🖊️'],['panda','🐼'],['parrot','🦜']]}],
  nums:[6,7,8,9], objs:['⭐','🍊','🌳','🏠']},
 '4':{
  title:'الحيوانات', gk:'u4',
  ar:[{l:'ن',w:[['عنب','🍇']]},{l:'د',w:[['دجاجة','🐔']]},{l:'ح',w:[['حوت','🐳']]},{l:'ع',w:[['دعسوقة','🐞']]}],
  en:[{l:'E',w:[['egg','🥚'],['elephant','🐘']]},{l:'B',w:[['bird','🐦'],['book','📖'],['banana','🍌']]},{l:'F',w:[['fish','🐟'],['flower','🌸']]},{l:'I',w:[['insect','🐛'],['ink','🖋️']]}],
  nums:[1,2,3], objs:['🐔','🐟','🐝','🐞']},
 '5':{
  title:'النباتات', gk:'imp-u5',
  ar:[{l:'ل',w:[['ليمون','🍋'],['لبن','🥛']]},{l:'ز',w:[['زرافة','🦒']]},{l:'ج',w:[['جمل','🐫'],['جزر','🥕']]}],
  en:[{l:'G',w:[['gift','🎁'],['goat','🐐'],['girl','👧']]},{l:'K',w:[['key','🔑']]}],
  nums:[10,11,12], objs:['⭐','🍊','🌼','🍎']},
 '6':{
  title:'وطني الأردن', gk:'imp-u6',
  ar:[{l:'ق',w:[['قارب','🚤'],['قمر','🌙']]},{l:'خ',w:[['خبز','🍞'],['خيمة','⛺']]},{l:'غ',w:[['غراب','🐦‍⬛'],['غيمة','☁️']]}],
  en:[{l:'L',w:[['lemon','🍋'],['lion','🦁'],['lamp','💡']]},{l:'U',w:[['umbrella','☂️']]}],
  nums:[13,14,15], objs:['🚩','🐑','🏺','⭐']},
 '7':{
  title:'أصدقاء الأرض', gk:'imp-u7',
  ar:[{l:'ذ',w:[['ذرة','🌽'],['ذبابة','🪰']]},{l:'ط',w:[['طاووس','🦚']]},{l:'ك',w:[['كرة','⚽']]},{l:'ض',w:[['ضفدع','🐸']]}],
  en:[{l:'Y',w:[['yogurt','🥣'],['yard','🏡']]},{l:'W',w:[['window','🪟'],['water','💧'],['watch','⌚']]},{l:'X',w:[['box','📦'],['fox','🦊']]},{l:'Z',w:[['zero','0️⃣'],['zebra','🦓']]}],
  nums:[17,18,19,20], objs:['⭐','🚌','🌙','🌳']},
 '8':{
  title:'شكرًا روضتي', gk:'imp-u8',
  ar:[{l:'ظ',w:[['ظبي','🦌'],['ظرف','✉️']]},{l:'ه',w:[['هدية','🎁'],['هلال','🌙']]}],
  en:[], nums:[], objs:[]},
};
const UNIT_KEYS=['1','2','3','4','5','6','7','8'];

/* حروف/أعداد تراكمية (ما تعلّمته الطفلة حتى هذه الوحدة) للمشتّتات */
function cumulative(unit,kind){
  const out=[];
  UNIT_KEYS.forEach(k=>{ if(+k<=+unit){ const L=LESSONS[k];
    if(kind==='nums') L.nums.forEach(n=>out.push(n)); else L[kind].forEach(o=>out.push(o.l)); } });
  return [...new Set(out)];
}
function allWords(unit,kind){
  const out=[]; UNIT_KEYS.forEach(k=>{ if(+k<=+unit) LESSONS[k][kind].forEach(o=>o.w.forEach(w=>out.push({t:w[0],e:w[1],l:o.l}))); });
  return out;
}

const rnd=(n)=>Math.floor(Math.random()*n);
const shuf=(a)=>{ const b=[...a]; for(let i=b.length-1;i>0;i--){ const j=rnd(i+1); [b[i],b[j]]=[b[j],b[i]]; } return b; };
const isAr=(s)=>/[؀-ۿ]/.test(s);
const hasLatin=(s)=>/[A-Za-z]{2,}/.test(s);

/* ---------------------------------------------------------
   2) الأصوات (WebAudio) + النطق (SpeechSynthesis)
   --------------------------------------------------------- */
let actx=null, muted=false;
try{ muted=localStorage.getItem('kgquest_muted')==='1'; }catch(e){}
function ac(){
  if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  if(actx && actx.state==='suspended'){ try{ actx.resume(); }catch(e){} }
  return actx;
}
function tone(freq,t0,dur,type,vol){
  const c=ac(); if(!c||muted) return;
  const o=c.createOscillator(), g=c.createGain();
  o.type=type||'triangle'; o.frequency.value=freq; o.connect(g); g.connect(c.destination);
  const t=c.currentTime+t0, v=vol||.18;
  g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v,t+.02); g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.start(t); o.stop(t+dur+.05);
}
const sfx={
  ok(){ [523,659,784,1047].forEach((f,i)=>tone(f,i*.09,.24,'triangle',.2)); tone(1568,.36,.3,'sine',.08); },
  wrong(){ tone(330,0,.18,'sine',.14); tone(262,.15,.28,'sine',.14); },
  pop(){ tone(880,0,.08,'sine',.1); },
  circle(){ tone(620,0,.07,'sine',.12); tone(930,.06,.12,'sine',.12); },
  win(){ [523,659,784,1047,784,1047,1319].forEach((f,i)=>tone(f,i*.11,.3,'triangle',.2)); [1568,2093,2637].forEach((f,i)=>tone(f,.78+i*.1,.35,'sine',.09)); }
};

const synth=('speechSynthesis' in window)?window.speechSynthesis:null;
let voices=[];
function loadVoices(){ if(synth){ try{ voices=synth.getVoices()||[]; }catch(e){} } }
if(synth){ loadVoices(); try{ synth.onvoiceschanged=loadVoices; }catch(e){} }
function voiceFor(lang){
  const L=lang.toLowerCase(), p=L.slice(0,2);
  const norm=(v)=>(v.lang||'').toLowerCase().replace('_','-');
  return voices.find(v=>norm(v)===L) || voices.find(v=>norm(v).startsWith(p));
}
/* تحويل الأرقام إلى كلمات عربية ليُنطق العدد (خاصة العشرات) صحيحاً */
const _U=['','واحد','اثنان','ثلاثة','أربعة','خمسة','ستة','سبعة','ثمانية','تسعة','عشرة','أحد عشر','اثنا عشر','ثلاثة عشر','أربعة عشر','خمسة عشر','ستة عشر','سبعة عشر','ثمانية عشر','تسعة عشر'];
const _T=['','','عشرون','ثلاثون','أربعون','خمسون','ستون','سبعون','ثمانون','تسعون'];
function numToAr(n){
  if(n===0) return 'صفر';
  if(n<20) return _U[n];
  if(n<100){ const t=Math.floor(n/10),u=n%10; return u?_U[u]+' و'+_T[t]:_T[t]; }
  if(n===100) return 'مئة';
  return String(n);
}
function arSpeech(t){
  return String(t).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\d+/g,m=>numToAr(+m)).replace(/؟\s*(?=[،,]|$)/g,'العدد الناقص ');
}
let warnedAr=false;
function speak(items,force,append){
  if(!synth || (muted && !force)) return;
  if(!Array.isArray(items)) items=[items];
  if(!append){ try{ synth.cancel(); }catch(e){} }
  items.forEach(it=>{
    if(!it||!it.t) return;
    const lang=it.lang||(isAr(it.t)?'ar-SA':'en-US');
    const u=new SpeechSynthesisUtterance(lang.toLowerCase().startsWith('ar')?arSpeech(it.t):it.t);
    u.lang=lang; u.rate=it.rate||0.8; u.pitch=1.1;
    const v=voiceFor(lang); if(v) u.voice=v;
    synth.speak(u);
  });
  if(!warnedAr && voices.length && !voiceFor('ar') && items.some(i=>i&&i.t&&isAr(i.t))){
    warnedAr=true; toast('لا يوجد صوت عربي على هذا الجهاز — فعّلي صوت اللغة العربية من إعدادات «تحويل النص إلى كلام» في الجهاز 🔊',5200);
  }
}

/* رسالة صغيرة */
let toastTimer=null;
function toast(msg,ms){
  let el=document.getElementById('xtToast');
  if(!el){ el=document.createElement('div'); el.id='xtToast'; el.className='xt-toast'; document.body.appendChild(el); }
  el.textContent=msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),ms||2200);
}

/* العبارات التشجيعية */
const CHEER_AR=[['أحسنت!','🌟'],['ممتاز!','🎉'],['رائع!','⭐'],['برافو عليك!','👏'],['أداء رائع!','🌟'],['عمل جميل!','💪'],['عمل مميز!','🏅'],['ما شاء الله عليك!','✨'],['إجابة صحيحة!','🎈'],['يا سلام!','🥳']];
const CHEER_EN=[['Great job!','🌟'],['Well done!','👏'],['Excellent!','🎉'],['Super!','⭐'],['Awesome!','🥳'],['Fantastic!','✨'],['You are a star!','🌟']];
let lastCheer=-1;
function ctxLang(){
  if(window.__xtLang) return window.__xtLang;
  const t=document.querySelector('.screen.active .game-title h2');
  return (t && hasLatin(t.textContent) && !isAr(t.textContent))?'en':'ar';
}
function showCheer(text,emoji){
  let el=document.getElementById('xtCheer');
  if(!el){ el=document.createElement('div'); el.id='xtCheer'; el.className='xt-cheer'; document.body.appendChild(el); }
  el.innerHTML='<span class="ce">'+emoji+'</span><span>'+text+'</span>';
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(showCheer.t); showCheer.t=setTimeout(()=>el.classList.remove('show'),1300);
}
/* extra: كلمة تُنطق بعد العبارة (مثلاً الكلمة الصحيحة أو العدد) */
function cheer(extra,lang){
  lang=lang||ctxLang();
  const pool=lang==='en'?CHEER_EN:CHEER_AR;
  let i; do{ i=rnd(pool.length); }while(i===lastCheer && pool.length>1);
  lastCheer=i;
  const c=pool[i];
  sfx.ok(); showCheer(c[0],c[1]);
  const q=[{t:c[0].replace('!',''),lang:lang==='en'?'en-US':'ar-SA',rate:.9}];
  speak(q);
}

/* «حاول مرة أخرى» عند الخطأ */
function oops(lang){
  lang=lang||ctxLang(); sfx.wrong();
  const txt=lang==='en'?'Try again!':'حاول مرة أخرى', sp=lang==='en'?'Try again':'حاول مرة أخرى';
  let el=document.getElementById('xtOops');
  if(!el){ el=document.createElement('div'); el.id='xtOops'; el.className='xt-cheer xt-oops'; document.body.appendChild(el); }
  el.innerHTML='<span class="ce">💪</span><span>'+txt+'</span>';
  el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(oops.t); oops.t=setTimeout(()=>el.classList.remove('show'),1200);
  speak([{t:sp,lang:lang==='en'?'en-US':'ar-SA',rate:.9}]);
}

/* زر كتم الصوت */
function addMuteButton(){
  const bar=document.querySelector('.appbar-inner'); if(!bar) return;
  const b=document.createElement('button'); b.className='mute-btn'; b.id='muteBtn';
  const paint=()=>{ b.textContent=muted?'🔇':'🔊'; b.setAttribute('aria-pressed',muted?'true':'false'); b.title=muted?'تشغيل الأصوات':'كتم الأصوات'; };
  b.onclick=()=>{ muted=!muted; try{ localStorage.setItem('kgquest_muted',muted?'1':'0'); }catch(e){} if(muted&&synth){ try{synth.cancel();}catch(e){} } paint(); if(!muted) sfx.pop(); };
  paint();
  const stars=bar.querySelector('.stars'); bar.insertBefore(b,stars||null);
}

/* ---------------------------------------------------------
   3) ربط الأصوات بمحركات الألعاب الموجودة (بدون تعديل app.js)
   --------------------------------------------------------- */
function wrap(name,fn){
  const orig=window[name]; if(typeof orig!=='function') return;
  window[name]=function(){ return fn(orig,this,arguments); };
}
const SKIP_LABEL=/^(True|False|صحيح|خطأ)$/;

wrap('answerQuiz',(orig,t,a)=>{
  const was=quizState.locked, o=a[1]; const r=orig.apply(t,a); if(was) return r;
  if(o && o.correct){
    const lab=o.label&&!SKIP_LABEL.test(o.label)?{t:o.label}:null; cheer(lab);
  } else oops();
  return r;
});
wrap('answerCount',(orig,t,a)=>{
  const was=countState.locked, round=countState.rounds[countState.idx]; const r=orig.apply(t,a); if(was) return r;
  if(a[1]) cheer(round&&AR_NUM[round.count]?{t:AR_NUM[round.count],lang:'ar-SA'}:null,'ar'); else oops();
  return r;
});
wrap('answerPattern',(orig,t,a)=>{
  const was=patternState.locked; const r=orig.apply(t,a); if(was) return r;
  if(a[1]) cheer(null,'ar'); else oops();
  return r;
});
wrap('answerSort',(orig,t,a)=>{
  const item=sortState.order[sortState.idx]; const ok=item && (a[0]===item.groupA);
  const r=orig.apply(t,a); if(ok) cheer(null,'ar'); else oops(); return r;
});
wrap('tapOrder',(orig,t,a)=>{
  const btn=a[0], it=a[1]; if(btn.classList.contains('matched')) return orig.apply(t,a);
  const ok=it.correctPos===orderState.expected; const r=orig.apply(t,a);
  if(ok) cheer(null,'ar'); else oops(); return r;
});
wrap('selectMatchTile',(orig,t,a)=>{
  const before=matchState.matched, btn=a[0]; const r=orig.apply(t,a);
  if(matchState.matched>before){ cheer(null,'ar'); }
  else if(btn.classList.contains('wrong')) oops();
  return r;
});
wrap('tapHazard',(orig,t,a)=>{
  const btn=a[0], item=a[1]; if(hazard.over||btn.classList.contains('disabled')) return orig.apply(t,a);
  const r=orig.apply(t,a); if(item.danger) cheer(null,'ar'); else oops(); return r;
});
wrap('showModal',(orig,t,a)=>{
  const r=orig.apply(t,a);
  if(a[2]!==false){ sfx.win(); const en=ctxLang()==='en';
    setTimeout(()=>speak([{t:en?'Well done! You finished the game!':'أحسنت! أكملت اللعبة بنجاح',lang:en?'en-US':'ar-SA',rate:.9}]),900); }
  return r;
});

/* أيقونات 🔊 داخل أسئلة الحروف والكلمات */
function addSpk(el,text,lang){
  if(!el||!text) return;
  const s=document.createElement('span'); s.className='spk'; s.setAttribute('role','button'); s.setAttribute('aria-label','استمع'); s.tabIndex=0; s.textContent='🔊';
  const go=(e)=>{ e.stopPropagation(); e.preventDefault(); sfx.pop(); speak([{t:text,lang:lang}],true); };
  s.addEventListener('click',go);
  s.addEventListener('keydown',(e)=>{ if(e.key==='Enter'||e.key===' ') go(e); });
  el.appendChild(s);
}
/* قراءة السؤال بصوت عالٍ + زر 🔊 لإعادته */
const cleanQ=(t)=>String(t||'').replace(/[\u{1F000}-\u{1FAFF}\u2600-\u27BF\uFE0F]/gu,' ').replace(/\s+/g,' ').trim();
function readQ(text,extra){
  const q=cleanQ(text); if(!q) return;
  const items=[{t:q,rate:.85}]; if(extra) items.push({t:extra,rate:.8});
  /* لا قراءة تلقائية: يُقرأ السؤال فقط عند الضغط على أيقونة 🔊 */
}
function qSpk(el,text){
  if(!el) return; el.querySelectorAll(':scope > .spk').forEach(x=>x.remove());
  const q=cleanQ(text); if(q) addSpk(el,q);
}
wrap('renderQuizRound',(orig,t,a)=>{
  const r=orig.apply(t,a);
  const round=quizState.rounds[quizState.idx]||{};
  const h=document.getElementById('quiz-header');
  h.onclick=null; h.style.cursor='';
  if(round.speak){
    /* لعبة «استمع واختر» */
    h.style.display='flex'; h.textContent='🔊'; h.style.cursor='pointer'; h.classList.add('listen-big');
    h.onclick=()=>{ sfx.pop(); speak([{t:round.speak}],true); };
    return r;
  }
  h.classList.remove('listen-big');
  document.querySelectorAll('#quiz-options .opt').forEach(b=>{
    const sp=b.querySelectorAll(':scope > span');
    if(sp.length>=2){ const label=sp[1].textContent.trim(); if(label&&!SKIP_LABEL.test(label)) addSpk(b,label); }
  });
  if(h.style.display!=='none' && h.textContent.trim()) addSpk(h,h.textContent.trim().replace(/\s+/g,''));
  const p=document.getElementById('quiz-prompt'), sb=document.getElementById('quiz-sub');
  const full=p.textContent+(round.sub?' '+round.sub.replace(/[،,]/g,' '):'');
  const hl=(h.style.display!=='none')?h.textContent.replace('🔊','').trim().replace(/\s+/g,''):'';
  qSpk(p,full); readQ(full,hl);
  return r;
});

wrap('renderCountRound',(orig,t,a)=>{
  const r=orig.apply(t,a); const p=document.querySelector('#screen-count .prompt');
  qSpk(p,p.textContent); readQ(p.textContent); return r;
});
wrap('runMatch',(orig,t,a)=>{
  const r=orig.apply(t,a); const p=document.getElementById('match-prompt');
  qSpk(p,p.textContent); readQ(p.textContent); return r;
});
wrap('renderOrderRound',(orig,t,a)=>{
  const r=orig.apply(t,a); const p=document.getElementById('order-prompt');
  qSpk(p,p.textContent); readQ(p.textContent); return r;
});
wrap('renderPatternRound',(orig,t,a)=>{
  const r=orig.apply(t,a); const p=document.querySelector('#screen-pattern .prompt');
  qSpk(p,p.textContent); readQ(p.textContent); return r;
});
wrap('renderSortRound',(orig,t,a)=>{
  const r=orig.apply(t,a); const n=document.getElementById('sort-name'), s2=sortState;
  const q=n.textContent+'، '+s2.labelA+' أم '+s2.labelB+'؟';
  qSpk(n,q); readQ(q); return r;
});
wrap('initHazard',(orig,t,a)=>{
  const r=orig.apply(t,a); const p=document.querySelector('#screen-hazard .prompt');
  qSpk(p,p.textContent); readQ(p.textContent); return r;
});

/* ---------------------------------------------------------
   4) بناء الشاشات الجديدة
   --------------------------------------------------------- */
function mkScreen(id,html){
  const ref=document.getElementById('screen-quiz');
  const sec=document.createElement('section'); sec.className='screen'; sec.id='screen-'+id; sec.innerHTML=html;
  ref.parentNode.insertBefore(sec,ref); return sec;
}
const $=(id)=>document.getElementById(id);

mkScreen('trace',`<div class="game-panel">
  <div class="game-title"><span class="emoji">✍️</span><h2 id="trace-title">تمرين التطبيع</h2></div>
  <div class="seg" id="trace-tabs"></div>
  <p class="progress-line" id="trace-progress"></p>
  <p class="prompt" id="trace-prompt"></p>
  <div class="trace-hint" id="trace-hint"></div>
  <div class="trace-wrap" id="trace-wrap"><canvas id="trace-guide" width="640" height="420"></canvas><canvas id="trace-ink" width="640" height="420"></canvas></div>
  <div class="trace-bar"><div class="trace-meter"><div id="trace-fill"></div></div></div>
  <div class="xt-actions">
    <button class="xt-btn" id="trace-listen">🔊 استمع</button>
    <button class="xt-btn" id="trace-clear">🧽 امسح وأعد</button>
    <button class="xt-btn primary" id="trace-next">التالي ⏭</button>
  </div>
  <p class="write-title">✏️ والآن اكتب الحرف بنفسك على السطرين:</p>
  <div class="write-wrap"><canvas id="write-guide" width="640" height="340"></canvas><canvas id="write-ink" width="640" height="340"></canvas></div>
  <div class="xt-actions"><button class="xt-btn" id="write-clear">🧽 امسح الكتابة</button></div>
</div>`);

mkScreen('circle',`<div class="game-panel">
  <div class="game-title"><span class="emoji">⭕</span><h2 id="circle-title">ضع دائرة</h2></div>
  <div class="seg" id="circle-tabs"></div>
  <p class="progress-line" id="circle-progress"></p>
  <p class="prompt" id="circle-prompt"></p>
  <div class="target-badge" id="circle-target"></div>
  <div class="circle-grid" id="circle-grid"></div>
  <p class="circle-left" id="circle-left"></p>
</div>`);

mkScreen('circlecount',`<div class="game-panel">
  <div class="game-title"><span class="emoji">🔢</span><h2 id="cc-title">ضع دائرة حول المعدود المناسب للعدد</h2></div>
  <p class="progress-line" id="cc-progress"></p>
  <p class="prompt" id="cc-prompt"></p>
  <div class="target-badge" id="cc-target"></div>
  <div id="cc-area"></div>
  <p class="circle-left" id="cc-left"></p>
</div>`);

mkScreen('listen',`<div class="game-panel">
  <div class="game-title"><span class="emoji">🔊</span><h2 id="listen-title">استمع وتعلّم</h2></div>
  <div class="seg" id="listen-tabs"></div>
  <p class="prompt" style="font-size:22px;margin-bottom:12px">اضغط على أي بطاقة لتسمع النطق الصحيح 👂</p>
  <div class="xt-actions" style="margin:0 0 14px">
    <button class="xt-btn" id="listen-all">▶ استمع للجميع</button>
    <button class="xt-btn primary" id="listen-game">🎧 العب: استمع واختر</button>
  </div>
  <div class="listen-grid" id="listen-grid"></div>
</div>`);

/* واجهة التبويبات */
function renderTabs(boxId,tabs,active,onPick){
  const box=$(boxId); box.innerHTML='';
  tabs.forEach(t=>{
    const b=document.createElement('button'); b.className='seg-btn'+(t.k===active?' on':''); b.textContent=t.label;
    b.onclick=()=>{ sfx.pop(); onPick(t.k); };
    box.appendChild(b);
  });
}
function tabsFor(unit){
  const L=LESSONS[unit], t=[];
  if(L.ar.length) t.push({k:'ar',label:'🔤 الحروف'});
  if(L.en.length) t.push({k:'en',label:'🔠 English'});
  if(L.nums.length) t.push({k:'nums',label:'🔢 الأعداد'});
  return t;
}
function openX(screenId,unit){
  window.currentUnit=unit; try{ currentUnit=unit; }catch(e){}
  openGameScreen(screenId);
}

/* ===== 4أ) تمرين التطبيع ===== */
const trace={unit:'1',tab:'ar',items:[],idx:0,passed:{},done:false,drawing:false,last:null,mask:null,loose:null,maskCount:0,ok:false};
const TW=640, TH=420, BRUSH=38;
const font=(size,isArab)=>`800 ${size}px ${isArab?"Cairo,'Baloo Bhaijaan 2',Tahoma":"'Baloo Bhaijaan 2',Cairo,Arial"},sans-serif`;

function traceItems(unit,tab){
  const L=LESSONS[unit];
  if(tab==='ar') return L.ar.map(o=>({c:o.l,say:o.l,word:o.w[0]}));
  if(tab==='en'){ const out=[]; L.en.forEach(o=>{ out.push({c:o.l,say:o.l,word:o.w[0],en:true}); out.push({c:o.l.toLowerCase(),say:o.l.toLowerCase(),word:o.w[0],en:true}); }); return out; }
  return L.nums.map(n=>({c:String(n),say:AR_NUM[n],sayEn:EN_NUM[n],num:true}));
}
function startTrace(unit,tab){
  trace.unit=unit;
  const tabs=tabsFor(unit); if(!tab||!tabs.some(t=>t.k===tab)) tab=tabs[0].k;
  trace.tab=tab; trace.items=traceItems(unit,tab); trace.idx=0; trace.passed={}; trace.done=false;
  if(arguments.length<2 || !$('screen-trace').classList.contains('active')) openX('trace',unit);
  window.__xtLang=(tab==='en')?'en':'ar';
  $('trace-title').textContent='تمرين التطبيع — '+LESSONS[unit].title;
  renderTabs('trace-tabs',tabs,tab,(k)=>startTrace(unit,k));
  loadTraceItem();
}
function fitSize(ctx,text,isArab){
  let size=330; ctx.font=font(size,isArab);
  const w=ctx.measureText(text).width;
  if(w>TW*0.78) size=Math.floor(size*TW*0.78/w);
  return size;
}
function glyphPath(ctx,text,size,isArab){
  ctx.font=font(size,isArab); ctx.textAlign='center'; ctx.textBaseline='alphabetic';
  const m=ctx.measureText(text);
  const asc=m.actualBoundingBoxAscent||size*.7, desc=m.actualBoundingBoxDescent||0;
  return {x:TW/2,y:TH/2+(asc-desc)/2};
}
function loadTraceItem(){
  const it=trace.items[trace.idx]; if(!it) return;
  const isArab=isAr(it.c);
  $('trace-progress').textContent=`الحرف/العدد ${trace.idx+1} من ${trace.items.length}`;
  $('trace-prompt').textContent= it.num?`تتبّع العدد ${it.c} بإصبعك`:(it.en?`Trace the letter ${it.c}`:`تتبّع الحرف ${it.c} بإصبعك`);
  qSpk($('trace-prompt'),$('trace-prompt').textContent); if(!it.en) readQ($('trace-prompt').textContent);
  $('trace-hint').innerHTML = it.num?`<b>${it.c}</b> — ${it.say} — ${it.sayEn}`:(it.word?`<b>${it.c}</b> — ${it.word[1]} ${it.word[0]}`:'');
  trace.ok=false; $('trace-fill').style.width='0%'; $('trace-fill').classList.remove('full');
  $('trace-next').classList.toggle('primary',false);
  const ready=()=>{ drawTraceGuide(it,isArab); drawWriteLines(it,isArab); };
  try{ Promise.race([document.fonts.load(font(100,isArab),it.c),new Promise(r=>setTimeout(r,600))]).then(ready,ready); }catch(e){ ready(); }
  ready();
}
function drawTraceGuide(it,isArab){
  const g=$('trace-guide'), ink=$('trace-ink');
  const gc=g.getContext('2d'), ic=ink.getContext('2d');
  gc.clearRect(0,0,TW,TH); ic.clearRect(0,0,TW,TH);
  /* سطور الدفتر */
  gc.save(); gc.strokeStyle='#CFC4F2'; gc.lineWidth=2; gc.setLineDash([2,8]);
  [TH*.12,TH*.88].forEach(y=>{ gc.beginPath(); gc.moveTo(14,y); gc.lineTo(TW-14,y); gc.stroke(); });
  gc.setLineDash([]); gc.strokeStyle='#8C6FE6'; gc.lineWidth=2.5; gc.beginPath(); gc.moveTo(14,TH/2); gc.lineTo(TW-14,TH/2); gc.globalAlpha=.25; gc.stroke(); gc.restore();
  const size=fitSize(gc,it.c,isArab), p=glyphPath(gc,it.c,size,isArab);
  gc.save(); gc.font=font(size,isArab); gc.textAlign='center'; gc.textBaseline='alphabetic';
  gc.fillStyle='#EEE8FF'; gc.fillText(it.c,p.x,p.y);
  gc.lineWidth=3.5; gc.strokeStyle='#8C6FE6'; gc.setLineDash([11,9]); gc.lineJoin='round'; gc.strokeText(it.c,p.x,p.y); gc.restore();
  /* قناع التغطية */
  const mk=(extra)=>{ const c=document.createElement('canvas'); c.width=TW; c.height=TH; const x=c.getContext('2d');
    x.font=font(size,isArab); x.textAlign='center'; x.textBaseline='alphabetic'; x.fillStyle='#000'; x.fillText(it.c,p.x,p.y);
    x.lineWidth=extra; x.lineJoin='round'; x.strokeStyle='#000'; x.strokeText(it.c,p.x,p.y); return x.getImageData(0,0,TW,TH).data; };
  trace.mask=mk(8); trace.loose=mk(BRUSH+26);
  /* قناع للقص: التلوين يظهر داخل شكل الحرف فقط */
  const mc=document.createElement('canvas'); mc.width=TW; mc.height=TH; const mx=mc.getContext('2d');
  mx.font=font(size,isArab); mx.textAlign='center'; mx.textBaseline='alphabetic'; mx.fillStyle='#000'; mx.strokeStyle='#000'; mx.lineJoin='round'; mx.lineWidth=8;
  mx.fillText(it.c,p.x,p.y); mx.strokeText(it.c,p.x,p.y); trace.clip=mc;
  const rc=document.createElement('canvas'); rc.width=TW; rc.height=TH; trace.raw=rc;
  let n=0; for(let i=3;i<trace.mask.length;i+=4) if(trace.mask[i]>40) n++;
  trace.maskCount=n;
}
function traceCoverage(){
  const ic=$('trace-ink').getContext('2d'), d=ic.getImageData(0,0,TW,TH).data, m=trace.mask, lo=trace.loose;
  let cov=0, ink=0, out=0;
  for(let i=3;i<d.length;i+=4){
    const has=d[i]>60;
    if(has){ ink++; if(lo[i]<=40) out++; }
    if(has && m[i]>40) cov++;
  }
  return {cov:trace.maskCount?cov/trace.maskCount:0, out:ink?out/ink:0, ink};
}
function checkTrace(){
  if(trace.ok) return;
  const r=traceCoverage();
  const pct=Math.min(100,Math.round(r.cov/0.62*100));
  $('trace-fill').style.width=pct+'%';
  if(r.cov>=0.62 && r.out<=0.5){
    trace.ok=true; trace.passed[trace.idx]=true; $('trace-fill').classList.add('full');
    const it=trace.items[trace.idx];
    cheer(it.num?{t:it.say}:null, trace.tab==='en'?'en':'ar');
    $('trace-next').classList.add('primary');
    setTimeout(()=>{ if(trace.ok) nextTrace(); },1700);
  }
}
function nextTrace(){
  if(trace.idx<trace.items.length-1){ trace.idx++; loadTraceItem(); return; }
  const all=trace.items.every((_,i)=>trace.passed[i]);
  if(all){
    awardStar(LESSONS[trace.unit].gk+'-write');
    showModal('كتبت كل الحروف والأعداد بشكل جميل! ✍️🎉',()=>startTrace(trace.unit,trace.tab));
  } else {
    toast('بقيت حروف لم تكتمل — جرّبها مرة أخرى ✨',2400);
    const first=trace.items.findIndex((_,i)=>!trace.passed[i]); trace.idx=first; loadTraceItem();
  }
}

/* سطران للكتابة الحرة (مع نموذج باهت في بداية كل سطر) */
const WH=340;
function drawWriteLines(it,isArab){
  const g=$('write-guide'), gc=g.getContext('2d'); gc.clearRect(0,0,TW,WH);
  $('write-ink').getContext('2d').clearRect(0,0,TW,WH);
  const rowH=WH/2;
  for(let r=0;r<2;r++){
    const top=r*rowH, y1=top+rowH*.18, yMid=top+rowH*.5, y2=top+rowH*.82;
    gc.save(); gc.lineWidth=2; gc.strokeStyle='#CFC4F2'; gc.setLineDash([3,7]);
    [y1,y2].forEach(y=>{ gc.beginPath(); gc.moveTo(12,y); gc.lineTo(TW-12,y); gc.stroke(); });
    gc.setLineDash([]); gc.strokeStyle='#8C6FE6'; gc.globalAlpha=.55; gc.lineWidth=2.5; gc.beginPath(); gc.moveTo(12,y2); gc.lineTo(TW-12,y2); gc.stroke();
    gc.globalAlpha=.25; gc.setLineDash([10,8]); gc.beginPath(); gc.moveTo(12,yMid); gc.lineTo(TW-12,yMid); gc.stroke(); gc.restore();
    /* النموذج الباهت عند بداية السطر (يمين للعربي، يسار للإنجليزي والأعداد) */
    const size=Math.min(rowH*.62, 120);
    gc.save(); gc.font=font(size,isArab); gc.textBaseline='alphabetic'; gc.fillStyle='rgba(140,111,230,.35)';
    gc.textAlign='center'; const x=isArab?TW-60:60; gc.fillText(it.c,x,y2-(isArab?6:0)); gc.restore();
  }
}
(function bindWrite(){
  const ink=$('write-ink'); let d=false, last=null;
  const pos=(e)=>{ const r=ink.getBoundingClientRect(); return {x:(e.clientX-r.left)*TW/r.width, y:(e.clientY-r.top)*WH/r.height}; };
  ink.style.touchAction='none';
  ink.addEventListener('pointerdown',(e)=>{ e.preventDefault(); ac(); try{ink.setPointerCapture(e.pointerId);}catch(_){}
    d=true; last=pos(e); const c=ink.getContext('2d'); c.fillStyle='#2E9C64'; c.beginPath(); c.arc(last.x,last.y,4.5,0,7); c.fill(); });
  ink.addEventListener('pointermove',(e)=>{ if(!d) return; e.preventDefault(); const p=pos(e), c=ink.getContext('2d');
    c.strokeStyle='#2E9C64'; c.lineWidth=9; c.lineCap='round'; c.lineJoin='round'; c.beginPath(); c.moveTo(last.x,last.y); c.lineTo(p.x,p.y); c.stroke(); last=p; });
  const end=()=>{ d=false; };
  ink.addEventListener('pointerup',end); ink.addEventListener('pointercancel',end); ink.addEventListener('pointerleave',end);
  $('write-clear').onclick=()=>{ sfx.pop(); ink.getContext('2d').clearRect(0,0,TW,WH); };
})();
function paintInk(){
  const ic=$('trace-ink').getContext('2d'); ic.clearRect(0,0,TW,TH);
  if(!trace.raw||!trace.clip) return;
  ic.globalCompositeOperation='source-over'; ic.drawImage(trace.raw,0,0);
  ic.globalCompositeOperation='destination-in'; ic.drawImage(trace.clip,0,0);
  ic.globalCompositeOperation='source-over';
}
(function bindTrace(){
  const ink=$('trace-ink');
  const pos=(e)=>{ const r=ink.getBoundingClientRect(); return {x:(e.clientX-r.left)*TW/r.width, y:(e.clientY-r.top)*TH/r.height}; };
  ink.style.touchAction='none';
  ink.addEventListener('pointerdown',(e)=>{
    e.preventDefault(); ac(); try{ ink.setPointerCapture(e.pointerId); }catch(_){}
    trace.drawing=true; trace.last=pos(e);
    const c=trace.raw.getContext('2d'); c.fillStyle='#6E4FD1'; c.beginPath(); c.arc(trace.last.x,trace.last.y,BRUSH/2,0,7); c.fill(); paintInk();
  });
  ink.addEventListener('pointermove',(e)=>{
    if(!trace.drawing) return; e.preventDefault();
    const p=pos(e), c=trace.raw.getContext('2d');
    c.strokeStyle='#6E4FD1'; c.lineWidth=BRUSH; c.lineCap='round'; c.lineJoin='round';
    c.beginPath(); c.moveTo(trace.last.x,trace.last.y); c.lineTo(p.x,p.y); c.stroke(); trace.last=p; paintInk();
  });
  const end=()=>{ if(!trace.drawing) return; trace.drawing=false; checkTrace(); };
  ink.addEventListener('pointerup',end); ink.addEventListener('pointercancel',end); ink.addEventListener('pointerleave',end);
  $('trace-clear').onclick=()=>{ sfx.pop(); trace.ok=false; if(trace.raw) trace.raw.getContext('2d').clearRect(0,0,TW,TH); paintInk(); $('trace-fill').style.width='0%'; $('trace-fill').classList.remove('full'); };
  $('trace-next').onclick=()=>{ sfx.pop(); nextTrace(); };
  $('trace-listen').onclick=()=>{ sfx.pop(); const it=trace.items[trace.idx]; if(!it) return;
    if(it.num) speak([{t:it.say,lang:'ar-SA'},{t:it.sayEn,lang:'en-US'}],true);
    else speak([{t:it.say},it.word?{t:it.word[0]}:null],true); };
})();

/* ===== 4ب) ضع دائرة حول الحرف / العدد المطلوب ===== */
const circ={unit:'1',tab:'ar',rounds:[],idx:0,left:0};
function buildCircleRounds(unit,tab){
  const L=LESSONS[unit], pool=cumulative(unit,tab==='nums'?'nums':tab);
  let targets=(tab==='nums'?L.nums.map(String):L[tab].map(o=>o.l));
  const rounds=[]; let cyc=shuf(targets);
  while(rounds.length<Math.max(5,targets.length)){
    if(!cyc.length) cyc=shuf(targets);
    const t=cyc.pop(); const k=2+rnd(3);        /* 2..4 مطلوب */
    const dist=pool.map(String).filter(x=>x.toLowerCase()!==String(t).toLowerCase());
    const cells=[]; for(let i=0;i<k;i++) cells.push({v:tab==='en'?(rnd(2)?t.toUpperCase():t.toLowerCase()):String(t),hit:true});
    const need=10-k;
    for(let i=0;i<need;i++){ const d=dist.length?dist[rnd(dist.length)]:null; if(d==null) break;
      cells.push({v:tab==='en'?(rnd(2)?d.toUpperCase():d.toLowerCase()):d,hit:false}); }
    rounds.push({t:String(t),cells:shuf(cells),k});
  }
  return rounds.slice(0,Math.max(5,Math.min(6,targets.length+2)));
}
function startCircle(unit,tab){
  circ.unit=unit;
  const tabs=tabsFor(unit); if(!tab||!tabs.some(t=>t.k===tab)) tab=tabs[0].k;
  circ.tab=tab;
  const fresh=!$('screen-circle').classList.contains('active');
  if(fresh) openX('circle',unit);
  window.__xtLang=(tab==='en')?'en':'ar';
  circ.rounds=buildCircleRounds(unit,tab); circ.idx=0;
  $('circle-title').textContent='ضع دائرة — '+LESSONS[unit].title;
  renderTabs('circle-tabs',tabs,tab,(k)=>startCircle(unit,k));
  renderCircleRound();
}
function renderCircleRound(){
  const r=circ.rounds[circ.idx], tab=circ.tab;
  $('circle-progress').textContent=`التمرين ${circ.idx+1} من ${circ.rounds.length}`;
  const what= tab==='ar'?'الحرف':(tab==='en'?'حرف اللغة الإنجليزية':'العدد');
  $('circle-prompt').textContent=`ضع دائرة حول ${what} المطلوب في كل مكان تجده:`;
  const tb=$('circle-target'); tb.innerHTML='';
  const big=document.createElement('span'); big.className='tb-letter'; big.textContent= tab==='en'?`${r.t.toUpperCase()} ${r.t.toLowerCase()}`:r.t; tb.appendChild(big);
  const say= tab==='nums'?{t:AR_NUM[+r.t],lang:'ar-SA'}:{t:r.t, lang: tab==='en'?'en-US':'ar-SA'};
  const sp=document.createElement('button'); sp.className='tb-spk'; sp.textContent='🔊'; sp.onclick=()=>{ sfx.pop(); speak([say],true); }; tb.appendChild(sp);
  circ.left=r.k; updCircleLeft();
  const grid=$('circle-grid'); grid.innerHTML='';
  r.cells.forEach(c=>{
    const b=document.createElement('button'); b.className='circ-item'+(tab==='en'?' en':''); b.textContent=c.v;
    b.onclick=()=>tapCircle(b,c); grid.appendChild(b);
  });
  qSpk($('circle-prompt'),cleanQ($('circle-prompt').textContent).replace(/[:：]/g,''));
}
function updCircleLeft(){ $('circle-left').textContent= circ.left>0?`متبقٍّ للتدوير: ${circ.left}`:''; }
function tapCircle(b,c){
  if(b.classList.contains('circled')) return;
  if(c.hit){
    b.classList.add('circled'); circ.left--; updCircleLeft(); sfx.circle();
    if(circ.left===0){
      cheer(null,circ.tab==='en'?'en':'ar');
      setTimeout(()=>{
        if(circ.idx<circ.rounds.length-1){ circ.idx++; renderCircleRound(); }
        else { awardStar(LESSONS[circ.unit].gk+'-circle'); const u=circ.unit,t=circ.tab;
          showModal('دوّرت كل المطلوب بشكل صحيح! ⭕🎉',()=>startCircle(u,t)); }
      },1300);
    }
  } else { b.classList.add('nope'); oops(); setTimeout(()=>b.classList.remove('nope'),450); }
}

/* ===== 4ج) ضع دائرة حول المعدود المناسب للعدد ===== */
const cc={unit:'1',rounds:[],idx:0,left:0,locked:false};
function buildCCRounds(unit){
  const L=LESSONS[unit], nums=L.nums, rounds=[];
  const order=shuf(nums); let i=0;
  const total=Math.max(4,Math.min(6,nums.length*2));
  for(let r=0;r<total;r++){
    const n=order[i++%order.length], type=(r%2===0)?'group':'items', emoji=L.objs[rnd(L.objs.length)];
    rounds.push({n,type,emoji});
  }
  return rounds;
}
function startCircleCount(unit){
  cc.unit=unit; openX('circlecount',unit);
  window.__xtLang='ar';
  cc.rounds=buildCCRounds(unit); cc.idx=0;
  $('cc-title').textContent='المعدود المناسب للعدد — '+LESSONS[unit].title;
  renderCC();
}
function renderCC(){
  const r=cc.rounds[cc.idx], area=$('cc-area'); cc.locked=false; area.innerHTML='';
  $('cc-progress').textContent=`التمرين ${cc.idx+1} من ${cc.rounds.length}`;
  const tb=$('cc-target'); tb.innerHTML='';
  const big=document.createElement('span'); big.className='tb-letter'; big.textContent=r.n; tb.appendChild(big);
  const nm=document.createElement('span'); nm.className='tb-name'; nm.textContent=AR_NUM[r.n]; tb.appendChild(nm);
  const sentence= r.type==='group'?`ضع دائرة حول المجموعة التي فيها ${AR_NUM[r.n]}`:`ضع دائرة حول ${AR_NUM[r.n]} من الأشياء`;
  const sp=document.createElement('button'); sp.className='tb-spk'; sp.textContent='🔊'; sp.onclick=()=>{ sfx.pop(); speak([{t:sentence,lang:'ar-SA'}],true); }; tb.appendChild(sp);
  $('cc-prompt').textContent= r.type==='group'?'ضع دائرة حول المجموعة المناسبة للعدد:':'ضع دائرة حول هذا العدد من الأشياء:';
  if(r.type==='group'){
    const L=LESSONS[cc.unit];
    const lo=Math.max(1,r.n-3), hi=Math.min(24,r.n+3); const opts=new Set([r.n]);
    const cand=[]; for(let v=lo;v<=hi;v++) if(v!==r.n) cand.push(v);
    shuf(cand).slice(0,2).forEach(v=>opts.add(v));
    const emojis=shuf(L.objs); let ei=0;
    const wrapEl=document.createElement('div'); wrapEl.className='cc-groups';
    shuf([...opts]).forEach(v=>{
      const em=emojis[ei++%emojis.length];
      const g=document.createElement('button'); g.className='cc-group';
      g.innerHTML=Array(v).fill(`<span>${em}</span>`).join('');
      if(v>12) g.classList.add('small');
      g.onclick=()=>{ if(cc.locked||g.classList.contains('circled')) return;
        if(v===r.n){ cc.locked=true; g.classList.add('circled'); sfx.circle(); done(); }
        else { g.classList.add('nope'); oops(); setTimeout(()=>g.classList.remove('nope'),450); } };
      wrapEl.appendChild(g);
    });
    area.appendChild(wrapEl); $('cc-left').textContent='';
  } else {
    cc.left=r.n; const extra=2+rnd(3), M=r.n+extra;
    const row=document.createElement('div'); row.className='cc-items'+(M>12?' small':'');
    for(let i=0;i<M;i++){
      const b=document.createElement('button'); b.className='cc-item'; b.textContent=r.emoji;
      b.onclick=()=>{
        if(cc.locked) return;
        if(b.classList.contains('circled')){ b.classList.remove('circled'); cc.left++; sfx.pop(); upd(); return; }
        if(cc.left<=0){ b.classList.add('nope'); oops(); setTimeout(()=>b.classList.remove('nope'),450); toast(`المطلوب ${AR_NUM[r.n]} فقط — اضغط على شكل مدوَّر لتلغي دائرته`,2600); return; }
        b.classList.add('circled'); cc.left--; sfx.circle(); upd();
        if(cc.left===0){ cc.locked=true; done(); }
      };
      row.appendChild(b);
    }
    area.appendChild(row); upd();
  }
  function upd(){ $('cc-left').textContent= cc.left>0?`متبقٍّ للتدوير: ${cc.left}`:''; }
  function done(){
    cheer({t:AR_NUM[r.n],lang:'ar-SA'},'ar');
    setTimeout(()=>{
      if(cc.idx<cc.rounds.length-1){ cc.idx++; renderCC(); }
      else { awardStar(LESSONS[cc.unit].gk+'-circlecount'); const u=cc.unit; showModal('أحسنت! دوّرت المعدود المناسب لكل عدد 🔢🎉',()=>startCircleCount(u)); }
    },1500);
  }
}

/* ===== 4د) استمع وتعلّم (النطق + استمع واختر) ===== */
const lst={unit:'1',tab:'ar'};
function startListen(unit,tab){
  lst.unit=unit;
  const tabs=tabsFor(unit); if(!tab||!tabs.some(t=>t.k===tab)) tab=tabs[0].k; lst.tab=tab;
  if(!$('screen-listen').classList.contains('active')) openX('listen',unit);
  window.__xtLang=(tab==='en')?'en':'ar';
  $('listen-title').textContent='استمع وتعلّم — '+LESSONS[unit].title;
  renderTabs('listen-tabs',tabs,tab,(k)=>startListen(unit,k));
  const grid=$('listen-grid'); grid.innerHTML='';
  const L=LESSONS[unit];
  if(tab==='nums'){
    L.nums.forEach(n=>{
      const c=document.createElement('button'); c.className='ls-card';
      c.innerHTML=`<span class="ls-big">${n}</span><span class="ls-w">${AR_NUM[n]}</span><span class="ls-w en">${EN_NUM[n]}</span><span class="spk-ic">🔊</span>`;
      c.onclick=()=>{ sfx.pop(); c.classList.add('playing'); setTimeout(()=>c.classList.remove('playing'),900); speak([{t:AR_NUM[n],lang:'ar-SA'},{t:EN_NUM[n],lang:'en-US'}],true); };
      grid.appendChild(c);
    });
  } else {
    L[tab].forEach(o=>{
      const sec=document.createElement('div'); sec.className='ls-sec';
      const head=document.createElement('button'); head.className='ls-letter'+(tab==='en'?' en':'');
      head.innerHTML=`<span>${tab==='en'?o.l+' '+o.l.toLowerCase():o.l}</span><span class="spk-ic">🔊</span>`;
      head.onclick=()=>{ sfx.pop(); speak([{t:o.l,lang:tab==='en'?'en-US':'ar-SA'}],true); };
      sec.appendChild(head);
      const row=document.createElement('div'); row.className='ls-words';
      o.w.forEach(w=>{
        const c=document.createElement('button'); c.className='ls-card';
        c.innerHTML=`<span class="ls-emoji">${w[1]}</span><span class="ls-w ${tab==='en'?'en':''}">${w[0]}</span><span class="spk-ic">🔊</span>`;
        c.onclick=()=>{ sfx.pop(); c.classList.add('playing'); setTimeout(()=>c.classList.remove('playing'),900); speak([{t:w[0],lang:tab==='en'?'en-US':'ar-SA',rate:.7}],true); };
        row.appendChild(c);
      });
      sec.appendChild(row); grid.appendChild(sec);
    });
  }
  $('listen-all').onclick=()=>{ sfx.pop();
    const q=[]; if(tab==='nums') L.nums.forEach(n=>{ q.push({t:AR_NUM[n],lang:'ar-SA'}); q.push({t:EN_NUM[n],lang:'en-US'}); });
    else L[tab].forEach(o=>{ q.push({t:o.l,lang:tab==='en'?'en-US':'ar-SA'}); o.w.forEach(w=>q.push({t:w[0],lang:tab==='en'?'en-US':'ar-SA',rate:.7})); });
    speak(q,true); };
  $('listen-game').onclick=()=>{ sfx.pop(); startListenGame(unit,tab); };
}
function startListenGame(unit,tab){
  const L=LESSONS[unit]; let rounds=[];
  if(tab==='nums'){
    const pool=cumulative(unit,'nums');
    L.nums.forEach(n=>{
      const cand=[]; for(let v=Math.max(1,n-3);v<=n+3;v++) if(v!==n) cand.push(v);
      const opts=[n,...shuf(cand).slice(0,2)];
      rounds.push({header:'🔊',prompt:'استمع ثم اختر العدد الصحيح',speak:AR_NUM[n],options:opts.map(v=>({emoji:String(v),correct:v===n}))});
      rounds.push({header:'🔊',prompt:'Listen and choose the number',speak:EN_NUM[n],options:opts.map(v=>({emoji:String(v),correct:v===n}))});
    });
    rounds=shuf(rounds).slice(0,Math.max(4,Math.min(8,rounds.length)));
  } else {
    const mine=[]; L[tab].forEach(o=>o.w.forEach(w=>mine.push({t:w[0],e:w[1]})));
    const pool=allWords(unit,tab);
    shuf(mine).slice(0,Math.min(6,mine.length)).forEach(w=>{
      const others=shuf(pool.filter(x=>x.e!==w.e)); const seen=new Set([w.e]); const ds=[];
      others.forEach(x=>{ if(ds.length<2 && !seen.has(x.e)){ seen.add(x.e); ds.push(x); } });
      const opts=[{emoji:w.e,correct:true},...ds.map(d=>({emoji:d.e,correct:false}))];
      if(opts.length<2) return;
      rounds.push({header:'🔊',prompt: tab==='en'?'Listen and choose the picture':'استمع ثم اختر الصورة الصحيحة',speak:w.t,options:opts});
    });
  }
  if(!rounds.length){ toast('لا توجد كلمات كافية للعبة هنا'); return; }
  runQuiz(rounds,LESSONS[unit].gk+'-listen','🎧','استمع واختر — '+L.title);
  window.__xtLang=(tab==='en')?'en':null;
}


/* ===== 4هـ) اقرأ المقطع: الحرف + حروف المد الطويل (ا ي و) ===== */
mkScreen('syl',`<div class="game-panel">
  <div class="game-title"><span class="emoji">📖</span><h2 id="syl-title">اقرأ المقطع</h2></div>
  <div class="syl-tips">
    <div class="syl-tip"><b>َ + ا</b><span>فتحة + ألف مد<br>افتح فمك وأطيلي الصوت: <i>بَــا</i></span></div>
    <div class="syl-tip"><b>ِ + ي</b><span>كسرة + ياء مد<br>ابتسم وأطيلي الصوت: <i>بِــي</i></span></div>
    <div class="syl-tip"><b>ُ + و</b><span>ضمة + واو مد<br>اضمم شفتيك وأطيلي الصوت: <i>بُــو</i></span></div>
  </div>
  <div class="xt-actions" style="margin:0 0 14px">
    <button class="xt-btn" id="syl-all">▶ استمع للجميع</button>
    <button class="xt-btn primary" id="syl-game">🎧 العب: استمع واختر المقطع</button>
  </div>
  <div class="listen-grid" id="syl-grid"></div>
</div>`);
const FAT='َ', KAS='ِ', DAM='ُ';
const SYL_V=[{m:FAT,long:'ا',name:'فتحة + ألف مد',tip:'افتح فمك وأطيلي الصوت'},{m:KAS,long:'ي',name:'كسرة + ياء مد',tip:'ابتسم وأطيلي الصوت'},{m:DAM,long:'و',name:'ضمة + واو مد',tip:'اضمم شفتيك وأطيلي الصوت'}];
const makeSyl=(l,v)=>l+v.m+v.long;
const vowelsFor=(l)=>SYL_V.filter(v=>!(l==='و'&&v.m===DAM));
function sylLetters(unit){ return LESSONS[unit].ar.map(o=>o.l).filter(l=>l!=='ا'); }
function startSyllables(unit){
  openX('syl',unit); window.__xtLang='ar';
  $('syl-title').textContent='اقرأ المقطع — '+LESSONS[unit].title;
  const grid=$('syl-grid'); grid.innerHTML='';
  sylLetters(unit).forEach(l=>{
    const sec=document.createElement('div'); sec.className='ls-sec';
    const head=document.createElement('button'); head.className='ls-letter';
    head.innerHTML=`<span>${l}</span><span class="spk-ic">🔊</span>`;
    head.onclick=()=>{ sfx.pop(); speak([{t:l,lang:'ar-SA'}],true); };
    sec.appendChild(head);
    const row=document.createElement('div'); row.className='ls-words';
    vowelsFor(l).forEach(v=>{
      const t=makeSyl(l,v), c=document.createElement('button'); c.className='ls-card syl-card';
      c.innerHTML=`<span class="ls-big">${t}</span><span class="ls-w small">${l} ${v.m} + ${v.long}</span><span class="ls-w tiny">${v.name}</span><span class="spk-ic">🔊</span>`;
      c.onclick=()=>{ sfx.pop(); c.classList.add('playing'); setTimeout(()=>c.classList.remove('playing'),1000); speak([{t:t,lang:'ar-SA',rate:.55}],true); };
      row.appendChild(c);
    });
    sec.appendChild(row); grid.appendChild(sec);
  });
  $('syl-all').onclick=()=>{ sfx.pop(); const q=[]; sylLetters(unit).forEach(l=>vowelsFor(l).forEach(v=>q.push({t:makeSyl(l,v),lang:'ar-SA',rate:.55}))); speak(q,true); };
  $('syl-game').onclick=()=>{ sfx.pop(); startSylGame(unit); };
}
function startSylGame(unit){
  const letters=sylLetters(unit), rounds=[];
  shuf(letters.flatMap(l=>vowelsFor(l).map(v=>({l,v})))).slice(0,Math.max(5,Math.min(8,letters.length*3))).forEach(x=>{
    const t=makeSyl(x.l,x.v);
    rounds.push({header:'🔊',prompt:'استمع ثم اختر المقطع الصحيح',speak:t,options:vowelsFor(x.l).map(v=>({emoji:makeSyl(x.l,v),correct:v===x.v}))});
  });
  runQuiz(rounds,LESSONS[unit].gk+'-syl','🎧','اقرأ المقطع — '+LESSONS[unit].title);
  window.__xtLang=null;
}

/* ---------------------------------------------------------
   5) أزرار الدخول في صفحات الوحدات
   --------------------------------------------------------- */
const CARDS=[
  {k:'write',icon:'✍️',h:'تمرين التطبيع',p:'تتبّع الحرف أو العدد بإصبعك وتدرّب على الكتابة',fn:'startTrace',need:()=>true},
  {k:'circle',icon:'⭕',h:'ضع دائرة',p:'ضع دائرة حول الحرف أو العدد أو حرف الإنجليزية المطلوب',fn:'startCircle',need:()=>true},
  {k:'circlecount',icon:'🔢',h:'ضع دائرة حول المعدود',p:'ضع دائرة حول المعدود المناسب للعدد',fn:'startCircleCount',need:(L)=>L.nums.length>0},
  {k:'syl',icon:'📖',h:'اقرأ المقطع',p:'الحرف مع المدّ الطويل (ا ي و): بَا بِي بُو، مع طريقة النطق الصحيحة',fn:'startSyllables',need:(L)=>L.ar.some(o=>o.l!=='ا')},
  {k:'listen',icon:'🔊',h:'استمع وتعلّم',p:'استمع إلى النطق الصحيح للحروف والكلمات والأعداد',fn:'startListen',need:()=>true},
];
const FN={startTrace:(u)=>startTrace(u),startCircle:(u)=>startCircle(u),startCircleCount:(u)=>startCircleCount(u),startListen:(u)=>startListen(u),startSyllables:(u)=>startSyllables(u)};
function injectCards(){
  UNIT_KEYS.forEach(u=>{
    const scr=$('screen-unit'+u); if(!scr) return;
    const grid=scr.querySelector('.grid'); if(!grid || grid.querySelector('[data-xt]')) return;
    const L=LESSONS[u];
    const lab=document.createElement('div'); lab.className='xt-divider'; lab.setAttribute('data-xt','1'); lab.textContent='✨ تدريبات الحروف والأعداد والنطق';
    grid.appendChild(lab);
    CARDS.forEach(c=>{
      if(!c.need(L)) return;
      const b=document.createElement('button'); b.className='card u'+u+' xt-card'; b.setAttribute('data-xt','1');
      b.innerHTML=`<span class="stars-earned" id="stars-${L.gk}-${c.k}"></span><div class="badge">${c.icon}</div><h3>${c.h}</h3><p>${c.p}</p>`;
      b.onclick=()=>FN[c.fn](u);
      grid.appendChild(b);
    });
  });
  try{ renderStarsUI(); updateAllUnitProgress(); }catch(e){}
}
/* مغادرة الشاشة تعيد لغة التشجيع للوضع التلقائي */
const _goHome=window.goHome, _backToUnit=window.backToUnit;
window.goHome=function(){ window.__xtLang=null; if(synth){try{synth.cancel();}catch(e){}} return _goHome.apply(this,arguments); };
window.backToUnit=function(){ window.__xtLang=null; if(synth){try{synth.cancel();}catch(e){}} return _backToUnit.apply(this,arguments); };
/* ألعاب app.js الأصلية تتجاهل __xtLang لأنها تفتح شاشات أخرى */
const _openGame=window.openGameScreen;
window.openGameScreen=function(id){
  if(!/^(trace|circle|circlecount|listen|syl)$/.test(id)) window.__xtLang=null;
  return _openGame.apply(this,arguments);
};

addMuteButton();
injectCards();
window.__kgx={trace,traceCoverage,checkTrace,startTrace,startCircle,startCircleCount,startListen,startListenGame,startSyllables,startSylGame,LESSONS,sfx,cheer};
})();
