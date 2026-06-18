import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useToast } from 'react-native-toast-notifications';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { useChallengeStore } from '../store/challenge-store';
import { UploadBox } from '../../../shared/components/ui/UploadBox';
import { InfoBox } from '../../../shared/components/ui/InfoBox';
import { useCreateSubmission } from '../api/submissions';

export default function ChallengeEntryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { challenges } = useChallengeStore();
  const createSubmission = useCreateSubmission();

  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');

  const challenge = challenges.find(c => c.id === Number(id));

  if (!challenge) return null;

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      toast.show('Media library permission is required to upload.', { type: 'warning' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setMediaUri(asset.uri);
      setMediaType(asset.type === 'video' ? 'video' : 'image');
    }
  };

  const handleSubmit = async () => {
    if (!mediaUri) {
      toast.show('Please upload your content first.', { type: 'warning' });
      return;
    }

    try {
      await createSubmission.mutateAsync({
        challengeId: challenge.id,
        uri: mediaUri,
        mediaType,
        caption,
      });
      toast.show('Entry submitted! Track it in My Entries.', { type: 'success' });
      router.push('/(shop)/challenges/my-entries');
    } catch (error: any) {
      toast.show(error?.message ?? 'Failed to submit entry. Please try again.', { type: 'danger' });
    }
  };

  const submitting = createSubmission.isPending;

  return (
    <View style={styles.container}>
      <StaticHeader title="SUBMIT ENTRY" onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.challengeSummary}>
          <Text style={styles.summaryLabel}>ENTERING CHALLENGE:</Text>
          <Text style={styles.summaryTitle}>{challenge.title.toUpperCase()}</Text>
        </View>

        <View style={styles.uploadSection}>
          {mediaUri ? (
            <TouchableOpacity style={styles.previewContainer} activeOpacity={0.9} onPress={pickMedia}>
              <Image source={{ uri: mediaUri }} style={styles.previewImage} />
              <View style={styles.previewBadge}>
                <Ionicons
                  name={mediaType === 'video' ? 'videocam' : 'image'}
                  size={14}
                  color={NEO_THEME.colors.white}
                />
                <Text style={styles.previewBadgeText}>TAP TO CHANGE</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <UploadBox onPress={pickMedia} />
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>CAPTION</Text>
          <TextInput
            style={styles.input}
            placeholder="Tell us about your submission..."
            placeholderTextColor={NEO_THEME.colors.grey}
            multiline
            numberOfLines={4}
            value={caption}
            onChangeText={setCaption}
          />
        </View>

        <View style={styles.infoBoxContainer}>
          <InfoBox
            type="warning"
            message="By submitting, you agree to the challenge rules and grant us permission to feature your content."
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && { opacity: 0.7 }]}
          activeOpacity={0.9}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={NEO_THEME.colors.white} />
          ) : (
            <>
              <Text style={styles.submitText}>SUBMIT ENTRY</Text>
              <Ionicons name="send" size={20} color={NEO_THEME.colors.white} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEO_THEME.colors.backgroundLight,
  },
  content: {
    padding: 20,
  },
  challengeSummary: {
    marginBottom: 24,
  },
  summaryLabel: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.grey,
    marginBottom: 4,
  },
  summaryTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.black,
  },
  uploadSection: {
    marginBottom: 24,
  },
  previewContainer: {
    height: 240,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    overflow: 'hidden',
    backgroundColor: NEO_THEME.colors.greyLight,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  previewBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: NEO_THEME.borders.radius,
  },
  previewBadgeText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 10,
    color: NEO_THEME.colors.white,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 14,
    color: NEO_THEME.colors.black,
    marginBottom: 8,
  },
  input: {
    backgroundColor: NEO_THEME.colors.white,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    padding: 16,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  infoBoxContainer: {
    marginBottom: 32,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_THEME.colors.black,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    gap: 8,
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  submitText: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    color: NEO_THEME.colors.white,
    textTransform: 'uppercase',
  },
});
