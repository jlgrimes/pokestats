import { Flex } from '@chakra-ui/react';
import Image from 'next/image';

interface SpriteDisplayProps {
  pokemonNames: string[];
}

export default function SpriteDisplay(props: SpriteDisplayProps) {
  const spritebaseUrl =
    'https://limitlesstcg.s3.us-east-2.amazonaws.com/pokemon/gen8-v3';

  return (
    <Flex>
      {props.pokemonNames.map((name, idx) => (
        <Image key={idx} src={`${spritebaseUrl}/${name.toLowerCase()}.png`} alt={name} width={30} height={30} />
      ))}
    </Flex>
  );
}
