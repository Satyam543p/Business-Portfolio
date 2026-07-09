import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice.js';
import caseStudiesReducer from './slices/caseStudiesSlice.js';
import leadsReducer from './slices/leadsSlice.js';
import calculatorReducer from './slices/calculatorSlice.js';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    caseStudies: caseStudiesReducer,
    leads: leadsReducer,
    calculator: calculatorReducer,
  },
});

export default store;
