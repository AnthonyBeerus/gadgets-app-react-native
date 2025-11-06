// filepath: src/features/virtual-try-on/components/ResultOverlay.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useTryOnStore } from "../store/tryOnStore";
import * as MediaLibrary from "expo-media-library";
import { File, Paths } from "expo-file-system/next";

interface ResultOverlayProps {
  onClose: () => void;
  onRetry?: () => void;
}

export default function ResultOverlay({
  onClose,
  onRetry,
}: ResultOverlayProps) {
  const { resultImage, isProcessing, error } = useTryOnStore();
  const [isSaving, setIsSaving] = useState(false);

  console.log("ResultOverlay render:");
  console.log("- isProcessing:", isProcessing);
  console.log("- error:", error);
  console.log("- resultImage exists:", !!resultImage);
  console.log("- resultImage type:", typeof resultImage);
  console.log("- resultImage length:", resultImage?.length);
  console.log("- resultImage preview:", resultImage?.substring(0, 50));

  const handleSaveImage = async () => {
    if (!resultImage) return;

    try {
      setIsSaving(true);
      console.log("🔵 Starting save process...");

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log("🔵 Permission status:", status);
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to save images to your gallery."
        );
        setIsSaving(false);
        return;
      }

      // Create a unique filename in cache directory
      const filename = `virtual-tryon-${Date.now()}.png`;
      const file = new File(Paths.cache, filename);
      console.log("🔵 File URI:", file.uri);

      // Extract base64 data from data URI
      const base64Data = resultImage.replace(/^data:image\/\w+;base64,/, "");
      console.log("🔵 Base64 data length:", base64Data.length);

      // Convert base64 to Uint8Array
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      console.log("🔵 Binary data size:", bytes.length);

      // Write the image data to file using writable stream
      console.log("🔵 Writing to file...");
      const writer = file.writableStream().getWriter();
      await writer.write(bytes);
      await writer.close();
      console.log("🔵 File written successfully");

      // Save to media library
      console.log("🔵 Saving to media library...");
      await MediaLibrary.saveToLibraryAsync(file.uri);
      console.log("✅ Saved to media library successfully!");

      Alert.alert(
        "Success! 🎉",
        "Your virtual try-on image has been saved to your gallery.",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("❌ Failed to save image:", error);
      console.error("❌ Error details:", JSON.stringify(error, null, 2));
      Alert.alert(
        "Save Failed",
        `Could not save the image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        [{ text: "OK" }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.processingText}>
            Processing your virtual try-on...
          </Text>
          <Text style={styles.subText}>This may take a few moments</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorTitle}>❌ Processing Failed</Text>
          <Text style={styles.errorText}>{error}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (!resultImage) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.successTitle}>✨ Virtual Try-On Complete!</Text>
        <Image
          source={{ uri: resultImage }}
          style={styles.resultImage}
          resizeMode="contain"
          onLoad={() => console.log("✅ Image loaded successfully")}
          onError={(error) =>
            console.error("❌ Image load error:", error.nativeEvent)
          }
        />
        <Text style={styles.resultText}>How does it look?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={handleSaveImage}
            disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.saveButtonText}>💾 Save Image</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin: 20,
    alignItems: "center",
    maxWidth: 400,
    width: "90%",
  },
  processingText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#34C759",
    marginBottom: 15,
    textAlign: "center",
  },
  resultImage: {
    width: 300,
    height: 400,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: "#f0f0f0", // Add background to see if component renders
  },
  resultText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  retryButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#8E8E93",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
