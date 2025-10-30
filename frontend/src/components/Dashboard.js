import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [elections, setElections] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get('/api/elections');
        setElections(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchElections();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>College Election Portal</h1>
        <div className="user-info">
          <span>Welcome, {user.name} ({user.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-actions">
          {user.role === 'admin' && (
            <Link to="/create-election" className="action-btn primary">
              Create New Election
            </Link>
          )}
          <Link to="/elections" className="action-btn secondary">
            View All Elections
          </Link>
        </div>

        <div className="elections-section">
          <h2>Active Elections</h2>
          {elections.length === 0 ? (
            <div className="no-elections">
              <p>No elections available at the moment.</p>
              {user.role === 'admin' && (
                <p>Create your first election to get started!</p>
              )}
            </div>
          ) : (
            <div className="elections-grid">
              {elections.map(election => (
                <div key={election._id} className="election-card">
                  <div className="election-header">
                    <h3>{election.title}</h3>
                    <span className={`status ${election.status}`}>
                      {election.status}
                    </span>
                  </div>
                  <p className="election-description">{election.description}</p>
                  <div className="election-meta">
                    <span>Created by: {election.createdBy.name}</span>
                    <span>Candidates: {election.candidates.length}</span>
                  </div>
                  <div className="election-actions">
                    <Link to={`/election/${election._id}`} className="btn primary">
                      View Details
                    </Link>
                    {election.status === 'active' && (
                      <Link to={`/election/${election._id}/vote`} className="btn success">
                        Vote Now
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
