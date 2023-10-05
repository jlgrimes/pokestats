import { Card } from "@chakra-ui/react";
import { Tournament } from "../../../../../types/tournament"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@tremor/react"
import { useMemo, useState } from "react";
import { TopCutView } from "./TopCutView";

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