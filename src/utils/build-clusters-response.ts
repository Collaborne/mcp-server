import { MinimalPlaylist } from "../types";
import { isExisting } from "./is-existing";

function toNrLinkedHighlightsText(playlist: MinimalPlaylist) {
  return `Users raised this point ${playlist.nr_linked_highlights} times.`;
}

function toLabelsText(playlist: MinimalPlaylist) {
  return (playlist.labels ?? [])
    .map((label) => `#${label.replace(/ /g, "-")}`)
    .join(" ");
}

function getTextsFromSinglePlaylist(playlist: MinimalPlaylist) {
  // If there is only one playlist: Use also the playlist title itself because it provides
  // more "depth of information" (and we have the space for it). Additionally, we use the
  // description because it provides more context
  return [
    `[${playlist.id}]:`,
    playlist.description,
    playlist.title,
    toNrLinkedHighlightsText(playlist),
    toLabelsText(playlist),
  ];
}

function getTextsFromMultiplePlaylists(playlists: MinimalPlaylist[]) {
  // Use descriptions if there are many playlists because they provide a compact
  // summary, i.e. we can cover more "breath of information"
  return playlists.map((playlist) => {
    const labelsText = toLabelsText(playlist);
    const nrHighlights = toNrLinkedHighlightsText(playlist);
    return `[${playlist.id}]: ${playlist.description} ${nrHighlights} ${labelsText}`;
  });
}

export function buildPlaylistsForPrompt(playlists: MinimalPlaylist[]) {
  process.stderr.write(`Found ${playlists?.length ?? 0} playlists`);

  const hasPlaylists = playlists.length > 0;

  if (!hasPlaylists) {
    return [];
  }

  const isSinglePlaylist = playlists.length === 1;
  const texts = isSinglePlaylist
    ? getTextsFromSinglePlaylist(playlists[0])
    : getTextsFromMultiplePlaylists(playlists);

  const cleanedTexts = texts.filter(isExisting).map((text) =>
    // Remove duplicate white spaces
    text.replace(/\s{2,}/g, " ").trim()
  );

  return cleanedTexts;
}
