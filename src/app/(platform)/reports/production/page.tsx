"use client";

import { BarChartOutlined, RiseOutlined } from "@ant-design/icons";
import { Col, Progress, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface DailyOutput {
  key: string;
  date: string;
  project: string;
  planned: number;
  actual: number;
  rate: number;
  reportedHours: number;
  downtime: number;
}

const dailyData: DailyOutput[] = [
  { key: "1", date: "07-14", project: "E8-SM-017", planned: 6, actual: 6, rate: 100, reportedHours: 42, downtime: 0 },
  { key: "2", date: "07-14", project: "E8-SM-022", planned: 4, actual: 3, rate: 75, reportedHours: 38, downtime: 45 },
  { key: "3", date: "07-15", project: "E8-SM-017", planned: 6, actual: 5, rate: 83, reportedHours: 44, downtime: 30 },
  { key: "4", date: "07-15", project: "E8-SM-022", planned: 4, actual: 4, rate: 100, reportedHours: 40, downtime: 0 },
  { key: "5", date: "07-16", project: "E8-SM-017", planned: 6, actual: 6, rate: 100, reportedHours: 41, downtime: 0 },
  { key: "6", date: "07-16", project: "E8-SM-022", planned: 4, actual: 4, rate: 100, reportedHours: 39, downtime: 10 },
  { key: "7", date: "07-17", project: "E8-SM-017", planned: 6, actual: 6, rate: 100, reportedHours: 43, downtime: 0 },
  { key: "8", date: "07-17", project: "E8-SM-022", planned: 4, actual: 3, rate: 75, reportedHours: 36, downtime: 60 },
  { key: "9", date: "07-18", project: "E8-SM-017", planned: 6, actual: 5, rate: 83, reportedHours: 40, downtime: 20 },
  { key: "10", date: "07-18", project: "E8-SM-022", planned: 4, actual: 4, rate: 100, reportedHours: 41, downtime: 0 },
];

interface WeeklySummary {
  key: string;
  project: string;
  weekPlan: number;
  weekActual: number;
  rate: number;
  progress: number;
}

const weeklyData: WeeklySummary[] = [
  { key: "1", project: "E8-SM-017", weekPlan: 30, weekActual: 28, rate: 93, progress: 72 },
  { key: "2", project: "E8-SM-022", weekPlan: 20, weekActual: 18, rate: 90, progress: 55 },
];

const renderRate = (rate: number) => (
  <Progress
    percent={rate}
    size="small"
    strokeColor={rate >= 95 ? "#52c41a" : rate >= 80 ? "#1677ff" : "#faad14"}
    style={{ width: 120 }}
  />
);

export default function ProductionReportPage() {
  const totalPlanned = dailyData.reduce((s, d) => s + d.planned, 0);
  const totalActual = dailyData.reduce((s, d) => s + d.actual, 0);
  const overallRate = Math.round((totalActual / totalPlanned) * 100);
  const totalDowntime = dailyData.reduce((s, d) => s + d.downtime, 0);

  const dailyColumns = [
    { title: "日期", dataIndex: "date", key: "date", width: 90 },
    { title: "项目", dataIndex: "project", key: "project", width: 120, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "计划产出", dataIndex: "planned", key: "planned", width: 90, align: "right" as const },
    { title: "实际产出", dataIndex: "actual", key: "actual", width: 90, align: "right" as const },
    { title: "达成率", dataIndex: "rate", key: "rate", width: 160, render: (v: number) => renderRate(v) },
    { title: "报工工时(h)", dataIndex: "reportedHours", key: "reportedHours", width: 110, align: "right" as const },
    { title: "异常停机(min)", dataIndex: "downtime", key: "downtime", width: 120, align: "right" as const, render: (v: number) => <span style={{ color: v > 0 ? "#c93636" : "#52c41a" }}>{v}</span> },
  ];

  const weeklyColumns = [
    { title: "项目", dataIndex: "project", key: "project", width: 120, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "周计划", dataIndex: "weekPlan", key: "weekPlan", width: 90, align: "right" as const },
    { title: "周实际", dataIndex: "weekActual", key: "weekActual", width: 90, align: "right" as const },
    { title: "达成率", dataIndex: "rate", key: "rate", width: 160, render: (v: number) => renderRate(v) },
    { title: "累计进度", dataIndex: "progress", key: "progress", width: 180, render: (v: number) => <Progress percent={v} size="small" strokeColor="#722ed1" /> },
  ];

  return (
    <>
      <PageHeader
        title="生产报表"
        description="生产产出与效率报表，汇总每日计划达成、报工工时与异常停机，支撑周度产能复盘。"
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="周计划产出" value={totalPlanned} suffix="台" prefix={<BarChartOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="周实际产出" value={totalActual} suffix="台" prefix={<RiseOutlined />} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="异常停机总计" value={totalDowntime} suffix="min" valueStyle={{ color: "#c93636" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <div style={{ height: 14 }} />

      <SurfaceCard title="每日产出明细" subtitle="07-14 至 07-18 各项目每日产出与达成情况">
        <Table
          rowKey="key"
          dataSource={dailyData}
          columns={dailyColumns}
          pagination={false}
          scroll={{ x: 800 }}
          size="middle"
        />
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard title="周度汇总" subtitle="按项目汇总本周计划达成与累计进度">
        <Table
          rowKey="key"
          dataSource={weeklyData}
          columns={weeklyColumns}
          pagination={false}
          scroll={{ x: 650 }}
          size="middle"
        />
      </SurfaceCard>
    </>
  );
}
