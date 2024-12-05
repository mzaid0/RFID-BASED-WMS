"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { LuPackage, LuPackagePlus } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import Authorization from "./Auth/Authorization";
import { Role } from "@/types/role";
import axios from "axios";
import { useUserStore } from "@/store/user.store";
import { DeleteLocalStorage } from "@/lib/local-storage";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RiUserLine } from "react-icons/ri";

const menuData = [
  {
    title: "MENU",
    items: [
      {
        name: "Dashboard",
        icon: <MdOutlineDashboard />,
        link: "/dashboard",
        visible: ["User", "Admin"],
      },
      {
        name: "All Parcels",
        icon: <LuPackage />,
        link: "/dashboard/parcels",
        visible: ["User", "Admin"],
      },
      {
        name: "All Users",
        icon: <RiUserLine />,
        link: "/dashboard/users",
        visible: ["Admin"],
      },
      {
        name: "Add Parcel",
        icon: <LuPackagePlus />,
        link: "/dashboard/parcels/add",
        visible: ["User", "Admin"],
      },
      {
        name: "Add User",
        icon: <FaPersonCircleCheck />,
        link: "/dashboard/registration",
        visible: ["Admin"],
      },
      {
        name: "Logout",
        icon: <RiLogoutCircleLine />,
        link: "/dashboard/logout",
        visible: ["User", "Admin"],
      },
    ],
  },
];

const Menu = () => {
  const [isClient, setIsClient] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const { setUserInfo } = useUserStore();
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const handleLogoutClick = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await axios.post("http://localhost:4000/api/v1/user/logout", null, {
      withCredentials: true,
    });
    DeleteLocalStorage("user-info");
    setUserInfo(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="flex-1 overflow-y-auto mt-4 text-sm">
      {menuData.map((section) => (
        <div className="flex flex-col gap-1" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light mt-4">
            {section.title}
          </span>
          {section.items.map((item) => {
            const isActive = pathname === item.link;

            return item.visible ? (
              <Authorization roles={item.visible as Role[]} key={item.name}>
                <Link
                  href={item.link}
                  onClick={
                    item.name === "Logout" ? handleLogoutClick : undefined
                  }
                  className={`flex items-center justify-center lg:justify-start gap-3 rounded-lg py-2 transition-colors duration-200 px-2  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-500 hover:bg-blue-50"
                  }`}
                >
                  <span
                    className={`${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`hidden lg:block ${
                      isActive ? "text-blue-600" : ""
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </Authorization>
            ) : null;
          })}
        </div>
      ))}

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogTrigger asChild>
          <div />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You will be logged out from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelLogout} className="px-2">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmLogout}
              className="bg-red-500 text-white px-2 hover:bg-red-600"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Menu;
