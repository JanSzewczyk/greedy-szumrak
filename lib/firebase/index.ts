import "server-only";
import { getFirestore } from "@firebase/firestore";
import { type FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";

import { env } from "~/env";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
