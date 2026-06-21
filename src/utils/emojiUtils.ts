// Matches one full emoji grapheme cluster: base codepoint + optional skin-tone
// modifier or variation selector-16 + any ZWJ-joined segments.
// Handles: 🏃, 🏃🏽, 🏃‍♂️, 👨‍👩‍👧‍👦, ❤️, etc.
const LEADING_EMOJI_RE =
  /^\p{Extended_Pictographic}(️|\p{Emoji_Modifier})?(‍\p{Extended_Pictographic}(️|\p{Emoji_Modifier})?)*/u;

export function extractLeadingEmoji(str: string): string | null {
  const match = str.match(LEADING_EMOJI_RE);
  return match ? match[0] : null;
}
