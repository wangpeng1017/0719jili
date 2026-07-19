# PROJECT_INDEX.md — 吉利试制样车改制数字化平台项目地图

> 维护策略：不做严格同步，大版本手动刷新；过期时以真实代码为准。

## 1. 项目一句话

面向吉利试制样车改制业务的轻量 MES 演示系统，以车辆 UID 贯通需求、方案、排产、物料、执行、质量、交付和一车一档。

## 2. 技术栈

| 层 | 选型 |
|----|------|
| 全栈框架 | Next.js 15.1 App Router |
| UI | React 18 + Ant Design 5 + 自定义工业驾驶舱样式 |
| 类型/校验 | TypeScript 5 + Zod 4 |
| 数据层 | 演示数据；目标 Prisma 5 + MySQL |
| 测试 | Jest + TypeScript + 浏览器业务冒烟 |
| 部署 | Next.js Standalone；正式环境待确认 |

## 3. 核心业务链路

```mermaid
flowchart LR
  A[需求/WBS] --> B[项目/车辆]
  B --> C[方案评审冻结]
  C --> D[六项开工门禁]
  D --> E[排产与资源]
  E --> F[工位扫码执行]
  F --> G[质量闭环]
  G --> H[交付包]
  H --> I[一车一档/TOCC回写]
```

关键不变量：

- 所有执行、物料、质量和交付证据必须能回到明确车辆 UID 与方案冻结版本。
- 未关闭评审意见不可冻结；六项门禁未通过不可开工；质量问题未关闭或未让步不可交付。
- 人工调整排程必须保留调整前后、操作人、时间和原因。

## 4. 目录结构

```text
src/app/(platform)/     客户演示页面
src/components/         平台壳、状态与业务组件
src/lib/                演示数据、业务规则、格式化工具
prisma/schema.prisma    目标数据模型
docs/PRD.md             功能范围与验收标准
docs/REQUIREMENTS-ANALYSIS.md 需求证据与业务结论
```

## 5. 功能域地图

| 功能域 | 页面 | 业务规则/数据 |
|--------|------|---------------|
| 驾驶舱 | `/dashboard` | KPI、风险、项目、资源、质量 |
| 项目任务 | `/projects` `/projects/[id]` | 项目/车辆/阶段/门禁 |
| 方案评审 | `/review` | 版本、意见、冻结规则 |
| 排产 | `/schedule` | 车间/举升机/班次/冲突 |
| 物料 | `/materials` | 四类物料、齐套、拆车件容器 |
| 工位执行 | `/workshop` | 开工门禁、扫码、点检、报工 |
| 质量 | `/quality` | 问题、整改、复验、横展、让步 |
| 一车一档 | `/vehicles/[id]` | 全链路履历和交付包 |
| 集成 | `/integrations` | TOCC/SAP/LES 状态与日志 |

## 6. 文档指针

- `docs/PRD.md`
- `docs/REQUIREMENTS-ANALYSIS.md`
- `docs/SHIP-PROFILE.md`
- `docs/_INDEX.md`
