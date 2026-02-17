
import { User, Gift, Message } from '../types';
import { ukrainianCities } from './cities';

const existingMockUsers: User[] = [
  {
    id: 'user-2',
    login: 'alina.p',
    name: 'Alina Petrova',
    avatarUrl: 'https://picsum.photos/seed/alina/200',
    location: 'Київ',
    rating: 0,
    likesReceived: 120,
    giftsReceived: [
      { id: 'gift-3', name: 'Золота Корона', cost: 1000, rating: 100, icon: '👑' }
    ],
    likesGiven: 0,
    likeTimestamps: {},
    passiveRating: 22,
  },
  {
    id: 'user-3',
    login: 'dmytro.k',
    name: 'Dmytro Kovalenko',
    avatarUrl: 'https://picsum.photos/seed/dmytro/200',
    location: 'Київ',
    rating: 0,
    likesReceived: 95,
    giftsReceived: [
        { id: 'gift-2', name: 'Діамант', cost: 500, rating: 50, icon: '💎' }
    ],
    likesGiven: 0,
    likeTimestamps: {},
    passiveRating: 18,
  },
  {
    id: 'user-4',
    login: 'olena.i',
    name: 'Olena Ivanova',
    avatarUrl: 'https://picsum.photos/seed/olena/200',
    location: 'Київ',
    rating: 0,
    likesReceived: 88,
    giftsReceived: [],
    likesGiven: 0,
    likeTimestamps: {},
    passiveRating: 16,
  },
  {
    id: 'user-5',
    login: 'sergiy.b',
    name: 'Sergiy Boyko',
    avatarUrl: 'https://picsum.photos/seed/sergiy/200',
    location: 'Львів',
    rating: 0,
    likesReceived: 72,
    giftsReceived: [],
    likesGiven: 0,
    likeTimestamps: {},
    passiveRating: 0,
  },
  {
    id: 'user-6',
    login: 'kateryna.s',
    name: 'Kateryna Shevchenko',
    avatarUrl: 'https://picsum.photos/seed/kateryna/200',
    location: 'Київ',
    rating: 0,
    likesReceived: 30,
    giftsReceived: [],
    likesGiven: 0,
    likeTimestamps: {},
    passiveRating: 0,
  },
  {
    id: 'user-7',
    login: 'andriy.m',
    name: 'Andriy Melnyk',
    avatarUrl: 'https://picsum.photos/seed/andriy/200',
    location: 'Київ',
    rating: 0,
    likesReceived: 50,
    giftsReceived: [],
    likesGiven: 0,
    likeTimestamps: {},
    passiveRating: 0,
  },
];

const testikUsers: User[] = ukrainianCities.map(city => ({
  id: `user-testik-${city.toLowerCase().replace(/[^a-zа-яїієґ0-9]/gi, '')}`,
  login: `testik_${city.toLowerCase().replace(/[^a-zа-яїієґ0-9]/gi, '')}`,
  name: 'Тестик',
  avatarUrl: 'https://picsum.photos/seed/testik/200',
  location: city,
  rating: 0, // This is calculated dynamically
  likesReceived: 0,
  giftsReceived: [],
  likesGiven: 0,
  likeTimestamps: {},
  // Base rating is 1(name)+1(age)+20(location) = 22. To make it 1, passiveRating must be -21.
  passiveRating: -21, 
  age: 101,
  hobbies: [],
  aboutMe: '',
  relationshipStatus: '',
}));


export const mockUsers: User[] = [...existingMockUsers, ...testikUsers];


export const mockGifts: Gift[] = [
  { id: 'gift-1', name: 'Букет', cost: 4.99, rating: 5, icon: '💐' },
  { id: 'gift-2', name: 'Діамант', cost: 42.99, rating: 50, icon: '💎' },
  { id: 'gift-3', name: 'Золота Корона', cost: 89.99, rating: 100, icon: '👑' },
  { id: 'gift-4', name: 'Ракета', cost: 22.99, rating: 25, icon: '🚀' },
  { id: 'gift-5', name: 'Серце', cost: 8.99, rating: 10, icon: '❤️' },
];

export const mockMessages: Message[] = [
    { id: 'msg-1', senderId: 'user-3', receiverId: 'user-2', text: 'Привіт, як справи?', timestamp: Date.now() - 2 * 60 * 60 * 1000 },
    { id: 'msg-2', senderId: 'user-2', receiverId: 'user-3', text: 'Привіт! Все добре, дякую. Як ти?', timestamp: Date.now() - 1 * 60 * 60 * 1000 },
    { id: 'msg-3', senderId: 'user-3', receiverId: 'user-2', text: 'Теж непогано. Бачив тебе в топі рейтингу, вітаю!', timestamp: Date.now() - 30 * 60 * 1000 },
    { id: 'msg-4', senderId: 'user-5', receiverId: 'user-2', text: 'Привіт, ти з Києва?', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000 },
];