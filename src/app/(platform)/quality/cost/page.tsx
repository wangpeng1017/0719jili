"use client";

import { DollarOutlined, SafetyCertificateOutlined, ExperimentOutlined, WarningOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Table } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

type MonthlyCost = {
  key: string;
  month: string;
  prevention: number;
  appraisal: number;
  internalFailure: number;
  externalFailure: number;
  total: number;
  costRate: number;
};

const monthlyData: MonthlyCost[] = [
  { key: "1", month: "2026-02", prevention: 12.5, appraisal: 18.3, internalFailure: 8.2, externalFailure: 3.1, total: 42.1, costRate: 2.8 },
  { key: "2", month: "2026-03", prevention: 14.0, appraisal: 17.8, internalFailure: 7.5, externalFailure: 2.6, total: 41.9, costRate: 2.7 },
  { key: "3", month: "2026-04", prevention: 15.2, appraisal: 19.1, internalFailure: 6.8, externalFailure: 2.2, total: 43.3, costRate: 2.6 },
  { key: "4", month: "2026-05", prevention: 13.8, appraisal: 18.6, internalFailure: 5.9, externalFailure: 1.8, total: 40.1, costRate: 2.4 },
  { key: "5", month: "2026-06", prevention: 16.1, appraisal: 20.2, internalFailure: 5.2, externalFailure: 1.5, total: 43.0, costRate: 2.3 },
  { key: "6", month: "2026-07", prevention: 15.5, appraisal: 19.5, internalFailure: 4.8, externalFailure: 1.2, total: 41.0, costRate: 2.2 },
];

type CostBreakdown = {
  key: string;
  category: string;
  item: string;
  amount: number;
  ratio: number;
};

const breakdownData: CostBreakdown[] = [
  { key: "1", category: "预防成本", item: "培训费", amount: 8.6, ratio: 18.2 },
  { key: "2", category: "预防成本", item: "质量改进项目费", amount: 6.5, ratio: 13.8 },
  { key: "3", category: "鉴定成本", item: "检验设备折旧", amount: 12.3, ratio: 26.1 },
  { key: "4", category: "鉴定成本", item: "检测耗材费", amount: 5.8, ratio: 12.3 },
  { key: "5", category: "内部失败成本", item: "返工工时", amount: 6.2, ratio: 13.1 },
  { key: "6", category: "内部失败成本", item: "报废损失", amount: 4.5, ratio: 9.5 },
  { key: "7", category: "外部失败成本", item: "客诉处理费", amount: 2.1, ratio: 4.5 },
  { key: "8", category: "外部失败成本", item: "三包索赔", amount: 1.2, ratio: 2.5 },
];

export default function QualityCostPage() {
  const latest = monthlyData[monthlyData.length - 1];

  const monthlyColumns = [
    { title: "月份", dataIndex: "month", key: "month", width: 100 },
    { title: "预防成本(万元)", dataIndex: "prevention", key: "prevention", width: 130, align: "right" as const },
    { title: "鉴定成本(万元)", dataIndex: "appraisal", key: "appraisal", width: 130, align: "right" as const },
    { title: "内部失败(万元)", dataIndex: "internalFailure", key: "internalFailure", width: 120, align: "right" as const },
    { title: "外部失败(万元)", dataIndex: "externalFailure", key: "externalFailure", width: 120, align: "right" as const },
    { title: "合计(万元)", dataIndex: "total", key: "total", width: 110, align: "right" as const, render: (v: number) => <span style={{ fontWeight: 600 }}>{v.toFixed(1)}</span> },
    { title: "质量成本率", dataIndex: "costRate", key: "costRate", width: 100, align: "right" as const, render: (v: number) => <span style={{ color: v <= 2.5 ? "#16845b" : "#d46b08" }}>{v.toFixed(1)}%</span> },
  ];

  const breakdownColumns = [
    { title: "成本类别", dataIndex: "category", key: "category", width: 120 },
    { title: "明细项目", dataIndex: "item", key: "item", width: 150 },
    { title: "金额(万元)", dataIndex: "amount", key: "amount", width: 110, align: "right" as const },
    { title: "占比", dataIndex: "ratio", key: "ratio", width: 80, align: "right" as const, render: (v: number) => `${v.toFixed(1)}%` },
  ];

  return (
    <>
      <PageHeader
        title="质量成本分析"
        description="基于质量成本（CoQ）模型，从预防、鉴定、内部失败、外部失败四个维度核算质量投入与损失，驱动质量改进投资回报优化。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={12} md={4}>
          <SurfaceCard compact>
            <Statistic title="预防成本" value={latest.prevention} prefix={<SafetyCertificateOutlined />} suffix="万元" precision={1} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={5}>
          <SurfaceCard compact>
            <Statistic title="鉴定成本" value={latest.appraisal} prefix={<ExperimentOutlined />} suffix="万元" precision={1} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={5}>
          <SurfaceCard compact>
            <Statistic title="内部失败成本" value={latest.internalFailure} prefix={<WarningOutlined />} suffix="万元" precision={1} valueStyle={{ color: "#d46b08" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={5}>
          <SurfaceCard compact>
            <Statistic title="外部失败成本" value={latest.externalFailure} prefix={<CloseCircleOutlined />} suffix="万元" precision={1} valueStyle={{ color: "#c93636" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={5}>
          <SurfaceCard compact>
            <Statistic title="总质量成本" value={latest.total} prefix={<DollarOutlined />} suffix="万元" precision={1} valueStyle={{ fontWeight: 700 }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="月度质量成本趋势" subtitle="2026-02 至 2026-07 各月 PAFF 四象限成本">
        <Table rowKey="key" size="small" pagination={false} columns={monthlyColumns} dataSource={monthlyData} scroll={{ x: 810 }} />
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard title="质量成本明细" subtitle="按成本类别与明细项目分解（当月）">
        <Table rowKey="key" size="small" pagination={false} columns={breakdownColumns} dataSource={breakdownData} scroll={{ x: 460 }} />
      </SurfaceCard>
    </>
  );
}
