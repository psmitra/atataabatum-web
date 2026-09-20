import { useQuery } from "@tanstack/react-query";
import { MOCK_PORTFOLIO_SUMMARY } from "../../lib/mockData";

async function fetchPortfolioSummary() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_PORTFOLIO_SUMMARY;
}

export function usePortfolioSummaryQuery() {
  return useQuery({
    queryKey: ["portfolio", "summary"],
    queryFn: fetchPortfolioSummary,
  });
}