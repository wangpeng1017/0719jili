import { statusLabel, statusTones } from "@/lib/status";

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const tone = statusTones[status] ?? "gray";
  return <span className={`status-pill tone-${tone}`}>{label ?? statusLabel(status)}</span>;
}

