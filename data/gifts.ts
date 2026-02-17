
import { Gift } from '../types';

export const allGifts: Gift[] = [
  { id: 'gift-1', name: 'Букет', cost: 4.99, rating: 5, icon: '💐' },
  { id: 'gift-5', name: 'Серце', cost: 8.99, rating: 10, icon: '❤️' },
  { id: 'gift-4', name: 'Ракета', cost: 22.99, rating: 25, icon: '🚀' },
  { id: 'gift-2', name: 'Діамант', cost: 42.99, rating: 50, icon: '💎' },
  { id: 'gift-3', name: 'Золота Корона', cost: 89.99, rating: 100, icon: '👑' },
  { id: 'gift-6', name: 'Супернова', cost: 129.99, rating: 200, icon: '🌟' },
  { id: 'gift-7', name: 'Галактика', cost: 199.99, rating: 500, icon: '🌌' },
].sort((a, b) => a.cost - b.cost);
