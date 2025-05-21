import mongoose from 'mongoose';
import type { MediaAnnotation } from './index';

export interface StepImage {
  url: string;
  caption: string;
  annotations: MediaAnnotation[];
}

export interface StepVideo {
  url: string;
  caption: string;
}

export interface StepTranslation {
  language: string;
  title: string;
  description: string;
  warnings: string[];
  status: 'draft' | 'published';
  translator: mongoose.Types.ObjectId;
}

export interface Step {
  _id: mongoose.Types.ObjectId;
  tutorial: mongoose.Types.ObjectId;
  orderNumber: number;
  title: string;
  description: string;
  warnings: string[];
  images: StepImage[];
  videos: StepVideo[];
  translations: StepTranslation[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StepInput {
  tutorialId: mongoose.Types.ObjectId | string;
  orderNumber: number;
  title: string;
  description: string;
  warnings?: string[];
  images?: Omit<StepImage, 'annotations'>[];
  videos?: StepVideo[];
}

export interface StepUpdate {
  title?: string;
  description?: string;
  warnings?: string[];
  orderNumber?: number;
  images?: StepImage[];
  videos?: StepVideo[];
}
