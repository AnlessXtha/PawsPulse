import { createApiClient } from "@/lib/createApiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createApiClient } from "../services/creatApiClient";

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
    // for toast message
    // addToast({
    //   id: generateUniqueId(),
    //   title: `${error?.response?.data?.message}`,
    //   text: `${error?.response?.data?.description}`,
    //   color: "danger",
    // });
    console.log("Error: ", error);
    throw error;
  }
});

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

        // let typeFullForm: string;
        const loadedUsers = action.payload;

        // Sorting the Users by date in descending order
        // loadedUsers.sort((a: any, b: any) => {
        //   const dateA = new Date(a.created_at);
        //   const dateB = new Date(b.created_at);

        //   return dateB.getTime() - dateA.getTime();
        // });

        state.users = [...loadedUsers];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      });
  },
});

export const selectAllUsers = (state) => state.users.users;
export const getUsersStatus = (state) => state.users.status;
export const getUsersError = (state) => state.users.error;

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default userSlice.reducer;
