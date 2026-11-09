import { useId } from "react";
import { Label } from "../atoms/label";
import { Textarea } from "../atoms/textarea";

export function TextareaField({ label, className = "", ...props }) {
  const id = useId();
  return (
    <div className={`grid gap-1.5 ${className}`.trim()}>
      <Label htmlFor={id} text={label} />
      <Textarea id={id} {...props} />
    </div>
  );
}
