/* eslint-disable no-param-reassign */

import axios from 'axios';
import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import routes from '../routes.js';

const getAuthHeader = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (currentUser && currentUser.token) {
    return { Authorization: `Bearer ${currentUser.token}` };
  }
  return {};
};

const fetchData = createAsyncThunk(
  'fetchData',
  async () => {
    const response = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
    return response.data;
  },
);

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  currentChannelId: 1,
  isFetching: false,
  error: null,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,

  reducers: {
    addChannel: channelsAdapter.addOne,
    removeChannel: ((state, action) => {
      channelsAdapter.removeOne(state, action.payload.id);
      if (action.payload.id === state.currentChannelId) {
        state.currentChannelId = action.payload;
      }
    }),
    changeChannelName: channelsAdapter.updateOne,
    setCurrentChannelId: ((state, action) => {
      state.currentChannelId = action.payload;
    }),
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        const { channels, currentChannelId } = action.payload;
        channelsAdapter.setAll(state, channels);
        state.currentChannelId = currentChannelId;
        state.isFetching = false;
        state.error = null;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.error;
      });
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export { fetchData };
