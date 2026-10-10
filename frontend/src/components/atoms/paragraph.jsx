import { motion as Motion } from "motion/react";
import { paragraphReveal } from "../animations/animation";

function Paragraph({
  as = "p",
  children,
  text,
  className = "",
  size = as === "span" ? "inherit" : "medium",
  variant = as === "span" ? "inherit" : "default",
  align = as === "span" ? "inherit" : "left",
  weight = as === "span" ? "inherit" : "normal",
  ...motionProps
}) {
  const Tag = Motion[as];

  const variants = {
    inherit: "",
    default: "text-black",
    primary: "text-white",
    secondary: "text-gray-500 ",
    ternary: `text-gray-400`,
    danger: "text-blue",
  };

  const alignments = {
    inherit: "",
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const sizes = {
    inherit: "text-[12px]",
    compact: "text-[clamp(0.875rem,0.75rem+0.3vw,1.0625rem)]",
    comfortable: "text-[clamp(1rem,0.8rem+0.5vw,1.375rem)]",
    small: "text-[.9em] ",
    base: "text-base",
    medium: "text-[.9em] xs:text-[1em] sm:text-[1.1em]  ",
    large: "text-[.7em] sm:text-[.9em] lg:text-[1.2em] xl:text-[1.3em]",
    slogan: "text-[.9em] sm:text-[1.2em] lg:text-[1.2em] xl:text-[1.3em]",
    xlarge: "text-[1.3em]  md:text-[2em]",
  };

  const weights = {
    inherit: "",
    light: "font-light",
    normal: "font-normal",
    semi: "font-semibold",
    bold: "font-bold",
  };

  return (
    <Tag
      {...motionProps}
      variants={paragraphReveal}
      className={`
        ${variants[variant] === undefined ? variants.default : variants[variant]}
        ${sizes[size] === undefined ? sizes.medium : sizes[size]}
        ${alignments[align] === undefined ? alignments.left : alignments[align]}
        ${weights[weight] === undefined ? weights.normal : weights[weight]}
        ${className}
      `}
    >
      {children || text}
    </Tag>
  );
}

export { Paragraph };
