// Data layer: Firebase (Auth + Firestore) when configured, otherwise a local demo store.
window.PMDB = (function(){
  const cfg = window.PM_FIREBASE || {};
  const useFirebase = !!(cfg.apiKey && cfg.projectId);
  const rid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  /* ---------------- local demo store ---------------- */
  const KEY = 'pm-demo-v1';
  let mem = null, watchers = {}, authCb = null, localUser = null;
  function loadMem(){
    if (mem) return;
    try { mem = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch(e) { mem = null; }
    if (!mem) { mem = { cols:{} }; window.PM_SEED && window.PM_SEED(mem, rid, false, prefLang()); persist(); }
  }
  function prefLang(){ try { return JSON.parse(localStorage.getItem('pm-prefs') || '{}').lang || 'bn'; } catch(e) { return 'bn'; } }
  function persist(){ try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch(e) {} }
  function colArr(path){ const c = mem.cols[path] || {}; return Object.keys(c).map(id => Object.assign({ id }, c[id])); }
  function emit(path){ (watchers[path] || []).forEach(cb => cb(colArr(path))); }
  const local = {
    mode: 'demo',
    onAuth(cb){ authCb = cb; let u = null; try { u = JSON.parse(sessionStorage.getItem('pm-demo-user') || 'null'); } catch(e) {} localUser = u; setTimeout(() => cb(u), 0); },
    async demoSignIn(role){
      loadMem();
      const users = colArr('users');
      const u = users.find(x => x.role === role) || users[0];
      localUser = { uid: u.id, email: u.email };
      try { sessionStorage.setItem('pm-demo-user', JSON.stringify(localUser)); } catch(e) {}
      authCb && authCb(localUser);
    },
    async signIn(){ throw new Error('demo'); },
    async signOut(){ localUser = null; try { sessionStorage.removeItem('pm-demo-user'); } catch(e) {} authCb && authCb(null); },
    async createUser(email, password, data){
      loadMem();
      if (colArr('users').some(u => (u.email || '').toLowerCase() === email.toLowerCase())) { const e = new Error('exists'); e.code = 'auth/email-already-in-use'; throw e; }
      const id = rid(); (mem.cols.users = mem.cols.users || {})[id] = Object.assign({ email }, data); persist(); emit('users'); return id;
    },
    watch(path, cb){ loadMem(); (watchers[path] = watchers[path] || []).push(cb); setTimeout(() => cb(colArr(path)), 0); return () => { watchers[path] = (watchers[path] || []).filter(f => f !== cb); }; },
    async getAll(path){ loadMem(); return colArr(path); },
    isPristine(){ loadMem(); return !mem.touched; },
    seedLang(){ loadMem(); return mem.seedLang || 'bn'; },
    async set(path, id, data){ loadMem(); mem.touched = true; (mem.cols[path] = mem.cols[path] || {})[id] = JSON.parse(JSON.stringify(data)); persist(); emit(path); },
    async remove(path, id){ loadMem(); mem.touched = true; if (mem.cols[path]) delete mem.cols[path][id]; persist(); emit(path); },
    resetDemo(empty, lang){ mem = { cols:{} }; window.PM_SEED && window.PM_SEED(mem, rid, !!empty, lang || prefLang()); persist(); Object.keys(watchers).forEach(emit); },
    rid
  };

  if (!useFirebase) return local;

  /* ---------------- Firebase ---------------- */
  let app, auth, fs, ready;
  const V = '10.12.2';
  function load(src){ return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  ready = (async () => {
    const base = `https://www.gstatic.com/firebasejs/${V}/`;
    await load(base + 'firebase-app-compat.js');
    await Promise.all([load(base + 'firebase-auth-compat.js'), load(base + 'firebase-firestore-compat.js')]);
    app = firebase.initializeApp(cfg);
    auth = firebase.auth();
    fs = firebase.firestore();
    try { await fs.enablePersistence({ synchronizeTabs: true }); } catch(e) {}
  })();
  const clean = d => JSON.parse(JSON.stringify(d, (k, v) => v === undefined ? null : v));
  return {
    mode: 'firebase',
    async onAuth(cb){ await ready; auth.onAuthStateChanged(u => cb(u ? { uid: u.uid, email: u.email } : null)); },
    async signIn(email, pass){ await ready; await auth.signInWithEmailAndPassword(email, pass); },
    async signOut(){ await ready; await auth.signOut(); },
    async createUser(email, password, data){
      await ready;
      // A second app instance creates the account without signing the admin out.
      const sec = firebase.apps.find(a => a.name === 'secondary') || firebase.initializeApp(cfg, 'secondary');
      const cred = await sec.auth().createUserWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      await sec.auth().signOut();
      await fs.collection('users').doc(uid).set(clean(Object.assign({ email }, data)));
      return uid;
    },
    watch(path, cb){
      let unsub = null, dead = false;
      ready.then(() => { if (dead) return; unsub = fs.collection(path).onSnapshot(s => cb(s.docs.map(d => Object.assign({ id: d.id }, d.data()))), err => console.warn(path, err)); });
      return () => { dead = true; unsub && unsub(); };
    },
    async getAll(path){ await ready; const q = await fs.collection(path).get(); return q.docs.map(d => Object.assign({ id: d.id }, d.data())); },
    async set(path, id, data){ await ready; await fs.collection(path).doc(id).set(clean(data)); },
    async remove(path, id){ await ready; await fs.collection(path).doc(id).delete(); },
    rid
  };
})();
