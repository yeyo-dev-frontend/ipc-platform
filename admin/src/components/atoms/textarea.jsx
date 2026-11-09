import { twMerge } from "tailwind-merge";

const base =
  "min-h-28 w-full rounded-[7px] border bg-[#fafbfd] px-3.5 py-2.5 font-poppins text-base text-ink transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-70";

export function Textarea({
  id,
  name,
  value,
  defaultValue,
  placeholder,
  onChange,
  required = false,
  disabled = false,
  rows = 4,
  error = false,
  className = "",
  ...props
}) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      disabled={disabled}
      rows={rows}
      aria-invalid={error || undefined}
      className={twMerge(
        base,
        error ? "border-red-600" : "border-line hover:border-blue-dark/60",
        className,
      )}
      {...props}
    />
  );
}
