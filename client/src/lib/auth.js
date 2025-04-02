import apiRequest from "@/lib/apiRequest";

export const handleLogout = (updateUser, navigate) => {
  return async () => {
    try {
      await apiRequest.post("/auth/logout");
      await updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
};
