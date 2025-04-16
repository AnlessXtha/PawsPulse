import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApiClient } from "@/lib/createApiClient";
import { showToast } from "@/lib/toastUtils";

const BASE_CHAT_URL = "http://localhost:8805/api/chats";
const chatApiClient = createApiClient(BASE_CHAT_URL);

const initialState = {
  chats: [],
  singleChat: null,
  status: "idle",
  error: null,
};

export const fetchChats = createAsyncThunk("chats/fetchChats", async () => {
  try {
    const response = await chatApiClient.get("/");
    console.log("Fetched chats:", response.data);
    return [...response.data.chats];
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
});

export const fetchSingleChat = createAsyncThunk(
  "chats/fetchSingleChat",
  async (id) => {
    try {
      const response = await chatApiClient.get(`/${id}`);
      console.log("Fetched single chat:", response.data);

      return response.data.chat;
    } catch (error) {
      console.error("Error fetching single chat:", error);
      throw error;
    }
  }
);

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.status = "successful";
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch chats";
      })
      .addCase(fetchSingleChat.fulfilled, (state, action) => {
        state.singleChat = action.payload;
      });
  },
});

export const selectAllChats = (state) => state.chats.chats;
export const getSingleChat = (state) => state.chats.singleChat;
export const getChatsStatus = (state) => state.chats.status;
export const getChatsError = (state) => state.chats.error;

export default chatSlice.reducer;
