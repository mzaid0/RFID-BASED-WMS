"use client"; // Add this to indicate that this component uses client-side features

import { useUserStore } from "@/store/user.store"; // Assuming this store is already set up to manage the user's state
import Image from "next/image"; // Import Next.js Image component
import { MdOutlineEmail } from "react-icons/md";

const Navbar = () => {
  const { userInfo } = useUserStore(); // Get user info from the store
  console.log(userInfo?.profilePicture); // For debugging purposes

  return (
    <div className="flex items-center justify-between p-4 bg-white ">
      {/* Left side: Email */}
      <div className="flex items-center flex-1">
        <p className="font-semibold flex items-center gap-2 bg-blue-500 px-3 py-1 text-white rounded-full">
          <MdOutlineEmail />{" "}
          <span className="font-light text-sm">{userInfo?.email}</span>
        </p>
      </div>

      {/* Right side: User Details */}
      <div className="flex items-center gap-4 relative">
        <div className="flex items-center gap-2">
          {/* User Name and Role */}
          <div className="hidden md:flex flex-col items-end">
            <span className="font-semibold text-sm">
              {userInfo?.firstName} {userInfo?.lastName}
            </span>
            <span className="text-xs text-gray-500">{userInfo?.role}</span>
          </div>

          {/* User Image */}
          <div className="relative w-9 h-9">
            {/* Check if profile picture exists, then show it */}
            {userInfo?.profilePicture ? (
              <Image
                src={"http://localhost:4000/" + userInfo.profilePicture} // Directly using the full URL
                alt="User Avatar"
                width={36} // fixed size to keep it uniform
                height={36}
                className="rounded-full object-cover" // Circular image
              />
            ) : (
              <div className="flex justify-center items-center w-full h-full bg-gray-200 rounded-full">
                {/* Placeholder content when there is no profile picture */}
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
