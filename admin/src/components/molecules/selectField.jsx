import { useId } from "react";
import { Select } from "../atoms/select";

export function SelectField({ label, children, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Select id={id} {...props}>
        {children}
      </Select>
    </div>
  );
}
