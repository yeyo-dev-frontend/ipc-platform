import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ROLE_LABELS, WORKSPACE_AREAS } from "../../data/workspaceAreas";
import { Button } from "../atoms/button";
import { Paragraph } from "../atoms/paragraph";
import { Title } from "../atoms/titles";
import { Brand } from "../molecules/brand";
import { AccountInvitations } from "../organisms/accountInvitations";

export function WorkspaceDashboard({ admin }) {
  const visibleAreas = WORKSPACE_AREAS.filter((area) =>
    area.roles.includes(admin.role),
  );

  return (
    <>
      <section aria-labelledby="areas-heading">
        <Title
          level="h2"
          id="areas-heading"
          text="Áreas de trabajo"
          className="mt-10 mb-4"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {visibleAreas.map(({ slug, path, Icon, title, description }) => (
            <article
              key={slug}
              className="rounded-[10px] border border-line bg-white p-6 transition-colors hover:border-blue-dark/60"
            >
              <Link
                to={path}
                className="block rounded-md focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
              >
                <Icon aria-hidden="true" className="text-2xl text-blue-dark" />
                <Title level="h3" text={title} className="mt-4 mb-1" />
                <Paragraph text={description} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      {admin.role === "admin" && <AccountInvitations />}
    </>
  );
}

export function WorkspacePage({ admin, onLogout }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const visibleAreas = WORKSPACE_AREAS.filter((area) =>
    area.roles.includes(admin.role),
  );

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
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4 bg-blue-dark px-[6vw] py-5 text-white">
        <div className="flex flex-wrap items-center gap-6">
          <Link
            to="/"
            className="text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
          >
            <Brand />
          </Link>
          <nav
            aria-label="Navegación del panel"
            className="flex flex-wrap gap-2"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus ${isActive
                  ? "bg-white/20 text-white"
                  : "text-white/85 hover:bg-white/10"
                }`
              }
            >
              Escritorio
            </NavLink>
            {visibleAreas.map(({ slug, path, title }) => (
              <NavLink
                key={slug}
                to={path}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus ${isActive
                    ? "bg-white/20 text-white"
                    : "text-white/85 hover:bg-white/10"
                  }`
                }
              >
                {title}
              </NavLink>
            ))}
          </nav>
        </div>
        <Button variant="light" data-logout disabled={busy} onClick={exit}>
          <FiLogOut aria-hidden="true" />
          {busy ? "Cerrando sesión…" : "Cerrar sesión"}
        </Button>
      </header>
      <main className="mx-auto max-w-310 px-[6vw] py-16">
        <Paragraph size="small">
          {admin.name} · {ROLE_LABELS[admin.role]}
        </Paragraph>
        <Title
          level="h1"
          size="page"
          text="Panel administrativo"
          className="mt-5.5 mb-2.5"
        />
        {error && <Paragraph role="alert" variant="danger" text={error} />}
        <Outlet />
      </main>
    </div>
  );
}
