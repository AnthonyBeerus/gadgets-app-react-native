// filepath: src/features/virtual-try-on/components/ImagePicker.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image, Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useTryOnStore } from "../store/tryOnStore";
import PoseSelector from "./PoseSelector";
import BackgroundSelector from "./BackgroundSelector";
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';

interface ImagePickerProps {
  onImageSelected?: (uri: string) => void;
  onReadyToGenerate?: () => void;
}

export default function ImagePickerComponent({
  onImageSelected,
  onReadyToGenerate,
}: ImagePickerProps) {
  const styles = useNeoStyles(createStyles);
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


function createStyles(c) {
  return {
  scrollContainer: {
    flex: 1,
    backgroundColor: c.backgroundLight,
  },
  container: {
    padding: 24,
    alignItems: "center",
  },
  instruction: {
    fontSize: 20,
    marginBottom: 32,
    textAlign: "center",
    fontWeight: '600',
    color: c.black,
    fontFamily: NEO_THEME.fonts.black,
    textTransform: "uppercase",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
  },
  button: {
    backgroundColor: c.primary,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  buttonText: {
    color: c.white,
    fontSize: 18,
    fontWeight: '600',
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
    borderWidth: 1,
    borderColor: c.border,
  },
  changeButton: {
    backgroundColor: c.yellow,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  changeButtonText: {
    color: c.black,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: NEO_THEME.fonts.black,
  },
  selectorSection: {
    width: "100%",
    marginTop: 8,
  },
  generateButton: {
    backgroundColor: c.primary,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: NEO_THEME.borders.radius,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  generateButtonText: {
    color: c.white,
    fontSize: 18,
    fontWeight: '600',
    fontFamily: NEO_THEME.fonts.black,
  },
  };
}