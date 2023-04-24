import { SearchResultSchema } from './search-types';

// Keywords that define "other" archetype.
const VARIANT_ARCHETYPE_KEYWORDS = ['other', 'variants'];

export const appSearchResultComparator =
  (searchQuery: string) => (a: SearchResultSchema, b: SearchResultSchema) => {
    const trueLength = searchQuery.length;

    // If neither returned a string, punt that to back
    if (!a.match) return 1;
    if (!b.match) return -1;

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

    // Now, return whichever is closer to the search query in length
    if (
      Math.abs(a.match.length - trueLength) <
      Math.abs(b.match.length - trueLength)
    )
      return -1;
    if (
      Math.abs(a.match.length - trueLength) >
      Math.abs(b.match.length - trueLength)
    )
      return 1;

    // Finally, if we're comparing between an archetype and supertype, supertype goes first
    if (a.type === 'supertype' && b.type === 'archetype') return -1;
    if (a.type === 'archetype' && b.type === 'supertype') return 1;

    return 0;
  };
