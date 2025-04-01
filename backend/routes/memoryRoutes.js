const express = require('express');
const { saveGameData, getGameHistory } = require('../controllers/memoryController');
const router = express.Router();

router.post('/save', saveGameData);
router.get('/history', getGameHistory); // Esta linha deve existir

module.exports = router;