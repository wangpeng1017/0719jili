"use client";

import { CalendarOutlined, PlusOutlined, ReloadOutlined, ThunderboltOutlined, WarningOutlined } from "@ant-design/icons";
import { Alert, App, Button, DatePicker, Descriptions, Drawer, Input, Modal, Progress, Segmented, Select, Space, Table, Tag, Timeline } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type ScheduleShift } from "@/lib/demo-store";

const DEMO_DATE = "2026-07-18";

const CONSTRAINT_RULES = [
  { key: "material", name: "物料齐套约束", description: "排产任务开工前物料齐套率须 ≥ 100%，调拨件须确认 ETA", level: "硬约束" },
  { key: "solution", name: "方案冻结约束", description: "执行依据须为已冻结版本，未冻结方案不可排入生产", level: "硬约束" },
  { key: "resource", name: "资源互斥约束", description: "同一举升机/工位同一班次不可安排两个任务", level: "硬约束" },
  { key: "quality", name: "质量门禁约束", description: "上道工序质量点检未通过，下道工序不可开工", level: "硬约束" },
  { key: "skill", name: "人员技能约束", description: "关键工序须持有对应资质证书的人员执行", level: "软约束" },
  { key: "delivery", name: "交付窗口约束", description: "排产完成时间不得超过项目承诺交付日期", level: "硬约束" },
  { key: "priority", name: "优先级约束", description: "插单优先级高于常规排产，但不可违反硬约束", level: "软约束" },
];

const WEEK_PLAN = [
  { day: "周一 07-14", tasks: ["E8-01 拆解", "EX5 切割", "领克900 准备"], utilization: 78 },
  { day: "周二 07-15", tasks: ["E8-01 准备确认", "EX5 焊接", "领克900 首台"], utilization: 82 },
  { day: "周三 07-16", tasks: ["E8-01 方案冻结", "EX5 续作", "领克900 首台"], utilization: 75 },
  { day: "周四 07-17", tasks: ["E8-01 拆解完成", "EX5 工装测量", "E8-02 准备"], utilization: 88 },
  { day: "周五 07-18", tasks: ["E8-01 装配", "E8-03 插单", "领克900 首台"], utilization: 91 },
  { day: "周六 07-19", tasks: ["E8-01 质量点检", "E8-02 上线", "EX5 验收"], utilization: 65 },
  { day: "周日 07-20", tasks: ["设备维护", "场地整理"], utilization: 22 },
];

const MONTH_PLAN = [
  { week: "第 1 周 (07-01~07-06)", projects: 3, vehicles: 8, utilization: 72, risk: "正常" },
  { week: "第 2 周 (07-07~07-13)", projects: 4, vehicles: 10, utilization: 81, risk: "正常" },
  { week: "第 3 周 (07-14~07-20)", projects: 4, vehicles: 12, utilization: 88, risk: "物料风险" },
  { week: "第 4 周 (07-21~07-27)", projects: 3, vehicles: 9, utilization: 76, risk: "进度风险" },
  { week: "第 5 周 (07-28~08-02)", projects: 2, vehicles: 5, utilization: 58, risk: "正常" },
];

export default function SchedulePage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const [selected, setSelected] = useState<{ workshop: string; resource: string; shift: ScheduleShift; task: string } | null>(null);
  const [adjustDraft, setAdjustDraft] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [view, setView] = useState<string | number>("日");
  const [date, setDate] = useState<Dayjs>(dayjs(DEMO_DATE));
  const [insertModalOpen, setInsertModalOpen] = useState(false);
  const [insertForm, setInsertForm] = useState({ workshop: "管理车间", resource: "举升机 L1", shift: "am" as ScheduleShift, task: "", priority: "紧急", reason: "" });
  const [constraintModalOpen, setConstraintModalOpen] = useState(false);

  const hasConflict = state.scheduleRows.some((row) => row.status === "warning");
  const onDemoDate = date.format("YYYY-MM-DD") === DEMO_DATE;

  const constraintStatus = useMemo(() => {
    const materialReady = state.materials.every((m) => m.readiness >= 100);
    const solutionFrozen = state.versionFrozen || state.activeVersion === "V3.0";
    const resourceConflict = state.scheduleRows.some((r) => r.status === "warning");
    const qualityPassed = state.gates.find((g) => g.key === "quality")?.passed ?? true;
    return [
      { key: "material", name: "物料齐套约束", passed: materialReady, detail: materialReady ? "全部物料齐套率 100%" : "1 项调拨件未到齐（83%）" },
      { key: "solution", name: "方案冻结约束", passed: solutionFrozen, detail: solutionFrozen ? `执行依据 ${state.activeVersion} 已冻结` : "方案未冻结" },
      { key: "resource", name: "资源互斥约束", passed: !resourceConflict, detail: resourceConflict ? "准备车间 L2 下午班存在冲突" : "无资源冲突" },
      { key: "quality", name: "质量门禁约束", passed: qualityPassed, detail: qualityPassed ? "质量策划门禁已通过" : "质量门禁未通过" },
      { key: "skill", name: "人员技能约束", passed: true, detail: "关键工序人员资质校验通过" },
      { key: "delivery", name: "交付窗口约束", passed: true, detail: "当前排产均在承诺交付日期内" },
      { key: "priority", name: "优先级约束", passed: true, detail: "无优先级冲突" },
    ];
  }, [state.materials, state.versionFrozen, state.activeVersion, state.scheduleRows, state.gates]);

  const openSlot = (workshop: string, resource: string, shift: ScheduleShift, task: string) => {
    setSelected({ workshop, resource, shift, task });
    setAdjustDraft(task);
    setAdjustReason("");
  };

  const recalculate = () => {
    if (hasConflict) {
      message.warning("重新计算完成：仍发现 1 项冲突，建议采纳系统方案");
    } else {
      message.success("重新计算完成：未发现新增冲突，排程健康");
    }
  };

  const adoptSuggestion = () => {
    dispatch({ type: "ADOPT_SUGGESTION" });
    message.success("已采纳建议：E8-03 后移至晚上班，冲突已解除，人工调整原因已留痕");
  };

  const autoRecommend = () => {
    dispatch({ type: "AUTO_RECOMMEND" });
    message.success("自动推荐完成：已根据约束规则优化排程，冲突任务后移至可用班次");
  };

  const submitAdjust = () => {
    if (!selected) return;
    dispatch({
      type: "ADJUST_SCHEDULE_SLOT",
      payload: { workshop: selected.workshop, resource: selected.resource, shift: selected.shift, task: adjustDraft, reason: adjustReason || "现场人工调整", operator: "王欣" },
    });
    message.success("已完成人工调整，变更前后、操作人和原因已自动留痕");
    setSelected((current) => (current ? { ...current, task: adjustDraft } : current));
  };

  const submitInsert = () => {
    if (!insertForm.task.trim()) {
      message.warning("请填写插单任务名称");
      return;
    }
    dispatch({
      type: "INSERT_ORDER",
      payload: { workshop: insertForm.workshop, resource: insertForm.resource, shift: insertForm.shift, task: insertForm.task, priority: insertForm.priority, reason: insertForm.reason || "紧急插单" },
    });
    message.success(`插单成功：${insertForm.task}【${insertForm.priority}】已排入 ${insertForm.workshop} ${insertForm.resource} ${insertForm.shift.toUpperCase()} 班次`);
    setInsertModalOpen(false);
    setInsertForm({ workshop: "管理车间", resource: "举升机 L1", shift: "am", task: "", priority: "紧急", reason: "" });
  };

  const relatedAdjustments = selected
    ? state.scheduleAdjustments.filter((item) => item.workshop === selected.workshop && item.resource === selected.resource)
    : [];

  const weekColumns = [
    { title: "日期", dataIndex: "day", key: "day", width: 130 },
    { title: "排产任务", dataIndex: "tasks", key: "tasks", render: (tasks: string[]) => <Space wrap size={4}>{tasks.map((t) => <Tag key={t} color="blue">{t}</Tag>)}</Space> },
    { title: "资源利用率", dataIndex: "utilization", key: "utilization", width: 160, render: (v: number) => <Progress percent={v} size="small" status={v > 85 ? "exception" : "normal"} /> },
  ];

  const monthColumns = [
    { title: "周次", dataIndex: "week", key: "week", width: 200 },
    { title: "项目数", dataIndex: "projects", key: "projects", width: 80 },
    { title: "车辆数", dataIndex: "vehicles", key: "vehicles", width: 80 },
    { title: "资源利用率", dataIndex: "utilization", key: "utilization", width: 160, render: (v: number) => <Progress percent={v} size="small" status={v > 85 ? "exception" : "normal"} /> },
    { title: "风险", dataIndex: "risk", key: "risk", width: 100, render: (v: string) => <StatusPill status={v === "正常" ? "healthy" : "warning"} label={v} /> },
  ];

  return (
    <>
      <PageHeader
        title="项目 + 资源双线排产"
        description="按管理、准备、钣金三区域，以 AM / PM / EV 颗粒度统筹车辆窗口、举升机、工位、班组、物料和质量门禁。支持多层级计划、自动推荐、插单与约束校验。"
        actions={
          <Space>
            <DatePicker value={date} onChange={(value) => value && setDate(value)} />
            <Segmented options={["日", "周", "月"]} value={view} onChange={setView} />
            <Button icon={<ThunderboltOutlined />} onClick={autoRecommend}>自动推荐</Button>
            <Button icon={<PlusOutlined />} onClick={() => setInsertModalOpen(true)}>插单</Button>
            <Button type="primary" icon={<ReloadOutlined />} onClick={recalculate}>重新计算</Button>
          </Space>
        }
      />
      {hasConflict && (
        <Alert
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          message="准备车间 L2 下午班存在插单冲突"
          description="EX5 工装测量预计延长 1.5 小时，与 E8-03 临时插单重叠。建议方案：E8-03 后移至晚上班，预计不影响 07-25 交付。"
          action={<Space><Button size="small" onClick={adoptSuggestion}>采纳建议</Button><Button size="small" onClick={autoRecommend}>自动推荐</Button></Space>}
          style={{ marginBottom: 14 }}
        />
      )}

      {/* 约束规则校验面板 */}
      <div style={{ marginBottom: 14 }}>
      <SurfaceCard
        title="约束规则校验"
        subtitle="FR-401~FR-409 排产约束硬控，硬约束不满足时禁止排产"
        extra={<Button size="small" onClick={() => setConstraintModalOpen(true)}>查看规则详情</Button>}
      >
        <Space wrap size={8}>
          {constraintStatus.map((c) => (
            <Tag key={c.key} color={c.passed ? "success" : "error"} title={c.detail}>
              {c.passed ? "✓" : "✗"} {c.name}
            </Tag>
          ))}
        </Space>
      </SurfaceCard>
      </div>

      {view === "日" && (
        <SurfaceCard title="举升机三区域日调度板" subtitle="点击任一班次查看资源、车辆、门禁与人工调整记录" extra={<Tag color="blue"><CalendarOutlined /> {date.format("YYYY-MM-DD")}</Tag>}>
          {!onDemoDate ? (
            <div style={{ padding: "32px 0", textAlign: "center", color: "#718096" }}>该日期暂无排产数据，演示数据当前只覆盖 {DEMO_DATE}。</div>
          ) : (
            <div className="schedule-board">
              <div className="schedule-grid">
                {["车间", "资源", "上午 AM", "下午 PM", "晚上 EV", "状态"].map((head) => <div key={head} className="schedule-cell schedule-head">{head}</div>)}
                {state.scheduleRows.flatMap((row) => {
                  const rowKey = `${row.workshop}-${row.resource}`;
                  return [
                    <div key={`${rowKey}-workshop`} className="schedule-cell"><b>{row.workshop}</b></div>,
                    <div key={`${rowKey}-resource`} className="schedule-cell">{row.resource}</div>,
                    ...(["am", "pm", "ev"] as const).map((shift) => {
                      const task = row[shift];
                      const className = task === "空闲" ? "empty" : task === "维护" ? "maintenance" : "";
                      return <div key={`${rowKey}-${shift}`} className="schedule-cell"><button type="button" className={`schedule-task ${className}`} onClick={() => openSlot(row.workshop, row.resource, shift, task)} style={{ borderTop: 0, borderRight: 0, borderBottom: 0, textAlign: "left" }}>{task}</button></div>;
                    }),
                    <div key={`${rowKey}-status`} className="schedule-cell"><StatusPill status={row.status} /></div>,
                  ];
                })}
              </div>
            </div>
          )}
        </SurfaceCard>
      )}

      {view === "周" && (
        <SurfaceCard title="周排产计划" subtitle="按天汇总排产任务与资源利用率，支持拖拽调整（演示）" extra={<Tag color="blue"><CalendarOutlined /> {date.format("YYYY-MM-DD")} 所在周</Tag>}>
          <Table dataSource={WEEK_PLAN} columns={weekColumns} rowKey="day" pagination={false} size="small" />
        </SurfaceCard>
      )}

      {view === "月" && (
        <SurfaceCard title="月排产计划" subtitle="按周汇总项目数、车辆数、资源利用率与风险等级" extra={<Tag color="blue"><CalendarOutlined /> {date.format("YYYY-MM")}</Tag>}>
          <Table dataSource={MONTH_PLAN} columns={monthColumns} rowKey="week" pagination={false} size="small" />
        </SurfaceCard>
      )}

      {/* 调整记录 */}
      {state.scheduleAdjustments.length > 0 && (
        <div style={{ marginTop: 14 }}>
        <SurfaceCard title="排产调整记录" subtitle="所有人工调整与系统推荐均自动留痕">
          <Timeline
            items={state.scheduleAdjustments.slice(0, 8).map((item) => ({
              children: <div><b>{item.workshop} · {item.resource} · {item.shift.toUpperCase()}</b>：{item.before} → {item.after}<div style={{ fontSize: 12, color: "#718096" }}>{item.time} · {item.operator} · {item.reason}</div></div>,
            }))}
          />
        </SurfaceCard>
        </div>
      )}

      {/* 资源槽详情抽屉 */}
      <Drawer title="资源槽详情" width={420} open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div><div className="section-subtitle">车间 / 资源</div><b>{selected.workshop} · {selected.resource}</b></div>
            <div><div className="section-subtitle">班次</div><b>{selected.shift.toUpperCase()}</b></div>
            <div><div className="section-subtitle">当前安排</div><b>{selected.task}</b></div>
            <div className="gate-card passed"><div className="gate-name">资源校验 <StatusPill status="passed" /></div><div className="gate-detail">人员与设备状态正常；如为项目任务，还需同步校验物料齐套和方案冻结。</div></div>
            <div>
              <div className="section-subtitle">调整为</div>
              <Input value={adjustDraft} onChange={(event) => setAdjustDraft(event.target.value)} disabled={selected.task === "维护"} />
            </div>
            <div>
              <div className="section-subtitle">调整原因</div>
              <Input value={adjustReason} onChange={(event) => setAdjustReason(event.target.value)} placeholder="填写调整原因，将自动留痕" disabled={selected.task === "维护"} />
            </div>
            <Button type="primary" block disabled={selected.task === "维护" || adjustDraft === selected.task} onClick={submitAdjust}>提交人工调整</Button>
            {relatedAdjustments.length > 0 && (
              <div>
                <div className="section-subtitle" style={{ marginBottom: 8 }}>调整记录</div>
                <Timeline
                  items={relatedAdjustments.map((item) => ({
                    children: <div><b>{item.before} → {item.after}</b><div style={{ fontSize: 12, color: "#718096" }}>{item.time} · {item.operator} · {item.reason}</div></div>,
                  }))}
                />
              </div>
            )}
          </Space>
        )}
      </Drawer>

      {/* 插单弹窗 */}
      <Modal title="紧急插单" open={insertModalOpen} onOk={submitInsert} onCancel={() => setInsertModalOpen(false)} okText="确认插单" cancelText="取消">
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div>
            <div className="section-subtitle">目标车间</div>
            <Select value={insertForm.workshop} onChange={(v) => setInsertForm((f) => ({ ...f, workshop: v }))} style={{ width: "100%" }} options={[{ value: "管理车间" }, { value: "准备车间" }, { value: "钣金车间" }]} />
          </div>
          <div>
            <div className="section-subtitle">目标资源</div>
            <Select value={insertForm.resource} onChange={(v) => setInsertForm((f) => ({ ...f, resource: v }))} style={{ width: "100%" }} options={[{ value: "举升机 L1" }, { value: "举升机 L2" }]} />
          </div>
          <div>
            <div className="section-subtitle">班次</div>
            <Select value={insertForm.shift} onChange={(v) => setInsertForm((f) => ({ ...f, shift: v }))} style={{ width: "100%" }} options={[{ value: "am", label: "上午 AM" }, { value: "pm", label: "下午 PM" }, { value: "ev", label: "晚上 EV" }]} />
          </div>
          <div>
            <div className="section-subtitle">任务名称</div>
            <Input value={insertForm.task} onChange={(e) => setInsertForm((f) => ({ ...f, task: e.target.value }))} placeholder="如：E8-04 紧急拆解" />
          </div>
          <div>
            <div className="section-subtitle">优先级</div>
            <Select value={insertForm.priority} onChange={(v) => setInsertForm((f) => ({ ...f, priority: v }))} style={{ width: "100%" }} options={[{ value: "紧急" }, { value: "高" }, { value: "普通" }]} />
          </div>
          <div>
            <div className="section-subtitle">插单原因</div>
            <Input.TextArea value={insertForm.reason} onChange={(e) => setInsertForm((f) => ({ ...f, reason: e.target.value }))} placeholder="说明插单原因，将自动留痕" rows={2} />
          </div>
          <Alert type="info" showIcon message="插单将进行约束校验：资源互斥、物料齐套、方案冻结、交付窗口" />
        </Space>
      </Modal>

      {/* 约束规则详情弹窗 */}
      <Modal title="排产约束规则 (FR-401~FR-409)" open={constraintModalOpen} onCancel={() => setConstraintModalOpen(false)} footer={null} width={640}>
        <Table
          dataSource={CONSTRAINT_RULES}
          columns={[
            { title: "约束名称", dataIndex: "name", key: "name", width: 130 },
            { title: "说明", dataIndex: "description", key: "description" },
            { title: "级别", dataIndex: "level", key: "level", width: 80, render: (v: string) => <Tag color={v === "硬约束" ? "red" : "orange"}>{v}</Tag> },
          ]}
          rowKey="key"
          pagination={false}
          size="small"
        />
        <div style={{ marginTop: 12 }}>
          <Descriptions column={2} size="small" bordered>
            {constraintStatus.map((c) => (
              <Descriptions.Item key={c.key} label={c.name}>
                <Tag color={c.passed ? "success" : "error"}>{c.passed ? "通过" : "未通过"}</Tag> {c.detail}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </Modal>
    </>
  );
}
