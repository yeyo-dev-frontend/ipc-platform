import { useId } from "react";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";

export function Field({ label, className = "", ...props }) {
  const id = useId();
  return (
    <div className={`grid gap-1.5 ${className}`.trim()}>
      <Label htmlFor={id} text={label} />
      <Input id={id} {...props} />
    </div>
  );
}
