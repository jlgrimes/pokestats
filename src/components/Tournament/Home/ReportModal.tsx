import { useDisclosure, UseDisclosureProps, useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { Fragment, useState } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { usePlayerDecks } from '../../../hooks/playerDecks';
import { ArchetypeSelectorModal } from '../../Deck/DeckInput/ArchetypeSelector/ArchetypeSelectorModal';
import { handleDeckSubmit } from '../../Deck/DeckInput/helpers';
import { PlayerSelectModal } from './PinnedPlayers/PlayerSelectModal';
import { useStandings } from '../../../hooks/newStandings';

interface ReportModalProps {
  tournament: Tournament;
  playerSelectModalControls: UseDisclosureProps;
}

export const ReportModal = (props: ReportModalProps) => {
  const user = useUser();
  const toast = useToast();
  const { data: playerDecks, refetch } = usePlayerDecks(props.tournament.id, { shouldDisableFetch: !props.playerSelectModalControls.isOpen });
  const { data: userIsAdmin } = useUserIsAdmin();

  const { data: playerNames } = useStandings({ tournament: props.tournament, ageDivision: 'masters' });

  const [selectedPlayer, setSelectedPlayer] = useState<string | undefined>();
  const [isStreamDeck, setIsStreamDeck] = useState(false);

  const archetypeModalControls = useDisclosure();

  const handlePlayerSelect = (name: string) => {
    setSelectedPlayer(name);
    props.playerSelectModalControls.onClose &&
      props.playerSelectModalControls.onClose();

    archetypeModalControls.onOpen();
  };

  const handleDeckSelect = async (deck: Deck) => {
    setIsStreamDeck(false);
    await handleDeckSubmit(
      deck,
      playerDecks.find(playerDeck => playerDeck.name === selectedPlayer)
        ?.deck_archetype ?? undefined,
      selectedPlayer,
      user?.email,
      props.tournament,
      isStreamDeck,
      userIsAdmin,
      toast
    );
    refetch();
  };

  return (
    <Fragment>
      {(props.playerSelectModalControls.isOpen ||
        archetypeModalControls.isOpen) && (
        <Fragment>
          <PlayerSelectModal
            tournament={props.tournament}
            modalControls={props.playerSelectModalControls}
            playerNames={playerNames?.map(({ name }) => name) ?? []}
            handleSubmit={handlePlayerSelect}
          />
          <ArchetypeSelectorModal
            onChange={handleDeckSelect}
            tournament={props.tournament}
            modalControls={archetypeModalControls}
            userIsAdmin={true}
            isListUp={false}
            isStreamDeck={isStreamDeck}
            toggleIsStreamDeck={() => setIsStreamDeck(!isStreamDeck)}
          />
        </Fragment>
      )}
    </Fragment>
  );
};
