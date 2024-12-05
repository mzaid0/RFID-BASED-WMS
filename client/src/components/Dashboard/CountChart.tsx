"use client";
import { getAllParcelsData } from "@/api/parcel-api";
import { Parcel } from "@/types/parcel-types";
import { useQuery } from "@tanstack/react-query";
import { FiPackage } from "react-icons/fi";
import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

const CountChart = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parcelDistribution"],
    queryFn: getAllParcelsData,
  });

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Count parcels based on status
  const totalParcels = data?.length || 0;
  const deliveredCount =
    data?.filter((parcel: Parcel) => parcel.status === "Delivered").length || 0;
  const dispatchedCount =
    data?.filter((parcel: Parcel) => parcel.status === "Dispatched").length ||
    0;
  const pendingCount =
    data?.filter((parcel: Parcel) => parcel.status === "Pending").length || 0;

  // Chart data based on parcel statuses
  const chartData = [
    {
      name: "Total",
      count: totalParcels,
      fill: "white",
    },
    {
      name: "Delivered",
      count: deliveredCount,
      fill: "hsl(240, 100%, 70%)", // Light Blue
    },
    {
      name: "Dispatched",
      count: dispatchedCount,
      fill: "hsl(200, 100%, 50%)", // Sky Blue
    },
    {
      name: "Pending",
      count: pendingCount,
      fill: "hsl(0, 0%, 70%)", // Warm Gray
    },
  ];

  return (
    <div className="h-[400px] bg-white rounded-lg flex flex-col items-center relative px-4 py-2">
      {/* Heading */}
      <h2 className="text-lg font-semibold mt-4 text-gray-700">
        Parcel Distribution
      </h2>

      {/* Chart Container */}
      <div className="relative w-full h-[250px] flex items-center justify-center">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="30%"
            outerRadius="100%"
            barSize={32}
            data={chartData}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center Icon */}
        <FiPackage className="text-gray-300 absolute" size={35} />
      </div>

      {/* Merged Legend Section */}
      <div className="flex justify-center gap-4 w-full bg-white rounded-b-lg py-2">
        <div className="flex flex-col items-center gap-1">
          <div className="h-5 w-5 rounded-full bg-[hsl(240,100%,70%)]" />
          <h1 className="font-bold text-xs">Delivered</h1>
          <p className="text-xs text-gray-400">{deliveredCount}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="h-5 w-5 rounded-full bg-[hsl(200,100%,50%)]" />
          <h1 className="font-bold text-xs">Dispatched</h1>
          <p className="text-xs text-gray-400">{dispatchedCount}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="h-5 w-5 rounded-full bg-[hsl(0,0%,70%)]" />
          <h1 className="font-bold text-xs">Pending</h1>
          <p className="text-xs text-gray-400">{pendingCount}</p>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
