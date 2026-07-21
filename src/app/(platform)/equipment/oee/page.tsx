"use client";

import { DashboardOutlined, ThunderboltOutlined, CheckCircleOutlined, AimOutlined } from "@ant-design/icons";
import { Col, Progress, Row, Statistic, Table } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const OEE_DATA = [
  { id: "1", name: "双柱举升机 L1（总装）", calendar: 480, planned: 48, actual: 396, actualTakt: 42, theoryTakt: 38, good: 380, total: 396 },
  { id: "2", name: "CO2 气体保护焊机", calendar: 480, planned: 60, actual: 384, actualTakt: 55, theoryTakt: 48, good: 352, total: 384 },
  { id: "3", name: "三坐标测量机", calendar: 480, planned: 96, actual: 360, actualTakt: 120, theoryTakt: 105, good: 168, total: 172 },
  { id: "4", name: "激光切割机", calendar: 480, planned: 36, actual: 420, actualTakt: 65, theoryTakt: 58, good: 405, total: 420 },
  { id: "5", name: "气动扳手", calendar: 480, planned: 24, actual: 432, actualTakt: 12, theoryTakt: 10, good: 2100, total: 2160 },
  { id: "6", name: "氩弧焊机", calendar: 480, planned: 72, actual: 372, actualTakt: 60, theoryTakt: 52, good: 340, total: 372 },
];

function calcOEE(row: (typeof OEE_DATA)[number]) {
  const availability = row.actual / (row.calendar - row.planned);
  const performance = (row.theoryTakt * row.total) / (row.actual * 60);
  const quality = row.good / row.total;
  const oee = availability * performance * quality;
  return { availability, performance, quality, oee };
}

function oeeColor(v: number): string {
  if (v >= 0.85) return "#16845b";
  if (v >= 0.7) return "#d69e2e";
  return "#c93636";
}

export default function OeePage() {
  const enriched = OEE_DATA.map((row) => {
    const { availability, performance, quality, oee } = calcOEE(row);
    return { ...row, availability, performance, quality, oee };
  });

  const avgAvailability = enriched.reduce((s, r) => s + r.availability, 0) / enriched.length;
  const avgPerformance = enriched.reduce((s, r) => s + r.performance, 0) / enriched.length;
  const avgQuality = enriched.reduce((s, r) => s + r.quality, 0) / enriched.length;
  const avgOEE = avgAvailability * avgPerformance * avgQuality;

  const summaryItems = [
    { title: "时间开动率", value: avgAvailability, icon: <DashboardOutlined />, color: "#0b4f91" },
    { title: "性能开动率", value: avgPerformance, icon: <ThunderboltOutlined />, color: "#7c3aed" },
    { title: "合格品率", value: avgQuality, icon: <CheckCircleOutlined />, color: "#16845b" },
    { title: "OEE", value: avgOEE, icon: <AimOutlined />, color: oeeColor(avgOEE) },
  ];

  const columns = [
    { title: "设备名称", dataIndex: "name", key: "name", width: 180 },
    { title: "日历时间(h)", dataIndex: "calendar", key: "calendar", width: 100, align: "center" as const },
    { title: "计划停机(h)", dataIndex: "planned", key: "planned", width: 100, align: "center" as const },
    { title: "实际运行(h)", dataIndex: "actual", key: "actual", width: 100, align: "center" as const },
    { title: "产出节拍(s)", dataIndex: "actualTakt", key: "actualTakt", width: 100, align: "center" as const },
    { title: "理论节拍(s)", dataIndex: "theoryTakt", key: "theoryTakt", width: 100, align: "center" as const },
    { title: "合格数", dataIndex: "good", key: "good", width: 80, align: "center" as const },
    { title: "总数", dataIndex: "total", key: "total", width: 70, align: "center" as const },
    {
      title: "时间开动率",
      dataIndex: "availability",
      key: "availability",
      width: 110,
      align: "center" as const,
      render: (v: number) => <span style={{ fontWeight: 600 }}>{(v * 100).toFixed(1)}%</span>,
    },
    {
      title: "性能开动率",
      dataIndex: "performance",
      key: "performance",
      width: 110,
      align: "center" as const,
      render: (v: number) => <span style={{ fontWeight: 600 }}>{(v * 100).toFixed(1)}%</span>,
    },
    {
      title: "合格率",
      dataIndex: "quality",
      key: "quality",
      width: 90,
      align: "center" as const,
      render: (v: number) => <span style={{ fontWeight: 600 }}>{(v * 100).toFixed(1)}%</span>,
    },
    {
      title: "OEE",
      dataIndex: "oee",
      key: "oee",
      width: 100,
      align: "center" as const,
      render: (v: number) => <span style={{ fontWeight: 700, color: oeeColor(v) }}>{(v * 100).toFixed(1)}%</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="OEE 设备综合效率"
        description="基于时间开动率、性能开动率与合格品率三维度分析设备综合效率（Overall Equipment Effectiveness），识别产能损失瓶颈，驱动持续改善。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        {summaryItems.map((item) => (
          <Col xs={12} md={6} key={item.title}>
            <SurfaceCard compact>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Progress
                  type="circle"
                  percent={Math.round(item.value * 100)}
                  size={72}
                  strokeColor={item.color}
                  format={(p) => <span style={{ fontSize: 14, fontWeight: 700 }}>{p}%</span>}
                />
                <div>
                  <Statistic title={item.title} value={item.value * 100} precision={1} suffix="%" prefix={item.icon} valueStyle={{ color: item.color, fontSize: 20 }} />
                </div>
              </div>
            </SurfaceCard>
          </Col>
        ))}
      </Row>

      <SurfaceCard title="设备 OEE 明细" subtitle="按设备逐台计算时间开动率 × 性能开动率 × 合格品率 = OEE">
        <Table rowKey="id" size="small" pagination={false} columns={columns} dataSource={enriched} scroll={{ x: 1200 }} />
      </SurfaceCard>
    </>
  );
}
