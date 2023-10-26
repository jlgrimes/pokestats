import { LinkBox, LinkOverlay } from "@chakra-ui/react";
import { VgcTournament } from "./useVgcTournaments";
import { Badge, Card, Flex, Subtitle, Title } from "@tremor/react";
import NextLink from 'next/link';
import { TournamentStatusBadges } from "../../components/TournamentList/TournamentStatusBadges";
import { Tournament } from "../../../types/tournament";
import { formatTournamentDate } from "../../components/TournamentList/helpers";

interface VgcTournamentLinkProps {
  tournament: VgcTournament;
}

export const VgcTournamentLink = (props: VgcTournamentLinkProps) => {
  return (
    <LinkBox height='100%'>
      <Card decoration={props.tournament.tournamentStatus === 'running' ? 'left' : undefined} className='flex flex-col gap-6 px-6 py-4'>
        <Flex>
          <div>
            <LinkOverlay as={NextLink} href={`/vgc/tournaments/${props.tournament.id}/masters`}>
              <Title>{props.tournament.name}</Title>
            </LinkOverlay>
            <div className='flex gap-2'>
              <Subtitle>{formatTournamentDate(props.tournament as unknown as Tournament)}</Subtitle>
              <TournamentStatusBadges tournament={props.tournament as unknown as Tournament} hasVagueTime />
            </div>
          </div>
          {/* {countryCode ? <CountryFlag countryCode={countryCode} size={'sm'} /> : null} */}
        </Flex>
      </Card>
    </LinkBox>
  )
}