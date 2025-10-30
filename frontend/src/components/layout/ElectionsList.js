import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, active, completed
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get('/api/elections');
        setElections(res.data);
      } catch (err) {
        console.error('Error fetching elections:', err);
        alert(`Failed to load elections: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const filteredElections = elections.filter(election => {
    if (filter === 'all') return true;
    return election.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#fbbf24';
      case 'active': return '#10b981';
      case 'completed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="elections-list">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading elections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="elections-list">
      <div className="elections-header">
        <h1>All Elections</h1>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredElections.length === 0 ? (
        <div className="no-elections">
          <h3>No elections found</h3>
          <p>{filter === 'all' ? 'There are no elections available at the moment.' : `No ${filter} elections found.`}</p>
          {user?.role === 'admin' && (
            <Link to="/create-election" className="btn primary">
              Create First Election
            </Link>
          )}
        </div>
      ) : (
        <div className="elections-grid">
          {filteredElections.map(election => (
            <div key={election._id} className="election-card-full">
              <div className="election-header">
                <h3>{election.title}</h3>
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(election.status) }}
                >
                  {election.status}
                </span>
              </div>

              <p className="election-description">{election.description}</p>

              <div className="election-meta">
                <div className="meta-item">
                  <strong>Created by:</strong> {election.createdBy.name}
                </div>
                <div className="meta-item">
                  <strong>Candidates:</strong> {election.candidates.length}
                </div>
                <div className="meta-item">
                  <strong>Start:</strong> {new Date(election.startDate).toLocaleDateString()}
                </div>
                <div className="meta-item">
                  <strong>End:</strong> {new Date(election.endDate).toLocaleDateString()}
                </div>
              </div>

              <div className="election-actions">
                <Link to={`/election/${election._id}`} className="btn secondary">
                  View Details
                </Link>
                {election.status === 'active' && !election.voters.includes(user?.id) && (
                  <Link to={`/election/${election._id}/vote`} className="btn success">
                    Vote Now
                  </Link>
                )}
                <Link to={`/election/${election._id}/results`} className="btn info">
                  View Results
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ElectionsList;
