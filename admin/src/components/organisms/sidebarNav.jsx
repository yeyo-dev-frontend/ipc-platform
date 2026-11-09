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
  const visibleAreas = WORKSPACE_AREAS.filter((area) =>
    area.roles.includes(admin.role),
  );

  return (
    <aside className="flex flex-col justify-between gap-6 bg-blue-dark p-6 text-white md:sticky md:top-0 md:min-h-svh">
      <div className="grid gap-6">
        <Link
          to="/"
          className="text-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-focus"
        >
          <Brand />
        </Link>
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
          <NavLink to="/" end className={navLinkClass}>
            <FiGrid aria-hidden="true" className="text-lg shrink-0" />
            <span>Escritorio</span>
          </NavLink>
          {visibleAreas.map(({ slug, path, Icon, title }) => (
            <NavLink key={slug} to={path} className={navLinkClass}>
              <Icon aria-hidden="true" className="text-lg shrink-0" />
              <span>{title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="border-t border-white/15 pt-4">
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
    </aside>
  );
}
