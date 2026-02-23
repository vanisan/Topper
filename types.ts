
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
  is_read: boolean;
}

export interface User {
  id:string;
  login: string;
  name: string;
  avatarUrl: string;
  location?: string;
  rating: number; 
  balance: number; 
  likesReceived: number;
  giftsReceived: Gift[];
  likesGiven: number; 
  likeTimestamps: { [userId: string]: number }; 
  passiveRating: number;
  availableLikes: number;
  lastRechargeAt: string;
  birthDate?: string;
  age?: number;
  hobbies?: string[];
  aboutMe?: string;
  relationshipStatus?: string;
  note?: string;
  profileBgColor?: string;
  profileBgEmoji?: string;
}
