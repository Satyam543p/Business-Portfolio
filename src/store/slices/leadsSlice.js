import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ID } from 'appwrite';
import { databases, DATABASE_ID, CLIENT_LEADS_COLLECTION_ID } from '../../lib/appwrite.js';

export const submitLead = createAsyncThunk(
  'leads/submitLead',
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        CLIENT_LEADS_COLLECTION_ID,
        ID.unique(),
        {
          client_name: leadData.client_name,
          business_name: leadData.business_name,
          whatsapp_number: leadData.whatsapp_number,
          business_type: leadData.business_type || '',
          message: leadData.message || '',
          status: 'new'
        }
      );

      // Web3Forms Email Alert trigger
      const web3Key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (web3Key && web3Key !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
        try {
          await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: web3Key,
              subject: `New Lead: ${leadData.client_name} - ${leadData.business_name}`,
              from_name: 'Portfolio Alerts',
              name: leadData.client_name,
              message: `New Lead Submission Details:
------------------------------------------
Client Name: ${leadData.client_name}
Business Name: ${leadData.business_name}
WhatsApp Number: ${leadData.whatsapp_number}
Business Category: ${leadData.business_type || 'Not specified'}

Client Message:
${leadData.message || 'No message provided.'}
`
            })
          });
        } catch (emailError) {
          console.warn('Web3Forms email dispatch failed, falling back silently:', emailError);
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to submit lead.');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    loading: false,
    success: false,
    error: null,
    lastSubmittedLead: null,
  },
  reducers: {
    resetLeadStatus: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLead.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitLead.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.lastSubmittedLead = action.payload;
      })
      .addCase(submitLead.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetLeadStatus } = leadsSlice.actions;
export default leadsSlice.reducer;
