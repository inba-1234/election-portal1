const express = require('express');
const Vote = require('../models/Vote');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');
const crypto = require('crypto-js');

const router = express.Router();

// Note: IPFS client setup assumed, replace with actual IPFS instance
// const ipfs = require('ipfs-http-client')({ host: 'localhost', port: '5001', protocol: 'http' });

// Vote
router.post('/:electionId', auth, async (req, res) => {
  const { candidateId } = req.body;
  try {
    const election = await Election.findById(req.params.electionId);
    if (!election || election.status !== 'active') return res.status(400).json({ message: 'Election not active' });
    if (election.voters.includes(req.user.id)) return res.status(400).json({ message: 'Already voted' });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate || !election.candidates.includes(candidateId)) return res.status(400).json({ message: 'Invalid candidate' });

    // Encrypt vote
    const voteData = JSON.stringify({ candidateId, voterId: req.user.id });
    const encrypted = crypto.AES.encrypt(voteData, 'secret-key').toString();

    // Store on IPFS (mock for now)
    // const result = await ipfs.add(encrypted);
    // const ipfsCid = result.cid.toString();
    const ipfsCid = 'mock-cid-' + Date.now(); // Replace with actual IPFS add

    const vote = new Vote({
      election: req.params.electionId,
      voter: req.user.id,
      candidate: candidateId,
      ipfsCid
    });
    await vote.save();

    election.voters.push(req.user.id);
    await election.save();

    candidate.votes += 1;
    await candidate.save();

    res.status(201).json({ message: 'Vote cast' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get results
router.get('/:electionId/results', async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId).populate('candidates');
    if (!election) return res.status(404).json({ message: 'Election not found' });

    // For real implementation, fetch from IPFS, decrypt, count
    // For now, use candidate.votes
    const results = election.candidates.map(c => ({
      candidate: c.name,
      votes: c.votes
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
