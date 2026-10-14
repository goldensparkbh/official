// Run only from a trusted workstation with Application Default Credentials.
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const uid = process.argv[2];
if (!uid) throw new Error('Usage: node functions/grant-admin.js FIREBASE_AUTH_UID');
initializeApp({ credential: applicationDefault() });
const user = await getAuth().getUser(uid);
await getAuth().setCustomUserClaims(uid, { ...user.customClaims, admin: true });
console.log('Administrator access granted. Sign out and sign back in.');
