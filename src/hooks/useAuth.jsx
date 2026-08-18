import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const AuthContext = createContext(null);

// Always normalize phone to 10 digits
const phoneToDocId = (phone) => {
  const raw = (phone || "").replace(/\D/g, "");
  if (raw.length === 12) return raw.slice(2);
  if (raw.length === 11) return raw.slice(1);
  return raw;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Find user doc by Firebase user (UID first, then phone formats, then collection search)
  const findUserByFirebaseUser = async (firebaseUser) => {
    const uid = firebaseUser.uid;
    const phone = firebaseUser.phoneNumber || "";
    const raw = phone.replace(/\D/g, "");
    const tenDigit = phoneToDocId(phone);

    // 1. Try Firebase UID (for coach/admin who logged in via OTP first time)
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) return { id: uid, data: snap.data() };
    } catch (e) {}

    // 2. Try 10-digit (primary storage format for students)
    if (tenDigit) {
      try {
        const snap = await getDoc(doc(db, "users", tenDigit));
        if (snap.exists()) return { id: tenDigit, data: snap.data() };
      } catch (e) {}
    }

    // 3. Try other formats
    const formats = [raw, raw.length === 10 ? `91${raw}` : null].filter(Boolean);
    for (const format of formats) {
      try {
        const snap = await getDoc(doc(db, "users", format));
        if (snap.exists()) return { id: format, data: snap.data() };
      } catch (e) {}
    }

    // 4. Search by phone field in collection (last resort)
    try {
      const searchFormats = [
        `+91${tenDigit}`,
        tenDigit,
        `91${tenDigit}`,
        phone,
      ].filter(Boolean);

      for (const f of searchFormats) {
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const found = await findUserByFirebaseUser(firebaseUser);
        if (found) {
          setUser({ uid: found.id, firebaseUid: firebaseUser.uid, ...found.data });
          setRole(found.data.role);
        } else {
          setUser(null);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const logoutUser = async () => {
    try { await signOut(auth); } catch (e) {}
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
