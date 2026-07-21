"use client";

import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const STATUS_MAP: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  pending: { color: "default", label: "待执行", icon: <ClockCircleOutlined /> },
  executing: { color: "processing", label: "执行中", icon: <SyncOutlined spin /> },
  completed: { color: "success", label: "已完成", icon: <CheckCircleOutlined /> },
  overdue: { color: "error", label: "逾期", icon: <ExclamationCircleOutlined /> },
};

const MAINTENANCE_PLANS = [
  { id: "PM-2026-0701", equipment: "双柱举升机 L1（总装）", type: "日常点检", planDate: "2026-06-26", executor: "陈师傅", status: "completed", checkItems: 8, abnormal: 0 },
  { id: "PM-2026-0702", equipment: "CO2 气体保护焊机", type: "周保养", planDate: "2026-06-26", executor: "王师傅", status: "executing", checkItems: 12, abnormal: 1 },
  { id: "PM-2026-0703", equipment: "三坐标测量机", type: "月保养", planDate: "2026-06-27", executor: "周工", status: "pending", checkItems: 15, abnormal: 0 },
  { id: "PM-2026-0704", equipment: "激光切割机", type: "日常点检", planDate: "2026-06-26", executor: "李师傅", status: "completed", checkItems: 6, abnormal: 0 },
  { id: "PM-2026-0705", equipment: "双柱举升机 L2（准备）", type: "年度大修", planDate: "2026-06-20", executor: "叶师傅", status: "overdue", checkItems: 28, abnormal: 3 },
  { id: "PM-2026-0706", equipment: "气动扳手", type: "周保养", planDate: "2026-06-28", executor: "张师傅", status: "pending", checkItems: 5, abnormal: 0 },
  { id: "PM-2026-0707", equipment: "氩弧焊机", type: "月保养", planDate: "2026-06-25", executor: "王师傅", status: "completed", checkItems: 10, abnormal: 0 },
  { id: "PM-2026-0708", equipment: "等离子切割机", type: "日常点检", planDate: "2026-06-26", executor: "李师傅", status: "executing", checkItems: 7, abnormal: 2 },
];

const TODAY_CHECKLIST = [
  { seq: 1, item: "液压油位", standard: "油位在标尺上下刻度之间", result: "正常", remark: "" },
  { seq: 2, item: "钢丝绳磨损", standard: "无断丝、磨损量 < 10%", result: "正常", remark: "" },
  { seq: 3, item: "安全锁止机构", standard: "锁止可靠，无滑移", result: "正常", remark: "" },
  { seq: 4, item: "电气线路", standard: "无裸露、无老化、接地良好", result: "异常", remark: "L2 举升机接地线松动，已报修" },
  { seq: 5, item: "限位开关", standard: "上下限位动作灵敏", result: "正常", remark: "" },
  { seq: 6, item: "底座螺栓", standard: "紧固力矩达标，无松动", result: "正常", remark: "" },
  { seq: 7, item: "运行异响", standard: "升降过程无异响、无卡顿", result: "正常", remark: "" },
  { seq: 8, item: "急停按钮", standard: "按下后立即停止，复位正常", result: "正常", remark: "" },
];

export default function MaintenancePage() {
  const columns = [
    { title: "计划编号", dataIndex: "id", key: "id", width: 130, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12, color: "#0b4f91" }}>{v}</span> },
    { title: "设备名称", dataIndex: "equipment", key: "equipment", width: 180 },
    { title: "保养类型", dataIndex: "type", key: "type", width: 100, render: (v: string) => <Tag color={v === "年度大修" ? "purple" : v === "月保养" ? "blue" : v === "周保养" ? "cyan" : "default"}>{v}</Tag> },
    { title: "计划日期", dataIndex: "planDate", key: "planDate", width: 110 },
    { title: "执行人", dataIndex: "executor", key: "executor", width: 90 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v: string) => {
        const s = STATUS_MAP[v];
        return <Tag color={s.color} icon={s.icon}>{s.label}</Tag>;
      },
    },
    { title: "检查项数", dataIndex: "checkItems", key: "checkItems", width: 90, align: "center" as const },
    {
      title: "异常项",
      dataIndex: "abnormal",
      key: "abnormal",
      width: 80,
      align: "center" as const,
      render: (v: number) => (v > 0 ? <span style={{ color: "#c93636", fontWeight: 600 }}>{v}</span> : <span style={{ color: "#16845b" }}>0</span>),
    },
  ];

  const checklistColumns = [
    { title: "序号", dataIndex: "seq", key: "seq", width: 60, align: "center" as const },
    { title: "检查项目", dataIndex: "item", key: "item", width: 140 },
    { title: "标准", dataIndex: "standard", key: "standard" },
    {
      title: "结果",
      dataIndex: "result",
      key: "result",
      width: 80,
      render: (v: string) => (v === "异常" ? <Tag color="red">异常</Tag> : <Tag color="green">正常</Tag>),
    },
    { title: "备注", dataIndex: "remark", key: "remark", width: 200, render: (v: string) => v || "—" },
  ];

  return (
    <>
      <PageHeader
        title="点检保养"
        description="执行预防性维护计划与日常点检，覆盖日常点检、周保养、月保养及年度大修，确保设备始终处于最佳工作状态，降低突发故障风险。"
      />

      <SurfaceCard title="保养计划" subtitle="当前周期内的预防性维护任务">
        <Table rowKey="id" size="small" pagination={false} columns={columns} dataSource={MAINTENANCE_PLANS} scroll={{ x: 880 }} />
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard title="今日点检表" subtitle="双柱举升机 L1（总装车间）· 2026-06-26 日常点检">
        <Table rowKey="seq" size="small" pagination={false} columns={checklistColumns} dataSource={TODAY_CHECKLIST} scroll={{ x: 640 }} />
      </SurfaceCard>
    </>
  );
}
