import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CandidateRegistration = () => {
  const { id } = useParams(); // election id
  const [election, setElection] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const res = await axios.get(`/api/elections/${id}`);
        setElection(res.data);
      } catch (err) {
        alert("Election not found");
        navigate("/dashboard");
      }
    };
    // Block non-admins from accessing this page
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser || currentUser.role !== "admin") {
      alert("Only admins can register candidates");
      navigate("/dashboard");
      return;
    }

    fetchElection();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post(`/api/elections/${id}/candidate`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Registered as candidate successfully!");
        navigate(`/election/${id}`);
      } catch (err) {
        alert(err.response?.data?.message || "An error occurred");
      }
    }
  };

  if (!election) return <div>Loading...</div>;

  return (
    <div className="candidate-registration">
      <h2>Register as Candidate</h2>
      <h3>Election: {election.title}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Candidate Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name as candidate"
            className={errors.name ? "error" : ""}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter your manifesto or description"
            rows="4"
          />
        </div>

        <button type="submit" className="btn primary">
          Register as Candidate
        </button>
      </form>
    </div>
  );
};

export default CandidateRegistration;
