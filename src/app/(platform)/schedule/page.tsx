"use client";

import { CalendarOutlined, ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import { Alert, App, Button, DatePicker, Drawer, Input, Segmented, Space, Tag, Timeline } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type ScheduleShift } from "@/lib/demo-store";

const DEMO_DATE = "2026-07-18";

export default function SchedulePage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const [selected, setSelected] = useState<{ workshop: string; resource: string; shift: ScheduleShift; task: string } | null>(null);
  const [adjustDraft, setAdjustDraft] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [view, setView] = useState<string | number>("日");
  const [date, setDate] = useState<Dayjs>(dayjs(DEMO_DATE));

  const hasConflict = state.scheduleRows.some((row) => row.status === "warning");
  const onDemoDate = date.format("YYYY-MM-DD") === DEMO_DATE;

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

  const submitAdjust = () => {
    if (!selected) return;
    dispatch({
      type: "ADJUST_SCHEDULE_SLOT",
      payload: { workshop: selected.workshop, resource: selected.resource, shift: selected.shift, task: adjustDraft, reason: adjustReason || "现场人工调整", operator: "王欣" },
    });
    message.success("已完成人工调整，变更前后、操作人和原因已自动留痕");
    setSelected((current) => (current ? { ...current, task: adjustDraft } : current));
  };

  const relatedAdjustments = selected
    ? state.scheduleAdjustments.filter((item) => item.workshop === selected.workshop && item.resource === selected.resource)
    : [];

  return (
    <>
      <PageHeader
        title="项目 + 资源双线排产"
        description="按管理、准备、钣金三区域，以 AM / PM / EV 颗粒度统筹车辆窗口、举升机、工位、班组、物料和质量门禁。"
        actions={
          <Space>
            <DatePicker value={date} onChange={(value) => value && setDate(value)} />
            <Segmented options={["日", "周", "月"]} value={view} onChange={setView} />
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
          action={<Button size="small" onClick={adoptSuggestion}>采纳建议</Button>}
          style={{ marginBottom: 14 }}
        />
      )}
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
      {view !== "日" && (
        <SurfaceCard title={`${view}视图汇总`} subtitle="按资源统计占用与冲突情况（演示数据仅含单日明细，此处展示汇总口径）">
          <Space direction="vertical" size={10} style={{ width: "100%" }}>
            <div>资源总数：{state.scheduleRows.length} 个 · 有任务：{state.scheduleRows.filter((row) => row.am !== "空闲" || row.pm !== "空闲" || row.ev !== "空闲").length} 个 · 冲突：{state.scheduleRows.filter((row) => row.status === "warning").length} 个</div>
            <div>人工调整记录：{state.scheduleAdjustments.length} 条</div>
          </Space>
        </SurfaceCard>
      )}
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
    </>
  );
}
