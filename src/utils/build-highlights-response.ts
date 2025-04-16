import { MinimalHighlight } from "../types";
import { isExisting } from "./is-existing";
// Average paragraph of 300 tokens
const MAX_QUOTE_CHAR_LENGTH = 1200;

function getHighlightQuote(highlight: Pick<MinimalHighlight, "text">) {
  return ` USER_QUOTES:${highlight.text.slice(0, MAX_QUOTE_CHAR_LENGTH)}`;
}

function getTexts(highlights: MinimalHighlight[], includeQuotes = false) {
  const hasSingleHighlight = highlights.length === 1;
  if (!hasSingleHighlight) {
    // Use interpretations if there are many highlights because they provide a compact
    // summary, i.e. we can cover more "breath of information"
    return highlights.map(
      (h) =>
        `[${h.id}]:${h.interpretation_plain} ${
          includeQuotes ? getHighlightQuote(h) : ""
        }`
    );
  } else {
    const singleHighlight = highlights[0];
    // If there is only one highlight: Use also the highlighted text itself because it provides
    // more "depth of information" (and we have the space for it). Additionally, we use the
    // interpretation because it provides more context (AI often covers what happens before/after
    // the highlight)
    return [
      `[${singleHighlight.id}]:${
        singleHighlight.interpretation_plain
      }. ${getHighlightQuote(singleHighlight)}`,
    ];
  }
}

function removeDuplicateWhiteSpaces(text: string) {
  return text.replace(/\s{2,}/g, " ").trim();
}

export function buildHighlightsResponse(
  highlights: MinimalHighlight[],
  includeQuotes = false
) {
  process.stderr.write(
    `Creating prompts based on ${highlights.length} highlights`
  );

  const hasHighlights = highlights.length > 0;

  if (!hasHighlights) {
    return [];
  }

  const texts = getTexts(highlights, includeQuotes);

  const cleanedTexts = texts
    .filter(isExisting)
    .map((text) => removeDuplicateWhiteSpaces(text));

  return cleanedTexts;
}
