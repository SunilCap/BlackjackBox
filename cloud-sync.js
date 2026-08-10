/**
 * 21 Table — Blackjack  /  Cloud Sync (client side)
 *
 * Talks to the Firebase backend in functions/index.js. Drop this in as its
 * own <script type="module"> AFTER the Firebase SDK, BEFORE game.js, and
 * game.js can call window.CloudSync.* instead of using a purely local
 * `bankroll` variable.
 *
 * SETUP: replace firebaseConfig below with your real project config
 * (Firebase console > Project settings > General > Your apps > SDK config —
 * this object is NOT secret, it's fine to have it in client code).
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  GoogleAuthProvider, linkWithPopup, signInWithPopup, signInWithCredential,
  EmailAuthProvider, linkWithCredential, signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzXNwrzyLVcZK2DT6FKseZhOlmRIXIcXU",
  authDomain: "blackjack-box-21.firebaseapp.com",
  projectId: "blackjack-box-21",
  storageBucket: "blackjack-box-21.firebasestorage.app",
  messagingSenderId: "990610106334",
  appId: "1:990610106334:web:a11eeb3d7693f6a870df4f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

let currentUid = null;
let latestUserDoc = { bankroll: 1000, removeAds: false, vipUntil: 0, unlockedTables: [] };
let onUpdateCallback = null;

// Resolves once anonymous sign-in has actually completed. Buying/purchase
// calls MUST await this first — clicking Buy right after page load, before
// sign-in finishes, was causing "Must be signed in" errors server-side even
// though the button was already clickable.
let resolveAuthReady;
const authReady = new Promise(resolve => { resolveAuthReady = resolve; });

/**
 * Call once at startup. Signs the player in anonymously (no signup friction —
 * this ties their save to this browser/device; upgrading to a real account
 * for cross-device sync is a later, optional step) and starts listening for
 * live bankroll/purchase updates.
 *
 * @param {(data: {bankroll:number, removeAds:boolean, vipUntil:number, unlockedTables:string[]}) => void} onUpdate
 *   called immediately with cached data, then again every time Firestore
 *   data changes (e.g. right after a purchase is granted server-side).
 */
function init(onUpdate) {
  onUpdateCallback = onUpdate;
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      await signInAnonymously(auth).catch(err => console.error("Sign-in failed", err));
      return;
    }
    currentUid = user.uid;
    resolveAuthReady(); // safe to call more than once — a Promise only ever resolves the first time

    // make sure a user doc exists (first run)
    try {
      await httpsCallable(functions, "ensureUserDoc")();
    } catch (err) {
      console.error("ensureUserDoc failed", err);
    }

    // live-sync: fires immediately, then on every change (e.g. after a purchase)
    onSnapshot(doc(db, "users", currentUid), (snap) => {
      if (snap.exists()) {
        latestUserDoc = snap.data();
        onUpdateCallback?.(latestUserDoc);
      }
    });
  });
}

/** Current cached state — safe to call synchronously anywhere in game.js. */
function getState() {
  return latestUserDoc;
}

/**
 * Kick off a real purchase.
 * @param {string} productId  one of the keys in PRODUCTS (functions/index.js)
 * @param {string} priceId    the matching Stripe Price ID (web only — ignored on Android)
 */
async function buyOnWeb(productId, priceId) {
  await authReady; // don't call the server until sign-in has actually finished
  const createCheckoutSession = httpsCallable(functions, "createCheckoutSession");
  const result = await createCheckoutSession({ productId, priceId });
  window.location.href = result.data.url; // redirect to Stripe Checkout
}

/**
 * Purchase flow for Android, running inside your TWA.
 * Uses the Digital Goods API + Payment Request API — both are plain web
 * APIs (Chrome 101+), no native Android code required. Only works when
 * the page is actually running inside the TWA install (not a normal
 * mobile browser tab) — check `isPlayBillingAvailable()` first.
 *
 * @param {string} productId  must match a Play Console in-app product ID
 * @param {boolean} isSubscription
 */
async function isPlayBillingAvailable() {
  if (!('getDigitalGoodsService' in window)) return false;
  try {
    // The function can exist on desktop Chrome/Edge but throws when actually
    // called outside a real TWA install — so we have to try it, not just
    // check for its presence.
    await window.getDigitalGoodsService('https://play.google.com/billing');
    return true;
  } catch (err) {
    return false;
  }
}

async function buyOnAndroid(productId, isSubscription = false) {
  await authReady;
  const service = await window.getDigitalGoodsService('https://play.google.com/billing');
  const details = (await service.getDetails([productId]))[0];
  if (!details) throw new Error(`Product ${productId} not found in Play Console catalog`);

  const request = new PaymentRequest(
    [{ supportedMethods: 'https://play.google.com/billing', data: { sku: productId } }],
    { total: { label: 'Total', amount: { currency: details.price.currency, value: details.price.value } } }
  );
  const paymentResponse = await request.show();
  const purchaseToken = paymentResponse.details.purchaseToken;
  await paymentResponse.complete('success');

  // server verifies the token is real before granting anything
  return verifyAndroidPurchase(productId, purchaseToken, 'com.yourcompany.blackjack', isSubscription);
}

/**
 * Called after buyOnAndroid()'s Play-side flow completes — verifies the
 * purchase token server-side (see verifyPlayPurchase in functions/index.js)
 * before granting anything.
 */
async function verifyAndroidPurchase(productId, purchaseToken, packageName, isSubscription) {
  const verifyPlayPurchase = httpsCallable(functions, "verifyPlayPurchase");
  return verifyPlayPurchase({ productId, purchaseToken, packageName, isSubscription });
}

/**
 * Claim today's daily bonus. The server independently re-validates the
 * streak (calendar day comparison, UTC) — this call can't be spoofed by
 * fiddling with client state, same trust model as purchases.
 * @returns {Promise<{alreadyClaimed:boolean, granted?:number, streak:number, bankroll:number}>}
 */
async function claimDailyBonus() {
  await authReady;
  const fn = httpsCallable(functions, "claimDailyBonus");
  const result = await fn();
  return result.data;
}

/**
 * Client-side ONLY eligibility check, for deciding whether to show the
 * popup/lobby button — purely cosmetic, the server re-checks for real when
 * claimDailyBonus() is actually called, so this being "wrong" for a moment
 * (e.g. stale cache right after midnight UTC) can't be exploited.
 */
function isDailyBonusAvailable() {
  const state = getState();
  if (!state.lastDailyBonusClaim) return true;
  const todayUTC = new Date().toISOString().slice(0, 10);
  const lastClaimUTC = new Date(state.lastDailyBonusClaim).toISOString().slice(0, 10);
  return todayUTC !== lastClaimUTC;
}

/** Which streak day claiming NOW would land on — for showing "Day 3" etc. before claiming. */
function nextDailyBonusDay() {
  const state = getState();
  if (!state.lastDailyBonusClaim) return 1;
  const now = Date.now();
  const todayUTC = new Date(now).toISOString().slice(0, 10);
  const yesterdayUTC = new Date(now - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const lastClaimUTC = new Date(state.lastDailyBonusClaim).toISOString().slice(0, 10);
  if (lastClaimUTC === todayUTC) return (state.dailyStreak || 0); // already claimed — this IS today's day
  if (lastClaimUTC === yesterdayUTC) return Math.min((state.dailyStreak || 0) + 1, 7);
  return 1;
}

/**
 * "Protect your purchases" — upgrades the current anonymous account to a
 * real Google-linked one, keeping all existing bankroll/purchases/streak.
 *
 * If this Google account was already used before (e.g. the player is on a
 * new device/browser and had previously linked there), Firebase can't
 * "link" it a second time — instead we sign into THAT existing account,
 * which means whatever this current anonymous session had gets replaced by
 * the older, already-linked account's data. That's the correct behavior
 * for "restore my account," just worth knowing it's not a merge.
 *
 * @returns {Promise<{restored:boolean, label:string}>}
 *   restored=true means we signed into a pre-existing account instead of
 *   linking this one — the UI should say "Welcome back" rather than
 *   "Account linked."
 */
async function linkWithGoogle() {
  await authReady;
  const provider = new GoogleAuthProvider();
  try {
    const result = await linkWithPopup(auth.currentUser, provider);
    return { restored: false, label: result.user.displayName || result.user.email || 'Google account' };
  } catch (err) {
    if (err.code === 'auth/credential-already-in-use') {
      const credential = GoogleAuthProvider.credentialFromError(err);
      const result = await signInWithCredential(auth, credential);
      return { restored: true, label: result.user.displayName || result.user.email || 'Google account' };
    }
    throw err;
  }
}

/**
 * Same idea as linkWithGoogle(), but with an email + password instead.
 * @returns {Promise<{restored:boolean, label:string}>}
 */
async function linkWithEmail(email, password) {
  await authReady;
  const credential = EmailAuthProvider.credential(email, password);
  try {
    const result = await linkWithCredential(auth.currentUser, credential);
    return { restored: false, label: result.user.email };
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      // an account with this email already exists — sign into it instead,
      // using the password they just typed (fails with auth/wrong-password
      // if it doesn't match, which the caller should show to the player)
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { restored: true, label: result.user.email };
    }
    throw err;
  }
}

/** Is the current session tied to a real account, or still just anonymous? */
function isAccountLinked() {
  return !!(auth.currentUser && auth.currentUser.providerData.length > 0);
}

/** Display label for the linked account (email or Google display name), or null if still anonymous. */
function getAccountLabel() {
  if (!isAccountLinked()) return null;
  const p = auth.currentUser.providerData[0];
  return p.displayName || p.email || 'Linked account';
}

window.CloudSync = {
  init, getState, buyOnWeb, buyOnAndroid, isPlayBillingAvailable,
  claimDailyBonus, isDailyBonusAvailable, nextDailyBonusDay,
  linkWithGoogle, linkWithEmail, isAccountLinked, getAccountLabel,
};
// game.js is a classic (non-module) script and runs BEFORE this module finishes loading,
// so it can't just check `if (window.CloudSync)` at the top level — it listens for this
// event instead, which fires once CloudSync is actually ready to use.
window.dispatchEvent(new Event('cloudsync-ready'));
