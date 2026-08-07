import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NEO_THEME } from '../../../shared/constants/neobrutalism';
import { useNeoStyles } from '../../../shared/hooks/useNeoStyles';
import { useTheme } from '../../../shared/providers/theme-provider';

export const GemUseCases = () => {
  const router = useRouter();
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  const useCases = useMemo(() => [
    { id: 'challenges', title: 'Challenges', desc: 'Pay entry fees & boost posts', icon: 'trophy', color: theme.colors.yellow },
    { id: 'services', title: 'Services', desc: 'Get booking discounts', icon: 'cut', color: theme.colors.primary },
    { id: 'shop', title: 'Shop', desc: 'Redeem for vouchers', icon: 'cart', color: theme.colors.white },
    { id: 'events', title: 'Events', desc: 'Unlock VIP perks', icon: 'ticket', color: theme.colors.grey },
  ], [theme.colors]);

  const handlePress = (id: string) => {
    switch (id) {
      case 'challenges':
        router.push('/(shop)/challenges');
        break;
      case 'services':
        router.push('/services');
        break;
      case 'shop':
        router.push('/gem-shop/rewards');
        break;
      case 'events':
        router.push('/(shop)/events');
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
        {useCases.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.color }]}
            activeOpacity={0.9}
            onPress={() => handlePress(item.id)}
          >
            <View style={styles.iconBox}>
              <Ionicons name={item.icon as any} size={24} color={theme.colors.black} />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

function createStyles(c: { black: string; border: string }) {
  return {
    container: {
      marginBottom: 30,
    },
    title: {
      fontFamily: NEO_THEME.fonts.black,
      fontSize: 24,
      color: c.black,
      marginBottom: 16,
      textTransform: 'uppercase' as const,
    },
    scrollContent: {
      gap: 16,
      paddingRight: 20,
    },
    card: {
      width: 160,
      padding: 16,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: NEO_THEME.borders.radius,
      shadowColor: c.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      marginRight: 4,
      marginBottom: 4,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.5)',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardTitle: {
      fontFamily: NEO_THEME.fonts.bold,
      fontSize: 16,
      color: c.black,
      marginBottom: 4,
    },
    cardDesc: {
      fontFamily: NEO_THEME.fonts.regular,
      fontSize: 12,
      color: c.black,
      lineHeight: 16,
    },
  };
}
