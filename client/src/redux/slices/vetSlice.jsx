import { createApiClient } from "@/lib/createApiClient";
import { showToast } from "@/lib/toastUtils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { createApiClient } from "../services/creatApiClient";

const BASE_URL = "http://localhost:8805/api/";

const userApiClient = createApiClient(BASE_URL);

const initialState = {
  vets: [],
  singleVet: null,
  status: "idle",
  error: null,
};

export const fetchVets = createAsyncThunk("profiles/fetchVets", async () => {
  try {
    const response = await userApiClient.get("/users/vets/");
    console.log("response: ", response.data);

    return [...response.data.vets];
  } catch (error) {
    showToast("An error has ocurred", error?.response?.data?.message, "error");
    console.log("Error: ", error);
    throw error;
  }
});

export const addVet = createAsyncThunk(
  "vets/addVet",
  async (newVetData, { rejectWithValue }) => {
    try {
      const response = await userApiClient.post("/auth/register/", newVetData);
      showToast("Vet registered", response?.data?.message, "success");
      return response.data;
    } catch (error) {
      showToast(
        "An error has ocurred",
        error?.response?.data?.message,
        "error"
      );
      console.error("Error registering vet:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to register vet"
      );
    }
  }
);

export const deleteVet = createAsyncThunk(
  "vets/deleteVet",
  async (id, { rejectWithValue }) => {
    try {
      const response = await userApiClient.delete(`/users/${id}`);
      showToast("Vet Deleted", response?.data?.message, "success");
      return response;
    } catch (error) {
      console.error("Error registering vet:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to register vet"
      );
    }
  }
);

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
      })
      .addCase(addVet.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addVet.fulfilled, (state, action) => {
        state.status = "successful";
        if (action.payload?.newVet) {
          state.vets.push(action.payload.newVet);
        }
      })
      .addCase(addVet.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to register vet";
      })
      .addCase(deleteVet.fulfilled, (state, action) => {
        state.status = "successful";
      });
  },
});

export const selectAllVets = (state) => state.vets.vets;
export const getVetsStatus = (state) => state.vets.status;
export const getVetsError = (state) => state.vets.error;

export default vetSlice.reducer;
