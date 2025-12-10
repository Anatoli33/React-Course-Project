import React from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase.js";

const Create = () => {
  const actionFn = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return alert("Моля, влезте в профила си!");

      await addDoc(collection(db, "posts"), {
        userId: currentUser.uid,
        user: currentUser.displayName || currentUser.email.split("@")[0],
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl || "",
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: []
      });

      alert("Постът е успешно създаден!");
      e.target.reset();

    } catch (err) {
      console.error("Грешка при добавяне на пост:", err);
      alert("Грешка при добавяне на пост.");
    }
  };

  return (
    <div className="container">
      <h1>Създай публикация в Sport Talk</h1>
      <form onSubmit={actionFn}>
        <label>Заглавие</label>
        <input 
          type="text" 
          name="title" 
          placeholder="Въведете заглавие на поста" 
          required 
        />

        <label>Съдържание</label>
        <textarea 
          name="content" 
          placeholder="Напишете съдържанието на поста тук..." 
          required
        ></textarea>

        <button type="submit">Създай пост</button>
      </form>
    </div>
  );
};

export default Create;
