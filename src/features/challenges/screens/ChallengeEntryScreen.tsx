import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { useChallengeStore } from '../store/challenge-store';
import { AICreateButton } from '../components/AICreateButton';
import { UploadBox } from '../../../shared/components/ui/UploadBox';
import { InfoBox } from '../../../shared/components/ui/InfoBox';

export default function ChallengeEntryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { challenges } = useChallengeStore();
  
  const challenge = challenges.find(c => c.id === Number(id));

  if (!challenge) return null;

  return (
    <View style={styles.container}>
      <StaticHeader title="SUBMIT ENTRY" onBackPress={() => router.back()} />
      
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.challengeSummary}>
          <Text style={styles.summaryLabel}>ENTERING CHALLENGE:</Text>
          <Text style={styles.summaryTitle}>{challenge.title.toUpperCase()}</Text>
        </View>

        <View style={styles.uploadSection}>
          <AICreateButton 
            onPress={() => router.push('/gem-shop/ai-tools')}
            gemCost={10}
          />
          <UploadBox />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>CAPTION</Text>
          <TextInput 
            style={styles.input}
            placeholder="Tell us about your submission..."
            placeholderTextColor={NEO_THEME.colors.grey}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.infoBoxContainer}>
          <InfoBox 
            type="warning"
            message="By submitting, you agree to the challenge rules and grant us permission to feature your content."
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          activeOpacity={0.9}
          onPress={() => {
            router.push('/(shop)/challenges');
          }}
        >
          <Text style={styles.submitText}>SUBMIT ENTRY</Text>
          <Ionicons name="send" size={20} color={NEO_THEME.colors.white} />
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
