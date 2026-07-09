import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, AGENCY_PROFILE_COLLECTION_ID } from '../../lib/appwrite.js';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        AGENCY_PROFILE_COLLECTION_ID
      );
      if (response.documents.length === 0) {
        return rejectWithValue('No profile document found.');
      }
      // Return the first and only agency profile document
      return response.documents[0];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile.');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default profileSlice.reducer;
