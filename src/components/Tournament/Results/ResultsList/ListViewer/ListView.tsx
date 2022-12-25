import { Heading, Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useCodeToSetMap } from '../../../../../hooks/deckList';

export const ListView = ({ deckList }: { deckList: Record<string, any> }) => {
  const codeToSetMap = useCodeToSetMap();

  const getCardImageUrl = (card: {
    name: string;
    number: string;
    set: string;
  }) => {
    let set = codeToSetMap?.[card.set];
    if (card.number.includes('SWSH')) {
      set = 'swshp'
    }

    return `https://images.pokemontcg.io/${set}/${card?.number}.png`;
  };

  return (
    <Stack direction={'row'}>
      {['Pokemon', 'Trainer', 'Energy'].map((superclass, idx) => (
        <Stack key={idx}>
          <Heading size='sm'>{superclass}</Heading>
          {deckList[superclass.toLowerCase()].map(
            (
              card: { name: string; number: string; set: string },
              idx: number
            ) => (
              <Image
                key={idx}
                width={100}
                height={150}
                src={getCardImageUrl(card)}
                alt={`${card.name} ${card.set}`}
              />
            )
          )}
        </Stack>
      ))}
    </Stack>
  );
};
