/* eslint-disable no-param-reassign */

import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({
  currentChannelId: 1,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,

  reducers: {
    addChannel: channelsAdapter.addOne,
    addChannels: channelsAdapter.setAll,
    removeChannel: ((state, action) => {
      channelsAdapter.removeOne(state, action.payload.id);
      if (action.payload.id === state.currentChannelId) {
        state.currentChannelId = 1;
      }
    }),
    changeChannelName: channelsAdapter.updateOne,
    setCurrentChannelId: ((state, action) => {
      state.currentChannelId = action.payload;
    }),
  },
});

export const { actions } = channelsSlice;
export default channelsSlice.reducer;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
