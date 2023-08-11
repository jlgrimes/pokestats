import { SearchResultSchema } from './search-types';

// Keywords that define "other" archetype.
const VARIANT_ARCHETYPE_KEYWORDS = ['other', 'variants'];

/**
 * Gets the relevant phrase the query is contained in from a search result.
 * Ex. world should return "World" in "World Championships".
 * 
 * @param query - Search query.
 * @param result - A search result.
 */
export const getRelevantPhrase = (query: string, result: string) => {
  const startingIndex = result.toLowerCase().indexOf(query.toLowerCase());

  // Query not found, no relevant phrase
  if (startingIndex < 0) return '';

  const trailingSpaceIdx = result.indexOf(' ', startingIndex);
  if (startingIndex === 0) return result.slice(0, trailingSpaceIdx);

  const leadingSpaceIdx = result.lastIndexOf(' ', startingIndex);

  if (trailingSpaceIdx < 0) return result.slice(leadingSpaceIdx);

  return result.slice(leadingSpaceIdx + 1, trailingSpaceIdx);
}

export const trimQuery = (query: string) => {
  if (query.includes('regionals')) return query.replace('regionals', 'regional');
  if (query.includes('worlds')) return query.replace('worlds', 'world');

  if (query.includes('naic')) return query.replace('naic', 'North American International Championship');
  if (query.includes('ocic')) return query.replace('ocic', 'Oceania International Championship');
  if (query.includes('laic')) return query.replace('laic', 'Latin America International Championship');
  if (query.includes('euic')) return query.replace('euic', 'Europe International Championship');

  if (query.includes('ic')) return query.replace('ic', 'international');
  return query;
}

export const appSearchResultComparator =
  (searchQuery: string) => (a: SearchResultSchema, b: SearchResultSchema) => {
    const trueLength = searchQuery.length;

    // If neither returned a string, punt that to back
    if (!a.match) return 1;
    if (!b.match) return -1;

    // Put currently running tournaments to the front
    if (a.type === 'tournament' && a.data.tournamentStatus === 'running') return -1;
    if (b.type === 'tournament' && b.data.tournamentStatus === 'running') return 1;

    // If both decks are archetypes, we want the one in the more relevant format
    if (a.type === 'archetype' && b.type === 'archetype') {
      if (a.data.format.id > b.data.format.id) return -1;
      if (a.data.format.id < b.data.format.id) return 1;

      // If both decks are archetypes and in relevant formats, punt to end if it's "other" or "variants"
      if (
        VARIANT_ARCHETYPE_KEYWORDS.some(keyword =>
          a.data.name.toLowerCase().includes(keyword)
        )
      )
        return 1;
      if (
        VARIANT_ARCHETYPE_KEYWORDS.some(keyword =>
          b.data.name.toLowerCase().includes(keyword)
        )
      )
        return -1;
    }

    const aRelevantPhrase = getRelevantPhrase(searchQuery, a.match);
    const bRelevantPhrase = getRelevantPhrase(searchQuery, b.match)

    // Return whichever phrase matches the query most relevantly
    if (
      Math.abs(aRelevantPhrase.length - trueLength) <
      Math.abs(bRelevantPhrase.length - trueLength)
    )
      return -1;
    if (
      Math.abs(aRelevantPhrase.length - trueLength) >
      Math.abs(bRelevantPhrase.length - trueLength)
    )
      return 1;

    // Finally, if we're comparing between an archetype and supertype, supertype goes first
    if (a.type === 'supertype' && b.type === 'archetype') return -1;
    if (a.type === 'archetype' && b.type === 'supertype') return 1;

    return 0;
  };
