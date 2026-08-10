import { Pressable, View } from 'react-native';

import {
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';

type Option<T extends string> = { value: T; label: string; detail?: string };

type OptionPickerProps<T extends string> = {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
};

/** Single-select list. Used wherever the brief has a fixed vocabulary. */
export function OptionPicker<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
}: OptionPickerProps<T>) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text variant="label">{label}</Text>
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text variant="body">{option.label}</Text>
            {option.detail ? (
              <Text variant="caption" style={styles.detail}>
                {option.detail}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
      {error ? (
        <Text variant="caption" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function createStyles(c: SemanticColors) {
  return {
    container: { gap: space.xs },
    option: {
      borderWidth: 2,
      borderColor: c.strokeDim,
      backgroundColor: c.surface,
      padding: space.sm,
      gap: 2,
    },
    optionSelected: { borderColor: c.stroke, backgroundColor: c.surfaceSunken },
    detail: { color: c.inkMuted },
    error: { color: c.danger },
  };
}
