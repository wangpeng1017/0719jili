"use client";

import { Row, Col, Card, Progress, Table, Tag, Space, Statistic } from "antd";
import {
  DashboardOutlined,
  CheckCircleOutlined,
  UnorderedListOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface WorkshopData {
  key: string;
  name: string;
  currentTasks: number;
  completedToday: number;
  queueCount: number;
  utilization: number;
  color: string;
}

const workshops: WorkshopData[] = [
  {
    key: "1",
    name: "管理车间",
    currentTasks: 3,
    completedToday: 5,
    queueCount: 2,
    utilization: 72,
    color: "#1677ff",
  },
  {
    key: "2",
    name: "准备车间",
    currentTasks: 4,
    completedToday: 8,
    queueCount: 3,
    utilization: 85,
    color: "#52c41a",
  },
  {
    key: "3",
    name: "钣金车间",
    currentTasks: 5,
    completedToday: 6,
    queueCount: 4,
    utilization: 91,
    color: "#faad14",
  },
];

interface OutputRecord {
  key: string;
  project: string;
  plan: number;
  actual: number;
  rate: number;
}

const outputData: OutputRecord[] = [
  {
    key: "1",
    project: "银河E8 改装",
    plan: 12,
    actual: 10,
    rate: 83.3,
  },
  {
    key: "2",
    project: "EX5 改装",
    plan: 15,
    actual: 13,
    rate: 86.7,
  },
  {
    key: "3",
    project: "领克900 改装",
    plan: 8,
    actual: 6,
    rate: 75.0,
  },
  {
    key: "4",
    project: "合计",
    plan: 35,
    actual: 29,
    rate: 82.9,
  },
];

const outputColumns: ColumnsType<OutputRecord> = [
  {
    title: "项目",
    dataIndex: "project",
    key: "project",
    render: (text: string) => (
      <span style={{ fontWeight: text === "合计" ? 600 : 400 }}>{text}</span>
    ),
  },
  {
    title: "计划",
    dataIndex: "plan",
    key: "plan",
    align: "center",
    width: 80,
  },
  {
    title: "实际",
    dataIndex: "actual",
    key: "actual",
    align: "center",
    width: 80,
    render: (val: number, record: OutputRecord) => (
      <span style={{ color: val >= record.plan ? "#52c41a" : "#faad14", fontWeight: 500 }}>
        {val}
      </span>
    ),
  },
  {
    title: "达成率",
    dataIndex: "rate",
    key: "rate",
    align: "center",
    width: 140,
    render: (rate: number) => (
      <Space>
        <Progress
          percent={rate}
          size="small"
          style={{ width: 80 }}
          strokeColor={rate >= 85 ? "#52c41a" : rate >= 75 ? "#faad14" : "#ff4d4f"}
        />
        <span>{rate}%</span>
      </Space>
    ),
  },
];

export default function BoardPage() {
  return (
    <div>
      <PageHeader
        title="生产看板"
        description="可视化展示各车间生产运行状态，包括当前任务、今日产出、排队数量及产能利用率，辅助生产调度决策。"
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {workshops.map((ws) => (
          <Col xs={24} sm={12} lg={8} key={ws.key}>
            <Card
              title={
                <Space>
                  <DashboardOutlined style={{ color: ws.color }} />
                  <span>{ws.name}</span>
                </Space>
              }
              extra={
                <Tag color={ws.utilization >= 90 ? "red" : ws.utilization >= 80 ? "orange" : "green"}>
                  {ws.utilization >= 90 ? "高负荷" : ws.utilization >= 80 ? "正常" : "空闲"}
                </Tag>
              }
            >
              <Row gutter={[16, 12]}>
                <Col span={8}>
                  <Statistic
                    title="当前任务"
                    value={ws.currentTasks}
                    prefix={<ThunderboltOutlined />}
                    valueStyle={{ fontSize: 20, color: ws.color }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="今日完成"
                    value={ws.completedToday}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ fontSize: 20, color: "#52c41a" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="排队数量"
                    value={ws.queueCount}
                    prefix={<UnorderedListOutlined />}
                    valueStyle={{ fontSize: 20 }}
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 4, fontSize: 12, color: "#8c8c8c" }}>
                  产能利用率
                </div>
                <Progress
                  percent={ws.utilization}
                  strokeColor={ws.color}
                  format={(p) => `${p}%`}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <SurfaceCard
        title="今日产出统计"
        subtitle="2025-06-26 各项目计划与实际产出对比"
      >
        <Table<OutputRecord>
          columns={outputColumns}
          dataSource={outputData}
          pagination={false}
          size="middle"
        />
      </SurfaceCard>
    </div>
  );
}
