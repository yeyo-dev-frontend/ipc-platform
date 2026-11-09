import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IconButton } from "../atoms/iconButton";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";

export function PasswordField({ label, className = "", disabled, ...props }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const toggleLabel = visible ? "Ocultar contraseña" : "Mostrar contraseña";

  return (
    <div className={`grid gap-1.5 ${className}`.trim()}>
      <Label htmlFor={id} text={label} />
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          disabled={disabled}
          className="pr-11"
          {...props}
        />
        <IconButton
          label={toggleLabel}
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          data-password-toggle
        >
          {visible ? (
            <FiEyeOff aria-hidden="true" className="text-lg" />
          ) : (
            <FiEye aria-hidden="true" className="text-lg" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
