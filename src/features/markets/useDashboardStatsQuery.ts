import { useQuery } from "@tanstack/react-query";
import { MOCK_DASHBOARD_STATS } from "../../lib/mockData";

async function fetchDashboardStats() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_DASHBOARD_STATS;
}

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchDashboardStats,
  });
}