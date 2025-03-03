import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Container } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/Home";
import WordInput from "./components/WordInput";
import ImageReview from "./components/ImageReview";
import GameBoard from "./components/GameBoard";
import { GameSize, WordImagePair } from "./types";
import { searchImages } from "./services/pixabayService";
import useGameLogic from "./hooks/useGameLogic";

const theme = createTheme({
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#f50057" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

const GameContent: React.FC = () => {
  const [gameSize, setGameSize] = useState<GameSize | null>(null);
  const [pairs, setPairs] = useState<WordImagePair[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    cards,
    flippedCards,
    matchedPairs,
    moves,
    gameCompleted,
    handleCardClick,
    resetGame,
  } = useGameLogic(pairs);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = location.pathname;
      if (path === '/') {
        setGameSize(null);
        setPairs([]);
      } else if (path === '/input') {
        // Keep gameSize
      } else if (path === '/review') {
        // Keep pairs
      } else if (path === '/play') {
        // Keep game state
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location]);

  const handleGameSizeSelect = (size: GameSize) => {
    setGameSize(size);
    navigate('/input');
  };

  const handleWordsSubmit = async (words: string[]) => {
    const newPairs: WordImagePair[] = [];
    for (let i = 0; i < words.length; i++) {
      const images = await searchImages(words[i]);
      if (images.length > 0) {
        newPairs.push({
          word: words[i],
          imageUrl: images[0].webformatURL,
          pairId: i,
          imageCredit: {
            user: images[0].user,
            pageUrl: images[0].pageURL,
          },
        });
      }
    }
    setPairs(newPairs);
    navigate('/review');
  };

  const handleRegenerateImage = (pairId: number, newImageUrl: string, newCredit: { user: string; pageUrl: string }) => {
    console.log('=== Starting image update in App ===');
    console.log('Current pairs:', pairs);
    console.log('Updating pair:', pairId);
    console.log('New image URL:', newImageUrl);
    console.log('New credit:', newCredit);

    if (!newImageUrl) {
      console.error('No URL provided for image update');
      return;
    }

    // Add cache-busting parameter to the image URL
    const timestamp = Date.now();
    const imageUrlWithCacheBust = `${newImageUrl}${newImageUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
    console.log('Image URL with cache busting:', imageUrlWithCacheBust);

    // Create a completely new array with the updated image
    const newPairs = pairs.map((pair, index) => {
      if (index === pairId) {
        return {
          ...pair,
          imageUrl: imageUrlWithCacheBust,
          imageCredit: newCredit,
        };
      }
      return { ...pair };
    });

    console.log('Setting new pairs:', newPairs);
    setPairs(newPairs);
    console.log('=== End of image update in App ===');
  };

  const handleGameRestart = () => {
    resetGame();
    setPairs([]);
    setGameSize(null);
    navigate('/');
  };

  const handleStartGame = () => {
    navigate('/play');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg">
      <Routes>
        <Route path="/" element={<Home onGameSizeSelect={handleGameSizeSelect} />} />
        <Route 
          path="/input" 
          element={
            gameSize ? (
              <WordInput gameSize={gameSize} onWordsSubmit={handleWordsSubmit} />
            ) : (
              <Home onGameSizeSelect={handleGameSizeSelect} />
            )
          } 
        />
        <Route 
          path="/review" 
          element={
            <ImageReview 
              pairs={pairs} 
              onConfirm={handleStartGame}
              onRegenerateImage={handleRegenerateImage}
              onBack={handleBack}
            />
          } 
        />
        <Route 
          path="/play" 
          element={
            <GameBoard
              cards={cards}
              flippedCards={flippedCards}
              matchedPairs={matchedPairs}
              moves={moves}
              gameCompleted={gameCompleted}
              onCardClick={handleCardClick}
              onRestart={handleGameRestart}
              onBack={handleBack}
            />
          } 
        />
      </Routes>
    </Container>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <GameContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
