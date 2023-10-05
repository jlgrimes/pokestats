import { Box } from '@chakra-ui/react';
import { CombinedPlayerProfile } from '../../../../../types/player';
import { Tournament } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { TournamentCard } from '../../../TournamentList/TournamentCard';
import { SearchResultSchema } from './search-types';
import { ArchetypeCard } from './SearchResults/ArchetypeCard';
import { PlayerCard } from './SearchResults/PlayerCard';

interface SearchResultProps {
  result: SearchResultSchema;
  handleClose: () => void;
}

export const SearchResult = (props: SearchResultProps) => {
  if (props.result.type === 'player') {
    return (
      <PlayerCard
        player={props.result.data as CombinedPlayerProfile}
        handleClose={props.handleClose}
      />
    );
  }

  if (props.result.type === 'tournament') {
    return (
      <Box onClick={props.handleClose}>
        <TournamentCard
          tournament={props.result.data as Tournament}
        />
      </Box>
    );
  }

  if (props.result.type === 'archetype' || props.result.type === 'supertype') {
    return (
      <Box onClick={props.handleClose}>
        <ArchetypeCard deck={props.result.data as DeckTypeSchema} />
      </Box>
    );
  }

  return null;
};
