import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);

          if (!snap.exists()) {
            await setDoc(userRef, {
              username: user.displayName || user.email.split("@")[0],
              avatar: `https://img.freepik.com/premium-vector/vector-illustration-man-avatar-simple-minimalist-flat-design-style_844724-7066.jpg?w=360`,
              bio: "Нов потребител в Sport Talk",
              joined: new Date().toLocaleDateString("bg-BG"),
            });

            console.log("Създаден Firestore профил за:", user.email);
          }
        } catch (err) {
          console.error("Грешка при създаване на профил:", err);
        }

        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Грешка при изход:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {!loading ? children : <p>Зареждане на потребителя...</p>}
    </AuthContext.Provider>
  );
};
