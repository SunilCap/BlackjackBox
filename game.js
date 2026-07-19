(function(){'use strict';

/* ── SCALER ── */
const BASE_W=390,BASE_H=844;
function rescale(){
  const sc=document.getElementById('scaler');
  const sw=window.innerWidth,sh=window.innerHeight;
  const s=Math.min(sw/BASE_W,sh/BASE_H);
  const ox=Math.max(0,(sw-BASE_W*s)/2);
  const oy=Math.max(0,(sh-BASE_H*s)/2);
  sc.style.width=BASE_W+'px';
  sc.style.height=BASE_H+'px';
  sc.style.transformOrigin='top left';
  sc.style.transform=`translate(${ox}px,${oy}px) scale(${s})`;
}
rescale();window.addEventListener('resize',rescale);

/* ── TABLES CONFIG ── */
const TABLES=[
  {
    id:'vegas',name:'Las Vegas',cls:'t-vegas',
    minStack:500,minBet:5,maxBet:100,decks:2,
    info:'Minimum Stack $500\nBet $5 – $100\n2 Decks',
    svg:`<svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- neon Vegas skyline silhouette -->
      <g stroke="#bf60ff" stroke-width="2" fill="none">
        <!-- casino tower left -->
        <rect x="10" y="60" width="28" height="90" rx="2"/>
        <rect x="14" y="64" width="6" height="8"/><rect x="22" y="64" width="6" height="8"/>
        <rect x="14" y="76" width="6" height="8"/><rect x="22" y="76" width="6" height="8"/>
        <rect x="14" y="88" width="6" height="8"/><rect x="22" y="88" width="6" height="8"/>
        <rect x="14" y="100" width="6" height="8"/><rect x="22" y="100" width="6" height="8"/>
        <!-- neon sign on top -->
        <rect x="8" y="52" width="32" height="10" rx="2" fill="rgba(191,96,255,.15)" stroke="#bf60ff"/>
        <!-- center high-rise -->
        <rect x="80" y="20" width="60" height="130" rx="2"/>
        <rect x="86" y="26" width="10" height="12"/><rect x="100" y="26" width="10" height="12"/><rect x="114" y="26" width="10" height="12"/>
        <rect x="86" y="42" width="10" height="12"/><rect x="100" y="42" width="10" height="12"/><rect x="114" y="42" width="10" height="12"/>
        <rect x="86" y="58" width="10" height="12"/><rect x="100" y="58" width="10" height="12"/><rect x="114" y="58" width="10" height="12"/>
        <rect x="86" y="74" width="10" height="12"/><rect x="100" y="74" width="10" height="12"/><rect x="114" y="74" width="10" height="12"/>
        <rect x="86" y="90" width="10" height="12"/><rect x="100" y="90" width="10" height="12"/><rect x="114" y="90" width="10" height="12"/>
        <!-- spire -->
        <line x1="110" y1="20" x2="110" y2="4"/>
        <circle cx="110" cy="3" r="3" fill="#bf60ff"/>
        <!-- right tower -->
        <rect x="182" y="45" width="30" height="105" rx="2"/>
        <rect x="186" y="50" width="8" height="10"/><rect x="196" y="50" width="8" height="10"/>
        <rect x="186" y="64" width="8" height="10"/><rect x="196" y="64" width="8" height="10"/>
        <rect x="186" y="78" width="8" height="10"/><rect x="196" y="78" width="8" height="10"/>
        <!-- ground -->
        <line x1="0" y1="150" x2="220" y2="150" stroke-width="3"/>
      </g>
      <!-- glow dots -->
      <circle cx="110" cy="3" r="6" fill="#bf60ff" opacity=".3"/>
    </svg>`
  },
  {
    id:'paris',name:'Paris',cls:'t-paris',
    minStack:2500,minBet:25,maxBet:500,decks:4,
    info:'Minimum Stack $2,500\nBet $25 – $500\n4 Decks',
    svg:`<svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#60d060" stroke-width="2" fill="none">
        <!-- Eiffel Tower -->
        <path d="M90 150 L75 90 L60 40 L110 10 L160 40 L145 90 L130 150Z" stroke-width="1.5"/>
        <line x1="75" y1="90" x2="145" y2="90"/>
        <line x1="60" y1="40" x2="160" y2="40"/>
        <line x1="83" y1="120" x2="137" y2="120"/>
        <!-- cross beams -->
        <line x1="75" y1="90" x2="110" y2="40"/><line x1="145" y1="90" x2="110" y2="40"/>
        <line x1="60" y1="40" x2="110" y2="10"/><line x1="160" y1="40" x2="110" y2="10"/>
        <!-- spire -->
        <line x1="110" y1="10" x2="110" y2="2"/>
        <circle cx="110" cy="2" r="3" fill="#60d060"/>
        <!-- arch base -->
        <path d="M85 150 Q110 130 135 150" stroke-width="2.5"/>
        <!-- left building -->
        <rect x="20" y="80" width="36" height="70" rx="2"/>
        <rect x="26" y="86" width="8" height="10"/><rect x="36" y="86" width="8" height="10"/>
        <rect x="26" y="100" width="8" height="10"/><rect x="36" y="100" width="8" height="10"/>
        <path d="M20 80 Q38 66 56 80"/>
        <!-- right building -->
        <rect x="164" y="80" width="36" height="70" rx="2"/>
        <rect x="170" y="86" width="8" height="10"/><rect x="180" y="86" width="8" height="10"/>
        <rect x="170" y="100" width="8" height="10"/><rect x="180" y="100" width="8" height="10"/>
        <path d="M164 80 Q182 66 200 80"/>
        <!-- ground -->
        <line x1="0" y1="150" x2="220" y2="150" stroke-width="3"/>
      </g>
      <circle cx="110" cy="2" r="5" fill="#60d060" opacity=".35"/>
    </svg>`
  },
  {
    id:'singapore',name:'Singapore',cls:'t-singapore',
    minStack:10000,minBet:100,maxBet:2000,decks:6,
    info:'Minimum Stack $10,000\nBet $100 – $2,000\n6 Decks',
    svg:`<svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#ff60a8" stroke-width="2" fill="none">
        <!-- Marina Bay Sands-style triple tower -->
        <rect x="50" y="50" width="24" height="100" rx="2"/>
        <rect x="98" y="30" width="24" height="120" rx="2"/>
        <rect x="146" y="50" width="24" height="100" rx="2"/>
        <!-- sky park connecting -->
        <path d="M44 50 Q110 30 176 50" stroke-width="3"/>
        <rect x="44" y="40" width="132" height="14" rx="4" fill="rgba(255,96,168,.1)"/>
        <!-- windows -->
        <rect x="54" y="56" width="6" height="8"/><rect x="62" y="56" width="6" height="8"/>
        <rect x="54" y="68" width="6" height="8"/><rect x="62" y="68" width="6" height="8"/>
        <rect x="54" y="80" width="6" height="8"/><rect x="62" y="80" width="6" height="8"/>
        <rect x="102" y="36" width="6" height="8"/><rect x="110" y="36" width="6" height="8"/>
        <rect x="102" y="48" width="6" height="8"/><rect x="110" y="48" width="6" height="8"/>
        <rect x="102" y="60" width="6" height="8"/><rect x="110" y="60" width="6" height="8"/>
        <rect x="102" y="72" width="6" height="8"/><rect x="110" y="72" width="6" height="8"/>
        <rect x="150" y="56" width="6" height="8"/><rect x="158" y="56" width="6" height="8"/>
        <rect x="150" y="68" width="6" height="8"/><rect x="158" y="68" width="6" height="8"/>
        <!-- Merlion -->
        <path d="M10 150 L10 120 Q14 108 18 120 L18 150Z"/>
        <path d="M14 108 Q8 98 12 90 Q18 85 20 92 Q22 84 28 88 Q26 98 20 105Z"/>
        <circle cx="15" cy="94" r="2" fill="#ff60a8"/>
        <!-- water squirt -->
        <path d="M14 90 Q10 75 18 65" stroke-dasharray="3 3"/>
        <!-- ferris wheel -->
        <circle cx="200" cy="120" r="22"/>
        <line x1="200" y1="98" x2="200" y2="142"/>
        <line x1="178" y1="120" x2="222" y2="120"/>
        <line x1="184" y1="104" x2="216" y2="136"/>
        <line x1="216" y1="104" x2="184" y2="136"/>
        <!-- ground -->
        <line x1="0" y1="150" x2="220" y2="150" stroke-width="3"/>
      </g>
    </svg>`
  },
  {
    id:'melbourne',name:'Melbourne',cls:'t-melbourne',
    minStack:25000,minBet:500,maxBet:5000,decks:8,
    info:'Minimum Stack $25,000\nBet $500 – $5,000\n8 Decks',
    svg:`<svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#ffe060" stroke-width="2" fill="none">
        <!-- Eureka tower style (tall slender) -->
        <rect x="98" y="8" width="24" height="142" rx="2"/>
        <rect x="94" y="8" width="32" height="18" rx="2" fill="rgba(255,224,96,.12)"/>
        <!-- gold top section -->
        <rect x="94" y="8" width="32" height="30" rx="2" stroke="#ffe060" stroke-width="2.5"/>
        <line x1="98" y1="8" x2="98" y2="38"/><line x1="110" y1="8" x2="110" y2="38"/>
        <!-- windows main -->
        <rect x="102" y="42" width="7" height="9"/><rect x="111" y="42" width="7" height="9"/>
        <rect x="102" y="55" width="7" height="9"/><rect x="111" y="55" width="7" height="9"/>
        <rect x="102" y="68" width="7" height="9"/><rect x="111" y="68" width="7" height="9"/>
        <rect x="102" y="81" width="7" height="9"/><rect x="111" y="81" width="7" height="9"/>
        <rect x="102" y="94" width="7" height="9"/><rect x="111" y="94" width="7" height="9"/>
        <rect x="102" y="107" width="7" height="9"/><rect x="111" y="107" width="7" height="9"/>
        <!-- left cluster -->
        <rect x="30" y="60" width="20" height="90"/><rect x="52" y="72" width="20" height="78"/>
        <rect x="74" y="80" width="18" height="70"/>
        <rect x="34" y="66" width="5" height="7"/><rect x="41" y="66" width="5" height="7"/>
        <rect x="34" y="77" width="5" height="7"/><rect x="41" y="77" width="5" height="7"/>
        <!-- right cluster -->
        <rect x="128" y="70" width="18" height="80"/><rect x="148" y="58" width="22" height="92"/>
        <rect x="172" y="75" width="18" height="75"/>
        <rect x="152" y="64" width="6" height="8"/><rect x="160" y="64" width="6" height="8"/>
        <rect x="152" y="76" width="6" height="8"/><rect x="160" y="76" width="6" height="8"/>
        <!-- Yarra river -->
        <path d="M0 150 Q55 140 110 148 Q165 156 220 145" stroke-width="2.5" stroke="#ffe060" opacity=".4"/>
        <!-- ground -->
        <line x1="0" y1="150" x2="220" y2="150" stroke-width="3"/>
      </g>
    </svg>`
  },
  {
    id:'monaco',name:'Monaco',cls:'t-monaco',
    minStack:100000,minBet:1000,maxBet:10000,decks:8,
    info:'Minimum Stack $100,000\nBet $1,000 – $10,000\n8 Decks',
    svg:`<svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke="#ffd060" stroke-width="2" fill="none">
        <!-- Casino de Monte Carlo classical facade -->
        <rect x="40" y="60" width="140" height="90" rx="2"/>
        <!-- columns -->
        <line x1="60" y1="60" x2="60" y2="150"/><line x1="80" y1="60" x2="80" y2="150"/>
        <line x1="100" y1="60" x2="100" y2="150"/><line x1="120" y1="60" x2="120" y2="150"/>
        <line x1="140" y1="60" x2="140" y2="150"/><line x1="160" y1="60" x2="160" y2="150"/>
        <!-- pediment top -->
        <path d="M35 60 L110 20 L185 60Z" stroke-width="2"/>
        <rect x="35" y="58" width="150" height="6"/>
        <!-- central dome -->
        <ellipse cx="110" cy="30" rx="26" ry="18"/>
        <line x1="110" y1="12" x2="110" y2="4"/>
        <circle cx="110" cy="3" r="3" fill="#ffd060"/>
        <!-- clock face -->
        <circle cx="110" cy="38" r="10"/>
        <line x1="110" y1="30" x2="110" y2="38"/>
        <line x1="110" y1="38" x2="116" y2="42"/>
        <!-- side towers -->
        <rect x="14" y="40" width="26" height="110" rx="2"/>
        <path d="M14 40 L27 22 L40 40Z"/>
        <rect x="180" y="40" width="26" height="110" rx="2"/>
        <path d="M180 40 L193 22 L206 40Z"/>
        <!-- entrance steps -->
        <line x1="80" y1="150" x2="140" y2="150" stroke-width="4"/>
        <line x1="75" y1="155" x2="145" y2="155" stroke-width="3"/>
        <!-- windows -->
        <rect x="48" y="80" width="8" height="12" rx="1"/>
        <rect x="164" y="80" width="8" height="12" rx="1"/>
        <rect x="68" y="75" width="8" height="14" rx="4"/>
        <rect x="144" y="75" width="8" height="14" rx="4"/>
        <rect x="88" y="70" width="8" height="16" rx="4"/>
        <rect x="124" y="70" width="8" height="16" rx="4"/>
        <!-- ground -->
        <line x1="0" y1="155" x2="220" y2="155" stroke-width="3"/>
      </g>
      <circle cx="110" cy="3" r="6" fill="#ffd060" opacity=".35"/>
    </svg>`
  },
];

/* ── STATE ── */
let bankroll=1000,startBR=1000,shoe=[],state="betting";
let dealerCards=[],splitHands=null,activeSplit=-1,insuranceBet=0;
let stats={hands:0,won:0,lost:0,push:0,bj:0,bust:0,curStreak:0,bestStreak:0};
let currentTableIdx=0,activeTable=TABLES[0];

const $=id=>document.getElementById(id);
const SUITS=[{sym:"♠",c:"black"},{sym:"♥",c:"red"},{sym:"♦",c:"red"},{sym:"♣",c:"black"}];
const SUIT_IMG={"♠":"img/suit-spade.png","♥":"img/suit-heart.png","♦":"img/suit-diamond.png","♣":"img/suit-club.png"};
const RANKS=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

/* ── LOBBY ── */
const CITY_IMG={
  vegas:'img/city-lasvegas.png',
  paris:'img/city-paris.png',
  singapore:'img/city-singapore.png',
  melbourne:'img/city-melbourne.png'
  // monaco: no matching sprite asset, keeps the original CSS-drawn skyline below
};

function renderLobby(){
  const tbl=TABLES[currentTableIdx];
  const bg=$('lobbyBg');
  bg.className='lobby-bg '+tbl.id;

  const locked=bankroll<tbl.minStack;

  // chip values for this table
  const chips=getTableChips(tbl);

  const cityImg=CITY_IMG[tbl.id];
  $('tableCard').innerHTML=`
    ${cityImg
      ?`<img class="city-banner-img" src="${cityImg}" alt="${tbl.name}">`
      :`<div class="city-icon ${tbl.cls}" style="color:${neonColor(tbl.cls)}">${tbl.svg}</div>
        <div class="city-badge ${tbl.cls}" style="color:${neonColor(tbl.cls)};border-color:${neonColor(tbl.cls)};box-shadow:0 0 18px ${neonColor(tbl.cls)},inset 0 0 12px rgba(255,255,255,.06)">${tbl.name}</div>`
    }
    <div class="table-info">
      ${tbl.info.split('\n').map(l=>`<p>${l}</p>`).join('')}
      ${locked?`<p class="info-locked">⚠ Need ${fmt(tbl.minStack)} to enter</p>`:''}
    </div>
    <button class="play-btn${locked?' locked':''}" id="playBtn">${locked?t('locked'):t('play')}</button>
    ${locked?`<button class="watch-ad-btn" id="watchAdBtn">🎬 Watch Ad for ${fmt(500)}</button>`:''}
  `;
  if(locked){
    const wab=$('watchAdBtn');
    if(wab)wab.addEventListener('click',showRewardedAd);
  }

  // dots
  const dotsEl=$('dots');
  dotsEl.innerHTML=TABLES.map((_,i)=>`<div class="dot${i===currentTableIdx?' active':''}"></div>`).join('');

  if(!locked){
    $('playBtn').addEventListener('click',()=>enterGame(tbl));
  }

  // update chip tray for this table
  updateChipTray(chips);
}

function neonColor(cls){
  return{
    't-vegas':'#bf60ff','t-paris':'#60d060',
    't-singapore':'#ff60a8','t-melbourne':'#ffe060','t-monaco':'#ffd060'
  }[cls]||'#fff';
}

function getTableChips(t){
  // all 4 chips must be <= maxBet, spread sensibly across the range
  const max=t.maxBet, min=t.minBet;
  // build 4 ascending values: minBet, ~25%, ~60%, maxBet
  const c1=min;
  const c2=Math.min(max, Math.round(max*0.25/min)*min || min*5);
  const c3=Math.min(max, Math.round(max*0.6/min)*min  || min*10);
  const c4=max;
  // deduplicate and fill if needed
  const raw=[c1,c2,c3,c4];
  const unique=[...new Set(raw)];
  while(unique.length<4) unique.push(unique[unique.length-1]);
  return unique.slice(0,4);
}

function updateChipTray(chips){
  const tray=$('chipTray');
  const cols=['c5','c25','c100','c500'];
  const btns=tray.querySelectorAll('button');
  btns.forEach((b,i)=>{
    b.dataset.v=chips[i];
    b.textContent=chips[i]>=1000?('$'+(chips[i]/1000)+'K'):('$'+chips[i]);
  });
}

$('arrowL').addEventListener('click',()=>{currentTableIdx=(currentTableIdx-1+TABLES.length)%TABLES.length;renderLobby();});
$('arrowR').addEventListener('click',()=>{currentTableIdx=(currentTableIdx+1)%TABLES.length;renderLobby();});
$('lobbyAdd').addEventListener('click',()=>{bankroll+=500;$('lobbyBal').textContent=fmt(bankroll);renderLobby();});

function enterGame(tbl){
  activeTable=tbl;
  $('rulesModal').classList.remove('show');
  $('tableStrip').textContent=`${tbl.name} · ${tbl.decks} Decks · Bet $${tbl.minBet.toLocaleString()}–$${tbl.maxBet.toLocaleString()}`;
  updateChipTray(getTableChips(tbl));
  resetTable();
  $('lobby').classList.add('hide');
  $('game').classList.add('show');
}

$('backBtn').addEventListener('click',()=>{
  if(state!=="betting")return;
  $('game').classList.remove('show');
  $('lobby').classList.remove('hide');
  $('lobbyBal').textContent=fmt(bankroll);
  renderLobby();
  // natural break point — let the Ad Placement API decide whether/how often to actually show one
  if(typeof adBreak==='function'){
    adBreak({
      type:'next',
      name:'return_to_lobby',
    });
  }
});

/* ── REWARDED AD: bonus chips when locked out of a table ── */
function showRewardedAd(){
  if(typeof adBreak!=='function'){showToast('Ads not configured yet');return;}
  adBreak({
    type:'reward',
    name:'bonus_chips',
    beforeReward:(showAdFn)=>{ showAdFn(); },
    adViewed:()=>{
      bankroll+=500;
      $('lobbyBal').textContent=fmt(bankroll);
      showToast('+'+fmt(500)+' chips!');
      renderLobby();
    },
    adDismissed:()=>{ showToast('Watch the full ad to earn chips'); },
    adBreakDone:()=>{},
  });
}

/* ── AUDIO ── */
let actx;
let soundMuted=false;
function ac(){if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();return actx;}
function tone(f,type,dur,vol,del){if(soundMuted)return;try{const a=ac(),g=a.createGain(),o=a.createOscillator();o.type=type;o.frequency.value=f;const t=a.currentTime+(del||0);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.05);}catch(e){}}
const _musicBtn=$('musicBtn');
if(_musicBtn){
  _musicBtn.addEventListener('click',()=>{
    soundMuted=!soundMuted;
    _musicBtn.querySelector('img').src=soundMuted?'img/icon-mute.png':'img/icon-music.png';
    if(typeof adConfig==='function')adConfig({sound:soundMuted?'off':'on'});
  });
}
function nBlip(dur,vol){try{const a=ac(),buf=a.createBuffer(1,a.sampleRate*.1,a.sampleRate),g=a.createGain();const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.25;const src=a.createBufferSource();src.buffer=buf;src.connect(g);g.connect(a.destination);g.gain.setValueAtTime(vol,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);src.start();src.stop(a.currentTime+dur+.05);}catch(e){}}
const SFX={
  card:()=>{nBlip(.09,.65);tone(860,'sine',.07,.1);},
  chip:()=>{tone(1100,'sine',.06,.16);tone(750,'sine',.05,.1,.045);},
  deal:()=>{[0,150,300,450].forEach(d=>setTimeout(SFX.card,d));},
  win:()=>{tone(523,'sine',.14,.22);tone(659,'sine',.14,.22,.12);tone(784,'sine',.24,.28,.25);},
  bj: ()=>{[0,.1,.2,.32].forEach((d,i)=>{const fs=[523,659,784,1047];tone(fs[i],'sine',i===3?.3:.12,.25,d);});},
  lose:()=>{tone(210,'sawtooth',.12,.18);tone(170,'sawtooth',.18,.18,.1);},
  bust:()=>{[0,.08,.18].forEach((d,i)=>{tone([190,155,125][i],'sawtooth',[.1,.15,.22][i],.18,d);});},
  push:()=>{tone(440,'sine',.11,.14);tone(440,'sine',.11,.14,.18);},
  ins: ()=>{tone(640,'sine',.1,.18);tone(860,'sine',.2,.22,.1);},
};

/* ── SHOE ── */
function buildShoe(numDecks){
  let d=[];
  for(let k=0;k<numDecks;k++)for(const s of SUITS)for(const r of RANKS)d.push({rank:r,suit:s.sym,col:s.c});
  for(let i=d.length-1;i>0;i--){const j=0|Math.random()*(i+1);[d[i],d[j]]=[d[j],d[i]];}
  return d;
}
function draw(){if(shoe.length<10)shoe=buildShoe(activeTable.decks);return shoe.pop();}

/* ── MATH ── */
function cv(c){if(c.rank==="A")return 11;if("JQK".includes(c.rank))return 10;return+c.rank;}
function hv(cs){let t=0,a=0;for(const c of cs){t+=cv(c);if(c.rank==="A")a++;}while(t>21&&a-->0)t-=10;return t;}
function isBJ(cs){return cs.length===2&&hv(cs)===21;}
function canSplit(cs){return cs.length===2&&cv(cs[0])===cv(cs[1]);}
function fmt(n){return"$"+n.toLocaleString();}

/* ── CARD LAYOUT ── */
function layoutHand(container,cards,fdLast){
  container.innerHTML="";
  const n=cards.length;
  const stride=Math.min(26,180/Math.max(n,1));
  const totalSpan=stride*(n-1);
  const cw=container.offsetWidth||320;
  cards.forEach((card,i)=>{
    const fd=fdLast&&i===n-1;
    const cd=document.createElement('div');
    cd.className="card "+(fd?"back":card.col);
    if(!fd)cd.innerHTML=`<div class="corner">${card.rank}<br><img class="suit-ic" src="${SUIT_IMG[card.suit]}"></div><img class="pip" src="${SUIT_IMG[card.suit]}"><div class="corner bot">${card.rank}<br><img class="suit-ic" src="${SUIT_IMG[card.suit]}"></div>`;
    const lx=cw/2-40-totalSpan/2+stride*i;
    cd.style.left=lx+'px';
    cd.style.top=(i%2===0?0:4)+'px';
    cd.style.zIndex=i+1;
    container.appendChild(cd);
    requestAnimationFrame(()=>requestAnimationFrame(()=>cd.classList.add('show')));
  });
}

/* ── BADGE ── */
function setBadge(el,cards,vis){
  if(!vis){el.classList.add('hidden');return;}
  const v=hv(cards);
  const side=el.classList.contains('left')?'left':'right';
  el.className='badge '+side;
  if(v>21){el.textContent=v;el.classList.add('bust');}
  else if(isBJ(cards)){el.textContent='BJ';el.classList.add('bj');}
  else{el.textContent=v;}
}

/* ── PARTICLES ── */
const pCanvas=$('particleCanvas');
const pCtx=pCanvas.getContext('2d');
pCanvas.width=390;pCanvas.height=844;
let particles=[],pRaf=null;
function spawnParticles(cls){
  const cols={win:['#ffd76b','#ffe89a','#fff3c4','#f0c040'],bj:['#ffe07a','#ffd040','#fff3c4','#fff','#ffb800'],lose:['#ff7b6b','#ff5555','#ff9988'],bust:['#ff5c4a','#ff3322','#ff8877'],push:['#b0bdb8','#d0d8d4'],ins:['#6be0ff','#33ccff']};
  const pal=cols[cls]||cols.win;
  particles=[];
  const cnt=cls==='bj'?60:cls==='win'?45:18;
  for(let i=0;i<cnt;i++){
    const ang=Math.random()*Math.PI*2,spd=cls==='bj'?(4+Math.random()*8):(3+Math.random()*6);
    particles.push({x:195,y:422,vx:Math.cos(ang)*spd,vy:Math.sin(ang)*spd-(cls==='bj'?4:2),r:3+Math.random()*5,col:pal[0|Math.random()*pal.length],alpha:1,rot:Math.random()*360,rotV:(Math.random()-.5)*12,shape:Math.random()>.5?'circle':'rect'});
  }
  if(pRaf)cancelAnimationFrame(pRaf);animP();
}
function animP(){
  pCtx.clearRect(0,0,390,844);let alive=false;
  for(const p of particles){
    p.x+=p.vx;p.y+=p.vy;p.vy+=.18;p.vx*=.97;p.rot+=p.rotV;p.alpha-=.018;
    if(p.alpha<=0)continue;alive=true;
    pCtx.save();pCtx.globalAlpha=p.alpha;pCtx.fillStyle=p.col;
    pCtx.translate(p.x,p.y);pCtx.rotate(p.rot*Math.PI/180);
    if(p.shape==='rect')pCtx.fillRect(-p.r/2,-p.r*1.5,p.r,p.r*3);
    else{pCtx.beginPath();pCtx.arc(0,0,p.r,0,Math.PI*2);pCtx.fill();}
    pCtx.restore();
  }
  if(alive)pRaf=requestAnimationFrame(animP);else pCtx.clearRect(0,0,390,844);
}

/* ── RESULT ── */
const R_KEYS={win:'win',bj:'blackjack',lose:'lose',bust:'bust',push:'push',ins:'insuranceWins'};
function showMsg(txt,cls){
  let key=cls;
  if(cls==='win'&&txt==='Blackjack!')key='bj';
  if(cls==='lose'&&txt.includes('Bust'))key='bust';
  const ov=$('resultOverlay');
  ov.className='result-overlay '+key;
  $('resultWord').textContent=t(R_KEYS[key]||key);
  $('resultLabel').textContent='';
  requestAnimationFrame(()=>ov.classList.add('show'));
  if(key==='win'||key==='bj')spawnParticles(key);
  highlightDealerHand(key);
}

/* ── HIGHLIGHT DEALER HAND ON RESULT ── */
function highlightDealerHand(key){
  const dz=$('dealerZone');
  if(!dz)return;
  dz.className='hand-zone hz-reveal rv-'+key;
}
function clearDealerHighlight(){
  const dz=$('dealerZone');
  if(dz)dz.className='hand-zone';
}

/* ── SPLIT HAND RESULT LABELS ── */
function showSplitResult(idx, sk, outcome){
  const el=$('sr'+idx);
  const map={win:'win',bj:'bj',lose:'lose',bust:'lose',push:'push'};
  const cls=map[sk]||'push';
  const words={win:'Win',bj:'Blackjack!',lose:'Lose',bust:'Bust',push:'Push'};
  el.textContent=words[sk]||outcome;
  el.className='split-result-label '+cls;
  requestAnimationFrame(()=>el.classList.add('show'));
  const col=$('sc'+idx);
  if(col)col.className='split-col sc-reveal rv-'+cls;
}
function clearSplitResults(){
  ['sr0','sr1'].forEach(id=>{
    const e=$(id);
    if(!e)return;
    e.className='split-result-label hidden';
    e.textContent='';
  });
  ['sc0','sc1'].forEach(id=>{
    const e=$(id);
    if(e)e.className='split-col';
  });
}

/* ── RULES MODAL ── */
$('rulesBtn').addEventListener('click',()=>$('rulesModal').classList.add('show'));
$('rulesClose').addEventListener('click',()=>$('rulesModal').classList.remove('show'));
function clearMsg(){
  $('resultOverlay').classList.remove('show');
  clearDealerHighlight();
  setTimeout(()=>{particles=[];if(pRaf){cancelAnimationFrame(pRaf);pRaf=null;}pCtx.clearRect(0,0,390,844);},300);
}

/* ── UI ── */
/* ── TOAST ── */
let toastTimer=null;
function showToast(msg){
  const toastEl=$('toast');toastEl.textContent=msg;toastEl.classList.add('show');
  if(toastTimer)clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toastEl.classList.remove('show'),1400);
}

$('addBtn').addEventListener('click',()=>{bankroll+=500;updateUI();$('lobbyBal').textContent=fmt(bankroll);});

/* ── STATS OVERLAY ── */
function openStats(){updateStatsUI();$('statsOverlay').classList.add('show');}
$('statsToggle').addEventListener('click',openStats);
$('lobbyStatsBtn').addEventListener('click',openStats);
$('statsBack').addEventListener('click',()=>$('statsOverlay').classList.remove('show'));
$('statsResetBtn').addEventListener('click',()=>{
  if(confirm('Reset all session stats?')){
    stats={hands:0,won:0,lost:0,push:0,bj:0,bust:0,curStreak:0,bestStreak:0};
    updateStatsUI();
  }
});

/* ── STORE OVERLAY ── */
$('storeBtn').addEventListener('click',()=>$('storeOverlay').classList.add('show'));
$('storeBack').addEventListener('click',()=>$('storeOverlay').classList.remove('show'));
document.querySelectorAll('.iap-buy,.sf-price,.iap-restore').forEach(btn=>{
  btn.addEventListener('click',()=>showToast('This is a demo — no real purchase made'));
});

/* ── RULES MODAL ── */
$('rulesBtn').addEventListener('click',()=>$('rulesModal').classList.add('show'));
$('rulesClose').addEventListener('click',()=>$('rulesModal').classList.remove('show'));

function updateStatsUI(){
  $('sHands').textContent=stats.hands;$('sWon').textContent=stats.won;$('sLost').textContent=stats.lost;$('sPush').textContent=stats.push;
  $('sBJ').textContent=stats.bj;$('sBust').textContent=stats.bust;
  $('sRate').textContent=stats.hands>0?(Math.round(stats.won/stats.hands*100)+'%'):'—';
  const pnl=bankroll-startBR,pe=$('sPnl');
  pe.textContent=(pnl>=0?'+':'')+fmt(pnl);pe.className='sv '+(pnl>0?'g':pnl<0?'r':'');
  $('sStreak').textContent=stats.bestStreak;
}
function recordResult(r){
  stats.hands++;
  if(r==='win'||r==='bj'){stats.won++;if(r==='bj')stats.bj++;stats.curStreak++;stats.bestStreak=Math.max(stats.bestStreak,stats.curStreak);}
  else if(r==='lose'||r==='bust'){stats.lost++;if(r==='bust')stats.bust++;stats.curStreak=0;}
  else{stats.push++;stats.curStreak=0;}
  updateStatsUI();
}

/* ── resetTable ── */
function resetTable(){
  dealerCards=[];splitHands=null;activeSplit=-1;insuranceBet=0;
  activeCircles=[];pcHands=[];pcActive=0;
  $('dealerHand').innerHTML="";
  $('sh0').innerHTML="";$('sh1').innerHTML="";
  $('dealerBadge').classList.add('hidden');
  $('splitRow').classList.add('hidden');
  $('playZone').classList.add('hidden');
  $('playZone').innerHTML='';
  $('circleZone').classList.remove('hidden');
  $('sc0').classList.remove('active');$('sc1').classList.remove('active');
  $('insBar').classList.add('hidden');
  clearSplitResults();clearMsg();
  $('actionBar').classList.add('hidden');
  $('dealWrap').classList.remove('hidden');
  $('betBar').classList.remove('hidden');
  circles=[{bet:0,denom:0},{bet:0,denom:0},{bet:0,denom:0}];
  renderAllCircles();
  state="betting";updateUI();
}

/* ── DEAL ── */
$('dealBtn').addEventListener('click',startRound);
function startRound(){
  const activeCnt=circles.filter(c=>c.bet>0).length;
  if(activeCnt===0){showToast('Place a bet first');return;}
  const minBet=activeTable.minBet;
  if(circles.every(c=>c.bet<minBet&&c.bet>0)){showToast('Min bet '+fmt(minBet));return;}

  state="dealing";
  $('dealWrap').classList.add('hidden');
  $('betBar').classList.add('hidden');
  $('circleZone').classList.add('hidden');
  clearMsg();

  // save bets for repeat
  lastBets=circles.map(c=>({...c}));

  // build play zone columns
  buildPlayZone();
  $('playZone').classList.remove('hidden');

  // deal cards to each active hand
  dealerCards=[draw(),draw()];
  SFX.deal();
  pcHands.forEach((h,i)=>{
    h.cards=[draw(),draw()];
    layoutHand($('pch'+i),h.cards,false);
    $('pct'+i).textContent=hv(h.cards);
  });
  layoutHand($('dealerHand'),dealerCards,true);
  setBadge($('dealerBadge'),[dealerCards[0]],true);
  updateUI();

  setTimeout(()=>{
    const upcardVal=cv(dealerCards[0]);
    if(dealerCards[0].rank==="A"&&activeCnt===1){
      offerInsurance();
    } else if(upcardVal===10&&isBJ(dealerCards)){
      finishRound();
    } else if(activeCnt===1&&isBJ(pcHands[0].cards)){
      finishRound();
    } else {
      // skip BJ hands at start in multi-hand
      if(activeCnt>1){
        pcHands.forEach((h,i)=>{
          if(isBJ(h.cards)){h.done=true;$('pc'+i).className='play-col pc-done';}
        });
      }
      // find first non-done hand
      let first=pcHands.findIndex(h=>!h.done);
      if(first<0){dealerTurn();}
      else{pcSetActive(first);state="player";$('actionBar').classList.remove('hidden');updateActions();}
    }
  },700);
}

/* ── INSURANCE ── */
function offerInsurance(){
  const handBet=pcHands[0]?pcHands[0].bet:0;
  const cost=Math.floor(handBet/2);
  if(bankroll<cost||cost===0){proceedAfterIns();return;}
  $('insCost').textContent=fmt(cost);
  $('insLine1').textContent=t('insLine1');
  $('insLine2').textContent=t('insLine2');
  $('insYes').textContent=t('yes');
  $('insNo').textContent=t('no');
  $('insBar').classList.remove('hidden');
  $('betBar').classList.add('hidden');
  $('dealWrap').classList.add('hidden');
}
$('insYes').addEventListener('click',()=>{
  const handBet=pcHands[0]?pcHands[0].bet:0;
  const cost=Math.floor(handBet/2);
  insuranceBet=cost;bankroll-=cost;SFX.chip();
  $('insBar').classList.add('hidden');
  updateUI();proceedAfterIns();
});
$('insNo').addEventListener('click',()=>{
  $('insBar').classList.add('hidden');
  proceedAfterIns();
});
function proceedAfterIns(){
  const cards=pcHands[0]?pcHands[0].cards:[];
  if(isBJ(cards))finishRound();
  else{state="player";$('actionBar').classList.remove('hidden');updateActions();}
}

/* ══════════════════════════════════════════
   CIRCLE BETTING SYSTEM
══════════════════════════════════════════ */

/* circle state: 3 spots, each can have a bet */
let circles=[{bet:0,denom:0},{bet:0,denom:0},{bet:0,denom:0}];
let lastBets=null;       // [{bet,denom}] — remembered from last round
let activeCircles=[];    // indices of circles with bets, in play order
let pcActive=0;          // which activeCircle index is currently playing
let pcHands=[];          // [{cards,bet,done,result,cls,sk}] — parallel to activeCircles

/* chip colours for stack visual */
const CHIP_COLS={5:'#2f8a3d',25:'#1d4fa0',100:'#111',500:'#a8521a'};

/* ── render a circle in betting phase ── */
function renderCircle(idx){
  const c=circles[idx];
  const inner=$('bci'+idx);
  const amtEl=$('bca'+idx);
  const circ=$('bc'+idx);
  if(!c.bet){
    inner.innerHTML='<span class="bc-hint">drag</span>';
    amtEl.classList.add('hidden');
    circ.classList.remove('has-bet');
  } else {
    // draw stacked chips
    const layers=Math.min(5,Math.ceil(c.bet/c.denom));
    let html='<div class="bc-stack">';
    for(let i=layers-1;i>=0;i--){
      const col=CHIP_COLS[c.denom]||'#555';
      html+=`<div class="bc-chip" style="background:${col};bottom:${i*6}px;"></div>`;
    }
    html+='</div>';
    inner.innerHTML=html;
    amtEl.textContent=fmt(c.bet);
    amtEl.classList.remove('hidden');
    circ.classList.add('has-bet');
  }
}
function renderAllCircles(){
  for(let i=0;i<3;i++)renderCircle(i);
  updateUI();
  // show repeat button if all circles empty and we have lastBets
  const anyBet=circles.some(c=>c.bet>0);
  if(!anyBet&&lastBets){
    $('repeatBtn').classList.remove('hidden');
  } else {
    $('repeatBtn').classList.add('hidden');
  }
}

/* ── tap circle to remove bet ── */
for(let i=0;i<3;i++){
  $('bc'+i).addEventListener('click',()=>{
    if(state!=='betting')return;
    if(!circles[i].bet)return;
    bankroll+=circles[i].bet;
    circles[i]={bet:0,denom:0};
    renderAllCircles();
  });
}

/* ── repeat last bet ── */
$('repeatBtn').addEventListener('click',()=>{
  if(!lastBets||state!=='betting')return;
  // validate bankroll covers total
  const total=lastBets.reduce((s,b)=>s+b.bet,0);
  if(total>bankroll){showToast(t('notEnoughFunds'));return;}
  bankroll-=total;
  circles=lastBets.map(b=>({...b}));
  renderAllCircles();
});

/* ── DRAG & DROP ── */
let ghost=null,dragDenom=0;

function chipColor(v){
  const map={'5':'#2f8a3d','25':'#1d4fa0','100':'#111','500':'#a8521a'};
  return map[v]||'#555';
}

function createGhost(v,x,y){
  ghost=document.createElement('div');
  ghost.className='drag-ghost';
  ghost.style.background=`radial-gradient(circle at 34% 28%,${lighten(chipColor(v))},${chipColor(v)})`;
  ghost.textContent='$'+v;
  ghost.style.left=x+'px';ghost.style.top=y+'px';
  document.body.appendChild(ghost);
}
function lighten(hex){
  // simple lighten by mixing white
  return hex; // keep it simple
}
function moveGhost(x,y){
  if(!ghost)return;
  ghost.style.left=x+'px';ghost.style.top=y+'px';
}
function circleUnder(x,y){
  // find which circle element is under the touch point
  for(let i=0;i<3;i++){
    const el=$('bc'+i);
    const r=el.getBoundingClientRect();
    // account for scaler transform
    if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return i;
  }
  return -1;
}
function setDragOver(idx){
  for(let i=0;i<3;i++){
    const el=$('bc'+i);
    if(i===idx)el.classList.add('drag-over');
    else el.classList.remove('drag-over');
  }
}

$('chipTray').addEventListener('touchstart',e=>{
  if(state!=='betting')return;
  const btn=e.target.closest('button');
  if(!btn)return;
  e.preventDefault();
  dragDenom=+btn.dataset.v;
  const touch=e.touches[0];
  createGhost(dragDenom,touch.clientX,touch.clientY);

  function onMove(ev){
    ev.preventDefault();
    const t=ev.touches[0];
    moveGhost(t.clientX,t.clientY);
    const idx=circleUnder(t.clientX,t.clientY);
    ghost&&(idx>=0?ghost.classList.add('over'):ghost.classList.remove('over'));
    setDragOver(idx);
  }
  function onEnd(ev){
    document.removeEventListener('touchmove',onMove);
    const t=ev.changedTouches[0];
    const idx=circleUnder(t.clientX,t.clientY);
    setDragOver(-1);
    if(ghost){ghost.remove();ghost=null;}
    if(idx>=0)dropOnCircle(idx,dragDenom);
  }
  document.addEventListener('touchmove',onMove,{passive:false});
  document.addEventListener('touchend',onEnd,{once:true});
},{passive:false});

/* mouse drag support (desktop) */
$('chipTray').addEventListener('mousedown',e=>{
  if(state!=='betting')return;
  const btn=e.target.closest('button');
  if(!btn)return;
  e.preventDefault();
  dragDenom=+btn.dataset.v;
  createGhost(dragDenom,e.clientX,e.clientY);
  function onMove(ev){
    moveGhost(ev.clientX,ev.clientY);
    const idx=circleUnder(ev.clientX,ev.clientY);
    ghost&&(idx>=0?ghost.classList.add('over'):ghost.classList.remove('over'));
    setDragOver(idx);
  }
  function onUp(ev){
    document.removeEventListener('mousemove',onMove);
    document.removeEventListener('mouseup',onUp);
    const idx=circleUnder(ev.clientX,ev.clientY);
    setDragOver(-1);
    if(ghost){ghost.remove();ghost=null;}
    if(idx>=0)dropOnCircle(idx,dragDenom);
  }
  document.addEventListener('mousemove',onMove);
  document.addEventListener('mouseup',onUp,{once:true});
});

function dropOnCircle(idx,denom){
  const maxBet=activeTable.maxBet;
  if(!circles[idx].bet){
    // first drop — activate circle
    if(denom>bankroll){showToast(t('notEnoughFunds'));return;}
    if(denom>maxBet){showToast(t('maxBetMsg')+' '+fmt(maxBet));return;}
    bankroll-=denom;
    circles[idx]={bet:denom,denom};
  } else {
    // circle already active — increase by same denomination
    if(circles[idx].bet+circles[idx].denom>maxBet){showToast(t('maxBetMsg')+' '+fmt(maxBet));return;}
    if(circles[idx].denom>bankroll){showToast(t('notEnoughFunds'));return;}
    bankroll-=circles[idx].denom;
    circles[idx].bet+=circles[idx].denom;
  }
  SFX.chip();
  renderAllCircles();
}

/* ── updateUI ── */
function updateUI(){
  $('balAmt').textContent=fmt(bankroll);
  const totalBet=circles.reduce((s,c)=>s+c.bet,0);
  const activeCnt=circles.filter(c=>c.bet>0).length;
  if(totalBet>0){
    $('betLabel').textContent=activeCnt>1
      ? `${activeCnt} hands · Total ${fmt(totalBet)}`
      : t('betPrefix')+' '+fmt(totalBet);
  } else {
    $('betLabel').textContent=t('placeYourBet')||'Drag chips to table';
  }
  $('dealBtn').textContent=t('deal');
  $('dealBtn').disabled=totalBet===0||state!=='betting';
}

/* ── BUILD PLAY ZONE ── */
function buildPlayZone(){
  activeCircles=circles.map((c,i)=>c.bet>0?i:-1).filter(i=>i>=0);
  const n=activeCircles.length;
  pcHands=activeCircles.map(i=>({cards:[],bet:circles[i].bet,done:false,result:'',cls:'',sk:'',split:null,activeSub:0}));
  pcActive=0;

  const pz=$('playZone');
  pz.innerHTML='';
  pz.dataset.hands=n;
  activeCircles.forEach((ci,pi)=>{
    const col=document.createElement('div');
    col.id='pc'+pi;
    col.className='play-col '+(pi===0?'pc-active':'pc-waiting');

    const mainWrap=document.createElement('div');
    mainWrap.id='pcmain'+pi;mainWrap.className='pc-main-wrap';
    const res=document.createElement('div');
    res.id='pcr'+pi;res.className='pc-res';
    const hand=document.createElement('div');
    hand.id='pch'+pi;hand.className='pc-hand';
    const tot=document.createElement('div');
    tot.id='pct'+pi;tot.className='pc-total';tot.textContent='0';
    mainWrap.appendChild(res);mainWrap.appendChild(hand);mainWrap.appendChild(tot);

    const splitWrap=document.createElement('div');
    splitWrap.id='pcsplitwrap'+pi;splitWrap.className='pc-split-wrap hidden';
    for(let s=0;s<2;s++){
      const sub=document.createElement('div');
      sub.id='pcsub'+pi+'-'+s;sub.className='pc-sub';
      const sres=document.createElement('div');
      sres.id='pcr'+pi+'s'+s;sres.className='pc-res';
      const shand=document.createElement('div');
      shand.id='pch'+pi+'s'+s;shand.className='pc-hand pc-hand-sub';
      const stot=document.createElement('div');
      stot.id='pct'+pi+'s'+s;stot.className='pc-total';stot.textContent='0';
      sub.appendChild(sres);sub.appendChild(shand);sub.appendChild(stot);
      splitWrap.appendChild(sub);
    }

    const betTag=document.createElement('div');
    betTag.className='pc-bet-tag';betTag.textContent=fmt(circles[ci].bet);

    col.appendChild(mainWrap);col.appendChild(splitWrap);col.appendChild(betTag);
    pz.appendChild(col);
  });
}

function pcSetActive(idx){
  pcActive=idx;
  for(let i=0;i<activeCircles.length;i++){
    const col=$('pc'+i);
    if(col)col.className='play-col '+(i===idx?'pc-active':pcHands[i].done?'pc-done':'pc-waiting');
  }
  highlightActiveSubUI(idx);
}

/* highlight which sub-hand (of a split circle) is currently being played */
function highlightActiveSubUI(pi){
  const hand=pcHands[pi];
  if(!hand||!hand.split)return;
  for(let s=0;s<2;s++){
    const row=$('pcsub'+pi+'-'+s);
    if(row)row.classList.toggle('pc-sub-active',pi===pcActive&&hand.activeSub===s&&!hand.split[s].done);
  }
}

/* renders both sub-hands after a split and swaps main->split view */
function renderPcSplit(pi){
  $('pcmain'+pi).classList.add('hidden');
  $('pcsplitwrap'+pi).classList.remove('hidden');
  const hand=pcHands[pi];
  for(let s=0;s<2;s++){
    const sub=hand.split[s];
    layoutHandSized($('pch'+pi+'s'+s),sub.cards,false,'xs');
    const v=hv(sub.cards);
    $('pct'+pi+'s'+s).textContent=v;
    $('pct'+pi+'s'+s).className='pc-total'+(v>21?' bust':'');
  }
  highlightActiveSubUI(pi);
}

/* current hand-in-play reference (main hand, or active sub-hand if split) */
function curPcHandRef(){
  const hand=pcHands[pcActive];
  return hand.split?hand.split[hand.activeSub]:hand;
}

function pcNext(){
  const hand=pcHands[pcActive];
  if(hand.split){
    hand.split[hand.activeSub].done=true;
    if(hand.activeSub===0&&!hand.split[1].done){
      hand.activeSub=1;
      highlightActiveSubUI(pcActive);
      updateActions();
      return;
    }
  }
  hand.done=true;
  $('pc'+pcActive).className='play-col pc-done';
  let next=-1;
  for(let i=pcActive+1;i<activeCircles.length;i++){
    if(!pcHands[i].done){next=i;break;}
  }
  if(next>=0){pcSetActive(next);updateActions();}
  else dealerTurn();
}

/* ── updateActions ── */
function updateActions(){
  const isMH=activeCircles.length>1;
  if(isMH){
    const hand=pcHands[pcActive];
    const cur=curPcHandRef();
    const isFirst=cur.cards.length===2;
    $('doubleBtn').disabled=bankroll<cur.bet||!isFirst;
    $('surrenderBtn').disabled=!isFirst||!!hand.split;
    $('splitBtn').disabled=!isFirst||!!hand.split||!canSplit(cur.cards)||bankroll<cur.bet;
    $('hitBtn').disabled=false;$('standBtn').disabled=false;
    return;
  }
  // single hand
  const cards=activeSplit>=0?splitHands[activeSplit].cards:pcHands[0]?.cards||[];
  const first=cards.length===2&&activeSplit<0;
  $('doubleBtn').disabled=bankroll<(pcHands[0]?.bet||0)||cards.length!==2;
  $('surrenderBtn').disabled=!first;
  $('splitBtn').disabled=!first||!canSplit(cards)||bankroll<(pcHands[0]?.bet||0);
}

$('hitBtn').addEventListener('click',doHit);
$('standBtn').addEventListener('click',doStand);
$('doubleBtn').addEventListener('click',doDouble);
$('surrenderBtn').addEventListener('click',doSurrender);
$('splitBtn').addEventListener('click',doSplit);

function doHit(){
  if(state!=='player')return;SFX.card();
  if(activeCircles.length>1){
    const hand=pcHands[pcActive];
    const cur=curPcHandRef();
    cur.cards.push(draw());
    const v=hv(cur.cards);
    if(hand.split){
      const s=hand.activeSub;
      layoutHandSized($('pch'+pcActive+'s'+s),cur.cards,false,'xs');
      $('pct'+pcActive+'s'+s).textContent=v;
      $('pct'+pcActive+'s'+s).className='pc-total'+(v>21?' bust':'');
    } else {
      layoutHand($('pch'+pcActive),cur.cards,false);
      $('pct'+pcActive).textContent=v;
      $('pct'+pcActive).className='pc-total'+(v>21?' bust':'');
    }
    $('doubleBtn').disabled=true;$('surrenderBtn').disabled=true;$('splitBtn').disabled=true;
    if(v>21)pcNext();
    return;
  }
  // single hand
  if(activeSplit>=0){
    splitHands[activeSplit].cards.push(draw());renderSplit();
    if(hv(splitHands[activeSplit].cards)>21)nextSplitOrDealer();
    else{$('doubleBtn').disabled=true;$('surrenderBtn').disabled=true;$('splitBtn').disabled=true;}
  } else {
    pcHands[0].cards.push(draw());
    const _h0=$('pch0');if(_h0)layoutHand(_h0,pcHands[0].cards,false);
    const v=hv(pcHands[0].cards);
    const _t0=$('pct0');if(_t0){_t0.textContent=v;_t0.className='pc-total'+(v>21?' bust':'');}
    $('doubleBtn').disabled=true;$('surrenderBtn').disabled=true;$('splitBtn').disabled=true;
    if(v>21)finishRound();
  }
}
function doStand(){
  if(state!=='player')return;
  if(activeCircles.length>1){pcNext();return;}
  activeSplit>=0?nextSplitOrDealer():dealerTurn();
}
function doDouble(){
  if(state!=='player'||$('doubleBtn').disabled)return;SFX.chip();
  if(activeCircles.length>1){
    const hand=pcHands[pcActive];
    const cur=curPcHandRef();
    bankroll-=cur.bet;cur.bet*=2;
    cur.cards.push(draw());SFX.card();
    if(hand.split){
      const s=hand.activeSub;
      layoutHandSized($('pch'+pcActive+'s'+s),cur.cards,false,'xs');
      const v=hv(cur.cards);
      $('pct'+pcActive+'s'+s).textContent=v;
      $('pct'+pcActive+'s'+s).className='pc-total'+(v>21?' bust':'');
    } else {
      layoutHand($('pch'+pcActive),cur.cards,false);
      const v=hv(cur.cards);
      $('pct'+pcActive).textContent=v;
      $('pct'+pcActive).className='pc-total'+(v>21?' bust':'');
    }
    updateUI();pcNext();return;
  }
  if(activeSplit>=0){
    const h=splitHands[activeSplit];bankroll-=h.bet;h.bet*=2;h.cards.push(draw());SFX.card();renderSplit();nextSplitOrDealer();
  } else {
    const h=pcHands[0];bankroll-=h.bet;h.bet*=2;h.cards.push(draw());SFX.card();
    const _ph0=$('pch0');if(_ph0)layoutHand(_ph0,h.cards,false);
    const v=hv(h.cards);
    const _t0=$('pct0');if(_t0){_t0.textContent=v;_t0.className='pc-total'+(v>21?' bust':'');}
    updateUI();
    if(v>21)finishRound();else dealerTurn();
  }
}
function doSurrender(){
  if(state!=='player'||$('surrenderBtn').disabled)return;
  if(activeCircles.length>1){
    const h=pcHands[pcActive];bankroll+=Math.floor(h.bet/2);
    h.result='Surrender';h.cls='push';h.sk='push';recordResult('push');SFX.push();updateUI();
    const re=$('pcr'+pcActive);
    if(re){re.textContent='Surrender';re.className='pc-res push show';}
    pcNext();return;
  }
  const h=pcHands[0];bankroll+=Math.floor(h.bet/2);state='done';
  revealDealer();SFX.push();showMsg('Surrendered','push');recordResult('push');endCleanup();
}
function doSplit(){
  if(state!=='player'||$('splitBtn').disabled)return;SFX.chip();
  if(activeCircles.length>1){
    const hand=pcHands[pcActive];
    bankroll-=hand.bet;
    hand.split=[
      {cards:[hand.cards[0],draw()],bet:hand.bet,done:false},
      {cards:[hand.cards[1],draw()],bet:hand.bet,done:false}
    ];
    hand.activeSub=0;
    SFX.card();setTimeout(SFX.card,150);
    renderPcSplit(pcActive);
    updateUI();updateActions();
    return;
  }
  const hand=pcHands[0];
  bankroll-=hand.bet;
  splitHands=[{cards:[hand.cards[0],draw()],bet:hand.bet},{cards:[hand.cards[1],draw()],bet:hand.bet}];
  SFX.card();setTimeout(SFX.card,150);activeSplit=0;
  // show split UI inside play column 0
  $('playZone').classList.add('hidden');
  $('splitRow').classList.remove('hidden');
  $('sc0').classList.add('active');renderSplit();
  $('splitBtn').disabled=true;$('surrenderBtn').disabled=true;updateUI();
}
function renderSplit(){
  for(let i=0;i<2;i++){
    layoutHand($('sh'+i),splitHands[i].cards,false);
    const v=hv(splitHands[i].cards);
    $('st'+i).textContent=v;
    $('st'+i).className='split-total'+(v>21?' bust':isBJ(splitHands[i].cards)?' bj':'');
  }
}
function nextSplitOrDealer(){
  $('sc'+activeSplit).classList.remove('active');
  if(activeSplit===0){activeSplit=1;$('sc1').classList.add('active');updateActions();}
  else{activeSplit=-1;dealerTurn();}
}

/* ── layout card with optional size class ── */
function layoutHandSized(container,cards,fdLast,sizeClass){
  container.innerHTML='';
  const n=cards.length;
  const W=sizeClass==='xs'?52:sizeClass==='sm'?66:82;
  const stride=Math.min(24,160/Math.max(n,1));
  const totalSpan=stride*(n-1);
  const cw=container.offsetWidth||180;
  cards.forEach((card,i)=>{
    const fd=fdLast&&i===n-1;
    const cd=document.createElement('div');
    cd.className='card '+(fd?'back':card.col)+(sizeClass?' card-'+sizeClass:'');
    if(!fd)cd.innerHTML=`<div class="corner">${card.rank}<br><img class="suit-ic" src="${SUIT_IMG[card.suit]}"></div><img class="pip" src="${SUIT_IMG[card.suit]}"><div class="corner bot">${card.rank}<br><img class="suit-ic" src="${SUIT_IMG[card.suit]}"></div>`;
    const lx=cw/2-W/2-totalSpan/2+stride*i;
    cd.style.left=lx+'px';
    cd.style.top=(i%2===0?0:4)+'px';
    cd.style.zIndex=i+1;
    container.appendChild(cd);
    requestAnimationFrame(()=>requestAnimationFrame(()=>cd.classList.add('show')));
  });
}



/* ── DEALER ── */
function dealerTurn(){
  state="dealer";$('actionBar').classList.add('hidden');revealDealer();
  const step=()=>{setBadge($('dealerBadge'),dealerCards,true);if(hv(dealerCards)<17){setTimeout(()=>{dealerCards.push(draw());SFX.card();layoutHand($('dealerHand'),dealerCards,false);setTimeout(step,480);},480);}else setTimeout(finishRound,380);};
  step();
}
function revealDealer(){layoutHand($('dealerHand'),dealerCards,false);setBadge($('dealerBadge'),dealerCards,true);}

/* ── RESOLVE ── */
function resolveHand(pCards,bet,silent,fromSplit){
  const pv=hv(pCards),dv=hv(dealerCards);
  // Split hands: 2-card 21 is NOT blackjack — pays 1:1 (standard casino rule)
  const pBJ=fromSplit ? false : isBJ(pCards);
  const dBJ=isBJ(dealerCards);
  let outcome,cls,sk;
  if(pv>21)        {outcome="Bust";            cls="lose";sk="bust";}
  else if(pBJ&&dBJ){outcome="Push";            cls="push";bankroll+=bet;sk="push";}
  else if(pBJ)     {outcome="Blackjack!";      cls="win"; bankroll+=Math.floor(bet*2.5);sk="bj";}
  else if(dBJ)     {outcome="Dealer Blackjack";cls="lose";sk="lose";}
  else if(dv>21)   {outcome="Dealer Busts!";   cls="win"; bankroll+=bet*2;sk="win";}
  else if(pv>dv)   {outcome="You Win";         cls="win"; bankroll+=bet*2;sk="win";}
  else if(pv<dv)   {outcome="You Lose";        cls="lose";sk="lose";}
  else             {outcome="Push";            cls="push";bankroll+=bet;sk="push";}
  if(!silent){showMsg(outcome,cls);if(sk==='bj')SFX.bj();else if(sk==='bust')SFX.bust();else if(cls==='win')SFX.win();else if(cls==='lose')SFX.lose();else SFX.push();}
  recordResult(sk);return{outcome,cls,sk};
}
function finishRound(){
  if(state==="done")return;
  state="done";
  revealDealer();

  const dv=hv(dealerCards),dBJ=isBJ(dealerCards);

  /* insurance payout */
  if(insuranceBet>0&&dBJ){bankroll+=insuranceBet*3;SFX.ins();}

  /* ── SPLIT resolution (single circle that was split) ── */
  if(splitHands){
    const results=[];
    for(let i=0;i<2;i++){
      const r=resolveHand(splitHands[i].cards,splitHands[i].bet,true,true);
      results.push(r);
    }
    updateUI();

    function revealSplitNext(idx){
      if(idx>=results.length){
        for(let i=0;i<2;i++){
          const col=$('sc'+i);
          if(col)col.className='split-col sc-done';
        }
        const sks=results.map(r=>r.sk);
        const wins=sks.filter(s=>s==='win'||s==='bj').length;
        const pushes=sks.filter(s=>s==='push').length;
        setTimeout(()=>{
          if(wins>0){SFX.win();showMsg('win','win');}
          else if(pushes===sks.length){SFX.push();showMsg('push','push');}
          else{SFX.lose();showMsg('lose','lose');}
          endCleanup();
        },300);
        return;
      }

      const r=results[idx];
      showSplitResult(idx,r.sk,r.outcome); // zooms+labels this hand

      /* dim the other hand */
      const otherCol=$('sc'+(1-idx));
      if(otherCol)otherCol.className='split-col sc-dimmed';

      if(r.sk==='bj')SFX.bj();
      else if(r.sk==='bust')SFX.bust();
      else if(r.cls==='win')SFX.win();
      else if(r.cls==='lose')SFX.lose();
      else SFX.push();

      setTimeout(()=>revealSplitNext(idx+1),1500);
    }
    setTimeout(()=>revealSplitNext(0),600);
    return;
  }

  /* ── resolve all circle hands — collect results (split circles yield 2 items) ── */
  const resolved=[];
  pcHands.forEach((hand,pi)=>{
    if(hand.split){
      hand.split.forEach((sub,si)=>{
        const r=resolveHand(sub.cards,sub.bet,true,true);
        resolved.push({pi,si,outcome:r.outcome,cls:r.cls,sk:r.sk});
      });
      return;
    }
    if(hand.result==='Surrender'){resolved.push({pi,si:null,outcome:'Surrender',cls:'push',sk:'push'});return;}
    const pv=hv(hand.cards),pBJ=isBJ(hand.cards);
    let outcome,cls,sk;
    if(pv>21)        {outcome='Bust';        cls='lose';sk='bust';}
    else if(pBJ&&dBJ){outcome='Push';        cls='push';bankroll+=hand.bet;sk='push';}
    else if(pBJ)     {outcome='Blackjack!';  cls='win'; bankroll+=Math.floor(hand.bet*2.5);sk='bj';}
    else if(dBJ)     {outcome='Dealer BJ';   cls='lose';sk='lose';}
    else if(dv>21)   {outcome='Dealer Bust'; cls='win'; bankroll+=hand.bet*2;sk='win';}
    else if(pv>dv)   {outcome='Win';         cls='win'; bankroll+=hand.bet*2;sk='win';}
    else if(pv<dv)   {outcome='Lose';        cls='lose';sk='lose';}
    else             {outcome='Push';        cls='push';bankroll+=hand.bet;sk='push';}
    recordResult(sk);
    resolved.push({pi,si:null,outcome,cls,sk});
  });

  updateUI();

  /* ── one-by-one auto reveal with 1.4s delay per hand ── */
  function revealNext(idx){
    if(idx>=resolved.length){
      // restore all columns to normal
      for(let i=0;i<activeCircles.length;i++){
        const col=$('pc'+i);
        if(col)col.className='play-col pc-done';
        if(pcHands[i].split){
          for(let s=0;s<2;s++){
            const row=$('pcsub'+i+'-'+s);
            if(row)row.classList.remove('pc-sub-dim','pc-sub-active');
          }
        }
      }
      // overall banner
      const wins=resolved.filter(r=>r.sk==='win'||r.sk==='bj').length;
      const allPush=resolved.every(r=>r.sk==='push');
      setTimeout(()=>{
        if(wins>0){SFX.win();showMsg('win','win');}
        else if(allPush){SFX.push();showMsg('push','push');}
        else{SFX.lose();showMsg('lose','lose');}
        endCleanup();
      },300);
      return;
    }

    const r=resolved[idx];
    const rvCls='rv-'+(r.sk==='bj'?'bj':r.cls==='win'?'win':r.cls==='lose'?'lose':'push');

    /* zoom this hand's column, dim all other columns */
    for(let i=0;i<activeCircles.length;i++){
      const col=$('pc'+i);
      if(!col)continue;
      col.className='play-col ';
      if(i===r.pi){
        col.classList.add('pc-reveal',rvCls);
      } else {
        col.classList.add('pc-dimmed');
      }
    }

    /* show result badge (and, if a split sub-hand, dim its sibling) */
    if(r.si===null){
      const re=$('pcr'+r.pi);
      if(re){
        re.textContent=r.outcome;
        re.className='pc-res '+r.cls;
        requestAnimationFrame(()=>re.classList.add('show'));
      }
    } else {
      const re=$('pcr'+r.pi+'s'+r.si);
      if(re){
        re.textContent=r.outcome;
        re.className='pc-res '+r.cls;
        requestAnimationFrame(()=>re.classList.add('show'));
      }
      const sib=$('pcsub'+r.pi+'-'+(1-r.si));
      if(sib)sib.classList.add('pc-sub-dim');
      const cur=$('pcsub'+r.pi+'-'+r.si);
      if(cur)cur.classList.remove('pc-sub-dim');
    }

    /* sound per hand */
    if(r.sk==='bj')SFX.bj();
    else if(r.sk==='bust')SFX.bust();
    else if(r.cls==='win')SFX.win();
    else if(r.cls==='lose')SFX.lose();
    else SFX.push();

    setTimeout(()=>revealNext(idx+1), resolved.length>1?1500:0);
  }

  // small pause after dealer reveal, then start one-by-one
  setTimeout(()=>revealNext(0), 600);
}

function endCleanup(){
  updateUI();
  setTimeout(()=>{state="betting";resetTable();},2400);
}

/* ══════════════════════════════════════════
   LANGUAGE SYSTEM
══════════════════════════════════════════ */
const LANG_META={
  en:{name:'English',   flag:'🇬🇧',dir:'ltr'},
  es:{name:'Español',   flag:'🇪🇸',dir:'ltr'},
  fr:{name:'Français',  flag:'🇫🇷',dir:'ltr'},
  de:{name:'Deutsch',   flag:'🇩🇪',dir:'ltr'},
  ja:{name:'日本語',    flag:'🇯🇵',dir:'ltr'},
  pt:{name:'Português', flag:'🇧🇷',dir:'ltr'},
  zh:{name:'中文',      flag:'🇨🇳',dir:'ltr'},
  hi:{name:'हिन्दी',  flag:'🇮🇳',dir:'ltr'},
  ar:{name:'العربية',  flag:'🇸🇦',dir:'rtl'},
  it:{name:'Italiano',  flag:'🇮🇹',dir:'ltr'},
};

const TRANS={
  en:{
    placeYourBet:'Place your bet',betPrefix:'Bet',deal:'Deal',
    hit:'Hit',stand:'Stand',double:'Double',split:'Split',surrender:'Surrender',
    yes:'Yes',no:'No',
    win:'Win',lose:'Lose',bust:'Bust',push:'Push',
    blackjack:'Blackjack!',insuranceWins:'Insurance Wins!',
    dealerBlackjack:'Dealer Blackjack',dealerBusts:'Dealer Busts!',
    youWin:'You Win',youLose:'You Lose',surrendered:'Surrendered',
    insLine1:'Dealer shows an Ace.',insLine2:'Take Insurance?',
    bjPays:'Blackjack Pays 3 to 2',
    dealerDraw:'Dealer Must Draw to 16 & Stand on 17',
    insPays:'Insurance Pays 2 to 1',
    sessionStats:'Session Stats',handsPlayed:'Hands Played',
    won:'Won',lost:'Lost',pushed:'Pushed',blackjacks:'Blackjacks',
    busts:'Busts',winRate:'Win Rate',netPL:'Net P&L',bestStreak:'Best Streak',
    resetStats:'Reset Stats',
    store:'Store',language:'Language',howToPlay:'How to Play',
    play:'Play',locked:'🔒 Locked',
    notEnoughFunds:'Not enough funds',
    maxBetMsg:'Max bet:',
  },
  es:{
    placeYourBet:'Haz tu apuesta',betPrefix:'Apuesta',deal:'Repartir',
    hit:'Pedir',stand:'Plantarse',double:'Doblar',split:'Dividir',surrender:'Rendirse',
    yes:'Sí',no:'No',
    win:'Ganas',lose:'Pierdes',bust:'Pasado',push:'Empate',
    blackjack:'¡Blackjack!',insuranceWins:'¡Seguro gana!',
    dealerBlackjack:'BJ del Crupier',dealerBusts:'¡Crupier pasado!',
    youWin:'Ganaste',youLose:'Perdiste',surrendered:'Rendido',
    insLine1:'El crupier muestra un As.',insLine2:'¿Tomar Seguro?',
    bjPays:'Blackjack Paga 3 a 2',
    dealerDraw:'El Crupier Pide hasta 16 y se Planta en 17',
    insPays:'Seguro Paga 2 a 1',
    sessionStats:'Estadísticas',handsPlayed:'Manos Jugadas',
    won:'Ganadas',lost:'Perdidas',pushed:'Empates',blackjacks:'Blackjacks',
    busts:'Pasados',winRate:'Tasa de Victoria',netPL:'Ganancia Neta',bestStreak:'Mejor Racha',
    resetStats:'Reiniciar',
    store:'Tienda',language:'Idioma',howToPlay:'Cómo Jugar',
    play:'Jugar',locked:'🔒 Bloqueado',
    notEnoughFunds:'Fondos insuficientes',maxBetMsg:'Apuesta máx:',
  },
  fr:{
    placeYourBet:'Placez votre mise',betPrefix:'Mise',deal:'Distribuer',
    hit:'Tirer',stand:'Rester',double:'Doubler',split:'Séparer',surrender:'Abandonner',
    yes:'Oui',no:'Non',
    win:'Gagné',lose:'Perdu',bust:'Dépassé',push:'Égalité',
    blackjack:'Blackjack !',insuranceWins:'Assurance gagnée !',
    dealerBlackjack:'BJ du Croupier',dealerBusts:'Croupier dépassé !',
    youWin:'Vous Gagnez',youLose:'Vous Perdez',surrendered:'Abandonné',
    insLine1:'Le croupier montre un As.',insLine2:'Prendre une Assurance ?',
    bjPays:'Blackjack Paie 3 à 2',
    dealerDraw:'Le Croupier tire jusqu\'à 16 et reste sur 17',
    insPays:'Assurance Paie 2 à 1',
    sessionStats:'Statistiques',handsPlayed:'Mains Jouées',
    won:'Gagnées',lost:'Perdues',pushed:'Égalités',blackjacks:'Blackjacks',
    busts:'Dépassements',winRate:'Taux de Victoire',netPL:'Gain Net',bestStreak:'Meilleure Série',
    resetStats:'Réinitialiser',
    store:'Boutique',language:'Langue',howToPlay:'Comment Jouer',
    play:'Jouer',locked:'🔒 Verrouillé',
    notEnoughFunds:'Fonds insuffisants',maxBetMsg:'Mise max :',
  },
  de:{
    placeYourBet:'Setzen Sie Ihren Einsatz',betPrefix:'Einsatz',deal:'Ausgeben',
    hit:'Nehmen',stand:'Halten',double:'Verdoppeln',split:'Teilen',surrender:'Aufgeben',
    yes:'Ja',no:'Nein',
    win:'Gewonnen',lose:'Verloren',bust:'Überkauft',push:'Unentschieden',
    blackjack:'Blackjack!',insuranceWins:'Versicherung gewonnen!',
    dealerBlackjack:'Dealer Blackjack',dealerBusts:'Dealer überkauft!',
    youWin:'Sie Gewinnen',youLose:'Sie Verlieren',surrendered:'Aufgegeben',
    insLine1:'Dealer zeigt ein Ass.',insLine2:'Versicherung nehmen?',
    bjPays:'Blackjack zahlt 3 zu 2',
    dealerDraw:'Dealer zieht bis 16 und hält bei 17',
    insPays:'Versicherung zahlt 2 zu 1',
    sessionStats:'Statistiken',handsPlayed:'Gespielte Hände',
    won:'Gewonnen',lost:'Verloren',pushed:'Unentschieden',blackjacks:'Blackjacks',
    busts:'Überkauft',winRate:'Gewinnrate',netPL:'Nettogewinn',bestStreak:'Beste Serie',
    resetStats:'Zurücksetzen',
    store:'Shop',language:'Sprache',howToPlay:'Spielanleitung',
    play:'Spielen',locked:'🔒 Gesperrt',
    notEnoughFunds:'Nicht genug Guthaben',maxBetMsg:'Max. Einsatz:',
  },
  ja:{
    placeYourBet:'ベットしてください',betPrefix:'ベット',deal:'ディール',
    hit:'ヒット',stand:'スタンド',double:'ダブル',split:'スプリット',surrender:'サレンダー',
    yes:'はい',no:'いいえ',
    win:'勝ち',lose:'負け',bust:'バスト',push:'プッシュ',
    blackjack:'ブラックジャック！',insuranceWins:'保険成立！',
    dealerBlackjack:'ディーラーBJ',dealerBusts:'ディーラーバスト！',
    youWin:'勝利',youLose:'敗北',surrendered:'サレンダー',
    insLine1:'ディーラーがエースを表示。',insLine2:'保険をかけますか？',
    bjPays:'BJ 3対2払い',
    dealerDraw:'ディーラーは16以下でヒット・17でスタンド',
    insPays:'保険は2対1払い',
    sessionStats:'統計',handsPlayed:'総ゲーム数',
    won:'勝ち',lost:'負け',pushed:'引き分け',blackjacks:'BJ回数',
    busts:'バスト',winRate:'勝率',netPL:'損益',bestStreak:'最大連勝',
    resetStats:'リセット',
    store:'ストア',language:'言語',howToPlay:'遊び方',
    play:'プレイ',locked:'🔒 ロック中',
    notEnoughFunds:'残高不足',maxBetMsg:'最大ベット:',
  },
  pt:{
    placeYourBet:'Faça sua aposta',betPrefix:'Aposta',deal:'Distribuir',
    hit:'Pedir',stand:'Parar',double:'Dobrar',split:'Dividir',surrender:'Desistir',
    yes:'Sim',no:'Não',
    win:'Ganhou',lose:'Perdeu',bust:'Estourou',push:'Empate',
    blackjack:'Blackjack!',insuranceWins:'Seguro ganhou!',
    dealerBlackjack:'BJ do Dealer',dealerBusts:'Dealer estourou!',
    youWin:'Você Ganhou',youLose:'Você Perdeu',surrendered:'Desistiu',
    insLine1:'Dealer mostra um Ás.',insLine2:'Fazer Seguro?',
    bjPays:'Blackjack Paga 3 a 2',
    dealerDraw:'Dealer Pede até 16 e Para no 17',
    insPays:'Seguro Paga 2 a 1',
    sessionStats:'Estatísticas',handsPlayed:'Mãos Jogadas',
    won:'Ganhas',lost:'Perdidas',pushed:'Empates',blackjacks:'Blackjacks',
    busts:'Estouros',winRate:'Taxa de Vitória',netPL:'Lucro Líquido',bestStreak:'Melhor Sequência',
    resetStats:'Reiniciar',
    store:'Loja',language:'Idioma',howToPlay:'Como Jogar',
    play:'Jogar',locked:'🔒 Bloqueado',
    notEnoughFunds:'Saldo insuficiente',maxBetMsg:'Aposta máx:',
  },
  zh:{
    placeYourBet:'请下注',betPrefix:'下注',deal:'发牌',
    hit:'要牌',stand:'停牌',double:'加倍',split:'分牌',surrender:'投降',
    yes:'是',no:'否',
    win:'赢了',lose:'输了',bust:'爆牌',push:'平局',
    blackjack:'黑杰克！',insuranceWins:'保险获胜！',
    dealerBlackjack:'庄家黑杰克',dealerBusts:'庄家爆牌！',
    youWin:'你赢了',youLose:'你输了',surrendered:'已投降',
    insLine1:'庄家显示A。',insLine2:'购买保险？',
    bjPays:'黑杰克赔率 3 比 2',
    dealerDraw:'庄家16点以下须要牌，17点停牌',
    insPays:'保险赔率 2 比 1',
    sessionStats:'统计数据',handsPlayed:'游戏次数',
    won:'赢',lost:'输',pushed:'平局',blackjacks:'黑杰克',
    busts:'爆牌',winRate:'胜率',netPL:'净盈亏',bestStreak:'最佳连胜',
    resetStats:'重置统计',
    store:'商店',language:'语言',howToPlay:'游戏规则',
    play:'开始',locked:'🔒 已锁定',
    notEnoughFunds:'资金不足',maxBetMsg:'最大下注:',
  },
  hi:{
    placeYourBet:'अपना दांव लगाएं',betPrefix:'दांव',deal:'बांटें',
    hit:'हिट',stand:'स्टैंड',double:'डबल',split:'स्प्लिट',surrender:'हार मानें',
    yes:'हाँ',no:'नहीं',
    win:'जीत',lose:'हार',bust:'बस्ट',push:'बराबरी',
    blackjack:'ब्लैकजैक!',insuranceWins:'बीमा जीता!',
    dealerBlackjack:'डीलर ब्लैकजैक',dealerBusts:'डीलर बस्ट!',
    youWin:'आप जीते',youLose:'आप हारे',surrendered:'हार मान ली',
    insLine1:'डीलर का इक्का दिख रहा है।',insLine2:'बीमा लें?',
    bjPays:'ब्लैकजैक 3 से 2 देता है',
    dealerDraw:'डीलर 16 तक कार्ड लेता है और 17 पर रुकता है',
    insPays:'बीमा 2 से 1 देता है',
    sessionStats:'आँकड़े',handsPlayed:'खेले गए हाथ',
    won:'जीते',lost:'हारे',pushed:'बराबरी',blackjacks:'ब्लैकजैक',
    busts:'बस्ट',winRate:'जीत दर',netPL:'शुद्ध लाभ/हानि',bestStreak:'सर्वश्रेष्ठ क्रम',
    resetStats:'रीसेट करें',
    store:'स्टोर',language:'भाषा',howToPlay:'कैसे खेलें',
    play:'खेलें',locked:'🔒 बंद',
    notEnoughFunds:'पर्याप्त धन नहीं',maxBetMsg:'अधिकतम दांव:',
  },
  ar:{
    placeYourBet:'ضع رهانك',betPrefix:'رهان',deal:'وزّع',
    hit:'اسحب',stand:'قف',double:'ضاعف',split:'قسّم',surrender:'استسلم',
    yes:'نعم',no:'لا',
    win:'فزت',lose:'خسرت',bust:'تجاوزت',push:'تعادل',
    blackjack:'بلاك جاك!',insuranceWins:'فاز التأمين!',
    dealerBlackjack:'بلاك جاك الموزع',dealerBusts:'تجاوز الموزع!',
    youWin:'ربحت',youLose:'خسرت',surrendered:'استسلمت',
    insLine1:'الموزع يظهر الآس.',insLine2:'هل تريد التأمين؟',
    bjPays:'بلاك جاك يدفع 3 إلى 2',
    dealerDraw:'الموزع يسحب حتى 16 ويقف عند 17',
    insPays:'التأمين يدفع 2 إلى 1',
    sessionStats:'الإحصائيات',handsPlayed:'الأيدي المُلعبة',
    won:'فزت',lost:'خسرت',pushed:'تعادل',blackjacks:'بلاك جاك',
    busts:'تجاوز',winRate:'معدل الفوز',netPL:'الربح الصافي',bestStreak:'أفضل سلسلة',
    resetStats:'إعادة تعيين',
    store:'المتجر',language:'اللغة',howToPlay:'كيفية اللعب',
    play:'العب',locked:'🔒 مقفل',
    notEnoughFunds:'رصيد غير كافٍ',maxBetMsg:'الحد الأقصى:',
  },
  it:{
    placeYourBet:'Fai la tua puntata',betPrefix:'Puntata',deal:'Distribuisci',
    hit:'Carta',stand:'Stai',double:'Raddoppia',split:'Dividi',surrender:'Arrenditi',
    yes:'Sì',no:'No',
    win:'Vinci',lose:'Perdi',bust:'Sballato',push:'Pareggio',
    blackjack:'Blackjack!',insuranceWins:'Assicurazione vinta!',
    dealerBlackjack:'BJ del Mazziere',dealerBusts:'Mazziere sballato!',
    youWin:'Hai Vinto',youLose:'Hai Perso',surrendered:'Arreso',
    insLine1:'Il mazziere mostra un Asso.',insLine2:'Prendere Assicurazione?',
    bjPays:'Blackjack Paga 3 a 2',
    dealerDraw:'Il Mazziere pesca fino a 16 e resta su 17',
    insPays:'Assicurazione Paga 2 a 1',
    sessionStats:'Statistiche',handsPlayed:'Mani Giocate',
    won:'Vinte',lost:'Perse',pushed:'Pareggi',blackjacks:'Blackjack',
    busts:'Sballati',winRate:'Tasso di Vittoria',netPL:'Profitto Netto',bestStreak:'Serie Migliore',
    resetStats:'Azzera',
    store:'Negozio',language:'Lingua',howToPlay:'Come Giocare',
    play:'Gioca',locked:'🔒 Bloccato',
    notEnoughFunds:'Fondi insufficienti',maxBetMsg:'Puntata max:',
  },
};

let currentLang='en';
function t(key){return(TRANS[currentLang]&&TRANS[currentLang][key])||TRANS.en[key]||key;}

function applyLang(code){
  currentLang=code;
  const meta=LANG_META[code];
  $('app').dir=meta.dir;

  // Update lang button
  $('langBtn').textContent=code.toUpperCase();
  $('langTitle').textContent=t('language');

  // Action buttons
  $('hitBtn').textContent=t('hit');
  $('standBtn').textContent=t('stand');
  $('doubleBtn').textContent=t('double');
  $('splitBtn').textContent=t('split');
  $('surrenderBtn').textContent=t('surrender');
  $('dealBtn').textContent=t('deal');

  // Stats overlay labels
  $('sStatTitle').textContent=t('sessionStats');
  $('sLabelHands').textContent=t('handsPlayed');
  $('sLabelWon').textContent=t('won');
  $('sLabelLost').textContent=t('lost');
  $('sLabelPush').textContent=t('pushed');
  $('sLabelBJ').textContent=t('blackjacks');
  $('sLabelBust').textContent=t('busts');
  $('sLabelRate').textContent=t('winRate');
  $('sLabelPnl').textContent=t('netPL');
  $('sLabelStreak').textContent=t('bestStreak');
  $('statsResetBtn').textContent=t('resetStats');

  // Store title
  $('storeTitle').textContent=t('store');

  // Watermark rules
  $('wRule1').textContent=t('bjPays');
  $('wRule2').textContent=t('dealerDraw');
  $('wRule3').textContent=t('insPays');

  // Rebuild lang grid to update active state
  buildLangGrid();

  // Refresh dynamic text
  updateUI();
  updateStatsUI();
  if($('lobby').classList.contains('hide')===false) renderLobby();

  $('langOverlay').classList.remove('show');
}

function buildLangGrid(){
  const grid=$('langGrid');
  grid.innerHTML='';
  Object.entries(LANG_META).forEach(([code,meta])=>{
    const card=document.createElement('div');
    card.className='lang-card'+(code===currentLang?' active':'');
    card.innerHTML=`<div class="lang-flag">${meta.flag}</div><div class="lang-info"><div class="lang-name">${meta.name}</div><div class="lang-code">${code.toUpperCase()}</div></div>`;
    card.addEventListener('click',()=>applyLang(code));
    grid.appendChild(card);
  });
}

$('langBtn').addEventListener('click',()=>{buildLangGrid();$('langOverlay').classList.add('show');});
$('langBack').addEventListener('click',()=>$('langOverlay').classList.remove('show'));

/* ══════════════════════════════════════════
   VERSION & PWA
══════════════════════════════════════════ */
const APP_VERSION = '1.0.0';
$('versionBadge').textContent = 'v' + APP_VERSION;

/* ── SERVICE WORKER (activates automatically on HTTPS hosting) ── */
if('serviceWorker' in navigator){
  const swCode = `
const CACHE = 'blackjack-v${APP_VERSION}';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([self.location.href])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if(!res || res.status !== 200) return res;
    caches.open(CACHE).then(c => c.put(e.request, res.clone()));
    return res;
  })));
});
  `;
  try {
    const blob = new Blob([swCode], {type:'application/javascript'});
    const swUrl = URL.createObjectURL(blob);
    navigator.serviceWorker.register(swUrl).catch(() => {
      // Blob SW blocked — fall back to relative path (works on GitHub Pages)
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  } catch(e) {}
}

/* ── PWA INSTALL PROMPT ── */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  $('pwaInstallBtn').classList.add('visible');
});
window.addEventListener('appinstalled', () => {
  $('pwaInstallBtn').classList.remove('visible');
  deferredPrompt = null;
  showToast('App installed! 🎉');
});
$('pwaInstallBtn').addEventListener('click', async () => {
  if(!deferredPrompt){ showToast('Open in browser to install'); return; }
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if(outcome === 'accepted') $('pwaInstallBtn').classList.remove('visible');
  deferredPrompt = null;
});

/* ── LOADING SCREEN: preload real assets, then reveal ── */
(function preloadAssets(){
  const urls=[
    'img/card-back.png','img/foil-pack.png',
    'img/city-lasvegas.png','img/city-paris.png','img/city-singapore.png','img/city-melbourne.png',
    'img/icon-music.png','img/icon-mute.png','img/icon-cart.png','img/icon-chart.png',
    'img/icon-question.png','img/icon-back.png','img/icon-chip-bankroll.png','img/icon-plus.png',
    'img/suit-heart.png','img/suit-club.png','img/suit-diamond.png','img/suit-spade.png'
  ];
  const fill=$('lsFill'),pct=$('lsPct'),screen=$('loadingScreen');
  const total=urls.length;
  let loaded=0;
  function tick(){
    loaded++;
    const p=Math.round(loaded/total*100);
    if(fill)fill.style.width=p+'%';
    if(pct)pct.textContent=p+'%';
    if(loaded>=total){
      setTimeout(()=>{if(screen)screen.classList.add('hide');},250);
    }
  }
  if(total===0){if(screen)screen.classList.add('hide');return;}
  urls.forEach(src=>{
    const img=new Image();
    img.onload=tick;
    img.onerror=tick; // never let a missing/blocked asset hang the app
    img.src=src;
  });
})();

/* ── INIT ── */
if(typeof adConfig==='function'){
  adConfig({
    preloadAdBreaks:'on',
    sound: soundMuted?'off':'on',
  });
}
shoe=buildShoe(4);
renderLobby();
resetTable();
['touchstart','click'].forEach(ev=>document.addEventListener(ev,()=>{try{ac().resume();}catch(e){}},{once:true,passive:true}));
})();