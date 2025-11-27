import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { StaticHeader } from '../../../shared/components/layout/StaticHeader';
import { useChallengeStore } from '../store/challenge-store';

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
          <TouchableOpacity 
            style={styles.aiCreateButton}
            activeOpacity={0.9}
            onPress={() => router.push('/gem-shop/ai-tools')}
          >
            <View style={styles.aiCreateIcon}>
              <Ionicons name="sparkles" size={24} color={NEO_THEME.colors.white} />
            </View>
            <View style={styles.aiCreateContent}>
              <Text style={styles.aiCreateTitle}>CREATE WITH AI</Text>
              <Text style={styles.aiCreateSubtitle}>Stand out with professional AI tools</Text>
            </View>
            <View style={styles.gemCost}>
              <Ionicons name="diamond" size={12} color={NEO_THEME.colors.black} />
              <Text style={styles.gemCostText}>FROM 10</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.uploadBox}>
            <Ionicons name="cloud-upload-outline" size={48} color={NEO_THEME.colors.grey} />
            <Text style={styles.uploadText}>Tap to upload your content</Text>
            <Text style={styles.uploadSubtext}>Supports JPG, PNG, MP4</Text>
          </View>
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

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color={NEO_THEME.colors.black} />
          <Text style={styles.infoText}>
            By submitting, you agree to the challenge rules and grant us permission to feature your content.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          activeOpacity={0.9}
          onPress={() => {
            // Mock success flow
            router.push('/(shop)/challenges'); // Or a success screen
            // In a real app, we'd show a success modal first
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: NEO_THEME.colors.yellow,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    gap: 12,
    marginBottom: 32,
  },
  infoText: {
    flex: 1,
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.black,
    lineHeight: 18,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NEO_THEME.colors.black,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    gap: 8,
    // Hard shadow
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
  aiCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.primary,
    padding: 16,
    borderRadius: NEO_THEME.borders.radius,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    marginBottom: 16,
    gap: 12,
    // Hard shadow
    shadowColor: NEO_THEME.colors.grey,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  aiCreateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: NEO_THEME.colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiCreateContent: {
    flex: 1,
  },
  aiCreateTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 16,
    color: NEO_THEME.colors.white,
  },
  aiCreateSubtitle: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.white,
  },
  gemCost: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEO_THEME.colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: NEO_THEME.borders.radius,
    gap: 4,
    borderWidth: 1,
    borderColor: NEO_THEME.colors.black,
  },
  gemCostText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.black,
  },
});
