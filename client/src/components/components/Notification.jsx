import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/shadcn-components/ui/button";
import { AuthContext } from "@/context/AuthContext";
import { createApiClient } from "@/lib/createApiClient";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const BASE_NOTIFICATION_URL = "http://localhost:8805/api/notifications";
  const notificationApiClient = createApiClient(BASE_NOTIFICATION_URL);

  const fetchNotifications = async () => {
    try {
      const response = await notificationApiClient.get(
        `user/${currentUser.id}`
      );
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationApiClient.patch(`${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const handleRedirect = (notif) => {
    if (currentUser.userType === "owner") {
      if (notif.type === "message") {
        navigate("/user/viewMessages");
      } else if (notif.type === "appointment") {
        navigate("/user/viewAppointments");
      } else if (notif.type === "report") {
        navigate("/user/profile");
      }
    } else if (currentUser.userType === "vet") {
      if (notif.type === "message") {
        navigate("/vet/messages");
      } else if (notif.type === "appointment") {
        navigate("/vet/appointments");
      }
    }
  };

  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold mb-6">My Notifications</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        {paginatedNotifications.length > 0 ? (
          <div className="flex flex-col gap-4">
            {paginatedNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-center justify-between border p-4 rounded shadow ${
                  notif.isRead ? "bg-gray-100" : "bg-white"
                }`}
              >
                {/* Left side - Notification message */}
                <div className="flex flex-col">
                  <p className="text-lg">{notif.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Right side - Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="bg-[#a63e4b] text-white"
                    onClick={() => handleRedirect(notif)}
                  >
                    View
                  </Button>

                  {!notif.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(notif.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <p>No notifications available.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {notifications.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
