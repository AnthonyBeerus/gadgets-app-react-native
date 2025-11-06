// filepath: src/features/virtual-try-on/components/ResultOverlay.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTryOnStore } from "../store/tryOnStore";

interface ResultOverlayProps {
  onClose: () => void;
  onRetry?: () => void;
}

export default function ResultOverlay({
  onClose,
  onRetry,
}: ResultOverlayProps) {
  const { resultImage, isProcessing, error } = useTryOnStore();

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
        <Image source={{ uri: resultImage }} style={styles.resultImage} />
        <Text style={styles.resultText}>How does it look?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              /* TODO: Save to gallery */
            }}>
            <Text style={styles.saveButtonText}>💾 Save Image</Text>
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
    width: 250,
    height: 250,
    borderRadius: 15,
    marginBottom: 15,
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
