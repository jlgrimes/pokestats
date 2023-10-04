import { Card } from "@chakra-ui/react";
import { Tournament } from "../../../../../types/tournament"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react"
import { useRouter } from "next/router"
import { useCallback, useMemo, useState } from "react";
import { TopCutView } from "./TopCutView";

interface AgeDivisionSelectorProps {
  urlConstructor: (ageDivision: string) => string;
}

export const AgeDivisionSelector = (props: AgeDivisionSelectorProps) => {
  const router = useRouter();
  const path = router.asPath;

  const getSelectedIndex = useCallback(() => {
    if (path.includes('juniors')) return 2;
    if (path.includes('seniors')) return 1;
    return 0;
  }, [path]);

  const index = getSelectedIndex();

  const handleTabClick = useCallback((division: string) => {
    if (division === 'masters' && index === 0) return;
    if (division === 'seniors' && index === 1) return;
    if (division === 'juniors' && index === 2) return;

    router.push(props.urlConstructor(division))
  }, [index]);

  return (
    <TabGroup className="mt-2 mb-8" index={index}>
      <TabList variant="solid">
        <Tab onClick={() => handleTabClick('masters')}>Masters</Tab>
        <Tab onClick={() => handleTabClick('seniors')}>Seniors</Tab>
        <Tab onClick={() => handleTabClick('juniors')}>Juniors</Tab>
      </TabList>
    </TabGroup>
  )
}

interface TopCutViewContainerProps {
  tournament: Tournament;
}

export const TopCutViewContainer = (props: TopCutViewContainerProps) => {
  const [selectedDivision, setSelectedDivision] = useState(0);

  const ageDivision = useMemo(() => {
    if (selectedDivision === 2) return 'juniors';
    if (selectedDivision === 1) return 'seniors';
    return 'masters';
  }, [selectedDivision]);

  return (
    <Card>
      <TabGroup className="mt-2 mb-8" index={selectedDivision}>
        <TabList variant="solid">
          <Tab onClick={() => setSelectedDivision(0)}>Masters</Tab>
          <Tab onClick={() => setSelectedDivision(1)}>Seniors</Tab>
          <Tab onClick={() => setSelectedDivision(2)}>Juniors</Tab>
        </TabList>
        <TopCutView tournament={props.tournament} ageDivision={ageDivision} />
      </TabGroup>
    </Card>
  )
}