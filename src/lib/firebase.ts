import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import _firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(_firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, _firebaseConfig.firestoreDatabaseId);

