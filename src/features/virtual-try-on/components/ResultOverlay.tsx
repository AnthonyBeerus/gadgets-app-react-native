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
      <View style={styles.processingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={styles.processingText}>Creating your look...</Text>
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
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRetry}
              activeOpacity={0.8}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🔄</Text>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.8}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>✕</Text>
                <Text style={styles.closeButtonText}>Close</Text>
              </View>
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
            disabled={isSaving}
            activeOpacity={0.8}>
            {isSaving ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.saveButtonText}>Saving...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>💾</Text>
                <Text style={styles.saveButtonText}>Save</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>✕</Text>
              <Text style={styles.closeButtonText}>Close</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    gap: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    maxWidth: 420,
    width: "100%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  processingText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#333",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF3B30",
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#9C27B0",
    marginBottom: 20,
    textAlign: "center",
  },
  resultImage: {
    width: "100%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#9C27B0",
  },
  resultText: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonIcon: {
    fontSize: 20,
    color: "white",
  },
  retryButton: {
    flex: 1,
    backgroundColor: "#9C27B0",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#34C759",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#666",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
