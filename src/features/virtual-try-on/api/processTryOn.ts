// filepath: src/features/virtual-try-on/api/processTryOn.ts
import { useMutation } from "@tanstack/react-query";
import {
  ImageData,
  GenerationMode,
  ProcessTryOnParams,
} from "../types/TryOnTypes";
import { useTryOnStore } from "../store/tryOnStore";

const processTryOn = async (params: ProcessTryOnParams): Promise<string> => {
  // Use relative fetch - Expo Router handles the origin automatically in development
  // In production, set the origin in app.json plugins > expo-router > origin
  console.log("Making request to /virtual-try-on API route...");

  try {
    const response = await fetch("/virtual-try-on", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Failed to generate image" }));
      console.error("API error:", errorData);
      throw new Error(errorData.error || "Failed to generate image");
    }

    const data = await response.json();
    console.log("API response received, has image:", !!data.image);

    if (!data.image) throw new Error("No image generated");
    return data.image; // Base64 result
  } catch (error) {
    console.error("Fetch error details:", error);
    throw error;
  }
};

export const useProcessTryOn = () => {
  const { setResultImage, setProcessing, setError } = useTryOnStore();

  return useMutation({
    mutationFn: processTryOn,
    onMutate: () => {
      setProcessing(true);
      setError(null);
    },
    onSuccess: (image) => {
      setResultImage(image);
      setProcessing(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setProcessing(false);
    },
  });
};
