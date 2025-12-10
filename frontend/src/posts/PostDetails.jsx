import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc, updateDoc, increment, arrayUnion, arrayRemove, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";
import { useAuth } from "../Auth/AuthContext.jsx";
import AddComment from './Comment.jsx';
import CommentsList from "./CommentList.jsx";

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setPost(data);
        setLikes(data.likes || 0);
        setHasLiked(data.likedBy?.includes(currentUser?.uid));
      } else {
        console.log("Постът не съществува!");
      }
    };

    fetchPost();
  }, [id, currentUser]);

  const likeHandler = async () => {
    if (!currentUser) {
      alert("Моля, влезте в профила си, за да харесате поста!");
      return;
    }

    const postRef = doc(db, "posts", id);

    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(currentUser.uid),
      });
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(currentUser.uid),
      });
    }
  };

  const repostHandler = async () => {
    if (!currentUser) {
      alert("Моля, влезте в профила си, за да споделите поста!");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        user: currentUser.displayName || currentUser.email,
        userId: currentUser.uid,
        title: "Споделен пост: " + (post.title || ""),
        content: post.content || post.text || "",
        hashtags: post.hashtags || [],
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });
      alert("Постът е споделен успешно!");
    } catch (err) {
      console.error("Грешка при споделяне:", err);
      alert("Неуспешно споделяне на поста.");
    }
  };

  const deleteHandler = async () => {
    if (!window.confirm("Сигурни ли сте, че искате да изтриете този пост?")) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      alert("Постът е изтрит успешно!");
      window.location.href = "/posts";
    } catch (err) {
      console.error("Грешка при изтриване на пост:", err);
      alert("Неуспешно изтриване на поста.");
    }
  };

  if (!post) return <p>Зареждане на поста...</p>;

  return (
    <section className="post-detail-wrapper">
      <Link to="/posts" className="post-button" style={{margin: "10px"}}>← Обратно към постовете</Link>

      <div className="post-detail-card" style={{margin: "10px"}}>
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
          <span className="post-user">@{post.user}</span>
          <span className="post-time">
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString("bg-BG") : "—"}
          </span>
        </div>

        <div className="post-text">{post.text || post.content}</div>

        {post.hashtags && <div className="hashtags">{post.hashtags.map(tag => `#${tag} `)}</div>}

        {currentUser && (
          <div className="post-buttons">
            <button className={`post-button ${hasLiked ? "liked" : ""}`} onClick={likeHandler}>
              {hasLiked ? "💔 Не харесвай" : "❤️ Харесай"} {likes > 0 && likes}
            </button>

            <button className="post-button" onClick={repostHandler}>
              🔁 Сподели
            </button>

            {currentUser.displayName === post.user && (
              <>
                <button className="post-button" onClick={deleteHandler}>🗑️ Изтрий</button>
                <Link to={`/edit/${id}`} className="post-button">✏️ Редактирай</Link>
              </>
            )}
          </div>
        )}

        <div className="comments-section">
          <h3>Коментари</h3>
          <CommentsList postId={id} />
          {currentUser ? (
            <AddComment postId={id} />
          ) : (
            <p>Само регистрирани потребители могат да коментират.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
