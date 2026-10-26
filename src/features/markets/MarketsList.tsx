import { useState, useRef, useMemo, useLayoutEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/layout/Header";
import { useInstrumentsQuery } from "./useInstrumentsQuery";
import { SkeletonList } from "../../components/feedback/SkeletonList";
import { MOCK_INSTRUMENTS } from "../../lib/mockData";
import { BackButton } from "../../components/ui/BackButton";
import { MAIN_DASHBOARD_URL } from "../../lib/config";

export function MarketsList() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: instruments = [], isLoading } = useInstrumentsQuery();

  // Tabs come from the data, so a new sector gets a tab automatically.
  const sectors = useMemo(
    () => ["All", ...Array.from(new Set(instruments.map((i) => i.sector)))],
    [instruments],
  );
  const [activeSector, setActiveSector] = useState<string>("All");

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const activeIndex = Math.max(0, sectors.indexOf(activeSector));

  useLayoutEffect(() => {
    const updatePill = () => {
      const btn = buttonRefs.current[activeIndex];
      if (btn) {
        setPillStyle({
          left: btn.offsetLeft,
          top: btn.offsetTop,
          width: btn.offsetWidth,
          height: btn.offsetHeight,
        });
      }
    };

    updatePill();

    const observer = new ResizeObserver(updatePill);
    buttonRefs.current.forEach((btn) => {
      if (btn) observer.observe(btn);
    });

    return () => observer.disconnect();
  }, [activeIndex, sectors.length]);

  const filtered =
    activeSector === "All"
      ? instruments
      : instruments.filter((i) => i.sector === activeSector);

  return (
    <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
      <Header />
      <div className="max-w-[1440px] mx-auto w-full py-4 sm:py-6 px-6 flex flex-col flex-1 min-h-0">
        <div className="bg-d-blue border-2 border-card-border rounded-[12px] px-4 sm:px-6 py-2 mb-4 flex flex-col gap-3 text-sm sm:text-base shrink-0">
          <div className="w-full flex items-center justify-end gap-4 sm:gap-6">
            <BackButton to="/" />
            <BackButton variant="home" href={MAIN_DASHBOARD_URL} />
          </div>
        </div>

        <div className="relative grid grid-cols-3 xs:grid-cols-4 sm:flex sm:flex-wrap gap-2 sm:gap-4 mb-4 p-1.5 rounded-md w-full max-w-full shrink-0">
          {/* sliding pill */}
          <div
            className="absolute bg-action rounded-[10px] transition-all duration-300 ease-out z-10"
            style={{
              left: pillStyle.left,
              top: pillStyle.top,
              width: pillStyle.width,
              height: pillStyle.height,
            }}
          />

          {sectors.map((sector, i) => (
            <button
              key={sector}
              ref={(el) => {
                buttonRefs.current[i] = el;
              }}
              onClick={() => {
                setActiveSector(sector);
                setIsScrolled(false);
                scrollRef.current?.scrollTo({ top: 0 });
              }}
              className={`relative z-20 w-full min-w-0 sm:w-auto sm:min-w-32 h-11 sm:h-12 px-1.5 sm:px-6 py-1 rounded-[10px] text-xs sm:text-base font-medium text-center leading-tight transition-colors duration-300 hover:cursor-pointer
        ${activeSector === sector ? "text-white" : "bg-panel text-ice/70 hover:text-ice"}`}
            >
              <span className="line-clamp-2 break-words sm:line-clamp-none sm:whitespace-nowrap">
                {sector}
              </span>
            </button>
          ))}
        </div>

        <div
          ref={scrollRef}
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
          className="bg-panel border-2 px-2 lg:px-3.5 pb-3 border-card-border rounded-[12px] flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-themed"
        >
          <div
            className={`sticky top-0 z-30 bg-panel grid gap-2 sm:gap-4 -mx-2 lg:-mx-3.5 px-4 sm:px-8 lg:px-[38px] py-3 text-[13px] sm:text-lg uppercase text-ice/60 tracking-wider transition-shadow duration-200
    ${isScrolled ? "shadow-[0_6px_10px_-6px_rgba(0,0,0,0.45)]" : "shadow-none"}`}
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
          >
            <span>Symbol</span>
            <span>Last</span>
            <span>Change</span>
            <span className="text-right pr-1">Volume</span>
          </div>

          {isLoading ? (
            <div className="px-4 sm:px-6 py-3">
              <SkeletonList rows={MOCK_INSTRUMENTS.length} />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSector}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.symbol}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: i * 0.05,
                      ease: "easeOut",
                    }}
                  >
                    <Link
                      to={`/markets/${item.symbol}`}
                      style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
                      className={`grid gap-2 sm:gap-4 px-4 sm:px-6 py-3 border-card-border hover:bg-navy/40 transition-colors text-[12px] sm:text-[16px]
                ${i !== filtered.length - 1 ? "border-b-2 lg:border-b-3" : ""}`}
                    >
                      <span className="text-[12px] sm:text-[16px] text-ice/80 truncate">
                        {item.symbol}
                      </span>
                      <span className="text-[12px] sm:text-[16px] text-ice/80">
                        {item.last.toFixed(2)}
                      </span>
                      <span
                        className={
                          item.change >= 0 ? "text-signal" : "text-alert"
                        }
                      >
                        {item.change >= 0 ? "+" : ""}
                        {item.change}%
                      </span>
                      <span className="text-right text-ice/80 pr-1">
                        {item.volume}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
