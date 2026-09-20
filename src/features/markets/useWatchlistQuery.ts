import { useQuery } from "@tanstack/react-query";
import { MOCK_WATCHLIST, type WatchlistItem } from "../../lib/mockData";

async function fetchWatchlist(): Promise<WatchlistItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_WATCHLIST;
}

export function useWatchlistQuery() {
  return useQuery({
    queryKey: ["watchlist"],
    queryFn: fetchWatchlist,
  });
}
