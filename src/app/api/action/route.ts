import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { readinessLevel } from "@/lib/status";

function nowLabel() {
  return new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, payload } = body;

  switch (type) {
    case "RESET": {
      // Re-seed: delete mutable data and restore defaults
      await prisma.$transaction(async (tx) => {
        await tx.inspectionRecordItem.deleteMany();
        await tx.inspectionRecord.deleteMany();
        await tx.inspectionItem.deleteMany();
        await tx.inspectionTemplate.deleteMany();
        await tx.workReport.deleteMany();
        await tx.workInstruction.deleteMany();
        await tx.operation.deleteMany();
        await tx.processRoute.deleteMany();
        await tx.workLog.deleteMany();
        await tx.vehicleTimelineEvent.deleteMany();
        await tx.scheduleAdjustment.deleteMany();
        await tx.scheduleSlot.deleteMany();
        await tx.integrationLog.deleteMany();
        await tx.integrationSystem.deleteMany();
        await tx.qualityIssue.deleteMany();
        await tx.materialRequirement.deleteMany();
        await tx.gate.deleteMany();
        await tx.reviewPage.deleteMany();
        await tx.workshopState.deleteMany();
        await tx.vehicle.deleteMany();
        await tx.retrofitProject.deleteMany();

        await tx.retrofitProject.createMany({
          data: [
            { id: "PRJ-2026-SM-017", projectNo: "PRJ-2026-SM-017", wbsNo: "WBS-SM-26-0718", name: "银河 E8 智驾验证车改制", type: "SM 改制", owner: "王欣", workshop: "管理车间", vehiclesCount: 6, progress: 68, readiness: 92, risk: "物料风险", status: "in_progress", promisedAt: "07-25" },
            { id: "PRJ-2026-BODY-009", projectNo: "PRJ-2026-BODY-009", wbsNo: "WBS-BD-26-0709", name: "EX5 车身开孔与加强件试制", type: "车身改制", owner: "李徐燕", workshop: "钣金车间", vehiclesCount: 2, progress: 42, readiness: 100, risk: "进度风险", status: "in_progress", promisedAt: "07-28" },
            { id: "PRJ-2026-ZX-031", projectNo: "PRJ-2026-ZX-031", wbsNo: "WBS-ZX-26-0731", name: "领克 900 零星换件任务", type: "零星改制", owner: "叶剑华", workshop: "准备车间", vehiclesCount: 3, progress: 86, readiness: 100, risk: "正常", status: "in_progress", promisedAt: "07-21" },
            { id: "PRJ-2026-DEV-006", projectNo: "PRJ-2026-DEV-006", wbsNo: "WBS-DV-26-0706", name: "热管理支架及工装开发", type: "开发任务", owner: "单鑫磊", workshop: "零部件区", vehiclesCount: 1, progress: 31, readiness: 74, risk: "验收风险", status: "preparing", promisedAt: "08-02" },
          ],
        });

        await tx.vehicle.createMany({
          data: [
            { id: "VH-7E001", vehicleUid: "GEELY-VH-7E001", vin: "L6T79L2Z9SG000317", prototypeNo: "E8-SM-017-01", model: "银河 E8", configuration: "800V 四驱智驾验证版", source: "TOCC 二期", location: "管理车间 · 举升机 L1", stage: "装配", status: "in_progress", progress: 71, projectId: "PRJ-2026-SM-017" },
            { id: "VH-7E002", vehicleUid: "GEELY-VH-7E002", vin: "L6T79L2Z0SG000318", prototypeNo: "E8-SM-017-02", model: "银河 E8", configuration: "800V 四驱智驾验证版", source: "TOCC 二期", location: "准备车间 · 待上线", stage: "准备确认", status: "scheduled", progress: 35, projectId: "PRJ-2026-SM-017" },
            { id: "VH-7E003", vehicleUid: "GEELY-VH-7E003", vin: "L6T79L2Z2SG000319", prototypeNo: "E8-SM-017-03", model: "银河 E8", configuration: "800V 后驱验证版", source: "TOCC 二期", location: "线边暂存区", stage: "物料等待", status: "blocked", progress: 28, projectId: "PRJ-2026-SM-017" },
          ],
        });

        const rZp = await tx.processRoute.create({ data: { routeNo: "GY-E8-017-ZP", projectId: "PRJ-2026-SM-017", stage: "装配", name: "前舱感知支架装配工艺路线", version: "V2.0", status: "frozen", author: "车身工艺 · 张工" } });
        const rCj = await tx.processRoute.create({ data: { routeNo: "GY-E8-017-CJ", projectId: "PRJ-2026-SM-017", stage: "拆解", name: "前舱拆解工艺路线", version: "V1.0", status: "frozen", author: "总装工艺 · 叶工" } });
        const rDev = await tx.processRoute.create({ data: { routeNo: "GY-DEV-006-ZP", projectId: "PRJ-2026-DEV-006", stage: "装配", name: "热管理支架装配工艺路线", version: "V0.9", status: "reviewing", author: "零部件工艺 · 单工" } });
        const oZp10 = await tx.operation.create({ data: { opNo: "OP-ZP-010", routeId: rZp.id, seq: 10, name: "拆卸原车前防撞梁", workCenter: "管理车间 L1", standardMinutes: 45, isKey: false, status: "completed", assignee: "陈师傅", startedAt: new Date("2026-07-18T08:30:00"), finishedAt: new Date("2026-07-18T09:15:00") } });
        const oZp20 = await tx.operation.create({ data: { opNo: "OP-ZP-020", routeId: rZp.id, seq: 20, name: "安装感知支架总成", workCenter: "管理车间 L1", standardMinutes: 60, isKey: true, status: "in_progress", assignee: "陈师傅", startedAt: new Date("2026-07-18T09:20:00") } });
        const oZp30 = await tx.operation.create({ data: { opNo: "OP-ZP-030", routeId: rZp.id, seq: 30, name: "激光雷达线束敷设与接插", workCenter: "管理车间 L1", standardMinutes: 50, isKey: true, status: "pending" } });
        const oZp40 = await tx.operation.create({ data: { opNo: "OP-ZP-040", routeId: rZp.id, seq: 40, name: "扭矩复紧与自检", workCenter: "管理车间 L1", standardMinutes: 30, isKey: false, status: "pending" } });
        const oCj10 = await tx.operation.create({ data: { opNo: "OP-CJ-010", routeId: rCj.id, seq: 10, name: "举升与安全防护", workCenter: "管理车间 L1", standardMinutes: 20, isKey: false, status: "completed" } });
        const oCj20 = await tx.operation.create({ data: { opNo: "OP-CJ-020", routeId: rCj.id, seq: 20, name: "前舱附件拆卸", workCenter: "管理车间 L1", standardMinutes: 60, isKey: true, status: "completed" } });
        const oCj30 = await tx.operation.create({ data: { opNo: "OP-CJ-030", routeId: rCj.id, seq: 30, name: "拆解件分类入箱", workCenter: "管理车间 L1", standardMinutes: 40, isKey: false, status: "completed" } });
        const oDev10 = await tx.operation.create({ data: { opNo: "OP-DEV-010", routeId: rDev.id, seq: 10, name: "支架来料核对", workCenter: "零部件区", standardMinutes: 15, isKey: false, status: "pending" } });
        const oDev20 = await tx.operation.create({ data: { opNo: "OP-DEV-020", routeId: rDev.id, seq: 20, name: "支架试装与测量", workCenter: "零部件区", standardMinutes: 40, isKey: true, status: "pending" } });
        await tx.workInstruction.createMany({
          data: [
            { operationId: oZp10.id, seq: 1, step: "举升车辆并确认安全锁止", torqueSpec: "", tooling: "举升机 L1", qualityReq: "安全锁止到位" },
            { operationId: oZp10.id, seq: 2, step: "拆卸前防撞梁 4 颗连接螺栓", torqueSpec: "拆卸 25 N·m", tooling: "气动扳手", qualityReq: "螺栓分类存放" },
            { operationId: oZp10.id, seq: 3, step: "总成入箱 CT-017，打印并粘贴箱码", torqueSpec: "", tooling: "扫码枪", qualityReq: "箱码与实物一致" },
            { operationId: oZp20.id, seq: 1, step: "核对支架总成物料码 6601200U7300 与批次", torqueSpec: "", tooling: "扫码枪", qualityReq: "物料码与冻结 BOM 一致" },
            { operationId: oZp20.id, seq: 2, step: "支架定位孔对位，预紧 4 颗 M8 螺栓", torqueSpec: "预紧 12 N·m", tooling: "定扭扳手", qualityReq: "孔位偏差 ≤0.5mm" },
            { operationId: oZp20.id, seq: 3, step: "按对角顺序复紧至标准扭矩", torqueSpec: "复紧 25 N·m", tooling: "定扭扳手", qualityReq: "扭矩 100% 记录" },
            { operationId: oZp20.id, seq: 4, step: "粘贴支架合格标识并拍照上传", torqueSpec: "", tooling: "", qualityReq: "照片存入一车一档" },
            { operationId: oZp30.id, seq: 1, step: "核对线束 8882001U9000 批次与走向", torqueSpec: "", tooling: "扫码枪", qualityReq: "与冻结工艺卡一致" },
            { operationId: oZp30.id, seq: 2, step: "按卡扣点位敷设线束，禁止强行弯折", torqueSpec: "", tooling: "", qualityReq: "卡扣 100% 到位" },
            { operationId: oZp30.id, seq: 3, step: "接插件对接并锁止，确认防呆到位", torqueSpec: "", tooling: "", qualityReq: "锁止声确认" },
            { operationId: oZp40.id, seq: 1, step: "对支架与线束全部扭矩点复紧确认", torqueSpec: "25 N·m", tooling: "定扭扳手", qualityReq: "复紧 100% 记录" },
            { operationId: oZp40.id, seq: 2, step: "自检支架装配面差与间隙", torqueSpec: "", tooling: "塞尺", qualityReq: "面差 ≤1.0mm" },
            { operationId: oZp40.id, seq: 3, step: "填写自检记录并提交质量点检", torqueSpec: "", tooling: "", qualityReq: "记录提交质量工程师" },
            { operationId: oCj10.id, seq: 1, step: "举升车辆并确认安全锁止", torqueSpec: "", tooling: "举升机 L1", qualityReq: "安全锁止到位" },
            { operationId: oCj20.id, seq: 1, step: "按拆解清单顺序拆卸前舱附件", torqueSpec: "", tooling: "气动扳手", qualityReq: "与冻结拆解清单一致" },
            { operationId: oCj30.id, seq: 1, step: "拆解件按复用/报废分类入箱并扫码", torqueSpec: "", tooling: "扫码枪", qualityReq: "复用件与报废件不混装" },
            { operationId: oDev10.id, seq: 1, step: "核对来料支架尺寸与材质报告", torqueSpec: "", tooling: "卡尺", qualityReq: "与 3D 数模一致" },
            { operationId: oDev20.id, seq: 1, step: "支架试装并测量装配间隙", torqueSpec: "", tooling: "三坐标", qualityReq: "间隙 0.5~1.5mm" },
          ],
        });
        await tx.workReport.createMany({
          data: [
            { operationId: oZp10.id, opNo: "OP-ZP-010", routeNo: "GY-E8-017-ZP", vehicleId: "VH-7E001", operator: "陈师傅", measured: "拆卸扭矩 25.1 N·m", result: "passed", note: "螺栓分类入箱 CT-017，箱码已扫码绑定", reportedAt: new Date("2026-07-18T09:15:00") },
            { operationId: oCj10.id, opNo: "OP-CJ-010", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "举升安全锁止确认到位", reportedAt: new Date("2026-07-17T14:20:00") },
            { operationId: oCj20.id, opNo: "OP-CJ-020", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "前舱附件按冻结拆解清单拆卸完成", reportedAt: new Date("2026-07-17T15:25:00") },
            { operationId: oCj30.id, opNo: "OP-CJ-030", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "拆解件复用/报废分类入箱并扫码", reportedAt: new Date("2026-07-17T16:05:00") },
          ],
        });
        const tZp = await tx.inspectionTemplate.create({ data: { templateNo: "QP-E8-017-ZP", name: "前舱感知支架装配质量检验规程", opNo: "OP-ZP-020", status: "released", author: "质量工程师 · 周工" } });
        const tCj = await tx.inspectionTemplate.create({ data: { templateNo: "QP-E8-017-CJ", name: "前舱拆解质量检验规程", opNo: "OP-CJ-020", status: "released", author: "质量工程师 · 周工" } });
        await tx.inspectionItem.createMany({
          data: [
            { templateId: tZp.id, seq: 1, checkPoint: "支架定位孔位偏差", method: "三坐标", spec: "≤0.5mm" },
            { templateId: tZp.id, seq: 2, checkPoint: "支架装配面差", method: "塞尺", spec: "≤1.0mm" },
            { templateId: tZp.id, seq: 3, checkPoint: "复紧扭矩", method: "定扭扳手", spec: "25±2 N·m" },
            { templateId: tZp.id, seq: 4, checkPoint: "线束卡扣到位率", method: "目视/手检", spec: "100%" },
            { templateId: tCj.id, seq: 1, checkPoint: "拆解件与清单一致性", method: "扫码核对", spec: "100%" },
            { templateId: tCj.id, seq: 2, checkPoint: "复用件防护状态", method: "目视", spec: "无损伤" },
          ],
        });
        const irCj = await tx.inspectionRecord.create({ data: { templateId: tCj.id, templateNo: "QP-E8-017-CJ", vehicleId: "VH-7E001", inspector: "叶师傅", result: "passed", inspectedAt: new Date("2026-07-17T16:20:00") } });
        await tx.inspectionRecordItem.createMany({
          data: [
            { recordId: irCj.id, seq: 1, checkPoint: "拆解件与清单一致性", spec: "100%", measured: "12/12 一致", judged: "passed" },
            { recordId: irCj.id, seq: 2, checkPoint: "复用件防护状态", spec: "无损伤", measured: "防护完好", judged: "passed" },
          ],
        });

        await tx.gate.createMany({
          data: [
            { key: "vehicle", name: "车辆到位", detail: "VIN、TOCC ID、准入状态一致", passed: true },
            { key: "solution", name: "方案冻结", detail: "执行依据 V3.0 已冻结", passed: true },
            { key: "document", name: "文件可用", detail: "工艺卡与质量文件已发布", passed: true },
            { key: "material", name: "物料齐套", detail: "1 项调拨件预计 7/19 到货", passed: false },
            { key: "resource", name: "资源可用", detail: "L1、总装一班、下午班次已锁定", passed: true },
            { key: "quality", name: "质量策划", detail: "12 项点检与首台门禁已配置", passed: true },
          ],
        });

        await tx.reviewPage.createMany({
          data: [
            { page: 1, title: "项目与车辆范围", owner: "试制策划", status: "passed", comments: 0 },
            { page: 2, title: "改制目的与范围", owner: "工艺工程师", status: "passed", comments: 0 },
            { page: 3, title: "拆换件清单", owner: "物料专员", status: "reviewing", comments: 2 },
            { page: 4, title: "风险与质量控制点", owner: "质量工程师", status: "passed", comments: 0 },
            { page: 5, title: "计划窗口与资源", owner: "生产平衡", status: "reviewing", comments: 1 },
            { page: 6, title: "软件刷写与验收", owner: "电气工程师", status: "passed", comments: 0 },
          ],
        });

        await tx.scheduleSlot.createMany({
          data: [
            { workshop: "管理车间", resource: "举升机 L1", am: "E8-01 拆解", pm: "E8-01 装配", ev: "空闲", status: "healthy" },
            { workshop: "管理车间", resource: "举升机 L2", am: "领克900 首台", pm: "领克900 首台", ev: "空闲", status: "healthy" },
            { workshop: "准备车间", resource: "举升机 L1", am: "E8-02 准备", pm: "空闲", ev: "空闲", status: "healthy" },
            { workshop: "准备车间", resource: "举升机 L2", am: "EX5 工装测量", pm: "E8-03 插单", ev: "空闲", status: "warning" },
            { workshop: "钣金车间", resource: "举升机 L1", am: "EX5 切割", pm: "EX5 焊接", ev: "EX5 续作", status: "healthy" },
            { workshop: "钣金车间", resource: "举升机 L2", am: "维护", pm: "维护", ev: "空闲", status: "blocked" },
          ],
        });

        await tx.materialRequirement.createMany({
          data: [
            { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "6601200U7300", materialName: "前舱感知支架总成", materialType: "标准件", requiredQty: 6, readyQty: 6, readiness: 100, eta: "已到线边", status: "ready" },
            { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "8882001U9000", materialName: "激光雷达线束", materialType: "调拨件", requiredQty: 6, readyQty: 5, readiness: 83, eta: "07-19 10:30", status: "in_transit" },
            { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "DEV-BRKT-017", materialName: "热管理控制器支架", materialType: "新开件", requiredQty: 6, readyQty: 6, readiness: 100, eta: "已验收", status: "ready" },
            { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "REM-E8-0317", materialName: "原车前防撞梁组件", materialType: "拆车件", requiredQty: 1, readyQty: 1, readiness: 100, eta: "待回装 · 箱 CT-017", status: "ready" },
            { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "6605104U7300", materialName: "毫米波雷达固定件", materialType: "标准件", requiredQty: 12, readyQty: 12, readiness: 100, eta: "已到线边", status: "ready" },
          ],
        });

        await tx.qualityIssue.createMany({
          data: [
            { issueNo: "QI-2026-0718-03", projectId: "PRJ-2026-SM-017", vehicleId: "VH-7E001", category: "设计/方案问题", title: "前舱支架装配孔位偏差 1.8mm", severity: "高", status: "rectifying", owner: "张工", dueAt: "今天 18:00", action: "调整支架定位孔并横展同批 5 台车", horizontal: true },
            { issueNo: "QI-2026-0717-11", projectId: "PRJ-2026-SM-017", vehicleId: "VH-7E001", category: "制成问题", title: "线束卡扣未按冻结版工艺卡安装", severity: "中", status: "verifying", owner: "总装一班", dueAt: "07-19", action: "已返工，等待质量复验" },
            { issueNo: "QI-2026-0716-08", projectId: "PRJ-2026-SM-017", vehicleId: "VH-7E002", category: "供应件问题", title: "调拨件标签与实物批次不一致", severity: "中", status: "closed", owner: "物料组", dueAt: "07-18", action: "LES 对账完成，重新打印批次标签" },
            { issueNo: "QI-2026-0718-03-HX2", projectId: "PRJ-2026-SM-017", vehicleId: "VH-7E002", category: "设计/方案问题", title: "前舱支架装配孔位偏差 1.8mm（横展）", severity: "高", status: "rectifying", owner: "张工", dueAt: "07-20", action: "横展自查：同批支架定位孔复检", sourceIssueNo: "QI-2026-0718-03" },
            { issueNo: "QI-2026-0718-03-HX3", projectId: "PRJ-2026-SM-017", vehicleId: "VH-7E003", category: "设计/方案问题", title: "前舱支架装配孔位偏差 1.8mm（横展）", severity: "高", status: "rectifying", owner: "张工", dueAt: "07-20", action: "横展自查：同批支架定位孔复检", sourceIssueNo: "QI-2026-0718-03" },
          ],
        });

        await tx.integrationSystem.createMany({
          data: [
            { name: "TOCC 二期", purpose: "需求、WBS、车辆主档与状态回写", status: "healthy", latency: "182ms", success: "99.6%", lastSync: "2 分钟前" },
            { name: "SAP", purpose: "物料主数据与改制 BOM", status: "healthy", latency: "236ms", success: "99.1%", lastSync: "8 分钟前" },
            { name: "LES", purpose: "库存、齐套、配送与车间接收", status: "warning", latency: "1.8s", success: "96.4%", lastSync: "12 分钟前" },
          ],
        });

        await tx.integrationLog.createMany({
          data: [
            { system: "TOCC 二期", interfaceKey: "车辆主档增量同步", businessKey: "GEELY-VH-7E003", direction: "接收", status: "healthy", message: "车辆状态与项目 WBS 同步成功" },
            { system: "LES", interfaceKey: "齐套状态查询", businessKey: "PRJ-2026-SM-017", direction: "接收", status: "warning", message: "1 项调拨件预计到料时间发生变化" },
            { system: "SAP", interfaceKey: "物料主数据同步", businessKey: "6601200U7300", direction: "接收", status: "healthy", message: "名称、规格与状态同步成功" },
            { system: "TOCC 二期", interfaceKey: "任务执行状态回写", businessKey: "RT-2026-0718-E8-01", direction: "发送", status: "healthy", message: "装配阶段状态回写成功" },
          ],
        });

        await tx.vehicleTimelineEvent.createMany({
          data: [
            { time: "07-18 14:22", title: "装配阶段报工", detail: "总装一班完成前舱支架装配，进入质量点检", color: "blue", sort: 0 },
            { time: "07-18 13:56", title: "质量问题 QI-0718-03", detail: "发现孔位偏差 1.8mm，已分派张工处理", color: "red", sort: 1 },
            { time: "07-18 10:12", title: "扫码装车", detail: "激光雷达线束 SN-LR-260718-01 绑定车辆", color: "green", sort: 2 },
            { time: "07-18 08:31", title: "装配阶段开工", detail: "人员、文件、物料、工装、设备点检通过", color: "blue", sort: 3 },
            { time: "07-17 17:40", title: "拆解阶段完成", detail: "原车前防撞梁组件绑定箱 CT-017，状态待回装", color: "green", sort: 4 },
            { time: "07-16 16:20", title: "方案 V3.0 冻结", detail: "页级评审全部关闭，发布为现场执行依据", color: "cyan", sort: 5 },
            { time: "07-15 09:05", title: "TOCC 需求受理", detail: "WBS-SM-26-0718，车辆主档校验通过", color: "gray", sort: 6 },
          ],
        });

        await tx.workshopState.create({
          data: { id: "singleton", activeVersion: "V3.0", versionFrozen: false, workshopPaused: false, checkpointsDone: 9, checkpointsTotal: 12, scanCount: 4 },
        });

        await tx.workLog.createMany({
          data: [
            { time: "14:22", title: "装配阶段报工", detail: "前舱支架完成，进入质量点检", sort: 0 },
            { time: "13:56", title: "异常反馈", detail: "孔位偏差 1.8mm，生成 QI-2026-0718-03", sort: 1 },
            { time: "10:12", title: "扫码装车", detail: "线束 SN-LR-260718-01 绑定车辆", sort: 2 },
          ],
        });
      });
      return NextResponse.json({ ok: true });
    }

    case "CREATE_PROJECT": {
      const count = await prisma.retrofitProject.count();
      const seq = String(count + 1).padStart(3, "0");
      const id = `PRJ-2026-NEW-${seq}`;
      await prisma.retrofitProject.create({
        data: {
          id,
          projectNo: id,
          wbsNo: `WBS-NEW-26-${seq}`,
          name: payload.name,
          type: payload.type,
          owner: payload.owner,
          workshop: payload.workshop,
          vehiclesCount: payload.vehicles,
          progress: 0,
          readiness: 0,
          risk: "正常",
          status: "preparing",
          promisedAt: payload.promisedAt,
        },
      });
      return NextResponse.json({ ok: true });
    }

    case "CLOSE_REVIEW_COMMENT": {
      const target = await prisma.reviewPage.findFirst({ where: { comments: { gt: 0 } }, orderBy: { page: "asc" } });
      if (!target) return NextResponse.json({ ok: true });
      const newComments = target.comments - 1;
      await prisma.reviewPage.update({
        where: { id: target.id },
        data: { comments: newComments, status: newComments === 0 ? "passed" : target.status },
      });
      return NextResponse.json({ ok: true });
    }

    case "FREEZE_VERSION": {
      const ws = await prisma.workshopState.findUnique({ where: { id: "singleton" } });
      if (!ws || ws.versionFrozen) return NextResponse.json({ ok: true });
      const openComments = await prisma.reviewPage.aggregate({ _sum: { comments: true } });
      if ((openComments._sum.comments ?? 0) > 0) return NextResponse.json({ ok: true });

      const maxSort = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });
      const nextSort = (maxSort._min.sort ?? 0) - 1;

      await prisma.$transaction([
        prisma.workshopState.update({ where: { id: "singleton" }, data: { versionFrozen: true, activeVersion: "V4.0" } }),
        prisma.gate.update({ where: { key: "solution" }, data: { passed: true, detail: "执行依据 V4.0 已冻结" } }),
        prisma.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: "方案 V4.0 冻结", detail: "页级评审全部关闭，发布为现场执行依据", color: "cyan", sort: nextSort } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "VERIFY_QUALITY_ISSUE": {
      const issue = await prisma.qualityIssue.findUnique({ where: { issueNo: payload.id } });
      if (!issue) return NextResponse.json({ ok: true });
      const maxSort = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });
      const nextSort = (maxSort._min.sort ?? 0) - 1;

      await prisma.$transaction([
        prisma.qualityIssue.update({ where: { issueNo: payload.id }, data: { status: "closed", action: `${issue.action ?? ""}；质量复验通过并关闭`, verifiedAt: new Date() } }),
        prisma.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: `质量问题 ${payload.id} 已关闭`, detail: "复验通过，交付门禁同步刷新", color: "green", sort: nextSort } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "CREATE_QUALITY_ISSUE": {
      const count = await prisma.qualityIssue.count();
      const seq = String(count + 1).padStart(2, "0");
      const issueNo = `QI-2026-0718-${seq}`;
      const vehicle = await prisma.vehicle.findFirst({ where: { prototypeNo: payload.vehicle } });
      const maxSort = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });
      const nextSort = (maxSort._min.sort ?? 0) - 1;

      await prisma.$transaction([
        prisma.qualityIssue.create({
          data: { issueNo, projectId: "PRJ-2026-SM-017", vehicleId: vehicle?.id, category: payload.category, title: payload.title, severity: payload.severity, status: "rectifying", owner: payload.owner, dueAt: payload.due, action: payload.action },
        }),
        prisma.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: `新建质量问题 ${issueNo}`, detail: payload.title, color: "red", sort: nextSort } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "ADJUST_SCHEDULE_SLOT": {
      const { workshop, resource, shift, task, reason, operator } = payload;
      const slot = await prisma.scheduleSlot.findFirst({ where: { workshop, resource } });
      if (!slot) return NextResponse.json({ ok: true });
      const before = slot[shift as "am" | "pm" | "ev"];

      await prisma.$transaction([
        prisma.scheduleSlot.update({ where: { id: slot.id }, data: { [shift]: task } }),
        prisma.scheduleAdjustment.create({ data: { workshop, resource, shift, before, after: task, operator, reason } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "ADOPT_SUGGESTION": {
      const slot = await prisma.scheduleSlot.findFirst({ where: { workshop: "准备车间", resource: "举升机 L2" } });
      if (!slot) return NextResponse.json({ ok: true });

      await prisma.$transaction([
        prisma.scheduleSlot.update({ where: { id: slot.id }, data: { pm: "空闲", ev: "E8-03 插单", status: "healthy" } }),
        prisma.scheduleAdjustment.create({ data: { workshop: "准备车间", resource: "举升机 L2", shift: "ev", before: "空闲", after: "E8-03 插单", operator: "王欣", reason: "采纳系统建议，避让 EX5 工装测量冲突" } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "RECEIVE_MATERIAL": {
      const mat = await prisma.materialRequirement.findFirst({ where: { materialCode: payload.code } });
      if (!mat || mat.readyQty >= mat.requiredQty) return NextResponse.json({ ok: true });
      const ready = mat.readyQty + 1;
      const readiness = Math.round((ready / mat.requiredQty) * 100);
      await prisma.materialRequirement.update({
        where: { id: mat.id },
        data: { readyQty: ready, readiness, status: readinessLevel(readiness), eta: ready >= mat.requiredQty ? "已到线边" : mat.eta },
      });

      // Check if all materials are ready
      const allMats = await prisma.materialRequirement.findMany();
      const updated = allMats.map((m) => (m.id === mat.id ? { ...m, readyQty: ready } : m));
      const allReady = updated.every((m) => m.readyQty >= m.requiredQty);
      if (allReady) {
        await prisma.$transaction([
          prisma.gate.update({ where: { key: "material" }, data: { passed: true, detail: "项目所需物料已全部齐套" } }),
          prisma.retrofitProject.update({ where: { id: "PRJ-2026-SM-017" }, data: { readiness: 100 } }),
        ]);
      }
      return NextResponse.json({ ok: true });
    }

    case "SCAN_PART": {
      const ws = await prisma.workshopState.findUnique({ where: { id: "singleton" } });
      if (!ws || ws.workshopPaused || ws.scanCount >= 6) return NextResponse.json({ ok: true });
      const next = ws.scanCount + 1;
      const minSort = await prisma.workLog.aggregate({ _min: { sort: true } });
      const nextSort = (minSort._min.sort ?? 0) - 1;

      await prisma.$transaction([
        prisma.workshopState.update({ where: { id: "singleton" }, data: { scanCount: next } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "扫码装车", detail: `关键件 SN-DEMO-${String(next).padStart(3, "0")} 已绑定车辆`, sort: nextSort } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "REPORT_PROGRESS": {
      const ws = await prisma.workshopState.findUnique({ where: { id: "singleton" } });
      if (!ws || ws.workshopPaused) return NextResponse.json({ ok: true });
      const vehicle = await prisma.vehicle.findUnique({ where: { id: "VH-7E001" } });
      if (!vehicle || vehicle.progress >= 100) return NextResponse.json({ ok: true });

      const minSortLog = await prisma.workLog.aggregate({ _min: { sort: true } });
      const minSortTl = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });

      await prisma.$transaction([
        prisma.vehicle.update({ where: { id: "VH-7E001" }, data: { progress: Math.min(100, vehicle.progress + 8) } }),
        prisma.retrofitProject.update({ where: { id: "PRJ-2026-SM-017" }, data: { progress: { increment: 2 } } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "装配阶段报工", detail: "阶段进度已更新，一车一档同步生成报工证据", sort: (minSortLog._min.sort ?? 0) - 1 } }),
        prisma.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: "装配阶段报工", detail: "总装一班完成阶段工作量确认，进度同步更新", color: "blue", sort: (minSortTl._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "QC_CHECKPOINT": {
      const ws = await prisma.workshopState.findUnique({ where: { id: "singleton" } });
      if (!ws || ws.workshopPaused || ws.checkpointsDone >= ws.checkpointsTotal) return NextResponse.json({ ok: true });
      await prisma.workshopState.update({ where: { id: "singleton" }, data: { checkpointsDone: ws.checkpointsDone + 1 } });
      return NextResponse.json({ ok: true });
    }

    case "START_OPERATION": {
      const { routeId, opId } = payload;
      const op = await prisma.operation.findFirst({ where: { opNo: opId, route: { routeNo: routeId } } });
      if (!op || (op.status !== "pending" && op.status !== "dispatched")) return NextResponse.json({ ok: true });
      const minSort = await prisma.workLog.aggregate({ _min: { sort: true } });
      await prisma.$transaction([
        prisma.operation.update({ where: { id: op.id }, data: { status: "in_progress", startedAt: op.startedAt ?? new Date() } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "工序开工", detail: `${op.name}（${op.opNo}）开始作业`, sort: (minSort._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "COMPLETE_OPERATION": {
      const { routeId, opId } = payload;
      const op = await prisma.operation.findFirst({ where: { opNo: opId, route: { routeNo: routeId } } });
      if (!op || op.status === "completed") return NextResponse.json({ ok: true });
      const minSortLog = await prisma.workLog.aggregate({ _min: { sort: true } });
      const minSortTl = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });
      await prisma.$transaction([
        prisma.operation.update({ where: { id: op.id }, data: { status: "completed", finishedAt: new Date() } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "工序报工", detail: `${op.name}（${op.opNo}）完成并转序，SOP 步骤全部确认`, sort: (minSortLog._min.sort ?? 0) - 1 } }),
        prisma.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: `工序完成 ${op.opNo}`, detail: `${op.name} 完成，作业记录存入一车一档`, color: "green", sort: (minSortTl._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "DISPATCH_OPERATION": {
      const { routeId, opId, assignee } = payload;
      const op = await prisma.operation.findFirst({ where: { opNo: opId, route: { routeNo: routeId } } });
      if (!op || op.status !== "pending") return NextResponse.json({ ok: true });
      const minSort = await prisma.workLog.aggregate({ _min: { sort: true } });
      await prisma.$transaction([
        prisma.operation.update({ where: { id: op.id }, data: { status: "dispatched", assignee } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "工序派工", detail: `${op.name}（${op.opNo}）已派工至 ${assignee}`, sort: (minSort._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "PAUSE_OPERATION": {
      const { routeId, opId } = payload;
      const op = await prisma.operation.findFirst({ where: { opNo: opId, route: { routeNo: routeId } } });
      if (!op || op.status !== "in_progress") return NextResponse.json({ ok: true });
      const minSort = await prisma.workLog.aggregate({ _min: { sort: true } });
      await prisma.$transaction([
        prisma.operation.update({ where: { id: op.id }, data: { status: "paused" } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "工序暂停", detail: `${op.name}（${op.opNo}）已暂停，资源待释放`, sort: (minSort._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "RESUME_OPERATION": {
      const { routeId, opId } = payload;
      const op = await prisma.operation.findFirst({ where: { opNo: opId, route: { routeNo: routeId } } });
      if (!op || op.status !== "paused") return NextResponse.json({ ok: true });
      const minSort = await prisma.workLog.aggregate({ _min: { sort: true } });
      await prisma.$transaction([
        prisma.operation.update({ where: { id: op.id }, data: { status: "in_progress" } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "工序恢复", detail: `${op.name}（${op.opNo}）恢复作业`, sort: (minSort._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "REPORT_OPERATION": {
      const { routeId, opId, operator, measured, result, note } = payload;
      const op = await prisma.operation.findFirst({ where: { opNo: opId, route: { routeNo: routeId } }, include: { route: true } });
      if (!op || op.status === "completed") return NextResponse.json({ ok: true });
      const minSortLog = await prisma.workLog.aggregate({ _min: { sort: true } });
      const minSortTl = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });
      const measuredText = measured ? `，实测 ${measured}` : "";
      await prisma.$transaction([
        prisma.workReport.create({ data: { operationId: op.id, opNo: op.opNo, routeNo: op.route.routeNo, vehicleId: "VH-7E001", operator, measured: measured ?? "", result: result ?? "passed", note: note ?? "" } }),
        prisma.operation.update({ where: { id: op.id }, data: { status: "completed", assignee: operator, finishedAt: new Date(), startedAt: op.startedAt ?? new Date() } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: "工序结构化报工", detail: `${op.name}（${op.opNo}）完成，操作人 ${operator}${measuredText}，结果 ${result === "failed" ? "不合格" : "合格"}`, sort: (minSortLog._min.sort ?? 0) - 1 } }),
        prisma.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: `工序报工 ${op.opNo}`, detail: `${op.name} 完成并转序，操作人 ${operator}${measuredText}，记录存入一车一档`, color: result === "failed" ? "red" : "green", sort: (minSortTl._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "SUBMIT_INSPECTION": {
      const { templateId, vehicleId, inspector, result, items } = payload;
      const template = await prisma.inspectionTemplate.findFirst({ where: { templateNo: templateId } });
      if (!template) return NextResponse.json({ ok: true });
      const minSortLog = await prisma.workLog.aggregate({ _min: { sort: true } });
      const minSortTl = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });
      const passed = result !== "failed";
      await prisma.$transaction(async (tx) => {
        const record = await tx.inspectionRecord.create({ data: { templateId: template.id, templateNo: template.templateNo, vehicleId, inspector, result: result ?? "passed" } });
        if (Array.isArray(items) && items.length > 0) {
          await tx.inspectionRecordItem.createMany({
            data: items.map((item: { seq: number; checkPoint: string; spec?: string; measured?: string; judged?: string }) => ({
              recordId: record.id,
              seq: item.seq,
              checkPoint: item.checkPoint,
              spec: item.spec ?? "",
              measured: item.measured ?? "",
              judged: item.judged ?? "passed",
            })),
          });
        }
        await tx.workLog.create({ data: { time: nowLabel(), title: "结构化质量检验", detail: `${template.name} 检验${passed ? "合格" : "不合格"}，检验人 ${inspector}`, sort: (minSortLog._min.sort ?? 0) - 1 } });
        await tx.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: `质量检验 ${template.templateNo}`, detail: `${template.name} 检验${passed ? "合格" : "不合格"}，检验人 ${inspector}，记录存入一车一档`, color: passed ? "green" : "red", sort: (minSortTl._min.sort ?? 0) - 1 } });
      });
      return NextResponse.json({ ok: true });
    }

    case "HORIZONTAL_DEPLOY": {
      const { id, vehicles } = payload;
      const source = await prisma.qualityIssue.findUnique({ where: { issueNo: id } });
      if (!source) return NextResponse.json({ ok: true });
      const targets: string[] = Array.isArray(vehicles) ? vehicles : [];
      const minSortTl = await prisma.vehicleTimelineEvent.aggregate({ _min: { sort: true } });

      await prisma.$transaction(async (tx) => {
        await tx.qualityIssue.update({ where: { issueNo: id }, data: { horizontal: true } });
        for (const prototypeNo of targets) {
          const vehicle = await tx.vehicle.findFirst({ where: { prototypeNo } });
          const seq = String(Math.floor(Math.random() * 90) + 10);
          await tx.qualityIssue.create({
            data: {
              issueNo: `${id}-HX${seq}`,
              projectId: source.projectId,
              vehicleId: vehicle?.id,
              category: source.category,
              title: `${source.title}（横展）`,
              severity: source.severity,
              status: "rectifying",
              owner: source.owner,
              dueAt: "07-20",
              action: "横展自查：同批次复检并记录",
              sourceIssueNo: id,
            },
          });
        }
        await tx.vehicleTimelineEvent.create({ data: { time: `07-18 ${nowLabel()}`, title: `质量问题 ${id} 横展`, detail: `已横展至同批 ${targets.length} 台车（${targets.join("、")}），等待各车自查关闭`, color: "gold", sort: (minSortTl._min.sort ?? 0) - 1 } });
      });
      return NextResponse.json({ ok: true });
    }

    case "TOGGLE_PAUSE": {
      const ws = await prisma.workshopState.findUnique({ where: { id: "singleton" } });
      if (!ws) return NextResponse.json({ ok: true });
      const paused = !ws.workshopPaused;
      const minSort = await prisma.workLog.aggregate({ _min: { sort: true } });

      await prisma.$transaction([
        prisma.workshopState.update({ where: { id: "singleton" }, data: { workshopPaused: paused } }),
        prisma.vehicle.update({ where: { id: "VH-7E001" }, data: { status: paused ? "paused" : "in_progress" } }),
        prisma.workLog.create({ data: { time: nowLabel(), title: paused ? "任务暂停" : "任务恢复", detail: paused ? "现场人员已暂停当前任务，扫码/点检/报工已锁定" : "任务恢复执行", sort: (minSort._min.sort ?? 0) - 1 } }),
      ]);
      return NextResponse.json({ ok: true });
    }

    case "RETRY_INTEGRATION": {
      await prisma.integrationLog.updateMany({
        where: { businessKey: payload.business, status: "warning" },
        data: { status: "healthy", message: "已重新处理并同步成功" },
      });
      return NextResponse.json({ ok: true });
    }

    case "HEALTH_CHECK": {
      const systems = await prisma.integrationSystem.findMany();
      for (const system of systems) {
        if (system.status !== "warning") continue;
        const currentMs = Math.round(parseFloat(system.latency) * (system.latency.endsWith("ms") ? 1 : 1000));
        const nextMs = Math.max(180, Math.round(currentMs / 2));
        const healed = nextMs <= 400;
        await prisma.integrationSystem.update({
          where: { id: system.id },
          data: { latency: `${nextMs}ms`, status: healed ? "healthy" : "warning", success: healed ? "99.0%" : system.success, lastSync: "刚刚" },
        });
      }
      return NextResponse.json({ ok: true });
    }

    default:
      return NextResponse.json({ error: `Unknown action: ${type}` }, { status: 400 });
  }
}
