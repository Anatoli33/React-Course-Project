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
        console.log("No such post!");
      }
    };

    fetchPost();
  }, [id, currentUser]);

  const likeHandler = async () => {
    if (!currentUser) {
      alert("Please log in to like this post!");
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
      alert("Please log in to repost this post!");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        user: currentUser.displayName || currentUser.email,
        userId: currentUser.uid,
        title: "Repost: " + (post.title || ""),
        content: post.content || post.text || "",
        hashtags: post.hashtags || [],
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });
      alert("Post shared successfully!");
    } catch (err) {
      console.error("Error reposting:", err);
      alert("Failed to share the post.");
    }
  };

  const deleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db, "posts", id));
      alert("Post deleted successfully!");
      window.location.href = "/posts";
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete the post.");
    }
  };

  if (!post) return <p>Loading post...</p>;

  return (
    <section className="post-detail-wrapper">
      <Link to="/posts" className="post-button">← Back to Posts</Link>

      <div className="post-detail-card">
        <div className="post-header">
          <h2 className="post-title">{post.title}</h2>
          <span className="post-user">@{post.user}</span>
          <span className="post-time">
            {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleString("en-US") : "—"}
          </span>
        </div>

        <div className="post-text">{post.text || post.content}</div>

        {post.hashtags && <div className="hashtags">{post.hashtags.map(tag => `#${tag} `)}</div>}

        {currentUser && (
          <div className="post-buttons">
            <button className={`post-button ${hasLiked ? "liked" : ""}`} onClick={likeHandler}>
              {hasLiked ? "💔 Unlike" : "❤️ Like"} {likes > 0 && likes}
            </button>

            <button className="post-button" onClick={repostHandler}>
              🔁 Repost
            </button>

            {currentUser.displayName === post.user && (
              <>
                <button className="post-button" onClick={deleteHandler}>🗑️ Delete</button>
                <Link to={`/edit/${id}`} className="post-button">✏️ Edit</Link>
              </>
            )}
          </div>
        )}

        <div className="comments-section">
          <h3>Comments</h3>
          <CommentsList postId={id} />
          {currentUser ? (
            <AddComment postId={id} />
          ) : (
            <p>Only registered users can comment.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
