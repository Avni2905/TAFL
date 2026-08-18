import { db } from "./firebase";
import {
  doc, getDoc, updateDoc, collection,
  query, where, getDocs, serverTimestamp,
  setDoc, addDoc, deleteDoc
} from "firebase/firestore";
import { uploadToCloudinary } from "./cloudinary";

export const getSiteContent = async () => {
  try {
    const snap = await getDoc(doc(db, "siteContent", "academy"));
    return snap.exists() ? snap.data() : {};
  } catch (e) {
    console.error("getSiteContent error", e);
    return {};
  }
};

export const updateSiteContent = async (data) => {
  await setDoc(doc(db, "siteContent", "academy"), {
    ...data, updatedAt: serverTimestamp()
  }, { merge: true });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
};

export const updateUserProfile = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), {
    ...data, updatedAt: serverTimestamp()
  });
};

export const uploadProfilePicture = async (uid, file) => {
  const url = await uploadToCloudinary(file, "profiles");
  await updateDoc(doc(db, "users", uid), {
    profilePic: url, updatedAt: serverTimestamp()
  });
  return url;
};

export const uploadAchievement = async (uid, file, title) => {
  const url = await uploadToCloudinary(file, "achievements");
  await addDoc(collection(db, "users", uid, "achievements"), {
    title,
    url,
    type: file.type.includes("pdf") ? "pdf" : "image",
    uploadedAt: serverTimestamp()
  });
  return url;
};

export const getAllStudents = async () => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  } catch (e) {
    console.error("getAllStudents error", e);
    return [];
  }
};

export const deleteStudent = async (uid) => {
  await deleteDoc(doc(db, "users", uid));
};

export const getPendingRegistrations = async () => {
  try {
    const q = query(collection(db, "registrations"), where("status", "==", "pending"));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error("getPendingRegistrations error", e);
    return [];
  }
};

// Always store student doc as 10-digit phone number
const phoneToDocId = (phone) => {
  const raw = (phone || "").replace(/\D/g, "");
  if (raw.length === 12) return raw.slice(2); // 919880644546 → 9880644546
  if (raw.length === 11) return raw.slice(1); // 09880644546 → 9880644546
  return raw; // already 10 digits
};

export const approveRegistration = async (regId, regData) => {
  const docId = phoneToDocId(regData.phone);
  await setDoc(doc(db, "users", docId), {
    name: regData.name || "",
    phone: regData.phone || "",
    role: "student",
    status: "approved",
    age: regData.age || "",
    dob: regData.dob || "",
    gender: regData.gender || "",
    school: regData.school || "",
    playingExperience: regData.playingExperience || "",
    level: regData.playingExperience === "Never played"
      ? "Beginner"
      : regData.playingExperience || "Beginner",
    parentName: regData.parentName || "",
    parentPhone: regData.parentPhone || "",
    parentEmail: regData.parentEmail || "",
    areaOfInterest: regData.areaOfInterest || [],
    notes: regData.notes || "",
    type: regData.type || "",
    source: regData.source || "website",
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, "registrations", regId), {
    status: "approved",
    approvedAt: serverTimestamp()
  });
};

export const rejectRegistration = async (regId) => {
  await updateDoc(doc(db, "registrations", regId), {
    status: "rejected", rejectedAt: serverTimestamp()
  });
};

export const submitRegistration = async (formData) => {
  const ref = await addDoc(collection(db, "registrations"), {
    ...formData,
    status: "pending",
    submittedAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  return ref.id;
};

export const addPlayerTournament = async (uid, tournamentData) => {
  await addDoc(collection(db, "users", uid, "tournaments"), {
    ...tournamentData, createdAt: serverTimestamp()
  });
};

export const getPlayerTournaments = async (uid) => {
  try {
    const snap = await getDocs(collection(db, "users", uid, "tournaments"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) { return []; }
};

export const addGalleryMedia = async (file, caption) => {
  const url = await uploadToCloudinary(file, "gallery");
  await addDoc(collection(db, "gallery"), {
    url, caption: caption || "",
    type: file.type.startsWith("video") ? "video" : "image",
    uploadedAt: serverTimestamp()
  });
  return url;
};

export const deleteGalleryMedia = async (mediaId) => {
  await deleteDoc(doc(db, "gallery", mediaId));
};
