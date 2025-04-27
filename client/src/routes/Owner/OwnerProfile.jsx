import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { logout } from "@/redux/slices/authSlice";
import {
  getSingleUser,
  deleteUserById,
  selectSingleUser,
} from "@/redux/slices/userSlice";
import { AuthContext } from "@/context/AuthContext";
import { handleLogout } from "@/lib/auth";

const OwnerProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(selectSingleUser);

  const { currentUser, updateUser } = useContext(AuthContext);
  console.log(currentUser, "currentUser");

  useEffect(() => {
    dispatch(getSingleUser(currentUser?.id));
  }, [dispatch, currentUser]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteUserById(userData?.id)).unwrap();
      handleLogout(updateUser, navigate);
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-105px)] bg-[#f2f2f2] py-16 px-4">
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#A63E4B]">
          Owner Profile
        </h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">User Profile</h2>
          <div className="border-t my-2" />
          <div className="grid grid-cols-2 gap-4">
            {editMode ? (
              <>
                <Input defaultValue={userData.firstName} />
                <Input defaultValue={userData.lastName} />
                <Input defaultValue={userData.username} />
                <Input defaultValue={userData.email} />
                <Input defaultValue={userData.contactNumber} />
              </>
            ) : (
              <>
                <p>
                  <strong>First Name:</strong> {userData.firstName}
                </p>
                <p>
                  <strong>Last Name:</strong> {userData.lastName}
                </p>
                <p>
                  <strong>Username:</strong> {userData.username}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
                <p>
                  <strong>Contact Number:</strong> {userData.contactNumber}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Pet Profile</h2>
          <div className="border-t my-2" />
          {userData.petProfile ? (
            <div className="grid grid-cols-2 gap-4">
              <p>
                <strong>Name:</strong> {userData.petProfile.petName}
              </p>
              <p>
                <strong>Type:</strong> {userData.petProfile.petType}
              </p>
              <p>
                <strong>Breed:</strong> {userData.petProfile.petBreed}
              </p>
              <p>
                <strong>Age:</strong> {userData.petProfile.petAge}
              </p>
              <p>
                <strong>Gender:</strong> {userData.petProfile.petGender}
              </p>
            </div>
          ) : (
            <p>No pet profile found.</p>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 text-white"
          >
            {editMode ? "Cancel" : "Update Profile"}
          </Button>
          <Button onClick={handleDelete} className="bg-red-600 text-white">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
