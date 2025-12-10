import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const CommentsList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [postId]);

  if (comments.length === 0) return <p>No comments yet...</p>;

  return (
    <div className="comments">
      {comments.map((c) => (
        <div key={c.id} className="comment">
          <strong>{c.authorName}</strong>
          <p>{c.text}</p>
          {c.createdAt && (
            <span className="comment-time">
              {new Date(c.createdAt.toDate()).toLocaleString("en-US")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
