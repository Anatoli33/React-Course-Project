import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PoolDetails = () => {
  const { id } = useParams();
  const [pool, setPool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const docRef = doc(db, "polls", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPool(docSnap.data());
        } else {
          setError("This poll does not exist.");
        }
      } catch (err) {
        setError("Error loading poll data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const totalVotes = pool.votes ? Object.values(pool.votes).reduce((sum, v) => sum + v, 0) : 0;
  const numVoters = pool.voters ? Object.keys(pool.voters).length : 0;

  return (
    <>
      <Link to="/polls" className="post-button">← Back to Polls</Link>
      <div className="pool-details-wrapper">
        <h2>Question: {pool.question}</h2>

        <p><strong>Options and Votes:</strong></p>
        <ul>
          {pool.options.map((option, index) => {
            const votes = pool.votes?.[index] || 0;
            const pct = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
            return (
              <li key={index}>
                {option} — {votes} votes ({pct}%)
              </li>
            );
          })}
        </ul>

        <p><strong>Number of Voters:</strong> {numVoters}</p>
        <p>
          <strong>Created At:</strong>{" "}
          {pool.createdAt?.toDate ? pool.createdAt.toDate().toLocaleDateString() : "No date"}
        </p>
      </div>
    </>
  );
};

export default PoolDetails;
