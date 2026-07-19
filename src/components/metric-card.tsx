export function MetricCard({
  label,
  value,
  suffix,
  detail,
  color,
  icon,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  detail: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="metric-card" style={{ "--metric-color": color } as React.CSSProperties}>
      <div className="metric-label">{label}</div>
      <div className="metric-value-row">
        <div>
          <span className="metric-value">{value}</span>
          {suffix && <span style={{ marginLeft: 5, color: "#5b6b7f", fontSize: 13 }}>{suffix}</span>}
        </div>
        <div style={{ color: color ?? "#0b4f91", fontSize: 22 }}>{icon}</div>
      </div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

