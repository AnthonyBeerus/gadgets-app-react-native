# Muse Design System

Quiet commerce design system owned under FDD shared layer.

## Import

```ts
import {
  Button,
  Text,
  Input,
  Surface,
  Tag,
  IconButton,
  ScreenHeader,
  TabBarShell,
  colors,
  space,
  useDesignTokens,
} from '../../shared/design-system';
```

## Ownership

- **Tokens / primitives / patterns** → `src/shared/design-system/`
- **Domain UI** (opportunity card, challenge card) → `src/features/[feature]/components/`

## Do not

- Import `shared/constants/neobrutalism` in new code
- Add hard offset shadows or pastel lilac as brand primary
