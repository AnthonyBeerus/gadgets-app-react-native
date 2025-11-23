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
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

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
      <Text style={styles.instruction}>UPLOAD A PHOTO OF YOURSELF:</Text>

      {selectedImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => setSelectedImage(null)}>
            <Text style={styles.changeButtonText}>CHANGE PHOTO</Text>
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
            <Text style={styles.generateButtonText}>✨ GENERATE TRY-ON</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>📁 CHOOSE FROM GALLERY</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>📷 TAKE PHOTO</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  instruction: {
    fontSize: 20,
    marginBottom: 32,
    textAlign: "center",
    fontWeight: "900",
    color: NEO_THEME.colors.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  button: {
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  buttonText: {
    color: NEO_THEME.colors.white,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
  imageContainer: {
    alignItems: "center",
    gap: 20,
    width: "100%",
  },
  selectedImage: {
    width: 280,
    height: 280,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
  },
  changeButton: {
    backgroundColor: NEO_THEME.colors.yellow,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  changeButtonText: {
    color: NEO_THEME.colors.black,
    fontSize: 16,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
  selectorSection: {
    width: "100%",
    marginTop: 8,
  },
  generateButton: {
    backgroundColor: NEO_THEME.colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    marginTop: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  generateButtonText: {
    color: NEO_THEME.colors.white,
    fontSize: 18,
    fontWeight: "900",
    fontFamily: NEO_THEME.fonts.black,
  },
});
