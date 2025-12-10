import { useState } from "react";
import { doc, updateDoc, increment, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const usePostActions = (post, currentUser) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const hasLiked = post.likedBy?.includes(currentUser?.uid) || false;
  const navigate = useNavigate();

  const likePost = async () => {
    if (!currentUser) return alert("Моля, влезте, за да харесате този пост!");

    const postRef = doc(db, "posts", post.id);

    if (!hasLiked) {
      setLikes(likes + 1);
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(currentUser.uid)
      });
    } else {
      setLikes(likes - 1);
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(currentUser.uid)
      });
    }
  };

  const repostPost = async () => {
    if (!currentUser) return alert("Моля, влезте, за да споделите този пост!");

    try {
      const postsCollection = collection(db, "posts");
      const newPostRef = await addDoc(postsCollection, {
        user: currentUser.displayName || currentUser.email,
        userId: currentUser.uid,
        title: "Repost: " + (post.title || ""),
        content: post.content || post.text || "",
        hashtags: post.hashtags || [],
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp()
      });

      alert("Постът е успешно споделен!");
      
      // Navigate to the new post immediately
      navigate(`/details/${newPostRef.id}`);
    } catch (err) {
      console.error("Грешка при Repost:", err);
      alert("Неуспешно споделяне на поста.");
    }
  };

  return {
    likes,
    hasLiked,
    likePost,
    repostPost
  };
};

export default usePostActions;
