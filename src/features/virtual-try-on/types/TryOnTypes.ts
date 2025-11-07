// filepath: src/features/virtual-try-on/types/TryOnTypes.ts
export interface ImageData {
  base64: string;
  mimeType: string;
}

export enum GenerationMode {
  PRODUCT_TO_MODEL = "PRODUCT_TO_MODEL",
  MODEL_TO_MODEL = "MODEL_TO_MODEL",
}

export enum PoseOption {
  ORIGINAL = "original",
  SELFIE = "selfie",
  STANDING = "standing",
  CASUAL = "casual",
  PROFESSIONAL = "professional",
  WALKING = "walking",
}

export enum BackgroundScene {
  ORIGINAL = "original",
  STUDIO = "studio",
  PARTY = "party",
  COFFEE_DATE = "coffee_date",
  RESTAURANT = "restaurant",
  OUTDOOR = "outdoor",
  URBAN = "urban",
}

export enum ServiceType {
  CLOTHING = "clothing",
  HAIRSTYLE = "hairstyle",
  NAILS = "nails",
  MAKEUP = "makeup",
}

export interface GenerationResult {
  image: string | null;
  text: string | null;
}

export interface ProcessTryOnParams {
  targetImage: ImageData; // User/model image
  sourceImage: ImageData; // Product image
  mode: GenerationMode;
  logoImage?: ImageData;
  maskImage?: ImageData;
  serviceType?: ServiceType;
  stylePrompt?: string;
  fitPrompt?: string;
  pose?: PoseOption;
  background?: BackgroundScene;
}
