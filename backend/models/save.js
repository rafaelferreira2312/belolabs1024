const mongoose = require('mongoose');

const gameResultSchema = new mongoose.Schema({
  playerName: { 
    type: String, 
    required: true 
  },
  level: { 
    type: String, 
    required: true,
    enum: ['Easy', 'Medium', 'Hard'] // Mantendo consistência com o frontend
  },
  time: { 
    type: Number, 
    required: true 
  },
  moves: { 
    type: Number, 
    required: true 
  },
  score: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  // Campos adicionais que você tinha no seu modelo original
  userID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  failedAttempts: { 
    type: Number, 
    default: 0 
  },
  completed: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('GameResult', gameResultSchema);