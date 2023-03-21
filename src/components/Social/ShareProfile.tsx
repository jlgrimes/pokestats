import { IconButton, useToast } from '@chakra-ui/react';
import { FaCopy, FaShare, FaShareAlt, FaShareAltSquare } from 'react-icons/fa';
import { useIsMobile } from '../../hooks/device';

interface ShareProfileProps {
  username: string;
}

export const ShareProfile = (props: ShareProfileProps) => {
  const isMobile = useIsMobile();
  const toast = useToast();

  const handleClick = () => {
    const url = `https://pokestats.live/player/${props.username}`;

    if (isMobile && !!navigator.share) {
      navigator.share({
        title: `Follow ${props.username} on PokéStats Live`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        status: 'info',
        title: 'Player link copied to clipboard',
      });
    }
  };

  return (
    <IconButton
      colorScheme={'blue'}
      size='sm'
      aria-label='share profile'
      icon={<FaShare />}
      onClick={handleClick}
    />
  );
};
