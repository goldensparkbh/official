import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { CartLine, Item, Order } from './catalog';
import { guides as defaultGuides } from '@/data/learning';
import type { Guide } from '@/data/learning';

export function watchGuides(update: (guides: Guide[]) => void, error: (e: Error) => void) {
  if (!db) return () => {};
  return onSnapshot(collection(db, 'projectGuides'), snapshot => {
    const merged = new Map(defaultGuides.map(guide => [guide.id, guide]));
    snapshot.docs.forEach(document => merged.set(document.id, { ...document.data(), id: document.id } as Guide));
    update([...merged.values()]);
  }, error);
}
export async function saveGuide(guide: Guide) {
  if (!db) throw new Error('Store connection is not configured.');
  await setDoc(doc(db, 'projectGuides', guide.id), guide);
}

const config = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, appId: import.meta.env.VITE_FIREBASE_APP_ID };
export const configured = Object.values(config).every(Boolean);
const app = configured ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
const functions = app ? getFunctions(app, 'us-central1') : null;
export function watchItems(update: (items: Item[]) => void, error: (e: Error) => void) {
  if (!db) return () => {};
  return onSnapshot(collection(db, 'projectItems'), snapshot => update(snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as Item)), error);
}
export function watchSettings(update: (number: string) => void, error: (e: Error) => void) {
  if (!db) return () => {};
  return onSnapshot(doc(db, 'projectSettings', 'public'), snapshot => update(snapshot.data()?.whatsapp ?? 'XXXXXXXX'), error);
}
export async function saveItem(item: Item) {
  if (!db) throw new Error('Store connection is not configured.');
  await setDoc(doc(db, 'projectItems', item.id), item);
}
export async function createOrder(id: string, lines: CartLine[], customer: string, contact: string, notes: string) {
  if (!auth || !functions) throw new Error('Ordering is being set up. Please contact support@goldenspark.me.');
  await auth.authStateReady();
  if (!auth.currentUser) await signInAnonymously(auth);
  const result = await httpsCallable<unknown, Order>(functions, 'createProjectOrder')({ id, lines, customer, contact, notes });
  return result.data;
}
export async function updateOrder(id: string, status: string, paidAmount: number | null) {
  if (!functions) throw new Error('Store connection is not configured.');
  await httpsCallable(functions, 'updateProjectOrder')({ id, status, paidAmount });
}
export async function downloadWorkshop(courseId: string) {
  if (!auth || !configured) throw new Error('Workshop downloads are being set up.');
  await auth.authStateReady();
  if (!auth.currentUser) throw new Error('Open the browser used for your purchase, or sign in to your purchasing account.');
  const token = await auth.currentUser.getIdToken();
  const url=`https://us-central1-${config.projectId}.cloudfunctions.net/downloadWorkshop?courseId=${encodeURIComponent(courseId)}`;
  const response=await fetch(url,{headers:{Authorization:`Bearer ${token}`}});
  if(!response.ok) throw new Error(await response.text());
  const blob=await response.blob();
  if(!blob.type.includes('application/pdf')) throw new Error('Unexpected file response. Please try again.');
  const objectUrl=URL.createObjectURL(blob);const link=document.createElement('a');
  link.href=objectUrl;link.download=`Golden-Spark-${courseId}-workshop.pdf`;link.click();
  setTimeout(()=>URL.revokeObjectURL(objectUrl),10000);
}
