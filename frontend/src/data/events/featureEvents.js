import { getFeaturedEvents } from "./evenst";

export const FEATURED_EVENTS = getFeaturedEvents().map(
  ({ id, title, category, location, shortDescription, image }) => ({
    id,
    title,
    category,
    location,
    description: shortDescription,
    image,
  }),
);
