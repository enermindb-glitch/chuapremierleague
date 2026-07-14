/* ===========================================================
   CHUKA PREMIER LEAGUE — AUTH
   Wraps Firebase Authentication + Firestore for player accounts.
   Uses the Firebase CDN SDK. Until config.js has real Firebase
   keys, auth actions show a friendly "not configured yet" notice
   instead of failing silently.
=========================================================== */

let firebaseApp, firebaseAuth, firebaseDb;
let firebaseReady = false;

async function initFirebase() {
  if (!CPL_CONFIG.firebase.apiKey) return false;
  if (firebaseReady) return true;
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
    const authMod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js");
    const fsMod = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

    firebaseApp = initializeApp(CPL_CONFIG.firebase);
    firebaseAuth = authMod.getAuth(firebaseApp);
    firebaseDb = fsMod.getFirestore(firebaseApp);
    window.__fb = { authMod, fsMod }; // stash module refs for use elsewhere
    firebaseReady = true;
    return true;
  } catch (e) {
    console.error('Firebase init failed', e);
    return false;
  }
}

async function cplSignup(email, password, profile) {
  const ok = await initFirebase();
  if (!ok) return { error: 'not_configured' };
  const { createUserWithEmailAndPassword } = window.__fb.authMod;
  const { doc, setDoc } = window.__fb.fsMod;
  try {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await setDoc(doc(firebaseDb, 'players', cred.user.uid), {
      name: profile.name,
      team: profile.team,
      league: profile.league,
      position: profile.position,
      bio: '',
      photoUrl: '',
      cplNumber: '', // filled in later once payment is confirmed and Apps Script syncs it
      createdAt: new Date().toISOString(),
    });
    return { user: cred.user };
  } catch (e) {
    return { error: e.code || e.message };
  }
}

async function cplLogin(email, password) {
  const ok = await initFirebase();
  if (!ok) return { error: 'not_configured' };
  const { signInWithEmailAndPassword } = window.__fb.authMod;
  try {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return { user: cred.user };
  } catch (e) {
    return { error: e.code || e.message };
  }
}

async function cplLogout() {
  if (!firebaseReady) return;
  const { signOut } = window.__fb.authMod;
  await signOut(firebaseAuth);
}

async function getCurrentPlayerProfile() {
  const ok = await initFirebase();
  if (!ok || !firebaseAuth.currentUser) return null;
  const { doc, getDoc } = window.__fb.fsMod;
  const snap = await getDoc(doc(firebaseDb, 'players', firebaseAuth.currentUser.uid));
  return snap.exists() ? { id: firebaseAuth.currentUser.uid, ...snap.data() } : null;
}

async function updatePlayerProfile(fields) {
  const ok = await initFirebase();
  if (!ok || !firebaseAuth.currentUser) return { error: 'not_logged_in' };
  const { doc, updateDoc } = window.__fb.fsMod;
  await updateDoc(doc(firebaseDb, 'players', firebaseAuth.currentUser.uid), fields);
  return { ok: true };
}
