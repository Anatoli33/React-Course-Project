import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase.js";
import { useAuth } from "./AuthContext.jsx";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="feed" className="feed">
      <h3 className="feed-title">Последни публикации</h3>
      {currentUser && (
        <Link to="/create">
          <button className="post-button" style={{margin: "20px"}}>
            ➕ Създай пост
          </button>
        </Link>
      )}

      {posts.length === 0 && <p>Няма публикувани постове</p>}
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </section>
  );
};

const Post = ({ post }) => {
  const { currentUser } = useAuth();
  const [likes, setLikes] = useState(post.likes || 0);
  const hasLiked = post.likedBy?.includes(currentUser?.uid) || false;

  const likeHandler = async () => {
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

  const repostHandler = async () => {
    if (!currentUser) return alert("Моля, влезте, за да споделите този пост!");

    try {
      const postsCollection = collection(db, "posts");
      await addDoc(postsCollection, {
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
    } catch (err) {
      console.error("Грешка при Repost:", err);
      alert("Неуспешно споделяне на поста.");
    }
  };

  return (
    <div className="post">
      <Link to={`/details/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="post-header">
          <span className="post-user">@{post.user || "Unknown"}</span>
          <br />
          <span className="post-time">
            {post.createdAt
              ? new Date(post.createdAt.toDate()).toLocaleString("bg-BG")
              : "—"}
          </span>
        </div>

        <h4 className="post-title">{post.title}</h4>
        <p className="post-text">{post.text || post.content}</p>

        <div className="hashtags">
          {post.hashtags?.map(tag => (
            <span className="hashtag" key={tag}>#{tag}</span>
          ))}
        </div>
      </Link>

      {currentUser && (
        <div className="post-buttons">
          <button
            className={`post-button ${hasLiked ? "liked" : ""}`}
            onClick={likeHandler}
          >
            {hasLiked ? "💔 Unlike" : "❤️ Like"} {likes > 0 && likes}
          </button>
          <button className="post-button">💬 Comment</button>
          <button className="post-button" onClick={repostHandler}>
            🔁 Repost
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
