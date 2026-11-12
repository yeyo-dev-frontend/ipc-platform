import { useState } from "react";
import { FiGrid, FiLogOut } from "react-icons/fi";
import { ROLE_LABELS, WORKSPACE_AREAS } from "../../data/workspaceAreas";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { Link } from "../atoms/links";
import { Paragraph } from "../atoms/paragraph";
import { Brand } from "../molecules/brand";

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
          variant="plain"
          className="text-white"
        >
          <Brand />
        </Link>
        <Button
          variant="light"
          size="sm"
          className="lg:hidden"
          aria-expanded={open}
          aria-controls="workspace-menu"
          text="Menú"
          onClick={() => setOpen(!open)}
        />
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
          className="flex flex-col gap-1.5"
        >
          <Link nav onClick={close} to="/" end>
            <FiGrid aria-hidden="true" className="shrink-0 text-lg" />
            <Paragraph as="span" text="Escritorio" />
          </Link>
          {visibleAreas.map(({ slug, path, Icon, title, pending }) => (
            <Link nav onClick={close} key={slug} to={path}>
              <Icon aria-hidden="true" className="shrink-0 text-lg" />
              <Paragraph as="span">
                {title}
                {pending && (
                  <Paragraph
                    as="span"
                    size="small"
                    weight="normal"
                    text="En preparación"
                    className="block"
                  />
                )}
              </Paragraph>
            </Link>
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
