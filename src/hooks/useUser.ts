import { IUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useUser = () => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const { push } = useRouter();
  useEffect(() => {
    if (!window.localStorage || !localStorage) return;
    if (!localStorage.getItem("u")) return push("/");
    const u: IUser = JSON.parse(localStorage.getItem("u") ?? "");
    if (!!u) setUser(u);
  }, []);
  if (!user) return;
  return user;
};
