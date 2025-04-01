const GameResult = require('../models/save');

// Save game data
exports.saveGameData = async (req, res) => {
  try {
    const { playerName, level, time, moves, score } = req.body;

    // Validate required fields
    if (!playerName || !level || !time || !moves || !score) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const newGameResult = new GameResult({
      playerName,
      level,
      time,
      moves,
      score,
      date: new Date()
    });

    await newGameResult.save();

    res.status(201).json({
      success: true,
      data: newGameResult
    });
  } catch (error) {
    console.error('Error saving game data:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get game history
exports.getGameHistory = async (req, res) => {
  try {
    const history = await GameResult.find()
      .sort({ date: -1 }) // Most recent first
      .limit(10); // Limit to 10 results

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    console.error('Error fetching game history:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};