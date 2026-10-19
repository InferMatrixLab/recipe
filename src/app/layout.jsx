import Link from "next/link";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";
import { assetPath } from "@/lib/paths";
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
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="header-inner">
            <Link
              href="/"
              className="brand"
              aria-label="InferMatrixLab Recipes home"
            >
              <img
                src={assetPath("/assets/infermatrix-logo.png")}
                alt="InferMatrix"
                width="180"
                height="60"
              />
              <span>Recipes</span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/#catalog">Explore recipes</Link>
              <a href="https://github.com/InferMatrixLab/InferRSI/tree/main/docs/template">
                Engine template <span aria-hidden="true">↗</span>
              </a>
              <a
                className="github-link"
                href="https://github.com/InferMatrixLab/recipe"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <b>InferMatrixLab</b>
            <span>Inference, with a recipe.</span>
          </div>
          <nav aria-label="Footer">
            <a href="https://github.com/InferMatrixLab/recipe/blob/main/CONTRIBUTING.md">
              Contribute a recipe ↗
            </a>
            <a href="https://github.com/InferMatrixLab/recipe/blob/main/docs/inventory.md">
              Engine inventory ↗
            </a>
            <a href="https://github.com/InferMatrixLab/recipe/blob/main/NOTICE">
              Sources & licenses ↗
            </a>
          </nav>
          <p>
            Community maintained. Review the exact configuration and evidence
            before deployment.
          </p>
        </footer>
      </body>
    </html>
  );
}
