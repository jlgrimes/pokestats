import { useQuery } from "@tanstack/react-query";
import { MapCenter } from "./types";

const fetchEvents = async (center: MapCenter): Promise<Record<any, any>[]> => {
  const res = await fetch(`/api/events/?lat=${center.lat}&lng=${center.lng}`);
  const data = await res.json();
  return data['activities'];
}

export const useEvents = (center: MapCenter) => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(center)
  })
}