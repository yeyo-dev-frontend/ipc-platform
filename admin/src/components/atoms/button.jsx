import { twMerge } from "tailwind-merge";

const base =
  "inline-flex cursor-pointer items-center justify-center gap-3 rounded-[7px] border-0 font-poppins font-bold transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus disabled:cursor-wait disabled:opacity-70";

const sizes = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-6 py-3.5 text-lg",
};

const variants = {
  default: "",
  primary: "mt-[5px] bg-blue-dark text-white hover:bg-[#112c6b]",
  secondary: "border border-line bg-white text-ink hover:bg-soft",
  light: "bg-white text-blue-dark hover:bg-soft",
  danger: "bg-[#b42318] text-white hover:bg-[#912018]",
  link: "bg-transparent px-0 py-2 text-[0.85rem] text-blue-dark hover:underline",
};

export function Button({
  text,
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        base,
        sizes[size] || sizes.md,
        variants[variant] ?? variants.primary,
        className,
      )}
      {...props}
    >
      {text && children ? (
        <>
          {text} {children}
        </>
      ) : (
        text || children
      )}
    </button>
  );
}
