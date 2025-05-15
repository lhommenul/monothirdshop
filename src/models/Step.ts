import { Schema, model } from 'mongoose';
import type { Step, StepImage, StepVideo, StepTranslation } from '../types/Step';

const AnnotationSchema = new Schema({
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  description: String
});

const StepImageSchema = new Schema<StepImage>({
  url: String,
  caption: String,
  annotations: [AnnotationSchema]
});

const StepVideoSchema = new Schema<StepVideo>({
  url: String,
  caption: String
});

const StepTranslationSchema = new Schema<StepTranslation>({
  language: String,
  title: String,
  description: String,
  warnings: [String],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  translator: { type: Schema.Types.ObjectId, ref: 'User' }
});

const StepSchema = new Schema<Step>({
  tutorial: { type: Schema.Types.ObjectId, ref: 'Tutorial', required: true },
  orderNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  warnings: [String],
  images: [StepImageSchema],
  videos: [StepVideoSchema],
  translations: [StepTranslationSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pour mettre à jour la date de modification
StepSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index composé pour l'ordre des étapes dans un tutoriel
StepSchema.index({ tutorial: 1, orderNumber: 1 }, { unique: true });

export default model<Step>('Step', StepSchema);
