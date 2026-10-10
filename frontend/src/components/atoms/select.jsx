import { FiChevronDown } from "react-icons/fi";

function Select({
  options,
  name,
  value,
  onChange,
  required,
  className = "",
  error = false,
  ...props
}) {
  return (
    <span className="relative block min-w-0">
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error}
        className={`
        h-10 w-full cursor-pointer appearance-none bg-neutral-white text-black pl-3 pr-10 outline-none
        transition-colors duration-200 border
        ${error ? "border-red-500" : "border-transparent hover:border-orange"}
        ${className}
      `}
        {...props}
      >
        {options.map((opt, o) => (
          <option
            key={o}
            value={opt.value}
            disabled={opt.value === "0"}
            className="bg-white font-poppins font-normal text-black"
          >
            {opt.text}
          </option>
        ))}
      </select>
      <FiChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-dark"
      />
    </span>
  );
}

export { Select };
