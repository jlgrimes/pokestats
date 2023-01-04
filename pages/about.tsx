import { Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { AppLogo } from '../src/components/Layout/AppBar/AppLogo';
import { useTwitterLink } from '../src/hooks/twitter';

export default function AboutPage() {
  const myTwitter = useTwitterLink('jgrimesey');
  const juTwitter = useTwitterLink('_JuHlien_');
  const simeyTwitter = useTwitterLink('simeydotme');
  const statsTwitter = useTwitterLink('pokestatstcg');

  return (
    <Stack padding='1.5rem' spacing={12}>
      <Stack spacing={6}>
        <Stack>
          <Heading size='md'>What is Pokestats Live?</Heading>
          <Text>
            Pokestats Live is a live tournament tracking tool. Deck archetypes
            can be reported in real time during tournaments, allowing for
            comprehensive metagame analysis as soon as after Round 9.
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>How are decks reported?</Heading>
          <Text>
            You can report your own deck and opponents you play against if you
            have an account. Deck reports are reviewed by the Pokestats team and
            are surfaced onto the site once deemed accurate. The Pokestats team
            can also submit decks for anyone at the tournament.
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>Where is the data coming from?</Heading>
          <Text>
            Tournament data comes directly from RK9 through{' '}
            <Link
              isExternal
              href={'https://pokedata.ovh/'}
              as={NextLink}
              color='blue.500'
            >
              pokedata.ovh
            </Link>
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>What if I have any questions?</Heading>
          <Text>
            If you have any additional questions or encounter any problems with
            the site, please contact{' '}
            <Link isExternal href={myTwitter} as={NextLink} color='twitter.500'>
              @jgrimesey
            </Link>
            {`. This site was entirely coded by me, so if there's anything wrong, it's my fault!`}
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>Credits</Heading>
          <Text>
            {`This project wouldn't be possible without `}
            <Link isExternal href={juTwitter} as={NextLink} color='twitter.500'>
              @_JuHlien_
            </Link>
            {` for the amazing work on pokedata, `}
            <Link
              isExternal
              href={simeyTwitter}
              as={NextLink}
              color='twitter.500'
            >
              @simeydotme
            </Link>
            {` for the stellar card previews, and the entirety of the `}
            <Link
              isExternal
              href={statsTwitter}
              as={NextLink}
              color='twitter.500'
            >
              @pokestatstcg
            </Link>
            {` team for the many ideas and support. `}
          </Text>
        </Stack>
      </Stack>

      <Text fontSize='xs'>
        This website is not affiliated with, sponsored or endorsed by, or in any
        way associated with The Pokemon Company International
        Inc/Nintendo/Creatures Inc./GAME FREAK Inc./RK9.gg
      </Text>
    </Stack>
  );
}
