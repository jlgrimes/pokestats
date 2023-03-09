import { Box, IconButton, Text } from '@chakra-ui/react';
import { FaRegEdit } from 'react-icons/fa';

export interface ArchetypeEditButtonProps {
  onEditOpen: () => void;
}

export const ArchetypeEditButton = (props: ArchetypeEditButtonProps) => (
  <Box
    height='30px'
    paddingY={0.5}
    display='flex'
    alignItems='center'
    justifyContent={'center'}
    gap={1}
    onClick={e => {
      e.stopPropagation();
      props.onEditOpen();
    }}
  >
    <Text
      fontSize={12}
      textTransform={'uppercase'}
      fontWeight='bold'
      color='pink.500'
    >
      Report
    </Text>
    <IconButton
      icon={<FaRegEdit />}
      aria-label='edit'
      variant={'ghost'}
      width={4}
      minWidth={0}
      size='sm'
      color='pink.500'
      paddingX={0}
    />
  </Box>
);
