import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AccessPage } from "./components/pages/accessPage";
import { WorkspacePage } from "./components/pages/workspacePage";
import {
  acceptSession,
  logoutSession,
  observeSession,
  restoreSession,
} from "./services/session";
import "./index.css";

function AdminApp() {
  const [restoring, setRestoring] = useState(true);
  const [session, setSession] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stop = observeSession(
      ({ session: nextSession, notice: nextNotice }) => {
        setSession(nextSession);
        setNotice(nextNotice);
      },
    );
    restoreSession()
      .then((restored) => {
        if (restored) setSession(restored);
      })
      .catch((error) => {
        if (error?.message) setNotice(error.message);
      })
      .finally(() => setRestoring(false));
    return stop;
  }, []);

  if (restoring) return null;
  return session ? (
    <WorkspacePage admin={session.admin} onLogout={() => logoutSession()} />
  ) : (
    <AccessPage
      onAuthenticated={(nextSession) => {
        setNotice("");
        acceptSession(nextSession);
      }}
      initialNotice={notice}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>,
);
