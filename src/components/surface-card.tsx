export function SurfaceCard({
  title,
  subtitle,
  extra,
  children,
  compact = false,
}: {
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <section className={`surface-card${compact ? " compact" : ""}`}>
      {(title || extra) && (
        <div className="section-title">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <div className="section-subtitle">{subtitle}</div>}
          </div>
          {extra}
        </div>
      )}
      {children}
    </section>
  );
}

