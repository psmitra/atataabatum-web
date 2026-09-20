import { useState, useRef, useLayoutEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../../components/layout/Header";
import { useInstrumentsQuery } from "./useInstrumentsQuery";
import { SkeletonList } from "../../components/feedback/SkeletonList";

const sectors = ["All", "Banking", "Energy", "Telecom"] as const;

export function MarketsList() {
  const { data: instruments = [], isLoading } = useInstrumentsQuery();
  const [activeSector, setActiveSector] =
    useState<(typeof sectors)[number]>("All");
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  const activeIndex = sectors.indexOf(activeSector);

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
  }, [activeIndex]);

  const filtered =
    activeSector === "All"
      ? instruments
      : instruments.filter((i) => i.sector === activeSector);

  return (
    <div className="min-h-screen bg-navy text-ice flex flex-col">
      <Header />
      <div className="max-w-[1440px] mx-auto w-full py-6 sm:py-10 px-6 flex-1">
        <div className="relative grid grid-cols-3 xs:grid-cols-4 sm:flex gap-3 sm:gap-4 mb-4 p-1.5 rounded-md w-full max-w-full">
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
              onClick={() => setActiveSector(sector)}
              className={`relative z-20 w-full sm:w-32 h-12 px-4 py-2 rounded-[10px] text-sm sm:text-base font-medium text-center transition-colors duration-300 hover:cursor-pointer
                ${activeSector === sector ? "text-white" : "bg-panel text-ice/70 hover:text-ice"}`}
            >
              {sector}
            </button>
          ))}
        </div>

        <div className="bg-panel border-2 px-2 lg:px-3.5 pb-3 border-card-border rounded-[12px] overflow-hidden">
          <div
            className="grid gap-2 sm:gap-4 px-4 sm:px-6 py-3 text-sm sm:text-lg uppercase text-ice/60 tracking-wider"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
          >
            <span>Symbol</span>
            <span>Last</span>
            <span>Change</span>
            <span className="text-right pr-1">Volume</span>
          </div>

          {isLoading ? (
            <div className="px-4 sm:px-6 py-3">
              <SkeletonList rows={7} />
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