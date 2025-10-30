import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const ElectionDetails = () => {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await axios.get(`/api/elections/${id}`);
        setElection(res.data);
      } catch (err) {
        console.error("Error fetching election:", err);
        alert(
          `Failed to load election: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    };

    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`/api/elections/${id}/candidates`);
        setCandidates(res.data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        alert(
          `Failed to load candidates: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    };

    fetchElection();
    fetchCandidates();
  }, [id]);

  if (!election) return <div>Loading...</div>;

  return (
    <div className="election-details">
      <h2>{election.title}</h2>
      <p>{election.description}</p>
      <p>Status: {election.status}</p>
      <p>Start: {new Date(election.startDate).toLocaleString()}</p>
      <p>End: {new Date(election.endDate).toLocaleString()}</p>

      <h3>Candidates</h3>
      {candidates.length === 0 ? (
        <p>No candidates yet.</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate._id}>
              <strong>{candidate.name}</strong>
              {candidate.description && <p>{candidate.description}</p>}
            </li>
          ))}
        </ul>
      )}

      <div className="actions">
        {election.status === "active" &&
          !election.voters?.includes(user?.id) && (
            <Link to={`/election/${id}/vote`} className="btn success">
              Vote Now
            </Link>
          )}

        {/* Only show candidate registration link to admins */}
        {user && user.role === "admin" && (
          <Link to={`/election/${id}/candidate`} className="btn primary">
            Register a Candidate
          </Link>
        )}

        <Link to={`/election/${id}/results`} className="btn secondary">
          View Results
        </Link>
      </div>
    </div>
  );
};

export default ElectionDetails;
