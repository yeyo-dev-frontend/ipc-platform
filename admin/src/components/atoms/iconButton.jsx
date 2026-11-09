import { twMerge } from "tailwind-merge";

const variants = {
  ghost: "bg-transparent text-muted hover:bg-soft hover:text-blue-dark",
  soft: "bg-soft text-blue-dark hover:bg-blue-dark hover:text-white",
  light: "bg-white/10 text-white hover:bg-white/20",
};

export function IconButton({
  label,
  title,
  onClick,
  disabled = false,
  variant = "ghost",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title ?? label}
      className={twMerge(
        "inline-flex cursor-pointer items-center justify-center rounded-md p-2 transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant] || variants.ghost,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
