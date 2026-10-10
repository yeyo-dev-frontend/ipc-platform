export const CATEGORY_STYLES = {
  Congreso: { dot: "bg-blue-deep", chip: "bg-blue-deep/10 text-blue-deep" },
  Taller: { dot: "bg-orange", chip: "bg-orange/10 text-orange" },
  Foro: { dot: "bg-emerald-500", chip: "bg-emerald-100 text-emerald-800" },
  Jornada: { dot: "bg-sky-500", chip: "bg-sky-100 text-sky-800" },
  Feria: { dot: "bg-violet-500", chip: "bg-violet-100 text-violet-800" },
  Encuentro: { dot: "bg-rose-500", chip: "bg-rose-100 text-rose-800" },
  Seminario: { dot: "bg-amber-500", chip: "bg-amber-100 text-amber-800" },
  Hackathon: { dot: "bg-cyan-500", chip: "bg-cyan-100 text-cyan-800" },
  Simposio: { dot: "bg-indigo-500", chip: "bg-indigo-100 text-indigo-800" },
  Charla: { dot: "bg-fuchsia-500", chip: "bg-fuchsia-100 text-fuchsia-800" },
};

const DEFAULT_STYLE = { dot: "bg-blue", chip: "bg-blue/10 text-blue" };

export const getCategoryStyle = (category) =>
  CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
