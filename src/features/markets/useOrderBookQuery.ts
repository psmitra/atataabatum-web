import { useQuery } from "@tanstack/react-query";
import { MOCK_ORDER_BOOK } from "../../lib/mockData";

async function fetchOrderBook() {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return MOCK_ORDER_BOOK;
}

export function useOrderBookQuery() {
  return useQuery({
    queryKey: ["orderBook"],
    queryFn: fetchOrderBook,
  });
}