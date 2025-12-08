import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";

const PollsFeed = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPolls(data);
    });

    return () => unsub();
  }, []);

  const vote = async (pollId, optionIndex) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to vote!");
      return;
    }

    try {
      const pollRef = doc(db, "polls", pollId);
      await updateDoc(pollRef, {
        [`votes.${optionIndex}`]: increment(1),
        [`voters.${user.uid}`]: true
      });
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Polls</h2>
      <Link to="/polls/create">
        <button>Create Poll</button>
      </Link>

      {polls.map(poll => {
        const user = auth.currentUser;
        const voters = poll.voters || {};
        const votes = Array.isArray(poll.votes) ? poll.votes : [];
        const options = Array.isArray(poll.options) ? poll.options : [];
        const hasVoted = user ? voters[user.uid] : false;
        const totalVotes = votes.reduce((sum, v) => sum + (v || 0), 0);

        return (
          <div key={poll.id} style={{ border: "1px solid #eee", padding: 15, marginBottom: 15 }}>
            <h4>{poll.question || "No question"}</h4>

            {options.map((option, i) => {
              const count = votes[i] || 0;
              const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

              return (
                <div key={i} style={{ marginTop: 8 }}>
                  <button disabled={hasVoted} onClick={() => vote(poll.id, i)}>
                    {option || `Option ${i + 1}`}
                  </button>
                  {hasVoted && <span style={{ marginLeft: 10 }}>{count} votes ({pct}%)</span>}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PollsFeed;
