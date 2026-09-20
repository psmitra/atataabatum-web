import { useQuery } from "@tanstack/react-query";
import { MOCK_INSTRUMENTS, type Instrument } from "../../lib/mockData";

async function fetchInstruments(): Promise<Instrument[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_INSTRUMENTS;
}

export function useInstrumentsQuery() {
  return useQuery({
    queryKey: ["instruments"],
    queryFn: fetchInstruments,
  });
}