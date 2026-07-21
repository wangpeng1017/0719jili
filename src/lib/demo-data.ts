export const mainProjectId = "PRJ-2026-SM-017";
export const mainVehicleId = "VH-7E001";

export const projects = [
  {
    id: mainProjectId,
    wbs: "WBS-SM-26-0718",
    name: "银河 E8 智驾验证车改制",
    type: "SM 改制",
    owner: "王欣",
    workshop: "管理车间",
    vehicles: 6,
    progress: 68,
    readiness: 92,
    risk: "物料风险",
    status: "in_progress",
    promisedAt: "07-25",
  },
  {
    id: "PRJ-2026-BODY-009",
    wbs: "WBS-BD-26-0709",
    name: "EX5 车身开孔与加强件试制",
    type: "车身改制",
    owner: "李徐燕",
    workshop: "钣金车间",
    vehicles: 2,
    progress: 42,
    readiness: 100,
    risk: "进度风险",
    status: "in_progress",
    promisedAt: "07-28",
  },
  {
    id: "PRJ-2026-ZX-031",
    wbs: "WBS-ZX-26-0731",
    name: "领克 900 零星换件任务",
    type: "零星改制",
    owner: "叶剑华",
    workshop: "准备车间",
    vehicles: 3,
    progress: 86,
    readiness: 100,
    risk: "正常",
    status: "in_progress",
    promisedAt: "07-21",
  },
  {
    id: "PRJ-2026-DEV-006",
    wbs: "WBS-DV-26-0706",
    name: "热管理支架及工装开发",
    type: "开发任务",
    owner: "单鑫磊",
    workshop: "零部件区",
    vehicles: 1,
    progress: 31,
    readiness: 74,
    risk: "验收风险",
    status: "preparing",
    promisedAt: "08-02",
  },
];

export const vehicles = [
  {
    id: mainVehicleId,
    uid: "GEELY-VH-7E001",
    vin: "L6T79L2Z9SG000317",
    prototypeNo: "E8-SM-017-01",
    model: "银河 E8",
    config: "800V 四驱智驾验证版",
    source: "TOCC 二期",
    location: "管理车间 · 举升机 L1",
    stage: "装配",
    status: "in_progress",
    progress: 71,
  },
  {
    id: "VH-7E002",
    uid: "GEELY-VH-7E002",
    vin: "L6T79L2Z0SG000318",
    prototypeNo: "E8-SM-017-02",
    model: "银河 E8",
    config: "800V 四驱智驾验证版",
    source: "TOCC 二期",
    location: "准备车间 · 待上线",
    stage: "准备确认",
    status: "scheduled",
    progress: 35,
  },
  {
    id: "VH-7E003",
    uid: "GEELY-VH-7E003",
    vin: "L6T79L2Z2SG000319",
    prototypeNo: "E8-SM-017-03",
    model: "银河 E8",
    config: "800V 后驱验证版",
    source: "TOCC 二期",
    location: "线边暂存区",
    stage: "物料等待",
    status: "blocked",
    progress: 28,
  },
];

export const gates = [
  { key: "vehicle", name: "车辆到位", detail: "VIN、TOCC ID、准入状态一致", passed: true },
  { key: "solution", name: "方案冻结", detail: "执行依据 V3.0 已冻结", passed: true },
  { key: "document", name: "文件可用", detail: "工艺卡与质量文件已发布", passed: true },
  { key: "material", name: "物料齐套", detail: "1 项调拨件预计 7/19 到货", passed: false },
  { key: "resource", name: "资源可用", detail: "L1、总装一班、下午班次已锁定", passed: true },
  { key: "quality", name: "质量策划", detail: "12 项点检与首台门禁已配置", passed: true },
];

export const reviewPages = [
  { page: 1, title: "项目与车辆范围", owner: "试制策划", status: "passed", comments: 0 },
  { page: 2, title: "改制目的与范围", owner: "工艺工程师", status: "passed", comments: 0 },
  { page: 3, title: "拆换件清单", owner: "物料专员", status: "reviewing", comments: 2 },
  { page: 4, title: "风险与质量控制点", owner: "质量工程师", status: "passed", comments: 0 },
  { page: 5, title: "计划窗口与资源", owner: "生产平衡", status: "reviewing", comments: 1 },
  { page: 6, title: "软件刷写与验收", owner: "电气工程师", status: "passed", comments: 0 },
];

export const scheduleRows = [
  { workshop: "管理车间", resource: "举升机 L1", am: "E8-01 拆解", pm: "E8-01 装配", ev: "空闲", status: "healthy" },
  { workshop: "管理车间", resource: "举升机 L2", am: "领克900 首台", pm: "领克900 首台", ev: "空闲", status: "healthy" },
  { workshop: "准备车间", resource: "举升机 L1", am: "E8-02 准备", pm: "空闲", ev: "空闲", status: "healthy" },
  { workshop: "准备车间", resource: "举升机 L2", am: "EX5 工装测量", pm: "E8-03 插单", ev: "空闲", status: "warning" },
  { workshop: "钣金车间", resource: "举升机 L1", am: "EX5 切割", pm: "EX5 焊接", ev: "EX5 续作", status: "healthy" },
  { workshop: "钣金车间", resource: "举升机 L2", am: "维护", pm: "维护", ev: "空闲", status: "blocked" },
];

export const materials = [
  { code: "6601200U7300", name: "前舱感知支架总成", type: "标准件", required: 6, ready: 6, readiness: 100, eta: "已到线边", status: "ready" },
  { code: "8882001U9000", name: "激光雷达线束", type: "调拨件", required: 6, ready: 5, readiness: 83, eta: "07-19 10:30", status: "in_transit" },
  { code: "DEV-BRKT-017", name: "热管理控制器支架", type: "新开件", required: 6, ready: 6, readiness: 100, eta: "已验收", status: "ready" },
  { code: "REM-E8-0317", name: "原车前防撞梁组件", type: "拆车件", required: 1, ready: 1, readiness: 100, eta: "待回装 · 箱 CT-017", status: "ready" },
  { code: "6605104U7300", name: "毫米波雷达固定件", type: "标准件", required: 12, ready: 12, readiness: 100, eta: "已到线边", status: "ready" },
];

export const qualityIssues = [
  { id: "QI-2026-0718-03", title: "前舱支架装配孔位偏差 1.8mm", category: "设计/方案问题", vehicle: "E8-SM-017-01", severity: "高", owner: "张工", due: "今天 18:00", status: "rectifying", action: "调整支架定位孔并横展同批 5 台车", horizontal: true, sourceIssueNo: "" },
  { id: "QI-2026-0717-11", title: "线束卡扣未按冻结版工艺卡安装", category: "制成问题", vehicle: "E8-SM-017-01", severity: "中", owner: "总装一班", due: "07-19", status: "verifying", action: "已返工，等待质量复验", horizontal: false, sourceIssueNo: "" },
  { id: "QI-2026-0716-08", title: "调拨件标签与实物批次不一致", category: "供应件问题", vehicle: "E8-SM-017-02", severity: "中", owner: "物料组", due: "07-18", status: "closed", action: "LES 对账完成，重新打印批次标签", horizontal: false, sourceIssueNo: "" },
  { id: "QI-2026-0718-03-HX2", title: "前舱支架装配孔位偏差 1.8mm（横展）", category: "设计/方案问题", vehicle: "E8-SM-017-02", severity: "高", owner: "张工", due: "07-20", status: "rectifying", action: "横展自查：同批支架定位孔复检", horizontal: false, sourceIssueNo: "QI-2026-0718-03" },
  { id: "QI-2026-0718-03-HX3", title: "前舱支架装配孔位偏差 1.8mm（横展）", category: "设计/方案问题", vehicle: "E8-SM-017-03", severity: "高", owner: "张工", due: "07-20", status: "rectifying", action: "横展自查：同批支架定位孔复检", horizontal: false, sourceIssueNo: "QI-2026-0718-03" },
];

export const integrationSystems = [
  { name: "TOCC 二期", purpose: "需求、WBS、车辆主档与状态回写", status: "healthy", latency: "182ms", success: "99.6%", lastSync: "2 分钟前" },
  { name: "SAP", purpose: "物料主数据与改制 BOM", status: "healthy", latency: "236ms", success: "99.1%", lastSync: "8 分钟前" },
  { name: "LES", purpose: "库存、齐套、配送与车间接收", status: "warning", latency: "1.8s", success: "96.4%", lastSync: "12 分钟前" },
];

export const vehicleTimeline = [
  { time: "07-18 14:22", title: "装配阶段报工", detail: "总装一班完成前舱支架装配，进入质量点检", color: "blue" },
  { time: "07-18 13:56", title: "质量问题 QI-0718-03", detail: "发现孔位偏差 1.8mm，已分派张工处理", color: "red" },
  { time: "07-18 10:12", title: "扫码装车", detail: "激光雷达线束 SN-LR-260718-01 绑定车辆", color: "green" },
  { time: "07-18 08:31", title: "装配阶段开工", detail: "人员、文件、物料、工装、设备点检通过", color: "blue" },
  { time: "07-17 17:40", title: "拆解阶段完成", detail: "原车前防撞梁组件绑定箱 CT-017，状态待回装", color: "green" },
  { time: "07-16 16:20", title: "方案 V3.0 冻结", detail: "页级评审全部关闭，发布为现场执行依据", color: "cyan" },
  { time: "07-15 09:05", title: "TOCC 需求受理", detail: "WBS-SM-26-0718，车辆主档校验通过", color: "gray" },
];

export const processRoutes = [
  {
    id: "GY-E8-017-ZP",
    name: "前舱感知支架装配工艺路线",
    stage: "装配",
    version: "V2.0",
    status: "frozen",
    author: "车身工艺 · 张工",
    project: "银河 E8 智驾验证车改制",
    operations: [
      {
        id: "OP-ZP-010", seq: 10, name: "拆卸原车前防撞梁", workCenter: "管理车间 L1", standardMinutes: 45, isKey: false, status: "completed", assignee: "陈师傅", startedAt: "2026-07-18T08:30:00.000Z", finishedAt: "2026-07-18T09:15:00.000Z",
        instructions: [
          { seq: 1, step: "举升车辆并确认安全锁止", torqueSpec: "", tooling: "举升机 L1", qualityReq: "安全锁止到位" },
          { seq: 2, step: "拆卸前防撞梁 4 颗连接螺栓", torqueSpec: "拆卸 25 N·m", tooling: "气动扳手", qualityReq: "螺栓分类存放" },
          { seq: 3, step: "总成入箱 CT-017，打印并粘贴箱码", torqueSpec: "", tooling: "扫码枪", qualityReq: "箱码与实物一致" },
        ],
      },
      {
        id: "OP-ZP-020", seq: 20, name: "安装感知支架总成", workCenter: "管理车间 L1", standardMinutes: 60, isKey: true, status: "in_progress", assignee: "陈师傅", startedAt: "2026-07-18T09:20:00.000Z", finishedAt: "",
        instructions: [
          { seq: 1, step: "核对支架总成物料码 6601200U7300 与批次", torqueSpec: "", tooling: "扫码枪", qualityReq: "物料码与冻结 BOM 一致" },
          { seq: 2, step: "支架定位孔对位，预紧 4 颗 M8 螺栓", torqueSpec: "预紧 12 N·m", tooling: "定扭扳手", qualityReq: "孔位偏差 ≤0.5mm" },
          { seq: 3, step: "按对角顺序复紧至标准扭矩", torqueSpec: "复紧 25 N·m", tooling: "定扭扳手", qualityReq: "扭矩 100% 记录" },
          { seq: 4, step: "粘贴支架合格标识并拍照上传", torqueSpec: "", tooling: "", qualityReq: "照片存入一车一档" },
        ],
      },
      {
        id: "OP-ZP-030", seq: 30, name: "激光雷达线束敷设与接插", workCenter: "管理车间 L1", standardMinutes: 50, isKey: true, status: "pending", assignee: "", startedAt: "", finishedAt: "",
        instructions: [
          { seq: 1, step: "核对线束 8882001U9000 批次与走向", torqueSpec: "", tooling: "扫码枪", qualityReq: "与冻结工艺卡一致" },
          { seq: 2, step: "按卡扣点位敷设线束，禁止强行弯折", torqueSpec: "", tooling: "", qualityReq: "卡扣 100% 到位" },
          { seq: 3, step: "接插件对接并锁止，确认防呆到位", torqueSpec: "", tooling: "", qualityReq: "锁止声确认" },
        ],
      },
      {
        id: "OP-ZP-040", seq: 40, name: "扭矩复紧与自检", workCenter: "管理车间 L1", standardMinutes: 30, isKey: false, status: "pending", assignee: "", startedAt: "", finishedAt: "",
        instructions: [
          { seq: 1, step: "对支架与线束全部扭矩点复紧确认", torqueSpec: "25 N·m", tooling: "定扭扳手", qualityReq: "复紧 100% 记录" },
          { seq: 2, step: "自检支架装配面差与间隙", torqueSpec: "", tooling: "塞尺", qualityReq: "面差 ≤1.0mm" },
          { seq: 3, step: "填写自检记录并提交质量点检", torqueSpec: "", tooling: "", qualityReq: "记录提交质量工程师" },
        ],
      },
    ],
  },
  {
    id: "GY-E8-017-CJ",
    name: "前舱拆解工艺路线",
    stage: "拆解",
    version: "V1.0",
    status: "frozen",
    author: "总装工艺 · 叶工",
    project: "银河 E8 智驾验证车改制",
    operations: [
      { id: "OP-CJ-010", seq: 10, name: "举升与安全防护", workCenter: "管理车间 L1", standardMinutes: 20, isKey: false, status: "completed", assignee: "叶师傅", startedAt: "2026-07-17T14:00:00.000Z", finishedAt: "2026-07-17T14:20:00.000Z", instructions: [{ seq: 1, step: "举升车辆并确认安全锁止", torqueSpec: "", tooling: "举升机 L1", qualityReq: "安全锁止到位" }] },
      { id: "OP-CJ-020", seq: 20, name: "前舱附件拆卸", workCenter: "管理车间 L1", standardMinutes: 60, isKey: true, status: "completed", assignee: "叶师傅", startedAt: "2026-07-17T14:25:00.000Z", finishedAt: "2026-07-17T15:25:00.000Z", instructions: [{ seq: 1, step: "按拆解清单顺序拆卸前舱附件", torqueSpec: "", tooling: "气动扳手", qualityReq: "与冻结拆解清单一致" }] },
      { id: "OP-CJ-030", seq: 30, name: "拆解件分类入箱", workCenter: "管理车间 L1", standardMinutes: 40, isKey: false, status: "completed", assignee: "叶师傅", startedAt: "2026-07-17T15:30:00.000Z", finishedAt: "2026-07-17T16:05:00.000Z", instructions: [{ seq: 1, step: "拆解件按复用/报废分类入箱并扫码", torqueSpec: "", tooling: "扫码枪", qualityReq: "复用件与报废件不混装" }] },
    ],
  },
  {
    id: "GY-DEV-006-ZP",
    name: "热管理支架装配工艺路线",
    stage: "装配",
    version: "V0.9",
    status: "reviewing",
    author: "零部件工艺 · 单工",
    project: "热管理支架及工装开发",
    operations: [
      { id: "OP-DEV-010", seq: 10, name: "支架来料核对", workCenter: "零部件区", standardMinutes: 15, isKey: false, status: "pending", assignee: "", startedAt: "", finishedAt: "", instructions: [{ seq: 1, step: "核对来料支架尺寸与材质报告", torqueSpec: "", tooling: "卡尺", qualityReq: "与 3D 数模一致" }] },
      { id: "OP-DEV-020", seq: 20, name: "支架试装与测量", workCenter: "零部件区", standardMinutes: 40, isKey: true, status: "pending", assignee: "", startedAt: "", finishedAt: "", instructions: [{ seq: 1, step: "支架试装并测量装配间隙", torqueSpec: "", tooling: "三坐标", qualityReq: "间隙 0.5~1.5mm" }] },
    ],
  },
];

export const workReports = [
  { id: "WR-001", opNo: "OP-ZP-010", routeNo: "GY-E8-017-ZP", vehicleId: "VH-7E001", operator: "陈师傅", measured: "拆卸扭矩 25.1 N·m", result: "passed", note: "螺栓分类入箱 CT-017，箱码已扫码绑定", reportedAt: "2026-07-18T09:15:00.000Z" },
  { id: "WR-002", opNo: "OP-CJ-030", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "拆解件复用/报废分类入箱并扫码", reportedAt: "2026-07-17T16:05:00.000Z" },
  { id: "WR-003", opNo: "OP-CJ-020", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "前舱附件按冻结拆解清单拆卸完成", reportedAt: "2026-07-17T15:25:00.000Z" },
  { id: "WR-004", opNo: "OP-CJ-010", routeNo: "GY-E8-017-CJ", vehicleId: "VH-7E001", operator: "叶师傅", measured: "", result: "passed", note: "举升安全锁止确认到位", reportedAt: "2026-07-17T14:20:00.000Z" },
];

export const inspectionTemplates = [
  {
    id: "QP-E8-017-ZP",
    name: "前舱感知支架装配质量检验规程",
    opNo: "OP-ZP-020",
    status: "released",
    author: "质量工程师 · 周工",
    items: [
      { seq: 1, checkPoint: "支架定位孔位偏差", method: "三坐标", spec: "≤0.5mm" },
      { seq: 2, checkPoint: "支架装配面差", method: "塞尺", spec: "≤1.0mm" },
      { seq: 3, checkPoint: "复紧扭矩", method: "定扭扳手", spec: "25±2 N·m" },
      { seq: 4, checkPoint: "线束卡扣到位率", method: "目视/手检", spec: "100%" },
    ],
  },
  {
    id: "QP-E8-017-CJ",
    name: "前舱拆解质量检验规程",
    opNo: "OP-CJ-020",
    status: "released",
    author: "质量工程师 · 周工",
    items: [
      { seq: 1, checkPoint: "拆解件与清单一致性", method: "扫码核对", spec: "100%" },
      { seq: 2, checkPoint: "复用件防护状态", method: "目视", spec: "无损伤" },
    ],
  },
];

export const inspectionRecords = [
  {
    id: "IR-001",
    templateNo: "QP-E8-017-CJ",
    vehicleId: "VH-7E001",
    inspector: "叶师傅",
    result: "passed",
    inspectedAt: "2026-07-17T16:20:00.000Z",
    items: [
      { seq: 1, checkPoint: "拆解件与清单一致性", spec: "100%", measured: "12/12 一致", judged: "passed" },
      { seq: 2, checkPoint: "复用件防护状态", spec: "无损伤", measured: "防护完好", judged: "passed" },
    ],
  },
];

