"use client";
import { useQuery } from "@tanstack/react-query";
import { FiPackage } from "react-icons/fi";
import { getAllParcelsData } from "@/api/parcel-api"; // Assuming you have an API endpoint for this
import { Parcel } from "@/types/parcel-types";

const QuickStats = () => {
  // Fetch data using react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parcelStats"],
    queryFn: getAllParcelsData,
  });

  // Handle loading and error states
  if (isLoading) {
    return <div className="flex flex-col items-center justify-center w-full">Loading...</div>;
  }

  if (isError) {
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Assuming your API returns an array of parcels with a status property
  const deliveredParcels =
    data?.filter((parcel: Parcel) => parcel.status === "Delivered").length || 0;
  const dispatchedParcels =
    data?.filter((parcel: Parcel) => parcel.status === "Dispatched").length ||
    0;
  const pendingParcels =
    data?.filter((parcel: Parcel) => parcel.status === "Pending").length || 0;
  const totalParcels = data?.length || 0;

  const statsData = [
    {
      label: "Total Parcels",
      value: totalParcels,
      icon: <FiPackage size={28} className="text-blue-700" />,
    },
    {
      label: "Delivered Parcels",
      value: deliveredParcels,
      icon: <FiPackage size={28} className="text-[hsl(240,100%,70%)]" />,
    },
    {
      label: "Dispatched Parcels",
      value: dispatchedParcels,
      icon: <FiPackage size={28} className="text-[hsl(200,100%,50%)]" />,
    },
    {
      label: "Pending Parcels",
      value: pendingParcels,
      icon: <FiPackage size={28} className="text-gray-500" />,
    },
  ];

  return (
    <div className="flex flex-col gap-4 px-6 py-6 bg-white rounded-lg max-h-[400px]">
      <h2 className="text-lg font-semibold text-gray-800">Quick Stats</h2>
      <div className="flex flex-col gap-3">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-100 rounded-md gap-3"
          >
            <div className="flex items-center gap-3">
              {stat.icon}
              <span className="text-gray-700 font-medium text-sm">
                {stat.label}
              </span>
            </div>
            <span className="font-semibold text-gray-800">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
