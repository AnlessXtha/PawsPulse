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
} from "recharts";
import { Card, CardContent } from "@/components/shadcn-components/ui/card";

const stats = [
  { label: "Total Users", value: "1,250" },
  { label: "Active Vets", value: "150" },
  { label: "Registered Pets", value: "850" },
  { label: "Appointments", value: "320" },
];

const userGrowthData = [
  { month: "Jan", users: 200 },
  { month: "Feb", users: 400 },
  { month: "Mar", users: 600 },
  { month: "Apr", users: 800 },
];

const appointmentData = [
  { day: "Mon", count: 50 },
  { day: "Tue", count: 70 },
  { day: "Wed", count: 40 },
  { day: "Thu", count: 90 },
];

const petRegistrationData = [
  { type: "Dogs", value: 400 },
  { type: "Cats", value: 300 },
  { type: "Birds", value: 150 },
];

const revenueData = [
  { month: "Jan", revenue: 3000 },
  { month: "Feb", revenue: 4500 },
  { month: "Mar", revenue: 5000 },
];

const AdminDashboard = () => {
  return (
    <>
      <h1 className="text-5xl font-bold mb-[24px]">Admin Dashboard</h1>
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
          <h2 className="text-lg font-bold mb-2">User Growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={userGrowthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Appointments</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={appointmentData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4 bg-white shadow-md">
          <h2 className="text-lg font-bold mb-2">Pet Registrations</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={petRegistrationData}
                dataKey="value"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={60}
              >
                {petRegistrationData.map((entry, index) => (
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
          <h2 className="text-lg font-bold mb-2">Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
};

export default AdminDashboard;
