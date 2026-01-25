import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { NEO_THEME } from '../../constants/neobrutalism';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const NUM_PARTICLES = 50;
const COLORS = [
  NEO_THEME.colors.primary,
  NEO_THEME.colors.vibrantOrange,
  NEO_THEME.colors.gemGold,
  NEO_THEME.colors.electricBlue,
  NEO_THEME.colors.success,
  NEO_THEME.colors.warning,
];

interface ParticleProps {
  index: number;
}

const Particle: React.FC<ParticleProps> = ({ index }) => {
  const x = useSharedValue(Math.random() * SCREEN_WIDTH);
  const y = useSharedValue(-50);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const color = COLORS[index % COLORS.length];
  const size = Math.random() * 8 + 6; // 6-14px
  const delay = Math.random() * 500;
  const duration = Math.random() * 2000 + 2000; // 2-4s

  useEffect(() => {
    // Reset positions
    y.value = -50;
    opacity.value = 1;
    
    // Animate falling
    y.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration: duration,
        easing: Easing.linear,
      })
    );

    // Animate rotation
    rotation.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration * 0.8, easing: Easing.linear }),
        -1
      )
    );
    
    // Animate x sway
    // (Simplification: linear falling first, maybe add sine sway later if needed)

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
    };
  });

  return <Animated.View style={[styles.particle, rStyle]} />;
};

interface ConfettiProps {
  active?: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active = false }) => {
  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
        <Particle key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // On top of everything
  },
  particle: {
    position: 'absolute',
    borderWidth: 1, // Neobrutalist hard edge
    borderColor: 'rgba(0,0,0,0.1)',
  },
});
