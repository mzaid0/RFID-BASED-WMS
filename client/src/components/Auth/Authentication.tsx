"use client";
import { User } from "@/types/user";
import { useUserStore } from "@/store/user.store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { getLocalStorage } from "@/lib/local-storage";
import { useIsMounted } from "@/hooks/use-is-mounted";

type T_Authenticate = {
  children: React.ReactNode;
};

function Authenticate({ children }: T_Authenticate) {
  const { setUserInfo, userInfo } = useUserStore();

  const mounted = useIsMounted();

  const router = useRouter();

  const searchParams = useSearchParams();

  const pathName = usePathname();

  useEffect(() => {
    setUserInfo(getLocalStorage("user-info") as User);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // logout the user if userInfo is undefined
  useEffect(() => {
    if (!userInfo && mounted) {
      const queryParams = new URLSearchParams(searchParams);

      queryParams.set("logout", "true");

      queryParams.set("navigate_to", pathName);

      router.push(`/login?${queryParams.toString()}`);
    }
  }, [userInfo, router, mounted, pathName, searchParams]);

  if (userInfo) return <>{children}</>;
  else return null;
}

export default Authenticate;
