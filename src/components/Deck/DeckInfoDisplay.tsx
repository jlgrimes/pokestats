import { IconButton, Stack, StackItem, useDisclosure } from '@chakra-ui/react';
import { memo } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { Standing, Tournament } from '../../../types/tournament';
import { StandingsInfoMenu } from '../DataDisplay/Standings/StandingsInfoMenu';
import DeckInput from './DeckInput/DeckInput';

export const DeckInfoDisplay = memo(
  ({
    player,
    tournament,
    enableEdits,
    shouldShowAsText,
    disableList,
    shouldHideDeck,
    shouldHideVerifiedIcon,
  }: {
    player: Standing;
    tournament: Tournament;
    enableEdits: boolean;
    shouldShowAsText?: boolean;
    disableList?: boolean;
    shouldHideDeck?: boolean;
    shouldHideVerifiedIcon?: boolean;
  }) => {
    const archetypeModal = useDisclosure();
    return (
      <Stack direction={'row'} spacing={0} alignItems='center'>
        <StackItem>
          <DeckInput
            tournamentId={tournament.id}
            playerName={player.name}
            deck={player.deck}
            archetypeModal={archetypeModal}
            shouldShowAsText={shouldShowAsText}
            shouldHideDeck={shouldHideDeck}
            shouldHideVerifiedIcon={shouldHideVerifiedIcon}
          />
        </StackItem>

        <StandingsInfoMenu result={player} tournament={tournament} onEditOpen={archetypeModal.onOpen} enableEdits={enableEdits}/>

        {/* {player?.deck?.list && !disableList && (
          <ListViewerOpenButton result={player} tournament={tournament} />
        )}
        {enableEdits && (
          <IconButton
            maxWidth={'2'}
            icon={<FaRegEdit />}
            aria-label='edit'
            variant={'ghost'}
            width={'100%'}
            size='md'
            color='gray.400'
            paddingRight={0}
            onClick={archetypeModal.onOpen}
          />
        )} */}
      </Stack>
    );
  }
);

DeckInfoDisplay.displayName = 'DeckInfoDisplay';
