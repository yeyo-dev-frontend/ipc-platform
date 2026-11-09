import { useState } from "react";
import { FiGrid, FiLogOut } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import { ROLE_LABELS, WORKSPACE_AREAS } from "../../data/workspaceAreas";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Paragraph } from "../atoms/paragraph";
import { Brand } from "../molecules/brand";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus ${
    isActive
      ? "bg-white text-blue-dark"
      : "text-white/85 hover:bg-white/10 hover:text-white"
  }`;

export function SidebarNav({ admin, busy, onLogout }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const visibleAreas = WORKSPACE_AREAS.filter((area) =>
    area.roles.includes(admin.role),
  );

  return (
    <aside className="self-start bg-blue-dark px-5 py-3 text-white lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:overflow-y-auto lg:p-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          onClick={close}
          to="/"
          className="text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
        >
          <Brand />
        </Link>
        <Button
          variant="light"
          size="sm"
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="workspace-menu"
          onClick={() => setOpen(!open)}
        >
          Menú
        </Button>
      </div>
      <div
        id="workspace-menu"
        className={
          open
            ? "mt-4 flex flex-col gap-4 lg:flex-1"
            : "hidden lg:mt-6 lg:flex lg:flex-1 lg:flex-col lg:gap-4"
        }
      >
        <div className="rounded-lg bg-white/10 p-3.5">
          <Paragraph
            size="sm"
            variant="primary"
            weight="bold"
            text={admin.name}
          />
          <Badge
            variant="light"
            text={ROLE_LABELS[admin.role]}
            className="mt-1.5"
          />
        </div>
        <nav
          aria-label="Navegación del panel"
          className=" flex flex-col gap-1.5"
        >
          <NavLink onClick={close} to="/" end className={navLinkClass}>
            <FiGrid aria-hidden="true" className="text-lg shrink-0" />
            <span>Escritorio</span>
          </NavLink>
          {visibleAreas.map(({ slug, path, Icon, title, pending }) => (
            <NavLink
              onClick={close}
              key={slug}
              to={path}
              className={navLinkClass}
            >
              <Icon aria-hidden="true" className="text-lg shrink-0" />
              <span>
                {title}
                {pending && (
                  <small className="block font-normal">En preparación</small>
                )}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/15 pt-4">
          <Button
            variant="light"
            data-logout
            disabled={busy}
            onClick={onLogout}
            className="w-full"
          >
            <FiLogOut aria-hidden="true" />
            {busy ? "Cerrando sesión…" : "Cerrar sesión"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
