import React from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase.js";

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
      console.error("Error adding post:", err);
      alert("Грешка при добавяне на пост.");
    }
  };

  return (
    <div className="container">
      <h1>Create Sport Talk Post</h1>
      <form onSubmit={actionFn}>
        <label>Title</label>
        <input type="text" name="title" placeholder="Enter post title" required />

        <label>Content</label>
        <textarea name="content" placeholder="Write your post content here..." required></textarea>

        <label>Image URL (optional)</label>
        <input type="text" name="imageUrl" placeholder="https://example.com/image.jpg" />

        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default Create;
