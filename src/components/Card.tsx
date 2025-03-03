import React from 'react';
import { Card as CardType } from '../types';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  isMatched: boolean;
  isSetupPhase?: boolean;
  onClick: () => void;
  onRegenerate?: (cardId: number) => void;
}

const Card: React.FC<CardProps> = ({ 
  card, 
  isFlipped, 
  isMatched, 
  isSetupPhase = false,
  onClick, 
  onRegenerate 
}) => {
  return (
    <Box
      sx={{
        perspective: '1000px',
        cursor: isMatched ? 'default' : 'pointer',
        width: { xs: '140px', sm: '160px', md: '180px', lg: '200px' },
        height: { xs: '180px', sm: '200px', md: '220px', lg: '240px' },
        m: 1,
        transform: isMatched ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease',
        position: 'relative',
      }}
      onClick={!isMatched ? onClick : undefined}
    >
      <Paper
        elevation={isMatched ? 8 : 2}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          backgroundColor: isMatched ? '#e3f2fd' : '#fff',
          '&:hover': {
            elevation: isMatched ? 8 : 4,
          },
        }}
      >
        {/* Front of card */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: 1,
          }}
        >
          <Typography variant="h3" color="primary">
            ?
          </Typography>
        </Box>

        {/* Back of card */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            backgroundColor: '#fff',
            borderRadius: 1,
          }}
        >
          {card.type === 'image' ? (
            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
              <Box
                component="img"
                src={card.value}
                alt="Card"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
              {isSetupPhase && onRegenerate && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegenerate(card.id);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              )}
            </Box>
          ) : (
            <Typography 
              variant="h4" 
              align="center"
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem', lg: '2rem' },
                wordBreak: 'break-word',
              }}
            >
              {card.value}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Card;
