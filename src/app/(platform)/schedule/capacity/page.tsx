"use client";

import { DashboardOutlined, ToolOutlined, WarningOutlined } from "@ant-design/icons";
import { Descriptions, Progress, Space, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const CAPACITY_DATA = [
  { key: "1", center: "管理车间 L1", equipment: 4, dailyHours: 32, weeklyHours: 160, load: 82, bottleneck: false, vehiclesPerWeek: 6 },
  { key: "2", center: "管理车间 L2", equipment: 4, dailyHours: 32, weeklyHours: 160, load: 91, bottleneck: true, vehiclesPerWeek: 5 },
  { key: "3", center: "准备车间 L1", equipment: 3, dailyHours: 24, weeklyHours: 120, load: 75, bottleneck: false, vehiclesPerWeek: 8 },
  { key: "4", center: "准备车间 L2", equipment: 3, dailyHours: 24, weeklyHours: 120, load: 88, bottleneck: true, vehiclesPerWeek: 6 },
  { key: "5", center: "钣金车间 L1", equipment: 2, dailyHours: 16, weeklyHours: 80, load: 68, bottleneck: false, vehiclesPerWeek: 4 },
  { key: "6", center: "钣金车间 L2", equipment: 2, dailyHours: 16, weeklyHours: 80, load: 55, bottleneck: false, vehiclesPerWeek: 5 },
];

const columns = [
  { title: "工作中心", dataIndex: "center", key: "center", width: 140 },
  { title: "设备数", dataIndex: "equipment", key: "equipment", width: 80, render: (v: number) => `${v} 台` },
  { title: "日可用工时(h)", dataIndex: "dailyHours", key: "dailyHours", width: 120 },
  { title: "周可用工时(h)", dataIndex: "weeklyHours", key: "weeklyHours", width: 120 },
  {
    title: "当前负荷率",
    dataIndex: "load",
    key: "load",
    width: 180,
    render: (v: number) => <Progress percent={v} size="small" status={v > 90 ? "exception" : v > 80 ? "active" : "normal"} strokeColor={v > 90 ? "#ff4d4f" : v > 80 ? "#faad14" : "#52c41a"} />,
  },
  {
    title: "瓶颈标识",
    dataIndex: "bottleneck",
    key: "bottleneck",
    width: 100,
    render: (v: boolean) => v ? <Tag color="red" icon={<WarningOutlined />}>瓶颈</Tag> : <Tag color="green">正常</Tag>,
  },
  { title: "可排产车辆数/周", dataIndex: "vehiclesPerWeek", key: "vehiclesPerWeek", width: 140, render: (v: number) => `${v} 台` },
];

export default function ScheduleCapacityPage() {
  const totalWeeklyHours = CAPACITY_DATA.reduce((sum, item) => sum + item.weeklyHours, 0);
  const avgLoad = Math.round(CAPACITY_DATA.reduce((sum, item) => sum + item.load, 0) / CAPACITY_DATA.length);
  const bottlenecks = CAPACITY_DATA.filter((item) => item.bottleneck).map((item) => item.center);

  return (
    <>
      <PageHeader
        title="产能模型"
        description="基于工作中心维度的产能规划与瓶颈分析，量化设备可用工时、负荷率与可排产能力，为排产决策提供数据支撑。"
        actions={<Tag color="blue" icon={<DashboardOutlined />}>数据截至 2026-07-18</Tag>}
      />

      <SurfaceCard
        title="工作中心产能明细"
        subtitle="按车间/产线维度展示设备能力、工时负荷与瓶颈状态"
        extra={<Tag icon={<ToolOutlined />} color="processing">{CAPACITY_DATA.length} 个工作中心</Tag>}
      >
        <Table dataSource={CAPACITY_DATA} columns={columns} rowKey="key" pagination={false} size="small" scroll={{ x: 880 }} />
      </SurfaceCard>

      <div style={{ marginTop: 14 }}>
        <SurfaceCard title="产能汇总" subtitle="全局产能关键指标">
          <Descriptions column={3} size="small" bordered>
            <Descriptions.Item label="总可用工时/周">{totalWeeklyHours} h</Descriptions.Item>
            <Descriptions.Item label="综合负荷率">
              <Space>
                <Progress percent={avgLoad} size="small" style={{ width: 120 }} status={avgLoad > 85 ? "exception" : "normal"} />
                <span>{avgLoad}%</span>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="瓶颈工位">
              <Space>
                {bottlenecks.map((name) => (
                  <Tag key={name} color="red">{name}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </SurfaceCard>
      </div>
    </>
  );
}
