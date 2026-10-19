import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import { getCatalog } from "@/lib/catalog";
import SiteShell from "@/components/SiteShell";
export const metadata = {
  title: {
    default: "InferMatrixLab Recipes — Inference, with a recipe.",
    template: "%s | InferMatrixLab Recipes",
  },
  description:
    "Find model inference recipes by engine, task and exact hardware. Read the deployment commands, source and evidence.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SiteShell catalog={getCatalog()}>{children}</SiteShell>
      </body>
    </html>
  );
}
