import {
  Modal,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useIsMobile } from '../../../../hooks/device';
import { OpponentRoundListContent } from './OpponentRoundListContent';
interface OpponentRoundListProps {
  tournament: Tournament;
  player: Standing;
  modalOpen: boolean;
  handleCloseModal: () => void;
}

export const OpponentRoundList = (props: OpponentRoundListProps) => {
  const { tournament, player, modalOpen, handleCloseModal } = props;

  const isMobile = useIsMobile();

  return (
    <Modal isOpen={modalOpen} onClose={handleCloseModal} size='md'>
      <ModalOverlay />
      {modalOpen && (
        <ModalContent margin={isMobile ? 'auto' : 0}>
          <OpponentRoundListContent tournament={tournament} player={player} />
        </ModalContent>
      )}
    </Modal>
  );
};
