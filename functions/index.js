import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateRequest, snapshotLine, validateStatus, canDownloadWorkshop } from './commerce.js';
initializeApp();
const db = getFirestore();
export const createProjectOrder = onCall(async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Please sign in to create an order.');
  try { validateRequest(request.data); } catch (e) { throw new HttpsError('invalid-argument', e.message); }
  const data = request.data;
  return db.runTransaction(async tx => {
    const ref = db.doc(`projectOrders/${data.id}`);
    const existing = await tx.get(ref);
    if (existing.exists) {
      if (existing.data().owner !== request.auth.uid) throw new HttpsError('permission-denied', 'Order reference is unavailable.');
      return { ...existing.data(), id: ref.id };
    }
    const settings = await tx.get(db.doc('projectSettings/public'));
    if (!/^[1-9][0-9]{7,14}$/.test(settings.data()?.whatsapp ?? '')) throw new HttpsError('failed-precondition', 'WhatsApp ordering is being set up. Please contact Golden Spark.');
    const snapshots = await tx.getAll(...data.lines.map(l => db.doc(`projectItems/${l.itemId}`)));
    let lines;
    try { lines = data.lines.map((l, i) => snapshotLine(l, snapshots[i].data())); } catch (e) { throw new HttpsError('failed-precondition', e.message); }
    // One request per customer per 30 seconds, with retry-safe order IDs.
    const limitRef = db.doc(`projectOrderLimits/${request.auth.uid}`);
    const limit = await tx.get(limitRef);
    const now = Date.now();
    if (now - (limit.data()?.lastCreatedAt ?? 0) < 30000) throw new HttpsError('resource-exhausted', 'Please wait a moment before placing another order.');
    const order = { id: ref.id, owner: request.auth.uid, customer: data.customer.trim(), contact: data.contact.trim(), notes: data.notes.trim(), lines, status: 'awaiting_confirmation', paidAmount: null, createdAt: now, updatedAt: now };
    tx.set(ref, order);
    tx.set(limitRef, { lastCreatedAt: now });
    return order;
  });
});
export const updateProjectOrder = onCall(async request => {
  if (request.auth?.token.admin !== true) throw new HttpsError('permission-denied', 'Administrator access required.');
  const { id, status, paidAmount } = request.data ?? {};
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) throw new HttpsError('invalid-argument', 'Invalid order reference.');
  await db.runTransaction(async tx => {
    const ref = db.doc(`projectOrders/${id}`);
    const snapshot = await tx.get(ref);
    if (!snapshot.exists) throw new HttpsError('not-found', 'Order not found.');
    try { validateStatus(snapshot.data().status, status, paidAmount); } catch (e) { throw new HttpsError('invalid-argument', e.message); }
    tx.update(ref, { status, paidAmount: ['paid', 'in_progress', 'completed'].includes(status) ? paidAmount : null, updatedAt: Date.now() });
  });
  return { ok: true };
});

// PDF files are packaged with the function, never with public Hosting assets.
export const downloadWorkshop = onRequest({ cors: true, timeoutSeconds: 60 }, async (request, response) => {
  response.set('Cache-Control', 'private, no-store');
  response.set('X-Content-Type-Options', 'nosniff');
  if (request.method !== 'GET') { response.status(405).send('GET required.'); return; }
  const courseId = request.query.courseId;
  if (typeof courseId !== 'string' || !/^(EL|AI)-(101|102|201|202|301|302)$/.test(courseId)) { response.status(400).send('Invalid course.'); return; }
  const bearer = request.get('Authorization')?.match(/^Bearer (.+)$/)?.[1];
  if (!bearer) { response.status(401).send('Sign in before downloading.'); return; }
  let user;
  try { user = await getAuth().verifyIdToken(bearer, true); } catch { response.status(401).send('Sign-in expired. Please sign in again.'); return; }
  try {
    if (user.admin !== true) {
      const orders = await db.collection('projectOrders').where('owner', '==', user.uid).get();
      if (!orders.docs.some(order => canDownloadWorkshop(order.data(), user.uid, courseId))) { response.status(403).send('This workshop unlocks after Golden Spark confirms payment.'); return; }
    }
    const file = fileURLToPath(new URL(`./workshops/${courseId}.pdf`, import.meta.url));
    try { await access(file); } catch { response.status(503).send('Workshop file is unavailable. Contact Golden Spark.'); return; }
    response.set('Content-Type', 'application/pdf');
    response.set('Content-Disposition', `attachment; filename="Golden-Spark-${courseId}-workshop.pdf"`);
    const stream = createReadStream(file);
    stream.on('error', () => { if (!response.headersSent) response.status(500).end(); else response.destroy(); });
    stream.pipe(response);
  } catch { response.status(500).send('Unable to check your purchase. Please try again.'); }
});
