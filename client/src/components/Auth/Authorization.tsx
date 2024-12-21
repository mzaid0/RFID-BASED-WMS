import { useUserStore } from "@/store/user.store";
import { Role } from "shared/types/role";
import { ReactNode } from "react";


const Authorization = ({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) => {
  const { userInfo } = useUserStore();
  return roles.includes(userInfo?.role as Role) ? children : null;
};

export default Authorization;