import { Link as RouterLink, NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const variants = {
  default:
    "inline-flex items-center gap-2 font-poppins text-sm font-bold text-blue-dark transition-colors hover:underline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
  plain:
    "transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
  card:
    "block rounded-md transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
  button:
    "inline-flex items-center justify-center gap-3 rounded-[7px] bg-blue-dark px-5 py-3 font-poppins font-bold text-white transition-colors hover:bg-[#112c6b] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus",
};

const navLinkClass = (className) => ({ isActive }) =>
  twMerge(
    "flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 font-poppins text-sm font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus",
    isActive
      ? "bg-white text-blue-dark"
      : "text-white/85 hover:bg-white/10 hover:text-white",
    className,
  );

export function Link({
  to,
  href,
  nav = false,
  end,
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
  const content = children || text;
  const resolvedClass = twMerge(variants[variant] || variants.default, className);

  if (nav && to !== undefined) {
    return (
      <NavLink
        to={to}
        end={end}
        onClick={onClick}
        className={navLinkClass(className)}
        {...props}
      >
        {content}
      </NavLink>
    );
  }

  if (to !== undefined) {
    return (
      <RouterLink
        to={to}
        onClick={onClick}
        className={resolvedClass}
        {...props}
      >
        {content}
      </RouterLink>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      download={download}
      className={resolvedClass}
      {...props}
    >
      {content}
    </a>
  );
}
