import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean all tables
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
      { issueNo: "QI-2026-0718-03", projectId: prj1.id, vehicleId: "VH-7E001", category: "设计/方案问题", title: "前舱支架装配孔位偏差 1.8mm", severity: "高", status: "rectifying", owner: "张工", dueAt: "今天 18:00", action: "调整支架定位孔并横展同批 5 台车" },
      { issueNo: "QI-2026-0717-11", projectId: prj1.id, vehicleId: "VH-7E001", category: "制成问题", title: "线束卡扣未按冻结版工艺卡安装", severity: "中", status: "verifying", owner: "总装一班", dueAt: "07-19", action: "已返工，等待质量复验" },
      { issueNo: "QI-2026-0716-08", projectId: prj1.id, vehicleId: "VH-7E002", category: "供应件问题", title: "调拨件标签与实物批次不一致", severity: "中", status: "closed", owner: "物料组", dueAt: "07-18", action: "LES 对账完成，重新打印批次标签" },
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
