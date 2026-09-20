import { createBrowserRouter, Link } from "react-router";
import { Dashboard } from "../features/markets/Dashboard";
import { MarketsList } from "../features/markets/MarketsList";
import { InstrumentDetail } from "../features/markets/InstrumentDetail";
import { OrderTicket } from "../features/trade/OrderTicket";
import { Header } from "../components/layout/Header";
import { Portfolio } from "../features/portfolio/Portfolio";
import { Research } from "../features/research/Research";

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
      <div className="min-h-screen bg-navy text-ice flex flex-col">
        <Header />
        <div className="max-w-[1440px] mx-auto w-full p-6 text-center flex-1 flex flex-col gap-4 items-center justify-center">
          <p className="text-xl sm:text-2xl font-bold">
            Select an instrument from Markets to trade
          </p>
          <Link
            to="/markets"
            className="inline-block mt-2 btn-primary hover:brightness-110 hover:cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 transition-all duration-200 text-white font-semibold px-5 py-2.5 rounded-[10px] text-sm sm:text-base"
          >
            Go to Markets
          </Link>
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
