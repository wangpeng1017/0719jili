# 吉利试制样车改制数字化项目

## 项目定位

面向吉利试制样车改制数字化项目，建设覆盖需求、方案评审、排产、现场执行、物料、质量、交付和一车一档的演示型业务系统，同时持续维护解决方案 PPT 与招标技术要求书。

## 技术与产物

- 主要产物：PowerPoint（`.pptx`）、Word（`.docx`）
- 内容与版式源文件：Markdown、SVG、PNG/JPG
- 自动化工具：Python、`python-docx`、PPTX/SVG 处理脚本
- Web 演示系统：Next.js 15 App Router、React 18、TypeScript、Ant Design 5
- 目标生产架构：以招标技术要求书最终确认口径为准；当前演示版不代表客户生产技术选型
- 最终交付目录：`交付文件/`
- 可再生成的中间目录：`work/`

## 项目专属规则

1. 每次交付迭代必须升版本号，保留上一版本，禁止覆盖历史交付物。
2. 修改 PPT/DOCX 后必须执行结构、溢出和渲染校验；不能只以脚本运行成功作为完成标准。
3. PPT 文本溢出校验需正确处理 group 的 `chOff/chExt` 坐标缩放，避免误判。
4. 最终文件只放入 `交付文件/`；解包、渲染、修复和验证过程文件放入 `work/` 或对应工作目录。
5. Office 生成的 `~$` 临时锁文件不得作为交付物或提交到 Git。
6. 修改前优先读取现有最高版本及对应源材料，保持业务口径、设计规范和版本链连续。

## 常用入口

- 项目地图：`PROJECT_INDEX.md`
- 产品需求：`docs/PRD.md`
- 深度需求分析：`docs/REQUIREMENTS-ANALYSIS.md`
- 发版档案：`docs/SHIP-PROFILE.md`
- Word 技术要求书生成脚本：`build_technical_requirements.py`
- PPT 方案源工程：`geely-retrofit-digital-solution_ppt169_20260626/`
- PPT 修订工程：`jili-v11-pptmaster-fix_ppt169_20260707/`
- 方案设计规范：`geely-retrofit-digital-solution_ppt169_20260626/design_spec.md`
- 最终交付：`交付文件/`

## Web 系统规则

1. 业务状态、按钮反馈和异常信息全部中文化，不向客户展示裸英文状态值。
2. 生命周期类功能必须同时检查列表、详情、操作入口、看板和一车一档是否同步。
3. 演示数据必须围绕同一组项目、车辆、方案版本、物料和质量问题保持一致，禁止页面间口径冲突。
4. Prisma 模型变更前先核对 `prisma/schema.prisma`；后续接入数据库时必须使用迁移，不得只改模型。
5. 当前阶段优先保证客户汇报业务闭环、浏览器稳定性和视觉完成度；测试环境已确定，生产环境仍未确定。

## 部署规则（最高优先级）

- 本地目录：`/Users/wangpeng/Downloads/0626 jili`
- 阿里云测试目录：`/root/0719jili`
- 测试地址：`http://jili.8.130.182.148.nip.io`
- 内部端口：`3006`
- PM2 进程：`jili-demo`
- 发版命令：本地执行 `bash deploy/push-test.sh`（Git 归档 + SCP + 服务器构建）
- 禁止覆盖或复用服务器上现有的 `lims-next`、`npi-demo`、`guanwu-system` 等目录与进程。
