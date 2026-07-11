import { createSlice } from '@reduxjs/toolkit';

const calculatorSlice = createSlice({
  name: 'calculator',
  initialState: {
    monthlyRevenue: 500000, // default initial simulated monthly revenue (INR)
    businessType: 'hospitality', // 'hospitality' or 'general'
  },
  reducers: {
    setMonthlyRevenue: (state, action) => {
      state.monthlyRevenue = Number(action.payload);
    },
    setBusinessType: (state, action) => {
      state.businessType = action.payload;
    },
  },
});

// Selectors for derived calculator values
export const selectMonthlyRevenue = (state) => state.calculator.monthlyRevenue;
export const selectBusinessType = (state) => state.calculator.businessType || 'hospitality';
export const selectMonthlyLoss = (state) => {
  const rev = state.calculator.monthlyRevenue;
  const type = state.calculator.businessType || 'hospitality';
  // Hospitality / Retail loses 20% to aggregator commissions
  // General Business (Schools, Clinics, Salons) loses ~15% to lost lead conversions + admin staff overhead
  return type === 'hospitality' ? rev * 0.20 : rev * 0.15;
};
export const selectAnnualLoss = (state) => {
  const rev = state.calculator.monthlyRevenue;
  const type = state.calculator.businessType || 'hospitality';
  return (type === 'hospitality' ? rev * 0.20 : rev * 0.15) * 12;
};

export const { setMonthlyRevenue, setBusinessType } = calculatorSlice.actions;
export default calculatorSlice.reducer;
