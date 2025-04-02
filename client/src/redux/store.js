import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import petReducer from "./slices/petSlice";
import vetReducer from "./slices/vetSlice";

export default configureStore({
  reducer: {
    users: userReducer,
    pets: petReducer,
    vets: vetReducer,
  },
});
