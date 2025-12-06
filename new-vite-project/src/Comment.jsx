import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";

const AddComment = ({ postId }) => {
  const [text, setText] = useState("");
  const { currentUser } = useAuth();

  const addComment = async () => {
    if (!text.trim()) return;

    if (!currentUser) {
      alert("Трябва да си логнат, за да коментираш!");
      return;
    }

    if (!postId) {
      console.error("Поста липсва!");
      return;
    }

    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        text,
        authorId: currentUser.uid,
        authorName: currentUser.displayName ,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error("Грешка при добавяне на коментар:", err);
      alert("Неуспешно добавяне на коментар.");
    }
  };

  return (
    <div className="add-comment">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Напиши коментар..."
      />
      <button onClick={addComment}>Публикувай</button>
    </div>
  );
};

export default AddComment;
