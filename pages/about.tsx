import { Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { AppLogo } from '../src/components/Layout/AppBar/AppLogo';
import { useTwitterLink } from '../src/hooks/twitter';

export default function AboutPage() {
  const myTwitter = useTwitterLink('jgrimesey');
  const tateTwitter = useTwitterLink('twhitesell42');
  const kashTwitter = useTwitterLink('KashMann27');
  const juTwitter = useTwitterLink('_JuHlien_');
  const simeyTwitter = useTwitterLink('simeydotme');
  const statsTwitter = useTwitterLink('pokestatstcg');

  const RK9Link = () => (
    <Link isExternal href={'https://rk9.gg/'} as={NextLink} color='blue.500'>
      RK9.gg
    </Link>
  );

  return (
    <Stack spacing={12} padding={4}>
      <Stack spacing={6}>
        <Stack>
          <Heading size='md'>What is PokéStats Live?</Heading>
          <Text>
            PokéStats Live is a live tournament tracking tool. Deck archetypes
            can be reported in real time during tournaments, allowing for
            comprehensive metagame analysis as soon Day 1.
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>Where is the data coming from?</Heading>
          <Text>
            {`Player deck data by default originates from reported decks. Any player's deck archetype for any tournament can be submitted by the PokéStats team, which currently consists of `}
            <Link isExternal href={myTwitter} as={NextLink} color='twitter.500'>
              Jared Grimes
            </Link>
            ,{' '}
            <Link
              isExternal
              href={tateTwitter}
              as={NextLink}
              color='twitter.500'
            >
              Tate Whitesell
            </Link>
            , and{' '}
            <Link
              isExternal
              href={kashTwitter}
              as={NextLink}
              color='twitter.500'
            >
              Kashvinder Singh Mann
            </Link>
            .{' '}
            {`Players who are authenticated through logging into PokéStats Live
            can submit deck archetypes for tournaments they are attending.
            Attendance is determined by the player's name appearing in the standings list
            for that tournament at `}
            <RK9Link />
          </Text>
          <Text>
            Tournament data such as name, date, standings, and round pairings
            are from <RK9Link />. This data is retrieved through{' '}
            <Link
              isExternal
              href={'https://pokedata.ovh/'}
              as={NextLink}
              color='blue.600'
            >
              pokedata.ovh
            </Link>
            .
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>What if someone reports the wrong deck?</Heading>
          <Text>
            Ultimately, this is going to be based off the honor system. Even the
            PokéStats team can accidentally misreport a deck. All information
            will be checked to the best of our ability. Procedures have yet to
            be set in stone for if anyone is intentionally spreading
            misinformation about deck archetypes repeatedly, but rest assured
            there will be some procedure.
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>What if I have any questions?</Heading>
          <Text>
            If you have any additional questions or encounter any problems with
            the site, shoot me a message{' '}
            <Link isExternal href={myTwitter} as={NextLink} color='twitter.500'>
              @jgrimesey
            </Link>
            {`. I am the sole developer of this site, so if there's anything wrong, it's my fault!`}
          </Text>
        </Stack>
        <Stack>
          <Heading size='md'>Credits</Heading>
          <Text>
            {`What started off as me in the stats chat joking how we should redo PokéStats... well, turned into me redoing PokéStats! This project wouldn't be possible without the following members/groups:`}
          </Text>
          <Text>
            <RK9Link /> - for all of the outstanding work allowing our
            tournaments run as smoothly as they do. PokéStats Live would not be
            nearly what it is today without {`RK9's`} incredible infrastructure
            and reliability.
          </Text>
          <Text>
            {`Also massive thanks to `}
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
            {` for the mind-boggling work on card effects (seriously, check this guy out), Ryan Shore for the immense amount of product design help, the entirety of the `}
            <Link
              isExternal
              href={statsTwitter}
              as={NextLink}
              color='twitter.500'
            >
              @pokestatstcg
            </Link>
            {` team for the many ideas and support, and Noah Spinale.`}
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
