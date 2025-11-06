// filepath: src/features/virtual-try-on/types/TryOnTypes.ts
export interface ImageData {
  base64: string;
  mimeType: string;
}

export enum GenerationMode {
  PRODUCT_TO_MODEL = "PRODUCT_TO_MODEL",
  MODEL_TO_MODEL = "MODEL_TO_MODEL",
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
  stylePrompt?: string;
  fitPrompt?: string;
}
