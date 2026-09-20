import { useQuery } from "@tanstack/react-query";
import { MOCK_HOLDINGS, type Holding } from "../../lib/mockData";

async function fetchHoldings(): Promise<Holding[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_HOLDINGS;
}

export function usePortfolioQuery() {
  return useQuery({
    queryKey: ["portfolio", "holdings"],
    queryFn: fetchHoldings,
  });
}