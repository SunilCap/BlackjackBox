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
  GoogleAuthProvider, linkWithPopup, signInWithCredential,
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

/**
 * Single-active-session enforcement: "you're logged in on another device."
 *
 * deviceId is persisted in localStorage so it's stable across reloads/tabs
 * on the SAME browser (two tabs on one laptop won't kick each other) but
 * unique per actual device/browser. On sign-in this device "claims" the
 * session server-side; if another device claims it afterward, THIS
 * device's own live Firestore listener sees the mismatch and fires
 * 'session-superseded' — game.js listens for that and freezes play.
 */
const DEVICE_ID_KEY = 'bjbox:deviceId';
function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch (e) {
    // storage unavailable — fall back to a per-load id (session enforcement
    // just won't survive a reload on this browser, acceptable degradation)
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
const deviceId = getDeviceId();
let sessionClaimed = false; // true once OUR OWN claim has round-tripped — see onSnapshot below

const CLOUD_CACHE_KEY = 'bjbox:lastKnownState'; // must match the key game.js reads on load
function cacheStateLocally(state) {
  try {
    localStorage.setItem(CLOUD_CACHE_KEY, JSON.stringify({
      bankroll: state.bankroll, removeAds: state.removeAds, vipUntil: state.vipUntil,
      dailyStreak: state.dailyStreak, lastDailyBonusClaim: state.lastDailyBonusClaim,
    }));
  } catch (e) { /* storage unavailable — cache is a nice-to-have, safe to skip */ }
}

let currentUid = null;
let unsubscribeSnapshot = null; // tears down the PREVIOUS identity's listener before attaching a new one
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
 * @param {(data: {bankroll:number, removeAds:boolean, vipUntil:number, unlockedTables:string[]}, hardReset: boolean) => void} onUpdate
 *   called immediately with cached data, then again every time Firestore
 *   data changes (e.g. right after a purchase is granted server-side).
 *   `hardReset` is true only on the FIRST call for a given identity — i.e.
 *   the initial page-load sync, OR right after a restore-login switches
 *   this tab to a different, pre-existing account. The caller should treat
 *   that case as authoritative (SET local state from it) rather than
 *   merging a delta, since there's no "previous local state" worth
 *   protecting in either of those cases. `hardReset` is false for every
 *   subsequent live update on that SAME identity (a purchase completing, a
 *   daily bonus granted, etc.) — those should merge, not overwrite.
 */
function init(onUpdate) {
  onUpdateCallback = onUpdate;

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      await signInAnonymously(auth).catch(err => console.error("Sign-in failed", err));
      return;
    }

    // Is this the SAME identity we already have a live listener running for
    // (e.g. Firebase re-firing onAuthStateChanged on a routine token
    // refresh), or a genuinely different one (first-ever load, or a
    // restore-login switching from this device's anonymous account to a
    // different, pre-existing account)? Only the latter needs any of the
    // work below — re-running it for a same-identity refire would tear down
    // and rebuild a perfectly good listener for no reason.
    const isNewIdentity = user.uid !== currentUid || !unsubscribeSnapshot;
    currentUid = user.uid;
    resolveAuthReady(); // safe to call more than once — a Promise only ever resolves the first time
    console.log('[link] auth resolved, uid=', user.uid, 'linked=', user.providerData.length > 0, 'providers=', user.providerData.map(p => p.providerId));
    if (!isNewIdentity) return;

    // Stop listening to the PREVIOUS identity's doc before doing anything
    // else. Without this, a restore-login (switching from this device's
    // anonymous account to a different, pre-existing higher-value account)
    // could leave two live listeners running at once — the old anonymous
    // doc's and the new real account's — both able to fire and race each
    // other over the same local `bankroll` variable.
    if (unsubscribeSnapshot) { unsubscribeSnapshot(); unsubscribeSnapshot = null; }
    sessionClaimed = false; // must re-claim + round-trip for THIS identity before comparing session state again

    // make sure a user doc exists (first run)
    try {
      await httpsCallable(functions, "ensureUserDoc")();
    } catch (err) {
      console.error("ensureUserDoc failed", err);
    }

    // claim this device as the active session — any OTHER device watching
    // this same doc will see activeDeviceId change and know it's been
    // superseded (see the mismatch check below).
    try {
      await httpsCallable(functions, "claimSession")({deviceId});
      sessionClaimed = true;
      console.log('[session] claimed as device', deviceId);
    } catch (err) {
      console.error("claimSession failed", err);
    }

    // live-sync: fires immediately, then on every change (e.g. after a purchase)
    let firstSnapshotForThisIdentity = true; // → tells the caller "this is a fresh identity, treat as authoritative" vs "live update, merge deltas"
    unsubscribeSnapshot = onSnapshot(doc(db, "users", currentUid), (snap) => {
      if (snap.exists()) {
        latestUserDoc = snap.data();
        cacheStateLocally(latestUserDoc);
        // Only start comparing AFTER our own claim has round-tripped — the
        // very first snapshot on page load can reflect whatever device had
        // it before us, which isn't a real supersession, just us not having
        // claimed yet.
        if (sessionClaimed && latestUserDoc.activeDeviceId && latestUserDoc.activeDeviceId !== deviceId) {
          console.warn('[session] superseded — doc now claimed by', latestUserDoc.activeDeviceId, 'we are', deviceId);
          window.dispatchEvent(new CustomEvent('session-superseded'));
        }
        const hardReset = firstSnapshotForThisIdentity;
        firstSnapshotForThisIdentity = false;
        onUpdateCallback?.(latestUserDoc, hardReset);
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
 * Watch-an-ad-for-coins, server-validated. `context` must be one of the
 * keys the backend recognizes ('locked_table', 'zero_bailout') — the
 * client names WHICH ad slot was watched, never how much to grant.
 * Call this only from an ad SDK's "reward earned" callback, never on the
 * button click itself — otherwise players get coins without watching.
 * @returns {Promise<{ok:boolean, granted:number, bankroll:number}>}
 */
async function claimAdReward(context) {
  await authReady;
  const fn = httpsCallable(functions, "claimAdReward");
  const result = await fn({context});
  return result.data;
}

/**
 * The recurring "come back every 30 minutes" free-chip claim. Server is
 * the sole authority on timing via `nextFreeChipAt` on the user doc — this
 * call can't be spoofed by messing with the local clock or cached state,
 * same trust model as claimZeroBailout/claimDailyBonus. No stacking: each
 * claim resets the cooldown from the moment it's claimed, it does not
 * accumulate while the app is closed.
 * @returns {Promise<{ok:boolean, locked:boolean, granted?:number, bankroll:number, nextFreeChipAt:number}>}
 */
async function claimFreeChip() {
  await authReady;
  const fn = httpsCallable(functions, "claimFreeChip");
  const result = await fn();
  return result.data;
}

/**
 * The "out of coins → back to lobby" free top-up. Up to 3 uses, then a
 * 30-minute lockout (rolling — resets to a fresh 3 once it elapses).
 * @returns {Promise<{ok:boolean, locked:boolean, granted?:number, bankroll:number, usesRemaining?:number, lockoutUntil?:number}>}
 */
async function claimZeroBailout() {
  await authReady;
  const fn = httpsCallable(functions, "claimZeroBailout");
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
 * Uses a POPUP (not the redirect flow this used to use). Redirect requires
 * surviving a full round trip through a DIFFERENT origin
 * (blackjack-box-21.firebaseapp.com) and back — modern browsers'
 * cross-origin storage partitioning has started silently breaking that
 * round trip (confirmed on both Chrome and Edge here), even though
 * Authorized Domains are configured correctly. A popup avoids the problem
 * entirely since the opener tab never navigates away and the result comes
 * back via postMessage instead.
 *
 * Trade-off, deliberately accepted for now: popups are unreliable on mobile
 * browsers and inside installed PWAs (often silently blocked) — the exact
 * reason redirect was chosen originally. Revisit with a custom authDomain
 * (same registrable domain as the app) if/when that becomes available —
 * that's the fix that works everywhere without this trade-off.
 *
 * Dispatches the same 'account-linked' / 'account-link-failed' window
 * events as before, so game.js's listeners don't need to change — it just
 * fires them directly here instead of on the next page load.
 */
async function linkWithGoogle() {
  await authReady;
  const provider = new GoogleAuthProvider();
  try {
    const result = await linkWithPopup(auth.currentUser, provider);
    const label = result.user.displayName || result.user.email || 'Google account';
    window.dispatchEvent(new CustomEvent('account-linked', { detail: { restored: false, label } }));
  } catch (err) {
    if (err.code === 'auth/credential-already-in-use' || err.code === 'auth/email-already-in-use') {
      // Two distinct cases land here:
      //  - credential-already-in-use: this Google account was already linked
      //    to a different (older) account.
      //  - email-already-in-use: the project's "one account per email"
      //    setting kicked in because this Google account's email already
      //    belongs to a DIFFERENT-provider account here (e.g. the player
      //    earlier used "or use email" with the same address).
      // Either way, the fix is the same: sign into that existing account
      // instead of the current anonymous one, restoring its data. Firebase
      // attaches the Google credential to both error types so this works
      // for each.
      try {
        const credential = GoogleAuthProvider.credentialFromError(err);
        if (!credential) throw err; // no credential attached — can't auto-recover
        const result = await signInWithCredential(auth, credential);
        const label = result.user.displayName || result.user.email || 'Google account';
        window.dispatchEvent(new CustomEvent('account-linked', { detail: { restored: true, label } }));
      } catch (err2) {
        console.error('Google popup recovery failed', err2);
        const message = err.code === 'auth/email-already-in-use'
          ? 'That Google account\'s email is already registered — sign in with email/password instead, then link Google from there.'
          : 'Could not sign in — try again';
        window.dispatchEvent(new CustomEvent('account-link-failed', { detail: { message } }));
      }
    } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      // player closed the popup themselves — not a real failure, no toast needed
    } else if (err.code === 'auth/popup-blocked') {
      window.dispatchEvent(new CustomEvent('account-link-failed', { detail: { message: 'Popup was blocked — please allow popups for this site and try again' } }));
    } else if (err.code) {
      console.error('Google popup sign-in failed', err);
      window.dispatchEvent(new CustomEvent('account-link-failed', { detail: { message: 'Could not sign in — try again' } }));
    }
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

/**
 * Hand-outcome sync, batched every 5 rounds.
 *
 * game.js calls this once per round (from endCleanup()) with that round's
 * net bankroll change and total wagered — NOT awaited, NOT blocking play.
 * Every 5 calls, the accumulated batch is sent to the server in the
 * background. Play continues immediately regardless of whether the network
 * call is still in flight, has failed, or is retrying.
 *
 * Deliberately not persisted to localStorage/disk — if the tab is killed
 * before a batch flushes, at most the last (<5) rounds' deltas are lost,
 * same as the trade-off already accepted for regular in-session play.
 */
const HANDS_PER_SYNC_BATCH = 5;
let currentBatch = { delta: 0, wagered: 0, hands: 0 };
let syncQueue = []; // closed batches waiting to be sent, in order
let syncInFlight = false;

function recordHandForSync(delta, wagered) {
  currentBatch.delta += delta;
  currentBatch.wagered += wagered;
  currentBatch.hands += 1;
  if (currentBatch.hands >= HANDS_PER_SYNC_BATCH) {
    closeBatchAndFlush();
  }
}

/** Force whatever's accumulated so far out immediately — call this when leaving a table. */
function flushPendingHandSync() {
  if (currentBatch.hands > 0) closeBatchAndFlush();
}

function closeBatchAndFlush() {
  const delta = currentBatch.delta;
  syncQueue.push({
    delta,
    wagered: currentBatch.wagered,
    // idempotency token: lets a retried call that actually succeeded server-side
    // (but whose response we never received) get recognized and no-op'd rather
    // than double-applied.
    token: `${currentUid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  });
  currentBatch = { delta: 0, wagered: 0, hands: 0 };
  // Tell game.js to account for this delta RIGHT NOW, before the network
  // call even goes out — not after it resolves. The live Firestore listener
  // (a separate websocket) can receive the server's write and fire before
  // the syncBankrollDelta callable's own HTTP response gets back to this
  // client, since they're two independent round-trips. If game.js only
  // updates cloudCoinsMerged on the callable's response (round-sync-applied,
  // below), that echo can land first and get double-added. Firing this
  // optimistically closes that window; round-sync-applied still corrects
  // to the server's exact figure afterward (e.g. if anti-cheat clamped it).
  window.dispatchEvent(new CustomEvent('round-sync-pending', { detail: { delta } }));
  processSyncQueue();
}

async function processSyncQueue() {
  if (syncInFlight || syncQueue.length === 0) return;
  syncInFlight = true;
  const batch = syncQueue[0];
  try {
    await authReady;
    const fn = httpsCallable(functions, "syncBankrollDelta");
    const result = await fn({ delta: batch.delta, wagered: batch.wagered, syncToken: batch.token });
    syncQueue.shift(); // sent successfully — drop it and try the next one
    // This exact change is ALREADY reflected in local `bankroll` — it applied
    // instantly during gameplay, before this network call even started. The
    // live snapshot listener is about to see this same write land in
    // Firestore and fire — without this event, game.js's merge logic can't
    // tell that apart from a genuinely NEW server-side change (a purchase,
    // daily bonus, etc.) and would add it AGAIN on top. Pass the server's
    // actual resulting bankroll (not just the delta we sent) so this stays
    // correct even if the server's anti-cheat clamp adjusted the amount.
    window.dispatchEvent(new CustomEvent('round-sync-applied', { detail: { resultBankroll: result.data?.bankroll } }));
  } catch (err) {
    console.error("Bankroll sync failed, will retry with the next round", err);
    // leave it at the front of the queue — the next recordHandForSync()
    // batch-close (or the next processSyncQueue() call) will retry it
    // before sending anything newer, so order/idempotency stay intact.
  } finally {
    syncInFlight = false;
    if (syncQueue.length > 0) processSyncQueue(); // more queued (e.g. retries piling up) — keep draining
  }
}

// Best-effort: try to get a partial batch out if the player backgrounds/closes
// the tab mid-session. Not guaranteed to complete (the page can die before
// the async call resolves) — it's a bonus attempt, not a substitute for the
// every-5-rounds cadence above. Both events are wired since neither fires
// reliably in every situation on its own: visibilitychange is the primary
// signal (backgrounding, switching apps), pagehide is a second net for
// mobile/PWA navigations and app-quits where visibilitychange can be skipped
// or arrive too late. Calling flushPendingHandSync() twice is harmless — it
// no-ops once the batch is already empty.
window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushPendingHandSync();
});
window.addEventListener('pagehide', () => {
  flushPendingHandSync();
});

// Belt-and-suspenders: even visibilitychange/pagehide together aren't a
// GUARANTEE — nothing in the browser platform promises a callback fires on
// a hard OS-level kill, crash, or the process just getting yanked (this is
// especially true on mobile). A periodic flush caps the worst-case data
// loss at one interval's worth of play (currently 30s) instead of up to
// HANDS_PER_SYNC_BATCH-1 hands with no time bound at all. Harmless overhead
// when there's nothing pending — flushPendingHandSync() no-ops in that case.
setInterval(flushPendingHandSync, 30000);

window.CloudSync = {
  init, getState, buyOnWeb, buyOnAndroid, isPlayBillingAvailable,
  claimDailyBonus, isDailyBonusAvailable, nextDailyBonusDay,
  claimAdReward, claimZeroBailout, claimFreeChip,
  linkWithGoogle, linkWithEmail, isAccountLinked, getAccountLabel,
  recordHandForSync, flushPendingHandSync,
};
// game.js is a classic (non-module) script and runs BEFORE this module finishes loading,
// so it can't just check `if (window.CloudSync)` at the top level — it listens for this
// event instead, which fires once CloudSync is actually ready to use.
window.dispatchEvent(new Event('cloudsync-ready'));
