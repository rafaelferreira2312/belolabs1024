import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Button, Modal, Typography } from "@mui/material"; // Modal is imported here from MUI
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { useSpring, animated } from "@react-spring/web";
import background from "../assets/images/mode1.gif";
import bgMusic from "../assets/audio/memory-bg.mp3";
import axios from "axios";

const defaultDifficulty = "Easy";

// Card Images
const cardImages = [
  { id: 1, image: "/images/meteor.png" },
  { id: 2, image: "/images/meteor.png" },
  { id: 3, image: "/images/comet.png" },
  { id: 4, image: "/images/comet.png" },
];

// Audio files for matching and final congratulation
const matchAudioFiles = [
  "/audio/wonderful.mp3",
];

const congratsAudio = "/audio/congrats.mp3";

// Shuffle Logic
const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const calculateScore = (gameData) => {
  return 1000 - (gameData.failed * 10) - (gameData.timeTaken * 2);
};

const saveGameData = async (gameData) => {
  try {
    console.log("Enviando dados para o backend:", gameData); // Adicione este log
    const payload = {
      playerName: localStorage.getItem("username") || "Guest",
      level: defaultDifficulty,
      time: gameData.timeTaken,
      moves: gameData.failed,
      score: calculateScore(gameData),
      date: new Date()
    };

    const response = await axios.post("http://localhost:5000/api/memory/save", payload, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Game data saved successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving game data:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// No MemoryEasy.jsx, atualize a chamada para saveGameData:
const handleSaveGame = async () => {
  try {
    const result = await saveGameData({
      playerName: localStorage.getItem("username") || "Guest", // Adicione isso
      level: "Easy", // Ou o nível correto
      time: timer,
      moves: failedAttempts, // Ou o campo correto para movimentos
      score: calculateScore(), // Implemente essa função se necessário
      date: new Date() // Opcional, pois o backend já adiciona
    });
    console.log("Resultado do salvamento:", result);
  } catch (error) {
    console.error("Erro ao salvar:", error);
  }
};

// Styled Components
const StyledGameContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
}));

const PixelButton = styled(Box)(({ theme }) => ({
  display: "inline-block",
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",

  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const PixelBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "10%",
  left: "1%",
  backgroundColor: "#ff4d4f",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
  marginBottom: "10px",
}));

const PixelTimerBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: "5%",
  left: "1%",
  backgroundColor: "#2c2c54",
  color: "#fff",
  padding: "10px 20px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "12px",
  textAlign: "center",
}));

const CardContainer = styled(Box)({
  perspective: "1000px",
  cursor: "pointer",
  width: "220px",
  height: "220px",
});

const CardInner = styled(animated.div)({
  position: "relative",
  width: "100%",
  height: "100%",
  transformStyle: "preserve-3d",
  transition: "transform 0.6s",
});

const CardFront = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "80%",
  height: "80%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  transform: "rotateY(180deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const CardBack = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "90%",
  height: "90%",
  backfaceVisibility: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "8px",
  transform: "rotateY(0deg)",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
});

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#2c2c54',
  border: '2px solid #00d9ff',
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px',
};

const PixelTypography = styled(Typography)(({ theme }) => ({
  fontFamily: '"Press Start 2P", cursive',
  fontSize: '24px',
  color: '#fff',
  letterSpacing: '1px',
  textShadow: `
    -1px -1px 0 #ff0000,  
    1px -1px 0 #ff7f00, 
    1px 1px 0 #ffd700, 
    -1px 1px 0 #ff4500`,
}));

const PixelButtonModal = styled(Button)(({ theme }) => ({
  backgroundColor: "#2c2c54",
  color: "#fff",
  fontFamily: '"Press Start 2P", cursive',
  fontSize: "14px",
  padding: "15px 30px",
  border: "2px solid #00d9ff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  cursor: "pointer",
  textAlign: "center",
  transition: "transform 0.2s, background-color 0.2s, box-shadow 0.2s",
  "&:hover": {
    backgroundColor: "#40407a",
    borderColor: "#00aaff",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
}));

// Card Component
const Card = ({ card, handleClick, flipped, matched }) => {
  const { transform } = useSpring({
    transform: flipped || matched ? "rotateY(180deg)" : "rotateY(0deg)",
    config: { tension: 500, friction: 30 },
  });

  return (
    <CardContainer onClick={handleClick}>
      <CardInner style={{ transform }}>
        <CardFront>
          <img src={card.image} alt="Card front" style={{ width: "140%", height: "140%" }} />
        </CardFront>
        <CardBack>
          <img src="/images/Back2.png" alt="Card back" style={{ width: "120%", height: "120%" }} />
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
  flipped: PropTypes.bool.isRequired,
  matched: PropTypes.bool.isRequired,
};

const MemoryEasy = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [initialReveal, setInitialReveal] = useState(true);
  const [musicStarted, setMusicStarted] = useState(false);
  const [mouseDisabled, setMouseDisabled] = useState(false);
  const [bgVolume] = useState(parseInt(localStorage.getItem("bgVolume"), 10) || 0);
  const [sfxVolume] = useState(parseInt(localStorage.getItem("sfxVolume"), 10) || 0);
  const [audioIndex, setAudioIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef(null);

  const playAudio = (audioFile) => {
    if (!userInteracted) return;
    const audio = new Audio(audioFile);
    audio.volume = sfxVolume / 100;
    audio.play().catch(e => console.log('Audio play prevented:', e));
  };

  const handleSaveNewGame = async () => {
    setIsSaving(true);
    try {
      await saveGameData({
        timeTaken: timer,
        failed: failedAttempts,
        completed: matchedCards.length === cards.length ? 1 : 0
      });
    } catch (error) {
      console.error("Failed to save game:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewGame = () => {
    setCards(shuffleArray(cardImages));
    setMatchedCards([]);
    setFlippedCards([]);
    setFailedAttempts(0);
    setTimer(0);
    setTimerActive(false);
    setInitialReveal(true);
    setAudioIndex(0);

    setMouseDisabled(true);
    setTimeout(() => {
      setMouseDisabled(false);
    }, 2000);

    setTimeout(() => {
      setInitialReveal(false);
      setTimerActive(true);
    }, 1500);
  };

  const handleBackButton = () => {
    setOpenModal(true);
  };

  const handleModalYes = () => {
    setOpenModal(false);
    localStorage.removeItem("gameCompleted");
    navigate("/play");
  };

  const handleModalNo = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    handleNewGame();
    const handleFirstClick = () => {
      if (!musicStarted && audioRef.current) {
        audioRef.current.volume = bgVolume / 100;
        audioRef.current.play().catch((error) => console.error("Audio play error:", error));
        setMusicStarted(true);
      }
    };
    document.addEventListener("click", handleFirstClick);

    return () => document.removeEventListener("click", handleFirstClick);
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener('click', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      setTimeout(() => {
        if (card1.image === card2.image) {
          setMatchedCards((prev) => [...prev, card1.id, card2.id]);
          if (audioIndex < matchAudioFiles.length) {
            playAudio(matchAudioFiles[audioIndex]);
            setAudioIndex(audioIndex + 1);
          }
        } else {
          setFailedAttempts((prev) => prev + 1);
        }
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, audioIndex]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0 && !localStorage.getItem("gameCompleted")) {
      playAudio(congratsAudio);
      setTimerActive(false);

      const saveData = async () => {
        try {
          await saveGameData({
            timeTaken: timer,
            failed: failedAttempts,
            completed: 1
          });
          localStorage.setItem("gameCompleted", "true");
          setTimeout(() => navigate("/congt-easy"), 2000);
        } catch (error) {
          console.error("Error saving game data:", error);
        }
      };

      saveData();
    }
  }, [matchedCards, cards.length, navigate, failedAttempts, timer]);

  const handleCardClick = (card) => {
    if (mouseDisabled) return;
    if (!matchedCards.includes(card.id) && flippedCards.length < 2 && !flippedCards.some((c) => c.id === card.id)) {
      setFlippedCards((prev) => [...prev, card]);
    }
  };

  const userID = localStorage.getItem("userID");
  if (!userID) {
    console.error("Error: userID is missing.");
    return null;
  }

  return (
    <StyledGameContainer style={{ pointerEvents: mouseDisabled ? 'none' : 'auto' }}>
      <audio ref={audioRef} src={bgMusic} loop />
      <PixelButton onClick={handleBackButton} sx={{ alignSelf: "flex-start", margin: 2 }}>
        Back
      </PixelButton>
      <PixelTimerBox>Timer: {timer}s</PixelTimerBox>
      <PixelBox>Learning Moments: {failedAttempts}</PixelBox>
      <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '90vw', margin: '0 auto' }}>
        {cards.map((card) => (
          <Grid item xs={6} sm={4} md={3} key={card.id}>
            <Card
              card={card}
              handleClick={() => handleCardClick(card)}
              flipped={
                initialReveal ||
                flippedCards.some((c) => c.id === card.id) ||
                matchedCards.includes(card.id)
              }
              matched={matchedCards.includes(card.id)}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <PixelButton 
          onClick={() => { handleSaveNewGame(); handleNewGame(); }} 
          sx={{ mt: 2 }}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'New Game'}
        </PixelButton>
      </Box>

      <Modal 
        open={openModal} 
        onClose={handleModalNo}
        aria-labelledby="confirmation-modal"
        aria-describedby="confirmation-modal-description"
      >
        <Box sx={modalStyle}>
          <PixelTypography variant="h6" id="confirmation-modal">
            Are you sure you want to go back to the play page?
          </PixelTypography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 2 }}>
            <PixelButtonModal 
              onClick={() => { handleSaveNewGame(); handleModalYes(); }} 
              variant="contained" 
              color="primary"
            >
              Yes
            </PixelButtonModal>
            <PixelButtonModal onClick={handleModalNo} variant="contained" color="secondary">
              No
            </PixelButtonModal>
          </Box>
        </Box>
      </Modal>
    </StyledGameContainer>
  );
};

export default MemoryEasy;