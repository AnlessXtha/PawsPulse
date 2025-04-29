import { createApiClient } from "@/lib/createApiClient";
import { showToast } from "@/lib/toastUtils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_REPORT_URL = "http://localhost:8805/api/reports";
const reportApiClient = createApiClient(BASE_REPORT_URL);

const initialState = {
  reports: [],
  singleReport: null,
  status: "idle",
  error: null,
};

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async () => {
    try {
      const response = await reportApiClient.get("/");
      console.log("Fetched reports:", response.data.reports);
      return [...response.data.reports];
    } catch (error) {
      console.error("Error fetching reports:", error);
      throw error;
    }
  }
);

export const fetchSingleReport = createAsyncThunk(
  "reports/fetchSingleReport",
  async (id) => {
    try {
      const response = await reportApiClient.get(`/${id}`);
      console.log("Fetched single report:", response.data.report);

      return response.data.report;
    } catch (error) {
      console.error("Error fetching single report:", error);
      throw error;
    }
  }
);

export const addReport = createAsyncThunk(
  "reports/addReport",
  async (newReportData) => {
    try {
      const response = await reportApiClient.post("/", newReportData);
      showToast(
        response?.data?.message || "Report created successfully",
        "",
        "success"
      );
      return response.data;
    } catch (error) {
      console.error("Error adding report:", error);
    }
  }
);

export const updateReport = createAsyncThunk(
  "reports/updateReport",
  async ({ id, payload: data }) => {
    try {
      const response = await reportApiClient.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating report:", error);
    }
  }
);

export const deleteReport = createAsyncThunk(
  "reports/deleteReport",
  async (id) => {
    try {
      const response = await reportApiClient.delete(`/${id}`);
      showToast("Report deleted successfully", "", "success");
      return id;
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  }
);

export const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearSingleReport: (state) => {
      state.singleReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "successful";
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Unknown error";
      })
      .addCase(addReport.fulfilled, (state, action) => {
        state.reports.push(action.payload.report);
      })
      .addCase(fetchSingleReport.fulfilled, (state, action) => {
        state.singleReport = action.payload;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.singleReport = action.payload;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.reports = state.reports.filter(
          (report) => report.reportId !== action.payload
        );
      });
  },
});

export const selectAllReports = (state) => state.reports.reports;
export const getSingleReport = (state) => state.reports.singleReport;
export const getReportsStatus = (state) => state.reports.status;
export const getReportsError = (state) => state.reports.error;

export const { clearSingleReport } = reportSlice.actions;

export default reportSlice.reducer;
