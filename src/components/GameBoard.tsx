import React from "react";
import { Box, Typography, Button } from "@mui/material";
import CardComponent from "./Card";
import { Card } from "../types";

interface GameBoardProps {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  gameCompleted: boolean;
  isSetupPhase?: boolean;
  onCardClick: (cardId: number) => void;
  onRestart: () => void;
  onRegenerateImage?: (cardId: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  flippedCards,
  matchedPairs,
  moves,
  gameCompleted,
  isSetupPhase = false,
  onCardClick,
  onRestart,
  onRegenerateImage,
}) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        position: 'relative',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="div">
          Moves: {moves} | Matched Pairs: {matchedPairs}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 2,
          maxWidth: '90vw',
          width: 'fit-content',
          margin: '0 auto',
          flex: '1 1 auto',
          alignContent: 'center',
        }}
      >
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            isFlipped={card.isFlipped || flippedCards.includes(card.id)}
            isMatched={card.isMatched}
            isSetupPhase={isSetupPhase}
            onClick={() => onCardClick(card.id)}
            onRegenerate={onRegenerateImage}
          />
        ))}
      </Box>

      {gameCompleted && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            zIndex: 1000,
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Congratulations! You won in {moves} moves!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onRestart}
            size="large"
          >
            Play Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GameBoard;
