import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserBadge, UserTranslation } from '../types/User';

const UserBadgeSchema = new Schema<UserBadge>({
  name: String,
  description: String,
  awardedAt: { type: Date, default: Date.now }
});

const UserTranslationSchema = new Schema<UserTranslation>({
  tutorial: { type: Schema.Types.ObjectId, ref: 'Tutorial' },
  language: String
});

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: String,
  bio: String,
  location: String,
  roles: [{
    type: String,
    enum: ['user', 'author', 'translator', 'moderator', 'admin'],
    default: ['user']
  }],
  reputation: { type: Number, default: 0 },
  badges: [UserBadgeSchema],
  tutorialsCreated: [{ type: Schema.Types.ObjectId, ref: 'Tutorial' }],
  tutorialsTranslated: [UserTranslationSchema],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  savedTutorials: [{ type: Schema.Types.ObjectId, ref: 'Tutorial' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pour hashage du mot de passe
UserSchema.pre('save', async function(next) {
  this.updatedAt = new Date();

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir le profil public
UserSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.email;
  return user;
};

// Index
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ reputation: -1 });

export default model<User>('User', UserSchema);
