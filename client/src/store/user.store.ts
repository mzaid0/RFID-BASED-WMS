import { User } from "@/types/user";
import { create } from "zustand";

type UserStore = {
  userInfo: User | null;
  setUserInfo: (user: User|null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userInfo: null,
  setUserInfo: (user) =>
    set((state) => ({ ...state, userInfo: user })),
}));
