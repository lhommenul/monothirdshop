import mongoose, { Schema, model } from 'mongoose';
import { Tutorial, TutorialDuration, TutorialTranslation } from '../types/Tutorial';
import { generateSlug } from '../utils/helpers';

const TutorialDurationSchema = new Schema<TutorialDuration>({
  value: Number,
  unit: { type: String, enum: ['minutes', 'hours'], default: 'minutes' }
});

const TutorialTranslationSchema = new Schema<TutorialTranslation>({
  language: String,
  title: String,
  introduction: String,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  translator: { type: Schema.Types.ObjectId, ref: 'User' }
});

const TutorialSchema = new Schema<Tutorial>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  introduction: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'hard', 'expert'],
    required: true
  },
  duration: TutorialDurationSchema,
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  requiredTools: [{ type: Schema.Types.ObjectId, ref: 'Tool' }],
  requiredParts: [{ type: Schema.Types.ObjectId, ref: 'Part' }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  featuredImage: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  steps: [{ type: Schema.Types.ObjectId, ref: 'Step' }],
  translations: [TutorialTranslationSchema],
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pour générer automatiquement le slug
TutorialSchema.pre('save', async function(next) {
  this.updatedAt = new Date();

  if (this.isNew || this.isModified('title')) {
    let slug = generateSlug(this.title);
    const existingTutorial = await this.constructor.findOne({ slug });

    if (existingTutorial && !this.isNew) {
      // Si c'est une mise à jour et que le slug existe déjà, ne pas le modifier
      return next();
    }

    if (existingTutorial) {
      // Ajouter un identifiant unique si le slug existe déjà
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    this.slug = slug;
  }

  // Mettre à jour la date de publication si on publie le tutoriel
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Index
TutorialSchema.index({ title: 'text', introduction: 'text', tags: 'text' });
TutorialSchema.index({ vehicle: 1 });
TutorialSchema.index({ author: 1 });
TutorialSchema.index({ status: 1 });
TutorialSchema.index({ publishedAt: -1 });

export default model<Tutorial>('Tutorial', TutorialSchema);
