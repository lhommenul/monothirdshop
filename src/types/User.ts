import mongoose from 'mongoose';
import { UserRole } from './index';

export interface UserBadge {
  name: string;
  description: string;
  awardedAt: Date;
}

export interface UserTranslation {
  tutorial: mongoose.Types.ObjectId;
  language: string;
}

export interface User {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  roles: UserRole[];
  reputation: number;
  badges: UserBadge[];
  tutorialsCreated: mongoose.Types.ObjectId[];
  tutorialsTranslated: UserTranslation[];
  comments: mongoose.Types.ObjectId[];
  savedTutorials: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  bio?: string;
  location?: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserPublic {
  _id: mongoose.Types.ObjectId;
  username: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  roles: UserRole[];
  reputation: number;
  badges: UserBadge[];
  createdAt: Date;
}
