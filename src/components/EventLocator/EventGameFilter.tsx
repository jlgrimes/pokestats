import { Bold, Tab, TabGroup, TabList } from "@tremor/react";
import { EventGame } from "./types";

interface EventGameFilterProps {
  game: EventGame;
  setGame: (game: EventGame) => void;
}

export const EventGameFilter = (props: EventGameFilterProps) => {
  const gameList: EventGame[] = ['tcg', 'pgo'];

  return (
    <TabGroup>
      <TabList variant="solid">
        {gameList.map((game) => (
          <Tab onClick={() => props.setGame(game)}><Bold className="text-sm">{game.toUpperCase()}</Bold></Tab>
        ))}
      </TabList>
    </TabGroup>
  )
}