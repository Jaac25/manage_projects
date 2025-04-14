import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen w-screen flex ">
      <body
        className="h-full w-full relative"
      >
        {children}
        <div className="-z-10 inset-0 absolute overflow-auto top-0 flex h-full flex-col items-center justify-between bg-gradient-to-br from-white from-5% via-[#ADFFF0] to-100% to-[#FDFDCE]" />
        <Toaster position="top-center" className="z-50" richColors />
      </body>
    </html>
  );
}
