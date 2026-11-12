import { twMerge } from "tailwind-merge";

const variants = {
  default: "text-ink",
  primary: "text-white",
  secondary: "text-orange",
  institutional: "text-blue-dark",
};

const alignments = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const defaultByLevel = {
  h1: "text-[clamp(34px,4vw,52px)] leading-[1.05]",
  h2: "text-[28px] leading-[1.15]",
  h3: "text-[24px] leading-[1.15]",
  h4: "text-lg leading-snug",
  h5: "text-base leading-snug",
  h6: "text-sm leading-snug",
};

const sizes = {
  default: "",
  cover:
    "text-[42px] leading-[0.94] tracking-[-0.035em] md:text-[clamp(46px,6vw,94px)]",
  page: "text-[clamp(34px,4vw,52px)] leading-[1.05]",
  section: "text-[28px] leading-[1.15]",
  card: "text-[24px] leading-[1.15]",
};

const weights = {
  light: "font-light",
  normal: "font-normal",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

export function Title({
  as,
  level = "h1",
  size = "default",
  variant = "default",
  align = "left",
  weight = "bold",
  text,
  children,
  className = "",
  ...props
}) {
  const Tag = as || level;
  return (
    <Tag
      className={twMerge(
        "m-0 font-hani focus:outline-0",
        defaultByLevel[level] || defaultByLevel.h1,
        sizes[size] || "",
        weights[weight] || weights.bold,
        variants[variant] || variants.default,
        alignments[align] || alignments.left,
        className,
      )}
      {...props}
    >
      {children || text}
    </Tag>
  );
}
