export interface Card {
  id: number;
  type: 'word' | 'image';
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: number;
}

export interface GameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number[];
  moves: number;
  gameStarted: boolean;
  gameCompleted: boolean;
}

export type GameSize = 4 | 6 | 8 | 10;

export interface WordImagePair {
  word: string;
  imageUrl: string;
  pairId: number;
  imageCredit?: {
    user: string;
    pageUrl: string;
  };
}

export interface ImageCredit {
  user: string;
  pageUrl: string;
}

export interface PixabayImage {
  id: number;
  webformatURL: string;
  previewURL: string;
  tags: string;
  user: string;
  pageURL: string;
}
