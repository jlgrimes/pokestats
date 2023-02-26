import {
  Grid,
  IconButton,
  Stack,
  StackItem,
  useDisclosure,
} from '@chakra-ui/react';
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
    shouldHideOpponentView,
    onUnpinPlayer,
    shouldHideMenu,
  }: {
    player: Standing;
    tournament: Tournament;
    enableEdits: boolean;
    shouldShowAsText?: boolean;
    disableList?: boolean;
    shouldHideDeck?: boolean;
    shouldHideVerifiedIcon?: boolean;
    shouldHideOpponentView?: boolean;
    onUnpinPlayer?: () => void;
    shouldHideMenu?: boolean;
  }) => {
    const archetypeModal = useDisclosure();
    return (
      <Grid
        gridTemplateColumns={shouldShowAsText ? 'auto 1fr' : '85px 1fr'}
        alignItems='center'
      >
        <StackItem>
          <DeckInput
            tournamentId={tournament.id}
            playerName={player.name}
            deck={player.deck ?? undefined}
            archetypeModal={archetypeModal}
            shouldShowAsText={shouldShowAsText}
            shouldHideDeck={shouldHideDeck}
            shouldHideVerifiedIcon={shouldHideVerifiedIcon}
          />
        </StackItem>

        {!shouldHideMenu && (
          <StandingsInfoMenu
            result={player}
            tournament={tournament}
            onEditOpen={archetypeModal.onOpen}
            enableEdits={enableEdits}
            shouldHideOpponentView={shouldHideOpponentView}
            onUnpinPlayer={onUnpinPlayer}
          />
        )}

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
      </Grid>
    );
  }
);

DeckInfoDisplay.displayName = 'DeckInfoDisplay';
