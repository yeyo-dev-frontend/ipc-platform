import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { AccessPage } from "./components/pages/accessPage";
import { WorkspacePage } from "./components/pages/workspacePage";
import "./index.css";

function AdminPreview() {
  const [step, setStep] = useState("login");
  return step === "workspace" ? (
    <WorkspacePage onExit={() => setStep("login")} />
  ) : (
    <AccessPage step={step} onChange={setStep} />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminPreview />
  </StrictMode>,
);
