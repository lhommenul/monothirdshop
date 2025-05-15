// Types communs pour l'ensemble de l'application
export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface MediaAnnotation {
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

export interface PurchaseLink {
  vendor: string;
  url: string;
  price: number;
  currency: string;
  isAffiliate: boolean;
}

export type DifficultyLevel = 'easy' | 'moderate' | 'hard' | 'expert';
export type UserRole = 'user' | 'author' | 'translator' | 'moderator' | 'admin';
export type VehicleType = 'electric' | 'combustion' | 'hybrid';
export type TutorialStatus = 'draft' | 'published' | 'archived';
export type TranslationStatus = 'draft' | 'published';
