import { useParams, Link, useNavigate } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Header } from "../../components/layout/Header";
import { useInstrumentsQuery } from "./useInstrumentsQuery";
import { useOrderBookQuery } from "./useOrderBookQuery";
import { Odometer } from "../../components/ui/Odometer";
import { useRollIn } from "../../hooks/useRollIn";
import { useAppDispatch } from "../../app/hooks";
import { startOrder } from "../trade/orderSlice";
import { BackButton } from "../../components/ui/BackButton";
import { LoadingState } from "../../components/feedback/LoadingState";
import { MAIN_DASHBOARD_URL } from "../../lib/config";

const fakePriceData = [
  { label: "D1", value: 25 },
  { label: "D2", value: 62 },
  { label: "D3", value: 45 },
  { label: "D4", value: 70 },
  { label: "D5", value: 55 },
  { label: "D6", value: 80 },
];
const CHART_COLORS = ["var(--color-signal)", "var(--color-action)"];

export function InstrumentDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const { data: instruments = [], isLoading: instrumentsLoading } =
    useInstrumentsQuery();
  const { data: orderBook, isLoading: orderBookLoading } = useOrderBookQuery();
  const instrument = instruments.find((i) => i.symbol === symbol);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Hooks must run on every render, so keep them unconditional and make the
  // values safe for instruments that don't have equity fields (commodities).
  const mktCapRoll = useRollIn(instrument?.mktCap ?? "—");
  const peRoll = useRollIn(
    instrument?.pe != null ? instrument.pe.toString() : "—",
  );
  const yieldRoll = useRollIn(
    instrument?.yield != null ? `${instrument.yield}%` : "—",
  );
  const highRoll = useRollIn(instrument?.high52w.toFixed(2) ?? "0");

  if (instrumentsLoading || orderBookLoading) {
  return (
    <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
      <Header />
      <div className="max-w-[1440px] mx-auto w-full p-6 flex-1 min-h-0 flex flex-col">
        <LoadingState />
      </div>
    </div>
  );
}

  if (!instrument) {
    return (
      <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
        <Header />
        <div className="max-w-[1440px] mx-auto w-full p-6 text-center">
          <p className="mb-4">Instrument "{symbol}" not found.</p>
          <Link to="/markets" className="text-action underline">
            Back to Markets
          </Link>
        </div>
      </div>
    );
  }

  const isCommodity = instrument.sector === "Commodities";
  const isPositive = instrument.change >= 0;
  const bidData = (orderBook?.bidLevels ?? []).map((val, i) => ({
    name: `b${i}`,
    value: val,
  }));
  const askData = (orderBook?.askLevels ?? []).map((val, i) => ({
    name: `a${i}`,
    value: val,
  }));

  const handleBuy = () => {
    dispatch(
      startOrder({
        symbol: instrument.symbol,
        side: "buy",
        price: instrument.last,
      }),
    );
    navigate(`/trade/${instrument.symbol}`);
  };

  const handleSell = () => {
    dispatch(
      startOrder({
        symbol: instrument.symbol,
        side: "sell",
        price: instrument.last,
      }),
    );
    navigate(`/trade/${instrument.symbol}`);
  };

  return (
    <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
      <Header />

      <div className="max-w-[1440px] mx-auto w-full py-4 sm:py-6 px-6 flex-1 min-h-0 flex flex-col gap-4 md:gap-6">
        {/* Scrolling body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-themed flex flex-col gap-4 md:gap-6 -mr-4 pr-4">
          {/* Top bar (original) */}
          <div className="bg-d-blue border-2 border-card-border rounded-[12px] px-4 sm:px-6 py-2 flex flex-col gap-3 text-sm sm:text-base shrink-0">
            <div className="w-full flex items-center justify-end gap-4 sm:gap-6">
              <BackButton to="/markets" />
              <BackButton variant="home" href={MAIN_DASHBOARD_URL} />
            </div>

            <div className="w-full flex items-center gap-2 flex-wrap">
              <span className="text-ice/80 text-sm sm:text-lg">
                {instrument.symbol}
              </span>
              <span className="text-ice/80 text-sm sm:text-lg">·</span>
              <span className="text-ice/80 text-sm sm:text-lg">
                {instrument.last.toFixed(2)}
                {instrument.unit && (
                  <span className="text-ice/50 text-xs sm:text-sm">
                    {" "}
                    {instrument.unit}
                  </span>
                )}
              </span>
              <span className={isPositive ? "text-signal" : "text-alert"}>
                {isPositive ? "+" : ""}
                {instrument.change}%
              </span>
              <span className="text-ice/80 text-sm sm:text-lg">·</span>
              <span className="text-ice/80 text-sm sm:text-lg">
                Bid {instrument.bid.toFixed(2)} / Ask{" "}
                {instrument.ask.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Chart + Order book */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 shrink-0 md:shrink md:flex-1 md:min-h-[300px]">
            {/* Price chart: only the chart height changed */}
            <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 flex-1 min-w-0 min-h-0 flex flex-col">
              <h2 className="text-[15px] sm:text-lg lg:text-xl text-ice/80 tracking-wider mb-4.5 uppercase">
                Price chart
              </h2>
              <div className="w-full h-[220px] sm:h-[260px] md:h-auto md:flex-1 md:min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={fakePriceData}
                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="label" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: "#0A2342",
                        border: "1px solid #1d4a87",
                        borderRadius: 6,
                        padding: "8px 12px",
                      }}
                      labelStyle={{
                        color: "#EAF1FB",
                        fontWeight: 600,
                        marginBottom: 4,
                      }}
                      itemStyle={{ color: "#EAF1FB" }}
                      cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[6, 6, 0, 0]}
                      animationBegin={200}
                      animationDuration={1200}
                      animationEasing="ease-in-out"
                    >
                      {fakePriceData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Order book: original, untouched */}
            <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 w-full md:w-80 min-h-0 flex flex-col">
              <h2 className="text-[15px] sm:text-lg lg:text-xl uppercase tracking-wider text-ice/70 mb-4.5">
                Order book
              </h2>
              <div className="flex-1 flex flex-col justify-start gap-4">
                <div className="grid grid-cols-2 gap-3 h-[140px] md:h-auto md:flex-1 md:max-h-[140px]">
                  <div className="h-full" style={{ transform: "scaleX(-1)" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={bidData}
                        layout="vertical"
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        barCategoryGap="20%"
                      >
                        <YAxis type="category" dataKey="name" hide />
                        <Bar
                          dataKey="value"
                          radius={0}
                          animationDuration={800}
                          animationEasing="ease-out"
                        >
                          {bidData.map((_, i) => (
                            <Cell key={i} fill="#2E9E4F" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={askData}
                        layout="vertical"
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        barCategoryGap="20%"
                      >
                        <YAxis type="category" dataKey="name" hide />
                        <Bar
                          dataKey="value"
                          radius={0}
                          animationDuration={800}
                          animationEasing="ease-out"
                        >
                          {askData.map((_, i) => (
                            <Cell key={i} fill="#E8871E" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex justify-center gap-6 text-[16px] sm:text-lg text-ice/60">
                  <span>Bid</span>
                  <span>Ask</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fundamentals (original) */}
          <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 shrink-0">
            <h2 className="text-[15px] sm:text-lg lg:text-xl uppercase tracking-wider text-ice/70 mb-5">
              Overview · Fundamentals · News · Filings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {isCommodity ? (
                <>
                  <div>
                    <p className="text-sm sm:text-lg lg:text-[18px] text-ice/60 mb-3">
                      Unit
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {instrument.unit ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-lg lg:text-[18px] text-ice/60 mb-3">
                      Bid
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {instrument.bid.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-lg lg:text-[18px] text-ice/60 mb-3">
                      Ask
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      {instrument.ask.toFixed(2)}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm sm:text-lg lg:text-[18px] text-ice/60 mb-3">
                      Mkt cap
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      <Odometer value={mktCapRoll} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-lg lg:text-[18px] text-ice/60 mb-3">
                      P/E
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      <Odometer value={peRoll} />
                    </p>
                  </div>
                  <div>
                    <p className="text-sm sm:text-lg lg:text-[18px] text-ice/60 mb-3">
                      Yield
                    </p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                      <Odometer value={yieldRoll} />
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm sm:text-lg lg:text-[18px] text-ice/60 mb-3">
                  52w high
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">
                  <Odometer value={highRoll} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buy / Sell: pinned, outside the scroll area */}
        <div className="flex gap-4 md:gap-6 shrink-0">
          <button onClick={handleBuy} className="flex-1 btn-primary">
            BUY
          </button>
          <button onClick={handleSell} className="flex-1 btn-caution">
            SELL
          </button>
        </div>
      </div>
    </div>
  );
}
