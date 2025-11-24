import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';

const USE_CASES = [
  {
    id: 'challenges',
    title: 'Challenges',
    desc: 'Pay entry fees & boost posts',
    icon: 'trophy',
    color: NEO_THEME.colors.yellow,
  },
  {
    id: 'ai',
    title: 'AI Tools',
    desc: 'Generate images & audio',
    icon: 'color-wand',
    color: NEO_THEME.colors.blue,
  },
  {
    id: 'services',
    title: 'Services',
    desc: 'Get booking discounts',
    icon: 'cut',
    color: NEO_THEME.colors.primary,
  },
  {
    id: 'shop',
    title: 'Shop',
    desc: 'Redeem for vouchers',
    icon: 'cart',
    color: NEO_THEME.colors.white,
  },
  {
    id: 'events',
    title: 'Events',
    desc: 'Unlock VIP perks',
    icon: 'ticket',
    color: NEO_THEME.colors.grey,
  },
];

export const GemUseCases = () => {
  const router = useRouter();

  const handlePress = (id: string) => {
    switch (id) {
      case 'challenges':
        router.push('/(shop)/challenges');
        break;
      case 'ai':
        router.push('/gem-shop/ai-tools');
        break;
      case 'services':
        router.push('/services');
        break;
      case 'shop':
        router.push('/gem-shop/rewards');
        break;
      case 'events':
        router.push('/(shop)/events'); // Assuming events is in shop tabs or similar
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>USE YOUR GEMS</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {USE_CASES.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={[styles.card, { backgroundColor: item.color }]}
            activeOpacity={0.9}
            onPress={() => handlePress(item.id)}
          >
            <View style={styles.iconBox}>
              <Ionicons name={item.icon as any} size={24} color={NEO_THEME.colors.black} />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  title: {
    fontFamily: NEO_THEME.fonts.black,
    fontSize: 24,
    color: NEO_THEME.colors.black,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  scrollContent: {
    gap: 16,
    paddingRight: 20,
  },
  card: {
    width: 160,
    padding: 16,
    borderWidth: NEO_THEME.borders.width,
    borderColor: NEO_THEME.colors.black,
    borderRadius: NEO_THEME.borders.radius,
    // Hard shadow
    shadowColor: NEO_THEME.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    marginRight: 4, // spacing for shadow
    marginBottom: 4, // spacing for shadow
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: NEO_THEME.colors.black,
  },
  cardTitle: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    color: NEO_THEME.colors.black,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    color: NEO_THEME.colors.black,
    lineHeight: 16,
  },
});
