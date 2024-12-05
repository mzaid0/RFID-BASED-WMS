"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./DataTable"; // Ensure this path is correct
import { columns } from "./columns"; // Ensure this path is correct
import { getAllParcelsData } from "@/api/parcel-api";
import Authenticate from "@/components/Auth/Authentication";

interface Parcel {
  id: string;
  senderName: string;
  receiverName: string;
  status: "Pending" | "Dispatched" | "Delivered";
  receiverAddress: string;
  bookingDate: Date;
}

const AllParcels = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parcels"],
    queryFn: getAllParcelsData,
  });

  const transformedData: Parcel[] = data
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map((parcel: any) => ({
        id: parcel.id, // Display only the first 4 characters of the ID
        senderName: `${parcel.senderFirstName} ${parcel.senderLastName}`,
        receiverName: `${parcel.receiverFirstName} ${parcel.receiverLastName}`,
        status: parcel.status,
        receiverAddress: parcel.receiverAddress,
        bookingDate: new Date(parcel.parcelDate),
      }))
    : [];

  if (isLoading)
    return (
      <p className="flex items-center justify-center h-full font-semibold">
        Loading parcels...
      </p>
    );
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <Authenticate>
      <div className="px-10 py-5 bg-white m-5 rounded-lg">
        <h1 className="text-2xl font-bold py-2">Parcels List</h1>
        <DataTable columns={columns} data={transformedData} />
      </div>
    </Authenticate>
  );
};

export default AllParcels;
