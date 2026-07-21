"use client";

import { CheckCircleOutlined, CloseCircleOutlined, FieldTimeOutlined, SyncOutlined } from "@ant-design/icons";
import { Col, Progress, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface ProjectQuality {
  key: string;
  project: string;
  inspected: number;
  passed: number;
  failed: number;
  ftt: number;
  totalIssues: number;
  closed: number;
  closeRate: number;
}

const projectData: ProjectQuality[] = [
  { key: "1", project: "E8-SM-017", inspected: 128, passed: 122, failed: 6, ftt: 95.3, totalIssues: 9, closed: 8, closeRate: 88.9 },
  { key: "2", project: "E8-SM-022", inspected: 86, passed: 80, failed: 6, ftt: 93.0, totalIssues: 7, closed: 6, closeRate: 85.7 },
  { key: "3", project: "E8-SM-025", inspected: 54, passed: 51, failed: 3, ftt: 94.4, totalIssues: 4, closed: 4, closeRate: 100 },
];

interface MonthlyTrend {
  key: string;
  month: string;
  ftt: number;
  issues: number;
  closeRate: number;
  complaints: number;
}

const trendData: MonthlyTrend[] = [
  { key: "1", month: "2025-03", ftt: 91.2, issues: 14, closeRate: 78.6, complaints: 2 },
  { key: "2", month: "2025-04", ftt: 92.8, issues: 11, closeRate: 81.8, complaints: 1 },
  { key: "3", month: "2025-05", ftt: 93.5, issues: 10, closeRate: 90.0, complaints: 1 },
  { key: "4", month: "2025-06", ftt: 94.1, issues: 8, closeRate: 87.5, complaints: 0 },
  { key: "5", month: "2025-07", ftt: 94.6, issues: 6, closeRate: 91.4, complaints: 0 },
];

export default function QualityReportPage() {
  const avgFtt = 94.6;
  const issueCloseRate = 91.4;
  const avgCloseDays = 3.2;
  const horizontalRate = 85.7;

  const projectColumns = [
    { title: "项目", dataIndex: "project", key: "project", width: 120, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "检验数", dataIndex: "inspected", key: "inspected", width: 90, align: "right" as const },
    { title: "合格数", dataIndex: "passed", key: "passed", width: 90, align: "right" as const },
    { title: "不合格数", dataIndex: "failed", key: "failed", width: 90, align: "right" as const, render: (v: number) => <span style={{ color: "#c93636" }}>{v}</span> },
    { title: "FTT", dataIndex: "ftt", key: "ftt", width: 140, render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 95 ? "#52c41a" : v >= 90 ? "#1677ff" : "#faad14"} format={(p) => `${p}%`} /> },
    { title: "问题总数", dataIndex: "totalIssues", key: "totalIssues", width: 90, align: "right" as const },
    { title: "已关闭", dataIndex: "closed", key: "closed", width: 80, align: "right" as const },
    { title: "关闭率", dataIndex: "closeRate", key: "closeRate", width: 140, render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 90 ? "#52c41a" : "#faad14"} format={(p) => `${p}%`} /> },
  ];

  const trendColumns = [
    { title: "月份", dataIndex: "month", key: "month", width: 110 },
    { title: "FTT(%)", dataIndex: "ftt", key: "ftt", width: 140, render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 95 ? "#52c41a" : "#1677ff"} format={(p) => `${p}%`} /> },
    { title: "问题数", dataIndex: "issues", key: "issues", width: 90, align: "right" as const },
    { title: "关闭率(%)", dataIndex: "closeRate", key: "closeRate", width: 140, render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 90 ? "#52c41a" : "#faad14"} format={(p) => `${p}%`} /> },
    { title: "客诉数", dataIndex: "complaints", key: "complaints", width: 90, align: "right" as const, render: (v: number) => <span style={{ color: v > 0 ? "#c93636" : "#52c41a" }}>{v}</span> },
  ];

  return (
    <>
      <PageHeader
        title="质量报表"
        description="质量KPI报表，汇总一次合格率(FTT)、问题关闭率、关闭周期与横展完成率，支撑质量趋势分析。"
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="一次合格率(FTT)" value={avgFtt} suffix="%" prefix={<CheckCircleOutlined />} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="问题关闭率" value={issueCloseRate} suffix="%" prefix={<SyncOutlined />} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="平均关闭周期" value={avgCloseDays} suffix="天" prefix={<FieldTimeOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="横展完成率" value={horizontalRate} suffix="%" prefix={<CloseCircleOutlined />} valueStyle={{ color: "#722ed1" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <div style={{ height: 14 }} />

      <SurfaceCard title="项目质量汇总" subtitle="按项目统计检验合格率与问题关闭情况">
        <Table
          rowKey="key"
          dataSource={projectData}
          columns={projectColumns}
          pagination={false}
          scroll={{ x: 850 }}
          size="middle"
        />
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard title="月度趋势" subtitle="近5个月质量KPI变化趋势">
        <Table
          rowKey="key"
          dataSource={trendData}
          columns={trendColumns}
          pagination={false}
          scroll={{ x: 600 }}
          size="middle"
        />
      </SurfaceCard>
    </>
  );
}
