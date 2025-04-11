import { createApiClient } from "@/lib/createApiClient";
import { showToast } from "@/lib/toastUtils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_APPOINTMENT_URL = "http://localhost:8805/api/appointments";
const appointmentApiClient = createApiClient(BASE_APPOINTMENT_URL);

const initialState = {
  appointments: [],
  singleAppointment: null,
  status: "idle",
  error: null,
};

export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    try {
      const response = await appointmentApiClient.get("/");

      console.log(response.data, "response.data");

      return [...response.data.appointments];
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }
);

export const fetchSingleAppointment = createAsyncThunk(
  "pets/fetchSingleAppointment",
  async (id) => {
    try {
      const response = await appointmentApiClient.get(`/${id}`);

      console.log("Appointment response: ", response.data);

      return response.data.appointment;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    }
  }
);

export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",
  async (newAppointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentApiClient.post("/", newAppointmentData);
      showToast(
        response?.data?.message || "Event has been created",
        response?.data?.description || "Sunday, December 03, 2023 at 9:00 AM",
        "success"
      );
      return response.data;
    } catch (error) {
      console.error("Error adding appointment:", error);
      return rejectWithValue(
        error.response?.data || "Failed to add appointment"
      );
    }
  }
);

export const updateAppointment = createAsyncThunk(
  "appointments/updateAppointment",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log("updateAppointmentData", id, data);

      const response = await appointmentApiClient.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error adding appointment:", error);
      return rejectWithValue(
        error.response?.data || "Failed to add appointment"
      );
    }
  }
);

export const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "successful";
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })
      .addCase(addAppointment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.status = "successful";
        state.appointments.push(action.payload);
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add appointment";
      })
      .addCase(fetchSingleAppointment.fulfilled, (state, action) => {
        state.singleAppointment = action.payload;
      });
  },
});

export const selectAllAppointments = (state) => state.appointments.appointments;
export const getSingleAppointment = (state) =>
  state.appointments.singleAppointment;
export const getAppointmentsStatus = (state) => state.appointments.status;
export const getAppointmentsError = (state) => state.appointments.error;

export default appointmentSlice.reducer;
