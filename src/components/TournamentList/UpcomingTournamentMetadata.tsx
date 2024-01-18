import { Flex, Icon, Subtitle, Text } from '@tremor/react';
import { Tournament } from "../../../types/tournament"
import { formatDistance } from 'date-fns';
import { Link } from '@chakra-ui/react';
import { IconInfoCircle, IconMapPin } from '@tabler/icons-react';

interface UpcomingTournamentMetadataProps {
  tournament: Tournament;
}

export const UpcomingTournamentMetadata = (props: UpcomingTournamentMetadataProps) => {
  const tournamentOrganizer = props.tournament.metadata?.['Event organizer'].find((str) => str.includes('http://') || str.includes('https://'));
  const listSubmissionClosesTime = props.tournament.metadata?.['List submission closes'];
  const roundOneStartTime = props.tournament.metadata?.['Tournament start'];
  const venue = props.tournament.metadata?.['Venue'];
  const updatedAt = props.tournament.metadata?.['updated-at']
  const updatedAtDate = Date.parse(updatedAt as unknown as string + 'Z');

  return (
    <div className='flex flex-col'>
      {
        venue && (
          <div className="flex items-center gap-1">
            <Icon className='py-1' icon={IconMapPin} size='sm' variant='simple' color='neutral' />
            <Link isExternal href={`https://www.google.com/maps/search/?api=1&query=${venue[0]}`}>
              <Text className='font-medium text-blue-600 dark:text-blue-500'>{venue[0]}</Text>
            </Link>
          </div>
        )
      }
      {tournamentOrganizer && (
        <div className="flex items-center gap-1">
          <Icon className='py-1' icon={IconInfoCircle} size='sm' variant='simple' color='neutral' />
          <Link isExternal href={tournamentOrganizer}>
              <Text className='font-medium text-blue-600 dark:text-blue-500'>{tournamentOrganizer?.replace('http://', '').replace('https://', '').split('/')[0]}</Text>
            </Link>
        </div>
      )}
      <div className='flex flex-col gap-2 mt-6'>
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
      {
        updatedAt && updatedAtDate && !isNaN(updatedAtDate) && (
          <Subtitle className='text-sm mt-6'>Updated {formatDistance(updatedAtDate, Date.now(), { addSuffix: true })}</Subtitle>
        )
      }
    </div>
  )
}