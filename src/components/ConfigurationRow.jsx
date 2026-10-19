export default function ConfigurationRow({ label, children, className = "" }) {
  return (
    <div className={`configuration-row ${className}`}>
      <div className="configuration-label">{label}</div>
      <div className="configuration-content">{children}</div>
    </div>
  );
}
