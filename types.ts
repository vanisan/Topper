
export interface Gift {
  id: string;
  name: string;
  cost: number; // in UAH
  rating: number;
  icon: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface User {
  id:string;
  login: string;
  name: string;
  avatarUrl: string;
  location?: string;
  rating: number; // This will be calculated on the fly
  likesReceived: number;
  giftsReceived: Gift[];
  likesGiven: number; // Max 3 per day
  likeTimestamps: { [userId: string]: number }; // userId: timestamp
  passiveRating: number;
  // New fields for detailed profile
  age?: number;
  hobbies?: string[];
  aboutMe?: string;
  relationshipStatus?: string;
}