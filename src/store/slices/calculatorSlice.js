import { createSlice } from '@reduxjs/toolkit';

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState: {
    monthlyRevenue: 500000, // default initial simulated monthly revenue (INR)
  },
  reducers: {
    setMonthlyRevenue: (state, action) => {
      state.monthlyRevenue = Number(action.payload);
    },
  },
});

// Selectors for derived calculator values
export const selectMonthlyRevenue = (state) => state.calculator.monthlyRevenue;
export const selectMonthlyLoss = (state) => state.calculator.monthlyRevenue * 0.20;
export const selectAnnualLoss = (state) => state.calculator.monthlyRevenue * 0.20 * 12;

export const { setMonthlyRevenue } = calculatorSlice.actions;
export default calculatorSlice.reducer;
