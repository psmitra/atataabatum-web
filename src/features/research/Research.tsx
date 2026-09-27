import { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../../components/layout/Header";
import { Odometer } from "../../components/ui/Odometer";
import { useAppDispatch } from "../../app/hooks";
import { startOrder, goToReview, setQuantity } from "../trade/orderSlice";
import { useWatchlistQuery } from "../markets/useWatchlistQuery";
import { useResearchBarsQuery } from "./useResearchBarsQuery";

type OrderSide = "buy" | "sell";

function MockBarChart({ bars, symbol }: { bars: number[]; symbol: string }) {
  return (
    <div className="flex items-end justify-between gap-2 sm:gap-3 flex-1 min-h-0 px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={symbol}
          className="flex items-end justify-between gap-2 sm:gap-3 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {bars.map((height, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-t-[6px] ${
                i % 2 === 0 ? "bg-signal" : "bg-action"
              }`}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function WatchlistSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex justify-between items-center px-3 py-2 border-b-2 lg:border-b-3 border-card-border last:border-b-0 animate-pulse"
        >
          <div className="h-4 w-14 bg-card-border/50 rounded" />
          <div className="h-4 w-10 bg-card-border/50 rounded" />
        </div>
      ))}
    </div>
  );
}

function WatchlistPanel({
  watchlist,
  activeSymbol,
  isLoading,
  onSelect,
}: {
  watchlist: { symbol: string; price: number; change: number }[];
  activeSymbol: string | null;
  isLoading: boolean;
  onSelect: (symbol: string) => void;
}) {
  return (
    <div className="flex flex-col bg-panel rounded-[12px] p-4 w-full lg:w-64 border-2 border-card-border shrink-0">
      <h2 className="text-ice/60 text-sm uppercase tracking-wide mb-3">
        Watchlist
      </h2>

      {isLoading ? (
        <WatchlistSkeleton />
      ) : (
        <div className="flex flex-col">
          {watchlist.map((item, i) => {
            const isActive = item.symbol === activeSymbol;
            const rowIsPositive = item.change >= 0;

            return (
              <motion.div
                key={item.symbol}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                onClick={() => onSelect(item.symbol)}
                className={`flex flex-col gap-0.5 px-3 py-2 border-b-2 lg:border-b-3 border-card-border last:border-b-0 text-sm cursor-pointer hover:bg-navy/40 transition-colors ${
                  isActive ? "bg-navy/40" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-ice/80 uppercase text-sm sm:text-[16px]">
                    {item.symbol}
                  </span>
                  <span
                    className={`text-sm sm:text-lg ${
                      rowIsPositive ? "text-signal" : "text-alert"
                    }`}
                  >
                    {rowIsPositive ? "+" : ""}
                    <Odometer
                      key={item.change}
                      value={item.change.toFixed(2)}
                    />
                    %
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Shared order panel — now includes a working Buy/Sell toggle
function OrderPanel({
  side,
  onSideChange,
  quantity,
  onQuantityChange,
  ask,
  bid,
  onReview,
}: {
  side: OrderSide;
  onSideChange: (side: OrderSide) => void;
  quantity: number;
  onQuantityChange: (val: number) => void;
  ask: number;
  bid: number;
  onReview: () => void;
}) {
  const isBuy = side === "buy";
  const price = isBuy ? ask : bid;

  return (
    <div className="flex flex-col gap-3 bg-panel rounded-[12px] p-4 w-full lg:w-64 border-2 border-card-border shrink-0">
      <h2 className="text-ice/60 text-sm uppercase tracking-wide mb-1">
        Order
      </h2>

      {/* Buy/Sell toggle — matches OrderTicket's style */}
      <div className="flex gap-2">
        <button
          onClick={() => onSideChange("buy")}
          className={`flex-1 py-2 rounded-[10px] font-bold text-sm transition-colors shadow-md shadow-black/10 hover:cursor-pointer ${
            isBuy
              ? "bg-signal text-white"
              : "bg-navy text-ice/60 hover:text-ice"
          }`}
        >
          BUY
        </button>
        <button
          onClick={() => onSideChange("sell")}
          className={`flex-1 py-2 rounded-[10px] font-bold text-sm transition-colors shadow-md shadow-black/10 hover:cursor-pointer ${
            !isBuy
              ? "bg-alert text-white"
              : "bg-navy text-ice/60 hover:text-ice"
          }`}
        >
          SELL
        </button>
      </div>

      <div className="flex justify-between items-center bg-navy rounded-[10px] h-11 px-4 shadow-md shadow-black/10">
        <span className="text-ice/60 text-xs uppercase">Qty</span>
        <input
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            onQuantityChange(Number.isNaN(val) ? 0 : val);
          }}
          className="bg-transparent text-right text-sm font-semibold w-20 outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      <div className="flex justify-between items-center bg-navy rounded-[10px] h-11 px-4 shadow-md shadow-black/10">
        <span className="text-ice/60 text-xs uppercase">Price</span>
        <span className="text-sm font-semibold tabular-nums">
          {price.toFixed(2)}
        </span>
      </div>

      <div className="flex justify-between items-center bg-navy rounded-[10px] h-11 px-4 shadow-md shadow-black/10">
        <span className="text-ice/60 text-xs uppercase">Est. cost</span>
        <span className="text-sm font-semibold tabular-nums">
          {(quantity * price).toFixed(2)}
        </span>
      </div>

      <button
        onClick={onReview}
        disabled={quantity <= 0}
        className={`mt-2 ${
          isBuy ? "bg-signal" : "bg-alert"
        } hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed hover:cursor-pointer active:translate-y-0.5 transition-all text-white font-bold py-3 rounded-[10px] shadow-md shadow-black/10`}
      >
        Review
      </button>
    </div>
  );
}

export function Research() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: watchlist = [], isLoading: isWatchlistLoading } =
    useWatchlistQuery();

  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [mobileQuantity, setMobileQuantity] = useState(0);
  const [orderSide, setOrderSide] = useState<OrderSide>("buy");

  const activeSymbol = selectedSymbol ?? watchlist[0]?.symbol ?? null;
  const activeItem = watchlist.find((item) => item.symbol === activeSymbol);

  const price = activeItem?.price ?? 0;
  const change = activeItem?.change ?? 0;
  const isPositive = change >= 0;

  const bid = price - 0.2;
  const ask = price + 0.2;

  const { data: researchBars = [], isLoading: isResearchBarsLoading } =
    useResearchBarsQuery(activeSymbol);

  const handleReview = () => {
    if (!activeSymbol) return;

    dispatch(
      startOrder({
        symbol: activeSymbol,
        side: orderSide,
        price: orderSide === "buy" ? ask : bid,
      }),
    );

    dispatch(setQuantity(mobileQuantity));
    dispatch(goToReview());

    navigate(`/trade/${activeSymbol}`);
  };

  if (isWatchlistLoading) {
    return (
      <div className="min-h-screen bg-navy text-ice flex flex-col">
        <Header />
        <div className="max-w-[1440px] mx-auto w-full p-6 text-center flex-1 flex items-center justify-center">
          <p className="text-ice/60">Loading…</p>
        </div>
      </div>
    );
  }

  if (!activeSymbol) {
    return (
      <div className="min-h-screen bg-navy text-ice flex flex-col">
        <Header />
        <div className="max-w-[1440px] mx-auto w-full p-6 text-center flex-1 flex items-center justify-center">
          <p className="text-xl sm:text-2xl font-bold">
            Add an instrument to your watchlist to start researching
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-ice flex flex-col">
      <Header />

      <div className="max-w-[1440px] mx-auto w-full py-6 sm:py-10 px-6 flex-1 flex flex-col min-h-0">
        {/* Mobile symbol header */}
        <div className="lg:hidden bg-d-blue border-2 border-card-border rounded-[12px] px-6 py-4 mb-4">
          <h1 className="text-sm sm:text-base text-ice/70">
            {activeSymbol} ·{" "}
            <span className="text-ice font-semibold tabular-nums">
              {price.toFixed(2)}
            </span>{" "}
            ·{" "}
            <span
              className={`font-semibold tabular-nums ${
                isPositive ? "text-signal" : "text-alert"
              }`}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 min-h-0 items-stretch">
          <WatchlistPanel
            watchlist={watchlist}
            activeSymbol={activeSymbol}
            isLoading={isWatchlistLoading}
            onSelect={setSelectedSymbol}
          />

          <div className="flex-1 flex flex-col gap-4 lg:gap-6 w-full min-h-0">
            <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 flex flex-col gap-4 shadow-md shadow-black/10 h-[280px] sm:h-[340px] lg:h-auto lg:flex-[7] lg:min-h-0">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeSymbol}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:block text-ice/80 text-sm sm:text-base tabular-nums flex-shrink-0"
                >
                  {activeSymbol} ·{" "}
                  <span className="font-semibold">{price.toFixed(2)}</span> ·{" "}
                  <span
                    className={
                      isPositive
                        ? "text-signal font-semibold"
                        : "text-alert font-semibold"
                    }
                  >
                    {isPositive ? "+" : ""}
                    {change}%
                  </span>{" "}
                  · Bid {bid.toFixed(2)} / Ask {ask.toFixed(2)}
                </motion.h2>
              </AnimatePresence>

              {isResearchBarsLoading ? (
                <div className="flex items-end justify-between gap-2 sm:gap-3 flex-1 min-h-0 px-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-[6px] bg-card-border/50"
                      initial={{ height: 0 }}
                      animate={{ height: `${30 + (i % 5) * 10}%` }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.03,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <MockBarChart bars={researchBars} symbol={activeSymbol} />
              )}
            </div>

            <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 shadow-md shadow-black/10 lg:flex-[3] flex items-start flex-shrink-0">
              <span className="text-ice/60 text-xs sm:text-sm uppercase tracking-wide">
                Fundamentals · News · Filings
              </span>
            </div>
          </div>

          <OrderPanel
            side={orderSide}
            onSideChange={setOrderSide}
            quantity={mobileQuantity}
            onQuantityChange={setMobileQuantity}
            ask={ask}
            bid={bid}
            onReview={handleReview}
          />
        </div>
      </div>
    </div>
  );
}
