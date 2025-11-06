// filepath: src/features/virtual-try-on/api/processTryOn.ts
import { useMutation } from "@tanstack/react-query";
import {
  ImageData,
  GenerationMode,
  ProcessTryOnParams,
} from "../types/TryOnTypes";
import { useTryOnStore } from "../store/tryOnStore";
// Use cross-fetch directly to avoid whatwg-fetch polyfill issues
import fetch from "cross-fetch";
import Constants from "expo-constants";

// Get the API URL from Expo dev server
const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    return `http://${host}:8081`;
  }
  return "http://localhost:8081";
};

const processTryOn = async (params: ProcessTryOnParams): Promise<string> => {
  const apiUrl = getApiUrl();
  console.log("Making request to virtual-try-on API route at:", apiUrl);

  try {
    const response = await fetch(`${apiUrl}/virtual-try-on`, {
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
    console.log("Image data type:", typeof data.image);
    console.log("Image data length:", data.image?.length);
    console.log("Image data preview:", data.image?.substring(0, 50));

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
      console.log("🔄 Starting try-on mutation...");
      setProcessing(true);
      setError(null);
    },
    onSuccess: (image) => {
      console.log("✅ Try-on mutation success!");
      console.log("Setting result image, length:", image?.length);
      console.log("Image preview:", image?.substring(0, 50));
      setResultImage(image);
      setProcessing(false);
      console.log("Store updated - processing set to false");
    },
    onError: (error: Error) => {
      console.error("❌ Try-on mutation error:", error.message);
      setError(error.message);
      setProcessing(false);
    },
  });
};
