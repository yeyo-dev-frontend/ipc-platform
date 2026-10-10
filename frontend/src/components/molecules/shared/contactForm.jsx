import { Button } from "../../atoms/button";
import { ContactSteps } from "./contactSteps";
import { FormField } from "./formField";
import { Toast } from "./toast";
import { CONTACT_FORM_GROUPS } from "../../../data/contactFormFields";
import { useContactForm } from "../../../hooks/globals/useContactForm";

// Una sola composición: modal y Admisión comparten el orden por filas.
function ContactForm({
  appearance = "dark",
  layout = "compact",
  showSteps = false,
  onCancel,
}) {
  const isHome = layout === "home";
  const {
    values,
    activeStep,
    errorStep,
    fieldErrors,
    toast,
    closeToast,
    submitting,
    setValue,
    handleSubmit,
  } = useContactForm();

  return (
    <div
      className={`contact-form relative ${appearance === "light" ? "contact-form--light" : ""} ${isHome ? "grid grid-cols-1 gap-5 md:grid-cols-[9em_1fr] lg:grid-cols-[12em_1fr]" : ""}`}
    >
      <Toast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onClose={closeToast}
      />
      {showSteps && (
        <ContactSteps
          activeStep={activeStep}
          errorStep={errorStep}
          orientation={isHome ? "responsive" : "horizontal"}
          align={isHome ? undefined : "center"}
          title={isHome ? undefined : "Comunícate con un asesor"}
        />
      )}
      {showSteps && !isHome && <hr className="my-5 text-blue" />}
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Solicitar información"
        aria-busy={submitting}
        className={
          isHome
            ? "grid grid-cols-2 grid-rows-2 gap-5 sm:grid-cols-3 sm:grid-rows-1"
            : "grid grid-cols-1 gap-x-3 gap-y-5 sm:grid-cols-2"
        }
      >
        {CONTACT_FORM_GROUPS.map((group, index) => (
          <div
            key={group[0].name}
            className={
              !isHome
                ? "contents"
                : index === 2
                  ? "col-span-2 flex min-w-0 flex-col gap-5 sm:col-span-1 sm:justify-around"
                  : "flex min-w-0 flex-col justify-around gap-5"
            }
          >
            {group.map((field) => (
              <div
                key={field.name}
                className={`min-w-0 ${!isHome && field.type === "textarea" ? "sm:col-span-2" : ""}`}
              >
                <FormField
                  field={field}
                  value={values[field.name]}
                  onChange={setValue(field.name)}
                  error={fieldErrors[field.name]}
                />
              </div>
            ))}
            {index === 2 && (
              <div
                className={`flex gap-3 ${isHome ? "justify-center" : "justify-end sm:col-span-2"}`}
              >
                {onCancel && (
                  <Button
                    type="button"
                    text="Cancelar"
                    variant="secondary"
                    onClick={onCancel}
                  />
                )}
                <Button
                  type="submit"
                  text={submitting ? "Enviando..." : "Enviar"}
                  variant="danger"
                  disabled={submitting}
                />
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
}

export { ContactForm };
