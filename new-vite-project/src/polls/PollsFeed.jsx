import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "../firebase";

const PollsFeed = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, snapshot => {
      setPolls(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
    <div className="polls-container">
      <h2>Polls</h2>
      {auth.currentUser && (
        <Link to="/polls/create">
          <button className="create-poll-btn">Create Poll</button>
        </Link>
      )}

      {polls.map(poll => {
        const user = auth.currentUser;
        const voters = poll.voters || {};
        const rawVotes = poll.votes || {};
        const votes = Object.values(rawVotes);   
        const options = Array.isArray(poll.options) ? poll.options : [];
        const hasVoted = user ? voters[user.uid] : false;
        const totalVotes = votes.reduce((sum, v) => sum + (v || 0), 0);

        return (
          <div className="poll-card" key={poll.id}>
            <div className="poll-question">{poll.question || "No question"}</div>

            {options.map((option, i) => {
              const count = votes[i] || 0;
              const pct = totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

              return (
                <div className="poll-option" key={i}>
                  <button disabled={hasVoted} onClick={() => vote(poll.id, i)}>
                    {option || `Option ${i + 1}`}
                  </button>
                  {hasVoted && <span>{count} votes ({pct}%)</span>}
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
