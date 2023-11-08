import { useQuery } from "@tanstack/react-query";
import { MapCenter } from "./types";

const fetchEvents = async (center: MapCenter, shouldShowLocals?: boolean): Promise<Record<any, any>[]> => {
  const res = await fetch(`/api/events/?lat=${center.lat}&lng=${center.lng}`);
  const data = await res.json();
  const events = data['activities'];

  if (shouldShowLocals) return events;

  return events?.filter((event: Record<any, any>) => event.tags.includes('championship_series'));
}

export const useEvents = (center: MapCenter, shouldShowLocals?: boolean) => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(center)
  });
}