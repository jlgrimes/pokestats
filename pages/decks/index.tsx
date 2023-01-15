import { useStoredDecks } from '../../src/hooks/finalResults';

export default function DecksPage() {
  const decks = useStoredDecks();
  console.log(decks)
  return <div></div>;
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 10,
  };
}
