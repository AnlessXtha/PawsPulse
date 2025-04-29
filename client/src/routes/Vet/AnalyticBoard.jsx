import { useEffect, useState } from "react";
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
import { Card } from "@/components/shadcn-components/ui/card";
import { Button } from "@/components/shadcn-components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/ui/dialog";
import { Input } from "@/components/shadcn-components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcn-components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports, selectAllReports } from "@/redux/slices/reportSlice";
import {
  fetchAppointments,
  selectAllAppointments,
} from "@/redux/slices/appointmentSlice";

const chartTypes = {
  line: LineChart,
  bar: BarChart,
  pie: PieChart,
};

const AnalyticBoard = () => {
  const dispatch = useDispatch();
  const allReports = useSelector(selectAllReports);
  const allAppointments = useSelector(selectAllAppointments);

  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchAppointments());
  }, [dispatch]);

  const getDiseaseCounts = () => {
    const diseaseMap = {};
    allReports.forEach((report) => {
      report.diseases?.forEach((d) => {
        diseaseMap[d.diseaseName] = (diseaseMap[d.diseaseName] || 0) + 1;
      });
    });
    return Object.entries(diseaseMap).map(([disease, count]) => ({
      disease,
      count,
    }));
  };

  const getBreedWiseDiseaseCounts = () => {
    const breedMap = {};
    allReports.forEach((report) => {
      report.diseases?.forEach((d) => {
        const breed = report.petProfile?.petBreed || "Unknown";
        const key = `${breed}_${d.diseaseName}`;
        breedMap[key] = (breedMap[key] || 0) + 1;
      });
    });
    return Object.entries(breedMap).map(([key, count]) => {
      const [breed, disease] = key.split("_");
      return { breed, disease, count };
    });
  };

  const getDailyPatientGrowth = () => {
    const dateMap = {};
    allAppointments.forEach((appt) => {
      const date = new Date(appt.appointmentDate).toLocaleDateString();
      dateMap[date] = (dateMap[date] || 0) + 1;
    });
    return Object.entries(dateMap).map(([day, patients]) => ({
      day,
      patients,
    }));
  };

  const [charts, setCharts] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [chartToRemove, setChartToRemove] = useState(null);
  const [newChart, setNewChart] = useState({
    type: "bar",
    title: "",
    xKey: "",
    yKey: "",
    source: "diseases",
  });

  useEffect(() => {
    setCharts([
      {
        id: "disease-count",
        type: "bar",
        title: "Most Common Diseases",
        data: getDiseaseCounts(),
        xKey: "disease",
        yKey: "count",
      },
      {
        id: "breed-wise",
        type: "bar",
        title: "Breed-wise Disease Count",
        data: getBreedWiseDiseaseCounts(),
        xKey: "breed",
        yKey: "count",
      },
      {
        id: "daily-patient",
        type: "line",
        title: "Patient Appointments (Daily)",
        data: getDailyPatientGrowth(),
        xKey: "day",
        yKey: "patients",
      },
    ]);
  }, [allReports, allAppointments]);

  const handleRemove = (id) => {
    setChartToRemove(id);
    setShowConfirmDialog(true);
  };

  const confirmRemove = () => {
    setCharts((prev) => prev.filter((c) => c.id !== chartToRemove));
    setChartToRemove(null);
    setShowConfirmDialog(false);
  };

  const handleAddChart = () => {
    const id = `${newChart.title
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}`;
    let data = [];
    if (newChart.source === "diseases") data = getDiseaseCounts();
    else if (newChart.source === "breed") data = getBreedWiseDiseaseCounts();
    else if (newChart.source === "appointments") data = getDailyPatientGrowth();

    setCharts([...charts, { ...newChart, id, data }]);
    setNewChart({
      type: "bar",
      title: "",
      xKey: "",
      yKey: "",
      source: "diseases",
    });
    setShowAddDialog(false);
  };

  const renderChart = (chart) => {
    const ChartComponent = chartTypes[chart.type];
    return (
      <ResponsiveContainer width="100%" height={400}>
        {chart.type === "pie" ? (
          <PieChart>
            <Pie
              data={chart.data}
              dataKey={chart.yKey}
              nameKey={chart.xKey}
              cx="50%"
              cy="50%"
              outerRadius={60}
            >
              {chart.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#4caf50", "#2196f3", "#ff9800", "#ff6384"][index % 4]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <ChartComponent data={chart.data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={chart.xKey} />
            <YAxis />
            <Tooltip />
            {chart.type === "bar" ? (
              <Bar dataKey={chart.yKey} fill="#36a2eb" radius={8} />
            ) : (
              <Line type="monotone" dataKey={chart.yKey} stroke="#4caf50" />
            )}
          </ChartComponent>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Analytic Board</h1>
        <Button onClick={() => setShowAddDialog(true)}>Add Chart</Button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {charts.map((chart) => (
          <Card key={chart.id} className="p-4 bg-white shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">{chart.title}</h2>
              <Button variant="ghost" onClick={() => handleRemove(chart.id)}>
                Remove
              </Button>
            </div>
            {renderChart(chart)}
          </Card>
        ))}
      </div>
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Chart</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={newChart.type}
              onValueChange={(val) =>
                setNewChart((prev) => ({ ...prev, type: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={newChart.source}
              onValueChange={(val) =>
                setNewChart((prev) => ({ ...prev, source: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diseases">Diseases</SelectItem>
                <SelectItem value="breed">Breed-wise</SelectItem>
                <SelectItem value="appointments">Appointments</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Chart Title"
                value={newChart.title}
                onChange={(e) =>
                  setNewChart((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <Input
                placeholder="X Label (e.g., disease)"
                value={newChart.xKey}
                onChange={(e) =>
                  setNewChart((prev) => ({ ...prev, xKey: e.target.value }))
                }
              />
              <Input
                placeholder="Y Label (e.g., count)"
                value={newChart.yKey}
                onChange={(e) =>
                  setNewChart((prev) => ({ ...prev, yKey: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddChart}
                className="bg-primary text-white"
              >
                Add
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to remove this chart?</p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={confirmRemove} className="bg-red-600 text-white">
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalyticBoard;
