# Styling regression analysis

## Baseline

The reference for this review is the last Next.js/Tailwind version in Git, rendered locally at the
same viewport as the TanStack Start/StyleX version. The previous application already used:

- Geist Mono for sans, serif, and mono text
- `0rem` as the global radius
- grayscale primary and surface colors
- effectively transparent shadows
- dark mode as the default theme

Those choices were not introduced by StyleX or Base UI and should not be “corrected” as migration
regressions.

## What drifted

The migration adapter treated `space-x-*` and `space-y-*` like ordinary element styles. These
utilities actually apply margins to an element's children. StyleX therefore put the margin
declarations on the parent and removed the intended gaps between children. On the home page this
pulled the demo button and main chat card upward by 48 pixels.

The adapter also left pseudo-state and attribute-state utilities as compatibility class names, but
the compatibility stylesheet contained only theme and reset rules. Hover, focus, dark, disabled,
animation, descendant, and Base UI state selectors therefore had no compiled rules. Examples
included the dark input background, icon-aware button padding, menu focus states, and overlay
transitions.

Finally, several Radix-to-Base-UI component conversions removed the original dialog, sheet,
dropdown, select, switch, and tooltip state styling instead of translating the selectors to Base
UI's state attributes.

## Fix

- Child-spacing utilities remain in the static compatibility stylesheet instead of being applied
  to the parent through StyleX.
- The compatibility stylesheet now contains the compiled selector rules used by the migrated
  application. It is a static artifact; Tailwind is not a runtime or project dependency.
- Compatibility utility rules are unlayered so their more specific hover, focus, descendant, dark,
  and data-state selectors can override element-local StyleX declarations.
- Base UI primitives use Base UI state attributes such as `data-open`, `data-closed`,
  `data-starting-style`, `data-ending-style`, `data-checked`, and `data-unchecked` while preserving
  the previous resting visuals.
- A regression test prevents child-spacing selectors from being routed through the element-local
  StyleX path again.

## Verified parity

At a 1280 by 720 viewport, the old and new home pages now agree on the main layout measurements:

| Element                |     Previous |     Migrated |
| ---------------------- | -----------: | -----------: |
| Main card position     | x 216, y 324 | x 216, y 324 |
| Main card size         |    848 × 344 |    848 × 344 |
| Message input position | x 242, y 530 | x 242, y 530 |
| Message input size     |     796 × 48 |     796 × 48 |
| Theme button size      |      36 × 32 |      36 × 32 |
| Theme button padding   |    0 × 10 px |    0 × 10 px |

The remaining document-height difference on the home page comes from content and SEO copy changes,
not from layout styling.

## Rule for future changes

New element-local styles should be implemented with StyleX. A utility that depends on child,
sibling, pseudo-state, media, theme, or component state semantics must not be flattened into a
plain StyleX declaration. It needs an explicit StyleX selector/state style or a deliberately
compiled compatibility rule until that component is fully converted.
