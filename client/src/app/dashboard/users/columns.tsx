import { User } from "@/types/user"; // Make sure this path is correct
import { ColumnDef } from "@tanstack/react-table";
import { CircleUserRound, Shield } from "lucide-react"; // Icons for different roles or statuses
import Image from "next/image";
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "profilePicture",
    header: "Profile Picture",
    cell: ({ getValue }) => {
      const profilePicture = getValue() as string;
      return (
        <Image
          src={"http://localhost:4000/" + profilePicture} // Directly using the full URL
          alt="User Avatar"
          width={36} // fixed size to keep it uniform
          height={36}
          className="rounded-full object-cover" // Circular image
        />
      );
    },
  },

  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue() as "Admin" | "User";
      return (
        <div className="flex items-center gap-2">
          {role === "Admin" && <Shield className="h-4 w-4 text-red-500" />}
          {role === "User" && (
            <CircleUserRound className="h-4 w-4 text-green-500" />
          )}
          <span>{role}</span>
        </div>
      );
    },
  },
];
