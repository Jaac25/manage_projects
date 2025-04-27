"use client";

import { useUser } from "@/hooks/useUser";
import { USER_TYPES, USER_TYPES_BY_ID } from "@/types/user";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function Nav() {
  const router = useRouter();

  const options: { text?: string; url?: string; disabled: boolean }[] = useMemo(
    () => [
      {
        text: "Proyectos",
        disabled: false,
        url: "/home",
      },
      {
        text: "Pedidos",
        disabled: true,
      },
      {
        text: "Servicios",
        disabled: true,
      },
      {
        text: "Organización",
        disabled: true,
      },
      {
        text: "Informes",
        disabled: true,
      },
    ],
    []
  );

  const user = useUser();
  return (
    <div className="h-full border-r justify-between flex flex-col bg-stone-50 shadow-2xl w-72 items-center">
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-2 mx-4 my-4">
          <span className="font-bold p-1 text-2xl text-center bg-gradient-to-br from-green-300 via-white rounded to-purple-300 ">
            PROYECTOLANDIA
          </span>
          <div className="flex flex-col items-center shadow bg-whiterounded">
            <p className="truncate font-bold text-lg">{`${user?.firstName} ${user?.lastName}`}</p>
            <span className="font-semibold text-base">
              {USER_TYPES_BY_ID[(user?.type as 1) ?? 0]}
            </span>
          </div>
        </div>

        {options.map(({ text, url, disabled }, i) => (
          <ButtonNav
            key={`${i}${url}`}
            onClick={() => {
              if (!url) return;
              router.push(url);
            }}
            url={url}
            text={text ?? ""}
            disabled={disabled}
          />
        ))}
      </div>
      <ButtonNav
        text="Cerrar Sesión"
        onClick={() => {
          localStorage.setItem("u", "");
          router.replace("/");
        }}
      />
    </div>
  );
}

const ButtonNav = ({
  onClick,
  text,
  url,
  disabled,
}: {
  onClick: () => void;
  text: string;
  url?: string;
  disabled?: boolean;
}) => {
  const pathname = usePathname();
  return (
    <button
      className={clsx(
        "font-bold text-xl h-10 w-full ",
        disabled ? "text-gray-400" : "hover:bg-green-300",
        pathname === url && "bg-green-200"
      )}
      disabled={disabled ?? false}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
