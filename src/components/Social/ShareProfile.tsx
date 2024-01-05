import { IconButton, useToast } from '@chakra-ui/react';
import { FaCopy, FaShare, FaShareAlt, FaShareAltSquare } from 'react-icons/fa';
import { useIsMobile } from '../../hooks/device';
import { trackEvent } from '../../lib/track';

interface ShareProfileProps {
  username: string;
}

export const ShareProfile = (props: ShareProfileProps) => {
  const isMobile = useIsMobile();
  const toast = useToast();

  const handleClick = async () => {
    const url = `https://pokestats.live/player/${props.username}`;

    trackEvent('Share profile button clicked');

    if (isMobile && !!navigator.share) {
      try {
        await navigator.share({
          title: `Follow ${props.username} on PokéStats Live`,
          url: window.location.href,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) {
        console.log(err);
      }

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
      icon={<FaCopy />}
      onClick={handleClick}
    />
  );
};
