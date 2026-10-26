import { useWatchlistQuery } from "./useWatchlistQuery";
import { useDashboardStatsQuery } from "./useDashboardStatsQuery";
import { WatchlistRow } from "../../components/ui/WatchlistRow";
import { StatCard } from "../../components/ui/StatCard";
import { IndexChart } from "../../components/ui/IndexChart";
import { Header } from "../../components/layout/Header";
import { EmptyState } from "../../components/feedback/EmptyState";
import { SkeletonList } from "../../components/feedback/SkeletonList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { MOCK_WATCHLIST } from "../../lib/mockData";
import { BackButton } from "../../components/ui/BackButton";
import { MAIN_DASHBOARD_URL } from "../../lib/config";

function StatCardSkeleton() {
  return (
    <div className="bg-panel rounded-[12px] p-4 sm:p-7 sm:pt-5 flex-1 min-h-[100px] lg:min-h-[150px] flex flex-col justify-start gap-3.5 border-2 border-card-border animate-pulse">
      <div className="h-4 w-16 bg-card-border/50 rounded" />
      <div className="h-8 w-20 bg-card-border/50 rounded" />
    </div>
  );
}

export function Dashboard() {
  const { data: watchlist = [], isLoading: isWatchlistLoading } =
    useWatchlistQuery();

  const { data: stats, isLoading: isStatsLoading } = useDashboardStatsQuery();

  return (
    <div className="h-dvh overflow-hidden bg-navy text-ice flex flex-col">
      <Header />

      <div className="max-w-[1440px] mx-auto w-full py-4 sm:py-6 px-6 flex flex-col flex-1 min-h-0">
        <div className="bg-d-blue border-2 border-card-border rounded-[12px] px-4 sm:px-6 py-2 mb-4 flex flex-col gap-3 text-sm sm:text-base shrink-0">
          <div className="w-full flex justify-end">
            <BackButton variant="home" href={MAIN_DASHBOARD_URL} />
          </div>
        </div>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:flex gap-4 lg:gap-6 mb-4 sm:mb-6 shrink-0">
          {isStatsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Index"
                value={stats?.index ?? "--"}
                tone="signal"
              />

              <StatCard
                label="Volume"
                value={stats?.volume ?? "--"}
                tone="action"
              />

              <StatCard
                label="Advancers"
                value={stats?.advancers ?? "--"}
                tone="signal"
              />

              <StatCard
                label="Decliners"
                value={stats?.decliners ?? "--"}
                tone="alert"
              />
            </>
          )}
        </div>

        {/* Chart + Watchlist */}
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 flex-1 min-h-0 items-stretch">
          <IndexChart />

          <div className="bg-panel rounded-[12px] p-4 w-full sm:w-80 flex flex-col min-h-0 overflow-hidden border-2 border-card-border">
            <h2 className="text-lg lg:text-xl text-ice/80 tracking-wide mb-4.5 shrink-0">
              Watchlist
            </h2>

            {/* this wrapper is what scrolls */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain pr-1 scrollbar-themed">
              {isWatchlistLoading ? (
                <SkeletonList rows={MOCK_WATCHLIST.length} />
              ) : watchlist.length === 0 ? (
                <EmptyState
                  icon={<FontAwesomeIcon icon={faPlus} size="2x" />}
                  title="Your watchlist is empty"
                  message="Add your first instrument to start tracking it here."
                  actionLabel="+ Add ticker"
                  onAction={() => alert("open add-ticker flow here")}
                />
              ) : (
                watchlist.map((item, i) => (
                  <WatchlistRow key={item.symbol} {...item} index={i} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
