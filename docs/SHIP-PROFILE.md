# SHIP-PROFILE — 吉利试制样车改制数字化平台发版档案

## 构建与静态检查

- 类型检查：`npm run typecheck`
- Lint：`npm run lint`
- 构建：`npm run build`

## 测试矩阵（全绿定义，任一失败禁止发版）

| 层 | 命令 | 覆盖内容 |
|----|------|----------|
| L1 单测 | `npm test` | 状态、指标和业务规则工具函数 |
| L2 类型检查 | `npm run typecheck` | TypeScript 全量类型 |
| L3 构建 | `npm run build` | Next.js 生产构建与路由生成 |
| L4 UI 冒烟 | `npm run e2e` 或本机 Chrome 手动检查 | 驾驶舱、任务、评审、排产、物料、工位、质量、一车一档、接口中心；Playwright 使用系统 Chrome，不要求下载浏览器 |

## 测试环境

- 部署命令：本地执行 `bash deploy/push-test.sh`
- 地址：`https://word.linklike.com.cn/jili/dashboard`
- 服务器目录：`/root/0719jili`
- PM2：`jili-demo`，内部端口 `3006`
- 冒烟方式：先检查 `http://127.0.0.1:3006/jili/dashboard`，再从公网地址走驾驶舱→项目详情→评审→排产→工位→质量→一车一档
- 部署文档：`deploy/push-test.sh`、`deploy/deploy-test.sh`

## 生产环境

- 发版前确认：TODO
- 发版命令/流程：TODO
- 地址：TODO
- 数据写操作备份方式：接入 MySQL 后必须先执行 `mysqldump`
- 部署文档：TODO

## GitHub

- 远程/分支：`git@github.com:wangpeng1017/0719jili.git` / `main`
- 排除目录：`work/`、`.next/`、`node_modules/`、`coverage/`

## 文档同步清单

- `docs/PRD.md`
- `docs/REQUIREMENTS-ANALYSIS.md`
- `PROJECT_INDEX.md`
- `docs/_INDEX.md`
