import clsx from "clsx";

export const Separator = ({ className }: { className?: string }) => (
  <div
    className={clsx(
      "h-[2px] bg-gradient-to-r from-green-400 from-30% to-70% via-purple-400 to-green-400",
      className
    )}
  ></div>
);
