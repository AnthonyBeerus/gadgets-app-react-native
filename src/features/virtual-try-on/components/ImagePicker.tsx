// filepath: src/features/virtual-try-on/components/ImagePicker.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTryOnStore } from "../store/tryOnStore";

interface ImagePickerProps {
  onImageSelected?: (uri: string) => void;
}

export default function ImagePickerComponent({
  onImageSelected,
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
    <View style={styles.container}>
      <Text style={styles.instruction}>Upload a photo of yourself:</Text>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setSelectedImage(null)}>
            <Text style={styles.changeButtonText}>Change Photo</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  instruction: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    alignItems: "center",
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  changeButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
