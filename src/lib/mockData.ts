// ============================================================
// CENTRAL MOCK DATA
// ============================================================

// ---- Watchlist ----
export type WatchlistItem = {
  symbol: string;
  price: number;
  change: number;
};

export const MOCK_WATCHLIST: WatchlistItem[] = [
  { symbol: "GTCO", price: 128.4, change: 1.8 },
  { symbol: "MTNN", price: 96.2, change: -0.6 },
  { symbol: "DANGCEM", price: 212.75, change: 1.8 },
  { symbol: "ZENITH", price: 41.05, change: -0.6 },
  { symbol: "SEPLAT", price: 75.6, change: 1.8 },
];

// ---- Portfolio ----
export type Holding = {
  symbol: string;
  qty: number;
  value: number;
  pl: number;
};

export const MOCK_HOLDINGS: Holding[] = [
  { symbol: "GTCO", qty: 500, value: 64200, pl: 4.2 },
  { symbol: "MTNN", qty: 150, value: 14430, pl: -0.7 },
  { symbol: "DANGCEM", qty: 80, value: 17020, pl: 0.4 },
  { symbol: "ZENITH", qty: 400, value: 16420, pl: 2.6 },
  { symbol: "SEPLAT", qty: 120, value: 9072, pl: -1.4 },
];

export const MOCK_PORTFOLIO_SUMMARY = {
  totalValue: 842300,
  todayChangePercent: 1.9,
  cash: 24100,
};

// ---- Order / Trade defaults ----
export const MOCK_AVAILABLE_CASH = 24100;

// ---- Research: per-symbol chart bar heights ----
// Percent values (0-100) used to render the mock bar chart on Research
export const MOCK_RESEARCH_BARS: Record<string, number[]> = {
  GTCO: [40, 65, 45, 80, 60],
  MTNN: [55, 40, 70, 35, 50],
  DANGCEM: [60, 75, 50, 65, 45],
  ZENITH: [35, 55, 40, 60, 70],
  SEPLAT: [50, 30, 65, 80, 55],
};
export const MOCK_RESEARCH_BARS_DEFAULT: number[] = [40, 65, 45, 80, 60];

// ---- Dashboard: top stat cards ----
export const MOCK_DASHBOARD_STATS = {
  index: "1.24%",
  volume: "18.4M",
  advancers: "132",
  decliners: "77",
};


// ---- Markets: instruments list ----
export type Instrument = {
  symbol: string;
  last: number;
  change: number;
  volume: string;
  sector: "Banking" | "Energy" | "Telecom";
  mktCap: string;
  pe: number;
  yield: number;
  high52w: number;
  bid: number;
  ask: number;
};

export const MOCK_INSTRUMENTS: Instrument[] = [
  { symbol: "GTCO", last: 128.4, change: 1.8, volume: "412K", sector: "Banking", mktCap: "1.2B", pe: 14.6, yield: 3.1, high52w: 141.2, bid: 128.2, ask: 128.6 },
  { symbol: "MTNN", last: 96.2, change: -0.7, volume: "318K", sector: "Telecom", mktCap: "2.1B", pe: 18.2, yield: 2.4, high52w: 105.0, bid: 96.0, ask: 96.4 },
  { symbol: "DANGCEM", last: 212.75, change: 0.4, volume: "264K", sector: "Energy", mktCap: "3.4B", pe: 12.1, yield: 4.0, high52w: 230.0, bid: 212.5, ask: 213.0 },
  { symbol: "ZENITH", last: 41.05, change: 2.6, volume: "198K", sector: "Banking", mktCap: "0.8B", pe: 9.8, yield: 5.2, high52w: 45.0, bid: 40.9, ask: 41.2 },
  { symbol: "SEPLAT", last: 75.6, change: -1.4, volume: "152K", sector: "Energy", mktCap: "1.1B", pe: 11.4, yield: 3.8, high52w: 84.0, bid: 75.4, ask: 75.8 },
  { symbol: "SNTS", last: 18.9, change: 0.9, volume: "121K", sector: "Telecom", mktCap: "0.5B", pe: 15.0, yield: 1.9, high52w: 21.0, bid: 18.8, ask: 19.0 },
  { symbol: "GCB", last: 64.35, change: -0.3, volume: "96K", sector: "Banking", mktCap: "0.9B", pe: 13.2, yield: 2.7, high52w: 70.0, bid: 64.2, ask: 64.5 },
];

// ---- Order book (per-symbol bid/ask levels) ----
export const MOCK_ORDER_BOOK = {
  bidLevels: [42, 35, 28, 20],
  askLevels: [24, 30, 38, 45],
};