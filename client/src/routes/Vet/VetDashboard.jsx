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

const stats = [
  { label: "Total Patients", value: "640" },
  { label: "Upcoming Appointments", value: "24" },
  { label: "Upcoming Vaccinations", value: "15" },
  { label: "Total Reports", value: "1,150" },
];

const patientGrowthData = [
  { month: "Jan", patients: 100 },
  { month: "Feb", patients: 180 },
  { month: "Mar", patients: 150 },
  { month: "Apr", patients: 320 },
];

const appointmentTrends = [
  { day: "Mon", count: 10 },
  { day: "Tue", count: 12 },
  { day: "Wed", count: 8 },
  { day: "Thu", count: 15 },
  { day: "Fri", count: 10 },
];

const vaccinationData = [
  { type: "Dogs", value: 8 },
  { type: "Cats", value: 5 },
  { type: "Others", value: 2 },
];

const reportData = [
  { month: "Jan", reports: 150 },
  { month: "Feb", reports: 180 },
  { month: "Mar", reports: 200 },
  { month: "Apr", reports: 250 },
];

const VetDashboard = () => {
  return (
    <>
      <h1 className="text-5xl font-bold mb-[24px]">Vet Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 bg-white shadow-md rounded-lg">
            <CardContent>
              <h3 className="text-gray-600 text-sm">{stat.label}</h3>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Patient Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={patientGrowthData}>
              <XAxis dataKey="month" />
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
                    fill={["#ff6384", "#36a2eb", "#ffce56"][index]}
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
              <Line type="monotone" dataKey="reports" stroke="#ff9800" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
};

export default VetDashboard;
