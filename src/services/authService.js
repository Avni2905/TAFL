import { auth, db } from "./firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut
} from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

// Setup invisible reCAPTCHA
export const setupRecaptcha = (elementId) => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch (e) {}
  }
  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
  });
  return window.recaptchaVerifier;
};

// Send OTP
export const sendOTP = async (phoneNumber) => {
  const cleanPhone = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+91${phoneNumber}`;
  const recaptcha = setupRecaptcha("recaptcha-container");
  const confirmation = await signInWithPhoneNumber(auth, cleanPhone, recaptcha);
  window.confirmationResult = confirmation;
  return confirmation;
};

// Find user in Firestore by Firebase UID or phone number
const findUser = async (uid, phone) => {
  // 1. Try Firebase UID first
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return { id: uid, data: snap.data() };
  } catch (e) {}

  // 2. Try phone number formats as document ID
  const raw = phone.replace(/\D/g, "");
  const formats = [
    raw,
    raw.length === 10 ? `91${raw}` : null,
    raw.length === 12 ? raw.slice(2) : null,
  ].filter(Boolean);

  for (const format of formats) {
    try {
      const snap = await getDoc(doc(db, "users", format));
      if (snap.exists()) return { id: format, data: snap.data() };
    } catch (e) {}
  }

  // 3. Search by phone field in collection
  try {
    const allFormats = [
      `+91${raw.slice(-10)}`,
      raw.slice(-10),
      `91${raw.slice(-10)}`,
    ];
    for (const f of allFormats) {
      const q = query(collection(db, "users"), where("phone", "==", f));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, data: d.data() };
      }
    }
  } catch (e) {}

  return null;
};

// Verify OTP — works for both student and coach
export const verifyOTP = async (otp, expectedRole = null) => {
  if (!window.confirmationResult) {
    throw new Error("No OTP sent. Please request OTP again.");
  }

  const result = await window.confirmationResult.confirm(otp);
  const firebaseUser = result.user;
  const uid = firebaseUser.uid;
  const phone = firebaseUser.phoneNumber || "";

  const found = await findUser(uid, phone);

  if (!found) throw new Error("NOT_REGISTERED");

  const { id: docId, data: userData } = found;

  if (userData.status !== "approved") throw new Error("NOT_APPROVED");

  if (expectedRole && !expectedRole.includes(userData.role)) {
    throw new Error("ACCESS_DENIED");
  }

  return { uid: docId, firebaseUid: uid, ...userData };
};

// Logout
export const logoutUser = () => signOut(auth);