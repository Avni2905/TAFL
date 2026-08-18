import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOPV_2VIybRdTWddUqCpgFBulP_7IZAUI",
  authDomain: "tafl-2384c.firebaseapp.com",
  projectId: "tafl-2384c",
  storageBucket: "tafl-2384c.firebasestorage.app",
  messagingSenderId: "383024483967",
  appId: "1:383024483967:web:11594d17803eac7b04f94a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;