import { ReactNode, Suspense } from "react";

export default function HomeLayout({
  children,
  nav,
}: {
  children: ReactNode;
  nav: ReactNode;
}) {
  return (
    <section className="flex w-full flex-row h-full">
      {nav}
      <Suspense>{children}</Suspense>
    </section>
  );
}
