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
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyAahMujv2IjdBKdLFoYguXbCz_b3zBIzSE",
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

window.CloudSync = { init, getState, buyOnWeb, buyOnAndroid, isPlayBillingAvailable };
// game.js is a classic (non-module) script and runs BEFORE this module finishes loading,
// so it can't just check `if (window.CloudSync)` at the top level — it listens for this
// event instead, which fires once CloudSync is actually ready to use.
window.dispatchEvent(new Event('cloudsync-ready'));
