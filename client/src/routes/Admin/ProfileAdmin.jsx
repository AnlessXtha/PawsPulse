import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/shadcn-components/ui/input";
import { getSingleUser, selectSingleUser } from "@/redux/slices/userSlice";
import { AuthContext } from "@/context/AuthContext";

const ProfileAdmin = () => {
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);

  const user = useSelector(selectSingleUser);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getSingleUser(currentUser.id));
    }
  }, [dispatch, currentUser]);

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Profile</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">First Name</label>
          <Input value={user.firstName || ""} disabled />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Last Name</label>
          <Input value={user.lastName || ""} disabled />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <Input value={user.username || ""} disabled />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <Input value={user.email || ""} disabled />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Contact Number
          </label>
          <Input value={user.contactNumber || ""} disabled />
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;
