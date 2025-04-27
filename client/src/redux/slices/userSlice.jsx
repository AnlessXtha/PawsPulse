import { createApiClient } from "@/lib/createApiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_USER_URL = "http://localhost:8805/api/users";
const userApiClient = createApiClient(BASE_USER_URL);

const initialState = {
  users: [],
  singleUser: null,
  status: "idle",
  error: null,
};

export const fetchUsers = createAsyncThunk("profiles/fetchUsers", async () => {
  try {
    const response = await userApiClient.get("/");
    return [...response.data.users];
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
});

export const getSingleUser = createAsyncThunk(
  "profiles/getSingleUser",
  async (id) => {
    try {
      const response = await userApiClient.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  }
);

export const deleteUserById = createAsyncThunk(
  "profiles/deleteUserById",
  async (id) => {
    try {
      const response = await userApiClient.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "successful";
        state.users = [...action.payload];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.singleUser = action.payload;
      })
      .addCase(deleteUserById.fulfilled, (state) => {
        state.singleUser = null;
      });
  },
});

export const selectAllUsers = (state) => state.users.users;
export const getUsersStatus = (state) => state.users.status;
export const getUsersError = (state) => state.users.error;
export const selectSingleUser = (state) => state.users.singleUser;

export default userSlice.reducer;
