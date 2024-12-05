import { Parcel } from "@/types/parcel-types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, Edit, Eye, Truck } from "lucide-react"; // Remove Trash2 as it is not needed here
import Link from "next/link";
import ParcelActions from "./ParcelActions"; // Import the actions component

export const columns: ColumnDef<Parcel>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => `${row.original.id.slice(0, 4)}...`, // Format ID by slicing the string
  },
  {
    accessorKey: "senderName",
    header: "Sender Name",
  },
  {
    accessorKey: "receiverName",
    header: "Receiver Name",
  },
  {
    accessorKey: "receiverAddress",
    header: "Recipient Address",
  },
  {
    accessorKey: "bookingDate",
    header: "Booking Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as Date);
      return <span>{new Intl.DateTimeFormat("en-GB").format(date)}</span>; // Format date to en-GB format
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as "Pending" | "Dispatched" | "Delivered";
      return (
        <div className="flex items-center gap-2">
          {status === "Pending" && (
            <Truck className="h-4 w-4 text-yellow-500" />
          )}
          {status === "Dispatched" && (
            <ArrowUpDown className="h-4 w-4 text-blue-500" />
          )}
          {status === "Delivered" && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          <span>{status}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const parcel = row.original;
      return (
        <>
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/parcels/view/${parcel.id}`}
              className="inline-flex items-center justify-center hover:text-gray-400 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </Link>

            {/* Edit Button */}
            <Link
              href={`/dashboard/parcels/edit/${parcel.id}`}
              className="inline-flex items-center justify-center hover:text-purple-400 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </Link>

            {/* Parcel Actions Component - Always Visible */}
            <ParcelActions parcelId={parcel.id} currentStatus={parcel.status} />
          </div>
        </>
      );
    },
  },
];
