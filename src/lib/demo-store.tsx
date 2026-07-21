"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import {
  gates as initialGates,
  inspectionRecords as initialInspectionRecords,
  inspectionTemplates as initialInspectionTemplates,
  integrationSystems as initialIntegrationSystems,
  mainProjectId,
  mainVehicleId,
  materials as initialMaterials,
  processRoutes as initialProcessRoutes,
  projects as initialProjects,
  qualityIssues as initialQualityIssues,
  reviewPages as initialReviewPages,
  scheduleRows as initialScheduleRows,
  vehicleTimeline as initialVehicleTimeline,
  vehicles as initialVehicles,
  workReports as initialWorkReports,
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

export type WorkInstructionItem = (typeof initialProcessRoutes)[number]["operations"][number]["instructions"][number];
export type OperationItem = (typeof initialProcessRoutes)[number]["operations"][number];
export type ProcessRoute = (typeof initialProcessRoutes)[number];
export type WorkReport = (typeof initialWorkReports)[number];
export type InspectionTemplate = (typeof initialInspectionTemplates)[number];
export type InspectionRecord = (typeof initialInspectionRecords)[number];

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
  processRoutes: ProcessRoute[];
  workReports: WorkReport[];
  inspectionTemplates: InspectionTemplate[];
  inspectionRecords: InspectionRecord[];
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
    processRoutes: initialProcessRoutes.map((route) => ({
      ...route,
      operations: route.operations.map((op) => ({ ...op, instructions: op.instructions.map((wi) => ({ ...wi })) })),
    })),
    workReports: initialWorkReports.map((item) => ({ ...item })),
    inspectionTemplates: initialInspectionTemplates.map((item) => ({ ...item, items: item.items.map((i) => ({ ...i })) })),
    inspectionRecords: initialInspectionRecords.map((item) => ({ ...item, items: item.items.map((i) => ({ ...i })) })),
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
  | { type: "START_OPERATION"; payload: { routeId: string; opId: string } }
  | { type: "COMPLETE_OPERATION"; payload: { routeId: string; opId: string } }
  | { type: "DISPATCH_OPERATION"; payload: { routeId: string; opId: string; assignee: string } }
  | { type: "PAUSE_OPERATION"; payload: { routeId: string; opId: string } }
  | { type: "RESUME_OPERATION"; payload: { routeId: string; opId: string } }
  | { type: "REPORT_OPERATION"; payload: { routeId: string; opId: string; operator: string; measured: string; result: string; note: string } }
  | { type: "SUBMIT_INSPECTION"; payload: { templateId: string; vehicleId: string; inspector: string; result: string; items: { seq: number; checkPoint: string; spec: string; measured: string; judged: string }[] } }
  | { type: "HORIZONTAL_DEPLOY"; payload: { id: string; vehicles: string[] } }
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
        horizontal: false,
        sourceIssueNo: "",
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

    case "START_OPERATION": {
      const { routeId, opId } = action.payload;
      return {
        ...state,
        processRoutes: state.processRoutes.map((route) =>
          route.id !== routeId
            ? route
            : {
                ...route,
                operations: route.operations.map((op) =>
                  op.id === opId && (op.status === "pending" || op.status === "dispatched")
                    ? { ...op, status: "in_progress", startedAt: op.startedAt || new Date().toISOString() }
                    : op
                ),
              }
        ),
        workLogs: [{ time: nowLabel(), title: "工序开工", detail: `${opId} 开始作业` }, ...state.workLogs],
      };
    }

    case "COMPLETE_OPERATION": {
      const { routeId, opId } = action.payload;
      const route = state.processRoutes.find((item) => item.id === routeId);
      const op = route?.operations.find((item) => item.id === opId);
      if (!op || op.status === "completed") return state;
      return {
        ...state,
        processRoutes: state.processRoutes.map((item) =>
          item.id !== routeId
            ? item
            : {
                ...item,
                operations: item.operations.map((o) => (o.id === opId ? { ...o, status: "completed", finishedAt: new Date().toISOString() } : o)),
              }
        ),
        workLogs: [{ time: nowLabel(), title: "工序报工", detail: `${op.name}（${opId}）完成并转序，SOP 步骤全部确认` }, ...state.workLogs],
        vehicleTimeline: pushTimeline(state, { title: `工序完成 ${opId}`, detail: `${op.name} 完成，作业记录存入一车一档`, color: "green" }),
      };
    }

    case "DISPATCH_OPERATION": {
      const { routeId, opId, assignee } = action.payload;
      const route = state.processRoutes.find((item) => item.id === routeId);
      const op = route?.operations.find((item) => item.id === opId);
      if (!op || op.status !== "pending") return state;
      return {
        ...state,
        processRoutes: state.processRoutes.map((item) =>
          item.id !== routeId
            ? item
            : { ...item, operations: item.operations.map((o) => (o.id === opId ? { ...o, status: "dispatched", assignee } : o)) }
        ),
        workLogs: [{ time: nowLabel(), title: "工序派工", detail: `${op.name}（${opId}）已派工至 ${assignee}` }, ...state.workLogs],
      };
    }

    case "PAUSE_OPERATION": {
      const { routeId, opId } = action.payload;
      const route = state.processRoutes.find((item) => item.id === routeId);
      const op = route?.operations.find((item) => item.id === opId);
      if (!op || op.status !== "in_progress") return state;
      return {
        ...state,
        processRoutes: state.processRoutes.map((item) =>
          item.id !== routeId
            ? item
            : { ...item, operations: item.operations.map((o) => (o.id === opId ? { ...o, status: "paused" } : o)) }
        ),
        workLogs: [{ time: nowLabel(), title: "工序暂停", detail: `${op.name}（${opId}）已暂停，资源待释放` }, ...state.workLogs],
      };
    }

    case "RESUME_OPERATION": {
      const { routeId, opId } = action.payload;
      const route = state.processRoutes.find((item) => item.id === routeId);
      const op = route?.operations.find((item) => item.id === opId);
      if (!op || op.status !== "paused") return state;
      return {
        ...state,
        processRoutes: state.processRoutes.map((item) =>
          item.id !== routeId
            ? item
            : { ...item, operations: item.operations.map((o) => (o.id === opId ? { ...o, status: "in_progress" } : o)) }
        ),
        workLogs: [{ time: nowLabel(), title: "工序恢复", detail: `${op.name}（${opId}）恢复作业` }, ...state.workLogs],
      };
    }

    case "REPORT_OPERATION": {
      const { routeId, opId, operator, measured, result, note } = action.payload;
      const route = state.processRoutes.find((item) => item.id === routeId);
      const op = route?.operations.find((item) => item.id === opId);
      if (!op || op.status === "completed") return state;
      const report: WorkReport = {
        id: `WR-${Date.now()}`,
        opNo: opId,
        routeNo: routeId,
        vehicleId: mainVehicleId,
        operator,
        measured,
        result,
        note,
        reportedAt: new Date().toISOString(),
      };
      const measuredText = measured ? `，实测 ${measured}` : "";
      return {
        ...state,
        workReports: [report, ...state.workReports],
        processRoutes: state.processRoutes.map((item) =>
          item.id !== routeId
            ? item
            : {
                ...item,
                operations: item.operations.map((o) =>
                  o.id === opId
                    ? { ...o, status: "completed", assignee: operator, finishedAt: new Date().toISOString(), startedAt: o.startedAt || new Date().toISOString() }
                    : o
                ),
              }
        ),
        workLogs: [{ time: nowLabel(), title: "工序结构化报工", detail: `${op.name}（${opId}）完成，操作人 ${operator}${measuredText}，结果 ${result === "failed" ? "不合格" : "合格"}` }, ...state.workLogs],
        vehicleTimeline: pushTimeline(state, { title: `工序报工 ${opId}`, detail: `${op.name} 完成并转序，操作人 ${operator}${measuredText}，记录存入一车一档`, color: result === "failed" ? "red" : "green" }),
      };
    }

    case "SUBMIT_INSPECTION": {
      const { templateId, vehicleId, inspector, result, items } = action.payload;
      const template = state.inspectionTemplates.find((item) => item.id === templateId);
      if (!template) return state;
      const passed = result !== "failed";
      const record: InspectionRecord = {
        id: `IR-${Date.now()}`,
        templateNo: templateId,
        vehicleId,
        inspector,
        result,
        inspectedAt: new Date().toISOString(),
        items: items.map((item) => ({ ...item })),
      };
      return {
        ...state,
        inspectionRecords: [record, ...state.inspectionRecords],
        workLogs: [{ time: nowLabel(), title: "结构化质量检验", detail: `${template.name} 检验${passed ? "合格" : "不合格"}，检验人 ${inspector}` }, ...state.workLogs],
        vehicleTimeline: pushTimeline(state, { title: `质量检验 ${templateId}`, detail: `${template.name} 检验${passed ? "合格" : "不合格"}，检验人 ${inspector}，记录存入一车一档`, color: passed ? "green" : "red" }),
      };
    }

    case "HORIZONTAL_DEPLOY": {
      const { id, vehicles } = action.payload;
      const source = state.qualityIssues.find((item) => item.id === id);
      if (!source) return state;
      const linked: QualityIssue[] = vehicles.map((prototypeNo, index) => ({
        id: `${id}-HX${index + 1}`,
        title: `${source.title}（横展）`,
        category: source.category,
        vehicle: prototypeNo,
        severity: source.severity,
        owner: source.owner,
        due: "07-20",
        status: "rectifying",
        action: "横展自查：同批次复检并记录",
        horizontal: false,
        sourceIssueNo: id,
      }));
      return {
        ...state,
        qualityIssues: [
          ...state.qualityIssues.map((item) => (item.id === id ? { ...item, horizontal: true } : item)),
          ...linked,
        ],
        vehicleTimeline: pushTimeline(state, { title: `质量问题 ${id} 横展`, detail: `已横展至同批 ${vehicles.length} 台车（${vehicles.join("、")}），等待各车自查关闭`, color: "gold" }),
      };
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

type DemoStoreContextValue = { state: DemoState; dispatch: (action: DemoAction) => void; loading: boolean };

const DemoStoreContext = createContext<DemoStoreContextValue | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, localDispatch] = useReducer(reducer, undefined, buildInitialState);
  const [loading, setLoading] = useState(true);
  const hydratedRef = useRef(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  // Load state from server on mount
  useEffect(() => {
    fetch(`${basePath}/api/state`)
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((serverState: DemoState) => {
        localDispatch({ type: "HYDRATE", payload: serverState });
        hydratedRef.current = true;
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local state if API unavailable
        hydratedRef.current = true;
        setLoading(false);
      });
  }, [basePath]);

  // Dispatch: apply locally (optimistic) + sync to server
  const dispatch = useCallback((action: DemoAction) => {
    localDispatch(action);
    // Sync to server (fire-and-forget for demo responsiveness)
    const payload = "payload" in action ? action.payload : "id" in action ? { id: action.id } : "code" in action ? { code: action.code } : "time" in action ? { time: action.time, business: action.business } : undefined;
    fetch(`${basePath}/api/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: action.type, payload }),
    }).catch(() => {
      // Server sync failed; local state remains authoritative for this session
    });
  }, [basePath]);

  const value = useMemo(() => ({ state, dispatch, loading }), [state, dispatch, loading]);
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
