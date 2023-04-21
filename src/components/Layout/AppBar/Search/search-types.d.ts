export type SearchResultType =
  | 'player'
  | 'tournament'
  | 'archetype'
  | 'supertype';

export interface SearchResultSchema {
  type: SearchResultType;
  data: Record<any, any>;
  match: string | null | undefined;
}
