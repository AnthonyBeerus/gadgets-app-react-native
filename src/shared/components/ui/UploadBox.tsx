import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../constants/neobrutalism';

interface UploadBoxProps {
  onPress?: () => void;
  supportedFormats?: string;
}

export function UploadBox({ onPress, supportedFormats = "JPG, PNG, MP4" }: UploadBoxProps) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      // @ts-ignore - conditional props
      style={styles.uploadBox}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Ionicons name="cloud-upload-outline" size={48} color={NEO_THEME.colors.grey} />
      <Text style={styles.uploadText}>Tap to upload your content</Text>
      <Text style={styles.uploadSubtext}>Supports {supportedFormats}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  uploadBox: {
    height: 200,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.grey,
    borderStyle: 'dashed',
    borderRadius: NEO_THEME.borders.radius,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_THEME.colors.white,
    gap: 12,
  },
  uploadText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    color: NEO_THEME.colors.black,
  },
  uploadSubtext: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.grey,
  },
});
