import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

export const BackToDecksButton = memo(() => {
  const router = useRouter();

  return (
    <div>
      <Button
        paddingLeft={0}
        size='sm'
        variant='ghost'
        leftIcon={<FaChevronLeft />}
        onClick={() => router.push('/decks')}
      >
        All decks
      </Button>
    </div>
  );
});

BackToDecksButton.displayName = 'BackToDecksButton';
