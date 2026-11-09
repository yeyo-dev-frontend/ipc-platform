import { twMerge } from "tailwind-merge";

const variants = {
  institutional: "bg-soft text-blue-dark",
  light: "bg-white/15 text-white",
  warning: "bg-[#fef3c7] text-[#92400e]",
  success: "bg-[#dcfce7] text-[#166534]",
};

export function Badge({
  text,
  children,
  variant = "institutional",
  className = "",
  ...props
}) {
  return (
    <span
      className={twMerge(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 font-poppins text-xs font-semibold",
        variants[variant] || variants.institutional,
        className,
      )}
      {...props}
    >
      {children || text}
    </span>
  );
}
