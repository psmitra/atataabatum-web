import { useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "../../components/layout/Header";
import { Odometer } from "../../components/ui/Odometer";
import { useAppDispatch } from "../../app/hooks";
import { startOrder, goToReview, setQuantity } from "../trade/orderSlice";
import { useWatchlistQuery } from "../markets/useWatchlistQuery";
import { useResearchBarsQuery } from "./useResearchBarsQuery";
import { BackButton } from "../../components/ui/BackButton";
import { LoadingState } from "../../components/feedback/LoadingState";
import { MAIN_DASHBOARD_URL } from "../../lib/config";

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
    <div className="flex flex-col bg-panel rounded-[12px] p-4 w-full lg:w-64 border-2 border-card-border shrink-0 min-h-0 max-h-[240px] lg:max-h-none">
      <h2 className="text-ice/60 text-sm uppercase tracking-wide mb-3 shrink-0">
        Watchlist
      </h2>

      {isLoading ? (
        <WatchlistSkeleton />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 scrollbar-themed">
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

type OrderControlProps = {
  side: OrderSide;
  onSideChange: (side: OrderSide) => void;
  quantity: number;
  onQuantityChange: (val: number) => void;
  ask: number;
  bid: number;
  onReview: () => void;
};

// Desktop order panel (sidebar, hidden on mobile)
function OrderPanel({
  side,
  onSideChange,
  quantity,
  onQuantityChange,
  ask,
  bid,
  onReview,
}: OrderControlProps) {
  const isBuy = side === "buy";
  const price = isBuy ? ask : bid;

  return (
    <div className="hidden lg:flex flex-col gap-3 bg-panel rounded-[12px] p-4 w-64 border-2 border-card-border shrink-0 min-h-0 overflow-y-auto scrollbar-themed">
      <h2 className="text-ice/60 text-sm uppercase tracking-wide mb-1">
        Order
      </h2>

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

// Mobile: compact order dock pinned to the bottom of the screen
function MobileOrderBar({
  side,
  onSideChange,
  quantity,
  onQuantityChange,
  ask,
  bid,
  onReview,
}: OrderControlProps) {
  const isBuy = side === "buy";
  const price = isBuy ? ask : bid;
  const cost = quantity * price;

  return (
    <div className="lg:hidden shrink-0 bg-d-blue border-t-2 border-card-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] grid grid-cols-2 gap-2.5 shadow-[0_-6px_16px_rgba(0,0,0,0.3)]">
      {/* Buy */}
      <button
        onClick={() => onSideChange("buy")}
        className={`h-12 rounded-[10px] border-2 flex flex-col items-center justify-center leading-none transition-colors ${
          isBuy
            ? "bg-signal border-signal text-white"
            : "bg-transparent border-signal/40 text-signal"
        }`}
      >
        <span className="font-bold text-sm">BUY</span>
        <span className="text-[11px] mt-1 tabular-nums opacity-90">
          {ask.toFixed(2)}
        </span>
      </button>

      {/* Sell */}
      <button
        onClick={() => onSideChange("sell")}
        className={`h-12 rounded-[10px] border-2 flex flex-col items-center justify-center leading-none transition-colors ${
          !isBuy
            ? "bg-alert border-alert text-white"
            : "bg-transparent border-alert/40 text-alert"
        }`}
      >
        <span className="font-bold text-sm">SELL</span>
        <span className="text-[11px] mt-1 tabular-nums opacity-90">
          {bid.toFixed(2)}
        </span>
      </button>

      {/* Qty stepper */}
      <div className="flex items-center bg-navy rounded-[10px] h-12 overflow-hidden">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
          className="w-11 h-full text-xl text-ice/70 active:bg-card-border/40"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={quantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            onQuantityChange(Number.isNaN(val) ? 0 : Math.max(0, val));
          }}
          className="bg-transparent text-center text-base font-semibold flex-1 min-w-0 outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onQuantityChange(quantity + 1)}
          className="w-11 h-full text-xl text-ice/70 active:bg-card-border/40"
        >
          +
        </button>
      </div>

      {/* Review */}
      <button
        onClick={onReview}
        disabled={quantity <= 0}
        className={`h-12 rounded-[10px] font-bold text-sm transition-all active:translate-y-0.5 ${
          quantity <= 0
            ? "bg-navy text-ice/40 cursor-not-allowed"
            : isBuy
              ? "bg-signal text-white"
              : "bg-alert text-white"
        }`}
      >
        {quantity > 0 ? `Review · ${cost.toFixed(2)}` : "Review"}
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
      <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
        <Header />
        <div className="max-w-[1440px] mx-auto w-full p-6 flex-1 min-h-0 flex flex-col">
          <LoadingState label="Loading research" />
        </div>
      </div>
    );
  }

  if (!activeSymbol) {
    return (
      <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
        <Header />
        <div className="max-w-[1440px] mx-auto w-full p-6 text-center flex-1 flex items-center justify-center">
          <p className="text-xl sm:text-2xl font-bold">
            Add an instrument to your watchlist to start researching
          </p>
        </div>
      </div>
    );
  }

  const orderProps: OrderControlProps = {
    side: orderSide,
    onSideChange: setOrderSide,
    quantity: mobileQuantity,
    onQuantityChange: setMobileQuantity,
    ask,
    bid,
    onReview: handleReview,
  };

  return (
    <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
      <Header />

      <div className="max-w-[1440px] mx-auto w-full py-4 sm:py-6 px-6 flex-1 flex flex-col min-h-0">
        {/* Body: scrolls on mobile, fits the screen on desktop */}
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto lg:overflow-hidden overscroll-contain scrollbar-themed -mr-4 pr-4 lg:mr-0 lg:pr-0">
          <div className="bg-d-blue border-2 border-card-border rounded-[12px] px-6 py-2 mb-4 sm:mb-6 shrink-0 flex items-center justify-between gap-3">
          <h1 className="text-sm sm:text-base text-ice/70 min-w-0 truncate">
            Research
          </h1>
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <BackButton to="/" />
            <BackButton variant="home" href={MAIN_DASHBOARD_URL} />
          </div>
        </div>

          {/* Mobile symbol header */}
          <div className="lg:hidden bg-d-blue border-2 border-card-border rounded-[12px] px-6 py-4 mb-4 shrink-0">
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

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 shrink-0 lg:shrink lg:flex-1 lg:min-h-0 items-stretch">
            <WatchlistPanel
              watchlist={watchlist}
              activeSymbol={activeSymbol}
              isLoading={isWatchlistLoading}
              onSelect={setSelectedSymbol}
            />

            <div className="flex-1 flex flex-col gap-4 lg:gap-6 w-full min-h-0">
              <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 flex flex-col gap-4 shadow-md shadow-black/10 h-[280px] sm:h-[340px] lg:h-auto lg:flex-[7] lg:min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={activeSymbol}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden lg:block text-ice/80 text-sm sm:text-base tabular-nums shrink-0"
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

              <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 shadow-md shadow-black/10 lg:flex-[3] flex items-start shrink-0">
                <span className="text-ice/60 text-xs sm:text-sm uppercase tracking-wide">
                  Fundamentals · News · Filings
                </span>
              </div>
            </div>

            {/* Desktop order panel (hidden on mobile) */}
            <OrderPanel {...orderProps} />
          </div>
        </div>
      </div>

      {/* Mobile: sticky order dock (always visible) */}
      <MobileOrderBar {...orderProps} />
    </div>
  );
}
