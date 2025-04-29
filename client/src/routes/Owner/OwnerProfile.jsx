import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/shadcn-components/ui/button";
import { Input } from "@/components/shadcn-components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getSingleUser,
  deleteUserById,
  selectSingleUser,
} from "@/redux/slices/userSlice";
import { AuthContext } from "@/context/AuthContext";
import { handleLogout } from "@/lib/auth";
import { Syringe } from "lucide-react";
import { fetchReports, selectAllReports } from "@/redux/slices/reportSlice";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/ui/dialog";
import ReportTemplate from "@/components/components/ReportTemplate";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

const OwnerProfile = () => {
  const [editOwner, setEditOwner] = useState(false);
  const [editPet, setEditPet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(selectSingleUser);
  const allReports = useSelector(selectAllReports);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const { currentUser, updateUser } = useContext(AuthContext);

  useEffect(() => {
    dispatch(getSingleUser(currentUser?.id));
  }, [dispatch, currentUser]);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

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
    <div className="px-8 py-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-5">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#A63E4B]">
          Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Owner Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Owner Profile
            </h2>
            <div className="border-t my-2" />

            {editOwner ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">First Name</label>
                  <Input defaultValue={userData.firstName} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Last Name</label>
                  <Input defaultValue={userData.lastName} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Username</label>
                  <Input defaultValue={userData.username} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  <Input defaultValue={userData.email} />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Contact Number
                  </label>
                  <Input defaultValue={userData.contactNumber} />
                </div>

                <div className="flex gap-4 mt-4">
                  <Button className="bg-[#a63e4b] text-white">Update</Button>
                  <Button variant="outline" onClick={() => setEditOwner(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
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

                <Button
                  onClick={() => setEditOwner(true)}
                  className="bg-[#a63e4b] text-white mt-4"
                >
                  Update Owner Profile
                </Button>
              </div>
            )}
          </div>

          {/* Pet Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Pet Profile
            </h2>
            <div className="border-t my-2" />

            {userData.petProfile ? (
              editPet ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 mb-1">Name</label>
                    <Input defaultValue={userData.petProfile.petName} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Type</label>
                    <Input defaultValue={userData.petProfile.petType} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Breed</label>
                    <Input defaultValue={userData.petProfile.petBreed} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Age</label>
                    <Input defaultValue={userData.petProfile.petAge} />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">Gender</label>
                    <Input defaultValue={userData.petProfile.petGender} />
                  </div>

                  <div className="flex gap-4 mt-4">
                    <Button className="bg-[#a63e4b] text-white">Update</Button>
                    <Button variant="outline" onClick={() => setEditPet(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
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

                  <Button
                    onClick={() => setEditPet(true)}
                    className="bg-[#a63e4b] text-white mt-4"
                  >
                    Update Pet Profile
                  </Button>
                </div>
              )
            ) : (
              <p>No pet profile found.</p>
            )}
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleDelete} className="bg-red-600 text-white">
            Delete Account
          </Button>
        </div>
      </div>

      {/* Reports and Vaccination Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#A63E4B]">
          Medical Records
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reports Column */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-700">Reports</h3>

            {allReports?.length > 0 ? (
              allReports.map((report, idx) => (
                <div
                  key={idx}
                  className="p-4 mb-4 border rounded shadow bg-white relative"
                >
                  <p>
                    <strong>Pet:</strong>{" "}
                    {report.petProfile?.petName || "Unknown"}
                  </p>
                  <p>
                    <strong>Vet:</strong> Dr. {report.vet?.user?.firstName}{" "}
                    {report.vet?.user?.lastName}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>

                  <Button
                    className="absolute top-4 right-4 bg-[#a63e4b] text-white"
                    size="sm"
                    onClick={() => {
                      setSelectedReport(report);
                      setOpenDialog(true);
                    }}
                  >
                    View
                  </Button>
                </div>
              ))
            ) : (
              <p>No reports found.</p>
            )}

            {/* Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogContent className="min-w-[1200px] h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Report Preview</DialogTitle>
                </DialogHeader>

                <div className="h-[80vh] overflow-hidden border rounded">
                  <PDFViewer style={{ width: "100%", height: "100%" }}>
                    <ReportTemplate report={selectedReport} />
                  </PDFViewer>
                </div>

                <DialogFooter className="mt-4 flex justify-between">
                  <PDFDownloadLink
                    document={<ReportTemplate report={selectedReport} />}
                    fileName="report.pdf"
                    className="bg-[#a63e4b] text-white px-4 py-2 rounded"
                  >
                    {({ loading }) =>
                      loading ? "Preparing..." : "Download PDF"
                    }
                  </PDFDownloadLink>

                  <Button
                    variant="outline"
                    onClick={() => setOpenDialog(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Vaccination Column */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-gray-700">
              Vaccination Records
            </h3>

            {/* Still mock vaccinations */}
            {[
              {
                vaccineName: "Rabies",
                dateAdministered: "2024-01-15",
                manufacturer: "VetCo Labs",
              },
              {
                vaccineName: "Parvovirus",
                dateAdministered: "2023-12-01",
                manufacturer: "HealthyPets Inc.",
              },
            ].map((vaccine, idx) => (
              <div
                key={idx}
                className="relative p-4 pl-12 mb-4 border rounded shadow bg-white"
              >
                <Syringe
                  className="absolute left-4 top-4 text-[#a63e4b]"
                  size={20}
                />
                <p>
                  <strong>Vaccine:</strong> {vaccine.vaccineName}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(vaccine.dateAdministered).toLocaleDateString()}
                </p>
                <p>
                  <strong>Manufacturer:</strong> {vaccine.manufacturer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <PDFDownloadLink document={<ReportTemplate />} fileName="somename.pdf">
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>
      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <ReportTemplate />
      </PDFViewer> */}
    </div>
  );
};

export default OwnerProfile;
