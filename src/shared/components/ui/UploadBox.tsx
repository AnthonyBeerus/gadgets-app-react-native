import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../constants/neobrutalism';
import { useNeoStyles } from '../../hooks/useNeoStyles';
import { useTheme } from '../../providers/theme-provider';

interface UploadBoxProps {
  onPress?: () => void;
  supportedFormats?: string;
}

export function UploadBox({ onPress, supportedFormats = "JPG, PNG, MP4" }: UploadBoxProps) {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();
  const c = theme.colors;
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      // @ts-ignore - conditional props
      style={styles.uploadBox}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <Ionicons name="cloud-upload-outline" size={48} color={c.grey} />
      <Text style={styles.uploadText}>Tap to upload your content</Text>
      <Text style={styles.uploadSubtext}>Supports {supportedFormats}</Text>
    </Container>
  );
}

function createStyles(c: {
  black: string;
  white: string;
  grey: string;
}) {
  return {
    uploadBox: {
      height: 200,
      borderWidth: 1,
      borderColor: c.grey,
      borderStyle: 'dashed' as const,
      borderRadius: NEO_THEME.borders.radius,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: c.white,
      gap: 12,
    },
    uploadText: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 16,
      color: c.black,
    },
    uploadSubtext: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 12,
      color: c.grey,
    },
  };
}
