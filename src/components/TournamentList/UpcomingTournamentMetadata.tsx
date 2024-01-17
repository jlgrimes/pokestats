import { Bold, Card, Flex, Grid, Icon, Text } from '@tremor/react';
import { Tournament } from "../../../types/tournament"
import { format, formatDistanceToNow, formatDistanceToNowStrict, formatDuration, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';
import { Link } from '@chakra-ui/react';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { LocationWithIcon } from '../EventLocator/LocationWithIcon';
import { IconInfoCircle } from '@tabler/icons-react';

interface UpcomingTournamentMetadataProps {
  tournament: Tournament;
}

const useLiveCurrentTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(
    () => {
      const intervalId = setInterval(() => {
      
        setTime(new Date());
      }, 1000);
      return () => {
        clearInterval(intervalId)
      }
    } 
  )

  return time;
}

export const UpcomingTournamentMetadata = (props: UpcomingTournamentMetadataProps) => {
  const tournamentOrganizer = props.tournament.metadata?.['Event organizer'].find((str) => str.includes('http://') || str.includes('https://'));
  const listSubmissionClosesTime = props.tournament.metadata?.['List submission closes'];
  const roundOneStartTime = props.tournament.metadata?.['Tournament start'];
  const venue = props.tournament.metadata?.['Venue'];

  return (
    <div className='flex flex-col'>
      {
        venue && (
          <LocationWithIcon>
            <Link isExternal href={`https://www.google.com/maps/search/?api=1&query=${venue[0]}`}>
              <Text className='font-medium text-blue-600 dark:text-blue-500'>{venue[0]}</Text>
            </Link>
          </LocationWithIcon>
        )
      }
      {tournamentOrganizer && (
        <div className="flex items-center">
          <Icon className="pl-0" icon={IconInfoCircle} size='sm' variant='simple' color='neutral' />
          <Link isExternal href={tournamentOrganizer}>
              <Text className='font-medium text-blue-600 dark:text-blue-500'>{tournamentOrganizer?.replace('http://', '').replace('https://', '')}</Text>
            </Link>
        </div>
      )}
      <div className='flex flex-col gap-1 mt-4'>
        {
          listSubmissionClosesTime && (
            <Flex>
              <Text>Lists due:</Text>
              <Text>{listSubmissionClosesTime.join(' ').split('(')[0]}</Text>
            </Flex>
          )
        }
        {
          roundOneStartTime && (
            <Flex>
              <Text>Round 1 start:</Text>
              <Text>{roundOneStartTime.slice(0, 2).join(' ').split('(')[0]}</Text>
            </Flex>
          )
        }
      </div>
    </div>
  )
}