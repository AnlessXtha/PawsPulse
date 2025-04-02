import { createApiClient } from "@/lib/createApiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createApiClient } from "../services/creatApiClient";

const BASE_USER_URL = "http://localhost:8805/api/pets";

const petApiClient = createApiClient(BASE_USER_URL);

const initialState = {
  pets: [],
  singlePet: null,
  status: "idle",
  error: null,
};

export const fetchPets = createAsyncThunk("profiles/fetchPets", async () => {
  try {
    const response = await petApiClient.get("/");

    return [...response.data.pets];
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

export const petslice = createSlice({
  name: "pets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.status = "successful";

        // let typeFullForm: string;
        const loadedpets = action.payload;

        // Sorting the pets by date in descending order
        // loadedpets.sort((a: any, b: any) => {
        //   const dateA = new Date(a.created_at);
        //   const dateB = new Date(b.created_at);

        //   return dateB.getTime() - dateA.getTime();
        // });

        state.pets = [...loadedpets];
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      });
  },
});

export const selectAllPets = (state) => state.pets.pets;
export const getPetsStatus = (state) => state.pets.status;
export const getPetsError = (state) => state.pets.error;

// Action creators are generated for each case reducer function
// export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default petslice.reducer;
