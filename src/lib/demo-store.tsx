"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import {
  gates as initialGates,
  integrationSystems as initialIntegrationSystems,
  mainProjectId,
  mainVehicleId,
  materials as initialMaterials,
  projects as initialProjects,
  qualityIssues as initialQualityIssues,
  reviewPages as initialReviewPages,
  scheduleRows as initialScheduleRows,
  vehicleTimeline as initialVehicleTimeline,
  vehicles as initialVehicles,
} from "@/lib/demo-data";
import { readinessLevel } from "@/lib/status";

export type Project = (typeof initialProjects)[number];
export type Vehicle = (typeof initialVehicles)[number];
export type Gate = (typeof initialGates)[number];
export type ReviewPageItem = (typeof initialReviewPages)[number];
export type ScheduleRow = (typeof initialScheduleRows)[number];
export type ScheduleShift = "am" | "pm" | "ev";
export type MaterialItem = (typeof initialMaterials)[number];
export type QualityIssue = (typeof initialQualityIssues)[number];
export type IntegrationSystem = (typeof initialIntegrationSystems)[number];
export type TimelineItem = (typeof initialVehicleTimeline)[number];

export type WorkLog = { time: string; title: string; detail: string };

export type IntegrationLog = {
  time: string;
  system: string;
  interface: string;
  business: string;
  direction: string;
  status: string;
  message: string;
};

export type ScheduleAdjustment = {
  time: string;
  workshop: string;
  resource: string;
  shift: ScheduleShift;
  before: string;
  after: string;
  operator: string;
  reason: string;
};

const initialIntegrationLogs: IntegrationLog[] = [
  { time: "16:28:12", system: "TOCC 二期", interface: "车辆主档增量同步", business: "GEELY-VH-7E003", direction: "接收", status: "healthy", message: "车辆状态与项目 WBS 同步成功" },
  { time: "16:21:46", system: "LES", interface: "齐套状态查询", business: "PRJ-2026-SM-017", direction: "接收", status: "warning", message: "1 项调拨件预计到料时间发生变化" },
  { time: "16:09:08", system: "SAP", interface: "物料主数据同步", business: "6601200U7300", direction: "接收", status: "healthy", message: "名称、规格与状态同步成功" },
  { time: "15:52:33", system: "TOCC 二期", interface: "任务执行状态回写", business: "RT-2026-0718-E8-01", direction: "发送", status: "healthy", message: "装配阶段状态回写成功" },
];

export type DemoState = {
  projects: Project[];
  vehicles: Vehicle[];
  gates: Gate[];
  reviewPages: ReviewPageItem[];
  scheduleRows: ScheduleRow[];
  scheduleAdjustments: ScheduleAdjustment[];
  materials: MaterialItem[];
  qualityIssues: QualityIssue[];
  integrationSystems: IntegrationSystem[];
  integrationLogs: IntegrationLog[];
  vehicleTimeline: TimelineItem[];
  activeVersion: string;
  versionFrozen: boolean;
  workshopPaused: boolean;
  checkpointsDone: number;
  checkpointsTotal: number;
  scanCount: number;
  workLogs: WorkLog[];
};

export function buildInitialState(): DemoState {
  return {
    projects: initialProjects.map((item) => ({ ...item })),
    vehicles: initialVehicles.map((item) => ({ ...item })),
    gates: initialGates.map((item) => ({ ...item })),
    reviewPages: initialReviewPages.map((item) => ({ ...item })),
    scheduleRows: initialScheduleRows.map((item) => ({ ...item })),
    scheduleAdjustments: [],
    materials: initialMaterials.map((item) => ({ ...item })),
    qualityIssues: initialQualityIssues.map((item) => ({ ...item })),
    integrationSystems: initialIntegrationSystems.map((item) => ({ ...item })),
    integrationLogs: initialIntegrationLogs.map((item) => ({ ...item })),
    vehicleTimeline: initialVehicleTimeline.map((item) => ({ ...item })),
    activeVersion: "V3.0",
    versionFrozen: false,
    workshopPaused: false,
    checkpointsDone: 9,
    checkpointsTotal: 12,
    scanCount: 4,
    workLogs: [
      { time: "14:22", title: "装配阶段报工", detail: "前舱支架完成，进入质量点检" },
      { time: "13:56", title: "异常反馈", detail: "孔位偏差 1.8mm，生成 QI-2026-0718-03" },
      { time: "10:12", title: "扫码装车", detail: "线束 SN-LR-260718-01 绑定车辆" },
    ],
  };
}

function nowLabel() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function pushTimeline(state: DemoState, item: Omit<TimelineItem, "time"> & { time?: string }): TimelineItem[] {
  return [{ time: item.time ?? `07-18 ${nowLabel()}`, title: item.title, detail: item.detail, color: item.color }, ...state.vehicleTimeline];
}

export type DemoAction =
  | { type: "RESET" }
  | { type: "HYDRATE"; payload: DemoState }
  | { type: "CREATE_PROJECT"; payload: { name: string; type: string; workshop: string; owner: string; promisedAt: string; vehicles: number } }
  | { type: "CLOSE_REVIEW_COMMENT" }
  | { type: "FREEZE_VERSION" }
  | { type: "VERIFY_QUALITY_ISSUE"; id: string }
  | { type: "CREATE_QUALITY_ISSUE"; payload: { title: string; category: string; vehicle: string; severity: string; owner: string; due: string; action: string } }
  | { type: "ADJUST_SCHEDULE_SLOT"; payload: { workshop: string; resource: string; shift: ScheduleShift; task: string; reason: string; operator: string } }
  | { type: "ADOPT_SUGGESTION" }
  | { type: "RECEIVE_MATERIAL"; code: string }
  | { type: "SCAN_PART" }
  | { type: "REPORT_PROGRESS" }
  | { type: "QC_CHECKPOINT" }
  | { type: "TOGGLE_PAUSE" }
  | { type: "RETRY_INTEGRATION"; time: string; business: string }
  | { type: "HEALTH_CHECK" };

export function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "RESET":
      return buildInitialState();

    case "HYDRATE":
      return action.payload;

    case "CREATE_PROJECT": {
      const seq = String(state.projects.length + 1).padStart(3, "0");
      const id = `PRJ-2026-NEW-${seq}`;
      const project: Project = {
        id,
        wbs: `WBS-NEW-26-${seq}`,
        name: action.payload.name,
        type: action.payload.type,
        owner: action.payload.owner,
        workshop: action.payload.workshop,
        vehicles: action.payload.vehicles,
        progress: 0,
        readiness: 0,
        risk: "正常",
        status: "preparing",
        promisedAt: action.payload.promisedAt,
      };
      return { ...state, projects: [project, ...state.projects] };
    }

    case "CLOSE_REVIEW_COMMENT": {
      const target = state.reviewPages.find((item) => item.comments > 0);
      if (!target) return state;
      return {
        ...state,
        reviewPages: state.reviewPages.map((item) =>
          item.page === target.page
            ? { ...item, comments: item.comments - 1, status: item.comments - 1 === 0 ? "passed" : item.status }
            : item
        ),
      };
    }

    case "FREEZE_VERSION": {
      const openComments = state.reviewPages.reduce((sum, item) => sum + item.comments, 0);
      if (openComments > 0 || state.versionFrozen) return state;
      return {
        ...state,
        versionFrozen: true,
        activeVersion: "V4.0",
        gates: state.gates.map((item) =>
          item.key === "solution" ? { ...item, passed: true, detail: "执行依据 V4.0 已冻结" } : item
        ),
        vehicleTimeline: pushTimeline(state, { title: "方案 V4.0 冻结", detail: "页级评审全部关闭，发布为现场执行依据", color: "cyan" }),
      };
    }

    case "VERIFY_QUALITY_ISSUE": {
      return {
        ...state,
        qualityIssues: state.qualityIssues.map((item) =>
          item.id === action.id ? { ...item, status: "closed", action: `${item.action}；质量复验通过并关闭` } : item
        ),
        vehicleTimeline: pushTimeline(state, { title: `质量问题 ${action.id} 已关闭`, detail: "复验通过，交付门禁同步刷新", color: "green" }),
      };
    }

    case "CREATE_QUALITY_ISSUE": {
      const seq = String(state.qualityIssues.length + 1).padStart(2, "0");
      const id = `QI-2026-0718-${seq}`;
      const issue: QualityIssue = {
        id,
        title: action.payload.title,
        category: action.payload.category,
        vehicle: action.payload.vehicle,
        severity: action.payload.severity,
        owner: action.payload.owner,
        due: action.payload.due,
        status: "rectifying",
        action: action.payload.action,
      };
      return {
        ...state,
        qualityIssues: [issue, ...state.qualityIssues],
        vehicleTimeline: pushTimeline(state, { title: `新建质量问题 ${id}`, detail: action.payload.title, color: "red" }),
      };
    }

    case "ADJUST_SCHEDULE_SLOT": {
      const { workshop, resource, shift, task, reason, operator } = action.payload;
      const row = state.scheduleRows.find((item) => item.workshop === workshop && item.resource === resource);
      if (!row) return state;
      const before = row[shift];
      const adjustment: ScheduleAdjustment = { time: nowLabel(), workshop, resource, shift, before, after: task, operator, reason };
      return {
        ...state,
        scheduleRows: state.scheduleRows.map((item) =>
          item.workshop === workshop && item.resource === resource ? { ...item, [shift]: task } : item
        ),
        scheduleAdjustments: [adjustment, ...state.scheduleAdjustments],
      };
    }

    case "ADOPT_SUGGESTION": {
      return {
        ...state,
        scheduleRows: state.scheduleRows.map((item) =>
          item.workshop === "准备车间" && item.resource === "举升机 L2"
            ? { ...item, pm: "空闲", ev: "E8-03 插单", status: "healthy" }
            : item
        ),
        scheduleAdjustments: [
          { time: nowLabel(), workshop: "准备车间", resource: "举升机 L2", shift: "ev", before: "空闲", after: "E8-03 插单", operator: "王欣", reason: "采纳系统建议，避让 EX5 工装测量冲突" },
          ...state.scheduleAdjustments,
        ],
      };
    }

    case "RECEIVE_MATERIAL": {
      const materials = state.materials.map((item) => {
        if (item.code !== action.code || item.ready >= item.required) return item;
        const ready = item.ready + 1;
        const readiness = Math.round((ready / item.required) * 100);
        return { ...item, ready, readiness, status: readinessLevel(readiness), eta: ready >= item.required ? "已到线边" : item.eta };
      });
      const allReady = materials.every((item) => item.ready >= item.required);
      return {
        ...state,
        materials,
        gates: state.gates.map((item) =>
          item.key === "material" && allReady
            ? { ...item, passed: true, detail: "项目所需物料已全部齐套" }
            : item
        ),
        projects: state.projects.map((item) =>
          item.id === mainProjectId && allReady
            ? { ...item, readiness: 100, risk: item.risk === "物料风险" ? "正常" : item.risk }
            : item
        ),
      };
    }

    case "SCAN_PART": {
      if (state.workshopPaused || state.scanCount >= 6) return state;
      const next = state.scanCount + 1;
      return {
        ...state,
        scanCount: next,
        workLogs: [{ time: nowLabel(), title: "扫码装车", detail: `关键件 SN-DEMO-${String(next).padStart(3, "0")} 已绑定车辆` }, ...state.workLogs],
      };
    }

    case "REPORT_PROGRESS": {
      const vehicle = state.vehicles.find((item) => item.id === mainVehicleId);
      if (state.workshopPaused || !vehicle || vehicle.progress >= 100) return state;
      return {
        ...state,
        vehicles: state.vehicles.map((item) => (item.id === mainVehicleId ? { ...item, progress: Math.min(100, item.progress + 8) } : item)),
        projects: state.projects.map((item) => (item.id === mainProjectId ? { ...item, progress: Math.min(100, item.progress + 2) } : item)),
        workLogs: [{ time: nowLabel(), title: "装配阶段报工", detail: "阶段进度已更新，一车一档同步生成报工证据" }, ...state.workLogs],
        vehicleTimeline: pushTimeline(state, { title: "装配阶段报工", detail: "总装一班完成阶段工作量确认，进度同步更新", color: "blue" }),
      };
    }

    case "QC_CHECKPOINT": {
      if (state.workshopPaused || state.checkpointsDone >= state.checkpointsTotal) return state;
      return { ...state, checkpointsDone: state.checkpointsDone + 1 };
    }

    case "TOGGLE_PAUSE": {
      const paused = !state.workshopPaused;
      return {
        ...state,
        workshopPaused: paused,
        vehicles: state.vehicles.map((item) => (item.id === mainVehicleId ? { ...item, status: paused ? "paused" : "in_progress" } : item)),
        workLogs: [{ time: nowLabel(), title: paused ? "任务暂停" : "任务恢复", detail: paused ? "现场人员已暂停当前任务，扫码/点检/报工已锁定" : "任务恢复执行" }, ...state.workLogs],
      };
    }

    case "RETRY_INTEGRATION": {
      return {
        ...state,
        integrationLogs: state.integrationLogs.map((item) =>
          item.time === action.time && item.business === action.business
            ? { ...item, status: "healthy", message: "已重新处理并同步成功" }
            : item
        ),
      };
    }

    case "HEALTH_CHECK": {
      return { ...state, integrationSystems: state.integrationSystems.map(projectedHealthCheck) };
    }

    default:
      return state;
  }
}

export function projectedHealthCheck(system: IntegrationSystem): IntegrationSystem {
  if (system.status !== "warning") return system;
  const currentMs = Math.round(parseFloat(system.latency) * (system.latency.endsWith("ms") ? 1 : 1000));
  const nextMs = Math.max(180, Math.round(currentMs / 2));
  const healed = nextMs <= 400;
  return { ...system, latency: `${nextMs}ms`, status: healed ? "healthy" : "warning", success: healed ? "99.0%" : system.success, lastSync: "刚刚" };
}

const STORAGE_KEY = "jili-demo-store-v1";

function loadPersisted(): DemoState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoState) : null;
  } catch {
    return null;
  }
}

type DemoStoreContextValue = { state: DemoState; dispatch: React.Dispatch<DemoAction> };

const DemoStoreContext = createContext<DemoStoreContextValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persisted = loadPersisted();
    if (persisted) dispatch({ type: "HYDRATE", payload: persisted });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable in restricted browser contexts; the in-memory demo remains usable.
    }
  }, [hydrated, state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore 必须在 DemoStoreProvider 内使用");
  return ctx;
}

export function liftUtilisationRate(rows: ScheduleRow[]) {
  let occupied = 0;
  let available = 0;
  for (const row of rows) {
    for (const shift of ["am", "pm", "ev"] as const) {
      const task = row[shift];
      if (task === "维护") continue;
      available += 1;
      if (task !== "空闲") occupied += 1;
    }
  }
  return available === 0 ? 0 : Math.round((occupied / available) * 100);
}

export function unclosedQualityCount(state: DemoState) {
  return state.qualityIssues.filter((item) => item.status !== "closed").length;
}

export function mainProject(state: DemoState) {
  return state.projects.find((item) => item.id === mainProjectId) ?? state.projects[0];
}

export function mainVehicle(state: DemoState) {
  return state.vehicles.find((item) => item.id === mainVehicleId) ?? state.vehicles[0];
}
