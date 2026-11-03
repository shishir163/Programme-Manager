(function(){
'use strict';
const DB = window.PMDB, STR = window.PM_STR, ADMIN_EMAIL = (window.PM_ADMIN_EMAIL || '').toLowerCase();
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ================= preferences ================= */
const THEMES = [
  {id:'aam', bn:'আম', en:'Mango', c:['#fb923c','#f97316','#e11d48']},
  {id:'krishnachura', bn:'কৃষ্ণচূড়া', en:'Flame', c:['#f43f5e','#dc2626','#f59e0b']},
  {id:'kochipata', bn:'কচিপাতা', en:'Leaf', c:['#84cc16','#16a34a','#eab308']},
  {id:'akash', bn:'আকাশ', en:'Sky', c:['#38bdf8','#2563eb','#f97316']},
  {id:'jam', bn:'জাম', en:'Plum', c:['#a855f7','#7c3aed','#ec4899']},
  {id:'golap', bn:'গোলাপ', en:'Rose', c:['#f472b6','#db2777','#8b5cf6']},
  {id:'somudro', bn:'সমুদ্র', en:'Ocean', c:['#2dd4bf','#0d9488','#f43f5e']},
  {id:'rongdhonu', bn:'রংধনু', en:'Rainbow', c:['#f43f5e','#22c55e','#0ea5e9']},
  {id:'raat', bn:'রাতের নীল', en:'Night blue', c:['#0f2b52','#38bdf8','#f472b6'], dark:true},
  {id:'jonaki', bn:'জোনাকি', en:'Firefly', c:['#1a2a0c','#a3e635','#fde047'], dark:true},
  {id:'amabossha', bn:'অমাবস্যা', en:'New moon', c:['#000000','#a78bfa','#f0abfc'], dark:true},
  {id:'koyla', bn:'কয়লা', en:'Ember', c:['#1d1a17','#fb923c','#facc15'], dark:true}
];
const FONTS_EN = [
  {id:'lato', name:'Lato', css:'"Lato"'}, {id:'roboto', name:'Roboto', css:'"Roboto"'}, {id:'poppins', name:'Poppins', css:'"Poppins"'},
  {id:'arial', name:'Arial', css:'Arial,"Helvetica Neue",Helvetica'}, {id:'times', name:'Times New Roman', css:'"Times New Roman",Times'}
];
const FONTS_BN = [
  {id:'solaiman', name:'SolaimanLipi', css:'"SolaimanLipi"'}, {id:'kalpurush', name:'Kalpurush', css:'"Kalpurush"'},
  {id:'hind', name:'Hind Siliguri', css:'"Hind Siliguri"'}, {id:'noto', name:'Noto Sans Bengali', css:'"Noto Sans Bengali"'},
  {id:'baloo', name:'Baloo Da 2', css:'"Baloo Da 2"'}, {id:'tiro', name:'Tiro Bangla', css:'"Tiro Bangla"'}
];
const PREF_KEY = 'pm-prefs';
let P = {theme:'auto', fontEn:'lato', fontBn:'solaiman', bold:false, size:'m', lang:'bn'};
try { Object.assign(P, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); } catch(e) {}
function savePrefs(){ try { localStorage.setItem(PREF_KEY, JSON.stringify(P)); } catch(e) {} }
const darkMQ = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
function themeId(){ return P.theme === 'auto' ? (darkMQ && darkMQ.matches ? 'raat' : 'aam') : P.theme; }
function applyPrefs(){
  const r = document.documentElement;
  r.dataset.pm = themeId();
  r.lang = P.lang;
  const fe = FONTS_EN.find(f => f.id === P.fontEn) || FONTS_EN[0], fb = FONTS_BN.find(f => f.id === P.fontBn) || FONTS_BN[0];
  r.style.setProperty('--font-en', fe.css); r.style.setProperty('--font-bn', fb.css);
  r.style.setProperty('--fw', P.bold ? '600' : '400'); r.style.setProperty('--fw-strong', P.bold ? '800' : '700');
  r.style.setProperty('--fs', {s:'14px', m:'15.5px', l:'17.5px'}[P.size] || '15.5px');
  const meta = $('meta[name="theme-color"]'); if (meta) meta.content = getComputedStyle(r).getPropertyValue('--brand').trim() || '#f97316';
}
darkMQ && darkMQ.addEventListener && darkMQ.addEventListener('change', () => { if (P.theme === 'auto') { applyPrefs(); } });
const t = (k, ...a) => { const v = (STR[P.lang] || STR.bn)[k]; return typeof v === 'function' ? v(...a) : (v == null ? k : v); };

/* ================= formatting ================= */
const nf = n => new Intl.NumberFormat(P.lang === 'bn' ? 'bn-BD' : 'en-IN', {maximumFractionDigits:2}).format(Number(n) || 0);
const tk = n => '৳' + nf(n);
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
function fd(d){ if (!d) return ''; const dt = new Date(d + 'T00:00:00'); if (isNaN(dt)) return d; return dt.toLocaleDateString(P.lang === 'bn' ? 'bn-BD' : 'en-GB', {day:'numeric', month:'long', year:'numeric'}); }
function parseNum(s){ s = String(s == null ? '' : s).trim().replace(/[০-৯]/g, c => '০১২৩৪৫৬৭৮৯'.indexOf(c)).replace(/[,৳\s]/g, ''); if (s === '') return null; const n = Number(s); return isFinite(n) ? n : null; }
const rangeLabel = (a, b) => t('ageRange', (a == null || a === '' || Number(a) === 0) ? (b == null ? nf(0) : 0) : nf(a), (b == null || b === '') ? null : nf(b));

/* ================= icons ================= */
const I = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.8c1.9.8 3.1 2.5 3.5 5.2"/>',
  wallet:'<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10.5h18"/><path d="M15.5 15h2.5"/><path d="M6 6V5a2 2 0 0 1 2-2h9"/>',
  note:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h5"/>',
  more:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>',
  shirt:'<path d="M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z"/>', expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', shrink:'<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', x:'<path d="M6 6l12 12M18 6 6 18"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  calc:'<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>',
  down:'<path d="m6 9 6 6 6-6"/>', up:'<path d="m6 15 6-6 6 6"/>', right:'<path d="m9 6 6 6-6 6"/>',
  undo:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.6-1.6 0-1.1-.9-1.4-.9-2.4 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4c0-4.6-4-8.4-9-8.4z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
  shield:'<path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  logout:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  pin:'<path d="M12 17v5"/><path d="M8 3h8l-1 6 3 3v2H6v-2l3-3z"/>',
  map:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  flag:'<path d="M5 21V4"/><path d="M5 4h13l-3 4.5L18 13H5"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
  coins:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  lang:'<path d="M4 5h8M8 3v2M5.5 5c.8 3.5 3.3 6 6.5 7.5M10.5 5C10 8 7.5 11 4 12.5"/><path d="m13 21 4-9 4 9M14.5 18h5"/>',
  cloud:'<path d="M7 18a4 4 0 0 1-.7-7.9A6 6 0 0 1 18.2 9.6 4.2 4.2 0 0 1 17.5 18z"/>', bus:'<rect x="3" y="4" width="18" height="13" rx="3"/><path d="M3 11h18M7 17v3M17 17v3"/><circle cx="7.5" cy="14" r=".8"/><circle cx="16.5" cy="14" r=".8"/>', shuffle:'<path d="M3 7h4c4 0 6 10 10 10h4M3 17h4c1.4 0 2.5-.8 3.4-2M14 8c.8-.7 1.7-1 3-1h4M18 4l3 3-3 3M18 14l3 3-3 3"/>', upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  baby:'<circle cx="12" cy="7" r="3"/><path d="M8 21v-5l-3-2M16 21v-5l3-2M8 13c0-2 1.8-3 4-3s4 1 4 3v3H8z"/>',
  check:'<path d="m5 12 5 5 9-10"/>', gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9"/><path d="M12 8S10.5 3 8 3.8C5.8 4.5 7 8 12 8zM12 8s1.5-5 4-4.2C18.2 4.5 17 8 12 8z"/>',
  download:'<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>', receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  scale:'<path d="M12 3v18M7 21h10M4 7h16M7 7l-3 6a3 3 0 0 0 6 0zM17 7l-3 6a3 3 0 0 0 6 0z"/>', pie:'<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  building:'<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h3a1 1 0 0 1 1 1v11"/><path d="M8 7h4M8 11h4M8 15h4M3 21h18"/>', phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'
};
const ic = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;
const BUNTING = Array.from({length:70}, (_, i) => `<i style="left:${i*22}px;--c:var(--f${(i%4)+1})"></i>`).join('');

/* ================= state ================= */
const S = { user:null, authReady:false, profile:null, users:[], programs:[], pid:null, fam:[], pay:[], notes:[], loaded:{users:false, programs:false},
  view:'home', peopleMode:'fam', side:'all', cat:'', q:'', cq:'', cf:'all', undo:[], loginErr:'', busy:false, bud:[], exp:[], sp:[], st:[], gifts:[], incMode:'chanda', spendMode:'exp', expBud:'', eq:'' };
try { S.pid = localStorage.getItem('pm-pid'); } catch(e) {}
const famPath = () => `programs/${S.pid}/families`, payPath = () => `programs/${S.pid}/payments`, notePath = () => `programs/${S.pid}/notes`;
const budPath = () => `programs/${S.pid}/budgets`, expPath = () => `programs/${S.pid}/expenses`, spPath = () => `programs/${S.pid}/sponsors`, stPath = () => `programs/${S.pid}/settlements`, giftPath = () => `programs/${S.pid}/gifts`;
const METHODS = ['cash','card','bkash','nagad','bank','other'];
const prog = () => S.programs.find(p => p.id === S.pid) || null;
const isAdmin = () => !!S.profile && S.profile.role === 'admin';
const can = p => isAdmin() || !!(S.profile && S.profile.perms && S.profile.perms[p]);
const myName = () => (S.profile && S.profile.name) || (S.user && S.user.email) || '';

function cacheFor(path){
  if (path === 'users') return S.users;
  if (path === 'programs') return S.programs;
  if (path === famPath()) return S.fam;
  if (path === payPath()) return S.pay;
  if (path === notePath()) return S.notes;
  if (path === budPath()) return S.bud;
  if (path === expPath()) return S.exp;
  if (path === spPath()) return S.sp;
  if (path === stPath()) return S.st;
  if (path === giftPath()) return S.gifts;
  return [];
}
const strip = d => { if (!d) return null; const c = JSON.parse(JSON.stringify(d)); delete c.id; return c; };

/* ================= writes with undo ================= */
async function commit(label, ops, msg, quiet){
  // ops: [{path,id,data}] data=null means delete
  const entry = { label, at: Date.now(), ops: ops.map(o => ({ path:o.path, id:o.id, prev: strip(cacheFor(o.path).find(x => x.id === o.id)) })) };
  try {
    for (const o of ops) { if (o.data == null) await DB.remove(o.path, o.id); else await DB.set(o.path, o.id, o.data); }
    S.undo.push(entry); if (S.undo.length > 30) S.undo.shift();
    if (!quiet) toast(msg || t('saved'), true); renderBandOnly(); setTimeout(refreshLive, 40);
    return true;
  } catch(e) { console.error(e); toast(t('saveFail')); return false; }
}
async function undoLast(){
  const e = S.undo.pop();
  if (!e) { toast(t('nothingUndo')); return; }
  try { for (const o of e.ops.slice().reverse()) { if (o.prev == null) await DB.remove(o.path, o.id); else await DB.set(o.path, o.id, o.prev); } toast(t('undone')); }
  catch(err) { console.error(err); toast(t('saveFail')); }
  renderBandOnly(); if (sheets.length) refreshTop();
}

/* ================= calculations ================= */
const ageNum = a => (a === '' || a == null) ? null : Number(a);
function inRange(age, min, max){ if (age == null) return false; if (min != null && min !== '' && age < Number(min)) return false; if (max != null && max !== '' && age >= Number(max)) return false; return true; }
function autoRate(m, f, rates){
  const age = ageNum(m.age), eff = age == null ? 30 : age; // unknown age is treated as adult for rates
  return (rates || []).find(r => (!r.side || r.side === 'any' || r.side === f.side) && (!r.cat || r.cat === f.cat) && inRange(eff, r.min, r.max)) || null;
}
function rateFor(m, f, p){
  if (m.rate === 'none') return null;
  const rates = (p && p.rates) || [];
  if (m.rate) { const r = rates.find(x => x.id === m.rate); if (r) return r; }
  return autoRate(m, f, rates);
}
function famRateSum(f, p){ return (f.members || []).reduce((s, m) => { const r = rateFor(m, f, p); return s + (r ? Number(r.amount) || 0 : 0); }, 0); }
function famDue(f, p){ return (f.due != null && f.due !== '') ? Number(f.due) : famRateSum(f, p); }
function famPaid(fid){ return S.pay.filter(x => x.fid === fid).reduce((s, x) => s + (Number(x.amount) || 0), 0); }
function famStatus(d, pd){ if (d <= 0 && pd <= 0) return 'free'; if (pd > d) return 'over'; if (pd >= d) return 'paid'; if (pd > 0) return 'partial'; return 'due'; }
const stCls = {paid:'ok', over:'info', partial:'warn', due:'bad', free:'info'};
const famName = f => ((f.members || [])[0] || {}).name || '—';
function relLabel(r){ if (!r) return ''; let k = STR.bn.rel.indexOf(r); if (k < 0) k = STR.en.rel.indexOf(r); return k >= 0 ? t('rel')[k] : r; }
function stats(){
  const p = prog() || {}; const groups = (p.ageGroups || []).map(g => ({ g, total:0, m:0, f:0, inn:0, out:0 }));
  const o = { fams:S.fam.length, persons:0, inn:0, out:0, m:0, f:0, unknown:0, groups, cats:{}, due:0, paid:0 };
  S.fam.forEach(f => {
    const ms = f.members || []; const cat = f.cat || '';
    const c = o.cats[cat] = o.cats[cat] || { fams:0, persons:0, due:0, paid:0 };
    c.fams++; c.persons += ms.length;
    const d = famDue(f, p), pd = famPaid(f.id); o.due += d; o.paid += pd; c.due += d; c.paid += pd;
    ms.forEach(m => {
      o.persons++; f.side === 'out' ? o.out++ : o.inn++;
      if (m.g === 'M') o.m++; else if (m.g === 'F') o.f++;
      const a = ageNum(m.age); if (a == null) o.unknown++;
      groups.forEach(G => { if (inRange(a, G.g.min, G.g.max)) { G.total++; if (m.g === 'M') G.m++; if (m.g === 'F') G.f++; f.side === 'out' ? G.out++ : G.inn++; } });
    });
  });
  return o;
}

/* ================= toast ================= */
let toastTimer;
function toast(msg, withUndo){
  const el = $('#toast');
  el.innerHTML = `<span>${esc(msg)}</span>` + (withUndo ? `<button data-a="undo">${esc(t('undo'))}</button>` : '');
  el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, withUndo ? 5000 : 2600);
}

/* ================= sheets ================= */
const sheets = [];
function openSheet(o){
  sheets.push(o);
  const host = $('#sheets'); const i = sheets.length - 1;
  const el = document.createElement('div'); el.className = 'scrim'; el.style.zIndex = 40 + i * 2;
  el.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(o.title)}"><div class="sheet-h"><h2>${esc(o.title)}</h2><button class="iconbtn" data-a="closeSheet" aria-label="${esc(t('close'))}">${ic('x')}</button></div><div class="sheet-b"></div><div class="sheet-f"></div></div>`;
  host.appendChild(el); o.el = el; fillSheet(o);
  document.body.style.overflow = 'hidden';
}
function fillSheet(o){
  const sb = $('.sheet-b', o.el), top = sb.scrollTop; sb.innerHTML = o.body(); sb.scrollTop = top; const f = o.foot ? o.foot() : ''; const fe = $('.sheet-f', o.el); fe.innerHTML = f; fe.hidden = !f;
  o.mount && o.mount(o.el);
}
function refreshTop(){ const o = sheets[sheets.length - 1]; if (o) fillSheet(o); }
function closeSheet(){ const o = sheets.pop(); if (o) { o.el.remove(); o.onClose && o.onClose(); } if (!sheets.length) document.body.style.overflow = ''; }
function closeAll(){ while (sheets.length) closeSheet(); }
function confirmBox(text, onYes, yesLabel){
  openSheet({ title: t('sureDel'), body: () => `<p style="margin:0">${esc(text)}</p>`,
    foot: () => `<button class="btn ghost" data-a="closeSheet">${esc(t('cancel'))}</button><button class="btn danger" data-a="confirmYes">${ic('trash')}${esc(yesLabel || t('yesDel'))}</button>`, onYes });
}

/* ================= auth & data wiring ================= */
let unsubs = [], progUnsubs = [];
function startData(){
  unsubs.forEach(u => u()); unsubs = []; S._rest = false;
  // Only your own profile is read first; everything else opens once you are an active user.
  unsubs.push(DB.watchDoc('users', S.user.uid, doc => {
    S.profile = doc; S.loaded.users = true;
    if (!doc && DB.mode === 'firebase' && (S.user.email || '').toLowerCase() === ADMIN_EMAIL && !S._creatingAdmin) {
      S._creatingAdmin = true;
      DB.set('users', S.user.uid, { name: P.lang === 'bn' ? 'অ্যাডমিন' : 'Admin', email: S.user.email, role:'admin', active:true, perms:{} }).catch(err => { S.dbErr = (err && err.code) || 'error'; render(); });
    }
    if (doc && doc.active !== false && !S._rest) {
      S._rest = true; S.dbErr = '';
      unsubs.push(DB.watch('users', arr => { S.users = arr; render(); }));
      unsubs.push(DB.watch('programs', arr => {
        S.programs = arr.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || (b.createdAt || 0) - (a.createdAt || 0));
        S.loaded.programs = true;
        if (!S.programs.find(p => p.id === S.pid)) setProgram(S.programs[0] ? S.programs[0].id : null, true);
        render();
      }));
    }
    render();
  }));
}
function setProgram(pid, silent){
  S.pid = pid; try { pid ? localStorage.setItem('pm-pid', pid) : localStorage.removeItem('pm-pid'); } catch(e) {}
  progUnsubs.forEach(u => u()); progUnsubs = []; S.fam = []; S.pay = []; S.notes = []; S.bud = []; S.exp = []; S.sp = []; S.st = []; S.gifts = []; S.expBud = '';
  if (pid) {
    progUnsubs.push(DB.watch(famPath(), a => { S.fam = a.sort((x, y) => (x.createdAt || 0) - (y.createdAt || 0)); render(); }));
    progUnsubs.push(DB.watch(payPath(), a => { S.pay = a.sort((x, y) => String(y.date || '').localeCompare(String(x.date || '')) || (y.at || 0) - (x.at || 0)); render(); }));
    progUnsubs.push(DB.watch(notePath(), a => { S.notes = a; render(); }));
    progUnsubs.push(DB.watch(budPath(), a => { S.bud = a; render(); }));
    progUnsubs.push(DB.watch(expPath(), a => { S.exp = a.sort(dateDesc); render(); }));
    progUnsubs.push(DB.watch(spPath(), a => { S.sp = a.sort((x, y) => (x.at || 0) - (y.at || 0)); render(); }));
    progUnsubs.push(DB.watch(stPath(), a => { S.st = a.sort(dateDesc); render(); }));
    progUnsubs.push(DB.watch(giftPath(), a => { S.gifts = a; render(); }));
  }
  if (!silent) render();
}
DB.onAuth(u => {
  S.user = u; S.authReady = true; S.profile = null; S.dbErr = ''; S.users = []; S.programs = []; S.loaded = {users:false, programs:false};
  if (u) startData(); else { unsubs.forEach(f => f()); unsubs = []; progUnsubs.forEach(f => f()); progUnsubs = []; closeAll(); S.undo = []; }
  render();
});

/* ================= main render ================= */
function render(){
  applyPrefs();
  const app = $('#app');
  if (!S.authReady) { app.innerHTML = `<div class="empty" style="padding-top:30vh">${esc(t('loading'))}</div>`; return; }
  if (!S.user) { app.innerHTML = loginView(); return; }
  if (S.dbErr && !S.profile) { app.innerHTML = dbErrView(); return; }
  if (!S.loaded.users) { app.innerHTML = `<div class="empty" style="padding-top:30vh">${esc(t('loading'))}</div>`; return; }
  if (!S.profile || S.profile.active === false) { app.innerHTML = noAccessView(); return; }
  const v = S.view;
  const body = !prog() && v !== 'more' ? noProgramView() : ({home:homeView, people:peopleView, income:incomeView, spend:spendView, notes:notesView, settle:settleView, bus:busView, tshirt:tshirtView, more:moreView}[v] || homeView)();
  app.innerHTML = `${bandView()}<main class="wrap" id="main">${body}</main>${fabView()}${tabsView()}`;
  lcSchedule();
}
function renderBandOnly(){ const b = $('.band'); if (b) b.outerHTML = bandView(); }
function bandView(){
  const p = prog();
  return `<header class="band"><div class="band-row">
    <div class="band-title"><div class="app">${esc(t('appName'))}${syncChip()}</div>
      <button class="prog" data-a="progPicker" aria-label="${esc(t('chooseProgram'))}"><span>${esc(p ? p.name : t('allPrograms'))}</span>${ic('down')}</button></div>
    ${S.undo.length ? `<button class="iconbtn" data-a="undo" aria-label="${esc(t('undo'))}" title="${esc(t('undo'))}">${ic('undo')}</button>` : ''}
    ${p ? `<button class="iconbtn" data-a="shareSummary" aria-label="${esc(t('shareSummary'))}" title="${esc(t('shareSummary'))}">${ic('share')}</button>` : ''}
  </div>${DB.mode === 'demo' ? `<div class="demo-flag"><span>${esc(t('demoShort'))}</span><b>${esc(isAdmin() ? t('r_admin') : t('r_org'))}</b></div>` : ''}<div class="bunting" aria-hidden="true">${BUNTING}</div></header>`;
}
function tabsView(){
  const tabs = [['home','home'],['people','users'],['income','wallet'],['spend','receipt'],['more','more']];
  const cur = ['notes','settle','bus','tshirt'].includes(S.view) ? 'more' : S.view;
  return `<nav class="tabs" aria-label="menu"><div class="tabs-in">${tabs.map(([k, i]) => `<button class="tab ${cur === k ? 'on' : ''}" data-a="tab" data-v="${k}" ${cur === k ? 'aria-current="page"' : ''}>${ic(i)}<span>${esc(t('t_' + k))}</span></button>`).join('')}</div></nav>`;
}
function fabView(){
  if (!prog()) return '';
  const f = (a, l) => `<button class="fab" data-a="${a}" aria-label="${esc(l)}">${ic('plus')}<span>${esc(l)}</span></button>`;
  if (S.view === 'people' && can('members')) return f('famNew', t('addFamily'));
  if (S.view === 'notes' && can('notes')) return f('noteNew', t('newNote'));
  if (S.view === 'income' && S.incMode === 'sp' && can('sponsor')) return f('spNew', t('addSp'));
  if (S.view === 'spend' && S.spendMode === 'exp' && can('expense')) return f('expNew', t('addExp'));
  if (S.view === 'spend' && S.spendMode === 'bud' && isAdmin()) return f('budNew', t('addBud'));
  if (S.view === 'spend' && S.spendMode === 'gift' && can('gift')) return f('giftNew', t('addGift'));
  return '';
}
const avatar = (name, i) => { const n = `var(--f${(i % 4) + 1})`; return `<div class="avatar" style="background:color-mix(in srgb,${n} 26%,var(--surface));color:color-mix(in srgb,${n} 65%,var(--ink))">${esc((name || '?').trim().charAt(0))}</div>`; };
const emptyBox = (icon, text, btn) => `<div class="card empty">${ic(icon)}<p>${esc(text)}</p>${btn || ''}</div>`;

/* ---------- login ---------- */
const GLOGO = '<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true" style="flex:none"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';
function loginView(){
  const demo = DB.mode === 'demo';
  return `<div class="login"><div class="login-top"><div class="logo">${ic('flag')}</div><h1>${esc(t('appName'))}</h1><p style="margin:0;opacity:.9">${esc(t('tagline'))}</p></div>
  <div class="bunting" aria-hidden="true" style="margin:0">${BUNTING}</div>
  <div class="login-card"><div>
    ${demo ? `<div class="note-box"><b>${esc(t('demoMode'))}</b><br>${esc(t('demoNote'))}</div>
      <button class="btn block" data-a="demoIn" data-r="admin">${ic('shield')}${esc(t('demoAsAdmin'))}</button>
      <button class="btn ghost block" data-a="demoIn" data-r="organizer">${ic('users')}${esc(t('demoAsOrg'))}</button>` :
    `<div class="stack">
      ${S.loginErr ? `<div class="err">${esc(S.loginErr)}</div>` : ''}
      <button class="btn block" data-a="googleIn" ${S.busy ? 'disabled' : ''}>${GLOGO}${esc(S.busy ? t('signingIn') : t('googleIn'))}</button>
      <p class="small muted" style="margin:0;text-align:center">${esc(t('googleHint'))}</p></div>`}
    <div class="seg" role="group" aria-label="${esc(t('language'))}"><button class="${P.lang === 'bn' ? 'on' : ''}" data-a="lang" data-l="bn">বাংলা</button><button class="${P.lang === 'en' ? 'on' : ''}" data-a="lang" data-l="en">English</button></div>
  </div></div></div>`;
}
function dbErrView(){ return `<div class="login"><div class="login-top"><div class="logo">${ic('shield')}</div><h1>${esc(t('appName'))}</h1></div><div class="login-card"><div><div class="err">${esc(t('e_db'))} ${esc(S.dbErr)}</div><button class="btn ghost block" data-a="signOut">${ic('logout')}${esc(t('signOut'))}</button></div></div></div>`; }
window.addEventListener('pm-auth-error', e => { S.busy = false; S.loginErr = loginMsg(e.detail); render(); });
window.addEventListener('pm-db-error', e => { if (!S.user) return; S.dbErr = (e.detail && e.detail.code) || 'error'; if (S.profile) { if (S._dbToast !== S.dbErr) toast(t('readFail') + ' ' + S.dbErr); S._dbToast = S.dbErr; } render(); });
function noAccessView(){ return `<div class="login"><div class="login-top"><div class="logo">${ic('shield')}</div><h1>${esc(t('appName'))}</h1></div><div class="login-card"><div><div class="err">${esc(t('noAccess'))}<br><b style="overflow-wrap:anywhere">${esc((S.user && S.user.email) || '')}</b></div><button class="btn ghost block" data-a="signOut">${ic('logout')}${esc(t('signOut'))}</button></div></div></div>`; }
function noProgramView(){
  if (!S.loaded.programs) return `<div class="empty">${esc(t('loading'))}</div>`;
  return emptyBox('flag', isAdmin() ? t('noPrograms') : t('noProgramsOrg'), isAdmin() ? `<button class="btn" data-a="progNew">${ic('plus')}${esc(t('newProgram'))}</button>` : '');
}

/* ---------- summary (home) ---------- */
/* (dashboard cards: see phase 6 block below) */

function moneyCard(c){
  const m = money(), bt = budTotals();
  return `<section class="card tap" data-a="tab" data-v="settle" role="button" tabindex="0">
    <div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(c ? dashTitle(c) : t('money'))}</h3><span class="linkbtn small">${esc(t('openSettle'))}</span></div>
    <div class="grid3" style="margin-top:10px"><div><div class="small muted">${esc(t('income'))}</div><b class="num">${tk(m.income)}</b></div><div><div class="small muted">${esc(t('spent'))}</div><b class="num">${tk(m.spent)}</b></div><div><div class="small muted">${esc(m.bal >= 0 ? t('inHand') : t('deficit'))}</div><b class="num" style="color:${m.bal >= 0 ? 'var(--ok)' : 'var(--bad)'}">${tk(Math.abs(m.bal))}</b></div></div>
    ${bt.total > 0 ? `<div class="small muted" style="margin-top:10px">${esc(t('budgetUse'))}: ${tk(m.spent)} / ${tk(bt.total)}</div><div class="bar thin" style="margin-top:4px"><i class="${barCls(m.spent, bt.total)}" style="width:${barW(m.spent, bt.total)}%"></i></div>` : ''}
  </section>`;
}

/* ---------- participants ---------- */
function filteredFams(q){
  q = (q || '').trim().toLowerCase();
  return S.fam.filter(f => (S.side === 'all' || f.side === S.side) && (!S.cat || (f.cat || '') === S.cat) &&
    (!q || (f.members || []).some(m => (m.name || '').toLowerCase().includes(q)) || (f.phone || '').includes(q)));
}
function peopleView(){
  const p = prog(), cats = p.categories || [];
  return `<div class="sec-h"><h2>${esc(t('t_people'))}</h2><span class="small muted">${esc(t('famN', nf(S.fam.length)))} · ${esc(t('peopleN', nf(S.fam.reduce((s, f) => s + (f.members || []).length, 0))))}</span></div>
  <div class="seg" role="tablist"><button class="${S.peopleMode === 'fam' ? 'on' : ''}" data-a="pmode" data-m="fam">${esc(t('byFamily'))}</button><button class="${S.peopleMode === 'names' ? 'on' : ''}" data-a="pmode" data-m="names">${esc(t('nameList'))}</button></div>
  <div class="search">${ic('search')}<input class="in" id="pq" type="search" placeholder="${esc(t('search'))}" value="${esc(S.q)}" aria-label="${esc(t('search'))}"></div>
  <div class="row"><div class="seg grow"><button class="${S.side === 'all' ? 'on' : ''}" data-a="pside" data-s="all">${esc(t('all'))}</button><button class="${S.side === 'in' ? 'on' : ''}" data-a="pside" data-s="in">${esc(t('inside'))}</button><button class="${S.side === 'out' ? 'on' : ''}" data-a="pside" data-s="out">${esc(t('outsideShort'))}</button></div>
  ${cats.length ? `<select class="in" id="pcat" style="width:auto;flex:1;min-width:130px" aria-label="${esc(t('category'))}"><option value="">${esc(t('category'))}: ${esc(t('all'))}</option>${cats.map(c => `<option ${S.cat === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>` : ''}</div>
  ${!can('members') ? `<div class="note-box small">${esc(t('readOnly'))}</div>` : ''}
  <div id="listArea">${peopleList()}</div>`;
}
function peopleList(){
  const fams = filteredFams(S.q);
  if (!S.fam.length) return emptyBox('users', t('noFamilies'), can('members') ? `<button class="btn" data-a="famNew">${ic('plus')}${esc(t('addFamily'))}</button>` : '');
  if (!fams.length) return emptyBox('search', t('noMatch'));
  const p = prog();
  if (S.peopleMode === 'names') {
    let n = 0; const q = (S.q || '').trim().toLowerCase();
    const rows = fams.map(f => (f.members || []).filter(m => !q || (m.name || '').toLowerCase().includes(q)).map((m, j) => { n++;
      const gs = (p.ageGroups || []).filter(G => inRange(ageNum(m.age), G.min, G.max)).map(G => G.name).join(', ');
      return `<tr class="tap" data-a="famOpen" data-id="${f.id}"><td>${nf(n)}</td><td style="text-align:left"><b>${esc(m.name || '—')}</b><div class="small muted">${j ? esc(relLabel(m.rel)) + ' · ' + esc(famName(f)) : esc(f.cat || '') + (f.side === 'out' ? ' · ' + esc(t('outsideShort')) : '')}</div></td><td>${m.g === 'M' ? esc(t('male')) : m.g === 'F' ? esc(t('female')) : ''}</td><td>${ageNum(m.age) == null ? '<span class="muted">—</span>' : nf(m.age)}</td><td style="text-align:left;white-space:normal" class="small">${esc(gs)}</td></tr>`; }).join('')).join('');
    return `<section class="card"><div class="row" style="justify-content:flex-end;margin-bottom:6px"><button class="btn ghost sm" data-a="shareNames">${ic('share')}${esc(t('share'))}</button></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>#</th><th style="text-align:left">${esc(t('name'))}</th><th>${esc(t('gender'))}</th><th>${esc(t('age'))}</th><th style="text-align:left">${esc(t('group'))}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
  }
  return `<section class="card" style="padding-block:4px"><div class="list">${fams.map((f, i) => {
    const ms = f.members || []; const d = famDue(f, p), pd = famPaid(f.id), st = famStatus(d, pd);
    return `<div class="item tap" data-a="famOpen" data-id="${f.id}" role="button" tabindex="0">${avatar(famName(f), i)}<div class="body">
      <div class="title">${esc(famName(f))}</div>
      <div class="small muted">${[f.cat, f.side === 'out' ? t('outside') : (f.dept || t('inside')), t('peopleN', nf(ms.length))].filter(Boolean).map(esc).join(' · ')}</div>
      ${ms.length > 1 ? `<div class="chips">${ms.slice(1).map(m => `<span class="chip ${m.g === 'M' ? 'm' : m.g === 'F' ? 'f' : ''}">${esc(m.name || '—')}${ageNum(m.age) != null ? ` · ${nf(m.age)}` : ''}</span>`).join('')}</div>` : ''}
    </div><span class="pill ${stCls[st]}">${esc(t('st_' + st))}</span></div>`; }).join('')}</div></section>`;
}

/* ---------- family form ---------- */
function memberRow(m, p, idx){
  const rates = p.rates || [];
  return `<div class="mem" data-mid="${esc(m.id)}" data-ts="${esc(m.ts || '')}">
    <div class="mem-top"><input class="in m-name" placeholder="${esc(t('name'))}" value="${esc(m.name || '')}" aria-label="${esc(t('name'))}">
      ${idx ? `<button type="button" class="iconbtn" style="background:var(--bad-soft);color:var(--bad)" data-a="memDel" aria-label="${esc(t('del'))}">${ic('trash')}</button>` : ''}</div>
    <div class="mem-grid">
      <input class="in m-rel" list="relList" placeholder="${esc(t('relation'))}" value="${esc(relLabel(m.rel) || (idx ? '' : t('rel')[0]))}" aria-label="${esc(t('relation'))}">
      <select class="in m-g" aria-label="${esc(t('gender'))}"><option value="">${esc(t('gender'))}</option><option value="M" ${m.g === 'M' ? 'selected' : ''}>${esc(t('male'))}</option><option value="F" ${m.g === 'F' ? 'selected' : ''}>${esc(t('female'))}</option></select>
      <input class="in m-age" inputmode="decimal" placeholder="${esc(t('age'))}" value="${ageNum(m.age) == null ? '' : esc(m.age)}" aria-label="${esc(t('age'))}">
      <select class="in m-rate span2" style="grid-column:1/-1" aria-label="${esc(t('rate'))}"><option value="">${esc(t('autoRate'))}</option>${rates.map(r => `<option value="${esc(r.id)}" ${m.rate === r.id ? 'selected' : ''}>${esc(r.name)} · ${tk(r.amount)}</option>`).join('')}<option value="none" ${m.rate === 'none' ? 'selected' : ''}>${esc(t('noRate'))}</option></select>
    ${tsOf(p).sizes.length ? `<div class="mem-grid" style="margin-top:8px"><select class="in m-ts" style="grid-column:1/-1" aria-label="${esc(t('tsSizeLbl'))}"><option value="">${esc(t('tsSizeLbl'))}: ${esc(t('tsUnsetOpt'))}</option><option value="-" ${m.ts === '-' ? 'selected' : ''}>${esc(t('tsSizeLbl'))}: ${esc(t('tsNoNeed'))}</option>${tsOf(p).sizes.map(z => `<option value="${esc(z)}" ${m.ts === z ? 'selected' : ''}>${esc(t('tsSizeLbl'))}: ${esc(z)}</option>`).join('')}</select></div>` : ''}
    </div></div>`;
}
function readFamForm(root){
  const side = $('[data-a="fside"].on', root) ? $('[data-a="fside"].on', root).dataset.s : 'in';
  const members = $$('.mem', root).map(el => ({ id: el.dataset.mid, name: $('.m-name', el).value.trim(), rel: $('.m-rel', el).value.trim(), g: $('.m-g', el).value, age: parseNum($('.m-age', el).value), rate: $('.m-rate', el).value, ts: $('.m-ts', el) ? $('.m-ts', el).value : (el.dataset.ts || '') }));
  return { side, dept: side === 'out' ? '' : ($('#fDept', root) ? $('#fDept', root).value : ''), cat: $('#fCat', root) ? $('#fCat', root).value : '', phone: $('#fPhone', root).value.trim(), due: parseNum($('#fDue', root).value), note: $('#fNote', root).value.trim(), members };
}
function updateAutoLabels(root){
  const p = prog(); const f = readFamForm(root); let sum = 0;
  $$('.mem', root).forEach((el, i) => {
    const m = f.members[i]; const ar = autoRate(m, f, p.rates || []); const opt = $('.m-rate option[value=""]', el);
    opt.textContent = t('autoRate') + ': ' + (ar ? `${ar.name} · ${tk(ar.amount)}` : t('noRate'));
    const r = rateFor(m, f, p); sum += r ? Number(r.amount) || 0 : 0;
  });
  const hint = $('#fDueHint', root); if (hint) hint.textContent = `${t('byRate')}: ${tk(sum)} · ${t('specialHint')}`;
}
function openFamily(id){
  const p = prog(); const f = id ? S.fam.find(x => x.id === id) : null; const editable = can('members');
  const base = f ? JSON.parse(JSON.stringify(f)) : { side:'in', cat:'', phone:'', due:null, note:'', members:[{ id:DB.rid(), name:'', rel:t('rel')[0], g:'', age:null, rate:'' }] };
  if (!editable && f) return openFamilyView(f);
  openSheet({ title: f ? t('editFamily') : t('addFamily'), kind:'family',
    body: () => `<div class="field"><label>${esc(t('side'))}</label><div class="seg"><button type="button" class="${base.side !== 'out' ? 'on' : ''}" data-a="fside" data-s="in">${esc(t('inside'))}</button><button type="button" class="${base.side === 'out' ? 'on' : ''}" data-a="fside" data-s="out">${esc(t('outside'))}</button></div></div>
      ${deptsOf(p).length ? `<div class="field" id="fDeptWrap" ${base.side === 'out' ? 'hidden' : ''}><label for="fDept">${esc(t('dept'))}</label><select class="in" id="fDept"><option value="">${esc(t('noDept'))}</option>${deptsOf(p).map(d => `<option ${base.dept === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}</select></div>` : ''}
      ${(p.categories || []).length ? `<div class="field"><label for="fCat">${esc(t('category'))}</label><select class="in" id="fCat"><option value="">${esc(t('noCat'))}</option>${p.categories.map(c => `<option ${base.cat === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></div>` : ''}
      <div class="field"><label>${esc(t('members'))} <span class="muted" style="font-weight:400">· ${esc(t('firstIsHead'))}</span></label><div class="stack" id="memList">${base.members.map((m, i) => memberRow(m, p, i)).join('')}</div>
      <button type="button" class="btn ghost" data-a="memAdd" style="margin-top:4px">${ic('plus')}${esc(t('addMember'))}</button></div>
      <datalist id="relList">${t('rel').map(r => `<option value="${esc(r)}">`).join('')}</datalist>
      <div class="grid2"><div class="field"><label for="fPhone">${esc(t('phone'))}</label><input class="in" id="fPhone" inputmode="tel" value="${esc(base.phone || '')}"></div>
      <div class="field"><label for="fDue">${esc(t('special'))}</label>${calcInput('fDue', base.due)}</div></div>
      <div class="small muted" id="fDueHint"></div>
      <div class="field"><label for="fNote">${esc(t('note'))}</label><textarea class="in" id="fNote">${esc(base.note || '')}</textarea></div>`,
    foot: () => `${f ? `<button class="btn danger" data-a="famDel" data-id="${f.id}" aria-label="${esc(t('del'))}" style="flex:0 0 auto">${ic('trash')}</button>` : ''}<button class="btn" data-a="famSave" data-id="${f ? f.id : ''}">${ic('check')}${esc(t('save'))}</button>`,
    mount: el => { updateAutoLabels(el); el.addEventListener('input', () => updateAutoLabels(el)); el.addEventListener('change', () => updateAutoLabels(el)); }
  });
}
function openFamilyView(f){
  const p = prog();
  openSheet({ title: famName(f), body: () => `<div class="small muted">${[f.cat, f.side === 'out' ? t('outside') : (f.dept || t('inside')), f.phone].filter(Boolean).map(esc).join(' · ')}</div>
    <div class="card" style="padding-block:4px"><div class="list">${(f.members || []).map((m, i) => `<div class="item">${avatar(m.name, i)}<div class="body"><div class="title">${esc(m.name || '—')}</div><div class="small muted">${[relLabel(m.rel), m.g === 'M' ? t('male') : m.g === 'F' ? t('female') : '', ageNum(m.age) != null ? nf(m.age) + ' ' + t('year') : ''].filter(Boolean).map(esc).join(' · ')}</div></div></div>`).join('')}</div></div>
    ${f.note ? `<div class="note-box note-body">${esc(f.note)}</div>` : ''}<div class="note-box small">${esc(t('readOnly'))}</div>` });
}
async function saveFamily(id, root){
  const d = readFamForm(root);
  d.members = d.members.filter(m => m.name);
  if (!d.members.length) { toast(t('needName')); $('.m-name', root) && $('.m-name', root).focus(); return; }
  const prev = id ? S.fam.find(x => x.id === id) : null;
  const doc = Object.assign({}, prev ? { bus: prev.bus || '' } : {}, d, { createdAt: prev ? prev.createdAt || Date.now() : Date.now(), updatedAt: Date.now(), by: myName() });
  const fid = id || DB.rid();
  if (await commit(id ? 'editFamily' : 'addFamily', [{ path: famPath(), id: fid, data: doc }])) closeSheet();
}

/* ---------- chanda ---------- */
function chandaView(){
  const p = prog(), s = stats(); const pct = s.due > 0 ? Math.min(100, Math.round(s.paid / s.due * 100)) : 0;
  const counts = { due:0, partial:0, paid:0 };
  S.fam.forEach(f => { const st = famStatus(famDue(f, p), famPaid(f.id)); if (st === 'due') counts.due++; else if (st === 'partial') counts.partial++; else if (st === 'paid' || st === 'over') counts.paid++; });
  return `<section class="hero-card"><div class="grid3">
      <div class="tile"><div class="k">${esc(t('due'))}</div><div class="v num">${tk(s.due)}</div></div>
      <div class="tile"><div class="k">${esc(t('collected'))}</div><div class="v num" style="color:var(--ok)">${tk(s.paid)}</div></div>
      <div class="tile"><div class="k">${esc(t('remaining'))}</div><div class="v num" style="color:var(--bad)">${tk(Math.max(0, s.due - s.paid))}</div></div></div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      ${isAdmin() ? `<div class="row"><button class="btn ghost sm" data-a="rates">${ic('coins')}${esc(t('rates'))}</button>${!(p.rates || []).length ? `<span class="small muted">${esc(t('noRates'))}</span>` : ''}</div>` : ''}
    </section>
    <div class="seg"><button class="${S.cf === 'all' ? 'on' : ''}" data-a="cf" data-f="all">${esc(t('all'))}</button><button class="${S.cf === 'due' ? 'on' : ''}" data-a="cf" data-f="due">${esc(t('st_due'))} ${nf(counts.due)}</button><button class="${S.cf === 'partial' ? 'on' : ''}" data-a="cf" data-f="partial">${esc(t('st_partial'))} ${nf(counts.partial)}</button><button class="${S.cf === 'paid' ? 'on' : ''}" data-a="cf" data-f="paid">${esc(t('st_paid'))} ${nf(counts.paid)}</button></div>
    <div class="search">${ic('search')}<input class="in" id="cq" type="search" placeholder="${esc(t('search'))}" value="${esc(S.cq)}" aria-label="${esc(t('search'))}"></div>
    ${!can('chanda') ? `<div class="note-box small">${esc(t('readOnly'))}</div>` : ''}
    <div id="listArea">${chandaList()}</div>`;
}
function chandaList(){
  const p = prog(); const q = (S.cq || '').trim().toLowerCase();
  if (!S.fam.length) return emptyBox('wallet', t('noFamilies'));
  const rows = S.fam.map(f => { const d = famDue(f, p), pd = famPaid(f.id); return { f, d, pd, st: famStatus(d, pd) }; })
    .filter(r => (S.cf === 'all' || r.st === S.cf || (S.cf === 'paid' && r.st === 'over')) && (!q || (r.f.members || []).some(m => (m.name || '').toLowerCase().includes(q))));
  if (!rows.length) return emptyBox('search', t('noMatch'));
  return `<section class="card" style="padding-block:4px"><div class="list">${rows.map((r, i) => `<div class="item tap" data-a="chandaOpen" data-id="${r.f.id}" role="button" tabindex="0">${avatar(famName(r.f), i)}
    <div class="body"><div class="title">${esc(famName(r.f))}</div><div class="small muted">${[r.f.cat, t('peopleN', nf((r.f.members || []).length))].filter(Boolean).map(esc).join(' · ')}</div></div>
    <div style="text-align:right"><div class="num"><b>${tk(r.pd)}</b><span class="muted small"> / ${tk(r.d)}</span></div><span class="pill ${stCls[r.st]}">${esc(t('st_' + r.st))}</span></div></div>`).join('')}</div></section>`;
}
function payForm(x){
  x = x || {};
  const methods = METHODS;
  return `<div class="grid2"><div class="field"><label for="pAmt">${esc(t('amount'))}</label>${calcInput('pAmt', x.amount)}</div>
    <div class="field"><label for="pDate">${esc(t('date'))}</label><input class="in" id="pDate" type="date" value="${esc(x.date || today())}"></div>
    <div class="field"><label for="pMethod">${esc(t('method'))}</label><select class="in" id="pMethod">${methods.map(m => `<option value="${m}" ${x.method === m ? 'selected' : ''}>${esc(t('m_' + m))}</option>`).join('')}</select></div>
    <div class="field"><label for="pRecv">${esc(t('receivedBy'))}</label><input class="in" id="pRecv" value="${esc(x.recv != null ? x.recv : myName())}"></div></div>
    <div class="field"><label for="pNote">${esc(t('note'))}</label><input class="in" id="pNote" value="${esc(x.note || '')}"></div>`;
}
function readPay(root){ return { amount: parseNum($('#pAmt', root).value), date: $('#pDate', root).value, method: $('#pMethod', root).value, recv: $('#pRecv', root).value.trim(), note: $('#pNote', root).value.trim() }; }
function openChanda(fid){
  openSheet({ title: t('t_chanda'), kind:'chanda', fid, live: true,
    body: () => {
      const p = prog(), f = S.fam.find(x => x.id === fid); if (!f) return `<p>${esc(t('noMatch'))}</p>`;
      const d = famDue(f, p), pd = famPaid(fid), st = famStatus(d, pd), pays = S.pay.filter(x => x.fid === fid);
      return `<div class="row"><div class="grow"><div class="title strong" style="font-size:1.1rem">${esc(famName(f))}</div><div class="small muted">${[f.cat, f.side === 'out' ? t('outside') : t('inside')].filter(Boolean).map(esc).join(' · ')}</div></div><span class="pill ${stCls[st]}">${esc(t('st_' + st))}</span></div>
      <div class="grid3"><div class="tile"><div class="k">${esc(t('due'))}</div><div class="v num" style="font-size:1.15rem">${tk(d)}</div></div><div class="tile"><div class="k">${esc(t('collected'))}</div><div class="v num" style="font-size:1.15rem;color:var(--ok)">${tk(pd)}</div></div><div class="tile"><div class="k">${esc(t('remaining'))}</div><div class="v num" style="font-size:1.15rem;color:var(--bad)">${tk(Math.max(0, d - pd))}</div></div></div>
      ${can('chanda') ? `<div class="card flat stack"><b>${esc(t('addPayment'))}</b>${payForm({ amount: d - pd > 0 ? d - pd : null })}<button class="btn" data-a="paySave" data-fid="${fid}">${ic('check')}${esc(t('save'))}</button></div>` : `<div class="note-box small">${esc(t('readOnly'))}</div>`}
      <div class="card" style="padding-block:6px"><b>${esc(t('payments'))}</b>${pays.length ? `<div class="list">${pays.map(x => `<div class="item ${can('chanda') ? 'tap' : ''}" ${can('chanda') ? `data-a="payEdit" data-id="${x.id}" role="button" tabindex="0"` : ''}><div class="body"><div class="title num">${tk(x.amount)}</div><div class="small muted">${[fd(x.date), t('m_' + (x.method || 'cash')), x.recv, x.note].filter(Boolean).map(esc).join(' · ')}</div></div>${can('chanda') ? ic('right').replace('<svg', '<svg width="18" height="18" style="color:var(--muted)"') : ''}</div>`).join('')}</div>` : `<p class="small muted" style="margin:6px 0">${esc(t('noPayments'))}</p>`}</div>
      <div class="card flat"><b>${esc(t('breakdown'))}</b><div class="tbl-wrap"><table class="tbl"><tbody>${(f.members || []).map(m => { const r = rateFor(m, f, p); return `<tr><td>${esc(m.name || '—')}<div class="small muted">${esc(r ? r.name : t('noRate'))}</div></td><td>${tk(r ? r.amount : 0)}</td></tr>`; }).join('')}</tbody>
      <tfoot><tr><td>${esc(t('byRate'))}</td><td>${tk(famRateSum(f, p))}</td></tr>${f.due != null && f.due !== '' ? `<tr><td>${esc(t('special'))}</td><td>${tk(f.due)}</td></tr>` : ''}</tfoot></table></div></div>`;
    }
  });
}
async function savePayment(fid, root, id){
  const x = readPay(root);
  if (!x.amount) { toast(t('amount')); $('#pAmt', root).focus(); return false; }
  const prev = id ? S.pay.find(p => p.id === id) : null;
  const doc = Object.assign({ fid }, x, { at: prev ? prev.at || Date.now() : Date.now(), by: myName() });
  return commit(id ? 'editPayment' : 'addPayment', [{ path: payPath(), id: id || DB.rid(), data: doc }]);
}
function openPayEdit(id){
  const x = S.pay.find(p => p.id === id); if (!x) return;
  openSheet({ title: t('editPayment'), body: () => payForm(x),
    foot: () => `<button class="btn danger" data-a="payDel" data-id="${id}" style="flex:0 0 auto" aria-label="${esc(t('del'))}">${ic('trash')}</button><button class="btn" data-a="payUpdate" data-id="${id}">${ic('check')}${esc(t('save'))}</button>` });
}

/* ---------- notes ---------- */
function notesView(){
  const ns = S.notes.slice().sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (b.upd || b.at || 0) - (a.upd || a.at || 0));
  return `<div class="sec-h"><h2>${esc(t('t_notes'))}</h2></div>
  ${!ns.length ? emptyBox('note', t('noNotes'), can('notes') ? `<button class="btn" data-a="noteNew">${ic('plus')}${esc(t('newNote'))}</button>` : '') :
  `<div class="grid-auto">${ns.map(n => `<article class="card note-card tap" data-a="noteOpen" data-id="${n.id}" role="button" tabindex="0">
    <div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h3 style="margin:0;overflow-wrap:anywhere">${esc(n.title || t('note'))}</h3>${n.pin ? `<span style="width:18px;height:18px;color:var(--brand);flex:none">${ic('pin')}</span>` : ''}</div>
    <div class="note-body" style="margin-top:6px;max-height:9.5em;overflow:hidden">${esc(n.body || '')}</div>
    <div class="small muted" style="margin-top:8px">${esc([n.by, n.upd ? new Date(n.upd).toLocaleString(P.lang === 'bn' ? 'bn-BD' : 'en-GB', {day:'numeric', month:'short', hour:'numeric', minute:'2-digit'}) : ''].filter(Boolean).join(' · '))}</div></article>`).join('')}</div>`}`;
}
function openNote(id){
  const n = id ? S.notes.find(x => x.id === id) : null; const editable = can('notes');
  if (!editable) { if (n) openSheet({ title: n.title || t('note'), body: () => `<div class="note-body">${esc(n.body || '')}</div><div class="note-box small">${esc(t('readOnly'))}</div>` }); return; }
  openSheet({ title: n ? t('edit') : t('newNote'),
    body: () => `<div class="field"><label for="nTitle">${esc(t('title'))}</label><input class="in" id="nTitle" value="${esc(n ? n.title || '' : '')}"></div>
      <div class="field"><label for="nBody">${esc(t('noteText'))}</label><textarea class="in" id="nBody" style="min-height:220px">${esc(n ? n.body || '' : '')}</textarea></div>
      <label class="row" style="justify-content:space-between"><span>${esc(t('pin'))}</span><span class="switch"><input type="checkbox" id="nPin" ${n && n.pin ? 'checked' : ''}><i></i></span></label>`,
    foot: () => `${n ? `<button class="btn danger" data-a="noteDel" data-id="${n.id}" style="flex:0 0 auto" aria-label="${esc(t('del'))}">${ic('trash')}</button>` : ''}<button class="btn" data-a="noteSave" data-id="${n ? n.id : ''}">${ic('check')}${esc(t('save'))}</button>` });
}

/* ---------- more ---------- */
function moreView(){
  const p = prog(); const me = S.profile;
  const item = (a, icon, label, sub, extra) => `<div class="item tap" data-a="${a}" ${extra || ''} role="button" tabindex="0"><div class="avatar" style="background:var(--brand-soft);color:var(--brand)"><span style="width:22px;height:22px;display:inline-flex">${ic(icon)}</span></div><div class="body"><div class="title">${esc(label)}</div>${sub ? `<div class="small muted">${esc(sub)}</div>` : ''}</div><span style="width:18px;height:18px;color:var(--muted);display:inline-flex">${ic('right')}</span></div>`;
  return `<section class="card"><div class="row">${avatar(me.name || me.email, 0)}<div class="grow"><div class="title strong">${esc(me.name || me.email)}</div><div class="small muted" style="overflow-wrap:anywhere">${esc(me.email || '')}</div></div><span class="pill info">${esc(isAdmin() ? t('r_admin') : t('r_org'))}</span></div></section>
  <section class="card" style="padding-block:4px"><div class="list">
    ${item('progPicker', 'grid', t('allPrograms'), p ? p.name : '')}
    ${p && isAdmin() ? item('progEdit', 'edit', t('basicInfo'), [t('ty_' + (p.type || 'other')), fd(p.date)].filter(Boolean).join(' · ')) : ''}
    ${p && isAdmin() ? item('ageGroups', 'baby', t('ageGroups'), (p.ageGroups || []).map(g => g.name).join(', ')) : ''}
    ${p && isAdmin() ? item('giftGroups', 'gift', t('giftGroups'), (p.giftGroups || []).map(g => g.name).join(', ')) : ''}
    ${p && isAdmin() ? item('rates', 'coins', t('rates'), (p.rates || []).map(r => r.name).join(', ')) : ''}
    ${p && isAdmin() ? item('depts', 'building', t('depts'), deptsOf(p).join(', ')) : ''}
    ${p && isAdmin() ? item('cats', 'tag', t('categories'), (p.categories || []).join(', ')) : ''}
  </div></section>
  <section class="card" style="padding-block:4px"><div class="list">
    ${p ? item('tab', 'note', t('t_notes'), nf(S.notes.length), 'data-v="notes"') : ''}
    ${p ? item('tab', 'scale', t('settle'), '', 'data-v="settle"') : ''}
    ${p ? item('tab', 'pie', t('budget'), tk(budTotals().total), 'data-v="spend" data-spend="bud"') : ''}
    ${p ? item('tab', 'gift', t('gifts'), nf(S.gifts.length), 'data-v="spend" data-spend="gift"') : ''}
    ${p ? item('tab', 'bus', t('buses'), t('famN', nf(S.fam.filter(f => busOf(f)).length)) + ' / ' + nf(S.fam.length), 'data-v="bus"') : ''}
    ${p ? item('tab', 'shirt', t('tshirt'), tsStats().total ? t('tsTotalN', nf(tsStats().total)) : '', 'data-v="tshirt"') : ''}
    ${p ? item('exportOpen', 'download', t('excel'), '') : ''}
    ${item('backupOpen', 'history', t('backup'), '')}
    ${DB.mode === 'firebase' ? item('diagOpen', 'cloud', t('diagTitle'), '') : ''}
    ${item('appearance', 'palette', t('appearance'), `${(THEMES.find(x => x.id === themeId()) || {})[P.lang] || ''} · ${(FONTS_BN.find(f => f.id === P.fontBn) || {}).name || ''}`)}
    ${isAdmin() ? item('usersOpen', 'shield', t('users'), t('peopleN', nf(S.users.length))) : ''}
    ${item('historyOpen', 'history', t('history'), S.undo.length ? nf(S.undo.length) : t('noHistory'))}
  </div></section>
  <div class="seg" role="group" aria-label="${esc(t('language'))}"><button class="${P.lang === 'bn' ? 'on' : ''}" data-a="lang" data-l="bn">বাংলা</button><button class="${P.lang === 'en' ? 'on' : ''}" data-a="lang" data-l="en">English</button></div>
  ${p && isAdmin() ? `<button class="btn danger" data-a="progDel">${ic('trash')}${esc(t('delProgram'))}</button>` : ''}
  ${DB.mode === 'demo' ? `<section class="card flat stack"><b>${esc(t('demoMode'))}</b><span class="small muted">${esc(t('demoNote'))}</span><div class="row"><button class="btn ghost sm" data-a="demoReset">${esc(t('resetDemo'))}</button><button class="btn ghost sm" data-a="demoClear">${esc(t('clearDemo'))}</button></div></section>` : ''}
  <button class="btn ghost" data-a="signOut">${ic('logout')}${esc(t('signOut'))}</button>`;
}

/* ---------- program picker & settings ---------- */
function openProgPicker(){
  openSheet({ title: t('allPrograms'), body: () => `${S.programs.length ? `<div class="stack">${S.programs.map(p => `<div class="card prog-card tap" data-a="progPick" data-id="${p.id}" role="button" tabindex="0" style="padding-left:20px"><span class="stripe"></span>
      <div class="row" style="justify-content:space-between"><b>${esc(p.name)}</b>${p.id === S.pid ? `<span class="pill ok">${esc(t('current'))}</span>` : ''}</div>
      <div class="small muted">${[t('ty_' + (p.type || 'other')), fd(p.date), p.venue].filter(Boolean).map(esc).join(' · ')}</div></div>`).join('')}</div>` : `<p class="muted">${esc(isAdmin() ? t('noPrograms') : t('noProgramsOrg'))}</p>`}`,
    foot: () => isAdmin() ? `<button class="btn" data-a="progNew">${ic('plus')}${esc(t('newProgram'))}</button>` : '' });
}
function openProgForm(id){
  const p = id ? prog() : null;
  openSheet({ title: p ? t('basicInfo') : t('newProgram'),
    body: () => `<div class="field"><label for="gName">${esc(t('progName'))}</label><input class="in" id="gName" value="${esc(p ? p.name : '')}" placeholder="${P.lang === 'bn' ? 'যেমন: বার্ষিক পিকনিক ২০২৬' : 'e.g. Annual picnic 2026'}"></div>
      <div class="field"><label>${esc(t('progType'))}</label><div class="seg">${['picnic','farewell','other'].map(x => `<button type="button" class="${(p ? p.type : 'picnic') === x ? 'on' : ''}" data-a="segPick" data-v="${x}">${esc(t('ty_' + x))}</button>`).join('')}</div></div>
      <div class="grid2"><div class="field"><label for="gDate">${esc(t('date'))}</label><input class="in" id="gDate" type="date" value="${esc(p ? p.date || '' : '')}"></div><div class="field"><label for="gVenue">${esc(t('venue'))}</label><input class="in" id="gVenue" value="${esc(p ? p.venue || '' : '')}"></div></div>
      ${!p && S.programs.length ? `<div class="field"><label for="gCopy">${esc(t('copyFrom'))}</label><select class="in" id="gCopy"><option value="">${esc(t('none'))}</option>${S.programs.map(x => `<option value="${x.id}">${esc(x.name)}</option>`).join('')}</select></div>` : ''}
      <div class="field"><label for="gNote">${esc(t('progNote'))}</label><textarea class="in" id="gNote">${esc(p ? p.note || '' : '')}</textarea></div>`,
    foot: () => `<button class="btn" data-a="progSave" data-id="${p ? p.id : ''}">${ic('check')}${esc(t('save'))}</button>` });
}
async function saveProg(id, root){
  const name = $('#gName', root).value.trim(); if (!name) { toast(t('needName')); $('#gName', root).focus(); return; }
  const type = ($('[data-a="segPick"].on', root) || {}).dataset ? $('[data-a="segPick"].on', root).dataset.v : 'picnic';
  const prev = id ? S.programs.find(x => x.id === id) : null;
  let doc = Object.assign({}, prev ? strip(prev) : { ageGroups:[], rates:[], categories: P.lang === 'bn' ? ['কনসালটেন্ট','ডাক্তার','সিস্টার','স্টাফ','অতিথি'] : ['Consultant','Doctor','Sister','Staff','Guest'], createdAt: Date.now(), createdBy: myName() },
    { name, type, date: $('#gDate', root).value, venue: $('#gVenue', root).value.trim(), note: $('#gNote', root).value.trim(), updatedAt: Date.now() });
  const copy = $('#gCopy', root) && $('#gCopy', root).value;
  if (copy) { const src = S.programs.find(x => x.id === copy); if (src) { doc.ageGroups = JSON.parse(JSON.stringify(src.ageGroups || [])); doc.giftGroups = JSON.parse(JSON.stringify(src.giftGroups || [])); doc.buses = JSON.parse(JSON.stringify(src.buses || [])); if (Array.isArray(src.depts)) doc.depts = src.depts.slice(); if (src.seatAge != null) doc.seatAge = src.seatAge; if (src.tshirt) doc.tshirt = Object.assign(JSON.parse(JSON.stringify(src.tshirt)), { extra: {}, bud: '' }); if (Array.isArray(src.dash)) doc.dash = JSON.parse(JSON.stringify(src.dash)); doc.rates = JSON.parse(JSON.stringify(src.rates || [])); doc.categories = (src.categories || []).slice(); } }
  const pid = id || DB.rid(); const ops = [{ path:'programs', id: pid, data: doc }];
  if (copy) { try { const src = await DB.getAll(`programs/${copy}/budgets`); const map = {}; src.forEach(b => { map[b.id] = DB.rid(); });
    src.forEach(b => { const d = strip(b); d.parent = d.parent ? (map[d.parent] || '') : ''; d.at = Date.now(); ops.push({ path: `programs/${pid}/budgets`, id: map[b.id], data: d }); });
    const gs = await DB.getAll(`programs/${copy}/gifts`); gs.forEach(g => { const d = strip(g); d.bud = d.bud ? (map[d.bud] || '') : ''; d.given = {}; d.bought = 0; d.at = Date.now(); ops.push({ path: `programs/${pid}/gifts`, id: DB.rid(), data: d }); }); } catch(e) {} }
  if (await commit(id ? 'editProgram' : 'addProgram', ops)) { closeAll(); if (!id) { setProgram(pid); S.view = 'home'; render(); } }
}
async function patchProg(fields){ const p = prog(); if (!p) return false; return commit('editProgram', [{ path:'programs', id:p.id, data: Object.assign(strip(p), fields, { updatedAt: Date.now() }) }]); }

function groupRow(g){ return `<div class="mem" data-gid="${esc(g.id)}"><div class="mem-top"><input class="in g-name" placeholder="${esc(t('groupName'))}" value="${esc(g.name || '')}" aria-label="${esc(t('groupName'))}"><button type="button" class="iconbtn" style="background:var(--bad-soft);color:var(--bad)" data-a="rowDel" aria-label="${esc(t('del'))}">${ic('trash')}</button></div>
  <div class="grid2"><div class="field"><label>${esc(t('fromAge'))}</label><input class="in g-min" inputmode="decimal" value="${g.min == null ? '' : esc(g.min)}" placeholder="${nf(0)}"></div><div class="field"><label>${esc(t('belowAge'))}</label><input class="in g-max" inputmode="decimal" value="${g.max == null ? '' : esc(g.max)}" placeholder="${esc(t('noLimit'))}"></div></div><div class="small muted g-lbl"></div></div>`; }
function openAgeGroups(kind){
  const p = prog(); const gift = kind === 'gift'; const gs = (gift ? p.giftGroups : p.ageGroups) || [];
  const upd = el => $$('[data-gid]', el).forEach(r => { $('.g-lbl', r).textContent = rangeLabel(parseNum($('.g-min', r).value), parseNum($('.g-max', r).value)); });
  openSheet({ title: gift ? t('giftGroups') : t('ageGroups'), body: () => `<p class="small muted" style="margin:0">${esc(gift ? t('giftGroupsHint') : t('ageHint'))}</p><div class="stack" id="rows">${gs.map(groupRow).join('')}</div><button type="button" class="btn ghost" data-a="groupAdd">${ic('plus')}${esc(t('addGroup'))}</button>`,
    foot: () => `<button class="btn" data-a="groupsSave" data-k="${gift ? 'gift' : ''}">${ic('check')}${esc(t('save'))}</button>`, mount: el => { upd(el); el.addEventListener('input', () => upd(el)); }, upd });
}
function rateRow(r, cats){
  return `<div class="mem" data-rid="${esc(r.id)}"><div class="mem-top"><input class="in r-name" placeholder="${esc(t('rateName'))}" value="${esc(r.name || '')}" aria-label="${esc(t('rateName'))}">
    <button type="button" class="iconbtn" style="background:var(--surface-2);color:var(--ink)" data-a="rowUp" aria-label="up">${ic('up')}</button><button type="button" class="iconbtn" style="background:var(--surface-2);color:var(--ink)" data-a="rowDown" aria-label="down">${ic('down')}</button><button type="button" class="iconbtn" style="background:var(--bad-soft);color:var(--bad)" data-a="rowDel" aria-label="${esc(t('del'))}">${ic('trash')}</button></div>
    <div class="field"><label>${esc(t('perHead'))}</label>${calcInput('', r.amount, 'r-amt')}</div>
    <div class="grid2"><select class="in r-side" aria-label="${esc(t('side'))}"><option value="any">${esc(t('anySide'))}</option><option value="in" ${r.side === 'in' ? 'selected' : ''}>${esc(t('inside'))}</option><option value="out" ${r.side === 'out' ? 'selected' : ''}>${esc(t('outside'))}</option></select>
    <select class="in r-cat" aria-label="${esc(t('category'))}"><option value="">${esc(t('anyCat'))}</option>${cats.map(c => `<option ${r.cat === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
    <div class="field"><label>${esc(t('fromAge'))}</label><input class="in r-min" inputmode="decimal" value="${r.min == null ? '' : esc(r.min)}" placeholder="—"></div><div class="field"><label>${esc(t('belowAge'))}</label><input class="in r-max" inputmode="decimal" value="${r.max == null ? '' : esc(r.max)}" placeholder="${esc(t('noLimit'))}"></div></div></div>`;
}
function openRates(){
  const p = prog(); const cats = p.categories || [];
  openSheet({ title: t('rates'), cats, body: () => `<p class="small muted" style="margin:0">${esc(t('ratesHint'))}</p><div class="stack" id="rows">${(p.rates || []).map(r => rateRow(r, cats)).join('')}</div><button type="button" class="btn ghost" data-a="rateAdd">${ic('plus')}${esc(t('addRate'))}</button>`,
    foot: () => `<button class="btn" data-a="ratesSave">${ic('check')}${esc(t('save'))}</button>` });
}
function openCats(){
  const p = prog();
  openSheet({ title: t('categories'), body: () => `<p class="small muted" style="margin:0">${esc(t('catHint'))}</p><textarea class="in" id="catsTxt" style="min-height:200px">${esc((p.categories || []).join('\n'))}</textarea>`,
    foot: () => `<button class="btn" data-a="catsSave">${ic('check')}${esc(t('save'))}</button>` });
}

/* ---------- appearance ---------- */
function openAppearance(){
  const themeBtn = th => `<button class="th ${themeId() === th.id && P.theme !== 'auto' ? 'on' : ''}" data-a="setTheme" data-v="${th.id}" aria-label="${esc(th[P.lang])}"><div class="sw" style="background:linear-gradient(135deg,${th.c[0]},${th.c[1]})">${th.c.map((c, i) => `<i style="left:${8 + i * 12}px;background:${c}"></i>`).join('')}</div><span>${esc(th[P.lang])}</span></button>`;
  openSheet({ title: t('appearance'), kind:'appearance', body: () => `
    <div class="field"><label>${esc(t('dayThemes'))}</label><div class="themes">${THEMES.filter(x => !x.dark).map(themeBtn).join('')}</div></div>
    <div class="field"><label>${esc(t('nightThemes'))}</label><div class="themes">${THEMES.filter(x => x.dark).map(themeBtn).join('')}</div></div>
    <div class="field"><label>${esc(t('fontBn'))}</label><div class="stack">${FONTS_BN.map(f => `<button class="fontopt ${P.fontBn === f.id ? 'on' : ''}" data-a="setFontBn" data-v="${f.id}"><span class="sample" style="font-family:${esc(f.css)},sans-serif">আমাদের পিকনিক ১২৩</span><span class="small muted">${esc(f.name)}</span></button>`).join('')}</div></div>
    <div class="field"><label>${esc(t('fontEn'))}</label><div class="stack">${FONTS_EN.map(f => `<button class="fontopt ${P.fontEn === f.id ? 'on' : ''}" data-a="setFontEn" data-v="${f.id}"><span class="sample" style="font-family:${esc(f.css)},sans-serif">Picnic 2026</span><span class="small muted">${esc(f.name)}</span></button>`).join('')}</div></div>
    <div class="field"><label>${esc(t('weight'))}</label><div class="seg"><button class="${!P.bold ? 'on' : ''}" data-a="setBold" data-v="0">${esc(t('w_normal'))}</button><button class="${P.bold ? 'on' : ''}" data-a="setBold" data-v="1" style="font-weight:800">${esc(t('w_bold'))}</button></div></div>
    <div class="field"><label>${esc(t('size'))}</label><div class="seg">${['s','m','l'].map(s => `<button class="${P.size === s ? 'on' : ''}" data-a="setSize" data-v="${s}">${esc(t('s_' + s))}</button>`).join('')}</div></div>
    <div class="field"><label>${esc(t('language'))}</label><div class="seg"><button class="${P.lang === 'bn' ? 'on' : ''}" data-a="lang" data-l="bn">বাংলা</button><button class="${P.lang === 'en' ? 'on' : ''}" data-a="lang" data-l="en">English</button></div></div>` });
}

/* ---------- users ---------- */
const PERMS = ['members','chanda','notes','expense','sponsor','gift'];
function openUsers(){
  openSheet({ title: t('users'), kind:'users', body: () => `<div class="card" style="padding-block:4px"><div class="list">${S.users.map((u, i) => `<div class="item tap" data-a="userEdit" data-id="${u.id}" role="button" tabindex="0">${avatar(u.name || u.email, i)}<div class="body"><div class="title">${esc(u.name || u.email)}${u.id === S.user.uid ? ` <span class="small muted">(${esc(t('you'))})</span>` : ''}</div><div class="small muted" style="overflow-wrap:anywhere">${esc(u.email || '')}</div>
      ${u.role !== 'admin' ? `<div class="chips">${PERMS.filter(k => (u.perms || {})[k]).map(k => `<span class="chip">${esc(t('p_' + k))}</span>`).join('')}</div>` : ''}</div>
      <span class="pill ${u.active === false ? 'bad' : u.role === 'admin' ? 'info' : 'ok'}">${esc(u.active === false ? '✕' : u.role === 'admin' ? t('r_admin') : t('r_org'))}</span></div>`).join('')}</div></div>`,
    foot: () => `<button class="btn" data-a="userNew">${ic('plus')}${esc(t('addUser'))}</button>` });
}
function permSwitches(u){ return `<div class="field"><label>${esc(t('perms'))}</label><div class="card flat stack">${PERMS.map(k => `<label class="row" style="justify-content:space-between"><span>${esc(t('p_' + k))}</span><span class="switch"><input type="checkbox" class="perm" data-k="${k}" ${(u.perms || {})[k] ? 'checked' : ''}><i></i></span></label>`).join('')}</div></div>`; }
function openUserForm(id){
  const u = id ? S.users.find(x => x.id === id) : null; const self = u && u.id === S.user.uid;
  openSheet({ title: u ? (u.name || u.email) : t('addUser'), body: () => `<p class="small muted" style="margin:0">${esc(t('userHint'))}</p>
    <div class="field"><label for="uName">${esc(t('name'))}</label><input class="in" id="uName" value="${esc(u ? u.name || '' : '')}"></div>
    ${u ? `<div class="small muted">${esc(u.email || '')}</div>` : `<div class="field"><label for="uEmail">${esc(t('gmail'))}</label><input class="in" id="uEmail" type="email" autocomplete="off" inputmode="email" autocapitalize="off"></div>`}
    ${!self ? `<div class="field"><label>${esc(t('r_admin'))} / ${esc(t('r_org'))}</label><div class="seg"><button type="button" class="${!u || u.role !== 'admin' ? 'on' : ''}" data-a="segPick" data-v="organizer">${esc(t('r_org'))}</button><button type="button" class="${u && u.role === 'admin' ? 'on' : ''}" data-a="segPick" data-v="admin">${esc(t('r_admin'))}</button></div></div>
      ${permSwitches(u || { perms:{ members:true, chanda:true, notes:true } })}
      ${u ? `<label class="row" style="justify-content:space-between"><span>${esc(t('active'))}</span><span class="switch"><input type="checkbox" id="uActive" ${u.active !== false ? 'checked' : ''}><i></i></span></label>` : ''}` : ''}`,
    foot: () => `<button class="btn" data-a="userSave" data-id="${u ? u.id : ''}">${ic('check')}${esc(t('save'))}</button>` });
}
async function saveUser(id, root){
  const name = $('#uName', root).value.trim(); if (!name) { toast(t('needName')); return; }
  const roleBtn = $('[data-a="segPick"].on', root);
  const perms = {}; $$('.perm', root).forEach(c => { perms[c.dataset.k] = c.checked; });
  if (id) {
    const u = S.users.find(x => x.id === id); const self = id === S.user.uid;
    const doc = Object.assign(strip(u), { name }, self ? {} : { role: roleBtn ? roleBtn.dataset.v : u.role, perms, active: $('#uActive', root) ? $('#uActive', root).checked : true });
    if (await commit('editUser', [{ path:'users', id, data: doc }])) closeSheet();
    return;
  }
  const email = $('#uEmail', root).value.trim().toLowerCase();
  if (!/^[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+$/.test(email)) { toast(t('needEmail')); return; }
  if (S.users.some(u => u.id === email || (u.email || '').toLowerCase() === email)) { toast(t('userExists')); return; }
  if (await commit('addUser', [{ path:'users', id: email, data: { email, name, role: roleBtn ? roleBtn.dataset.v : 'organizer', perms, active:true } }])) closeSheet();
}

/* ---------- history ---------- */
const LABELS = { bn:{ addUser:'ব্যবহারকারী যোগ', addFamily:'পরিবার যোগ', editFamily:'পরিবার সম্পাদনা', delFamily:'পরিবার মুছে ফেলা', addPayment:'টাকা জমা', editPayment:'জমা সম্পাদনা', delPayment:'জমা মুছে ফেলা', addNote:'নোট যোগ', editNote:'নোট সম্পাদনা', delNote:'নোট মুছে ফেলা', addProgram:'প্রোগ্রাম যোগ', editProgram:'প্রোগ্রাম সম্পাদনা', editDepts:'বিভাগ বদল', delProgram:'প্রোগ্রাম মুছে ফেলা', editUser:'ব্যবহারকারী সম্পাদনা', addBudget:'বাজেট খাত যোগ', editBudget:'বাজেট খাত সম্পাদনা', delBudget:'বাজেট খাত মুছে ফেলা', addExpense:'খরচ যোগ', editExpense:'খরচ সম্পাদনা', delExpense:'খরচ মুছে ফেলা', addSponsor:'স্পন্সর যোগ', editSponsor:'স্পন্সর সম্পাদনা', delSponsor:'স্পন্সর মুছে ফেলা', addTransfer:'লেনদেন যোগ', editTransfer:'লেনদেন সম্পাদনা', delTransfer:'লেনদেন মুছে ফেলা', addGift:'উপহার যোগ', editGift:'উপহার সম্পাদনা', delGift:'উপহার মুছে ফেলা', giveGift:'উপহার দেওয়ার চিহ্ন' },
  en:{ addUser:'User added', addFamily:'Family added', editFamily:'Family edited', delFamily:'Family deleted', addPayment:'Payment added', editPayment:'Payment edited', delPayment:'Payment deleted', addNote:'Note added', editNote:'Note edited', delNote:'Note deleted', addProgram:'Program added', editDepts:'Departments changed', editProgram:'Program edited', delProgram:'Program deleted', editUser:'User edited', addBudget:'Budget line added', editBudget:'Budget line edited', delBudget:'Budget line deleted', addExpense:'Expense added', editExpense:'Expense edited', delExpense:'Expense deleted', addSponsor:'Sponsor added', editSponsor:'Sponsor edited', delSponsor:'Sponsor deleted', addTransfer:'Transfer added', editTransfer:'Transfer edited', delTransfer:'Transfer deleted', addGift:'Gift added', editGift:'Gift edited', delGift:'Gift deleted', giveGift:'Gift handed out' } };
function openHistory(){
  openSheet({ title: t('history'), body: () => S.undo.length ? `<div class="card" style="padding-block:4px"><div class="list">${S.undo.slice().reverse().map((e, i) => `<div class="item"><div class="body"><div class="title">${esc((LABELS[P.lang] || LABELS.bn)[e.label] || e.label)}</div><div class="small muted">${esc(new Date(e.at).toLocaleTimeString(P.lang === 'bn' ? 'bn-BD' : 'en-GB', {hour:'numeric', minute:'2-digit'}))}</div></div>${i === 0 ? `<button class="btn sm" data-a="undo">${ic('undo')}${esc(t('undo'))}</button>` : ''}</div>`).join('')}</div></div>` : `<p class="muted">${esc(t('noHistory'))}</p>` });
}

/* ---------- share ---------- */
function summaryText(){
  const p = prog(), s = stats(); const L = [];
  L.push(`*${p.name}*`); const meta = [fd(p.date), p.venue].filter(Boolean).join(' · '); if (meta) L.push(meta); L.push('');
  L.push(`${t('totalPeople')}: ${nf(s.persons)} (${t('famN', nf(s.fams))})`);
  L.push(`${t('inside')}: ${nf(s.inn)} · ${t('outsideShort')}: ${nf(s.out)}`);
  L.push(`${t('male')}: ${nf(s.m)} · ${t('female')}: ${nf(s.f)}`);
  if (s.groups.length) { L.push(''); L.push(`*${t('byAge')}*`); s.groups.forEach(G => L.push(`${G.g.name} (${rangeLabel(G.g.min, G.g.max)}): ${nf(G.total)} — ${t('male')} ${nf(G.m)}, ${t('female')} ${nf(G.f)}`)); if (s.unknown) L.push(`${t('unknownAge')}: ${nf(s.unknown)}`); }
  L.push(''); L.push(`*${t('t_chanda')}*`); L.push(`${t('due')}: ${tk(s.due)}`); L.push(`${t('collected')}: ${tk(s.paid)}`); L.push(`${t('remaining')}: ${tk(Math.max(0, s.due - s.paid))}`);
  if (S.gifts.length) { const G = giftTotals(); L.push(''); L.push(`*${t('gifts')}*`); L.push(`${t('need')} ${nf(G.need)} · ${t('bought')} ${nf(G.bought)} · ${t('given')} ${nf(G.given)}`); }
  const m = money(), bt = budTotals(); L.push(''); L.push(`*${t('money')}*`); L.push(`${t('income')}: ${tk(m.income)} (${t('t_chanda')} ${tk(m.paid)} + ${t('sponsors')} ${tk(m.spRecv)})`); L.push(`${t('spent')}: ${tk(m.spent)}${bt.total ? ` / ${t('budTotal')} ${tk(bt.total)}` : ''}`); L.push(`${m.bal >= 0 ? t('inHand') : t('deficit')}: ${tk(Math.abs(m.bal))}`);
  return L.join('\n');
}
function namesText(){
  const p = prog(); const L = [`*${p.name}* — ${t('nameList')}`, '']; let n = 0;
  filteredFams(S.q).forEach(f => (f.members || []).forEach((m, j) => { n++; L.push(`${nf(n)}. ${m.name || '—'}${ageNum(m.age) != null ? ` (${nf(m.age)})` : ''}${j ? ` — ${relLabel(m.rel)}, ${famName(f)}` : (f.cat ? ` — ${f.cat}` : '')}`); }));
  return L.join('\n');
}
function openShare(text, title){
  openSheet({ title: title || t('share'), text, body: () => `<p class="small muted" style="margin:0">${esc(t('shareHint'))}</p><textarea class="in" id="shareTxt" style="min-height:240px" readonly>${esc(text)}</textarea>
    <a class="btn" style="text-decoration:none;background:#25d366;color:#05310f" href="https://wa.me/?text=${encodeURIComponent(text)}" target="_blank" rel="noopener">${ic('share')}${esc(t('whatsapp'))}</a>
    <button class="btn ghost" data-a="nativeShare">${ic('share')}${esc(t('otherApps'))}</button>
    <button class="btn ghost" data-a="copyShare">${ic('copy')}${esc(t('copy'))}</button>
    <button class="btn ghost" data-a="exportOpen">${ic('download')}${esc(t('excel'))}</button>` });
}

/* ---------- calculator ---------- */
function calcInput(id, val, cls){ return `<div class="in-calc"><input class="in ${cls || ''}" ${id ? `id="${id}"` : ''} inputmode="decimal" value="${val == null || val === '' ? '' : esc(val)}"><button type="button" class="calc-btn" data-a="calcOpen" aria-label="${esc(t('calc'))}">${ic('calc')}</button></div>`; }
function evalExpr(src){
  const s = src.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'); let i = 0;
  const peek = () => s[i], num = () => { let st = i; while (i < s.length && /[0-9.]/.test(s[i])) i++; if (st === i) throw 0; let v = parseFloat(s.slice(st, i)); if (s[i] === '%') { i++; v = v / 100; } return v; };
  const factor = () => { if (peek() === '-') { i++; return -factor(); } if (peek() === '(') { i++; const v = expr(); if (s[i] === ')') i++; return v; } return num(); };
  const term = () => { let v = factor(); while (peek() === '*' || peek() === '/') { const o = s[i++]; const r = factor(); v = o === '*' ? v * r : v / r; } return v; };
  const expr = () => { let v = term(); while (peek() === '+' || peek() === '-') { const o = s[i++]; const r = term(); v = o === '+' ? v + r : v - r; } return v; };
  const v = expr(); if (i < s.length) throw 0; return Math.round(v * 100) / 100;
}
function openCalc(target){
  let ex = String(parseNum(target.value) == null ? '' : parseNum(target.value));
  const disp = el => { let r = ''; try { r = ex ? nf(evalExpr(ex)) : ''; } catch(e) { r = '…'; } $('.expr', el).textContent = ex.replace(/[0-9]/g, d => P.lang === 'bn' ? '০১২৩৪৫৬৭৮৯'[d] : d) || ' '; $('.res', el).textContent = r || nf(0); };
  const K = ['C','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','00','0','.','='];
  const lbl = k => P.lang === 'bn' ? k.replace(/[0-9]/g, d => '০১২৩৪৫৬৭৮৯'[d]) : k;
  openSheet({ title: t('calc'), body: () => `<div class="calc-disp"><div class="expr"></div><div class="res"></div></div><div class="keys">${K.map(k => `<button type="button" class="${'÷×−+%'.includes(k) ? 'op' : k === '=' ? 'eq' : ''}" data-k="${k}">${esc(lbl(k))}</button>`).join('')}</div>`,
    foot: () => `<button class="btn" data-a="calcInsert">${ic('check')}${esc(t('insert'))}</button>`,
    mount: el => { disp(el); $('.keys', el).addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k;
      if (k === 'C') ex = ''; else if (k === '⌫') ex = ex.slice(0, -1); else if (k === '=') { try { ex = String(evalExpr(ex)); } catch(er) {} } else ex += k; disp(el); }); },
    insert: () => { let v; try { v = ex ? evalExpr(ex) : ''; } catch(e) { return; } target.value = v === '' ? '' : String(v); target.dispatchEvent(new Event('input', { bubbles:true })); closeSheet(); } });
}

/* ================= phase 2: budget, expenses, sponsors, settle-up ================= */
const sum = (arr, f) => arr.reduce((s, x) => s + (Number(f ? f(x) : x.amount) || 0), 0);
const dateDesc = (x, y) => String(y.date || '').localeCompare(String(x.date || '')) || (y.at || 0) - (x.at || 0);
const byOrder = (a, b) => (a.order || 0) - (b.order || 0) || (a.at || 0) - (b.at || 0);
const fdShort = d => { if (!d) return ''; const dt = new Date(d + 'T00:00:00'); return isNaN(dt) ? d : dt.toLocaleDateString(P.lang === 'bn' ? 'bn-BD' : 'en-GB', {day:'numeric', month:'short'}); };
const tileH = (k, v, style) => `<div class="tile"><div class="k">${esc(k)}</div><div class="v num" style="font-size:1.15rem;${style || ''}">${v}</div></div>`;
const lineOf = e => (e.bud && S.bud.find(b => b.id === e.bud)) ? e.bud : '';
function budTree(){ const ids = new Set(S.bud.map(b => b.id)); return S.bud.filter(b => !b.parent || !ids.has(b.parent)).sort(byOrder).map(b => ({ b, kids: S.bud.filter(x => x.parent === b.id).sort(byOrder) })); }
function spentOn(id){ return sum(S.exp.filter(e => lineOf(e) === id)); }
function budLine(b, kids){ const own = Number(b.amount) || 0; const amt = own > 0 ? own : sum(kids); return { amt, spent: spentOn(b.id) + kids.reduce((s, k) => s + spentOn(k.id), 0) }; }
function budTotals(){ let total = 0; budTree().forEach(n => { total += budLine(n.b, n.kids).amt; }); return { total }; }
function budName(id){ const b = S.bud.find(x => x.id === id); if (!b) return t('noLine'); const p = b.parent && S.bud.find(x => x.id === b.parent); return p ? `${p.name} › ${b.name}` : b.name; }
const barCls = (spent, amt) => { const r = amt > 0 ? spent / amt : (spent > 0 ? 2 : 0); return r > 1 ? 'bad' : r >= 0.8 ? 'warn' : 'ok'; };
const barW = (spent, amt) => amt > 0 ? Math.min(100, spent / amt * 100) : (spent > 0 ? 100 : 0);
function money(){
  const s = stats(); const cash = S.sp.filter(x => x.kind !== 'kind'), kind = S.sp.filter(x => x.kind === 'kind');
  const spRecv = sum(cash.filter(x => x.status === 'received')), spProm = sum(cash.filter(x => x.status !== 'received')), spent = sum(S.exp);
  return { due: s.due, paid: s.paid, spRecv, spProm, kindN: kind.length, kindVal: sum(kind, x => x.value), income: s.paid + spRecv, spent, bal: s.paid + spRecv - spent };
}
function knownPeople(){ const n = new Set(); const a = v => { v = (v || '').trim(); v && n.add(v); }; S.users.forEach(u => a(u.name)); S.pay.forEach(x => a(x.recv)); S.exp.forEach(x => a(x.paidBy)); S.sp.forEach(x => a(x.recv)); S.st.forEach(x => { a(x.from); a(x.to); }); return Array.from(n).sort(); }
const peopleDL = () => `<datalist id="peopleList">${knownPeople().map(n => `<option value="${esc(n)}">`).join('')}</datalist>`;
function budOptions(sel, filter){
  const o = [];
  if (filter) o.push(`<option value="" ${!sel ? 'selected' : ''}>${esc(t('allLines'))}</option>`);
  o.push(`<option value="${filter ? '_none' : ''}" ${(filter ? sel === '_none' : !sel) ? 'selected' : ''}>${esc(t('noLine'))}</option>`);
  budTree().forEach(nd => { o.push(`<option value="${nd.b.id}" ${sel === nd.b.id ? 'selected' : ''}>${esc(nd.b.name)}</option>`); nd.kids.forEach(k => o.push(`<option value="${k.id}" ${sel === k.id ? 'selected' : ''}>   ↳ ${esc(k.name)}</option>`)); });
  return o.join('');
}
const segH = (act, cur, opts) => `<div class="seg">${opts.map(([v, l]) => `<button type="button" class="${cur === v ? 'on' : ''}" data-a="${act}" data-m="${v}">${esc(l)}</button>`).join('')}</div>`;
function detailSheet(title, rows, note){
  openSheet({ title, body: () => `<div class="card flat"><div class="tbl-wrap"><table class="tbl"><tbody>${rows.filter(r => r[1] !== '' && r[1] != null).map(([k, v]) => `<tr><td class="muted">${esc(k)}</td><td style="white-space:normal;text-align:right">${v}</td></tr>`).join('')}</tbody></table></div></div>${note ? `<div class="note-box note-body">${esc(note)}</div>` : ''}<div class="note-box small">${esc(t('readOnly'))}</div>` });
}

/* ---------- income tab ---------- */
function incomeView(){ return segH('incMode', S.incMode, [['chanda', t('t_chanda')], ['sp', t('sponsors')]]) + (S.incMode === 'sp' ? sponsorView() : chandaView()); }
function sponsorView(){
  const m = money();
  return `<section class="hero-card"><div class="grid3">${tileH(t('spCashRecv'), tk(m.spRecv), 'color:var(--ok)')}${tileH(t('spPromised'), tk(m.spProm), 'color:var(--warn)')}${tileH(t('spKindLbl'), nf(m.kindN) + (m.kindVal ? `<div class="small muted">≈ ${tk(m.kindVal)}</div>` : ''))}</div></section>
  ${!can('sponsor') ? `<div class="note-box small">${esc(t('readOnly'))}</div>` : ''}
  ${S.sp.length ? `<section class="card" style="padding-block:4px"><div class="list">${S.sp.map((x, i) => `<div class="item tap" data-a="spOpen" data-id="${x.id}" role="button" tabindex="0">${avatar(x.company, i)}
    <div class="body"><div class="title">${esc(x.company || '—')}</div><div class="small muted">${[x.kind === 'kind' ? (x.items || t('k_kind')) : t('k_cash'), x.kind !== 'kind' && x.status === 'received' && x.recv ? t('receivedBy') + ': ' + x.recv : '', x.contact].filter(Boolean).map(esc).join(' · ')}</div></div>
    <div style="text-align:right"><b class="num">${x.kind === 'kind' ? (x.value ? '≈ ' + tk(x.value) : '') : tk(x.amount)}</b><div><span class="pill ${x.status === 'received' ? 'ok' : 'warn'}">${esc(t('s_' + (x.status || 'promised')))}</span></div></div></div>`).join('')}</div></section>`
  : emptyBox('building', t('noSp'), can('sponsor') ? `<button class="btn" data-a="spNew">${ic('plus')}${esc(t('addSp'))}</button>` : '')}`;
}
function openSponsor(id){
  const x = id ? S.sp.find(s => s.id === id) : null;
  if (!can('sponsor')) { if (x) detailSheet(x.company, [[t('spKind'), esc(x.kind === 'kind' ? t('k_kind') : t('k_cash'))], [t('items'), esc(x.items || '')], [t('amount'), x.kind === 'kind' ? (x.value ? '≈ ' + tk(x.value) : '') : tk(x.amount)], [t('status'), esc(t('s_' + (x.status || 'promised')))], [t('receivedBy'), esc(x.recv || '')], [t('date'), esc(fd(x.date))], [t('contact'), esc(x.contact || '')]], x.note); return; }
  const kind = x ? (x.kind || 'cash') : 'cash', st = x ? (x.status || 'promised') : 'promised';
  openSheet({ title: x ? t('editSp') : t('addSp'), body: () => `
    <div class="field"><label for="sCo">${esc(t('company'))}</label><input class="in" id="sCo" value="${esc(x ? x.company : '')}"></div>
    <div class="field"><label for="sContact">${esc(t('contact'))}</label><input class="in" id="sContact" value="${esc(x ? x.contact || '' : '')}"></div>
    <div class="field"><label>${esc(t('spKind'))}</label><div class="seg"><button type="button" class="${kind === 'cash' ? 'on' : ''}" data-a="segPick" data-g="kind" data-v="cash">${esc(t('k_cash'))}</button><button type="button" class="${kind === 'kind' ? 'on' : ''}" data-a="segPick" data-g="kind" data-v="kind">${esc(t('k_kind'))}</button></div></div>
    <div class="field" data-when="kind:cash" ${kind !== 'cash' ? 'hidden' : ''}><label for="sAmt">${esc(t('amount'))}</label>${calcInput('sAmt', x ? x.amount : null)}</div>
    <div class="field" data-when="kind:kind" ${kind !== 'kind' ? 'hidden' : ''}><label for="sItems">${esc(t('items'))}</label><input class="in" id="sItems" placeholder="${esc(t('itemsPh'))}" value="${esc(x ? x.items || '' : '')}"></div>
    <div class="field" data-when="kind:kind" ${kind !== 'kind' ? 'hidden' : ''}><label for="sVal">${esc(t('estValue'))}</label>${calcInput('sVal', x ? x.value : null)}</div>
    <div class="field"><label>${esc(t('status'))}</label><div class="seg"><button type="button" class="${st === 'promised' ? 'on' : ''}" data-a="segPick" data-g="st" data-v="promised">${esc(t('s_promised'))}</button><button type="button" class="${st === 'received' ? 'on' : ''}" data-a="segPick" data-g="st" data-v="received">${esc(t('s_received'))}</button></div></div>
    <div class="grid2"><div class="field" data-when="kind:cash" ${kind !== 'cash' ? 'hidden' : ''}><label for="sRecv">${esc(t('receivedBy'))}</label><input class="in" id="sRecv" list="peopleList" value="${esc(x ? x.recv || '' : myName())}"></div>
    <div class="field"><label for="sDate">${esc(t('date'))}</label><input class="in" id="sDate" type="date" value="${esc(x ? x.date || '' : today())}"></div></div>
    <div class="field"><label for="sNote">${esc(t('note'))}</label><textarea class="in" id="sNote">${esc(x ? x.note || '' : '')}</textarea></div>${peopleDL()}`,
    foot: () => `${x ? `<button class="btn danger" data-a="spDel" data-id="${x.id}" style="flex:0 0 auto" aria-label="${esc(t('del'))}">${ic('trash')}</button>` : ''}<button class="btn" data-a="spSave" data-id="${x ? x.id : ''}">${ic('check')}${esc(t('save'))}</button>` });
}
async function saveSponsor(id, root){
  const company = $('#sCo', root).value.trim(); if (!company) { toast(t('needName')); $('#sCo', root).focus(); return; }
  const kind = $('[data-g="kind"].on', root).dataset.v, status = $('[data-g="st"].on', root).dataset.v;
  const prev = id ? S.sp.find(s => s.id === id) : null;
  const doc = { company, contact: $('#sContact', root).value.trim(), kind, status, amount: kind === 'cash' ? parseNum($('#sAmt', root).value) || 0 : 0,
    items: kind === 'kind' ? $('#sItems', root).value.trim() : '', value: kind === 'kind' ? parseNum($('#sVal', root).value) || 0 : 0,
    recv: kind === 'cash' ? $('#sRecv', root).value.trim() : '', date: $('#sDate', root).value, note: $('#sNote', root).value.trim(), at: prev ? prev.at || Date.now() : Date.now(), by: myName() };
  if (await commit(id ? 'editSponsor' : 'addSponsor', [{ path: spPath(), id: id || DB.rid(), data: doc }])) closeSheet();
}

/* ---------- spending tab ---------- */
function spendView(){ return segH('spendMode', S.spendMode, [['exp', t('expenses')], ['bud', t('budget')], ['gift', t('gifts')]]) + (S.spendMode === 'bud' ? budgetView() : S.spendMode === 'gift' ? giftView() : expensesView()); }
function expensesView(){
  const m = money(), bt = budTotals();
  return `<section class="hero-card"><div class="grid3">${tileH(t('spent'), tk(m.spent))}${tileH(t('budTotal'), tk(bt.total))}${tileH(bt.total - m.spent >= 0 ? t('budLeft') : t('overBudget'), tk(Math.abs(bt.total - m.spent)), bt.total - m.spent >= 0 ? 'color:var(--ok)' : 'color:var(--bad)')}</div>
    ${bt.total > 0 ? `<div class="bar"><i class="${barCls(m.spent, bt.total)}" style="width:${barW(m.spent, bt.total)}%"></i></div>` : ''}</section>
  <select class="in" id="expBud" aria-label="${esc(t('budget'))}">${budOptions(S.expBud, true)}</select>
  <div class="search">${ic('search')}<input class="in" id="eq" type="search" placeholder="${esc(t('search'))}" value="${esc(S.eq)}" aria-label="${esc(t('search'))}"></div>
  ${!can('expense') ? `<div class="note-box small">${esc(t('readOnly'))}</div>` : ''}
  <div id="listArea">${expList()}</div>`;
}
function expFiltered(){
  const q = (S.eq || '').trim().toLowerCase(); let ids = null;
  if (S.expBud === '_none') ids = ['']; else if (S.expBud) ids = [S.expBud].concat(S.bud.filter(b => b.parent === S.expBud).map(b => b.id));
  return S.exp.filter(e => (!ids || ids.includes(lineOf(e))) && (!q || [e.title, e.payee, e.paidBy, e.note].some(v => (v || '').toLowerCase().includes(q))));
}
function expItem(e){
  return `<div class="item tap" data-a="expOpen" data-id="${e.id}" role="button" tabindex="0"><div class="avatar" style="background:var(--brand-soft);color:var(--brand)"><span style="width:20px;height:20px;display:inline-flex">${ic('receipt')}</span></div>
    <div class="body"><div class="title">${esc(e.title || e.payee || '—')}</div><div class="small muted">${[budName(lineOf(e)), e.paidBy, t('m_' + (e.method || 'cash')), e.payee && e.title ? e.payee : ''].filter(Boolean).map(esc).join(' · ')}</div></div>
    <div style="text-align:right"><b class="num">${tk(e.amount)}</b><div class="small muted">${esc(fdShort(e.date))}</div></div></div>`;
}
function expList(){
  const rows = expFiltered();
  if (!S.exp.length) return emptyBox('receipt', t('noExp'), can('expense') ? `<button class="btn" data-a="expNew">${ic('plus')}${esc(t('addExp'))}</button>` : '');
  if (!rows.length) return emptyBox('search', t('noMatch'));
  return `<section class="card" style="padding-block:4px"><div class="row small muted" style="justify-content:space-between;padding:8px 2px 0"><span>${esc(t('count'))}: ${nf(rows.length)}</span><b class="num" style="color:var(--ink)">${tk(sum(rows))}</b></div><div class="list">${rows.map(expItem).join('')}</div></section>`;
}
function openExpense(id, presetBud){
  const e = id ? S.exp.find(x => x.id === id) : null;
  if (!can('expense')) { if (e) detailSheet(e.title || t('t_spend'), [[t('amount'), tk(e.amount)], [t('budget'), esc(budName(lineOf(e)))], [t('paidBy'), esc(e.paidBy || '')], [t('paidHow'), esc(t('m_' + (e.method || 'cash')))], [t('payee'), esc(e.payee || '')], [t('date'), esc(fd(e.date))]], e.note); return; }
  openSheet({ title: e ? t('editExp') : t('addExp'), body: () => `
    <div class="field"><label for="xTitle">${esc(t('expTitle'))}</label><input class="in" id="xTitle" placeholder="${esc(t('expTitlePh'))}" value="${esc(e ? e.title || '' : '')}"></div>
    <div class="grid2"><div class="field"><label for="xAmt">${esc(t('amount'))}</label>${calcInput('xAmt', e ? e.amount : null)}</div><div class="field"><label for="xDate">${esc(t('date'))}</label><input class="in" id="xDate" type="date" value="${esc(e ? e.date || '' : today())}"></div></div>
    <div class="field"><label for="xBud">${esc(t('budget'))}</label><select class="in" id="xBud">${budOptions(e ? lineOf(e) : (presetBud || ''), false)}</select></div>
    <div class="grid2"><div class="field"><label for="xBy">${esc(t('paidBy'))}</label><input class="in" id="xBy" list="peopleList" value="${esc(e ? e.paidBy || '' : myName())}"></div>
    <div class="field"><label for="xMethod">${esc(t('paidHow'))}</label><select class="in" id="xMethod">${METHODS.map(m => `<option value="${m}" ${(e ? e.method : 'cash') === m ? 'selected' : ''}>${esc(t('m_' + m))}</option>`).join('')}</select></div></div>
    <div class="field"><label for="xPayee">${esc(t('payee'))}</label><input class="in" id="xPayee" placeholder="${esc(t('payeePh'))}" value="${esc(e ? e.payee || '' : '')}"></div>
    <div class="field"><label for="xNote">${esc(t('note'))}</label><textarea class="in" id="xNote">${esc(e ? e.note || '' : '')}</textarea></div>${peopleDL()}`,
    foot: () => `${e ? `<button class="btn danger" data-a="expDel" data-id="${e.id}" style="flex:0 0 auto" aria-label="${esc(t('del'))}">${ic('trash')}</button>` : ''}<button class="btn" data-a="expSave" data-id="${e ? e.id : ''}">${ic('check')}${esc(t('save'))}</button>` });
}
async function saveExpense(id, root){
  const amount = parseNum($('#xAmt', root).value); if (!amount) { toast(t('amount')); $('#xAmt', root).focus(); return; }
  const prev = id ? S.exp.find(x => x.id === id) : null;
  const doc = { title: $('#xTitle', root).value.trim(), amount, date: $('#xDate', root).value, bud: $('#xBud', root).value, paidBy: $('#xBy', root).value.trim(), method: $('#xMethod', root).value,
    payee: $('#xPayee', root).value.trim(), note: $('#xNote', root).value.trim(), at: prev ? prev.at || Date.now() : Date.now(), by: myName() };
  if (await commit(id ? 'editExpense' : 'addExpense', [{ path: expPath(), id: id || DB.rid(), data: doc }])) closeSheet();
}

/* ---------- budget ---------- */
function budRow(b, kids, isKid){
  const l = budLine(b, kids);
  return `<div class="item tap" data-a="budOpen" data-id="${b.id}" role="button" tabindex="0" style="${isKid ? 'padding-left:20px' : ''}"><div class="body">
    <div class="row" style="justify-content:space-between;flex-wrap:nowrap;gap:8px"><span class="title" style="${isKid ? 'font-weight:var(--fw)' : ''}">${isKid ? '↳ ' : ''}${esc(b.name)}</span><span class="num small" style="white-space:nowrap"><b>${tk(l.spent)}</b><span class="muted"> / ${tk(l.amt)}</span></span></div>
    <div class="bar thin" style="margin-top:6px"><i class="${barCls(l.spent, l.amt)}" style="width:${barW(l.spent, l.amt)}%"></i></div></div></div>`;
}
function budgetView(){
  const tree = budTree(), bt = budTotals(), m = money(), none = spentOn('');
  return `<section class="hero-card"><div class="grid3">${tileH(t('budTotal'), tk(bt.total))}${tileH(t('spent'), tk(m.spent))}${tileH(bt.total - m.spent >= 0 ? t('budLeft') : t('overBudget'), tk(Math.abs(bt.total - m.spent)), bt.total - m.spent >= 0 ? 'color:var(--ok)' : 'color:var(--bad)')}</div>
    ${bt.total > 0 ? `<div class="bar"><i class="${barCls(m.spent, bt.total)}" style="width:${barW(m.spent, bt.total)}%"></i></div>` : ''}
    ${isAdmin() ? `<div class="row"><button class="btn ghost sm" data-a="budNew">${ic('plus')}${esc(t('addBud'))}</button></div>` : `<span class="small muted">${esc(t('adminOnly'))}</span>`}</section>
  ${!tree.length ? emptyBox('pie', t('noBud'), isAdmin() ? `<button class="btn" data-a="budNew">${ic('plus')}${esc(t('addBud'))}</button>` : '') :
  `<section class="card" style="padding-block:4px"><div class="list">${tree.map(n => budRow(n.b, n.kids, false) + n.kids.map(k => budRow(k, [], true)).join('')).join('')}
    ${none ? `<div class="item tap" data-a="noLineOpen" role="button" tabindex="0"><div class="body"><div class="row" style="justify-content:space-between"><span class="title muted">${esc(t('noLine'))}</span><b class="num small">${tk(none)}</b></div></div></div>` : ''}</div></section>`}`;
}
function openBudget(id){
  openSheet({ title: t('budget'), live: true, body: () => {
    const b = S.bud.find(x => x.id === id); if (!b) return `<p class="muted">${esc(t('noMatch'))}</p>`;
    const kids = S.bud.filter(x => x.parent === id).sort(byOrder), l = budLine(b, kids), left = l.amt - l.spent, ids = [id].concat(kids.map(k => k.id));
    const ex = S.exp.filter(e => ids.includes(lineOf(e))).sort(dateDesc);
    return `<div class="title strong" style="font-size:1.1rem">${esc(budName(id))}</div>
      <div class="grid3">${tileH(t('budAmount'), tk(l.amt))}${tileH(t('spent'), tk(l.spent))}${tileH(left >= 0 ? t('budLeft') : t('overBudget'), tk(Math.abs(left)), left >= 0 ? 'color:var(--ok)' : 'color:var(--bad)')}</div>
      <div class="bar"><i class="${barCls(l.spent, l.amt)}" style="width:${barW(l.spent, l.amt)}%"></i></div>
      ${kids.length ? `<div class="card" style="padding-block:4px"><div class="list">${kids.map(k => budRow(k, [], false)).join('')}</div></div>` : ''}
      ${b.note ? `<div class="note-box note-body">${esc(b.note)}</div>` : ''}
      <div class="card" style="padding-block:6px"><b>${esc(t('expenses'))}</b>${ex.length ? `<div class="list">${ex.map(expItem).join('')}</div>` : `<p class="small muted" style="margin:6px 0">${esc(t('noExp'))}</p>`}</div>`; },
    foot: () => `${isAdmin() ? `<button class="btn ghost" data-a="budEdit" data-id="${id}">${ic('edit')}${esc(t('edit'))}</button>` : ''}${can('expense') ? `<button class="btn" data-a="expNew" data-bud="${id}">${ic('plus')}${esc(t('addExp'))}</button>` : ''}` });
}
function openNoLine(){
  openSheet({ title: t('noLine'), live: true, body: () => { const ex = S.exp.filter(e => !lineOf(e)).sort(dateDesc); return ex.length ? `<div class="card" style="padding-block:4px"><div class="list">${ex.map(expItem).join('')}</div></div>` : `<p class="muted">${esc(t('noExp'))}</p>`; } });
}
function openBudForm(id){
  const b = id ? S.bud.find(x => x.id === id) : null, hasKids = !!(b && S.bud.some(x => x.parent === id));
  const tops = S.bud.filter(x => !x.parent && x.id !== id).sort(byOrder);
  openSheet({ title: b ? t('editBud') : t('addBud'), body: () => `
    <div class="field"><label for="bName">${esc(t('budName'))}</label><input class="in" id="bName" placeholder="${esc(t('budNamePh'))}" value="${esc(b ? b.name : '')}"></div>
    ${hasKids ? '' : `<div class="field"><label for="bParent">${esc(t('parentLine'))}</label><select class="in" id="bParent"><option value="">${esc(t('topLevel'))}</option>${tops.map(x => `<option value="${x.id}" ${b && b.parent === x.id ? 'selected' : ''}>${esc(x.name)}</option>`).join('')}</select></div>`}
    <div class="field"><label for="bAmt">${esc(t('budAmount'))}</label>${calcInput('bAmt', b ? b.amount : null)}<span class="small muted">${esc(t('budAmtHint'))}</span></div>
    <div class="field"><label for="bNote">${esc(t('note'))}</label><textarea class="in" id="bNote">${esc(b ? b.note || '' : '')}</textarea></div>`,
    foot: () => `${b ? `<button class="btn danger" data-a="budDel" data-id="${b.id}" style="flex:0 0 auto" aria-label="${esc(t('del'))}">${ic('trash')}</button>` : ''}<button class="btn" data-a="budSave" data-id="${b ? b.id : ''}">${ic('check')}${esc(t('save'))}</button>` });
}
async function saveBudget(id, root){
  const name = $('#bName', root).value.trim(); if (!name) { toast(t('needName')); $('#bName', root).focus(); return; }
  const prev = id ? S.bud.find(x => x.id === id) : null;
  const doc = { name, parent: $('#bParent', root) ? $('#bParent', root).value : (prev ? prev.parent || '' : ''), amount: parseNum($('#bAmt', root).value), note: $('#bNote', root).value.trim(),
    order: prev ? prev.order || 0 : Date.now(), at: prev ? prev.at || Date.now() : Date.now(), by: myName() };
  if (await commit(id ? 'editBudget' : 'addBudget', [{ path: budPath(), id: id || DB.rid(), data: doc }])) closeSheet();
}

/* ---------- settle up ---------- */
function ledger(){
  const P2 = {}; const add = (n, f, v) => { n = (n || '').trim(); if (!n) return; (P2[n] = P2[n] || { name:n, took:0, spent:0, tin:0, tout:0 })[f] += Number(v) || 0; };
  S.pay.forEach(x => add(x.recv, 'took', x.amount));
  S.sp.forEach(x => { if (x.kind !== 'kind' && x.status === 'received') add(x.recv, 'took', x.amount); });
  S.exp.forEach(x => add(x.paidBy, 'spent', x.amount));
  S.st.forEach(x => { add(x.from, 'tout', x.amount); add(x.to, 'tin', x.amount); });
  const rows = Object.values(P2).map(r => Object.assign(r, { held: Math.round((r.took - r.spent - r.tout + r.tin) * 100) / 100 })).sort((a, b) => b.held - a.held);
  const pos = rows.filter(r => r.held >= 1).map(r => ({ n:r.name, v:r.held })), neg = rows.filter(r => r.held <= -1).map(r => ({ n:r.name, v:-r.held })).sort((a, b) => b.v - a.v);
  const sug = []; let i = 0, j = 0;
  while (i < pos.length && j < neg.length) { const v = Math.min(pos[i].v, neg[j].v); sug.push({ from:pos[i].n, to:neg[j].n, amount: Math.round(v * 100) / 100 }); pos[i].v -= v; neg[j].v -= v; if (pos[i].v < 1) i++; if (neg[j].v < 1) j++; }
  return { rows, sug, keeps: pos.filter(p => p.v >= 1), owed: neg.filter(n => n.v >= 1) };
}
function settleView(){
  const m = money(), L = ledger(), ce = can('expense');
  const state = r => r.held >= 1 ? `<span class="pill info">${esc(t('holds'))} ${tk(r.held)}</span>` : r.held <= -1 ? `<span class="pill warn">${esc(t('getsBack'))} ${tk(-r.held)}</span>` : `<span class="pill ok">${esc(t('even'))}</span>`;
  return `<div class="sec-h"><h2>${esc(t('settle'))}</h2></div>
  <section class="hero-card"><div class="grid3">${tileH(t('income'), tk(m.income))}${tileH(t('spent'), tk(m.spent))}${tileH(m.bal >= 0 ? t('inHand') : t('deficit'), tk(Math.abs(m.bal)), m.bal >= 0 ? 'color:var(--ok)' : 'color:var(--bad)')}</div>
    <div class="small muted">${esc(t('t_chanda'))} ${tk(m.paid)} + ${esc(t('sponsors'))} ${tk(m.spRecv)}${m.due - m.paid > 0 ? ` · ${esc(t('chandaPending'))} ${tk(m.due - m.paid)}` : ''}${m.spProm ? ` · ${esc(t('spPromised'))} ${tk(m.spProm)}` : ''}</div></section>
  <section class="card"><h3>${esc(t('perPerson'))}</h3>${L.rows.length ? `<div class="list">${L.rows.map((r, i) => `<div class="item">${avatar(r.name, i)}<div class="body"><div class="title">${esc(r.name)}</div>
      <div class="small muted num">${esc(t('took'))} ${tk(r.took)} · ${esc(t('gave'))} ${tk(r.spent)}${r.tin - r.tout ? ` · ${esc(t('transfers'))} ${r.tin - r.tout > 0 ? '+' : '−'}${tk(Math.abs(r.tin - r.tout))}` : ''}</div><div style="margin-top:4px">${state(r)}</div></div></div>`).join('')}</div>` : `<p class="small muted" style="margin:0">${esc(t('noPeopleYet'))}</p>`}
    <p class="small muted" style="margin:10px 0 0">${esc(t('settleHint'))}</p></section>
  <section class="card"><h3>${esc(t('suggest'))}</h3>${L.sug.length ? `<div class="list">${L.sug.map(s => `<div class="item"><div class="body"><div class="title">${esc(s.from)} → ${esc(s.to)}</div><div class="num strong">${tk(s.amount)}</div></div>${ce ? `<button class="btn sm" data-a="sugDone" data-from="${esc(s.from)}" data-to="${esc(s.to)}" data-amt="${s.amount}">${ic('check')}${esc(t('markDone'))}</button>` : ''}</div>`).join('')}</div>` : (L.rows.length ? `<p class="small" style="margin:0;color:var(--ok)">${esc(t('allSettled'))}</p>` : '')}
    ${L.keeps.map(k => `<p class="small muted" style="margin:8px 0 0">${esc(t('keeps', k.n, tk(k.v)))}</p>`).join('')}${L.owed.map(k => `<p class="small" style="margin:8px 0 0;color:var(--bad)">${esc(t('stillOwed', k.n, tk(k.v)))}</p>`).join('')}</section>
  <section class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(t('transfers'))}</h3>${ce ? `<button class="btn ghost sm" data-a="trNew">${ic('plus')}${esc(t('add'))}</button>` : ''}</div>
    ${S.st.length ? `<div class="list">${S.st.map(x => `<div class="item ${ce ? 'tap' : ''}" ${ce ? `data-a="trOpen" data-id="${x.id}" role="button" tabindex="0"` : ''}><div class="body"><div class="title">${esc(x.from)} → ${esc(x.to)}</div><div class="small muted">${[fd(x.date), x.note].filter(Boolean).map(esc).join(' · ')}</div></div><b class="num">${tk(x.amount)}</b></div>`).join('')}</div>` : `<p class="small muted" style="margin:6px 0 0">${esc(t('noTransfers'))}</p>`}</section>`;
}
function openTransfer(id){
  const x = id ? S.st.find(s => s.id === id) : null;
  openSheet({ title: x ? t('editTransfer') : t('addTransfer'), body: () => `
    <div class="grid2"><div class="field"><label for="tFrom">${esc(t('fromP'))}</label><input class="in" id="tFrom" list="peopleList" value="${esc(x ? x.from : '')}"></div><div class="field"><label for="tTo">${esc(t('toP'))}</label><input class="in" id="tTo" list="peopleList" value="${esc(x ? x.to : '')}"></div></div>
    <div class="grid2"><div class="field"><label for="tAmt">${esc(t('amount'))}</label>${calcInput('tAmt', x ? x.amount : null)}</div><div class="field"><label for="tDate">${esc(t('date'))}</label><input class="in" id="tDate" type="date" value="${esc(x ? x.date || '' : today())}"></div></div>
    <div class="field"><label for="tNote">${esc(t('note'))}</label><input class="in" id="tNote" value="${esc(x ? x.note || '' : '')}"></div>${peopleDL()}`,
    foot: () => `${x ? `<button class="btn danger" data-a="trDel" data-id="${x.id}" style="flex:0 0 auto" aria-label="${esc(t('del'))}">${ic('trash')}</button>` : ''}<button class="btn" data-a="trSave" data-id="${x ? x.id : ''}">${ic('check')}${esc(t('save'))}</button>` });
}
async function saveTransfer(id, root){
  const from = $('#tFrom', root).value.trim(), to = $('#tTo', root).value.trim(), amount = parseNum($('#tAmt', root).value);
  if (!from || !to || from === to) { toast(t('sameP')); return; } if (!amount) { toast(t('amount')); return; }
  const prev = id ? S.st.find(s => s.id === id) : null;
  if (await commit(id ? 'editTransfer' : 'addTransfer', [{ path: stPath(), id: id || DB.rid(), data: { from, to, amount, date: $('#tDate', root).value, note: $('#tNote', root).value.trim(), at: prev ? prev.at || Date.now() : Date.now(), by: myName() } }])) closeSheet();
}
function refreshLive(){ sheets.forEach(o => { if (o.live) fillSheet(o); }); }

/* ================= phase 3: gifts & Excel ================= */
function persons(){ const out = []; S.fam.forEach(f => (f.members || []).forEach(m => out.push({ m, f }))); return out; }
function giftMatches(g){
  const p = prog() || {}; const G = giftGroupsOf(p).find(x => x.id === g.group);
  return persons().filter(({ m, f }) => (!G || inRange(ageNum(m.age), G.min, G.max)) && (!g.gender || g.gender === 'any' || m.g === g.gender) && (!g.side || g.side === 'any' || f.side === g.side) && (!g.cat || (f.cat || '') === g.cat));
}
function giftInfo(g){ const rec = giftMatches(g); const need = (g.need != null && g.need !== '') ? Number(g.need) : rec.length; const bought = Number(g.bought) || 0; const given = rec.filter(r => (g.given || {})[r.m.id]).length; return { rec, need, bought, given, cost: need * (Number(g.price) || 0) }; }
function giftWho(g){ const p = prog() || {}; const G = giftGroupsOf(p).find(x => x.id === g.group); return [G ? G.name : t('allAges'), g.gender === 'M' ? t('male') : g.gender === 'F' ? t('female') : '', g.side === 'in' ? t('inside') : g.side === 'out' ? t('outsideShort') : '', g.cat || ''].filter(Boolean).join(' · '); }
function giftStatus(i){ if (i.need > 0 && i.given >= i.need) return ['ok', t('g_allGiven')]; if (i.bought >= i.need) return ['info', t('g_allBought')]; return ['warn', t('g_toBuy', nf(i.need - i.bought))]; }
function giftTotals(){ return S.gifts.reduce((a, g) => { const i = giftInfo(g); a.need += i.need; a.bought += i.bought; a.given += i.given; a.cost += i.cost; return a; }, { need:0, bought:0, given:0, cost:0 }); }
function giftView(){
  const T = giftTotals(); const items = S.gifts.slice().sort(byOrder);
  return `<section class="hero-card"><div class="grid3">${tileH(t('need'), nf(T.need))}${tileH(t('bought'), nf(T.bought), T.bought >= T.need ? 'color:var(--ok)' : 'color:var(--warn)')}${tileH(t('given'), nf(T.given), 'color:var(--ok)')}</div>
    ${T.cost ? `<div class="small muted">${esc(t('estCost'))}: <b class="num">${tk(T.cost)}</b></div>` : ''}</section>
  ${!can('gift') ? `<div class="note-box small">${esc(t('readOnly'))}</div>` : ''}
  ${items.length ? `<section class="card" style="padding-block:4px"><div class="list">${items.map((g, i) => { const inf = giftInfo(g), st = giftStatus(inf);
    return `<div class="item tap" data-a="giftOpen" data-id="${g.id}" role="button" tabindex="0"><div class="avatar" style="background:color-mix(in srgb,var(--f${(i % 4) + 1}) 26%,var(--surface));color:color-mix(in srgb,var(--f${(i % 4) + 1}) 65%,var(--ink))"><span style="width:22px;height:22px;display:inline-flex">${ic('gift')}</span></div>
      <div class="body"><div class="title">${esc(g.name)}</div><div class="small muted">${esc(giftWho(g))}</div><div class="small num" style="margin-top:2px">${esc(t('need'))} ${nf(inf.need)} · ${esc(t('bought'))} ${nf(inf.bought)} · ${esc(t('given'))} ${nf(inf.given)}</div></div>
      <span class="pill ${st[0]}">${esc(st[1])}</span></div>`; }).join('')}</div></section>`
  : emptyBox('gift', t('noGifts'), can('gift') ? `<button class="btn" data-a="giftNew">${ic('plus')}${esc(t('addGift'))}</button>` : '')}`;
}
function openGift(id){
  openSheet({ title: t('gifts'), live: true, body: () => {
    const g = S.gifts.find(x => x.id === id); if (!g) return `<p class="muted">${esc(t('noMatch'))}</p>`;
    const inf = giftInfo(g), st = giftStatus(inf), cg = can('gift'); let budHtml = '';
    if (g.bud && S.bud.find(b => b.id === g.bud)) { const b = S.bud.find(x => x.id === g.bud), l = budLine(b, S.bud.filter(x => x.parent === b.id));
      budHtml = `<div class="card flat"><div class="row" style="justify-content:space-between"><span class="small">${esc(budName(g.bud))}</span><span class="num small"><b>${tk(l.spent)}</b><span class="muted"> / ${tk(l.amt)}</span></span></div><div class="bar thin" style="margin-top:6px"><i class="${barCls(l.spent, l.amt)}" style="width:${barW(l.spent, l.amt)}%"></i></div></div>`; }
    return `<div class="row"><div class="grow"><div class="title strong" style="font-size:1.1rem">${esc(g.name)}</div><div class="small muted">${esc(giftWho(g))}</div></div><span class="pill ${st[0]}">${esc(st[1])}</span></div>
      <div class="grid3">${tileH(t('need'), nf(inf.need))}${tileH(t('bought'), nf(inf.bought))}${tileH(t('given'), nf(inf.given), 'color:var(--ok)')}</div>
      ${inf.cost ? `<div class="small muted">${esc(t('estCost'))}: <b class="num">${tk(inf.cost)}</b> (${tk(g.price)} × ${nf(inf.need)})</div>` : ''}
      ${budHtml}${g.note ? `<div class="note-box note-body">${esc(g.note)}</div>` : ''}
      <div class="card" style="padding-block:6px"><b>${esc(t('recipients'))}</b> <span class="small muted">${nf(inf.given)} / ${nf(inf.rec.length)}</span>
      ${inf.rec.length ? `<div class="list">${inf.rec.map(({ m, f }) => { const on = !!(g.given || {})[m.id];
        return `<div class="item"><div class="body"><div class="title">${esc(m.name || '—')}</div><div class="small muted">${[m.id === (f.members[0] || {}).id ? (f.cat || '') : relLabel(m.rel) + ' · ' + famName(f), ageNum(m.age) != null ? nf(m.age) + ' ' + t('year') : ''].filter(Boolean).map(esc).join(' · ')}</div></div>
          ${cg ? `<button class="give ${on ? 'on' : ''}" data-a="giveToggle" data-g="${g.id}" data-m="${esc(m.id)}" aria-pressed="${on}" aria-label="${esc(t('given'))}">${ic('check')}</button>` : (on ? `<span class="pill ok">${esc(t('given'))}</span>` : '')}</div>`; }).join('')}</div>` : `<p class="small muted" style="margin:6px 0">${esc(t('noRecipients'))}</p>`}</div>`; },
    foot: () => can('gift') ? `<button class="btn ghost" data-a="shareGift" data-id="${id}">${ic('share')}${esc(t('share'))}</button><button class="btn" data-a="giftEdit" data-id="${id}">${ic('edit')}${esc(t('edit'))}</button>` : `<button class="btn ghost" data-a="shareGift" data-id="${id}">${ic('share')}${esc(t('share'))}</button>` });
}
function readGiftForm(root){ return { name: $('#gfName', root).value.trim(), group: $('#gfGroup', root).value, gender: ($('[data-g="gen"].on', root) || { dataset:{ v:'any' } }).dataset.v, side: $('#gfSide', root).value, cat: $('#gfCat', root) ? $('#gfCat', root).value : '', need: parseNum($('#gfNeed', root).value), bought: parseNum($('#gfBought', root).value) || 0, price: parseNum($('#gfPrice', root).value), bud: $('#gfBud', root).value, note: $('#gfNote', root).value.trim() }; }
function openGiftForm(id){
  const g = id ? S.gifts.find(x => x.id === id) : null, p = prog(), gen = g ? g.gender || 'any' : 'any';
  const upd = el => { const n = giftMatches(readGiftForm(el)).length; $('#gfMatch', el).textContent = t('matchN', nf(n)); };
  openSheet({ title: g ? t('editGift') : t('addGift'), body: () => `
    <div class="field"><label for="gfName">${esc(t('giftName'))}</label><input class="in" id="gfName" placeholder="${esc(t('giftNamePh'))}" value="${esc(g ? g.name : '')}"></div>
    <div class="field"><label for="gfGroup">${esc(t('forWhom'))}</label><select class="in" id="gfGroup"><option value="">${esc(t('allAges'))}</option>${giftGroupsOf(p).map(x => `<option value="${x.id}" ${g && g.group === x.id ? 'selected' : ''}>${esc(x.name)} (${esc(rangeLabel(x.min, x.max))})</option>`).join('')}</select></div>
    <div class="seg"><button type="button" class="${gen === 'any' ? 'on' : ''}" data-a="segPick" data-g="gen" data-v="any">${esc(t('anyGender'))}</button><button type="button" class="${gen === 'M' ? 'on' : ''}" data-a="segPick" data-g="gen" data-v="M">${esc(t('male'))}</button><button type="button" class="${gen === 'F' ? 'on' : ''}" data-a="segPick" data-g="gen" data-v="F">${esc(t('female'))}</button></div>
    <div class="grid2"><select class="in" id="gfSide" aria-label="${esc(t('side'))}"><option value="any">${esc(t('anySide'))}</option><option value="in" ${g && g.side === 'in' ? 'selected' : ''}>${esc(t('inside'))}</option><option value="out" ${g && g.side === 'out' ? 'selected' : ''}>${esc(t('outside'))}</option></select>
    ${(p.categories || []).length ? `<select class="in" id="gfCat" aria-label="${esc(t('category'))}"><option value="">${esc(t('anyCat'))}</option>${p.categories.map(c => `<option ${g && g.cat === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>` : ''}</div>
    <div class="note-box small" id="gfMatch"></div>
    <div class="grid2"><div class="field"><label for="gfNeed">${esc(t('needOverride'))}</label><input class="in" id="gfNeed" inputmode="decimal" value="${g && g.need != null ? esc(g.need) : ''}"></div>
    <div class="field"><label for="gfBought">${esc(t('bought'))}</label><input class="in" id="gfBought" inputmode="decimal" value="${g ? esc(g.bought || 0) : ''}"></div></div>
    <span class="small muted">${esc(t('needHint'))}</span>
    <div class="grid2"><div class="field"><label for="gfPrice">${esc(t('unitPrice'))}</label>${calcInput('gfPrice', g ? g.price : null)}</div>
    <div class="field"><label for="gfBud">${esc(t('linkBud'))}</label><select class="in" id="gfBud">${budOptions(g ? g.bud || '' : '', false)}</select></div></div>
    <div class="field"><label for="gfNote">${esc(t('note'))}</label><textarea class="in" id="gfNote">${esc(g ? g.note || '' : '')}</textarea></div>`,
    foot: () => `${g ? `<button class="btn danger" data-a="giftDel" data-id="${g.id}" style="flex:0 0 auto" aria-label="${esc(t('del'))}">${ic('trash')}</button>` : ''}<button class="btn" data-a="giftSave" data-id="${g ? g.id : ''}">${ic('check')}${esc(t('save'))}</button>`,
    mount: el => { upd(el); el.addEventListener('input', () => upd(el)); el.addEventListener('change', () => upd(el)); el.addEventListener('click', () => setTimeout(() => upd(el), 0)); } });
}
async function saveGift(id, root){
  const d = readGiftForm(root); if (!d.name) { toast(t('needName')); $('#gfName', root).focus(); return; }
  const prev = id ? S.gifts.find(x => x.id === id) : null;
  const doc = Object.assign(d, { given: prev ? prev.given || {} : {}, order: prev ? prev.order || 0 : Date.now(), at: prev ? prev.at || Date.now() : Date.now(), by: myName() });
  if (await commit(id ? 'editGift' : 'addGift', [{ path: giftPath(), id: id || DB.rid(), data: doc }])) closeSheet();
}
function giftText(g){
  const inf = giftInfo(g); const L = [`*${prog().name}* — ${g.name}`, giftWho(g), `${t('need')} ${nf(inf.need)} · ${t('bought')} ${nf(inf.bought)} · ${t('given')} ${nf(inf.given)}`, ''];
  inf.rec.forEach(({ m, f }, i) => L.push(`${nf(i + 1)}. ${(g.given || {})[m.id] ? '✅' : '⬜'} ${m.name || '—'}${m.id === (f.members[0] || {}).id ? '' : ` (${famName(f)})`}`));
  return L.join('\n');
}
function giftCard(c){
  if (!S.gifts.length) return ''; const T = giftTotals();
  return `<section class="card tap" data-a="tab" data-v="spend" data-spend="gift" role="button" tabindex="0"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(c ? dashTitle(c) : t('gifts'))}</h3><span class="small muted num">${esc(t('given'))} ${nf(T.given)} / ${nf(T.need)}</span></div>
    <div class="bar thin" style="margin-top:10px"><i class="ok" style="width:${T.need ? Math.min(100, T.given / T.need * 100) : 0}%"></i></div>
    <div class="small muted num" style="margin-top:6px">${esc(t('need'))} ${nf(T.need)} · ${esc(t('bought'))} ${nf(T.bought)}</div></section>`;
}

/* ---------- Excel ---------- */
let xlsxLoading = null;
function loadXLSX(){
  if (window.XLSX) return Promise.resolve();
  if (!xlsxLoading) xlsxLoading = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = res; s.onerror = () => { xlsxLoading = null; rej(new Error('load')); }; document.head.appendChild(s); });
  return xlsxLoading;
}
function buildWorkbook(){
  const X = window.XLSX, wb = X.utils.book_new(), p = prog(), s = stats(), m = money(), bt = budTotals(), Lg = ledger();
  const add = (name, rows) => { const ws = X.utils.aoa_to_sheet(rows); const w = Math.max(...rows.map(r => r.length));
    ws['!cols'] = Array.from({ length: w }, (_, i) => ({ wch: Math.min(42, Math.max(8, ...rows.map(r => String(r[i] == null ? '' : r[i]).length + 2))) }));
    X.utils.book_append_sheet(wb, ws, String(name).replace(/[:\\\/?*\[\]]/g, ' ').slice(0, 31)); };
  const meth = x => t('m_' + (x || 'cash'));
  add(t('t_home'), [[p.name], [t('date'), p.date || ''], [t('venue'), p.venue || ''], [],
    [t('totalPeople'), s.persons], [t('families'), s.fams], [t('inside'), s.inn], [t('outsideShort'), s.out], [t('male'), s.m], [t('female'), s.f], [],
    [t('due'), s.due], [t('collected'), s.paid], [t('remaining'), Math.max(0, s.due - s.paid)], [t('spCashRecv'), m.spRecv], [t('spPromised'), m.spProm], [],
    [t('income'), m.income], [t('spent'), m.spent], [t('budTotal'), bt.total], [m.bal >= 0 ? t('inHand') : t('deficit'), Math.abs(m.bal)]].concat(p.note ? [[], [t('progNote'), p.note]] : []));
  const gr = p.ageGroups || [];
  add(t('t_people'), [['#', t('name'), t('relation'), t('famHead'), t('side'), t('category'), t('dept'), t('gender'), t('age'), t('group'), t('rate'), t('phone'), t('tshirt')]].concat(
    persons().map(({ m: mm, f }, i) => { const r = rateFor(mm, f, p); return [i + 1, mm.name || '', relLabel(mm.rel), famName(f), f.side === 'out' ? t('outsideShort') : t('inside'), f.cat || '', deptName(f), mm.g === 'M' ? t('male') : mm.g === 'F' ? t('female') : '', ageNum(mm.age), gr.filter(G => inRange(ageNum(mm.age), G.min, G.max)).map(G => G.name).join(', '), r ? r.name : t('noRate'), f.phone || '', tsLabel(mm)]; })));
  { const T = tsOf(p), q = tsStats(); if (T.sizes.length && q.total) { const rows = [[t('tsSizeH'), t('tsCount'), t('tsExtra'), t('total'), t('tsPrice'), t('tsCostEst')]];
    T.sizes.forEach(z => { const e = Number(T.extra[z]) || 0; rows.push([z, q.by[z], e, q.by[z] + e, T.price, (q.by[z] + e) * T.price]); });
    rows.push([t('total'), q.people, q.extraN, q.total, '', q.cost], [], [t('tsUnset'), q.unset], [t('tsNoNeed'), q.none]); add(t('tshirt'), rows); } }
  add(t('ageGroups'), [[t('group'), t('ageRangeH'), t('total'), t('male'), t('female'), t('inside'), t('outsideShort')]].concat(s.groups.map(G => [G.g.name, rangeLabel(G.g.min, G.g.max), G.total, G.m, G.f, G.inn, G.out])).concat(s.unknown ? [[t('unknownAge'), '', s.unknown]] : []));
  { const G = busGroups(), rows = [[t('bus'), t('famHead'), t('people'), t('seatsNeed'), t('category'), t('side')]];
    const put = (label, fams) => fams.forEach(f => rows.push([label, famName(f), famSize(f), famSeats(f), f.cat || '', f.side === 'out' ? t('outsideShort') : t('inside')]));
    G.bs.forEach(b => put(b.name, G.by[b.id])); put(t('ownCar'), G.own); put(t('unassigned'), G.none);
    if (G.bs.length || G.own.length) add(t('buses'), rows); }
  { const rows = [[t('dept'), t('families'), t('people'), t('due'), t('collected'), t('remaining')]];
    deptStats().forEach(r => rows.push([r.name, r.fams, r.persons, r.due, r.paid, Math.max(0, r.due - r.paid)])); add(t('byDeptShort'), rows); }
  add(t('t_chanda'), [[t('famHead'), t('category'), t('dept'), t('side'), t('people'), t('due'), t('collected'), t('remaining'), t('status')]].concat(S.fam.map(f => { const d = famDue(f, p), pd = famPaid(f.id); return [famName(f), f.cat || '', deptName(f), f.side === 'out' ? t('outsideShort') : t('inside'), (f.members || []).length, d, pd, Math.max(0, d - pd), t('st_' + famStatus(d, pd))]; })));
  add(t('payments'), [[t('date'), t('famHead'), t('amount'), t('method'), t('receivedBy'), t('note')]].concat(S.pay.map(x => { const f = S.fam.find(y => y.id === x.fid); return [x.date || '', f ? famName(f) : '', Number(x.amount) || 0, meth(x.method), x.recv || '', x.note || '']; })));
  add(t('sponsors'), [[t('company'), t('spKind'), t('amount'), t('items'), t('estValue'), t('status'), t('receivedBy'), t('date'), t('contact'), t('note')]].concat(S.sp.map(x => [x.company || '', x.kind === 'kind' ? t('k_kind') : t('k_cash'), x.kind === 'kind' ? 0 : Number(x.amount) || 0, x.items || '', Number(x.value) || 0, t('s_' + (x.status || 'promised')), x.recv || '', x.date || '', x.contact || '', x.note || ''])));
  const budRows = [[t('budName'), t('parentLine'), t('budAmount'), t('spent'), t('budLeft')]];
  budTree().forEach(n => { const l = budLine(n.b, n.kids); budRows.push([n.b.name, '', l.amt, l.spent, l.amt - l.spent]); n.kids.forEach(k => { const lk = budLine(k, []); budRows.push(['  ' + k.name, n.b.name, lk.amt, lk.spent, lk.amt - lk.spent]); }); });
  const none = spentOn(''); if (none) budRows.push([t('noLine'), '', 0, none, -none]); budRows.push([t('total'), '', bt.total, m.spent, bt.total - m.spent]);
  add(t('budget'), budRows);
  add(t('expenses'), [[t('date'), t('expTitle'), t('budget'), t('amount'), t('paidBy'), t('paidHow'), t('payee'), t('note')]].concat(S.exp.map(e => [e.date || '', e.title || '', budName(lineOf(e)), Number(e.amount) || 0, e.paidBy || '', meth(e.method), e.payee || '', e.note || ''])));
  add(t('settle'), [[t('name'), t('took'), t('gave'), t('transfers'), t('holds') + ' (+) / ' + t('getsBack') + ' (−)']].concat(Lg.rows.map(r => [r.name, r.took, r.spent, r.tin - r.tout, r.held])).concat([[], [t('suggest')]]).concat(Lg.sug.map(x => [x.from + ' → ' + x.to, x.amount])).concat([[], [t('transfers')], [t('date'), t('fromP'), t('toP'), t('amount'), t('note')]]).concat(S.st.map(x => [x.date || '', x.from, x.to, Number(x.amount) || 0, x.note || ''])));
  add(t('gifts'), [[t('giftName'), t('forWhom'), t('need'), t('bought'), t('given'), t('unitPrice'), t('estCost'), t('linkBud'), t('note')]].concat(S.gifts.slice().sort(byOrder).map(g => { const i = giftInfo(g); return [g.name, giftWho(g), i.need, i.bought, i.given, Number(g.price) || 0, i.cost, g.bud ? budName(g.bud) : '', g.note || '']; })));
  const rr = [[t('giftName'), t('name'), t('famHead'), t('age'), t('given')]]; S.gifts.slice().sort(byOrder).forEach(g => giftInfo(g).rec.forEach(({ m: mm, f }) => rr.push([g.name, mm.name || '', famName(f), ageNum(mm.age), (g.given || {})[mm.id] ? '✓' : ''])));
  add(t('recipients'), rr);
  add(t('t_notes'), [[t('title'), t('noteText'), t('byWhom2'), t('upd')]].concat(S.notes.map(n => [n.title || '', n.body || '', n.by || '', n.upd ? new Date(n.upd).toLocaleString(P.lang === 'bn' ? 'bn-BD' : 'en-GB') : ''])));
  return wb;
}
const xlsxName = () => ((prog() || {}).name || 'program').replace(/[\\/:*?"<>|]/g, '').trim() + ` ${today()}.xlsx`;
async function exportExcel(share){
  toast(t('preparing'));
  try {
    await loadXLSX(); const wb = buildWorkbook(), X = window.XLSX, name = xlsxName();
    if (share) {
      const out = X.write(wb, { bookType:'xlsx', type:'array' });
      const file = new File([out], name, { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      if (navigator.canShare && navigator.canShare({ files:[file] })) { try { await navigator.share({ files:[file], title: name }); return; } catch(e) { if (e && e.name === 'AbortError') return; } }
    }
    X.writeFile(wb, name);
  } catch(e) { console.error(e); toast(t('excelFail')); }
}
function openExport(){
  openSheet({ title: t('excel'), body: () => `<p style="margin:0">${esc(t('excelHint'))}</p>
    <button class="btn" data-a="xlsxDown">${ic('download')}${esc(t('download'))}</button>
    <button class="btn ghost" data-a="xlsxShare">${ic('share')}${esc(t('shareFile'))}</button>
    ${DB.mode === 'demo' ? `<div class="note-box small">${esc(t('excelDemo'))}</div>` : ''}` });
}

/* ================= events ================= */
/* ================= phase 4: cloud status, backup, gift age groups, buses ================= */
/* ---------- cloud status strip ---------- */
S.sync = { pending: 0 };
function syncStrip(){
  if (DB.mode !== 'firebase') return '';
  const off = navigator.onLine === false, n = S.sync.pending;
  const [cls, txt] = off ? ['warn', t('syncOff')] : n > 0 ? ['warn', t('syncPending', nf(n))] : ['ok', t('syncOk')];
  return `<div class="demo-flag sync ${cls}" role="status"><span>${esc(txt)}</span></div>`;
}
window.addEventListener('pm-sync', e => {
  S.sync.pending = (e.detail && e.detail.pending) || 0;
  if (e.detail && e.detail.error) {
    const code = e.detail.error; S.lastWriteErr = { code, at: Date.now() };
    toast(t('writeFail') + ' ' + code);
    if (!S._wfAt || Date.now() - S._wfAt > 20000) { S._wfAt = Date.now();
      openSheet({ title: t('writeFailTitle'), body: () => `<div class="err">${esc(code)}</div><p style="margin:0">${esc(diagWhy(code))}</p><p class="small muted" style="margin:0">${esc(t('writeFailHint'))}</p>`,
        foot: () => `<button class="btn ghost" data-a="closeSheet">${esc(t('close'))}</button><button class="btn" data-a="diagOpen">${ic('cloud')}${esc(t('diagTitle'))}</button>` }); }
  }
  renderBandOnly();
});
function diagWhy(code){
  const c = String(code || '');
  if (c === 'permission-denied') return t('why_denied');
  if (c === 'unauthenticated') return t('why_unauth');
  if (c === 'timeout' || c === 'unavailable' || c === 'deadline-exceeded') return t('why_net');
  if (c === 'resource-exhausted') return t('why_quota');
  return t('why_other');
}
function openDiag(){
  const pr = S.profile || {}, p = prog(), adm = pr.role === 'admin';
  const row = (k, v) => `<div class="drow"><span class="dn">${esc(k)}</span><b style="overflow-wrap:anywhere;text-align:right">${esc(v)}</b></div>`;
  const perms = adm ? t('diagAll') : (PERMS.filter(k => pr.perms && pr.perms[k]).join(', ') || t('diagNone'));
  const le = S.lastWriteErr;
  openSheet({ title: t('diagTitle'), body: () => `<p class="small muted" style="margin:0">${esc(t('diagHint'))}</p>
    <div class="card flat">${row(t('email'), (S.user && S.user.email) || '—')}${row(t('diagRole'), (pr.role || '—') + (pr.active === false ? ' · ' + t('diagOff') : ''))}${row(t('diagPerms'), perms)}${row(t('diagNet'), navigator.onLine === false ? t('syncOff') : t('syncOk'))}${row(t('diagPending'), nf(S.sync.pending))}${row(t('diagRead'), S.dbErr || t('diagNone'))}${row(t('diagLast'), le ? `${le.code} · ${new Date(le.at).toLocaleTimeString(P.lang === 'bn' ? 'bn-BD' : 'en-GB')}` : t('diagNone'))}</div>
    <div id="diagOut" class="stack"></div>`,
    foot: () => p ? `<button class="btn" data-a="diagRun">${ic('check')}${esc(t('diagRun'))}</button>` : '' });
}

window.addEventListener('online', renderBandOnly); window.addEventListener('offline', renderBandOnly);

/* ---------- copy kept on this device ---------- */
const SUBS = ['families','payments','notes','budgets','expenses','sponsors','settlements','gifts'];
const LC_KEY = 'pm-autobackup';
function lcRead(){ try { return JSON.parse(localStorage.getItem(LC_KEY) || '{}'); } catch(e) { return {}; } }
let lcTimer = 0;
function lcSchedule(){ clearTimeout(lcTimer); lcTimer = setTimeout(lcSave, 2500); }
function lcSave(){
  const p = prog(); if (!p || DB.mode !== 'firebase') return;
  const sub = { families:S.fam, payments:S.pay, notes:S.notes, budgets:S.bud, expenses:S.exp, sponsors:S.sp, settlements:S.st, gifts:S.gifts };
  const count = SUBS.reduce((n, k) => n + sub[k].length, 0); if (!count) return;
  const entry = { at: Date.now(), count, id: p.id, doc: strip(p), sub: JSON.parse(JSON.stringify(sub)) };
  const all = lcRead(); const cur = all[p.id] || {};
  cur.latest = entry; if (!cur.best || count >= cur.best.count) cur.best = entry;
  all[p.id] = cur;
  try { localStorage.setItem(LC_KEY, JSON.stringify(all)); } catch(e) {}
}

/* ---------- backup file ---------- */
async function collectBackup(){
  const progs = await DB.getAll('programs'); const out = [];
  for (const p of progs) { const sub = {}; for (const c of SUBS) sub[c] = await DB.getAll(`programs/${p.id}/${c}`); out.push({ id: p.id, doc: strip(p), sub }); }
  return { app:'program-manager', version:1, at: new Date().toISOString(), programs: out };
}
async function deliverFile(blob, name){
  const file = new File([blob], name, { type: blob.type });
  if (navigator.canShare && navigator.canShare({ files:[file] })) { try { await navigator.share({ files:[file], title: name }); return true; } catch(e) { if (e && e.name === 'AbortError') return false; } }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); return true;
}
async function backupDownload(){
  toast(t('preparing'));
  try {
    const data = await collectBackup();
    const ok = await deliverFile(new Blob([JSON.stringify(data)], { type:'application/json' }), `program-manager-backup ${today()}.json`);
    if (ok) { try { localStorage.setItem('pm-lastbackup', String(Date.now())); } catch(e) {} toast(t('bkSaved')); }
  } catch(e) { console.error(e); toast(t('bkFail')); }
}
function backupCounts(data){ let n = 0; (data.programs || []).forEach(p => SUBS.forEach(c => { n += ((p.sub || {})[c] || []).length; })); return n; }
function askRestore(data){
  if (!data || !Array.isArray(data.programs) || !data.programs.length) { toast(t('bkBad')); return; }
  confirmBox(t('bkConfirm', nf(data.programs.length), nf(backupCounts(data))), () => restoreBackup(data), t('bkRestoreYes'));
}
async function restoreBackup(data){
  toast(t('bkRestoring'));
  try {
    for (const p of data.programs) {
      await DB.set('programs', p.id, p.doc);
      for (const c of SUBS) for (const d of ((p.sub || {})[c] || [])) { const id = d.id; await DB.set(`programs/${p.id}/${c}`, id, strip(d)); }
    }
    toast(t('bkDone'));
  } catch(e) { console.error(e); toast(t('bkFail')); }
}
function openBackup(){
  openSheet({ title: t('backup'), body: () => {
    const lc = lcRead(), mine = lc[S.pid] && lc[S.pid].best, last = Number((function(){ try { return localStorage.getItem('pm-lastbackup'); } catch(e) { return 0; } })()) || 0;
    return `<p style="margin:0">${esc(t('backupHint'))}</p>
    <div class="small muted">${esc(last ? t('bkLast', new Date(last).toLocaleString(P.lang === 'bn' ? 'bn-BD' : 'en-GB')) : t('bkNever'))}</div>
    <button class="btn" data-a="bkDown">${ic('download')}${esc(t('bkDownload'))}</button>
    ${isAdmin() ? `<button class="btn ghost" data-a="bkPick">${ic('upload')}${esc(t('bkRestore'))}</button><input type="file" id="bkFile" accept=".json,application/json" hidden>
    ${mine ? `<div class="note-box small">${esc(t('bkDevice', nf(mine.count), new Date(mine.at).toLocaleString(P.lang === 'bn' ? 'bn-BD' : 'en-GB')))}</div><button class="btn ghost" data-a="bkLocal">${ic('history')}${esc(t('bkRestoreDevice'))}</button>` : ''}` : ''}`; } });
}
document.addEventListener('change', e => {
  if (e.target.id !== 'bkFile') return; const f = e.target.files && e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => { try { askRestore(JSON.parse(String(r.result))); } catch(err) { toast(t('bkBad')); } };
  r.readAsText(f); e.target.value = '';
});

/* ---------- gift age groups (separate from the chanda / headcount groups) ---------- */
const giftGroupsOf = p => ((p && p.giftGroups) || []).length ? p.giftGroups : ((p && p.ageGroups) || []);

/* ---------- buses ---------- */
const famSize = f => (f.members || []).length;
const busList = () => (prog() || {}).buses || [];
function busOf(f){ const bs = busList(); if (f.bus === 'own') return 'own'; return bs.some(b => b.id === f.bus) ? f.bus : ''; }
function busGroups(){
  const bs = busList(), own = [], none = [], by = {}; bs.forEach(b => { by[b.id] = []; });
  S.fam.forEach(f => { const k = busOf(f); if (k === 'own') own.push(f); else if (k) by[k].push(f); else none.push(f); });
  return { bs, by, own, none };
}
const sumPeople = fs => fs.reduce((n, f) => n + famSize(f), 0);
const sumSeats = fs => fs.reduce((n, f) => n + famSeats(f), 0);
function busFamItem(f, i){
  return `<div class="item tap" data-a="busAssign" data-id="${f.id}" role="button" tabindex="0">${avatar(famName(f), i)}<div class="body"><div class="title">${esc(famName(f))}</div><div class="small muted">${[f.cat, famSeats(f) === famSize(f) ? t('peopleN', nf(famSize(f))) : t('peopleSeats', nf(famSize(f)), nf(famSeats(f)))].filter(Boolean).map(esc).join(' · ')}</div></div></div>`;
}
function busView(){
  const G = busGroups(), canSet = can('members');
  if (!G.bs.length) return `<div class="sec-h"><h2>${esc(t('buses'))}</h2></div>` + emptyBox('bus', t('noBuses'), isAdmin() ? `<button class="btn" data-a="busSetup">${ic('plus')}${esc(t('busSetup'))}</button>` : '');
  const card = (title, fams, cap, cls) => `<section class="card" style="padding-block:6px"><div class="row" style="justify-content:space-between;margin:4px 0"><h3 style="margin:0">${esc(title)}</h3><span class="pill ${cls || 'info'}">${esc(t('seatsN', nf(sumSeats(fams))))}${cap ? ` / ${nf(cap)}` : ''}</span></div>
    ${cap ? `<div class="bar thin"><i class="${sumSeats(fams) > cap ? 'bad' : sumSeats(fams) >= cap * 0.9 ? 'warn' : 'ok'}" style="width:${Math.min(100, Math.round(sumSeats(fams) * 100 / cap))}%"></i></div>` : ''}
    ${fams.length ? `<div class="list">${fams.map(busFamItem).join('')}</div>` : `<p class="muted small" style="margin:6px 0">${esc(t('busEmpty'))}</p>`}</section>`;
  return `<div class="sec-h"><h2>${esc(t('buses'))}</h2><span class="small muted">${esc(t('famN', nf(S.fam.length)))}</span></div>
  <div class="note-box small">${esc((q => t('seatSummary', nf(q.need), nf(q.free), nf(q.own), nf(seatAgeOf(prog()))))(seatStats()))}</div>
  <div class="row" style="flex-wrap:wrap">
    ${canSet ? `<button class="btn" data-a="busDraw">${ic('shuffle')}${esc(t('busDraw'))}</button>` : ''}
    <button class="btn ghost" data-a="busShare">${ic('share')}${esc(t('share'))}</button>
    ${isAdmin() ? `<button class="btn ghost" data-a="busSetup">${ic('edit')}${esc(t('busSetup'))}</button>` : ''}
    ${canSet && S.fam.some(f => busOf(f)) ? `<button class="btn ghost" data-a="busClear">${ic('trash')}${esc(t('busClear'))}</button>` : ''}</div>
  ${!canSet ? `<div class="note-box small">${esc(t('readOnly'))}</div>` : ''}
  ${G.none.length ? card(t('unassigned'), G.none, 0, 'warn') : ''}
  ${G.bs.map(b => card(b.name, G.by[b.id], Number(b.cap) || 0)).join('')}
  ${card(t('ownCar'), G.own, 0)}`;
}
function openBusAssign(id){
  const f = S.fam.find(x => x.id === id); if (!f) return; const G = busGroups(), cur = busOf(f);
  const opt = (v, label, sub) => `<button class="btn ${cur === v ? '' : 'ghost'} block" style="justify-content:space-between" data-a="busSet" data-id="${f.id}" data-v="${esc(v)}"><span>${esc(label)}</span><span class="small">${esc(sub || '')}</span></button>`;
  openSheet({ title: famName(f), body: () => `<p class="small muted" style="margin:0">${esc(t('peopleSeats', nf(famSize(f)), nf(famSeats(f))))}</p><div class="stack">
    ${G.bs.map(b => opt(b.id, b.name, `${nf(sumSeats(G.by[b.id]))}${Number(b.cap) ? ' / ' + nf(b.cap) : ''}`)).join('')}${opt('own', t('ownCar'), nf(sumPeople(G.own)))}${opt('', t('unassigned'), '')}</div>` });
}
async function setBus(id, v){
  const f = S.fam.find(x => x.id === id); if (!f || !can('members')) return;
  const d = Object.assign(strip(f), { bus: v, updatedAt: Date.now() });
  if (await commit('editFamily', [{ path: famPath(), id, data: d }], null, true)) { closeSheet(); renderBandOnly(); render(); }
}
function randInt(n){ if (window.crypto && crypto.getRandomValues) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; } return Math.floor(Math.random() * n); }
function drawBuses(){
  const G = busGroups(); if (!G.bs.length || !G.none.length) { toast(t('busNothing')); return; }
  const load = {}; G.bs.forEach(b => { load[b.id] = sumSeats(G.by[b.id]); });
  const pool = G.none.slice(); for (let i = pool.length - 1; i > 0; i--) { const j = randInt(i + 1); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const ops = []; let skipped = 0;
  pool.forEach(f => {
    const s = famSeats(f), fit = G.bs.filter(b => !Number(b.cap) || load[b.id] + s <= Number(b.cap)); if (!fit.length) { skipped++; return; }
    const min = Math.min(...fit.map(b => load[b.id])), low = fit.filter(b => load[b.id] === min), b = low[randInt(low.length)];
    load[b.id] += s; ops.push({ path: famPath(), id: f.id, data: Object.assign(strip(f), { bus: b.id, updatedAt: Date.now() }) });
  });
  if (!ops.length) { toast(t('busNoSeat')); return; }
  commit('editFamily', ops, skipped ? t('busDrawSkip', nf(ops.length), nf(skipped)) : t('busDrawDone', nf(ops.length)));
}
function busText(){
  const p = prog(), G = busGroups(), L = [`*${p.name}* — ${t('buses')}`, ''];
  const blk = (title, fams, cap) => { L.push(`*${title}* (${t('seatsN', nf(sumSeats(fams)))}${cap ? ' / ' + nf(cap) : ''})`); if (!fams.length) L.push('—'); fams.forEach((f, i) => L.push(`${nf(i + 1)}. ${famName(f)} (${nf(famSize(f))})`)); L.push(''); };
  G.bs.forEach(b => blk(b.name, G.by[b.id], Number(b.cap) || 0)); blk(t('ownCar'), G.own, 0); if (G.none.length) blk(t('unassigned'), G.none, 0);
  return L.join('\n').trim();
}
function busRow(b){
  return `<div class="mem" data-bid="${esc(b.id)}"><div class="mem-top"><input class="in b-name" placeholder="${esc(t('busName'))}" value="${esc(b.name || '')}" aria-label="${esc(t('busName'))}">
    <button type="button" class="iconbtn" style="background:var(--bad-soft);color:var(--bad)" data-a="rowDel" aria-label="${esc(t('del'))}">${ic('trash')}</button></div>
    <div class="field"><label>${esc(t('busCap'))}</label><input class="in b-cap" inputmode="numeric" value="${b.cap == null || b.cap === '' ? '' : esc(b.cap)}" placeholder="${esc(t('noLimit'))}"></div></div>`;
}
function openBusSetup(){
  const bs = busList();
  openSheet({ title: t('busSetup'), body: () => `<p class="small muted" style="margin:0">${esc(t('busHint'))}</p><div class="field"><label for="busSeatAge">${esc(t('seatAge'))}</label><input class="in" id="busSeatAge" inputmode="decimal" value="${esc(seatAgeOf(prog()))}"><span class="small muted">${esc(t('seatAgeHint'))}</span></div><div class="stack" id="rows">${bs.map(busRow).join('')}</div><button type="button" class="btn ghost" data-a="busAdd">${ic('plus')}${esc(t('addBus'))}</button>`,
    foot: () => `<button class="btn" data-a="busSave">${ic('check')}${esc(t('save'))}</button>` });
}

/* ================= phase 7: T-shirt management ================= */
const TS_DEFAULT = ['S', 'M', 'L', 'XL', 'XXL'];
function tsOf(p){
  const x = (p && p.tshirt) || {};
  const ma = (x.minAge == null || x.minAge === '' || !isFinite(Number(x.minAge))) ? 5 : Number(x.minAge);
  return { sizes: Array.isArray(x.sizes) ? x.sizes : TS_DEFAULT, price: Number(x.price) || 0, minAge: ma, extra: x.extra || {}, bud: x.bud || '' };
}
const tsFull = p => { const T = tsOf(p); return { sizes: T.sizes.slice(), price: T.price, minAge: T.minAge, extra: Object.assign({}, T.extra), bud: T.bud }; };
const tsSave = patch => { const p = prog(); return patchProg({ tshirt: Object.assign(tsFull(p), patch) }); };
function tsState(m, T){
  if (m.ts === '-') return { k: 'none' };
  if (m.ts && T.sizes.includes(m.ts)) return { k: 'size', s: m.ts };
  const a = ageNum(m.age); if (a != null && a < T.minAge) return { k: 'none', auto: true };
  return { k: 'unset' };
}
const tsLabel = m => { const st = tsState(m, tsOf(prog())); return st.k === 'size' ? st.s : st.k === 'none' ? t('tsNoNeed') : ''; };
function tsStats(){
  const T = tsOf(prog()), by = {}; T.sizes.forEach(s => { by[s] = 0; });
  let none = 0, unset = 0;
  S.fam.forEach(f => (f.members || []).forEach(m => { const st = tsState(m, T); if (st.k === 'size') by[st.s]++; else if (st.k === 'none') none++; else unset++; }));
  const people = T.sizes.reduce((a, s) => a + by[s], 0), extraN = T.sizes.reduce((a, s) => a + (Number(T.extra[s]) || 0), 0), total = people + extraN;
  return { by, none, unset, people, extraN, total, price: T.price, cost: total * T.price };
}
function tshirtView(){
  const p = prog(), T = tsOf(p), q = tsStats(), adm = isAdmin(), canSet = can('members');
  const head = `<div class="sec-h"><h2>${esc(t('tshirt'))}</h2>${adm ? `<button class="linkbtn small" data-a="tsSetup">${esc(t('tsSetup'))}</button>` : ''}</div>`;
  if (!T.sizes.length) return head + emptyBox('shirt', t('tsNoSizes'), adm ? `<button class="btn" data-a="tsSetup">${ic('edit')}${esc(t('tsSetup'))}</button>` : '');
  const line = T.bud && S.bud.find(b => b.id === T.bud), actual = line ? spentOn(line.id) : 0, bAmt = line ? Number(line.amount) || 0 : 0;
  const rows = T.sizes.map(s => { const e = Number(T.extra[s]) || 0;
    const ex = adm ? `<span class="stepper"><button type="button" class="ib" data-a="tsExtra" data-s="${esc(s)}" data-d="-1" ${e <= 0 ? 'disabled' : ''} aria-label="-">−</button><b class="num">${nf(e)}</b><button type="button" class="ib" data-a="tsExtra" data-s="${esc(s)}" data-d="1" aria-label="+">+</button></span>` : nf(e);
    return `<tr><td><b>${esc(s)}</b></td><td>${nf(q.by[s])}</td><td>${ex}</td><td><b>${nf(q.by[s] + e)}</b></td></tr>`; }).join('');
  const items = []; S.fam.forEach(f => (f.members || []).forEach(m => items.push({ f, m, st: tsState(m, T) })));
  const shown = S.tsOnly ? items.filter(x => x.st.k === 'unset') : items;
  const list = shown.length ? `<section class="card" style="padding-block:4px"><div class="list">${shown.map(({ f, m, st }) => {
    const cur = st.k === 'size' ? st.s : (st.k === 'none' && !st.auto) ? '-' : '';
    const sub = [famName(f), ageNum(m.age) != null ? nf(m.age) : '', st.auto ? t('tsAutoNone') : ''].filter(Boolean).map(esc).join(' · ');
    return `<div class="item"><div class="body"><div class="title">${esc(m.name || '—')}</div><div class="small muted">${sub}</div></div>
      <select class="in" style="width:auto;min-width:112px;flex:none" data-tsm="${esc(f.id)}|${esc(m.id)}" ${canSet ? '' : 'disabled'} aria-label="${esc(t('tsSizeLbl'))}"><option value="">${esc(t('tsUnsetOpt'))}</option><option value="-" ${cur === '-' ? 'selected' : ''}>${esc(t('tsNoNeed'))}</option>${T.sizes.map(s => `<option value="${esc(s)}" ${cur === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></div>`; }).join('')}</div></section>`
    : emptyBox('shirt', S.tsOnly ? t('tsAllDone') : t('noFamilies'));
  return `${head}
  <section class="hero-card"><div class="grid3">${tileH(t('tsTotal'), nf(q.total))}${tileH(t('tsPeople'), nf(q.people))}${tileH(t('tsUnset'), nf(q.unset), q.unset ? 'color:var(--bad)' : '')}</div>
    ${q.none ? `<div class="small muted">${esc(t('tsNoneN', nf(q.none)))}</div>` : ''}
    <div class="row"><button class="btn ghost sm" data-a="tsShare">${ic('share')}${esc(t('tsShare'))}</button></div></section>
  <section class="card"><div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('tsSizeH'))}</th><th>${esc(t('tsCount'))}</th><th>${esc(t('tsExtra'))}</th><th>${esc(t('total'))}</th></tr></thead><tbody>${rows}</tbody>
    <tfoot><tr><td>${esc(t('total'))}</td><td>${nf(q.people)}</td><td>${nf(q.extraN)}</td><td>${nf(q.total)}</td></tr></tfoot></table></div></section>
  <section class="card"><div class="grid3">${tileH(t('tsPrice'), T.price ? tk(T.price) : '—')}${tileH(t('tsCostEst'), tk(q.cost))}${line ? tileH(t('tsActual'), tk(actual)) : ''}</div>
    ${line ? `<div class="small muted" style="margin-top:10px">${esc(t('budget'))}: ${tk(bAmt)}</div><div class="bar thin" style="margin-top:4px"><i class="${barCls(actual, bAmt)}" style="width:${barW(actual, bAmt)}%"></i></div>` : ''}
    ${!T.price ? `<p class="small muted" style="margin:10px 0 0">${esc(t('tsNoPrice'))}</p>` : ''}
    <div class="row" style="margin-top:12px;flex-wrap:wrap">${adm && q.cost > 0 ? `<button class="btn ghost sm" data-a="tsToBudget">${ic('pie')}${esc(line ? t('tsBudUpdate') : t('tsToBudget'))}</button>` : ''}${can('expense') ? `<button class="btn sm" data-a="tsAddExp" data-bud="${line ? esc(line.id) : ''}">${ic('plus')}${esc(t('tsAddExp'))}</button>` : ''}</div></section>
  <div class="sec-h"><h2>${esc(t('tsWho'))}</h2></div>
  <div class="seg"><button class="${S.tsOnly ? '' : 'on'}" data-a="tsFilter" data-v="0">${esc(t('tsAll'))}</button><button class="${S.tsOnly ? 'on' : ''}" data-a="tsFilter" data-v="1">${esc(t('tsOnlyUnset'))} (${nf(q.unset)})</button></div>
  ${!canSet ? `<div class="note-box small">${esc(t('readOnly'))}</div>` : ''}
  ${list}`;
}
async function setShirt(key, v){
  const [fid, mid] = String(key).split('|'); const f = S.fam.find(x => x.id === fid); if (!f || !can('members')) return;
  const d = Object.assign(strip(f), { updatedAt: Date.now() }); d.members = (f.members || []).map(m => m.id === mid ? Object.assign({}, m, { ts: v }) : m);
  if (await commit('editFamily', [{ path: famPath(), id: fid, data: d }], null, true)) render();
}
function sizeRow(s){
  const sb = 'style="background:var(--surface-2);color:var(--ink)"';
  return `<div class="mem" data-old="${esc(s)}"><div class="mem-top"><input class="in s-name" value="${esc(s)}" placeholder="${esc(t('tsSizeH'))}" aria-label="${esc(t('tsSizeH'))}"><button type="button" class="iconbtn" ${sb} data-a="rowUp" aria-label="up">${ic('up')}</button><button type="button" class="iconbtn" ${sb} data-a="rowDown" aria-label="down">${ic('down')}</button><button type="button" class="iconbtn" style="background:var(--bad-soft);color:var(--bad)" data-a="rowDel" aria-label="${esc(t('del'))}">${ic('trash')}</button></div></div>`;
}
function openTsSetup(){
  const T = tsOf(prog());
  openSheet({ title: t('tsSetup'), body: () => `<p class="small muted" style="margin:0">${esc(t('tsSizesHint'))}</p><div class="stack" id="rows">${T.sizes.map(sizeRow).join('')}</div><button type="button" class="btn ghost" data-a="tsSizeAdd">${ic('plus')}${esc(t('tsAddSize'))}</button>
    <div class="grid2"><div class="field"><label for="tsPrice">${esc(t('tsPrice'))}</label>${calcInput('tsPrice', T.price || null)}</div><div class="field"><label for="tsMinAge">${esc(t('tsMinAge'))}</label><input class="in" id="tsMinAge" inputmode="decimal" value="${esc(T.minAge)}"></div></div><div class="small muted">${esc(t('tsMinAgeHint'))}</div>`,
    foot: () => `<button class="btn" data-a="tsSetupSave">${ic('check')}${esc(t('save'))}</button>` });
}
function tsText(){
  const p = prog(), T = tsOf(p), q = tsStats(), L = [`*${p.name}* — ${t('tshirt')}`, ''];
  T.sizes.forEach(s => { const n = q.by[s] + (Number(T.extra[s]) || 0); if (n) L.push(`${s} - ${nf(n)}`); });
  L.push('', `${t('tsTotal')}: ${nf(q.total)}`); if (T.price) L.push(`${t('tsCostEst')}: ${tk(q.cost)}`);
  return L.join('\n');
}

/* ================= phase 6: customizable dashboard ================= */
const DASH_TYPES = { people:'totalPeople', depts:'byDept', seats:'busSeats', tshirt:'tshirt', chanda:'t_chanda', money:'money', gifts:'gifts', ages:'byAge', cats:'byCat', note:'progNote', stat:'customCard' };
const DASH_BUILTIN = ['people', 'depts', 'seats', 'tshirt', 'chanda', 'money', 'gifts', 'ages', 'cats', 'note'];
const dashDefault = () => DASH_BUILTIN.map(k => ({ id: k, type: k, size: 'full', title: '', cfg: {} }));
const dashOf = p => Array.isArray((p || {}).dash) ? p.dash : dashDefault();
const dashTitle = c => c.title || t(DASH_TYPES[c.type] || 'customCard');

function metricCatalog(){
  const s = stats(), q = seatStats(), m = money(), o = [];
  const add = (g, k, label, v, isMoney) => o.push({ g, k, label, v, money: !!isMoney });
  const g1 = t('totalPeople'), g2 = t('t_chanda'), g3 = t('money'), g4 = t('busSeats'), g5 = t('byDeptShort'), g6 = t('byCat'), g7 = t('byAge');
  add(g1, 'persons', t('totalPeople'), s.persons); add(g1, 'fams', t('families'), s.fams); add(g1, 'inn', t('inside'), s.inn); add(g1, 'out', t('outsideShort'), s.out); add(g1, 'm', t('male'), s.m); add(g1, 'f', t('female'), s.f);
  add(g2, 'due', t('due'), s.due, 1); add(g2, 'paid', t('collected'), s.paid, 1); add(g2, 'rem', t('remaining'), Math.max(0, s.due - s.paid), 1);
  add(g3, 'income', t('income'), m.income, 1); add(g3, 'spent', t('spent'), m.spent, 1); add(g3, 'bal', m.bal >= 0 ? t('inHand') : t('deficit'), Math.abs(m.bal), 1);
  add(g4, 'seatsNeed', t('seatsNeed'), q.need); add(g4, 'seatsFree', t('noSeat'), q.free); add(g4, 'seatsOwn', t('ownCarP'), q.own);
  { const T = tsOf(prog()), tq = tsStats(), g8 = t('tshirt');
    if (T.sizes.length && (tq.people || tq.extraN)) { add(g8, 'tsTotal', t('tsTotal'), tq.total); T.sizes.forEach(z => add(g8, 'ts:' + z, z, tq.by[z] + (Number(T.extra[z]) || 0))); if (T.price) add(g8, 'tsCost', t('tsCostEst'), tq.cost, 1); add(g8, 'tsUnset', t('tsUnset'), tq.unset); } }
  deptStats().forEach(r => { if (r.key === '' && !r.fams) return; add(g5, 'd:' + r.key, r.name + ' · ' + t('people'), r.persons); add(g5, 'dp:' + r.key, r.name + ' · ' + t('collected'), r.paid, 1); });
  Object.keys(s.cats).forEach(c => add(g6, 'c:' + c, (c || t('noCat')) + ' · ' + t('people'), s.cats[c].persons));
  s.groups.forEach(G => add(g7, 'a:' + G.g.id, G.g.name + ' (' + rangeLabel(G.g.min, G.g.max) + ')', G.total));
  return o;
}

const DR = {
  people: c => {
    const p = prog(), s = stats();
    const tile = (k, v, cls) => `<div class="tile ${cls || ''}"><div class="k">${esc(k)}</div><div class="v num ${cls ? 'brand' : ''}">${v}</div></div>`;
    return `<section class="hero-card" aria-label="${esc(p.name)}">${c.title ? `<h3 style="margin:0">${esc(c.title)}</h3>` : ''}
      <div class="row"><span class="pill info">${esc(t('ty_' + (p.type || 'other')))}</span>${p.date ? `<span class="row small muted" style="gap:4px"><span style="width:16px;height:16px;display:inline-flex">${ic('cal')}</span>${esc(fd(p.date))}</span>` : ''}${p.venue ? `<span class="row small muted" style="gap:4px"><span style="width:16px;height:16px;display:inline-flex">${ic('map')}</span>${esc(p.venue)}</span>` : ''}</div>
      <div class="grid3">${tile(t('totalPeople'), nf(s.persons), 'brand')}${tile(t('families'), nf(s.fams))}${tile(t('inside'), nf(s.inn))}${tile(t('outsideShort'), nf(s.out))}${tile(t('male'), nf(s.m))}${tile(t('female'), nf(s.f))}</div>
    </section>`;
  },
  depts: c => {
    const ds = deptsOf(prog()); const rows = deptStats().filter(r => r.key !== '__out' && (r.fams || r.key !== ''));
    const head = `<div class="row" style="justify-content:space-between;margin-bottom:10px"><h3 style="margin:0">${esc(dashTitle(c))}</h3>${isAdmin() ? `<button class="linkbtn small" data-a="depts">${esc(t('edit'))}</button>` : ''}</div>`;
    if (!ds.length) return isAdmin() ? `<section class="card">${head}<p class="muted" style="margin:0 0 10px">${esc(t('noDeptsYet'))}</p><button class="btn sm" data-a="depts">${ic('plus')}${esc(t('addDept'))}</button></section>` : '';
    return `<section class="card">${head}<div class="grid3">${rows.map(r => `<div class="tile"><div class="k">${esc(r.name)}</div><div class="v num">${nf(r.persons)}</div><div class="small muted">${esc(t('famN', nf(r.fams)))}</div></div>`).join('')}</div></section>`;
  },
  seats: c => {
    if (!S.fam.length) return ''; const q = seatStats(), a = seatAgeOf(prog());
    const tl = (k, v, sub) => `<div class="tile"><div class="k">${esc(k)}</div><div class="v num">${nf(v)}</div>${sub ? `<div class="small muted">${esc(sub)}</div>` : ''}</div>`;
    return `<section class="card tap" data-a="tab" data-v="bus" role="button" tabindex="0"><h3>${esc(dashTitle(c))}</h3><div class="grid3">${tl(t('seatsNeed'), q.need)}${tl(t('noSeat'), q.free, t('underAge', nf(a)))}${tl(t('ownCarP'), q.own)}</div></section>`;
  },
  tshirt: c => {
    const T = tsOf(prog()), q = tsStats(); if (!T.sizes.length || !(q.people || q.extraN)) return '';
    return `<section class="card tap" data-a="tab" data-v="tshirt" role="button" tabindex="0"><div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(dashTitle(c))}</h3><b class="num">${esc(t('tsTotalN', nf(q.total)))}</b></div>
      <div class="grid3" style="margin-top:10px">${T.sizes.map(z => `<div class="tile"><div class="k">${esc(z)}</div><div class="v num">${nf(q.by[z] + (Number(T.extra[z]) || 0))}</div></div>`).join('')}</div>
      ${T.price ? `<div class="small muted" style="margin-top:8px">${esc(t('tsCostEst'))}: <b class="num">${tk(q.cost)}</b></div>` : ''}${q.unset ? `<div class="small" style="margin-top:4px;color:var(--bad)">${esc(t('tsUnsetN', nf(q.unset)))}</div>` : ''}</section>`;
  },
  chanda: c => {
    const s = stats(); const pct = s.due > 0 ? Math.min(100, Math.round(s.paid / s.due * 100)) : 0;
    return `<section class="card tap" data-a="tab" data-v="income" data-inc="chanda" role="button" tabindex="0">
      <div class="row" style="justify-content:space-between"><h3 style="margin:0">${esc(dashTitle(c))}</h3><span class="small muted num">${nf(pct)}%</span></div>
      <div class="bar" style="margin:10px 0"><i style="width:${pct}%"></i></div>
      <div class="grid3"><div><div class="small muted">${esc(t('due'))}</div><b class="num">${tk(s.due)}</b></div><div><div class="small muted">${esc(t('collected'))}</div><b class="num" style="color:var(--ok)">${tk(s.paid)}</b></div><div><div class="small muted">${esc(t('remaining'))}</div><b class="num" style="color:var(--bad)">${tk(Math.max(0, s.due - s.paid))}</b></div></div>
      ${(c.cfg || {}).byDept === false ? '' : deptChandaHtml()}
    </section>`;
  },
  money: c => moneyCard(c),
  gifts: c => giftCard(c),
  ages: c => {
    const p = prog(), s = stats();
    const tbl = (p.ageGroups || []).length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('group'))}</th><th>${esc(t('total'))}</th><th>${esc(t('male'))}</th><th>${esc(t('female'))}</th><th>${esc(t('inside'))}</th><th>${esc(t('outsideShort'))}</th></tr></thead><tbody>
      ${s.groups.map(G => `<tr><td><b>${esc(G.g.name)}</b><div class="small muted">${esc(rangeLabel(G.g.min, G.g.max))}</div></td><td><b>${nf(G.total)}</b></td><td>${nf(G.m)}</td><td>${nf(G.f)}</td><td>${nf(G.inn)}</td><td>${nf(G.out)}</td></tr>`).join('')}
      ${s.unknown ? `<tr><td class="muted">${esc(t('unknownAge'))}</td><td>${nf(s.unknown)}</td><td></td><td></td><td></td><td></td></tr>` : ''}
      </tbody></table></div>` : `<p class="muted" style="margin:0 0 10px">${esc(t('noGroups'))}</p>${isAdmin() ? `<button class="btn sm" data-a="ageGroups">${ic('baby')}${esc(t('setGroups'))}</button>` : ''}`;
    return `<section class="card"><div class="row" style="justify-content:space-between;margin-bottom:6px"><h3 style="margin:0">${esc(dashTitle(c))}</h3>${isAdmin() && (p.ageGroups || []).length ? `<button class="linkbtn small" data-a="ageGroups">${esc(t('edit'))}</button>` : ''}</div>${tbl}</section>`;
  },
  cats: c => {
    const s = stats(); const cats = Object.keys(s.cats);
    const tbl = cats.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>${esc(t('category'))}</th><th>${esc(t('families'))}</th><th>${esc(t('people'))}</th><th>${esc(t('due'))}</th><th>${esc(t('collected'))}</th></tr></thead><tbody>
      ${cats.map(k => { const x = s.cats[k]; return `<tr><td>${esc(k || t('noCat'))}</td><td>${nf(x.fams)}</td><td>${nf(x.persons)}</td><td>${tk(x.due)}</td><td>${tk(x.paid)}</td></tr>`; }).join('')}
      </tbody><tfoot><tr><td>${esc(t('total'))}</td><td>${nf(s.fams)}</td><td>${nf(s.persons)}</td><td>${tk(s.due)}</td><td>${tk(s.paid)}</td></tr></tfoot></table></div>` : `<p class="muted" style="margin:0">${esc(t('noFamilies'))}</p>`;
    return `<section class="card"><h3>${esc(dashTitle(c))}</h3>${tbl}</section>`;
  },
  note: c => { const p = prog(); return p.note ? `<section class="card note-card"><h3>${esc(dashTitle(c))}</h3><div class="note-body">${esc(p.note)}</div></section>` : ''; },
  stat: c => {
    const by = {}; metricCatalog().forEach(x => { by[x.k] = x; });
    const ts = (((c.cfg || {}).items) || []).map(k => by[k]).filter(Boolean);
    return `<section class="card"><h3>${esc(dashTitle(c))}</h3>${ts.length ? `<div class="grid3">${ts.map(x => `<div class="tile"><div class="k">${esc(x.label)}</div><div class="v num ${x.money ? 'sm' : ''}">${x.money ? tk(x.v) : nf(x.v)}</div></div>`).join('')}</div>` : `<p class="muted" style="margin:0">${esc(t('metricsNone'))}</p>`}</section>`;
  }
};

function dashCardHtml(c, i, n, ed){
  let body = (DR[c.type] || (() => ''))(c);
  if (!body && !ed) return '';
  if (!body) body = `<section class="card"><h3>${esc(dashTitle(c))}</h3><p class="muted" style="margin:0">${esc(t('emptyCard'))}</p></section>`;
  const half = c.size === 'half';
  const b = (a, ico, lbl, dis) => `<button type="button" class="ib" data-a="${a}" data-did="${esc(c.id)}" aria-label="${esc(lbl)}" ${dis ? 'disabled' : ''}>${ico}</button>`;
  const tools = ed ? `<div class="dtool"><b class="dt">${esc(dashTitle(c))}</b><div class="dbtns">${b('dashUp', ic('up'), 'up', i === 0)}${b('dashDown', ic('down'), 'down', i === n - 1)}${b('dashSize', ic(half ? 'expand' : 'shrink'), half ? t('szBig') : t('szSmall'))}${b('dashEditCard', ic('edit'), t('edit'))}<button type="button" class="ib bad" data-a="dashDel" data-did="${esc(c.id)}" aria-label="${esc(t('del'))}">${ic('trash')}</button></div></div>` : '';
  return `<div class="dcard ${half ? 'half' : 'full'}" data-did="${esc(c.id)}">${tools}<div class="dbody">${body}</div></div>`;
}
function homeView(){
  const p = prog(), dash = dashOf(p), ed = isAdmin() && !!S.dashEdit;
  const bar = !isAdmin() ? '' : ed
    ? `<div class="dashbar edit"><span class="small">${esc(t('dashEditing'))}</span><div class="row" style="gap:8px"><button class="btn sm" data-a="dashAdd">${ic('plus')}${esc(t('addCard'))}</button><button class="btn ghost sm" data-a="dashMode">${ic('check')}${esc(t('doneBtn'))}</button></div></div>`
    : `<div class="dashbar"><button class="linkbtn small" data-a="dashMode"><span class="dbi">${ic('sliders')}</span>${esc(t('customize'))}</button></div>`;
  return `${bar}<div class="dash ${ed ? 'editing' : ''}">${dash.map((c, i) => dashCardHtml(c, i, dash.length, ed)).join('')}</div>${ed && !dash.length ? `<div class="empty">${esc(t('emptyDash'))}</div>` : ''}`;
}
const dashSet = (fn, extra) => { const d = JSON.parse(JSON.stringify(dashOf(prog()))); fn(d); return patchProg(Object.assign({ dash: d }, extra || {})); };
function openDashAdd(){
  openSheet({ title: t('addCard'), body: () => { const have = new Set(dashOf(prog()).map(c => c.type)); const miss = DASH_BUILTIN.filter(k => !have.has(k));
    return `<div class="stack">${miss.map(k => `<button type="button" class="btn ghost block" data-a="dashAddType" data-type="${k}">${ic('plus')}${esc(t(DASH_TYPES[k]))}</button>`).join('')}
      <button type="button" class="btn block" data-a="dashAddType" data-type="stat">${ic('plus')}${esc(t('customCard'))}</button>
      <p class="small muted" style="margin:0">${esc(miss.length ? t('customCardHint') : t('noCardsLeft'))}</p>
      <button type="button" class="linkbtn small" data-a="dashReset" style="text-align:left">${esc(t('resetDash'))}</button></div>`; } });
}
function openDashCard(id){
  const p = prog(), c = dashOf(p).find(x => x.id === id); if (!c) return; const cfg = c.cfg || {};
  let extra = '';
  const short = (a, l) => `<button type="button" class="btn ghost block" data-a="${a}">${esc(l)}</button>`;
  if (c.type === 'chanda') extra = `<label class="mchk"><input type="checkbox" id="dcDept" ${cfg.byDept === false ? '' : 'checked'}><span>${esc(t('showDeptSplit'))}</span></label>${short('rates', t('rates'))}${short('depts', t('depts'))}`;
  else if (c.type === 'seats') extra = `<div class="field"><label for="dcSeatAge">${esc(t('seatAge'))}</label><input class="in" id="dcSeatAge" inputmode="decimal" value="${p.seatAge == null ? '' : esc(p.seatAge)}" placeholder="${nf(3)}"><div class="small muted">${esc(t('seatAgeHint'))}</div></div>`;
  else if (c.type === 'depts') extra = short('depts', t('depts'));
  else if (c.type === 'ages') extra = short('ageGroups', t('ageGroups'));
  else if (c.type === 'cats') extra = short('cats', t('categories'));
  else if (c.type === 'stat') {
    const sel = new Set(cfg.items || []), groups = [];
    metricCatalog().forEach(x => { let g = groups.find(y => y.g === x.g); if (!g) groups.push(g = { g: x.g, items: [] }); g.items.push(x); });
    extra = `<p class="small muted" style="margin:0">${esc(t('customCardHint'))}</p>` + groups.map(g => `<div class="field"><label>${esc(g.g)}</label><div class="mlist">${g.items.map(x => `<label class="mchk"><input type="checkbox" data-mk="${esc(x.k)}" ${sel.has(x.k) ? 'checked' : ''}><span>${esc(x.label)}</span></label>`).join('')}</div></div>`).join('');
  }
  openSheet({ title: t('editCard'), body: () => `
    <div class="field"><label for="dcTitle">${esc(t('cardTitle'))}</label><input class="in" id="dcTitle" value="${esc(c.title || '')}" placeholder="${esc(t(DASH_TYPES[c.type]))}"></div>
    <div class="field"><label>${esc(t('cardSize'))}</label><div class="seg" id="dcSize"><button type="button" class="${c.size === 'half' ? 'on' : ''}" data-a="segPick" data-v="half">${esc(t('szHalf'))}</button><button type="button" class="${c.size === 'half' ? '' : 'on'}" data-a="segPick" data-v="full">${esc(t('szFull'))}</button></div></div>
    ${extra ? `<div class="stack">${extra}</div>` : ''}`,
    foot: () => `<button class="btn" data-a="dashSave" data-did="${esc(c.id)}">${ic('check')}${esc(t('save'))}</button>` });
}

/* ================= phase 5: departments, seats, tidy-ups ================= */
const DEFAULT_DEPTS = ['MICU', 'SICU', 'HDU'];
const deptsOf = p => Array.isArray((p || {}).depts) ? p.depts : DEFAULT_DEPTS;
function deptKey(f){ if (f.side === 'out') return '__out'; return deptsOf(prog()).includes(f.dept) ? f.dept : ''; }
const deptName = f => f.side === 'out' ? t('outsideShort') : (f.dept || t('noDept'));
function deptStats(){
  const p = prog() || {}, map = {}; const order = deptsOf(p).slice();
  order.forEach(d => { map[d] = { key: d, name: d, fams: 0, persons: 0, due: 0, paid: 0 }; });
  S.fam.forEach(f => {
    const k = deptKey(f); if (!map[k]) map[k] = { key: k, name: k === '__out' ? t('outsideShort') : t('noDept'), fams: 0, persons: 0, due: 0, paid: 0 };
    const x = map[k]; x.fams++; x.persons += famSize(f); x.due += famDue(f, p); x.paid += famPaid(f.id);
  });
  const rows = order.map(d => map[d]); if (map['__out']) rows.push(map['__out']); if (map['']) rows.push(map['']);
  return rows;
}
function deptChandaHtml(){
  if (!deptsOf(prog()).length) return '';
  const rows = deptStats().filter(r => r.fams || deptsOf(prog()).includes(r.key)); if (!rows.length) return '';
  return `<div class="deptbox"><div class="row" style="justify-content:space-between"><div class="small muted" style="font-weight:700">${esc(t('deptChanda'))}</div>${isAdmin() ? `<button class="linkbtn small" data-a="depts">${esc(t('edit'))}</button>` : ''}</div>${rows.map(r => { const pc = r.due > 0 ? Math.min(100, Math.round(r.paid / r.due * 100)) : 0;
    return `<div class="drow"><span class="dn">${esc(r.name)} <span class="small muted">· ${esc(t('peopleN', nf(r.persons)))}</span></span><span class="num"><b style="color:var(--ok)">${tk(r.paid)}</b> <span class="muted small">/ ${tk(r.due)}</span></span></div><div class="bar thin"><i style="width:${pc}%"></i></div>`; }).join('')}</div>`;
}
const seatAgeOf = p => { const v = (p || {}).seatAge; return (v === undefined || v === null || v === '' || !isFinite(Number(v))) ? 3 : Number(v); };
const famSeats = f => (f.members || []).filter(m => { const a = ageNum(m.age); return a == null || a >= seatAgeOf(prog()); }).length;
function seatStats(){
  const o = { need: 0, free: 0, own: 0 };
  S.fam.forEach(f => { const n = famSize(f), s = famSeats(f); if (f.bus === 'own') o.own += n; else { o.need += s; o.free += n - s; } });
  return o;
}
function deptRow(d){
  const sb = 'style="background:var(--surface-2);color:var(--ink)"';
  return `<div class="mem" data-old="${esc(d)}"><div class="mem-top"><input class="in d-name" value="${esc(d)}" placeholder="${esc(t('deptNameP'))}" aria-label="${esc(t('deptNameP'))}"><button type="button" class="iconbtn" ${sb} data-a="rowUp" aria-label="up">${ic('up')}</button><button type="button" class="iconbtn" ${sb} data-a="rowDown" aria-label="down">${ic('down')}</button><button type="button" class="iconbtn" style="background:var(--bad-soft);color:var(--bad)" data-a="rowDel" aria-label="${esc(t('del'))}">${ic('trash')}</button></div></div>`;
}
function openDepts(){
  const p = prog();
  openSheet({ title: t('depts'), body: () => `<p class="small muted" style="margin:0">${esc(t('deptHint'))}</p><div class="stack" id="rows">${deptsOf(p).map(deptRow).join('')}</div><button type="button" class="btn ghost" data-a="deptAdd">${ic('plus')}${esc(t('addDept'))}</button>`,
    foot: () => `<button class="btn" data-a="deptsSave">${ic('check')}${esc(t('save'))}</button>` });
}
function syncChip(){
  if (DB.mode !== 'firebase') return '';
  const off = navigator.onLine === false, n = S.sync.pending, bad = off || n > 0;
  return `<button class="syncchip ${bad ? 'warn' : 'ok'}" data-a="syncInfo" aria-label="${esc(off ? t('syncOff') : n > 0 ? t('syncPending', nf(n)) : t('syncOk'))}"><span style="width:14px;height:14px;display:inline-flex">${ic('cloud')}</span>${bad ? `<b>${n > 0 ? nf(n) : '!'}</b>` : ''}</button>`;
}

const A = {
  tab: el => { S.view = el.dataset.v; if (el.dataset.inc) S.incMode = el.dataset.inc; if (el.dataset.spend) S.spendMode = el.dataset.spend; S.q = ''; S.cq = ''; S.eq = ''; render(); window.scrollTo(0, 0); },
  demoIn: el => DB.demoSignIn(el.dataset.r),
  googleIn: async () => {
    S.busy = true; S.loginErr = ''; render();
    try { await DB.signInGoogle(); S.busy = false; }
    catch(err) { S.busy = false; S.loginErr = loginMsg(err); render(); }
  },
  signOut: () => { DB.signOut(); },
  lang: el => { P.lang = el.dataset.l; savePrefs(); $('#toast').hidden = true; if (DB.mode === 'demo' && DB.isPristine() && DB.seedLang() !== P.lang) { DB.resetDemo(false, P.lang); S.undo = []; } render(); if (sheets.length && sheets[sheets.length - 1].kind === 'appearance') { closeSheet(); openAppearance(); } },
  closeSheet: () => closeSheet(),
  undo: () => undoLast(),
  progPicker: () => openProgPicker(),
  progPick: el => { setProgram(el.dataset.id); closeAll(); S.view = 'home'; render(); },
  progNew: () => { closeAll(); openProgForm(null); },
  progEdit: () => openProgForm(S.pid),
  progSave: el => saveProg(el.dataset.id, el.closest('.sheet')),
  progDel: () => { const p = prog(); confirmBox(`${p.name}: ${t('delProgramSure')}`, async () => {
      const ops = [{ path:'programs', id:p.id, data:null }].concat(S.fam.map(f => ({ path: famPath(), id: f.id, data:null })), S.pay.map(x => ({ path: payPath(), id: x.id, data:null })), S.notes.map(n => ({ path: notePath(), id: n.id, data:null })), S.bud.map(x => ({ path: budPath(), id: x.id, data:null })), S.exp.map(x => ({ path: expPath(), id: x.id, data:null })), S.sp.map(x => ({ path: spPath(), id: x.id, data:null })), S.st.map(x => ({ path: stPath(), id: x.id, data:null })), S.gifts.map(x => ({ path: giftPath(), id: x.id, data:null })));
      await commit('delProgram', ops, t('deleted')); }); },
  segPick: el => { $$('[data-a="segPick"]', el.parentNode).forEach(b => b.classList.toggle('on', b === el)); const sh = el.closest('.sheet'); if (sh && el.dataset.g) $$('[data-when]', sh).forEach(n => { const [g, v] = n.dataset.when.split(':'); if (g === el.dataset.g) n.hidden = v !== el.dataset.v; }); },
  ageGroups: () => openAgeGroups(),
  giftGroups: () => openAgeGroups('gift'),
  groupAdd: el => { const sh = el.closest('.sheet'); $('#rows', sh).insertAdjacentHTML('beforeend', groupRow({ id: DB.rid(), name:'', min:null, max:null })); $$('#rows .g-name', sh).pop().focus(); },
  rowDel: el => el.closest('.mem').remove(),
  rowUp: el => { const r = el.closest('.mem'); r.previousElementSibling && r.parentNode.insertBefore(r, r.previousElementSibling); },
  rowDown: el => { const r = el.closest('.mem'); r.nextElementSibling && r.parentNode.insertBefore(r.nextElementSibling, r); },
  groupsSave: async el => { const sh = el.closest('.sheet'); const gs = $$('[data-gid]', sh).map(r => ({ id: r.dataset.gid, name: $('.g-name', r).value.trim(), min: parseNum($('.g-min', r).value), max: parseNum($('.g-max', r).value) })).filter(g => g.name);
    if (await patchProg(el.dataset.k === 'gift' ? { giftGroups: gs } : { ageGroups: gs })) closeSheet(); },
  rates: () => openRates(),
  rateAdd: el => { const sh = el.closest('.sheet'); $('#rows', sh).insertAdjacentHTML('beforeend', rateRow({ id: DB.rid(), name:'', amount:null, side:'any', cat:'', min:null, max:null }, prog().categories || [])); $$('#rows .r-name', sh).pop().focus(); },
  ratesSave: async el => { const sh = el.closest('.sheet'); const rs = $$('[data-rid]', sh).map(r => ({ id: r.dataset.rid, name: $('.r-name', r).value.trim(), amount: parseNum($('.r-amt', r).value) || 0, side: $('.r-side', r).value, cat: $('.r-cat', r).value, min: parseNum($('.r-min', r).value), max: parseNum($('.r-max', r).value) })).filter(r => r.name);
    if (await patchProg({ rates: rs })) closeSheet(); },
  cats: () => openCats(),
  depts: () => openDepts(),
  tsFilter: el => { S.tsOnly = el.dataset.v === '1'; render(); },
  tsShare: () => openShare(tsText(), t('tshirt')),
  tsSetup: () => openTsSetup(),
  tsSizeAdd: el => { const sh = el.closest('.sheet'); $('#rows', sh).insertAdjacentHTML('beforeend', sizeRow('')); $$('#rows .s-name', sh).pop().focus(); },
  tsExtra: el => { const s = el.dataset.s, d = Number(el.dataset.d) || 0, ex = Object.assign({}, tsOf(prog()).extra); const n = Math.max(0, (Number(ex[s]) || 0) + d); if (n) ex[s] = n; else delete ex[s]; return tsSave({ extra: ex }); },
  tsAddExp: el => openExpense(null, el.dataset.bud || ''),
  tsToBudget: async () => { const p = prog(), T = tsOf(p), q = tsStats(); if (!isAdmin()) return;
    const line = T.bud && S.bud.find(b => b.id === T.bud), id = line ? line.id : DB.rid();
    const bdoc = line ? Object.assign(strip(line), { amount: q.cost }) : { name: t('tshirt'), parent: '', amount: q.cost, note: '', order: Date.now(), at: Date.now(), by: myName() };
    const pdoc = Object.assign(strip(p), { tshirt: Object.assign(tsFull(p), { bud: id }), updatedAt: Date.now() });
    await commit(line ? 'editBudget' : 'addBudget', [{ path: budPath(), id, data: bdoc }, { path: 'programs', id: p.id, data: pdoc }]); },
  tsSetupSave: async el => {
    const sh = el.closest('.sheet'), p = prog(), T = tsOf(p);
    const rows = $$('[data-old]', sh).map(r => ({ old: r.dataset.old, nw: $('.s-name', r).value.trim() })).filter(r => r.nw);
    const names = rows.map(r => r.nw);
    if (new Set(names.map(x => x.toLowerCase())).size !== names.length) { toast(t('tsDup')); return; }
    const map = Object.create(null); rows.forEach(r => { if (r.old) map[r.old] = r.nw; });
    const removed = T.sizes.filter(z => !(z in map));
    const ops = []; let cleared = 0;
    S.fam.forEach(f => { let ch = false;
      const ms = (f.members || []).map(m => { if (!m.ts || m.ts === '-') return m; let nt = m.ts; if (m.ts in map) nt = map[m.ts]; else if (removed.includes(m.ts)) nt = ''; if (nt === m.ts) return m; ch = true; if (!nt) cleared++; return Object.assign({}, m, { ts: nt }); });
      if (ch) ops.push({ path: famPath(), id: f.id, data: Object.assign(strip(f), { members: ms }) }); });
    const extra = {}; Object.keys(T.extra).forEach(k => { if (k in map) extra[map[k]] = (extra[map[k]] || 0) + (Number(T.extra[k]) || 0); });
    const ma = parseNum($('#tsMinAge', sh).value);
    const patch = { tshirt: { sizes: names, price: parseNum($('#tsPrice', sh).value) || 0, minAge: ma == null ? '' : ma, extra, bud: T.bud || '' } };
    if (Array.isArray(p.dash)) patch.dash = p.dash.map(c => (c.type === 'stat' && c.cfg && Array.isArray(c.cfg.items)) ? Object.assign({}, c, { cfg: Object.assign({}, c.cfg, { items: c.cfg.items.map(k => { const m = /^ts:(.*)$/.exec(k); return (m && (m[1] in map)) ? 'ts:' + map[m[1]] : k; }) }) }) : c);
    ops.unshift({ path: 'programs', id: p.id, data: Object.assign(strip(p), patch, { updatedAt: Date.now() }) });
    const go = async () => { if (await commit('editProgram', ops)) closeSheet(); };
    if (cleared) confirmBox(t('tsDelSure', cleared), go, t('yesRemove')); else go();
  },
  deptAdd: el => { const sh = el.closest('.sheet'); $('#rows', sh).insertAdjacentHTML('beforeend', deptRow('')); $$('#rows .d-name', sh).pop().focus(); },
  deptsSave: async el => {
    const sh = el.closest('.sheet'), p = prog();
    const rows = $$('[data-old]', sh).map(r => ({ old: r.dataset.old, nw: $('.d-name', r).value.trim() })).filter(r => r.nw);
    const names = rows.map(r => r.nw);
    if (new Set(names.map(x => x.toLowerCase())).size !== names.length) { toast(t('deptDup')); return; }
    const map = Object.create(null); rows.forEach(r => { if (r.old) map[r.old] = r.nw; });
    const removed = deptsOf(p).filter(d => !(d in map));
    const ops = []; let cleared = 0;
    S.fam.forEach(f => { if (f.side === 'out' || !f.dept) return; let nd = f.dept;
      if (f.dept in map) nd = map[f.dept]; else if (removed.includes(f.dept)) nd = '';
      if (nd !== f.dept) { if (!nd) cleared++; ops.push({ path: famPath(), id: f.id, data: Object.assign(strip(f), { dept: nd }) }); } });
    const patch = { depts: names };
    if (Array.isArray(p.dash)) patch.dash = p.dash.map(c => (c.type === 'stat' && c.cfg && Array.isArray(c.cfg.items)) ? Object.assign({}, c, { cfg: Object.assign({}, c.cfg, { items: c.cfg.items.map(k => { const m = /^(dp?):(.*)$/.exec(k); return (m && (m[2] in map)) ? m[1] + ':' + map[m[2]] : k; }) }) }) : c);
    ops.unshift({ path: 'programs', id: p.id, data: Object.assign(strip(p), patch, { updatedAt: Date.now() }) });
    const go = async () => { if (await commit('editDepts', ops)) closeSheet(); };
    if (cleared) confirmBox(t('delDeptSure', cleared), go, t('yesRemove')); else go();
  },
  dashMode: () => { S.dashEdit = !S.dashEdit; render(); },
  dashUp: el => dashSet(d => { const i = d.findIndex(x => x.id === el.dataset.did); if (i > 0) { const x = d[i]; d[i] = d[i - 1]; d[i - 1] = x; } }),
  dashDown: el => dashSet(d => { const i = d.findIndex(x => x.id === el.dataset.did); if (i >= 0 && i < d.length - 1) { const x = d[i]; d[i] = d[i + 1]; d[i + 1] = x; } }),
  dashSize: el => dashSet(d => { const c = d.find(x => x.id === el.dataset.did); if (c) c.size = c.size === 'half' ? 'full' : 'half'; }),
  dashEditCard: el => openDashCard(el.dataset.did),
  dashDel: el => { const c = dashOf(prog()).find(x => x.id === el.dataset.did); if (!c) return; const id = c.id;
    confirmBox(t('delCardSure', dashTitle(c)), () => dashSet(d => { const i = d.findIndex(x => x.id === id); if (i >= 0) d.splice(i, 1); }), t('removeCard')); },
  dashAdd: () => openDashAdd(),
  dashAddType: async el => { const type = el.dataset.type, id = type === 'stat' ? DB.rid() : type;
    if (await dashSet(d => { if (!d.some(x => x.id === id)) d.push({ id, type, size: 'full', title: '', cfg: type === 'stat' ? { items: [] } : {} }); })) { closeSheet(); if (type === 'stat') setTimeout(() => openDashCard(id), 120); } },
  dashReset: () => confirmBox(t('resetDashSure'), async () => { if (await patchProg({ dash: dashDefault() })) closeSheet(); }, t('resetYes')),
  dashSave: async el => { const sh = el.closest('.sheet'), id = el.dataset.did;
    const d = JSON.parse(JSON.stringify(dashOf(prog()))); const c = d.find(x => x.id === id); if (!c) { closeSheet(); return; }
    c.title = $('#dcTitle', sh).value.trim(); const on = $('#dcSize .on', sh); c.size = on && on.dataset.v === 'half' ? 'half' : 'full'; c.cfg = c.cfg || {};
    const extra = {};
    if (c.type === 'chanda') c.cfg.byDept = $('#dcDept', sh).checked;
    if (c.type === 'seats') extra.seatAge = parseNum($('#dcSeatAge', sh).value);
    if (c.type === 'stat') c.cfg.items = $$('[data-mk]', sh).filter(x => x.checked).map(x => x.dataset.mk);
    if (await patchProg(Object.assign({ dash: d }, extra))) closeSheet(); },
  syncInfo: () => openDiag(),
  diagOpen: () => { closeAll(); openDiag(); },
  diagRun: async el => { const sh = el.closest('.sheet'), out = $('#diagOut', sh); if (!prog()) return; el.disabled = true; out.innerHTML = `<p class="muted" style="margin:0">${esc(t('diagRunning'))}</p>`;
    const targets = [[t('t_people'), famPath()], [t('payments'), payPath()], [t('expenses'), expPath()], [t('t_notes'), notePath()]]; const rows = [];
    for (const [n, path] of targets) rows.push([n, await DB.probe(path, '__probe__')]);
    out.innerHTML = `<div class="card flat" style="padding-block:4px"><div class="list">${rows.map(([n, r]) => `<div class="item"><div class="body"><div class="title">${esc(n)}</div>${r.ok ? '' : `<div class="small" style="color:var(--bad)">${esc(r.code)} — ${esc(diagWhy(r.code))}</div>`}</div><span class="pill ${r.ok ? 'ok' : 'bad'}">${r.ok ? '✓' : '✗'}</span></div>`).join('')}</div></div>`;
    el.disabled = false; },
  catsSave: async el => { const v = $('#catsTxt', el.closest('.sheet')).value.split('\n').map(x => x.trim()).filter(Boolean); if (await patchProg({ categories: Array.from(new Set(v)) })) closeSheet(); },
  pmode: el => { S.peopleMode = el.dataset.m; render(); },
  pside: el => { S.side = el.dataset.s; render(); },
  famNew: () => openFamily(null),
  famOpen: el => openFamily(el.dataset.id),
  fside: el => { $$('[data-a="fside"]', el.parentNode).forEach(b => b.classList.toggle('on', b === el)); const dw = $('#fDeptWrap', el.closest('.sheet')); if (dw) dw.hidden = el.dataset.s === 'out'; updateAutoLabels(el.closest('.sheet')); },
  memAdd: el => { const sh = el.closest('.sheet'); const list = $('#memList', sh); list.insertAdjacentHTML('beforeend', memberRow({ id: DB.rid(), name:'', rel:'', g:'', age:null, rate:'' }, prog(), list.children.length)); $$('.m-name', list).pop().focus(); updateAutoLabels(sh); },
  memDel: el => { const sh = el.closest('.sheet'); el.closest('.mem').remove(); updateAutoLabels(sh); },
  famSave: el => saveFamily(el.dataset.id, el.closest('.sheet')),
  famDel: el => { const id = el.dataset.id, f = S.fam.find(x => x.id === id); confirmBox(famName(f), async () => {
      const ops = [{ path: famPath(), id, data:null }].concat(S.pay.filter(x => x.fid === id).map(x => ({ path: payPath(), id: x.id, data:null })));
      if (await commit('delFamily', ops, t('deleted'))) closeAll(); }); },
  cf: el => { S.cf = el.dataset.f; render(); },
  chandaOpen: el => openChanda(el.dataset.id),
  paySave: async el => { if (await savePayment(el.dataset.fid, el.closest('.sheet'))) setTimeout(refreshTop, 60); },
  payEdit: el => openPayEdit(el.dataset.id),
  payUpdate: async el => { const x = S.pay.find(p => p.id === el.dataset.id); if (x && await savePayment(x.fid, el.closest('.sheet'), x.id)) { closeSheet(); setTimeout(refreshTop, 60); } },
  payDel: el => { const id = el.dataset.id; confirmBox(tk((S.pay.find(x => x.id === id) || {}).amount), async () => { if (await commit('delPayment', [{ path: payPath(), id, data:null }], t('deleted'))) { closeSheet(); setTimeout(refreshTop, 60); } }); },
  noteNew: () => openNote(null),
  noteOpen: el => openNote(el.dataset.id),
  noteSave: async el => { const sh = el.closest('.sheet'), id = el.dataset.id; const prev = id ? S.notes.find(n => n.id === id) : null;
    const doc = { title: $('#nTitle', sh).value.trim(), body: $('#nBody', sh).value, pin: $('#nPin', sh).checked, at: prev ? prev.at || Date.now() : Date.now(), upd: Date.now(), by: myName() };
    if (!doc.title && !doc.body.trim()) { toast(t('noteText')); return; }
    if (await commit(id ? 'editNote' : 'addNote', [{ path: notePath(), id: id || DB.rid(), data: doc }])) closeSheet(); },
  noteDel: el => { const id = el.dataset.id; confirmBox((S.notes.find(n => n.id === id) || {}).title || t('note'), async () => { if (await commit('delNote', [{ path: notePath(), id, data:null }], t('deleted'))) closeAll(); }); },
  confirmYes: async () => { const o = sheets[sheets.length - 1]; const fn = o && o.onYes; closeSheet(); fn && await fn(); },
  appearance: () => openAppearance(),
  setTheme: el => { P.theme = el.dataset.v; savePrefs(); applyPrefs(); refreshTop(); render(); },
  setFontBn: el => { P.fontBn = el.dataset.v; savePrefs(); applyPrefs(); refreshTop(); },
  setFontEn: el => { P.fontEn = el.dataset.v; savePrefs(); applyPrefs(); refreshTop(); },
  setBold: el => { P.bold = el.dataset.v === '1'; savePrefs(); applyPrefs(); refreshTop(); },
  setSize: el => { P.size = el.dataset.v; savePrefs(); applyPrefs(); refreshTop(); },
  usersOpen: () => openUsers(),
  userNew: () => openUserForm(null),
  userEdit: el => openUserForm(el.dataset.id),
  userSave: async el => { await saveUser(el.dataset.id, el.closest('.sheet')); setTimeout(() => { const top = sheets[sheets.length - 1]; if (top && top.kind === 'users') refreshTop(); }, 80); },
  historyOpen: () => openHistory(),
  shareSummary: () => openShare(summaryText(), t('shareSummary')),
  shareNames: () => openShare(namesText(), t('nameList')),
  nativeShare: async () => { const o = sheets[sheets.length - 1]; try { await navigator.share({ text: o.text }); } catch(e) { A.copyShare(); } },
  copyShare: async () => { const o = sheets[sheets.length - 1]; const ta = $('#shareTxt', o.el); try { await navigator.clipboard.writeText(o.text); toast(t('copied')); } catch(e) { ta.focus(); ta.select(); try { document.execCommand('copy'); toast(t('copied')); } catch(er) {} } },
  calcOpen: el => openCalc($('input', el.closest('.in-calc'))),
  calcInsert: () => { const o = sheets[sheets.length - 1]; o && o.insert && o.insert(); },
  incMode: el => { S.incMode = el.dataset.m; render(); },
  spendMode: el => { S.spendMode = el.dataset.m; render(); },
  spNew: () => openSponsor(null),
  spOpen: el => openSponsor(el.dataset.id),
  spSave: el => saveSponsor(el.dataset.id, el.closest('.sheet')),
  spDel: el => { const id = el.dataset.id; confirmBox((S.sp.find(x => x.id === id) || {}).company || '', async () => { if (await commit('delSponsor', [{ path: spPath(), id, data:null }], t('deleted'))) closeAll(); }); },
  expNew: el => openExpense(null, el && el.dataset ? el.dataset.bud : ''),
  expOpen: el => openExpense(el.dataset.id),
  expSave: el => saveExpense(el.dataset.id, el.closest('.sheet')),
  expDel: el => { const id = el.dataset.id, x = S.exp.find(e => e.id === id) || {}; confirmBox(`${x.title || ''} ${tk(x.amount)}`, async () => { if (await commit('delExpense', [{ path: expPath(), id, data:null }], t('deleted'))) { closeSheet(); } }); },
  budNew: () => openBudForm(null),
  budOpen: el => openBudget(el.dataset.id),
  budEdit: el => openBudForm(el.dataset.id),
  budSave: el => saveBudget(el.dataset.id, el.closest('.sheet')),
  budDel: el => { const id = el.dataset.id, b = S.bud.find(x => x.id === id) || {}; confirmBox(`${b.name}: ${t('budDelSure')}`, async () => {
      const ops = [{ path: budPath(), id, data:null }]
        .concat(S.bud.filter(k => k.parent === id).map(k => ({ path: budPath(), id: k.id, data: Object.assign(strip(k), { parent:'' }) })))
        .concat(S.exp.filter(e => e.bud === id).map(e => ({ path: expPath(), id: e.id, data: Object.assign(strip(e), { bud:'' }) })));
      if (await commit('delBudget', ops, t('deleted'))) closeAll(); }); },
  noLineOpen: () => openNoLine(),
  trNew: () => openTransfer(null),
  trOpen: el => openTransfer(el.dataset.id),
  trSave: el => saveTransfer(el.dataset.id, el.closest('.sheet')),
  trDel: el => { const id = el.dataset.id; confirmBox(tk((S.st.find(x => x.id === id) || {}).amount), async () => { if (await commit('delTransfer', [{ path: stPath(), id, data:null }], t('deleted'))) closeAll(); }); },
  sugDone: el => commit('addTransfer', [{ path: stPath(), id: DB.rid(), data: { from: el.dataset.from, to: el.dataset.to, amount: Number(el.dataset.amt), date: today(), note:'', at: Date.now(), by: myName() } }]),
  giftNew: () => openGiftForm(null),
  giftOpen: el => openGift(el.dataset.id),
  giftEdit: el => openGiftForm(el.dataset.id),
  giftSave: el => saveGift(el.dataset.id, el.closest('.sheet')),
  giftDel: el => { const id = el.dataset.id; confirmBox((S.gifts.find(x => x.id === id) || {}).name || '', async () => { if (await commit('delGift', [{ path: giftPath(), id, data:null }], t('deleted'))) closeAll(); }); },
  giveToggle: el => { const g = S.gifts.find(x => x.id === el.dataset.g); if (!g) return; const given = Object.assign({}, g.given || {}); if (given[el.dataset.m]) delete given[el.dataset.m]; else given[el.dataset.m] = true; el.classList.toggle('on'); commit('giveGift', [{ path: giftPath(), id: g.id, data: Object.assign(strip(g), { given }) }], '', true); },
  shareGift: el => { const g = S.gifts.find(x => x.id === el.dataset.id); if (g) openShare(giftText(g), g.name); },
  exportOpen: () => openExport(),
  backupOpen: () => openBackup(),
  bkDown: () => backupDownload(),
  bkPick: () => { const i = $('#bkFile'); i && i.click(); },
  bkLocal: () => { const m = (lcRead()[S.pid] || {}).best; if (m) askRestore({ programs: [{ id: m.id, doc: m.doc, sub: m.sub }] }); },
  busAssign: el => { if (can('members')) openBusAssign(el.dataset.id); },
  busSet: el => setBus(el.dataset.id, el.dataset.v),
  busDraw: () => { const n = busGroups().none.length; if (!n) { toast(t('busNothing')); return; } confirmBox(t('busDrawAsk', nf(n)), () => drawBuses(), t('busDraw')); },
  busClear: () => confirmBox(t('busClearAsk'), () => commit('editFamily', S.fam.filter(f => f.bus).map(f => ({ path: famPath(), id: f.id, data: Object.assign(strip(f), { bus: '', updatedAt: Date.now() }) })), t('saved')), t('busClear')),
  busShare: () => openShare(busText(), t('buses')),
  busSetup: () => openBusSetup(),
  busAdd: el => { const sh = el.closest('.sheet'); const n = $$('[data-bid]', sh).length + 1; $('#rows', sh).insertAdjacentHTML('beforeend', busRow({ id: DB.rid(), name: t('busN', nf(n)), cap: null })); },
  busSave: async el => { const sh = el.closest('.sheet'); const bs = $$('[data-bid]', sh).map(r => ({ id: r.dataset.bid, name: $('.b-name', r).value.trim(), cap: parseNum($('.b-cap', r).value) || null })).filter(b => b.name); if (await patchProg({ buses: bs, seatAge: parseNum($('#busSeatAge', sh).value) })) closeSheet(); },
  xlsxDown: () => exportExcel(false),
  xlsxShare: () => exportExcel(true),
  demoReset: () => confirmBox(t('resetDemoSure'), () => { DB.resetDemo(false, P.lang); S.undo = []; toast(t('saved')); }, t('resetDemo')),
  demoClear: () => confirmBox(t('resetDemoSure'), () => { DB.resetDemo(true, P.lang); S.undo = []; toast(t('saved')); }, t('clearDemo'))
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const fn = A[el.dataset.a]; if (!fn) return;
  if (el.tagName === 'A') return; // real links (WhatsApp) open normally
  e.preventDefault(); fn(el, e);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sheets.length) { closeSheet(); return; }
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-a]')) { e.preventDefault(); e.target.click(); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'pq') { S.q = e.target.value; const la = $('#listArea'); if (la) la.innerHTML = peopleList(); }
  if (e.target.id === 'cq') { S.cq = e.target.value; const la = $('#listArea'); if (la) la.innerHTML = chandaList(); }
  if (e.target.id === 'eq') { S.eq = e.target.value; const la = $('#listArea'); if (la) la.innerHTML = expList(); }
});
document.addEventListener('change', e => { if (e.target.dataset && e.target.dataset.tsm) { setShirt(e.target.dataset.tsm, e.target.value); return; } if (e.target.id === 'pcat') { S.cat = e.target.value; render(); } if (e.target.id === 'expBud') { S.expBud = e.target.value; render(); } });
function loginMsg(err){
  const c = (err && err.code) || '';
  if (/popup-closed-by-user|cancelled-popup-request|user-cancelled/.test(c)) return '';
  if (c === 'auth/unauthorized-domain') return t('e_domain');
  if (c === 'auth/operation-not-allowed') return t('e_notAllowed');
  if (c === 'auth/network-request-failed') return t('e_network');
  if (/api-key|invalid-app|app-not-authorized/.test(c)) return t('e_apiKey');
  if (c === 'auth/too-many-requests') return t('e_many');
  return t('e_other') + ' ' + (c || String(err && err.message || err));
}


/* ================= demo sample data ================= */
window.PM_SEED = function(mem, rid, empty, lang){
  const en = lang === 'en', L = (b, e) => en ? e : b;
  const c = mem.cols, now = Date.now(); mem.seedLang = en ? 'en' : 'bn'; mem.touched = false;
  const ADM = L('নমুনা অ্যাডমিন', 'Sample admin'), ORG = L('নমুনা আয়োজক', 'Sample organiser');
  c.users = {
    u_admin: { name: ADM, email: window.PM_ADMIN_EMAIL || 'admin@example.com', role:'admin', active:true, perms:{} },
    u_org: { name: ORG, email:'organizer@example.com', role:'organizer', active:true, perms:{ members:true, chanda:true, notes:true, expense:true, sponsor:true } }
  };
  if (empty) return;
  const pid = 'p_sample';
  const CONS = L('কনসালটেন্ট', 'Consultant'), DOC = L('ডাক্তার', 'Doctor'), SIS = L('সিস্টার', 'Sister'), STF = L('স্টাফ', 'Staff'), GST = L('অতিথি', 'Guest');
  const SELF = L('নিজে', 'Self'), WIFE = L('স্ত্রী', 'Wife'), HUS = L('স্বামী', 'Husband'), SON = L('ছেলে', 'Son'), DAU = L('মেয়ে', 'Daughter');
  const G = (n, a, b) => ({ id: rid(), name:n, min:a, max:b });
  const AG = [G(L('৩ বছরের নিচে', 'Under 3'), 0, 3), G(L('৫ বছরের নিচে', 'Under 5'), 0, 5), G(L('৫ থেকে ১২ বছর', '5 to 12'), 5, 12), G(L('১২ থেকে ১৮ বছর', '12 to 18'), 12, 18), G(L('প্রাপ্তবয়স্ক', 'Adults'), 18, null)];
  c.programs = { [pid]: { name: L('বার্ষিক পিকনিক ২০২৬ (নমুনা)', 'Annual Picnic 2026 (sample)'), type:'picnic', date:'2026-12-12', venue: L('নমুনা রিসোর্ট, গাজীপুর', 'Sample Resort, Gazipur'),
    note: L('এটি নমুনা প্রোগ্রাম। "আরও" থেকে মুছে নিজের প্রোগ্রাম বানান।', 'This is a sample program. Delete it from More and create your own.'), createdAt: now, createdBy: ADM,
    ageGroups: AG,
    rates:[{ id:rid(), name: L('৩ বছরের নিচে', 'Under 3'), amount:0, side:'any', cat:'', min:null, max:3 }, { id:rid(), name: CONS, amount:3000, side:'in', cat: CONS, min:18, max:null },
      { id:rid(), name: L('বাইরের অতিথি', 'Outside guest'), amount:1200, side:'out', cat:'', min:12, max:null }, { id:rid(), name: L('শিশু (৩ থেকে ১২)', 'Child (3 to 12)'), amount:500, side:'any', cat:'', min:3, max:12 },
      { id:rid(), name: L('প্রাপ্তবয়স্ক', 'Adult'), amount:1000, side:'any', cat:'', min:12, max:null }],
    tshirt: { sizes:['S','M','L','XL','XXL'], price:350, minAge:5, extra:{ L:2 }, bud:'' },
    categories:[CONS, DOC, SIS, STF, GST] } };
  let tsN = 0; const M = (name, rel, g, age) => ({ id: rid(), name, rel, g, age, rate:'', ts: age >= 12 ? ['M','L','XL','S','L','XXL'][(tsN++) % 6] : '' });
  const fams = [
    ['in', CONS, [M(L('ডা. নমুনা রহমান', 'Dr. Sample Rahman'), SELF, 'M', 52), M(L('নমুনা বেগম', 'Mrs. Rahman'), WIFE, 'F', 46), M(L('আরিয়ান', 'Ariyan'), SON, 'M', 14)]],
    ['in', DOC, [M(L('ডা. সাদিয়া (নমুনা)', 'Dr. Sadia (sample)'), SELF, 'F', 34), M(L('তানভীর', 'Tanvir'), HUS, 'M', 37), M(L('আয়রা', 'Ayra'), DAU, 'F', 6), M(L('রাইয়ান', 'Rayan'), SON, 'M', 2)]],
    ['in', DOC, [M(L('ডা. ফাহিম (নমুনা)', 'Dr. Fahim (sample)'), SELF, 'M', 31)]],
    ['in', SIS, [M(L('সিস্টার রুমানা (নমুনা)', 'Sister Rumana (sample)'), SELF, 'F', 29), M(L('জুবায়ের', 'Zubayer'), HUS, 'M', 33), M(L('নুসাইবা', 'Nusaiba'), DAU, 'F', 4)]],
    ['in', SIS, [M(L('সিস্টার মিতু (নমুনা)', 'Sister Mitu (sample)'), SELF, 'F', 26)]],
    ['in', STF, [M(L('কামাল (নমুনা)', 'Kamal (sample)'), SELF, 'M', 40), M(L('শাহনাজ', 'Shahnaz'), WIFE, 'F', 35), M(L('সিয়াম', 'Siam'), SON, 'M', 10), M(L('সারা', 'Sara'), DAU, 'F', 16)]],
    ['out', GST, [M(L('জনাব হাসান (নমুনা অতিথি)', 'Mr. Hasan (sample guest)'), SELF, 'M', 58), M(L('মিসেস হাসান', 'Mrs. Hasan'), WIFE, 'F', 54), M(L('ইফতি', 'Ifti'), SON, 'M', 8)]]
  ];
  const fp = `programs/${pid}/families`; c[fp] = {}; const ids = [];
  fams.forEach(([side, cat, members], i) => { const id = 'f' + i; ids.push(id); c[fp][id] = { side, cat, dept: side === 'out' ? '' : ['MICU','SICU','HDU'][i % 3], phone:'', due:null, note: i === 0 ? L('দুপুরে নিরামিষ খাবার লাগবে (নমুনা নোট)', 'Needs a vegetarian lunch (sample note)') : '', members, createdAt: now + i, updatedAt: now + i, by: ADM }; });
  const pay = (fi, amount, date, method, recv) => ({ fid: ids[fi], amount, date, method, recv, note:'', at: now, by: ADM });
  c[`programs/${pid}/payments`] = { a1: pay(0, 5000, '2026-11-01', 'bkash', ADM), a2: pay(1, 2000, '2026-10-30', 'cash', ADM), a3: pay(2, 1000, '2026-10-29', 'cash', ORG), a4: pay(3, 1000, '2026-11-02', 'nagad', ADM), a5: pay(5, 3000, '2026-10-28', 'cash', ORG) };
  c[`programs/${pid}/notes`] = {
    n1: { title: L('বাস ঠিক করা', 'Book the buses'), body: L('দুটি বাস লাগবে। সকাল ৭টায় হাসপাতালের সামনে থেকে ছাড়বে।\nকোম্পানির সঙ্গে কথা বলতে হবে।', 'Two buses needed. Leaving from the hospital gate at 7 am.\nTalk to the sponsor company.'), pin:true, at: now, upd: now, by: ADM },
    n2: { title: L('জিলাপিওয়ালা', 'Jalebi maker'), body: L('দুপুর ৩টার মধ্যে পৌঁছাবেন। আলাদা করে টাকা দিতে হবে।', 'Arrives by 3 pm. Pay him separately.'), pin:false, at: now - 1000, upd: now - 1000, by: ORG }
  };
  const B = (id, name, parent, amount, o) => [id, { name, parent, amount, note:'', order: o, at: now + o, by: ADM }];
  c[`programs/${pid}/budgets`] = Object.fromEntries([
    B('b_bus', L('যাতায়াত (বাস)', 'Transport (bus)'), '', 25000, 1), B('b_venue', L('ভেন্যু', 'Venue'), '', 30000, 2),
    B('b_food', L('খাবার', 'Food'), '', null, 3), B('b_bf', L('সকালের নাস্তা', 'Breakfast'), 'b_food', 8000, 4), B('b_lunch', L('দুপুরের খাবার', 'Lunch'), 'b_food', 30000, 5),
    B('b_snack', L('সন্ধ্যার নাস্তা', 'Evening snacks'), 'b_food', 5000, 6), B('b_dinner', L('রাতের খাবার', 'Dinner'), 'b_food', 15000, 7),
    B('b_gift', L('উপহার', 'Gifts'), '', null, 8), B('b_gk', L('শিশুদের উপহার', 'Children\'s gifts'), 'b_gift', 6000, 9), B('b_gm', L('ছেলেদের উপহার', 'Gifts for men'), 'b_gift', 5000, 10),
    B('b_gf', L('মেয়েদের উপহার', 'Gifts for women'), 'b_gift', 5000, 11), B('b_gc', L('কনসালটেন্ট ও তাঁদের স্ত্রী', 'Consultants and spouses'), 'b_gift', 4000, 12),
    B('b_tips', L('টিপস ও বকশিশ', 'Tips'), '', 2000, 13), B('b_other', L('অন্যান্য', 'Other'), '', 3000, 14)]);
  const X = (title, amount, date, bud, paidBy, method, payee) => ({ title, amount, date, bud, paidBy, method, payee, note:'', at: now, by: paidBy });
  c[`programs/${pid}/expenses`] = {
    x1: X(L('বাস ভাড়ার অগ্রিম', 'Bus fare advance'), 10000, '2026-11-01', 'b_bus', ADM, 'card', L('নমুনা পরিবহন', 'Sample Transport')),
    x2: X(L('ভেন্যুর অগ্রিম', 'Venue advance'), 15000, '2026-10-31', 'b_venue', ORG, 'cash', L('নমুনা রিসোর্ট', 'Sample Resort')),
    x3: X(L('জিলাপি', 'Jalebi'), 3500, '2026-11-02', 'b_snack', ADM, 'cash', L('জিলাপিওয়ালা', 'Jalebi maker')),
    x4: X(L('শিশুদের খেলনা', 'Toys for children'), 4200, '2026-11-02', 'b_gk', ORG, 'bkash', '')
  };
  c[`programs/${pid}/sponsors`] = {
    s1: { company: L('নমুনা ফার্মা লিমিটেড', 'Sample Pharma Ltd'), contact:'', kind:'cash', status:'received', amount:20000, items:'', value:0, recv: ADM, date:'2026-10-30', note:'', at: now, by: ADM },
    s2: { company: L('নমুনা হেলথকেয়ার', 'Sample Healthcare'), contact:'', kind:'kind', status:'promised', amount:0, items: L('দুটি বাস', 'Two buses'), value:25000, recv:'', date:'', note:'', at: now + 1, by: ADM },
    s3: { company: L('নমুনা ল্যাবস', 'Sample Labs'), contact:'', kind:'cash', status:'promised', amount:10000, items:'', value:0, recv:'', date:'', note:'', at: now + 2, by: ADM }
  };
  const GF = (o, name, group, gender, cat, price, bud, bought, given) => ({ name, group, gender, side:'any', cat, need:null, bought, price, bud, note:'', given: given || {}, order: o, at: now + o, by: ADM });
  const mid = (fi, mi) => fams[fi][2][mi].id;
  c[`programs/${pid}/gifts`] = {
    g1: GF(1, L('৫ বছরের নিচের শিশুদের খেলনা', 'Toys for under-5s'), AG[1].id, 'any', '', 300, 'b_gk', 3, { [mid(1, 3)]: true }),
    g2: GF(2, L('৫ থেকে ১২ বছরের শিশুদের উপহার', 'Gifts for ages 5 to 12'), AG[2].id, 'any', '', 350, 'b_gk', 2, {}),
    g3: GF(3, L('ছেলেদের উপহার', 'Gifts for men'), AG[4].id, 'M', '', 400, 'b_gm', 0, {}),
    g4: GF(4, L('মেয়েদের উপহার', 'Gifts for women'), AG[4].id, 'F', '', 400, 'b_gf', 0, {}),
    g5: GF(5, L('কনসালটেন্ট ও তাঁদের স্ত্রী', 'Consultants and spouses'), AG[4].id, 'any', CONS, 1500, 'b_gc', 0, {})
  };
};

/* ================= start ================= */
applyPrefs(); render();
if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.PM_NO_SW) { navigator.serviceWorker.register('sw.js').catch(() => {}); }
window.PM_TEST = { tsOf, tsStats, tsState, dashOf, dashDefault, metricCatalog, deptStats, seatStats, famSeats, busGroups, drawBuses, busText, collectBackup, restoreBackup, giftGroupsOf, lcSave, evalExpr, autoRate, rateFor, famDue, inRange, parseNum, stats, S, buildWorkbook, giftInfo, ledger };
})();
