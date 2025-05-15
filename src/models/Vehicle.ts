import mongoose, { Schema, model } from 'mongoose';
import { Vehicle, VehicleVariant, VehicleSystem } from '../types/Vehicle';

const VehicleVariantSchema = new Schema<VehicleVariant>({
  name: String,
  engineType: String,
  trimLevel: String
});

const VehicleSystemSchema = new Schema<VehicleSystem>({
  name: String,
  components: [{ type: Schema.Types.ObjectId, ref: 'Component' }]
});

const MaintenanceScheduleSchema = new Schema({
  interval: String,
  tasks: [String]
});

const VehicleSchema = new Schema<Vehicle>({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true },
  year: { type: Number, required: true, index: true },
  vehicleType: {
    type: String,
    enum: ['electric', 'combustion', 'hybrid'],
    required: true
  },
  variants: [VehicleVariantSchema],
  systems: [VehicleSystemSchema],
  maintenanceSchedules: [MaintenanceScheduleSchema],
  commonIssues: [String],
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pour mettre à jour la date de modification
VehicleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index composé pour les recherches efficaces
VehicleSchema.index({ make: 1, model: 1, year: 1 });

// Méthodes statiques
VehicleSchema.statics.getAllMakes = async function() {
  return this.distinct('make').sort();
};

VehicleSchema.statics.getModelsByMake = async function(make: string) {
  return this.distinct('model', { make }).sort();
};

VehicleSchema.statics.getYearsByMakeAndModel = async function(make: string, model: string) {
  const results = await this.find({ make, model })
    .distinct('year');
  return results.sort((a, b) => b - a); // Tri descendant
};

export default model<Vehicle>('Vehicle', VehicleSchema);
