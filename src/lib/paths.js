export const assetPath = (path) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
export const humanize = (text) => text.replaceAll("_", " ");
