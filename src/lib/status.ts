export const statusLabels: Record<string, string> = {
  preparing: "准备中",
  reviewing: "评审中",
  frozen: "已冻结",
  released: "已发布",
  draft: "草稿",
  scheduled: "已排产",
  dispatched: "已派工",
  in_progress: "执行中",
  paused: "已暂停",
  completed: "已完成",
  blocked: "已阻断",
  pending: "待处理",
  passed: "已通过",
  failed: "失败",
  warning: "有风险",
  healthy: "正常",
  closed: "已关闭",
  verifying: "待复验",
  rectifying: "整改中",
  ready: "已齐套",
  shortage: "缺料",
  in_transit: "在途",
};

export type StatusTone = "blue" | "green" | "gold" | "red" | "gray" | "cyan";

export const statusTones: Record<string, StatusTone> = {
  preparing: "blue",
  reviewing: "gold",
  frozen: "cyan",
  draft: "gray",
  scheduled: "blue",
  dispatched: "cyan",
  in_progress: "blue",
  paused: "gray",
  completed: "green",
  blocked: "red",
  pending: "gray",
  passed: "green",
  failed: "red",
  warning: "gold",
  healthy: "green",
  closed: "green",
  verifying: "cyan",
  rectifying: "gold",
  ready: "green",
  shortage: "red",
  in_transit: "blue",
};

export function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}

export function readinessLevel(value: number) {
  if (value >= 100) return "ready";
  if (value >= 80) return "warning";
  return "shortage";
}

