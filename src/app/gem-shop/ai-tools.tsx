import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NEO_THEME } from '../../shared/constants/neobrutalism';
import { StaticHeader } from '../../shared/components/layout/StaticHeader';
import { Ionicons } from '@expo/vector-icons';

const AI_TOOLS = [
  {
    id: 'image_gen',
    name: 'IMAGE GENERATOR',
    desc: 'Create stunning visuals from text prompts.',
    cost: '5 GEMS',
    icon: 'image',
    color: NEO_THEME.colors.blue,
  },
  {
    id: 'video_gen',
    name: 'VIDEO CREATOR',
    desc: 'Turn static images into short clips.',
    cost: '20 GEMS',
    icon: 'videocam',
    color: NEO_THEME.colors.yellow,
  },
  {
    id: 'audio_gen',
    name: 'AUDIO STUDIO',
    desc: 'Generate voiceovers and sound effects.',
    cost: '10 GEMS',
    icon: 'mic',
    color: NEO_THEME.colors.primary,
  },
];

export default function AIToolsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 60;

  return (
    <View style={styles.container}>
      <StaticHeader title="AI CREATIVE TOOLS" onBackPress={() => router.back()} />
      
      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { paddingTop: headerHeight + 20, paddingBottom: insets.bottom + 20 }
        ]}
      >
        <Text style={styles.description}>
          Unleash your creativity with our AI-powered studio. 
          Subscribers get discounted rates!
        </Text>

        <View style={styles.grid}>
          {AI_TOOLS.map((tool) => (
            <TouchableOpacity 
              key={tool.id} 
              style={[styles.card, { backgroundColor: tool.color }]}
              activeOpacity={0.9}
            >
              <View style={styles.iconBox}>
                <Ionicons name={tool.icon as any} size={32} color={NEO_THEME.colors.black} />
              </View>
              <Text style={styles.cardTitle}>{tool.name}</Text>
              <Text style={styles.cardDesc}>{tool.desc}</Text>
              <View style={styles.costTag}>
                <Ionicons name="diamond" size={12} color={NEO_THEME.colors.white} />
                <Text style={styles.costText}>{tool.cost}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  description: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  cardTitle: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 20,
    color: NEO_THEME.colors.black,
    marginBottom: 8,
  },
  cardDesc: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 14,
    color: NEO_THEME.colors.black,
    marginBottom: 16,
  },
  costTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: NEO_THEME.colors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  costText: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 12,
    color: NEO_THEME.colors.white,
  },
});
