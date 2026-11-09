import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RoleRoute } from "./components/organisms/roleRoute";
import { WorkspaceDashboard } from "./components/organisms/workspaceDashboard";
import { AccessPage } from "./components/pages/accessPage";
import { AreaPage } from "./components/pages/areaPage";
import { WorkspacePage } from "./components/pages/workspacePage";
import { WORKSPACE_AREAS } from "./data/workspaceAreas";
import {
  acceptSession,
  logoutSession,
  observeSession,
  restoreSession,
} from "./services/session";
import "./index.css";
import {
  isRecoveryPending,
  WAITING_NOTICE,
  RECOVERY_KEY,
  UNCONFIRMED_RECOVERY_NOTICE,
} from "./services/session/recoveryPending";
import { Button } from "./components/atoms/button";

function AdminApp() {
  const [restoring, setRestoring] = useState(true);
  const [session, setSession] = useState(null);
  const [notice, setNotice] = useState("");
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const stop = observeSession(
      ({ session: nextSession, notice: nextNotice }) => {
        setSession(nextSession);
        setNotice(nextNotice);
      },
    );
    const syncPending = (event) => {
      if (event.key !== RECOVERY_KEY) return;
      setWaiting(isRecoveryPending());
      setNotice(isRecoveryPending() ? WAITING_NOTICE : "");
    };
    window.addEventListener("storage", syncPending);
    restoreSession()
      .then((restored) => {
        if (restored) setSession(restored);
      })
      .catch((error) => {
        setWaiting(isRecoveryPending());
        if (error?.message) setNotice(error.message);
      })
      .finally(() => setRestoring(false));
    return () => {
      stop();
      window.removeEventListener("storage", syncPending);
    };
  }, []);

  if (restoring || waiting)
    return (
      <main className="grid min-h-svh place-content-center gap-4 bg-surface p-6 text-center">
        <p role="status">
          {restoring ? "Recuperando sesión…" : notice || WAITING_NOTICE}
        </p>
        {waiting && !restoring && (
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await logoutSession(UNCONFIRMED_RECOVERY_NOTICE);
                setWaiting(false);
              } catch (error) {
                setNotice(error.message);
              }
            }}
          >
            Cancelar el acceso pendiente
          </Button>
        )}
      </main>
    );
  if (!session) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <AccessPage
              onAuthenticated={(nextSession) => {
                setNotice("");
                acceptSession(nextSession);
              }}
              initialNotice={notice}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        element={
          <WorkspacePage
            admin={session.admin}
            onLogout={() => logoutSession()}
          />
        }
      >
        <Route index element={<WorkspaceDashboard admin={session.admin} />} />
        {WORKSPACE_AREAS.map((area) => (
          <Route
            key={area.slug}
            path={area.path}
            element={
              <RoleRoute role={session.admin.role} allowed={area.roles}>
                <AreaPage area={area} />
              </RoleRoute>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/admin">
      <AdminApp />
    </BrowserRouter>
  </StrictMode>,
);
