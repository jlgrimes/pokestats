import { EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Card,
  CardHeader,
  Heading,
  Stack,
  Table,
  TableContainer,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { formatDistance, parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AccountRequestCard } from '../../src/components/Admin/AccountRequestCard';
import {
  useAllReportActivity,
  useUserIsAdmin,
} from '../../src/hooks/administrators';
import { useTournaments } from '../../src/hooks/tournaments';
import { parseUsername } from '../../src/lib/strings';

export default function ReportActivity() {
  const { data: userIsAdmin, isLoading: userIsAdminLoading } = useUserIsAdmin();
  const router = useRouter();
  const { data: reportActivity } = useAllReportActivity();
  const { data: tournaments } = useTournaments();

  useEffect(() => {
    if (!userIsAdmin && !userIsAdminLoading) {
      router.push('/');
    }
  }, [userIsAdmin, userIsAdminLoading, router]);

  return (
    <Stack width='90vw'>
      <Heading size='sm'>Reporting activity</Heading>
      <TableContainer>
        <Table size={'sm'}>
          <Thead>
            <Tr>
              <Th>Date (ago)</Th>
              <Th>Uploader</Th>
              <Th>Tournament</Th>
              <Th>Player</Th>
            </Tr>
          </Thead>
          {reportActivity?.map(report => (
            <Tr
              key={
                report.user_who_submitted +
                report.player_name +
                report.tournament_id
              }
            >
              <Td>{formatDistance(parseISO(report.created_at), new Date())}</Td>
              <Td>{parseUsername(report.user_who_submitted)}</Td>
              <Td>
                {
                  tournaments?.find(({ id }) => report.tournament_id === id)
                    ?.name
                }
              </Td>
              <Td>{report.player_name}</Td>
            </Tr>
          ))}
        </Table>
      </TableContainer>
    </Stack>
  );
}
