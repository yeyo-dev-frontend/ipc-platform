import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AccessPage } from "./components/pages/accessPage";
import { WorkspacePage } from "./components/pages/workspacePage";
import "./index.css";

function AdminApp() {
  const [session, setSession] = useState(null);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => {
      setNotice("La sesión ha vencido. Vuelve a iniciar sesión.");
      setSession(null);
    }, session.expiresAt - Date.now());
    return () => clearTimeout(timer);
  }, [session]);
  if (session && session.expiresAt <= Date.now()) return null;
  return session ? (
    <WorkspacePage admin={session.admin} />
  ) : (
    <AccessPage onAuthenticated={setSession} initialNotice={notice} />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
