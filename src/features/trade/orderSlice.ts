import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MOCK_AVAILABLE_CASH } from "../../lib/mockData";

type OrderSide = "buy" | "sell";
type OrderStep = "size" | "review" | "confirmed" | "rejected";

type OrderState = {
  symbol: string | null;
  side: OrderSide;
  quantity: number;
  limitPrice: number;
  step: OrderStep;
  orderReference: string | null;
  rejectionReason: string | null;
};

const initialState: OrderState = {
  symbol: null,
  side: "buy",
  quantity: 0,
  limitPrice: 0,
  step: "size",
  orderReference: null,
  rejectionReason: null,
};

// Mocked available cash — swap for real portfolio state once wired up
const AVAILABLE_CASH = MOCK_AVAILABLE_CASH;

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    startOrder: (
      state,
      action: PayloadAction<{ symbol: string; side: OrderSide; price: number }>,
    ) => {
      state.symbol = action.payload.symbol;
      state.side = action.payload.side;
      state.limitPrice = action.payload.price;
      state.quantity = 0;
      state.step = "size";
      state.orderReference = null;
      state.rejectionReason = null;
    },
    setQuantity: (state, action: PayloadAction<number>) => {
      // Clamp: never allow negative quantity, even via direct keyboard entry
      state.quantity = Math.max(0, action.payload);
    },
    setLimitPrice: (state, action: PayloadAction<number>) => {
      state.limitPrice = Math.max(0, action.payload);
    },
    goToReview: (state) => {
      state.step = "review";
    },
    goBackToSize: (state) => {
      state.step = "size";
      state.rejectionReason = null;
    },
    setSide: (state, action: PayloadAction<OrderSide>) => {
      state.side = action.payload;
    },
    confirmOrder: (state) => {
      const estimatedCost = state.quantity * state.limitPrice;
      const fees = estimatedCost * 0.0015;
      const totalCost = estimatedCost + fees;

      if (state.side === "buy" && totalCost > AVAILABLE_CASH) {
        state.step = "rejected";
        state.rejectionReason = `Insufficient funds — this order needs ${totalCost.toFixed(
          2,
        )} but only ${AVAILABLE_CASH.toFixed(2)} is available in cash.`;
        return;
      }

      state.orderReference = `ORD-${Date.now()}`;
      state.step = "confirmed";
    },
    resetOrder: () => initialState,
  },
});

export const {
  startOrder,
  setSide,
  setQuantity,
  setLimitPrice,
  goToReview,
  goBackToSize,
  confirmOrder,
  resetOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
