import { Tournament } from "../../../types/tournament";
import { getTournamentFormat } from "./helpers";

describe('when getTournamentFormat is called', () => {
  const formats = [{
    id: 1,
    format: 'standard',
    rotation: 'D',
    start_date: '9-10-2021'
  }, {
    id: 2,
    format: 'standard',
    rotation: 'E',
    start_date: '4-9-2023'
  }];

  it('should correctly assign format for tournament after rotation', () => {
    const tournament = {
      date: {
        start: '4-10-2023'
      }
    } as Tournament;

    const mostRecentFormat = getTournamentFormat(formats, tournament);

    expect(mostRecentFormat).toEqual({
      id: 2,
      format: 'standard',
      rotation: 'E',
      start_date: '4-9-2023'
    })
  });

  it('should correctly assign format for tournament on rotation day', () => {
    const tournament = {
      date: {
        start: '4-9-2023'
      }
    } as Tournament;

    const mostRecentFormat = getTournamentFormat(formats, tournament);

    expect(mostRecentFormat).toEqual({
      id: 2,
      format: 'standard',
      rotation: 'E',
      start_date: '4-9-2023'
    })
  });
});

export {};