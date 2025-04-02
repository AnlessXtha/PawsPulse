import { createApiClient } from "@/lib/createApiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createApiClient } from "../services/creatApiClient";

const BASE_USER_URL = "http://localhost:8805/api/users";

const userApiClient = createApiClient(BASE_USER_URL);

const initialState = {
  vets: [],
  singleVet: null,
  status: "idle",
  error: null,
};

export const fetchVets = createAsyncThunk("profiles/fetchVets", async () => {
  try {
    const response = await userApiClient.get("/vets/");
    console.log("response: ", response.data);

    return [...response.data.vets];
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

export const vetSlice = createSlice({
  name: "vets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVets.fulfilled, (state, action) => {
        state.status = "successful";

        // let typeFullForm: string;
        const loadedVets = action.payload;

        // Sorting the Users by date in descending order
        // loadedVets.sort((a: any, b: any) => {
        //   const dateA = new Date(a.created_at);
        //   const dateB = new Date(b.created_at);

        //   return dateB.getTime() - dateA.getTime();
        // });

        state.vets = [...loadedVets];
      })
      .addCase(fetchVets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      });
  },
});

export const selectAllVets = (state) => state.vets.vets;
export const getVetsStatus = (state) => state.vets.status;
export const getVetsError = (state) => state.vets.error;

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default vetSlice.reducer;
