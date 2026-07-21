"use client";

import { CalendarOutlined, ScheduleOutlined } from "@ant-design/icons";
import { Progress, Segmented, Space, Table, Tag } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const WEEK_PLAN = [
  { key: "1", week: "第 3 周 (07-14~07-20)", project: "银河E8智驾验证车改制", vehicles: 3, milestone: "方案冻结 / 首台拆解完成", resource: "举升机×2 / 钣金工位×1", material: "齐套", risk: "中" },
  { key: "2", week: "第 3 周 (07-14~07-20)", project: "EX5 车身切割焊接", vehicles: 2, milestone: "焊接验收", resource: "焊接工位×2", material: "齐套", risk: "低" },
  { key: "3", week: "第 3 周 (07-14~07-20)", project: "领克900冬季标定改制", vehicles: 4, milestone: "首台下线", resource: "管理车间全线", material: "部分调拨中", risk: "高" },
  { key: "4", week: "第 4 周 (07-21~07-27)", project: "银河E8智驾验证车改制", vehicles: 3, milestone: "装配完成 / 质量点检", resource: "举升机×2 / 检测线×1", material: "齐套", risk: "中" },
  { key: "5", week: "第 4 周 (07-21~07-27)", project: "远程星享V6E改装", vehicles: 2, milestone: "拆解 / 准备确认", resource: "准备车间L1", material: "待确认", risk: "低" },
];

const MONTH_PLAN = [
  { key: "1", month: "2026-07", projects: 4, vehicles: 12, hours: 1860, load: 88, delivery: "07-25 E8首台 / 07-31 EX5批次" },
  { key: "2", month: "2026-08", projects: 5, vehicles: 16, hours: 2240, load: 92, delivery: "08-15 领克900首批 / 08-28 E8全批" },
  { key: "3", month: "2026-09", projects: 3, vehicles: 10, hours: 1520, load: 71, delivery: "09-15 星享V6E / 09-30 新车型试制" },
  { key: "4", month: "2026-10", projects: 4, vehicles: 14, hours: 1980, load: 83, delivery: "10-20 冬季标定二批 / 10-31 智驾迭代" },
  { key: "5", month: "2026-11", projects: 2, vehicles: 6, hours: 980, load: 54, delivery: "11-28 年度收尾交付" },
];

const weekColumns = [
  { title: "周次", dataIndex: "week", key: "week", width: 180 },
  { title: "项目", dataIndex: "project", key: "project", width: 200 },
  { title: "车辆数", dataIndex: "vehicles", key: "vehicles", width: 80, render: (v: number) => `${v} 台` },
  { title: "关键里程碑", dataIndex: "milestone", key: "milestone", width: 200 },
  { title: "资源需求", dataIndex: "resource", key: "resource", width: 180 },
  {
    title: "物料状态",
    dataIndex: "material",
    key: "material",
    width: 110,
    render: (v: string) => <Tag color={v === "齐套" ? "green" : v === "部分调拨中" ? "orange" : "default"}>{v}</Tag>,
  },
  {
    title: "风险等级",
    dataIndex: "risk",
    key: "risk",
    width: 90,
    render: (v: string) => <Tag color={v === "高" ? "red" : v === "中" ? "orange" : "green"}>{v}</Tag>,
  },
];

const monthColumns = [
  { title: "月份", dataIndex: "month", key: "month", width: 100 },
  { title: "项目数", dataIndex: "projects", key: "projects", width: 80, render: (v: number) => `${v} 个` },
  { title: "车辆总数", dataIndex: "vehicles", key: "vehicles", width: 90, render: (v: number) => `${v} 台` },
  { title: "计划工时", dataIndex: "hours", key: "hours", width: 100, render: (v: number) => `${v.toLocaleString()} h` },
  {
    title: "产能负荷率",
    dataIndex: "load",
    key: "load",
    width: 160,
    render: (v: number) => <Progress percent={v} size="small" status={v > 90 ? "exception" : "normal"} />,
  },
  { title: "交付节点", dataIndex: "delivery", key: "delivery", width: 260 },
];

export default function SchedulePlanPage() {
  const [view, setView] = useState<string | number>("周计划");

  return (
    <>
      <PageHeader
        title="周/月计划"
        description="中期生产计划管理，按周/月维度统筹项目排产、资源分配、物料齐套与交付节点，确保产能平衡与风险可控。"
        actions={
          <Space>
            <Segmented options={["周计划", "月计划"]} value={view} onChange={setView} />
          </Space>
        }
      />

      {view === "周计划" && (
        <SurfaceCard
          title="周计划排产"
          subtitle="按周分解项目任务，明确里程碑、资源与物料约束"
          extra={<Tag color="blue"><CalendarOutlined /> 2026-07 第3~4周</Tag>}
        >
          <Table dataSource={WEEK_PLAN} columns={weekColumns} rowKey="key" pagination={false} size="small" scroll={{ x: 1040 }} />
        </SurfaceCard>
      )}

      {view === "月计划" && (
        <SurfaceCard
          title="月计划总览"
          subtitle="按月汇总项目数量、车辆规模、工时需求与产能负荷"
          extra={<Tag color="blue"><ScheduleOutlined /> 2026 H2</Tag>}
        >
          <Table dataSource={MONTH_PLAN} columns={monthColumns} rowKey="key" pagination={false} size="small" scroll={{ x: 890 }} />
        </SurfaceCard>
      )}
    </>
  );
}
