import { assetPath } from "@/lib/paths";
export default function BrandLogo({
  brand,
  className = "",
  decorative = false,
}) {
  if (!brand?.logo) return null;
  return (
    <img
      className={`brand-logo ${className}`}
      src={assetPath(brand.logo)}
      alt={decorative ? "" : `${brand.name} logo`}
      width="24"
      height="24"
    />
  );
}
