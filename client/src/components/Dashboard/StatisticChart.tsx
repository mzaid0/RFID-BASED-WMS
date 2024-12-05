"use client";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { getAllParcelsData } from "@/api/parcel-api"; // Assuming this is your API function

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const ParcelStatistics: React.FC = () => {
  // Use react-query to fetch parcel data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parcelStats"],
    queryFn: getAllParcelsData, // API function like in QuickStats
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Count parcels based on their status
  const dispatched =
    data?.filter((parcel: { status: string }) => parcel.status === "Dispatched")
      .length || 0;
  const delivered =
    data?.filter((parcel: { status: string }) => parcel.status === "Delivered")
      .length || 0;
  const pending =
    data?.filter((parcel: { status: string }) => parcel.status === "Pending")
      .length || 0;

  // Chart data
  const barChartData = {
    labels: ["Dispatched", "Delivered", "Pending"], // Updated labels
    datasets: [
      {
        label: "Parcels",
        data: [dispatched, delivered, pending], // Dynamic data
        backgroundColor: "rgba(0, 123, 255, 0.6)", // Customize colors as needed
        borderColor: "rgba(0, 123, 255, 1)", // Border color
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-8 flex-1 lg:min-w-[450px] h-[400px]">
      <h2 className="text-lg font-semibold mb-4">Parcel Statistics</h2>
      <div className="w-full h-[280px]">
        <Bar
          data={barChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                labels: {
                  color: "rgba(0, 0, 0, 0.7)",
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleColor: "#fff",
                bodyColor: "#fff",
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  color: "rgba(0, 0, 0, 0.1)",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ParcelStatistics;
