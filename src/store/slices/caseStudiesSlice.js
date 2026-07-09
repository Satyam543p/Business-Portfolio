import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Query } from 'appwrite';
import { databases, DATABASE_ID, CASE_STUDIES_COLLECTION_ID } from '../../lib/appwrite.js';

export const fetchCaseStudies = createAsyncThunk(
  'caseStudies/fetchCaseStudies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        CASE_STUDIES_COLLECTION_ID,
        [
          Query.equal('is_published', true),
          Query.orderAsc('sort_order')
        ]
      );
      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch case studies.');
    }
  }
);

const caseStudiesSlice = createSlice({
  name: 'caseStudies',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCaseStudies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCaseStudies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCaseStudies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default caseStudiesSlice.reducer;
