"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./DataTable"; // Ensure this path is correct
import { columns } from "./columns"; // Ensure this path is correct
import { getAllUsersData } from "@/api/user-api";
import Authenticate from "@/components/Auth/Authentication";

const AllUsers = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsersData,
  });

  console.log({ data });

  if (isLoading)
    return (
      <p className="flex items-center justify-center h-full font-semibold">
        Loading users...
      </p>
    );
  if (isError) return (<Authenticate> <p>Error: {error?.message}</p>
  </Authenticate>)

  return (
    <Authenticate>
      <div className="px-10 py-5 bg-white m-5 rounded-lg">
        <h1 className="text-2xl font-bold py-2">Users List</h1>
        {
          data?.data
            ? <DataTable columns={columns} data={data.data} />
            : null
        }

      </div>
    </Authenticate>
  );
};

export default AllUsers;
