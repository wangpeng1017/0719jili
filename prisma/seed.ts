import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean all tables
  await prisma.inspectionRecordItem.deleteMany();
  await prisma.inspectionRecord.deleteMany();
  await prisma.inspectionItem.deleteMany();
  await prisma.inspectionTemplate.deleteMany();
  await prisma.workReport.deleteMany();
  await prisma.workInstruction.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.processRoute.deleteMany();
  await prisma.workLog.deleteMany();
  await prisma.workshopState.deleteMany();
  await prisma.vehicleTimelineEvent.deleteMany();
  await prisma.integrationSystem.deleteMany();
  await prisma.reviewPage.deleteMany();
  await prisma.gate.deleteMany();
  await prisma.scheduleAdjustment.deleteMany();
  await prisma.scheduleSlot.deleteMany();
  await prisma.integrationLog.deleteMany();
  await prisma.qualityIssue.deleteMany();
  await prisma.materialRequirement.deleteMany();
  await prisma.partTraceEvent.deleteMany();
  await prisma.retrofitTask.deleteMany();
  await prisma.solutionVersion.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.retrofitProject.deleteMany();
  await prisma.user.deleteMany();

  // Users
  await prisma.user.createMany({
    data: [
      { username: "wangxin", password: "demo123", name: "王欣", role: "试制策划经理", dept: "试制中心" },
      { username: "admin", password: "admin123", name: "系统管理员", role: "admin", dept: "IT" },
    ],
  });

  // Projects
  const prj1 = await prisma.retrofitProject.create({
    data: {
      id: "PRJ-2026-SM-017",
      projectNo: "PRJ-2026-SM-017",
      wbsNo: "WBS-SM-26-0718",
      name: "银河 E8 智驾验证车改制",
      type: "SM 改制",
      owner: "王欣",
      workshop: "管理车间",
      vehiclesCount: 6,
      progress: 68,
      readiness: 92,
      risk: "物料风险",
      status: "in_progress",
      promisedAt: "07-25",
    },
  });

  await prisma.retrofitProject.createMany({
    data: [
      { id: "PRJ-2026-BODY-009", projectNo: "PRJ-2026-BODY-009", wbsNo: "WBS-BD-26-0709", name: "EX5 车身开孔与加强件试制", type: "车身改制", owner: "李徐燕", workshop: "钣金车间", vehiclesCount: 2, progress: 42, readiness: 100, risk: "进度风险", status: "in_progress", promisedAt: "07-28" },
      { id: "PRJ-2026-ZX-031", projectNo: "PRJ-2026-ZX-031", wbsNo: "WBS-ZX-26-0731", name: "领克 900 零星换件任务", type: "零星改制", owner: "叶剑华", workshop: "准备车间", vehiclesCount: 3, progress: 86, readiness: 100, risk: "正常", status: "in_progress", promisedAt: "07-21" },
      { id: "PRJ-2026-DEV-006", projectNo: "PRJ-2026-DEV-006", wbsNo: "WBS-DV-26-0706", name: "热管理支架及工装开发", type: "开发任务", owner: "单鑫磊", workshop: "零部件区", vehiclesCount: 1, progress: 31, readiness: 74, risk: "验收风险", status: "preparing", promisedAt: "08-02" },
    ],
  });

  // Vehicles
  await prisma.vehicle.createMany({
    data: [
      { id: "VH-7E001", vehicleUid: "GEELY-VH-7E001", vin: "L6T79L2Z9SG000317", prototypeNo: "E8-SM-017-01", model: "银河 E8", configuration: "800V 四驱智驾验证版", source: "TOCC 二期", location: "管理车间 · 举升机 L1", stage: "装配", status: "in_progress", progress: 71, projectId: prj1.id },
      { id: "VH-7E002", vehicleUid: "GEELY-VH-7E002", vin: "L6T79L2Z0SG000318", prototypeNo: "E8-SM-017-02", model: "银河 E8", configuration: "800V 四驱智驾验证版", source: "TOCC 二期", location: "准备车间 · 待上线", stage: "准备确认", status: "scheduled", progress: 35, projectId: prj1.id },
      { id: "VH-7E003", vehicleUid: "GEELY-VH-7E003", vin: "L6T79L2Z2SG000319", prototypeNo: "E8-SM-017-03", model: "银河 E8", configuration: "800V 后驱验证版", source: "TOCC 二期", location: "线边暂存区", stage: "物料等待", status: "blocked", progress: 28, projectId: prj1.id },
    ],
  });

  // Process routes (工艺路线) + operations (工序) + SOP work instructions (作业指导书)
  const routeZp = await prisma.processRoute.create({
    data: { routeNo: "GY-E8-017-ZP", projectId: prj1.id, stage: "装配", name: "前舱感知支架装配工艺路线", version: "V2.0", status: "frozen", author: "车身工艺 · 张工" },
  });
  const routeCj = await prisma.processRoute.create({
    data: { routeNo: "GY-E8-017-CJ", projectId: prj1.id, stage: "拆解", name: "前舱拆解工艺路线", version: "V1.0", status: "frozen", author: "总装工艺 · 叶工" },
  });
  const routeDev = await prisma.processRoute.create({
    data: { routeNo: "GY-DEV-006-ZP", projectId: "PRJ-2026-DEV-006", stage: "装配", name: "热管理支架装配工艺路线", version: "V0.9", status: "reviewing", author: "零部件工艺 · 单工" },
  });

  const opZp10 = await prisma.operation.create({ data: { opNo: "OP-ZP-010", routeId: routeZp.id, seq: 10, name: "拆卸原车前防撞梁", workCenter: "管理车间 L1", standardMinutes: 45, isKey: false, status: "completed", assignee: "陈师傅", startedAt: new Date("2026-07-18T08:30:00"), finishedAt: new Date("2026-07-18T09:15:00") } });
  const opZp20 = await prisma.operation.create({ data: { opNo: "OP-ZP-020", routeId: routeZp.id, seq: 20, name: "安装感知支架总成", workCenter: "管理车间 L1", standardMinutes: 60, isKey: true, status: "in_progress", assignee: "陈师傅", startedAt: new Date("2026-07-18T09:20:00") } });
  const opZp30 = await prisma.operation.create({ data: { opNo: "OP-ZP-030", routeId: routeZp.id, seq: 30, name: "激光雷达线束敷设与接插", workCenter: "管理车间 L1", standardMinutes: 50, isKey: true, status: "pending" } });
  const opZp40 = await prisma.operation.create({ data: { opNo: "OP-ZP-040", routeId: routeZp.id, seq: 40, name: "扭矩复紧与自检", workCenter: "管理车间 L1", standardMinutes: 30, isKey: false, status: "pending" } });

  const opCj10 = await prisma.operation.create({ data: { opNo: "OP-CJ-010", routeId: routeCj.id, seq: 10, name: "举升与安全防护", workCenter: "管理车间 L1", standardMinutes: 20, isKey: false, status: "completed" } });
  const opCj20 = await prisma.operation.create({ data: { opNo: "OP-CJ-020", routeId: routeCj.id, seq: 20, name: "前舱附件拆卸", workCenter: "管理车间 L1", standardMinutes: 60, isKey: true, status: "completed" } });
  const opCj30 = await prisma.operation.create({ data: { opNo: "OP-CJ-030", routeId: routeCj.id, seq: 30, name: "拆解件分类入箱", workCenter: "管理车间 L1", standardMinutes: 40, isKey: false, status: "completed" } });

  const opDev10 = await prisma.operation.create({ data: { opNo: "OP-DEV-010", routeId: routeDev.id, seq: 10, name: "支架来料核对", workCenter: "零部件区", standardMinutes: 15, isKey: false, status: "pending" } });
  const opDev20 = await prisma.operation.create({ data: { opNo: "OP-DEV-020", routeId: routeDev.id, seq: 20, name: "支架试装与测量", workCenter: "零部件区", standardMinutes: 40, isKey: true, status: "pending" } });

  await prisma.workInstruction.createMany({
    data: [
      // OP-ZP-010 拆卸原车前防撞梁
      { operationId: opZp10.id, seq: 1, step: "举升车辆并确认安全锁止", torqueSpec: "", tooling: "举升机 L1", qualityReq: "安全锁止到位" },
      { operationId: opZp10.id, seq: 2, step: "拆卸前防撞梁 4 颗连接螺栓", torqueSpec: "拆卸 25 N·m", tooling: "气动扳手", qualityReq: "螺栓分类存放" },
      { operationId: opZp10.id, seq: 3, step: "总成入箱 CT-017，打印并粘贴箱码", torqueSpec: "", tooling: "扫码枪", qualityReq: "箱码与实物一致" },
      // OP-ZP-020 安装感知支架总成
      { operationId: opZp20.id, seq: 1, step: "核对支架总成物料码 6601200U7300 与批次", torqueSpec: "", tooling: "扫码枪", qualityReq: "物料码与冻结 BOM 一致" },
      { operationId: opZp20.id, seq: 2, step: "支架定位孔对位，预紧 4 颗 M8 螺栓", torqueSpec: "预紧 12 N·m", tooling: "定扭扳手", qualityReq: "孔位偏差 ≤0.5mm" },
      { operationId: opZp20.id, seq: 3, step: "按对角顺序复紧至标准扭矩", torqueSpec: "复紧 25 N·m", tooling: "定扭扳手", qualityReq: "扭矩 100% 记录" },
      { operationId: opZp20.id, seq: 4, step: "粘贴支架合格标识并拍照上传", torqueSpec: "", tooling: "", qualityReq: "照片存入一车一档" },
      // OP-ZP-030 激光雷达线束敷设与接插
      { operationId: opZp30.id, seq: 1, step: "核对线束 8882001U9000 批次与走向", torqueSpec: "", tooling: "扫码枪", qualityReq: "与冻结工艺卡一致" },
      { operationId: opZp30.id, seq: 2, step: "按卡扣点位敷设线束，禁止强行弯折", torqueSpec: "", tooling: "", qualityReq: "卡扣 100% 到位" },
      { operationId: opZp30.id, seq: 3, step: "接插件对接并锁止，确认防呆到位", torqueSpec: "", tooling: "", qualityReq: "锁止声确认" },
      // OP-ZP-040 扭矩复紧与自检
      { operationId: opZp40.id, seq: 1, step: "对支架与线束全部扭矩点复紧确认", torqueSpec: "25 N·m", tooling: "定扭扳手", qualityReq: "复紧 100% 记录" },
      { operationId: opZp40.id, seq: 2, step: "自检支架装配面差与间隙", torqueSpec: "", tooling: "塞尺", qualityReq: "面差 ≤1.0mm" },
      { operationId: opZp40.id, seq: 3, step: "填写自检记录并提交质量点检", torqueSpec: "", tooling: "", qualityReq: "记录提交质量工程师" },
      // OP-CJ 拆解
      { operationId: opCj10.id, seq: 1, step: "举升车辆并确认安全锁止", torqueSpec: "", tooling: "举升机 L1", qualityReq: "安全锁止到位" },
      { operationId: opCj20.id, seq: 1, step: "按拆解清单顺序拆卸前舱附件", torqueSpec: "", tooling: "气动扳手", qualityReq: "与冻结拆解清单一致" },
      { operationId: opCj30.id, seq: 1, step: "拆解件按复用/报废分类入箱并扫码", torqueSpec: "", tooling: "扫码枪", qualityReq: "复用件与报废件不混装" },
      // OP-DEV 支架开发
      { operationId: opDev10.id, seq: 1, step: "核对来料支架尺寸与材质报告", torqueSpec: "", tooling: "卡尺", qualityReq: "与 3D 数模一致" },
      { operationId: opDev20.id, seq: 1, step: "支架试装并测量装配间隙", torqueSpec: "", tooling: "三坐标", qualityReq: "间隙 0.5~1.5mm" },
    ],
  });

  // Work reports (结构化报工) — execution evidence for completed operations on VH-7E001
  await prisma.workReport.createMany({
    data: [
      { operationId: opZp10.id, opNo: "OP-ZP-010", routeNo: "GY-E8-017-ZP", vehicleId: "VH-7E001", operator: "陈师傅", measured: "拆卸扭矩 25.1 N·m", result: "passed", note: "螺栓分类入箱 CT-017，箱码已扫码绑定", reportedAt: new Date("2026-07-18T09:15:00") },
      { operationId: opCj10.id, opNo: "OP-CJ-010", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "举升安全锁止确认到位", reportedAt: new Date("2026-07-17T14:20:00") },
      { operationId: opCj20.id, opNo: "OP-CJ-020", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "前舱附件按冻结拆解清单拆卸完成", reportedAt: new Date("2026-07-17T15:25:00") },
      { operationId: opCj30.id, opNo: "OP-CJ-030", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "拆解件复用/报废分类入箱并扫码", reportedAt: new Date("2026-07-17T16:05:00") },
    ],
  });

  // Inspection templates (质量文件) + structured inspection records (结构化检验)
  const tplZp = await prisma.inspectionTemplate.create({ data: { templateNo: "QP-E8-017-ZP", name: "前舱感知支架装配质量检验规程", opNo: "OP-ZP-020", status: "released", author: "质量工程师 · 周工" } });
  const tplCj = await prisma.inspectionTemplate.create({ data: { templateNo: "QP-E8-017-CJ", name: "前舱拆解质量检验规程", opNo: "OP-CJ-020", status: "released", author: "质量工程师 · 周工" } });
  await prisma.inspectionItem.createMany({
    data: [
      { templateId: tplZp.id, seq: 1, checkPoint: "支架定位孔位偏差", method: "三坐标", spec: "≤0.5mm" },
      { templateId: tplZp.id, seq: 2, checkPoint: "支架装配面差", method: "塞尺", spec: "≤1.0mm" },
      { templateId: tplZp.id, seq: 3, checkPoint: "复紧扭矩", method: "定扭扳手", spec: "25±2 N·m" },
      { templateId: tplZp.id, seq: 4, checkPoint: "线束卡扣到位率", method: "目视/手检", spec: "100%" },
      { templateId: tplCj.id, seq: 1, checkPoint: "拆解件与清单一致性", method: "扫码核对", spec: "100%" },
      { templateId: tplCj.id, seq: 2, checkPoint: "复用件防护状态", method: "目视", spec: "无损伤" },
    ],
  });
  const recCj = await prisma.inspectionRecord.create({ data: { templateId: tplCj.id, templateNo: "QP-E8-017-CJ", vehicleId: "VH-7E001", inspector: "叶师傅", result: "passed", inspectedAt: new Date("2026-07-17T16:20:00") } });
  await prisma.inspectionRecordItem.createMany({
    data: [
      { recordId: recCj.id, seq: 1, checkPoint: "拆解件与清单一致性", spec: "100%", measured: "12/12 一致", judged: "passed" },
      { recordId: recCj.id, seq: 2, checkPoint: "复用件防护状态", spec: "无损伤", measured: "防护完好", judged: "passed" },
    ],
  });

  // Gates
  await prisma.gate.createMany({
    data: [
      { key: "vehicle", name: "车辆到位", detail: "VIN、TOCC ID、准入状态一致", passed: true },
      { key: "solution", name: "方案冻结", detail: "执行依据 V3.0 已冻结", passed: true },
      { key: "document", name: "文件可用", detail: "工艺卡与质量文件已发布", passed: true },
      { key: "material", name: "物料齐套", detail: "1 项调拨件预计 7/19 到货", passed: false },
      { key: "resource", name: "资源可用", detail: "L1、总装一班、下午班次已锁定", passed: true },
      { key: "quality", name: "质量策划", detail: "12 项点检与首台门禁已配置", passed: true },
    ],
  });

  // Review pages
  await prisma.reviewPage.createMany({
    data: [
      { page: 1, title: "项目与车辆范围", owner: "试制策划", status: "passed", comments: 0 },
      { page: 2, title: "改制目的与范围", owner: "工艺工程师", status: "passed", comments: 0 },
      { page: 3, title: "拆换件清单", owner: "物料专员", status: "reviewing", comments: 2 },
      { page: 4, title: "风险与质量控制点", owner: "质量工程师", status: "passed", comments: 0 },
      { page: 5, title: "计划窗口与资源", owner: "生产平衡", status: "reviewing", comments: 1 },
      { page: 6, title: "软件刷写与验收", owner: "电气工程师", status: "passed", comments: 0 },
    ],
  });

  // Schedule slots
  await prisma.scheduleSlot.createMany({
    data: [
      { workshop: "管理车间", resource: "举升机 L1", am: "E8-01 拆解", pm: "E8-01 装配", ev: "空闲", status: "healthy" },
      { workshop: "管理车间", resource: "举升机 L2", am: "领克900 首台", pm: "领克900 首台", ev: "空闲", status: "healthy" },
      { workshop: "准备车间", resource: "举升机 L1", am: "E8-02 准备", pm: "空闲", ev: "空闲", status: "healthy" },
      { workshop: "准备车间", resource: "举升机 L2", am: "EX5 工装测量", pm: "E8-03 插单", ev: "空闲", status: "warning" },
      { workshop: "钣金车间", resource: "举升机 L1", am: "EX5 切割", pm: "EX5 焊接", ev: "EX5 续作", status: "healthy" },
      { workshop: "钣金车间", resource: "举升机 L2", am: "维护", pm: "维护", ev: "空闲", status: "blocked" },
    ],
  });

  // Materials
  await prisma.materialRequirement.createMany({
    data: [
      { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "6601200U7300", materialName: "前舱感知支架总成", materialType: "标准件", requiredQty: 6, readyQty: 6, readiness: 100, eta: "已到线边", status: "ready" },
      { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "8882001U9000", materialName: "激光雷达线束", materialType: "调拨件", requiredQty: 6, readyQty: 5, readiness: 83, eta: "07-19 10:30", status: "in_transit" },
      { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "DEV-BRKT-017", materialName: "热管理控制器支架", materialType: "新开件", requiredQty: 6, readyQty: 6, readiness: 100, eta: "已验收", status: "ready" },
      { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "REM-E8-0317", materialName: "原车前防撞梁组件", materialType: "拆车件", requiredQty: 1, readyQty: 1, readiness: 100, eta: "待回装 · 箱 CT-017", status: "ready" },
      { taskNo: "RT-2026-0718-E8-01", vehicleUid: "GEELY-VH-7E001", materialCode: "6605104U7300", materialName: "毫米波雷达固定件", materialType: "标准件", requiredQty: 12, readyQty: 12, readiness: 100, eta: "已到线边", status: "ready" },
    ],
  });

  // Quality issues
  await prisma.qualityIssue.createMany({
    data: [
      { issueNo: "QI-2026-0718-03", projectId: prj1.id, vehicleId: "VH-7E001", category: "设计/方案问题", title: "前舱支架装配孔位偏差 1.8mm", severity: "高", status: "rectifying", owner: "张工", dueAt: "今天 18:00", action: "调整支架定位孔并横展同批 5 台车", horizontal: true },
      { issueNo: "QI-2026-0717-11", projectId: prj1.id, vehicleId: "VH-7E001", category: "制成问题", title: "线束卡扣未按冻结版工艺卡安装", severity: "中", status: "verifying", owner: "总装一班", dueAt: "07-19", action: "已返工，等待质量复验" },
      { issueNo: "QI-2026-0716-08", projectId: prj1.id, vehicleId: "VH-7E002", category: "供应件问题", title: "调拨件标签与实物批次不一致", severity: "中", status: "closed", owner: "物料组", dueAt: "07-18", action: "LES 对账完成，重新打印批次标签" },
      { issueNo: "QI-2026-0718-03-HX2", projectId: prj1.id, vehicleId: "VH-7E002", category: "设计/方案问题", title: "前舱支架装配孔位偏差 1.8mm（横展）", severity: "高", status: "rectifying", owner: "张工", dueAt: "07-20", action: "横展自查：同批支架定位孔复检", sourceIssueNo: "QI-2026-0718-03" },
      { issueNo: "QI-2026-0718-03-HX3", projectId: prj1.id, vehicleId: "VH-7E003", category: "设计/方案问题", title: "前舱支架装配孔位偏差 1.8mm（横展）", severity: "高", status: "rectifying", owner: "张工", dueAt: "07-20", action: "横展自查：同批支架定位孔复检", sourceIssueNo: "QI-2026-0718-03" },
    ],
  });

  // Integration systems
  await prisma.integrationSystem.createMany({
    data: [
      { name: "TOCC 二期", purpose: "需求、WBS、车辆主档与状态回写", status: "healthy", latency: "182ms", success: "99.6%", lastSync: "2 分钟前" },
      { name: "SAP", purpose: "物料主数据与改制 BOM", status: "healthy", latency: "236ms", success: "99.1%", lastSync: "8 分钟前" },
      { name: "LES", purpose: "库存、齐套、配送与车间接收", status: "warning", latency: "1.8s", success: "96.4%", lastSync: "12 分钟前" },
    ],
  });

  // Integration logs
  await prisma.integrationLog.createMany({
    data: [
      { system: "TOCC 二期", interfaceKey: "车辆主档增量同步", businessKey: "GEELY-VH-7E003", direction: "接收", status: "healthy", message: "车辆状态与项目 WBS 同步成功" },
      { system: "LES", interfaceKey: "齐套状态查询", businessKey: "PRJ-2026-SM-017", direction: "接收", status: "warning", message: "1 项调拨件预计到料时间发生变化" },
      { system: "SAP", interfaceKey: "物料主数据同步", businessKey: "6601200U7300", direction: "接收", status: "healthy", message: "名称、规格与状态同步成功" },
      { system: "TOCC 二期", interfaceKey: "任务执行状态回写", businessKey: "RT-2026-0718-E8-01", direction: "发送", status: "healthy", message: "装配阶段状态回写成功" },
    ],
  });

  // Vehicle timeline
  await prisma.vehicleTimelineEvent.createMany({
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

  // Workshop state
  await prisma.workshopState.create({
    data: {
      id: "singleton",
      activeVersion: "V3.0",
      versionFrozen: false,
      workshopPaused: false,
      checkpointsDone: 9,
      checkpointsTotal: 12,
      scanCount: 4,
    },
  });

  // Work logs
  await prisma.workLog.createMany({
    data: [
      { time: "14:22", title: "装配阶段报工", detail: "前舱支架完成，进入质量点检", sort: 0 },
      { time: "13:56", title: "异常反馈", detail: "孔位偏差 1.8mm，生成 QI-2026-0718-03", sort: 1 },
      { time: "10:12", title: "扫码装车", detail: "线束 SN-LR-260718-01 绑定车辆", sort: 2 },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
