import { useId } from "react";
import { Label } from "../atoms/label";
import { Select } from "../atoms/select";

export function SelectField({
  label,
  options,
  children,
  className = "",
  ...props
}) {
  const id = useId();
  return (
    <div className={`grid gap-1.5 ${className}`.trim()}>
      <Label htmlFor={id} text={label} />
      <Select id={id} options={options} {...props}>
        {children}
      </Select>
    </div>
  );
}
