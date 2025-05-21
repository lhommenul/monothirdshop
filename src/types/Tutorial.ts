import mongoose from 'mongoose';
import type { DifficultyLevel, TutorialStatus } from './index';

export interface TutorialDuration {
  value: number;
  unit: 'minutes' | 'hours';
}

export interface TutorialTranslation {
  language: string;
  title: string;
  introduction: string;
  status: 'draft' | 'published';
  translator: mongoose.Types.ObjectId;
}

export interface Tutorial {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  introduction: string;
  difficulty: DifficultyLevel;
  duration: TutorialDuration;
  vehicle: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  requiredTools: mongoose.Types.ObjectId[];
  requiredParts: mongoose.Types.ObjectId[];
  status: TutorialStatus;
  publishedAt?: Date;
  featuredImage?: string;
  views: number;
  likes: number;
  steps: mongoose.Types.ObjectId[];
  translations: TutorialTranslation[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TutorialInput {
  title: string;
  introduction: string;
  difficulty: DifficultyLevel;
  duration: TutorialDuration;
  vehicleId: mongoose.Types.ObjectId | string;
  requiredTools?: (mongoose.Types.ObjectId | string)[];
  requiredParts?: (mongoose.Types.ObjectId | string)[];
  status?: TutorialStatus;
  featuredImage?: string;
  tags?: string[];
}

export interface TutorialFilterParams {
  make?: string;
  model?: string;
  year?: number;
  vehicleId?: string;
  difficulty?: DifficultyLevel;
  author?: string;
  status?: TutorialStatus;
  search?: string;
  tags?: string[];
}

export interface TutorialPopulated extends Omit<Tutorial, 'vehicle' | 'author' | 'requiredTools' | 'requiredParts'> {
  vehicle: {
    _id: mongoose.Types.ObjectId;
    make: string;
    model: string;
    year: number;
  };
  author: {
    _id: mongoose.Types.ObjectId;
    username: string;
    profileImage?: string;
  };
  requiredTools: {
    _id: mongoose.Types.ObjectId;
    name: string;
    image?: string;
  }[];
  requiredParts: {
    _id: mongoose.Types.ObjectId;
    name: string;
    reference?: string;
  }[];
}
