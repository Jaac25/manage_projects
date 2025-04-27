"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, toast, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

const customToast = ({
  text,
  variant,
}: {
  text: string;
  variant?: "error" | "success" | "info";
}) => {
  if (variant === "error") return toast.error(text);
  if (variant === "success") return toast.success(text);
  if (variant === "info") return toast.info(text);
};
export { Toaster, customToast };
