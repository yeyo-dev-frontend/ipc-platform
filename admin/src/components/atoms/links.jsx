import { twMerge } from "tailwind-merge";

const variants = {
  default:
    "text-blue-dark transition-colors hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
  plain:
    "transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
  button:
    "inline-flex items-center justify-center gap-3 rounded-[7px] bg-blue-dark px-5 py-3 font-poppins font-bold text-white transition-colors hover:bg-[#112c6b] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
};

export function Link({
  href,
  onClick,
  text,
  children,
  target,
  rel,
  download,
  variant = "default",
  className = "",
  ...props
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      download={download}
      className={twMerge(variants[variant] || variants.default, className)}
      {...props}
    >
      {children || text}
    </a>
  );
}
