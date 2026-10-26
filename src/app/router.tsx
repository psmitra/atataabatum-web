import { createBrowserRouter, Link } from "react-router";
import { Dashboard } from "../features/markets/Dashboard";
import { MarketsList } from "../features/markets/MarketsList";
import { InstrumentDetail } from "../features/markets/InstrumentDetail";
import { OrderTicket } from "../features/trade/OrderTicket";
import { Header } from "../components/layout/Header";
import { Portfolio } from "../features/portfolio/Portfolio";
import { Research } from "../features/research/Research";
import { BackButton } from "../components/ui/BackButton";
import { MAIN_DASHBOARD_URL } from "../lib/config";

export const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/markets", element: <MarketsList /> },
  {
    path: "/markets/:symbol",
    element: <InstrumentDetail />,
  },
  {
    path: "/trade",
    element: (
      <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
        <Header />
        <div className="max-w-[1440px] mx-auto w-full py-4 sm:py-6 px-6 flex flex-col flex-1 min-h-0">
          {/* Back bar */}
          <div className="bg-d-blue border-2 border-card-border rounded-[12px] px-6 py-2 mb-4 sm:mb-6 shrink-0 flex items-center justify-between gap-3">
          <h1 className="text-sm sm:text-base text-ice/70 min-w-0 truncate">
            Trade
          </h1>
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <BackButton to="/" />
            <BackButton variant="home" href={MAIN_DASHBOARD_URL} />
          </div>
        </div>

          {/* Centered content */}
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-xl sm:text-2xl font-bold">
              Select an instrument from Markets to trade
            </p>
            <Link
              to="/markets"
              className="inline-block btn-primary hover:brightness-110 hover:cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 transition-all duration-200 text-white font-semibold px-5 py-2.5 rounded-[10px] text-sm sm:text-base"
            >
              Go to Markets
            </Link>
          </div>
        </div>
      </div>
    ),
  },
  {
    path: "/trade/:symbol",
    element: <OrderTicket />,
  },
  {
    path: "/portfolio",
    element: <Portfolio />,
  },
  {
    path: "/research",
    element: <Research />,
  },
]);
