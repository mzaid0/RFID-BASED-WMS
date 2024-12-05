"use client";
import { getAllParcelsData } from "@/api/parcel-api";
import { Parcel } from "@/types/parcel-types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaBoxOpen, FaShippingFast } from "react-icons/fa";

const ParcelCards = () => {
  const { data, isLoading, isError, error } = useQuery<Parcel[]>({
    queryKey: ["parcelDetails"],
    queryFn: getAllParcelsData,
  });

  // Handle error state
  if (isError) {
    return (
      <p className="text-center text-red-500">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </p>
    );
  }

  // Handle loading state
  if (isLoading) {
    return <p className="text-center font-semibold">Loading...</p>;
  }

  const dispatchedParcelsCount = data!.filter(
    (parcel) => parcel.status === "Dispatched"
  ).length;

  // Sort parcels based on parcelDate (or timestamp if preferred)
  const recentParcels = data!
    .sort(
      (a, b) =>
        new Date(b.parcelDate).getTime() - new Date(a.parcelDate).getTime()
    )
    .slice(0, 3); // Get the 3 most recent parcels

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const utcDate = new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );
    return utcDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 shadow-sm ">
        <div className="bg-white rounded-lg px-6 flex items-center justify-between py-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              {isLoading ? <p>Loading...</p> : data ? data.length : 0}
            </h2>
            <p className="text-gray-600">Total Parcels</p>
          </div>
          <FaBoxOpen className="text-blue-500 text-5xl" />
        </div>

        <div className="bg-white rounded-lg px-6 flex items-center justify-between shadow-sm py-2">
          <div className="text-center">
            <h2 className="text-3xl font-bold">{dispatchedParcelsCount}</h2>
            <p className="text-gray-600">Dispatched Parcels</p>
          </div>
          <FaShippingFast className="text-[hsl(200,100%,50%)] text-5xl" />
        </div>

        <div className="bg-white rounded-lg px-6 py-2 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <ul className="space-y-2">
            {recentParcels.map((parcel) => (
              <li
                key={parcel.parcelTrackingNumber}
                className="flex justify-between text-gray-600"
              >
                <span className="text-xs">{parcel.parcelName}</span>
                <span className="text-xs">{formatDate(parcel.parcelDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParcelCards;
