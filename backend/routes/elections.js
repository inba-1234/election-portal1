const express = require("express");
const Election = require("../models/Election");
const Candidate = require("../models/Candidate");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all elections
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find()
      .populate("candidates")
      .populate("createdBy", "name");

    // controller
    const now = new Date();
    for (const election of elections) {
      let newStatus = election.status;
      if (now >= election.startDate && now <= election.endDate) {
        newStatus = "active";
      } else if (now > election.endDate) {
        newStatus = "completed";
      } else {
        newStatus = "upcoming";
      }
      if (newStatus !== election.status) {
        election.status = newStatus;
        await election.save();
      }
    }

    res.json(elections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single election by ID
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate("candidates")
      .populate("createdBy", "name");
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.json(election);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create election (admin only)
router.post("/", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  const { title, description, startDate, endDate } = req.body;
  try {
    const election = new Election({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id,
    });
    await election.save();
    res.status(201).json(election);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Register as candidate
router.post("/:id/candidate", auth, async (req, res) => {
  // Only admins can register candidates
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Access denied" });
  const { name, description } = req.body;
  try {
    const election = await Election.findById(req.params.id);
    if (!election)
      return res.status(404).json({ message: "Election not found" });
    const candidate = new Candidate({
      name,
      description,
      election: req.params.id,
      user: req.user.id,
    });
    await candidate.save();
    election.candidates.push(candidate._id);
    await election.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get candidates for election
router.get("/:id/candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find({
      election: req.params.id,
    }).populate("user", "name");
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
