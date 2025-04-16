import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import petReducer from "./slices/petSlice";
import vetReducer from "./slices/vetSlice";
import appointmentReducer from "./slices/appointmentSlice";
import chatReducer from "./slices/chatSlice";

export default configureStore({
  reducer: {
    users: userReducer,
    pets: petReducer,
    vets: vetReducer,
    appointments: appointmentReducer,
    chats: chatReducer,
  },
});
