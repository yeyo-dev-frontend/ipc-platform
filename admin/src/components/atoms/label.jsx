import { twMerge } from "tailwind-merge";

const variants = {
  default: "text-ink",
  light: "text-white",
  muted: "text-muted",
};

export function Label({
  children,
  text,
  htmlFor,
  variant = "default",
  className = "",
  ...props
}) {
  if (!text && !children) return null;
  return (
    <label
      htmlFor={htmlFor}
      className={twMerge(
        "font-poppins text-[0.88rem] font-bold",
        variants[variant] || variants.default,
        className,
      )}
      {...props}
    >
      {children || text}
    </label>
  );
}
