import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ROLE_LABELS } from "../../data/workspaceAreas";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";
import { StatusBanner } from "../molecules/statusBanner";
import { SidebarNav } from "../organisms/sidebarNav";

export function WorkspacePage({ admin, onLogout }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const main = useRef(null);
  const { pathname } = useLocation();
  useEffect(() => {
    main.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  async function exit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await onLogout();
    } catch (failure) {
      setError(failure.message);
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-svh grid-cols-1 grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[260px_minmax(0,1fr)]">
      <SidebarNav admin={admin} busy={busy} onLogout={exit} />
      <main ref={main} tabIndex={-1} className="mx-auto w-full max-w-285 px-6 py-10 outline-none md:px-12 md:py-14">
        <Paragraph size="small">
          {admin.name} · {ROLE_LABELS[admin.role]}
        </Paragraph>
        <Title
          level="h1"
          size="page"
          text="Panel administrativo"
          className="mt-5.5 mb-2.5"
        />
        {error && (
          <StatusBanner
            role="alert"
            variant="danger"
            text={error}
            className="mt-3"
          />
        )}
        <Outlet />
      </main>
    </div>
  );
}
