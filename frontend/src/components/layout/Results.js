import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const { id } = useParams(); // election id
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await axios.get(`/api/elections/${id}`);
        setElection(res.data);
      } catch (err) {
        alert('Election not found');
      }
    };

    const fetchResults = async () => {
      try {
        const res = await axios.get(`/api/votes/${id}/results`);
        setResults(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchElection();
    fetchResults();
  }, [id]);

  if (!election) return <div>Loading...</div>;

  return (
    <div className="results">
      <h2>Election Results</h2>
      <h3>{election.title}</h3>
      <p>{election.description}</p>

      <div className="results-list">
        <h4>Results:</h4>
        {results.length === 0 ? (
          <p>No votes yet.</p>
        ) : (
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                <strong>{result.candidate}</strong>
                <span>{result.votes} votes</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Results;
