import { useQuery } from "@tanstack/react-query";
import { MOCK_RESEARCH_BARS, MOCK_RESEARCH_BARS_DEFAULT } from "../../lib/mockData";

async function fetchResearchBars(symbol: string): Promise<number[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_RESEARCH_BARS[symbol] ?? MOCK_RESEARCH_BARS_DEFAULT;
}

export function useResearchBarsQuery(symbol: string | null) {
  return useQuery({
    queryKey: ["research", "bars", symbol],
    queryFn: () => fetchResearchBars(symbol as string),
    enabled: !!symbol, // don't fetch until a symbol is actually selected
  });
}