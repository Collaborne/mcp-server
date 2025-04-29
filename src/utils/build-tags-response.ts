import { MinimalTag } from "../types";
import { isExisting } from "./is-existing";

function getTexts(tags: MinimalTag[]) {
  return tags.map(
    (tag) =>
      `[${tag.id}]:${tag.name}${tag.search_terms ? `:${tag.search_terms}` : ""}`
  );
}

function removeDuplicateWhiteSpaces(text: string) {
  return text.replace(/\s{2,}/g, " ").trim();
}

export function buildTagsResponse(tags: MinimalTag[]) {
  process.stderr.write(`Found ${tags?.length ?? 0} tags`);

  const hasTags = tags.length > 0;

  if (!hasTags) {
    return [];
  }

  const texts = getTexts(tags);

  const cleanedTexts = texts
    .filter(isExisting)
    .map((text) => removeDuplicateWhiteSpaces(text));

  return cleanedTexts;
}
