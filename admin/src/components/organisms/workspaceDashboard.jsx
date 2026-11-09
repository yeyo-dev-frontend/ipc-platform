import { WORKSPACE_AREAS } from "../../data/workspaceAreas";
import { Title } from "../atoms/titles";
import { AreaCard } from "../molecules/areaCard";
import { AccountInvitations } from "./admin/accountInvitations";

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
            <AreaCard
              key={slug}
              path={path}
              Icon={Icon}
              title={title}
              description={description}
            />
          ))}
        </div>
      </section>
      {admin.role === "admin" && <AccountInvitations />}
    </>
  );
}
