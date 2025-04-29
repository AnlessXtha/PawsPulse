import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardContent } from "@/components/shadcn-components/ui/card";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports, selectAllReports } from "@/redux/slices/reportSlice";
import {
  fetchAppointments,
  selectAllAppointments,
} from "@/redux/slices/appointmentSlice";

const COLORS = ["#ff6384", "#36a2eb", "#ffce56"];

const VetDashboard = () => {
  const dispatch = useDispatch();
  const allReports = useSelector(selectAllReports);
  const allAppointments = useSelector(selectAllAppointments);

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchAppointments());
  }, [dispatch]);

  const stats = useMemo(() => {
    const patients = new Set(allReports.map((r) => r.userId)).size;
    const totalReports = allReports.length;
    const today = new Date();

    const upcomingAppointments = allAppointments.filter((appt) => {
      return (
        new Date(appt.appointmentDate) > today && appt.status !== "cancelled"
      );
    }).length;

    const vaccinationCounts = {
      Dogs: 0,
      Cats: 0,
      Others: 0,
    };

    allReports.forEach((report) => {
      if (report.petProfile?.petType === "Dog") vaccinationCounts.Dogs++;
      else if (report.petProfile?.petType === "Cat") vaccinationCounts.Cats++;
      else vaccinationCounts.Others++;
    });

    return {
      patients,
      upcomingAppointments,
      upcomingVaccinations:
        vaccinationCounts.Dogs +
        vaccinationCounts.Cats +
        vaccinationCounts.Others,
      totalReports,
      vaccinationBreakdown: vaccinationCounts,
    };
  }, [allReports, allAppointments]);

  const patientGrowthData = useMemo(() => {
    const growth = {};

    allReports.forEach((report) => {
      const month = new Date(report.createdAt).toLocaleString("default", {
        month: "short",
      });
      growth[month] = (growth[month] || 0) + 1;
    });

    return Object.keys(growth).map((month) => ({
      month,
      patients: growth[month],
    }));
  }, [allReports]);

  const appointmentTrends = useMemo(() => {
    const trends = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    allAppointments.forEach((appt) => {
      const day = new Date(appt.appointmentDate).toLocaleString("default", {
        weekday: "short",
      });
      trends[day] = (trends[day] || 0) + 1;
    });

    return Object.keys(trends).map((day) => ({
      day,
      count: trends[day],
    }));
  }, [allAppointments]);

  const reportData = patientGrowthData;

  const vaccinationData = useMemo(() => {
    const { Dogs, Cats, Others } = stats.vaccinationBreakdown;
    return [
      { type: "Dogs", value: Dogs || 0 },
      { type: "Cats", value: Cats || 0 },
      { type: "Others", value: Others || 0 },
    ];
  }, [stats]);

  return (
    <>
      <h1 className="text-4xl font-bold mb-6">Vet Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white shadow-md rounded-lg">
          <CardContent>
            <h3 className="text-gray-600 text-sm">Total Patients</h3>
            <p className="text-2xl font-bold">{stats.patients}</p>
          </CardContent>
        </Card>
        <Card className="p-4 bg-white shadow-md rounded-lg">
          <CardContent>
            <h3 className="text-gray-600 text-sm">Upcoming Appointments</h3>
            <p className="text-2xl font-bold">{stats.upcomingAppointments}</p>
          </CardContent>
        </Card>
        <Card className="p-4 bg-white shadow-md rounded-lg">
          <CardContent>
            <h3 className="text-gray-600 text-sm">Upcoming Vaccinations</h3>
            <p className="text-2xl font-bold">{stats.upcomingVaccinations}</p>
          </CardContent>
        </Card>
        <Card className="p-4 bg-white shadow-md rounded-lg">
          <CardContent>
            <h3 className="text-gray-600 text-sm">Total Reports</h3>
            <p className="text-2xl font-bold">{stats.totalReports}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Patient Growth (Weekdays)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={patientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Appointment Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appointmentTrends}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2196f3" radius={8} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Vaccination Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={vaccinationData}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                {vaccinationData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Monthly Reports</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={reportData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#ff9800" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
};

export default VetDashboard;
