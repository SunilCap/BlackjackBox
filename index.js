/**
 * 21 Table — Blackjack  /  Backend (Firebase Cloud Functions)
 *
 * Handles real-money purchases for BOTH platforms:
 *   - Web:     Stripe Checkout  -> stripeWebhook
 *   - Android: Google Play Billing -> verifyPlayPurchase
 *
 * The golden rule: the client (game.js) can never write bankroll/purchase
 * fields directly. Only these server functions can, and only after they've
 * confirmed real money actually changed hands. Firestore security rules
 * (see firestore.rules) enforce this.
 *
 * SETUP (one-time):
 *   1. firebase init functions   (pick Node.js, Firestore already enabled)
 *   2. npm install stripe googleapis firebase-admin firebase-functions
 *   3. firebase functions:config:set stripe.secret="sk_live_..." stripe.webhook_secret="whsec_..."
 *   4. Create a Play Console service account (Play Console > API access),
 *      download the JSON key, store it as a Firebase secret (see below).
 *   5. firebase deploy --only functions
 */

const {onRequest, onCall} = require('firebase-functions/v2/https');
const {defineSecret} = require('firebase-functions/params');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

const STRIPE_SECRET_KEY   = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');
const PLAY_SERVICE_ACCOUNT  = defineSecret('PLAY_SERVICE_ACCOUNT_JSON');

/* ── PRODUCT CATALOG ──
   Keep this on the server, never trust a price/reward the client sends you.
   Maps a product ID (same one used in Stripe Price / Play Billing SKU) to
   what the player actually receives. */
const PRODUCTS = {
  starter_pack:   {coins: 5000,   removeAds: false, vipDays: 0},
  high_roller:    {coins: 25000,  removeAds: false, vipDays: 7},
  vip_bundle:     {coins: 100000, removeAds: false, vipDays: 0, unlockMonaco: true},
  remove_ads:     {coins: 0,      removeAds: true,  vipDays: 0},
  vip_weekly:     {coins: 0,      removeAds: true,  vipDays: 7},
  vip_monthly:    {coins: 0,      removeAds: true,  vipDays: 30},
};

/* ── shared: apply a purchased product to a user's Firestore doc ── */
async function grantProduct(uid, productId) {
  const product = PRODUCTS[productId];
  if (!product) throw new Error(`Unknown product: ${productId}`);

  const userRef = db.collection('users').doc(uid);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const cur = snap.exists ? snap.data() : {bankroll: 1000, removeAds: false, vipUntil: 0, unlockedTables: []};

    const update = {
      bankroll: (cur.bankroll || 0) + product.coins,
      removeAds: cur.removeAds || product.removeAds,
    };
    if (product.vipDays > 0) {
      const base = Math.max(cur.vipUntil || 0, Date.now());
      update.vipUntil = base + product.vipDays * 24 * 60 * 60 * 1000;
    }
    if (product.unlockMonaco) {
      update.unlockedTables = admin.firestore.FieldValue.arrayUnion('monaco');
    }
    tx.set(userRef, update, {merge: true});
  });
}

/* ═══════════════════════════════════════════
   WEB PURCHASES — Stripe
   ═══════════════════════════════════════════
   Flow:
   1. Client calls `createCheckoutSession` (callable below) with a productId.
   2. Player pays on Stripe's hosted Checkout page.
   3. Stripe calls this webhook when payment succeeds — THIS is the only
      place a purchase actually gets granted. The redirect-back URL is just
      UI; never grant purchases from a client-side "success" redirect alone,
      since that URL can be visited manually without paying.
*/
exports.stripeWebhook = onRequest(
  {secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET]},
  async (req, res) => {
    const stripe = require('stripe')(STRIPE_SECRET_KEY.value());
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        req.headers['stripe-signature'],
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error('Stripe signature verification failed', err);
      return res.status(400).send('Invalid signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const uid = session.client_reference_id;       // set when creating the session
      const productId = session.metadata?.productId;
      if (uid && productId) {
        try {
          await grantProduct(uid, productId);
        } catch (err) {
          console.error('Failed to grant product', err);
          return res.status(500).send('Grant failed');
        }
      }
    }
    res.status(200).send('ok');
  }
);

exports.createCheckoutSession = onCall(
  {secrets: [STRIPE_SECRET_KEY]},
  async (request) => {
    if (!request.auth) throw new Error('Must be signed in');
    const {productId, priceId} = request.data; // priceId = Stripe Price ID for this product
    if (!PRODUCTS[productId]) throw new Error('Unknown product');

    const stripe = require('stripe')(STRIPE_SECRET_KEY.value());
    const session = await stripe.checkout.sessions.create({
      mode: PRODUCTS[productId].vipDays > 0 && PRODUCTS[productId].coins === 0 ? 'subscription' : 'payment',
      line_items: [{price: priceId, quantity: 1}],
      client_reference_id: request.auth.uid,
      metadata: {productId},
      success_url: 'https://sunilcap.github.io/BlackjackBox/?purchase=success',
      cancel_url: 'https://sunilcap.github.io/BlackjackBox/?purchase=cancelled',
    });
    return {url: session.url};
  }
);

/* ═══════════════════════════════════════════
   ANDROID PURCHASES — Google Play Billing
   ═══════════════════════════════════════════
   Flow:
   1. Android app (via Play Billing Library) completes a purchase, gets a
      purchaseToken back.
   2. App calls this function with {productId, purchaseToken, packageName}.
   3. This function asks Google's Play Developer API to confirm the token
      is real and paid-for (a client could otherwise fabricate a fake
      token), THEN grants the product and acknowledges the purchase.
*/
exports.verifyPlayPurchase = onCall(
  {secrets: [PLAY_SERVICE_ACCOUNT]},
  async (request) => {
    if (!request.auth) throw new Error('Must be signed in');
    const {productId, purchaseToken, packageName, isSubscription} = request.data;
    if (!PRODUCTS[productId]) throw new Error('Unknown product');

    const {google} = require('googleapis');
    const key = JSON.parse(PLAY_SERVICE_ACCOUNT.value());
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ['https://www.googleapis.com/auth/androidpublisher'],
    });
    const androidpublisher = google.androidpublisher({version: 'v3', auth});

    let purchase;
    if (isSubscription) {
      const res = await androidpublisher.purchases.subscriptions.get({
        packageName, subscriptionId: productId, token: purchaseToken,
      });
      purchase = res.data;
      if (purchase.paymentState !== 1) throw new Error('Subscription not paid');
    } else {
      const res = await androidpublisher.purchases.products.get({
        packageName, productId, token: purchaseToken,
      });
      purchase = res.data;
      if (purchase.purchaseState !== 0) throw new Error('Purchase not completed'); // 0 = purchased
      if (purchase.acknowledgementState === 0) {
        await androidpublisher.purchases.products.acknowledge({
          packageName, productId, token: purchaseToken,
        });
      }
    }

    await grantProduct(request.auth.uid, productId);
    return {ok: true};
  }
);

/* ═══════════════════════════════════════════
   READ-ONLY HELPER for the client
   ═══════════════════════════════════════════
   Bankroll is read directly from Firestore client-side (see firestore.rules
   — players can read their own doc). This function exists only for the
   sign-up/first-run case, to make sure a fresh user doc exists.
*/
exports.ensureUserDoc = onCall(async (request) => {
  if (!request.auth) throw new Error('Must be signed in');
  const ref = db.collection('users').doc(request.auth.uid);
  const snap = await ref.get();
  if (!snap.exists) {
    await ref.set({
      bankroll: 1000, removeAds: false, vipUntil: 0, unlockedTables: [],
      dailyStreak: 0, lastDailyBonusClaim: 0, totalWagered: 0,
    });
  }
  return (await ref.get()).data();
});

/* ═══════════════════════════════════════════
   IN-SESSION HAND RESULTS (batched every 5 rounds)
   ═══════════════════════════════════════════
   The client resolves hands locally (instant, no per-hand network round
   trip) and batches up net win/loss + total wagered every 5 rounds — see
   recordHandForSync()/closeBatchAndFlush() in cloud-sync.js. This is the
   server-side landing point for those batches: it's what makes bankroll
   changes from actual PLAY durable server-side too, same as purchases and
   the daily bonus already were.

   `syncToken` is a client-generated idempotency key, one per batch. If a
   call's response never reaches the client (dropped connection, etc.), the
   client retries the SAME batch with the SAME token — we recognize that as
   "already applied" via `lastSyncToken` and no-op it, rather than double-
   crediting/debiting the same rounds twice.

   `totalWagered` is tracked here (not derived from anywhere else) so a
   future anomaly check can compare bankroll growth against how much was
   actually put at risk, without trusting the client's own accounting of it.
*/
exports.syncBankrollDelta = onCall(async (request) => {
  if (!request.auth) throw new Error('Must be signed in');
  const {delta, wagered, syncToken} = request.data;
  if (typeof delta !== 'number' || typeof wagered !== 'number' || !syncToken) {
    throw new Error('Malformed sync payload');
  }

  const ref = db.collection('users').doc(request.auth.uid);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const cur = snap.exists ? snap.data() : {bankroll: 1000, totalWagered: 0};

    if (cur.lastSyncToken === syncToken) {
      // duplicate retry of a batch we already applied — no-op, just echo current state
      return {ok: true, duplicate: true, bankroll: cur.bankroll};
    }

    // Loose sanity clamp — not full anomaly detection (that's a separate,
    // later piece), just a floor/ceiling against obviously-impossible values
    // so a buggy or tampered client can't tank/inflate bankroll outright.
    // Max real payout on a batch of wagered coins is blackjack's 2.5x; 3x
    // leaves slack for insurance (3x on its own smaller side bet) without
    // being loose enough to matter for a real exploit.
    const clampedDelta = Math.max(-wagered, Math.min(delta, wagered * 3));
    if (clampedDelta !== delta) {
      console.warn(`syncBankrollDelta: clamped implausible delta for ${request.auth.uid}`, {delta, wagered});
    }

    const newBankroll = Math.max(0, (cur.bankroll || 0) + clampedDelta);
    tx.set(ref, {
      bankroll: newBankroll,
      totalWagered: (cur.totalWagered || 0) + Math.max(0, wagered),
      lastSyncToken: syncToken,
    }, {merge: true});

    return {ok: true, duplicate: false, bankroll: newBankroll};
  });
});

/* ═══════════════════════════════════════════
   SINGLE-ACTIVE-SESSION ("logged in on another device")
   ═══════════════════════════════════════════
   Called once per sign-in from each device. Last write wins — whichever
   device claims most recently is "active." Every device has a live
   Firestore listener on its own user doc already (for balance sync), so
   the PREVIOUS device sees activeDeviceId change out from under it and
   knows to lock itself. No server-side kicking needed — it's detected
   client-side via the same doc everyone's already watching.
*/
exports.claimSession = onCall(async (request) => {
  if (!request.auth) throw new Error('Must be signed in');
  const {deviceId} = request.data;
  if (!deviceId || typeof deviceId !== 'string') throw new Error('Missing deviceId');

  const ref = db.collection('users').doc(request.auth.uid);
  await ref.set({
    activeDeviceId: deviceId,
    activeDeviceAt: Date.now(),
  }, {merge: true});
  return {ok: true};
});

/* ═══════════════════════════════════════════
   DAILY BONUS (escalating 7-day streak)
   ═══════════════════════════════════════════
   Day 1: $500, Day 2: $750, Day 3: $1,000, Day 4: $1,250,
   Day 5: $1,500, Day 6: $1,750, Day 7: $2,000 — then cycles back to Day 1.
   Missing a calendar day resets the streak to Day 1.

   Calendar days are compared in UTC — deliberately simple and consistent
   rather than trying to track each player's local timezone server-side.
*/
const DAILY_BONUS_LADDER = [500, 750, 1000, 1250, 1500, 1750, 2000];

function dateStringUTC(ms) {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

exports.claimDailyBonus = onCall(async (request) => {
  if (!request.auth) throw new Error('Must be signed in');
  const ref = db.collection('users').doc(request.auth.uid);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const cur = snap.exists ? snap.data() : {bankroll: 1000, dailyStreak: 0, lastDailyBonusClaim: 0};

    const now = Date.now();
    const todayStr = dateStringUTC(now);
    const lastClaimStr = cur.lastDailyBonusClaim ? dateStringUTC(cur.lastDailyBonusClaim) : null;

    if (lastClaimStr === todayStr) {
      // already claimed today — tell the client, grant nothing more
      return {alreadyClaimed: true, streak: cur.dailyStreak || 0, bankroll: cur.bankroll};
    }

    const yesterdayStr = dateStringUTC(now - 24 * 60 * 60 * 1000);
    const continuingStreak = lastClaimStr === yesterdayStr;
    // Cap at Day 7 (max reward) rather than cycling back to Day 1 — an
    // unbroken streak keeps earning $2,000/day indefinitely; only missing
    // a calendar day resets it back to Day 1.
    const newStreak = continuingStreak ? Math.min((cur.dailyStreak || 0) + 1, 7) : 1;
    const bonus = DAILY_BONUS_LADDER[newStreak - 1];
    const newBankroll = (cur.bankroll || 0) + bonus;

    tx.set(ref, {
      bankroll: newBankroll,
      dailyStreak: newStreak,
      lastDailyBonusClaim: now,
    }, {merge: true});

    return {alreadyClaimed: false, granted: bonus, streak: newStreak, bankroll: newBankroll};
  });
});
