// Matches one full emoji grapheme cluster: base codepoint + optional skin-tone
// modifier or variation selector-16 + any ZWJ-joined segments.
// Handles: 🏃, 🏃🏽, 🏃‍♂️, 👨‍👩‍👧‍👦, ❤️, etc.
const LEADING_EMOJI_RE =
  /^\p{Extended_Pictographic}(️|\p{Emoji_Modifier})?(‍\p{Extended_Pictographic}(️|\p{Emoji_Modifier})?)*/u;

type LeadingEmojiResult = {
  emoji: string;
  rest: string;
};

export function extractLeadingEmoji(str: string): LeadingEmojiResult | null {
  const match = str.match(LEADING_EMOJI_RE);
  if (!match) {
    return null;
  }
  return {emoji: match[0], rest: str.slice(match[0].length).trimStart()};
}
