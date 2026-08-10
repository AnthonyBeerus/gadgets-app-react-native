import { useState } from 'react';
import { View } from 'react-native';

import {
  Button,
  IconButton,
  Input,
  Text,
  space,
  useThemedStyles,
  type SemanticColors,
} from '../../../shared/design-system';

type BulletListFieldProps = {
  label: string;
  placeholder: string;
  hint?: string;
  values: string[];
  max?: number;
  onChange: (values: string[]) => void;
};

/** Repeated add/remove list used for talking points, do's and don'ts. */
export function BulletListField({
  label,
  placeholder,
  hint,
  values,
  max = 8,
  onChange,
}: BulletListFieldProps) {
  const styles = useThemedStyles(createStyles);
  const [draft, setDraft] = useState('');
  const atCapacity = values.length >= max;

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed || atCapacity) return;
    onChange([...values, trimmed]);
    setDraft('');
  };

  return (
    <View style={styles.container}>
      <Text variant="label">{label}</Text>
      {hint ? (
        <Text variant="caption" style={styles.hint}>
          {hint}
        </Text>
      ) : null}

      {values.map((value, index) => (
        <View key={`${value}-${index}`} style={styles.row}>
          <Text variant="body" style={styles.rowText}>
            • {value}
          </Text>
          <IconButton
            accessibilityLabel={`Remove "${value}"`}
            onPress={() => onChange(values.filter((_, i) => i !== index))}
          >
            ✕
          </IconButton>
        </View>
      ))}

      {!atCapacity ? (
        <View style={styles.addRow}>
          <Input
            placeholder={placeholder}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={add}
            returnKeyType="done"
            containerStyle={styles.input}
          />
          <Button variant="secondary" onPress={add} disabled={!draft.trim()}>
            Add
          </Button>
        </View>
      ) : (
        <Text variant="caption" style={styles.hint}>
          That is {max} points — enough for a brief creators will actually read.
        </Text>
      )}
    </View>
  );
}

function createStyles(c: SemanticColors) {
  return {
    container: { gap: space.xs },
    hint: { color: c.inkMuted },
    row: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: space.xs },
    rowText: { flex: 1 },
    addRow: { flexDirection: 'row' as const, alignItems: 'flex-end' as const, gap: space.xs },
    input: { flex: 1 },
  };
}
