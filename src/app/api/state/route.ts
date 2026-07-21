import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [projects, vehicles, gates, reviewPages, scheduleRows, scheduleAdjustments, materials, qualityIssues, integrationSystems, integrationLogs, vehicleTimeline, workshopState, workLogs] =
    await Promise.all([
      prisma.retrofitProject.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.vehicle.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.gate.findMany({ orderBy: { key: "asc" } }),
      prisma.reviewPage.findMany({ orderBy: { page: "asc" } }),
      prisma.scheduleSlot.findMany({ orderBy: { id: "asc" } }),
      prisma.scheduleAdjustment.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.materialRequirement.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.qualityIssue.findMany({ include: { vehicle: true }, orderBy: { createdAt: "asc" } }),
      prisma.integrationSystem.findMany({ orderBy: { id: "asc" } }),
      prisma.integrationLog.findMany({ orderBy: { occurredAt: "desc" } }),
      prisma.vehicleTimelineEvent.findMany({ orderBy: { sort: "asc" } }),
      prisma.workshopState.findUnique({ where: { id: "singleton" } }),
      prisma.workLog.findMany({ orderBy: { sort: "asc" } }),
    ]);

  const state = {
    projects: projects.map((p) => ({
      id: p.projectNo,
      wbs: p.wbsNo,
      name: p.name,
      type: p.type,
      owner: p.owner,
      workshop: p.workshop,
      vehicles: p.vehiclesCount,
      progress: p.progress,
      readiness: p.readiness,
      risk: p.risk,
      status: p.status,
      promisedAt: p.promisedAt ?? "",
    })),
    vehicles: vehicles.map((v) => ({
      id: v.id,
      uid: v.vehicleUid,
      vin: v.vin ?? "",
      prototypeNo: v.prototypeNo ?? "",
      model: v.model,
      config: v.configuration ?? "",
      source: v.source,
      location: v.location ?? "",
      stage: v.stage,
      status: v.status,
      progress: v.progress,
    })),
    gates: gates.map((g) => ({ key: g.key, name: g.name, detail: g.detail, passed: g.passed })),
    reviewPages: reviewPages.map((r) => ({ page: r.page, title: r.title, owner: r.owner, status: r.status, comments: r.comments })),
    scheduleRows: scheduleRows.map((s) => ({ workshop: s.workshop, resource: s.resource, am: s.am, pm: s.pm, ev: s.ev, status: s.status })),
    scheduleAdjustments: scheduleAdjustments.map((a) => ({ time: new Date(a.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), workshop: a.workshop, resource: a.resource, shift: a.shift, before: a.before, after: a.after, operator: a.operator, reason: a.reason })),
    materials: materials.map((m) => ({ code: m.materialCode, name: m.materialName, type: m.materialType, required: m.requiredQty, ready: m.readyQty, readiness: m.readiness, eta: m.eta ?? "", status: m.status })),
    qualityIssues: qualityIssues.map((q) => ({ id: q.issueNo, title: q.title, category: q.category, vehicle: q.vehicle?.prototypeNo ?? "", severity: q.severity, owner: q.owner, due: q.dueAt ?? "", status: q.status, action: q.action ?? "" })),
    integrationSystems: integrationSystems.map((s) => ({ name: s.name, purpose: s.purpose, status: s.status, latency: s.latency, success: s.success, lastSync: s.lastSync })),
    integrationLogs: integrationLogs.map((l) => ({ time: new Date(l.occurredAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), system: l.system, interface: l.interfaceKey, business: l.businessKey ?? "", direction: l.direction, status: l.status, message: l.message ?? "" })),
    vehicleTimeline: vehicleTimeline.map((t) => ({ time: t.time, title: t.title, detail: t.detail, color: t.color })),
    activeVersion: workshopState?.activeVersion ?? "V3.0",
    versionFrozen: workshopState?.versionFrozen ?? false,
    workshopPaused: workshopState?.workshopPaused ?? false,
    checkpointsDone: workshopState?.checkpointsDone ?? 9,
    checkpointsTotal: workshopState?.checkpointsTotal ?? 12,
    scanCount: workshopState?.scanCount ?? 4,
    workLogs: workLogs.map((w) => ({ time: w.time, title: w.title, detail: w.detail })),
  };

  return NextResponse.json(state);
}
