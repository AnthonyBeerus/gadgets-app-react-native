// filepath: src/features/virtual-try-on/store/tryOnStore.ts
import { create } from "zustand";
import { Tables } from "../../../types/database.types";
import { ImageData, GenerationMode } from "../types/TryOnTypes";

interface TryOnState {
  selectedProduct: Tables<"product"> | null;
  userImage: string | null; // Base64
  resultImage: string | null; // Generated image
  isProcessing: boolean;
  error: string | null;
  mode: GenerationMode;
  stylePrompt?: string;
  fitPrompt?: string;
  setSelectedProduct: (product: Tables<"product">) => void;
  setUserImage: (image: string) => void;
  setResultImage: (image: string) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  setMode: (mode: GenerationMode) => void;
  setStylePrompt: (prompt?: string) => void;
  setFitPrompt: (prompt?: string) => void;
  reset: () => void;
}

export const useTryOnStore = create<TryOnState>((set) => ({
  selectedProduct: null,
  userImage: null,
  resultImage: null,
  isProcessing: false,
  error: null,
  mode: GenerationMode.PRODUCT_TO_MODEL,
  stylePrompt: undefined,
  fitPrompt: undefined,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setUserImage: (image) => set({ userImage: image }),
  setResultImage: (image) => set({ resultImage: image }),
  setProcessing: (processing) => set({ isProcessing: processing }),
  setError: (error) => set({ error }),
  setMode: (mode) => set({ mode }),
  setStylePrompt: (prompt) => set({ stylePrompt: prompt }),
  setFitPrompt: (prompt) => set({ fitPrompt: prompt }),
  reset: () =>
    set({
      selectedProduct: null,
      userImage: null,
      resultImage: null,
      isProcessing: false,
      error: null,
      mode: GenerationMode.PRODUCT_TO_MODEL,
      stylePrompt: undefined,
      fitPrompt: undefined,
    }),
}));
