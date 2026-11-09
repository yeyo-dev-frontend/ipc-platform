import { FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Paragraph } from "../atoms/paragraph";

const styles = {
  info: {
    box: "border-blue-dark/20 bg-soft text-blue-dark",
    Icon: FiInfo,
    variant: "institutional",
  },
  success: {
    box: "border-[#16a34a]/30 bg-[#f0fdf4] text-[#166534]",
    Icon: FiCheckCircle,
    variant: "ink",
  },
  danger: {
    box: "border-[#dc2626]/30 bg-[#fef2f2] text-[#b42318]",
    Icon: FiAlertCircle,
    variant: "danger",
  },
};

export function StatusBanner({
  text,
  children,
  variant = "info",
  role = "status",
  className = "",
}) {
  if (!text && !children) return null;
  const config = styles[variant] || styles.info;
  const { Icon } = config;

  return (
    <div
      role={role}
      className={twMerge(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3",
        config.box,
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-lg" />
      <Paragraph
        size="sm"
        variant={config.variant}
        className="text-current"
        text={text}
      >
        {children}
      </Paragraph>
    </div>
  );
}
