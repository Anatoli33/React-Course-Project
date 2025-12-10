import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";

export const usePolls = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPolls(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  const vote = async (pollId, optionIndex) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Моля влезте в акаунта си, за да гласувате!");
      return;
    }

    try {
      const pollRef = doc(db, "polls", pollId);
      await updateDoc(pollRef, {
        [`votes.${optionIndex}`]: increment(1),
        [`voters.${user.uid}`]: true,
      });
    } catch (err) {
      console.error("Неуспешно гласуване:", err);
      alert("Гласуването не беше успешно.");
    }
  };

  return { polls, vote };
};
