import {
  Flex,
  Heading,
  Highlight,
  Link,
  ListItem,
  Stack,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { AppLogo } from '../src/components/Layout/AppBar/AppLogo';
import { useTwitterLink } from '../src/hooks/twitter';

export default function HelpPage() {
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
    <Stack>
      <AppLogo big />
      <Stack spacing={12} padding={4}>
        <Stack spacing={6}>
          <Stack>
            <Heading size='md'>What is PokéStats Live?</Heading>
            <Text>
              PokéStats Live is a tournament companion app and deck analysis hub
              for major Pokémon TCG events.
            </Text>
          </Stack>
          <Stack>
            <Heading size='md'>
              <Highlight
                query='LIVE'
                styles={{ px: '2', py: '1', rounded: 'full', bg: 'green.100' }}
              >
                {`Keep up with tournaments LIVE`}
              </Highlight>
            </Heading>
            <Text>
              With PokéStats Live, <b>view player deck choices</b> while the
              tournament is live. Decks will show up if they are known, but will
              be hidden if day one has not completed.
            </Text>
            <Text>
              <b>{`Where's stream?`}</b> Right on the PokéStats Live home page!
              Twitch streams for ongoing tournaments will be big and purple on
              both the home page and tournament home pages.
            </Text>
            <Text>
              Curious to what matchups your friend faced?{' '}
              <b>View opponent matchups</b> straight from PokéStats Live just by
              tapping on the player.
            </Text>
            <Text>
              Pin your friends on your own tournament page with <b>Favorites</b>{' '}
              so you can cheer them on each and every round. Current record,
              deck archetype and opponent deck archetype are all available for
              each of your favorites, so you can stop scrolling on the pairings
              page until you hit their name.
            </Text>
          </Stack>
          <Stack>
            <Heading size='md'>
              <Highlight
                query='Analyze'
                styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
              >
                {`Analyze post-tournament results`}
              </Highlight>
            </Heading>
            <Text>
              Get <b>comprehensive day two deck analysis</b> for each
              tournament. See what percentage of people were playing each deck
              day two at a glance. Find out how many people played three Lugia
              VSTAR vs two by clicking on the card in the deck list viewer.
            </Text>
            <Text>
              Tired of all those sideways deck photos on your
              vertically-oriented phone? Now you can{' '}
              <b>view deck lists vertically</b> that perfectly align with the
              viewport on your phone. Just screenshot and send, no more holding
              and saving pictures to share a deck.
            </Text>
            <Text>
              See <b>overall card usage per archetype</b> by going to Decks in
              the sidebar, or by tapping on the decks at the bottom of each
              tournament page. You can also see how the lists have changed over
              time by viewing all results with that deck across the season.
            </Text>
          </Stack>
          <Heading size='md'>FAQs</Heading>
          <Stack>
            <Heading size='sm'>Is this website by Pokémon?</Heading>
            <Text>
              This website is not affiliated with, sponsored or endorsed by, or
              in any way associated with The Pokemon Company International
              Inc/Nintendo/Creatures Inc./GAME FREAK Inc./RK9.gg. This website
              was made solely for the community because I love this game and
              wanted to make something cool!
            </Text>
          </Stack>
          <Stack>
            <Heading size='sm'>Where is the data coming from?</Heading>
            <Text>
              {`Player deck data by default originates from reported decks. Any player's deck archetype for any tournament can be submitted by the PokéStats team, which currently consists of `}
              <Link
                isExternal
                href={myTwitter}
                as={NextLink}
                color='twitter.500'
              >
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
            <Heading size='sm'>Is this only for the Masters division?</Heading>
            <Text>
              The only currently supported age division is Masters for the
              Trading Card Game on PokéStats Live. We will work to support other
              age divisions in the future.
            </Text>
          </Stack>
          <Stack>
            <Heading size='sm'>What if someone reports the wrong deck?</Heading>
            <Text>
              Ultimately, this is going to be based off the honor system. Even
              the PokéStats team can accidentally misreport a deck. All
              information will be checked to the best of our ability. Procedures
              have yet to be set in stone for if anyone is intentionally
              spreading misinformation about deck archetypes repeatedly, but
              rest assured there will be some procedure.
            </Text>
          </Stack>
          <Stack>
            <Heading size='sm'>What if I have additional questions?</Heading>
            <Text>
              If you have any additional questions or encounter any problems
              with the site, email us {` at `}
              <Link
                isExternal
                href={'mailto:help@pokestats.live'}
                as={NextLink}
                color='blue.500'
              >
                help@pokestats.live
              </Link>
            </Text>
          </Stack>
          <Stack>
            <Heading size='md'>Credits</Heading>
            <Text>
              {`What started off as me in the stats chat joking how we should redo PokéStats... well, turned into me redoing PokéStats! This project wouldn't be possible without the following members/groups:`}
            </Text>
            <Text>
              {`Jared Grimes `}
              <Link
                isExternal
                href={myTwitter}
                as={NextLink}
                color='twitter.500'
              >
                @jgrimesey
              </Link>
              {` - me! I developed this site myself, so if you encounter anything wrong, there's nobody else to blame!`}
            </Text>
            <Text>
              <RK9Link /> - for all of the outstanding work allowing our
              tournaments run as smoothly as they do. PokéStats Live would not
              be nearly what it is today without {`RK9's`} incredible
              infrastructure and reliability.
            </Text>
            <Text>
              {`Also massive thanks to `}
              <Link
                isExternal
                href={juTwitter}
                as={NextLink}
                color='twitter.500'
              >
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
      </Stack>
    </Stack>
  );
}
