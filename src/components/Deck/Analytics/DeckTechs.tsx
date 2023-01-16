import { Deck } from "../../../../types/tournament";
import { useFinalResults, useTechs } from "../../../hooks/finalResults";

export const DeckTechs = ({ deck }: { deck: Deck}) => {
  const techs = useTechs(deck);
  console.log(techs)

  return (
    <div></div>
  )
}