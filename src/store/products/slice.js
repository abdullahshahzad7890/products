import { createSlice } from "@reduxjs/toolkit";
import { getDataHoldersSummary } from "./thunk";
import { data } from "./data";

const dataHoldersSlice = createSlice({
  name: "dataHolders",
  initialState: {
    summary: data,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataHoldersSummary.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDataHoldersSummary.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.summary = action.payload;
      })
      .addCase(getDataHoldersSummary.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.statusMessage;
      });
  },
});

export default dataHoldersSlice.reducer;

export { getDataHoldersSummary } from "./thunk";
