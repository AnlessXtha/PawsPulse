import { createApiClient } from "@/lib/createApiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Base URL for the appointment API
const BASE_APPOINTMENT_URL = "http://localhost:8805/api/appointments";

// Create an API client for the appointment endpoint
const appointmentApiClient = createApiClient(BASE_APPOINTMENT_URL);

// Initial state for the appointment slice
const initialState = {
  appointments: [], // List of all appointments
  singleAppointment: null, // Single appointment details (if needed)
  status: "idle", // Status of the async operations: 'idle', 'loading', 'successful', 'failed'
  error: null, // Error message if any
};

/**
 * Async thunk to fetch all appointments
 */
export const fetchAppointments = createAsyncThunk(
  "appointments/fetchAppointments",
  async () => {
    try {
      const response = await appointmentApiClient.get("/");
      return [...response.data.appointments]; // Assuming the API returns an array of appointments
    } catch (error) {
      console.error("Error fetching appointments:", error);
      throw error;
    }
  }
);

/**
 * Async thunk to create a new appointment
 */
export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",
  async (newAppointmentData, { rejectWithValue }) => {
    try {
      const response = await appointmentApiClient.post("/", newAppointmentData);
      return response.data; // Assuming the API returns the created appointment
    } catch (error) {
      console.error("Error adding appointment:", error);
      return rejectWithValue(
        error.response?.data || "Failed to add appointment"
      );
    }
  }
);

// Create the appointment slice
export const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.status = "successful";
        state.appointments = action.payload; // Update the appointments list
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })

      // Add appointment
      .addCase(addAppointment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.status = "successful";
        state.appointments.push(action.payload); // Add the new appointment to the list
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add appointment";
      });
  },
});

// Selectors
export const selectAllAppointments = (state) => state.appointments.appointments;
export const getAppointmentsStatus = (state) => state.appointments.status;
export const getAppointmentsError = (state) => state.appointments.error;

// Export the reducer
export default appointmentSlice.reducer;
