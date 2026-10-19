const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (basePath && !/^\/[a-zA-Z0-9/_-]+$/.test(basePath))
  throw new Error("Invalid NEXT_PUBLIC_BASE_PATH");
export default {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};
