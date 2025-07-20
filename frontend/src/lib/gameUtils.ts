import type { Item } from "../types";

export interface MemoryCard {
  id: number;
  itemId: string;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const createMemoryDeck = (items: Item[], gridSize: number = 16): MemoryCard[] => {
  const neededPairs = gridSize / 2;
  const shuffledItems = [...items].sort(() => 0.5 - Math.random());
  const selectedItems = shuffledItems.slice(0, neededPairs);

  const cardPairs: Omit<MemoryCard, 'id' | 'isFlipped' | 'isMatched'>[] = [];
  selectedItems.forEach(item => {
    cardPairs.push({ itemId: item.itemId, imageUrl: item.imageUrl });
    cardPairs.push({ itemId: item.itemId, imageUrl: item.imageUrl });
  });

  for (let i = cardPairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
  }

  return cardPairs.map((card, index) => ({
    ...card,
    id: index,
    isFlipped: false,
    isMatched: false,
  }));
};