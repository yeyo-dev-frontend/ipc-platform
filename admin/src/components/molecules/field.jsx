import { useId } from "react";
import { Input } from "../atoms/input";

export function Field({ label, ...props }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <Input id={id} {...props} />
    </div>
  );
}
