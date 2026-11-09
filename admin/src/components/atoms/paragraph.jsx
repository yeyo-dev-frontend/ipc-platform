import { twMerge } from "tailwind-merge";

const variants = {
  inherit: "",
  default: "text-muted",
  ink: "text-ink",
  primary: "text-white",
  institutional: "text-blue-dark",
  danger: "text-[#b42318]",
};

const alignments = {
  inherit: "",
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const sizes = {
  inherit: "",
  small: "text-[0.83rem]",
  sm: "text-sm",
  medium: "text-base leading-normal",
  large: "text-lg",
};

const weights = {
  inherit: "",
  light: "font-light",
  normal: "font-normal",
  semi: "font-semibold",
  bold: "font-bold",
};

export function Paragraph({
  as = "p",
  children,
  text,
  size = as === "span" ? "inherit" : "medium",
  variant = as === "span" ? "inherit" : "default",
  align = as === "span" ? "inherit" : "left",
  weight = as === "span" ? "inherit" : "normal",
  className = "",
  ...props
}) {
  const Tag = as;
  return (
    <Tag
      className={twMerge(
        "m-0 font-poppins",
        variants[variant] ?? variants.default,
        sizes[size] ?? sizes.medium,
        alignments[align] ?? alignments.left,
        weights[weight] ?? weights.normal,
        className,
      )}
      {...props}
    >
      {children || text}
    </Tag>
  );
}
