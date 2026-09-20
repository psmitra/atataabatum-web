import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Odometer } from './Odometer';
import { StaleFeedBadge } from '../feedback/StaleFeedBadge';
import { useAppDispatch } from '../../app/hooks';
import { startOrder } from '../../features/trade/orderSlice';

type WatchlistRowProps = {
  symbol: string;
  price: number;
  change: number;
  index?: number;
  isStale?: boolean;
  lastUpdate?: string;
};

export function WatchlistRow({
  symbol,
  price,
  change,
  index = 0,
  isStale = false,
  lastUpdate = '',
}: WatchlistRowProps) {
  const isPositive = change >= 0;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(startOrder({ symbol, side: 'buy', price }));
    navigate(`/markets/${symbol}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: 'easeOut' }}
      onClick={handleClick}
      className="flex flex-col gap-0.5 px-3 py-2 border-b-2 lg:border-b-3 border-card-border last:border-b-0 text-sm cursor-pointer hover:bg-navy/40 transition-colors"
    >
      <div className="flex justify-between items-center">
        <span className="text-ice/80 uppercase text-sm sm:text-[16px]">
          {symbol}
        </span>
        <span
          className={`text-sm sm:text-lg transition-opacity ${
            isPositive ? 'text-signal' : 'text-alert'
          } ${isStale ? 'opacity-50' : 'opacity-100'}`}
        >
          {isPositive ? '+' : ''}
          <Odometer key={change} value={change.toFixed(2)} />%
        </span>
      </div>
      {isStale && (
        <div className="flex justify-end">
          <StaleFeedBadge lastUpdate={lastUpdate} />
        </div>
      )}
    </motion.div>
  );
}