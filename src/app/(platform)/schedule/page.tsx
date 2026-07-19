"use client";

import { CalendarOutlined, ReloadOutlined, WarningOutlined } from "@ant-design/icons";
import { Alert, Button, DatePicker, Drawer, message, Segmented, Space, Tag } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { scheduleRows } from "@/lib/demo-data";

export default function SchedulePage() {
  const [selected, setSelected] = useState<{ workshop: string; resource: string; shift: string; task: string } | null>(null);

  const openSlot = (workshop: string, resource: string, shift: string, task: string) => {
    setSelected({ workshop, resource, shift, task });
  };

  return (
    <>
      <PageHeader
        title="项目 + 资源双线排产"
        description="按管理、准备、钣金三区域，以 AM / PM / EV 颗粒度统筹车辆窗口、举升机、工位、班组、物料和质量门禁。"
        actions={<Space><DatePicker placeholder="选择日期" /><Segmented options={["日", "周", "月"]} defaultValue="日" /><Button type="primary" icon={<ReloadOutlined />} onClick={() => message.success("已重新计算推荐排程，发现 1 项冲突")}>重新计算</Button></Space>}
      />
      <Alert
        type="warning"
        showIcon
        icon={<WarningOutlined />}
        message="准备车间 L2 下午班存在插单冲突"
        description="EX5 工装测量预计延长 1.5 小时，与 E8-03 临时插单重叠。建议方案：E8-03 后移至晚上班，预计不影响 07-25 交付。"
        action={<Button size="small" onClick={() => message.success("已采纳建议并记录人工调整原因")}>采纳建议</Button>}
        style={{ marginBottom: 14 }}
      />
      <SurfaceCard title="举升机三区域日调度板" subtitle="点击任一班次查看资源、车辆、门禁与人工调整记录" extra={<Tag color="blue"><CalendarOutlined /> 2026-07-18</Tag>}>
        <div className="schedule-board">
          <div className="schedule-grid">
            {["车间", "资源", "上午 AM", "下午 PM", "晚上 EV", "状态"].map((head) => <div key={head} className="schedule-cell schedule-head">{head}</div>)}
            {scheduleRows.flatMap((row) => [
              <div key={`${row.resource}-workshop`} className="schedule-cell"><b>{row.workshop}</b></div>,
              <div key={`${row.resource}-resource`} className="schedule-cell">{row.resource}</div>,
              ...(["am", "pm", "ev"] as const).map((shift) => {
                const task = row[shift];
                const className = task === "空闲" ? "empty" : task === "维护" ? "maintenance" : "";
                return <div key={`${row.resource}-${shift}`} className="schedule-cell"><button type="button" className={`schedule-task ${className}`} onClick={() => openSlot(row.workshop, row.resource, shift.toUpperCase(), task)} style={{ borderTop: 0, borderRight: 0, borderBottom: 0, textAlign: "left" }}>{task}</button></div>;
              }),
              <div key={`${row.resource}-status`} className="schedule-cell"><StatusPill status={row.status} /></div>,
            ])}
          </div>
        </div>
      </SurfaceCard>
      <Drawer title="资源槽详情" width={420} open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && (
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div><div className="section-subtitle">车间 / 资源</div><b>{selected.workshop} · {selected.resource}</b></div>
            <div><div className="section-subtitle">班次</div><b>{selected.shift}</b></div>
            <div><div className="section-subtitle">当前安排</div><b>{selected.task}</b></div>
            <div className="gate-card passed"><div className="gate-name">资源校验 <StatusPill status="passed" /></div><div className="gate-detail">人员与设备状态正常；如为项目任务，还需同步校验物料齐套和方案冻结。</div></div>
            <Button type="primary" block disabled={selected.task === "维护"} onClick={() => message.success("已打开人工调整窗口，变更将自动留痕")}>调整该班次</Button>
          </Space>
        )}
      </Drawer>
    </>
  );
}

