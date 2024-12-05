"use client";
import React from "react";
import { FaEllipsisV } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getAllParcelsData } from "@/api/parcel-api";
import { Parcel } from "@/types/parcel-types";

const ReportChart = () => {
  // Fetch data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parcelStats"],
    queryFn: getAllParcelsData,
  });

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  // Prepare data for the chart
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize array to hold counts for each month
  const transformedData = months.map((month, index) => {
    // Get all parcels for the current month
    const parcelsInMonth = data.filter(
      (p: Parcel) => new Date(p.parcelDate).getMonth() === index
    );

    // Count the number of "Pending" and "Delivered" parcels for the month
    const pendingCount = parcelsInMonth.filter(
      (p: Parcel) => p.status === "Pending"
    ).length;
    const deliveredCount = parcelsInMonth.filter(
      (p: Parcel) => p.status === "Delivered"
    ).length;

    return {
      name: month,
      Pending: pendingCount,
      Delivered: deliveredCount,
    };
  });

  return (
    <div className="px-4 py-4 min-h-full bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Parcel Report</h1>
        <FaEllipsisV className="text-black cursor-pointer" size={13} />
      </div>

      {/* Info Panel for dynamic Monthly Values */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {transformedData.map((item, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded-lg text-center">
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600">Pending: {item.Pending}</p>
            <p className="text-sm text-gray-600">Delivered: {item.Delivered}</p>
          </div>
        ))}
      </div>

      {/* Responsive Container for LineChart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={transformedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "20px" }}
          />
          <Line
            type="monotone"
            dataKey="Pending"
            stroke="hsl(0, 0%, 70%)"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="Delivered"
            stroke="hsl(240, 100%, 70%)"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportChart;
