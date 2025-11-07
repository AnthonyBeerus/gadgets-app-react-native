// filepath: src/features/virtual-try-on/components/ImagePicker.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTryOnStore } from "../store/tryOnStore";
import PoseSelector from "./PoseSelector";
import BackgroundSelector from "./BackgroundSelector";

interface ImagePickerProps {
  onImageSelected?: (uri: string) => void;
  onReadyToGenerate?: () => void;
}

export default function ImagePickerComponent({
  onImageSelected,
  onReadyToGenerate,
}: ImagePickerProps) {
  const { setUserImage } = useTryOnStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera roll permissions are required to select photos"
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect for better try-on results
      quality: 0.8,
      base64: true, // Request base64 encoding
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;

      // Convert to base64 data URI if not already
      const base64 = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : uri;

      setSelectedImage(uri);
      setUserImage(base64);
      onImageSelected?.(base64);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permissions are required to take photos"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true, // Request base64 encoding
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;

      // Convert to base64 data URI if not already
      const base64 = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : uri;

      setSelectedImage(uri);
      setUserImage(base64);
      onImageSelected?.(base64);
    }
  };

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}>
      <Text style={styles.instruction}>Upload a photo of yourself:</Text>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setSelectedImage(null)}>
            <Text style={styles.changeButtonText}>Change Photo</Text>
          </TouchableOpacity>

          {/* Pose Selector */}
          <View style={styles.selectorSection}>
            <PoseSelector />
          </View>

          {/* Background Selector */}
          <View style={styles.selectorSection}>
            <BackgroundSelector />
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={onReadyToGenerate}>
            <Text style={styles.generateButtonText}>✨ Generate Try-On</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>📁 Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>📷 Take Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  instruction: {
    fontSize: 20,
    marginBottom: 32,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  button: {
    backgroundColor: "#9C27B0",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  selectedImage: {
    width: 280,
    height: 280,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#9C27B0",
  },
  changeButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  changeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectorSection: {
    width: "100%",
    marginTop: 8,
  },
  generateButton: {
    backgroundColor: "#9C27B0",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    elevation: 4,
    shadowColor: "#9C27B0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  generateButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
