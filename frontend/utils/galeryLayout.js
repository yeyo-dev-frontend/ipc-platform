export const MAX_ITEMS = 20;

/*
 * Patrón del collage (se repite cada 6 fotos):
 *   col 1: 1 foto · col 2: 2 fotos · col 3: 2 fotos · col 4: 1 foto
 */
export const GROUP_SIZE = 6;
export const COLUMNS = [[0], [1, 2], [3, 4], [5]];
export const ASPECTS = [
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[10/9]",
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[2/3]",
];

export const chunk = (items, size) => {
  const groups = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
};
