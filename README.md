# 吉利试制样车改制数字化平台

面向客户汇报的试制样车改制轻量 MES 演示系统，以车辆 UID 贯通需求、方案评审、开工门禁、排产、物料、现场执行、质量闭环、交付和一车一档。

## 技术栈

- Next.js 15 App Router
- React 18 + TypeScript
- Ant Design 5
- Prisma 5（目标 MySQL 数据模型；当前汇报版使用一致性演示数据）
- Jest + Playwright

## 本地运行

```bash
npm install
npm run dev
```

访问：`http://localhost:3000`

## 验证

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Playwright 配置使用本机已安装的 Google Chrome，不要求下载 Chromium：

```bash
npm run e2e
```

## 客户汇报主路径

1. `/dashboard` 管理驾驶舱
2. `/projects/PRJ-2026-SM-017` 重点项目与六项开工门禁
3. `/review` 方案 V4.0 评审与冻结
4. `/schedule` 举升机资源冲突与插单建议
5. `/materials` 四类物料齐套和拆车件容器
6. `/workshop` 数字工位扫码、点检和报工
7. `/quality` 质量问题复验关闭
8. `/vehicles/VH-7E001` 一车一档
9. `/integrations` TOCC、SAP、LES 集成中心

## 测试环境

- 地址：`https://word.linklike.com.cn/jili/dashboard`
- 服务器目录：`/root/0719jili`
- PM2 进程：`jili-demo`
- 内部端口：`3006`
- 本地一键发布：`bash deploy/push-test.sh`
- 服务器构建脚本：`deploy/deploy-test.sh`（自动备份并补充 `/jili/` Nginx location）

产品范围与需求证据见 [docs/PRD.md](docs/PRD.md) 和 [docs/REQUIREMENTS-ANALYSIS.md](docs/REQUIREMENTS-ANALYSIS.md)。
