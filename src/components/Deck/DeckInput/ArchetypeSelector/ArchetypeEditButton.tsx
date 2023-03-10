import { Box, Button, IconButton, Text } from '@chakra-ui/react';
import { FaRegEdit } from 'react-icons/fa';

export interface ArchetypeEditButtonProps {
  onEditOpen: () => void;
}

export const ArchetypeEditButton = (props: ArchetypeEditButtonProps) => (
  <Button
    size='sm'
    colorScheme={'pink'}
    variant='outline'
    rightIcon={<FaRegEdit />}
    onClick={e => {
      e.stopPropagation();
      props.onEditOpen();
    }}
  >
    Add
  </Button>
);
