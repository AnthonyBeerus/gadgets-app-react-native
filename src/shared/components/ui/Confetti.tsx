import React, { useEffect, useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useNeoStyles } from '../../hooks/useNeoStyles';
import { useTheme } from '../../providers/theme-provider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const NUM_PARTICLES = 50;

interface ParticleProps {
  color: string;
  borderColor: string;
  particleStyle: { position: 'absolute'; borderWidth: number };
}

const Particle: React.FC<ParticleProps> = ({ color, borderColor, particleStyle }) => {
  const x = useSharedValue(Math.random() * SCREEN_WIDTH);
  const y = useSharedValue(-50);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const size = Math.random() * 8 + 6;
  const delay = Math.random() * 500;
  const duration = Math.random() * 2000 + 2000;

  useEffect(() => {
    y.value = -50;
    opacity.value = 1;
    
    y.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration: duration,
        easing: Easing.linear,
      })
    );

    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration * 0.8, easing: Easing.linear }),
        -1
      )
    );
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
      width: size,
      height: size,
      backgroundColor: color,
      borderColor,
    };
  });

  return <Animated.View style={[particleStyle, rStyle]} />;
};

interface ConfettiProps {
  active?: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active = false }) => {
  const styles = useNeoStyles(createStyles);
  const { theme } = useTheme();

  const accentColors = useMemo(
    () => [
      theme.colors.primary,
      theme.colors.vibrantOrange,
      theme.colors.gemGold,
      theme.colors.electricBlue,
      theme.colors.success,
      theme.colors.warning,
    ],
    [theme],
  );

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
        <Particle
          key={i}
          color={accentColors[i % accentColors.length]}
          borderColor={theme.colors.border}
          particleStyle={styles.particle}
        />
      ))}
    </View>
  );
};

function createStyles(_c: unknown) {
  return {
    container: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
    },
    particle: {
      position: 'absolute' as const,
      borderWidth: 1,
    },
  };
}
