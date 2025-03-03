import { useState, useEffect, useCallback } from 'react';
import { Card, WordImagePair } from '../types';
import { shuffleArray } from '../utils/arrayUtils';

type UseGameLogic = (pairs: WordImagePair[], isSetupPhase?: boolean) => {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  moves: number;
  gameCompleted: boolean;
  handleCardClick: (cardId: number) => void;
  resetGame: () => void;
};

const useGameLogic: UseGameLogic = (pairs, isSetupPhase = false) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (pairs.length > 0) {
      const newCards: Card[] = pairs.flatMap((pair) => [
        {
          id: pair.pairId * 2,
          type: 'word' as const,
          value: pair.word,
          isFlipped: isSetupPhase, // Always flipped in setup phase
          isMatched: false,
          pairId: pair.pairId,
        },
        {
          id: pair.pairId * 2 + 1,
          type: 'image' as const,
          value: pair.imageUrl,
          isFlipped: isSetupPhase, // Always flipped in setup phase
          isMatched: false,
          pairId: pair.pairId,
        },
      ]);
      setCards(shuffleArray(newCards));
      setFlippedCards([]);
      setMatchedPairs(0);
      setMoves(0);
      setGameCompleted(false);
    }
  }, [pairs, isSetupPhase]);

  const handleCardClick = useCallback((cardId: number) => {
    if (isSetupPhase) return; // Don't handle clicks during setup phase

    if (flippedCards.length === 2 || cards.find(c => c.id === cardId)?.isMatched) {
      return;
    }

    const clickedCard = cards.find(c => c.id === cardId);
    if (!clickedCard || flippedCards.includes(cardId)) {
      return;
    }

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    setFlippedCards(prev => [...prev, cardId]);

    if (flippedCards.length === 1) {
      setMoves(prev => prev + 1);
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = clickedCard;

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCard.id || card.id === cardId
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          )
        );
        setMatchedPairs(prev => {
          const newMatchedPairs = prev + 1;
          if (newMatchedPairs === pairs.length) {
            setGameCompleted(true);
          }
          return newMatchedPairs;
        });
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard?.id || card.id === cardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, pairs.length, isSetupPhase]);

  const resetGame = useCallback(() => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setGameCompleted(false);
  }, []);

  return {
    cards,
    flippedCards,
    matchedPairs,
    moves,
    gameCompleted,
    handleCardClick,
    resetGame,
  };
};

export default useGameLogic; 