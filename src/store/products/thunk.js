import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

export const getDataHoldersSummary = createAsyncThunk(
  "dataHolders/getSummary",
  async (_, thunkAPI) => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.cdr.gov.au/cdr-register/v1/all/data-holders/brands/summary",
      headers: {
        "x-v": "1",
      },
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Error fetching data holders summary:", error);
      return thunkAPI.rejectWithValue({
        statusCode: error.response?.status || 500,
        statusMessage: error.message,
      });
    }
  }
);
