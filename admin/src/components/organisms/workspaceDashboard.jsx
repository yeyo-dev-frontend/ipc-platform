import { WORKSPACE_AREAS } from "../../data/workspaceAreas";
import { Title } from "../atoms/titles";
import { AreaCard } from "../molecules/areaCard";

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
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-4">
          {visibleAreas.map(
            ({ slug, path, Icon, title, description, pending }) => (
              <AreaCard
                key={slug}
                path={path}
                Icon={Icon}
                title={title}
                description={description}
                pending={pending}
              />
            ),
          )}
        </div>
      </section>
    </>
  );
}
