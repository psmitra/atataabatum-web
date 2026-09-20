import { useParams, Link, Navigate } from "react-router";
import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  setSide,
  setQuantity,
  setLimitPrice,
  goToReview,
  goBackToSize,
  confirmOrder,
} from "./orderSlice";

export function OrderTicket() {
  const { symbol } = useParams<{ symbol: string }>();
  const order = useAppSelector((state) => state.order);
  const dispatch = useAppDispatch();
  const [showLimitHint, setShowLimitHint] = useState(false);

  // Guard: direct visit or page refresh with no order started for this symbol
  if (!order.symbol || order.symbol !== symbol) {
    return <Navigate to="/" replace />;
  }

  const isBuy = order.side === "buy";
  const estimatedCost = (order.quantity * order.limitPrice).toFixed(2);
  const fees = (Number(estimatedCost) * 0.0015).toFixed(2);
  const quantityInvalid = order.quantity <= 0;

  return (
    <div className="min-h-screen bg-navy text-ice flex flex-col">
      <Header />
      <div className="max-w-2xl mx-auto w-full py-6 sm:py-10 px-6 sm:px-6 flex-1">
        <div className="bg-d-blue border-2 border-card-border rounded-[12px] px-6 sm:px-6 py-4 mb-4">
          <h1 className="text-sm sm:text-base text-ice/70">
            Order ticket ·{" "}
            <span className="text-ice font-semibold">{symbol}</span>
          </h1>
        </div>

        {order.step === "size" && (
          <div className="bg-[#0e2c55] border-2 border-card-border rounded-[12px] p-4 sm:p-6 flex flex-col gap-4">
            {/* Buy/Sell toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => dispatch(setSide("buy"))}
                className={`flex-1 py-3 rounded-[10px] font-bold transition-colors shadow-md shadow-black/10 hover:brightness-110 hover:cursor-pointer ${
                  isBuy ? "bg-signal text-white" : "bg-panel text-ice/60"
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => dispatch(setSide("sell"))}
                className={`flex-1 py-3 rounded-[10px] font-bold transition-colors shadow-md shadow-black/10 hover:brightness-110 hover:cursor-pointer ${
                  !isBuy ? "bg-alert text-white" : "bg-panel text-ice/60"
                }`}
              >
                SELL
              </button>
            </div>

            {/* Order type — static */}
            <div className="flex justify-between items-center bg-panel rounded-[10px] px-6 py-3 shadow-md shadow-black/10">
              <span className="text-ice/60 text-sm uppercase">Order type</span>
              <span className="text-base sm:text-lg font-semibold">Limit</span>
            </div>

            {/* Quantity — editable, with error state */}
            <div>
              <div
                className={`flex justify-between items-center bg-panel rounded-[10px] px-6 py-3 shadow-md shadow-black/10 transition-shadow border-2 ${
                  quantityInvalid
                    ? "border-alert focus-within:ring-2 focus-within:ring-alert"
                    : "border-transparent focus-within:ring-2 focus-within:ring-action"
                }`}
              >
                <label className="text-ice/60 text-sm uppercase">
                  Quantity
                </label>
                <input
                  type="number"
                  min={0}
                  value={order.quantity}
                  onChange={(e) =>
                    dispatch(setQuantity(Number(e.target.value)))
                  }
                  className="bg-transparent text-right text-base sm:text-lg font-semibold w-32 outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              {quantityInvalid && (
                <p className="text-alert text-xs mt-1.5 px-1">
                  Enter a quantity greater than 0 to continue.
                </p>
              )}
            </div>

            {/* Limit price — editable, with inline guidance */}
            <div className="flex justify-between items-center bg-panel rounded-[10px] px-6 py-3 shadow-md shadow-black/10 focus-within:ring-2 focus-within:ring-action transition-shadow">
              <div className="flex items-center gap-2 relative">
                <label className="text-ice/60 text-sm uppercase">
                  Limit price
                </label>
                <button
                  type="button"
                  onClick={() => setShowLimitHint((v) => !v)}
                  onBlur={() => setShowLimitHint(false)}
                  aria-label="What is a limit price?"
                  className="w-6 h-6 rounded-full bg-alert flex items-center justify-center shadow-md shadow-black/20 hover:brightness-110 transition-all hover:cursor-pointer flex-shrink-0"
                >
                  <FontAwesomeIcon
                    icon={faQuestion}
                    className="text-white text-xs"
                  />
                </button>
                {showLimitHint && (
                  <div className="absolute left-0 sm:left-full top-full sm:top-1/2 mt-2 sm:mt-0 sm:-translate-y-1/2 sm:ml-3 z-30 w-56 sm:w-60 max-w-[calc(100vw-3rem)] bg-d-blue border-2 border-alert rounded-[14px] p-3 text-xs sm:text-sm text-ice shadow-lg shadow-black/30">
                    A limit order only fills at your price or better. It may not
                    fill at all.
                  </div>
                )}
              </div>
              <input
                type="number"
                min={0}
                step={0.01}
                value={order.limitPrice}
                onChange={(e) =>
                  dispatch(setLimitPrice(Number(e.target.value)))
                }
                className="bg-transparent text-right text-base sm:text-lg font-semibold w-32 outline-none tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            {/* Time in force — static */}
            <div className="flex justify-between items-center bg-panel rounded-[10px] px-6 py-3 shadow-md shadow-black/10">
              <span className="text-ice/60 text-sm uppercase">
                Time in force
              </span>
              <span className="text-base sm:text-lg font-semibold">
                Good till cancelled
              </span>
            </div>

            {/* Estimated cost summary */}
            <div className="border-2 border-alert rounded-[10px] min-h-[100px] flex items-center px-5 py-4 text-sm sm:text-base text-ice/80 bg-navy tabular-nums">
              Estimated cost {estimatedCost} · fees {fees} · settles T+2
            </div>

            <button
              onClick={() => dispatch(goToReview())}
              disabled={quantityInvalid}
              className="mt-2 bg-action hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white font-bold py-3 rounded-[10px]"
            >
              Review order
            </button>
          </div>
        )}

        {order.step === "review" && (
          <div className="bg-navy border-2 border-card-border rounded-[12px] p-4 sm:p-6 flex flex-col gap-4">
            <h2 className="text-ice/70 uppercase text-sm tracking-wide">
              Review your order
            </h2>
            <div className="bg-panel rounded-[10px] p-4 flex flex-col gap-2 text-sm sm:text-base tabular-nums">
              <div className="flex justify-between">
                <span className="text-ice/60">Side</span>
                <span
                  className={
                    isBuy
                      ? "text-signal font-semibold"
                      : "text-alert font-semibold"
                  }
                >
                  {order.side.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ice/60">Symbol</span>
                <span>{symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ice/60">Quantity</span>
                <span>{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ice/60">Limit price</span>
                <span>{order.limitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-card-border pt-2">
                <span className="text-ice/60">Estimated cost</span>
                <span className="font-bold">{estimatedCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ice/60">Fees</span>
                <span>{fees}</span>
              </div>
              <div className="flex justify-between text-ice/60 text-xs">
                <span>Settles</span>
                <span>T+2</span>
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => dispatch(goBackToSize())}
                className="flex-1 bg-panel hover:bg-panel/70 transition-colors text-ice font-semibold py-3 rounded-[10px] shadow-md shadow-black/10"
              >
                Back
              </button>
              <button
                onClick={() => dispatch(confirmOrder())}
                className={`flex-1 ${isBuy ? "bg-signal" : "bg-alert"} hover:brightness-110 transition-all text-white font-bold py-3 rounded-[10px] shadow-md shadow-black/10`}
              >
                Confirm {order.side}
              </button>
            </div>
          </div>
        )}

        {order.step === "rejected" && (
          <div
            className="rounded-[12px] p-4 sm:p-6 text-center flex flex-col gap-4"
            style={{ backgroundColor: "#3a1f2b", border: "2px solid #d64545" }}
          >
            <h2
              className="text-base sm:text-lg font-bold"
              style={{ color: "#f09977" }}
            >
              Order rejected
            </h2>
            <p className="text-sm sm:text-base" style={{ color: "#f09977" }}>
              {order.rejectionReason}
            </p>
            <button
              onClick={() => dispatch(goBackToSize())}
              className="bg-action hover:brightness-110 transition-all text-white font-bold py-3 rounded-[10px] shadow-md shadow-black/10"
            >
              Edit order
            </button>
          </div>
        )}

        {order.step === "confirmed" && (
          <div className="bg-navy border-2 border-card-border rounded-[12px] p-4 sm:p-6 text-center flex flex-col gap-4">
            <h2 className="text-signal text-base sm:text-lg font-bold">
              Order placed
            </h2>
            <p className="text-ice/70 tabular-nums">
              Reference: {order.orderReference}
            </p>
            <Link
              to="/portfolio"
              className="mt-2 btn-primary hover:brightness-110 hover:cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:brightness-95 transition-all duration-200 text-white font-semibold px-5 py-2.5 rounded-[10px] text-sm sm:text-base"
            >
              Go to Portfolio
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
