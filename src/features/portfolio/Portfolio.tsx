import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/layout/Header";
import { StatCard } from "../../components/ui/StatCard";
import { EmptyState } from "../../components/feedback/EmptyState";
import { SkeletonList } from "../../components/feedback/SkeletonList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { usePortfolioQuery } from "./usePortfolioQuery";
import { usePortfolioSummaryQuery } from "./usePortfolioSummaryQuery";
import { MOCK_HOLDINGS } from "../../lib/mockData";
import { BackButton } from "../../components/ui/BackButton";

export function Portfolio() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: holdings = [], isLoading: holdingsLoading } =
    usePortfolioQuery();
  const { data: summary, isLoading: summaryLoading } =
    usePortfolioSummaryQuery();

  const totalValue = summary?.totalValue ?? 0;
  const todayChange = summary?.todayChangePercent ?? 0;
  const cash = summary?.cash ?? 0;

  const isLoading = holdingsLoading || summaryLoading;

  return (
    <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
      <Header />
      <div className="max-w-[1440px] mx-auto w-full py-4 sm:py-6 px-6 flex flex-col flex-1 min-h-0">
        {/* Title bar */}
        <div className="bg-d-blue border-2 border-card-border rounded-[12px] px-6 py-2 mb-4 sm:mb-6 shrink-0 flex items-center justify-between gap-3">
          <h1 className="text-sm sm:text-base text-ice/70">
            Portfolio · <span className="text-ice font-semibold">Holdings</span>
          </h1>
          <BackButton to="/" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:flex gap-4 lg:gap-6 mb-4 sm:mb-6 shrink-0">
          <StatCard label="Total value" value={totalValue.toLocaleString()} />
          <StatCard
            label="Today"
            value={`${todayChange >= 0 ? "+" : ""}${todayChange}%`}
            tone={todayChange >= 0 ? "signal" : "alert"}
          />
          <StatCard label="Cash" value={cash.toLocaleString()} tone="action" />
        </div>

        {isLoading ? (
          <div className="bg-panel border-2 border-card-border rounded-[12px] p-4 sm:p-6 flex-1 min-h-0 overflow-y-auto scrollbar-themed">
            <SkeletonList rows={MOCK_HOLDINGS.length} />
          </div>
        ) : holdings.length === 0 ? (
          <div className="bg-panel border-2 border-card-border rounded-[12px] shrink-0">
            <EmptyState
              icon={<FontAwesomeIcon icon={faPlus} size="2x" />}
              title="No holdings yet"
              message="Place your first trade to start building your portfolio."
              actionLabel="Go to Markets"
              onAction={() => navigate("/markets")}
            />
          </div>
        ) : (
          <div
            onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
            className="bg-panel border-2 px-2 lg:px-3.5 pb-3 border-card-border rounded-[12px] flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-themed"
          >
            {/* Sticky column header */}
            <div
              className={`sticky top-0 z-30 bg-panel grid gap-2 sm:gap-4 -mx-2 lg:-mx-3.5 px-6 sm:px-8 lg:px-[38px] py-3 text-sm sm:text-lg uppercase text-ice/60 tracking-wider transition-shadow duration-200
    ${isScrolled ? "shadow-[0_8px_12px_-6px_rgba(0,0,0,0.6)]" : "shadow-none"}`}
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
            >
              <span>Holding</span>
              <span>Qty</span>
              <span>Value</span>
              <span className="text-right pr-1">P/L</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key="holdings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {holdings.map((item, i) => (
                  <motion.div
                    key={item.symbol}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(i, 10) * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      to={`/markets/${item.symbol}`}
                      style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                      className={`grid gap-2 sm:gap-4 px-4 sm:px-6 py-3 border-card-border hover:bg-navy/40 transition-colors text-[12px] sm:text-[16px]
                      ${i !== holdings.length - 1 ? "border-b-2 lg:border-b-3" : ""}`}
                    >
                      <span className="text-[12px] sm:text-[16px] text-ice/80 truncate">
                        {item.symbol}
                      </span>
                      <span className="text-[12px] sm:text-[16px] text-ice/80 tabular-nums">
                        {item.qty}
                      </span>
                      <span className="text-[12px] sm:text-[16px] text-ice/80 tabular-nums">
                        {item.value.toLocaleString()}
                      </span>
                      <span
                        className={`text-right pr-1 tabular-nums ${
                          item.pl >= 0 ? "text-signal" : "text-alert"
                        }`}
                      >
                        {item.pl >= 0 ? "+" : ""}
                        {item.pl}%
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
