import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="page-container empty-state">
      <p className="eyebrow">404 / NOT IN THE CATALOG</p>
      <h1>Recipe not found.</h1>
      <p>This configuration has no catalog page.</p>
      <Link className="primary-button" href="/">
        Explore recipes
      </Link>
    </main>
  );
}
