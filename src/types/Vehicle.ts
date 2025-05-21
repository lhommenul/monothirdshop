import mongoose from 'mongoose';
import type { VehicleType } from './index';

export interface VehicleVariant {
  name: string;
  engineType: string;
  trimLevel: string;
}

export interface MaintenanceSchedule {
  interval: string;
  tasks: string[];
}

export interface VehicleSystem {
  name: string;
  components: mongoose.Types.ObjectId[];
}

export interface Vehicle {
  _id: mongoose.Types.ObjectId;
  make: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  variants: VehicleVariant[];
  systems: VehicleSystem[];
  maintenanceSchedules: MaintenanceSchedule[];
  commonIssues: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleInput {
  make: string;
  model: string;
  year: number;
  vehicleType: VehicleType;
  variants?: VehicleVariant[];
  systems?: VehicleSystem[];
  maintenanceSchedules?: MaintenanceSchedule[];
  commonIssues?: string[];
  images?: string[];
}

export interface VehicleFilterParams {
  make?: string;
  model?: string;
  year?: number;
  vehicleType?: VehicleType;
}
