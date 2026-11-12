import { twMerge } from "tailwind-merge";

export function Code({ text, children, className = "", ...props }) {
  return (
    <code
      className={twMerge("font-mono text-sm wrap-anywhere text-ink", className)}
      {...props}
    >
      {children || text}
    </code>
  );
}
