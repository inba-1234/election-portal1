import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Voting = () => {
  const { id } = useParams(); // election id
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await axios.get(`/api/elections/${id}`);
        setElection(res.data);
      } catch (err) {
        alert('Election not found');
        navigate('/dashboard');
      }
    };

    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`/api/elections/${id}/candidates`);
        setCandidates(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchElection();
    fetchCandidates();
  }, [id, navigate]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert('Please select a candidate');
      return;
    }
    try {
      await axios.post(`/api/votes/${id}`, { candidateId: selectedCandidate }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Vote cast successfully!');
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  if (!election) return <div>Loading...</div>;

  return (
    <div className="voting">
      <h2>Vote in Election</h2>
      <h3>{election.title}</h3>
      <p>{election.description}</p>

      <div className="candidates-list">
        <h4>Select a Candidate:</h4>
        {candidates.length === 0 ? (
          <p>No candidates registered yet.</p>
        ) : (
          candidates.map(candidate => (
            <div key={candidate._id} className="candidate-card">
              <input
                type="radio"
                id={candidate._id}
                name="candidate"
                value={candidate._id}
                checked={selectedCandidate === candidate._id}
                onChange={(e) => setSelectedCandidate(e.target.value)}
              />
              <label htmlFor={candidate._id}>
                <strong>{candidate.name}</strong>
                {candidate.description && <p>{candidate.description}</p>}
              </label>
            </div>
          ))
        )}
      </div>

      <button onClick={handleVote} className="btn success" disabled={!selectedCandidate}>
        Cast Vote
      </button>
    </div>
  );
};

export default Voting;
