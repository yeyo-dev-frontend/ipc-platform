import { FiChevronDown } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const base =
  "min-h-12 w-full cursor-pointer appearance-none rounded-[7px] border bg-[#fafbfd] py-2.5 pr-10 pl-3.5 font-poppins text-base text-ink transition-colors duration-200 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-70";

export function Select({
  id,
  name,
  value,
  defaultValue,
  onChange,
  options,
  children,
  required = false,
  disabled = false,
  error = false,
  className = "",
  ...props
}) {
  return (
    <span className="relative block min-w-0">
      <select
        id={id}
        name={name}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={twMerge(
          base,
          error ? "border-red-600" : "border-line hover:border-blue-dark/60",
          className,
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-white font-poppins font-normal text-ink"
              >
                {opt.text}
              </option>
            ))
          : children}
      </select>
      <FiChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 h-5 w-5 -translate-y-1/2 text-blue-dark"
      />
    </span>
  );
}
