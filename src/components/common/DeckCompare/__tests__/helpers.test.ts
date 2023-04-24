import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { getDeckHref } from '../helpers';

describe('DeckCompare helpers', () => {
  describe('when getDeckHref is called', () => {
    const mockSupertype: DeckTypeSchema = {
      id: 5,
      type: 'supertype',
      name: 'Lost Box',
      defined_pokemon: ['Comfey', 'Sableye'],
    };

    it('should generate the correct href for a supertype', () => {
      const href = getDeckHref(mockSupertype);
      expect(href).toEqual({
        pathname: '/decks/5',
        query: {},
      });
    });

    it('should generate the correct href for an archetype with a supertype and a format', () => {
      const mockArchetype: DeckTypeSchema = {
        id: 15,
        type: 'archetype',
        name: 'Lost Box Sableye Charizard',
        defined_pokemon: ['Comfey', 'Charizard'],
        supertype: mockSupertype,
      };

      const href = getDeckHref(mockArchetype, 2);
      expect(href).toEqual({
        pathname: '/decks/5/15',
        query: {
          format: 2,
        },
      });
    });

    it('should generate the correct href for an archetype without a supertype', () => {
      const mockArchetype: DeckTypeSchema = {
        id: 10,
        type: 'archetype',
        name: 'Urshifu Inteleon',
        defined_pokemon: ['Urshifu', 'Inteleon'],
      };

      const href = getDeckHref(mockArchetype, 2);
      expect(href).toEqual({
        pathname: '/decks/other/10',
        query: {
          format: 2,
        },
      });
    });
  });
});

export {};
