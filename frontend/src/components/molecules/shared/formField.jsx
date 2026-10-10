import { Input } from "../../atoms/input";
import { Label } from "../../atoms/label";
import { Select } from "../../atoms/select";
import { Textarea } from "../../atoms/textarea";
import { useId } from "react";

function FormField({ field, value, onChange, error }) {
  const id = useId();
  const { name, label, type, options, placeholder, required = false } = field;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} text={label} />

      {type === "select" && (
        <Select
          id={id}
          aria-describedby={error ? `${id}-error` : undefined}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          options={options}
          error={Boolean(error)}
        />
      )}

      {type === "textarea" && (
        <Textarea
          id={id}
          aria-describedby={error ? `${id}-error` : undefined}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required={required}
          error={Boolean(error)}
        />
      )}

      {type !== "select" && type !== "textarea" && (
        <Input
          id={id}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete={
            {
              name: "name",
              email: "email",
              phone: "tel",
              address: "street-address",
            }[name]
          }
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          error={Boolean(error)}
        />
      )}
      {error && (
        <span id={`${id}-error`} className="text-sm text-red-500">
          {typeof error === "string" ? error : "Revisa este campo."}
        </span>
      )}
    </div>
  );
}

export { FormField };
