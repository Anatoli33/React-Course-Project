import { 
  collection, addDoc, serverTimestamp,
  doc, updateDoc, increment, onSnapshot, query, orderBy
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export const usePolls = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snap => {
      setPolls(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const createPoll = async (question, options, userId) => {
    const clean = options.filter(o => o.trim() !== "");
    if (!question || clean.length < 2) throw new Error("Минимум 2 опции!");

    await addDoc(collection(db, "polls"), {
      question,
      options: clean,
      votes: clean.map(() => 0),
      voters: {},
      createdBy: userId,
      createdAt: serverTimestamp()
    });
  };

  const vote = async (pollId, i, userId) => {
    await updateDoc(doc(db, "polls", pollId), {
      [`votes.${i}`]: increment(1),
      [`voters.${userId}`]: true
    });
  };

  return { polls, createPoll, vote };
};
