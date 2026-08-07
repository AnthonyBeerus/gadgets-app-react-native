import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useDesignTokens } from '../theme/DesignTokensProvider';
import { fonts } from '../tokens/typography';
import { radii } from '../tokens/radii';
import { space } from '../tokens/space';

export interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  containerStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const { colors, elevation } = useDesignTokens();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, ...elevation.hairline },
        containerStyle,
      ]}
    >
      {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
      <TextInput
        style={[styles.input, { color: colors.ink }, inputStyle]}
        placeholderTextColor={colors.inkMuted}
        {...props}
      />
      {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: radii.md,
    paddingHorizontal: space.md,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  iconLeft: {
    marginRight: space.xs,
  },
  iconRight: {
    marginLeft: space.xs,
  },
});
