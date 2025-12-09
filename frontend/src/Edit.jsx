import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase.js";

const Edit = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPost(snap.data());
      } else {
        alert("Постът не съществува.");
        navigate("/posts");
      }
    };

    loadPost();
  }, [id, navigate]);

  const updateFn = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const ref = doc(db, "posts", id);

    await updateDoc(ref, {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl || "",
    });

    alert("Постът е редактиран успешно!");
    navigate(`/details/${id}`);
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Edit Post</h1>

      <form onSubmit={updateFn}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          required
        />

        <label>Content</label>
        <textarea
          name="content"
          defaultValue={post.content}
          required
        ></textarea>

        <label>Image URL</label>
        <input
          type="text"
          name="imageUrl"
          defaultValue={post.imageUrl}
        />

        <button type="submit">Запази промените</button>
      </form>
    </div>
  );
};

export default Edit;
