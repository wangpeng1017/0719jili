"use client";

import { DashboardOutlined, WarningOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

type SpcItem = {
  key: string;
  charNo: string;
  charName: string;
  process: string;
  usl: number;
  lsl: number;
  target: number;
  mean: number;
  std: number;
  cpk: number;
  status: "受控" | "预警" | "失控";
};

const spcData: SpcItem[] = [
  { key: "1", charNo: "KC-001", charName: "扭矩", process: "OP30 拧紧", usl: 120, lsl: 80, target: 100, mean: 101.2, std: 5.8, cpk: 1.15, status: "预警" },
  { key: "2", charNo: "KC-002", charName: "孔位偏差", process: "OP20 机加工", usl: 0.5, lsl: -0.5, target: 0, mean: 0.02, std: 0.08, cpk: 2.0, status: "受控" },
  { key: "3", charNo: "KC-003", charName: "面差", process: "OP50 装配", usl: 1.0, lsl: 0, target: 0.5, mean: 0.48, std: 0.12, cpk: 1.44, status: "受控" },
  { key: "4", charNo: "KC-004", charName: "间隙", process: "OP50 装配", usl: 2.0, lsl: 0.5, target: 1.2, mean: 1.18, std: 0.2, cpk: 1.37, status: "受控" },
  { key: "5", charNo: "KC-005", charName: "扭矩", process: "OP40 拧紧", usl: 55, lsl: 35, target: 45, mean: 44.1, std: 4.2, cpk: 0.87, status: "失控" },
  { key: "6", charNo: "KC-006", charName: "孔位偏差", process: "OP20 机加工", usl: 0.3, lsl: -0.3, target: 0, mean: 0.01, std: 0.05, cpk: 1.93, status: "受控" },
];

const statusColorMap: Record<string, string> = {
  "受控": "green",
  "预警": "orange",
  "失控": "red",
};

function cpkColor(cpk: number): string {
  if (cpk >= 1.33) return "#16845b";
  if (cpk >= 1.0) return "#d46b08";
  return "#c93636";
}

export default function QualitySpcPage() {
  const total = spcData.length;
  const controlled = spcData.filter((d) => d.status === "受控").length;
  const warning = spcData.filter((d) => d.status === "预警").length;
  const outOfControl = spcData.filter((d) => d.status === "失控").length;
  const controlledRate = total > 0 ? Math.round((controlled / total) * 1000) / 10 : 0;

  const columns = [
    { title: "特性编号", dataIndex: "charNo", key: "charNo", width: 100, render: (v: string) => <span style={{ color: "#0b4f91", fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
    { title: "特性名称", dataIndex: "charName", key: "charName", width: 100 },
    { title: "工序", dataIndex: "process", key: "process", width: 120 },
    { title: "规格上限", dataIndex: "usl", key: "usl", width: 90, align: "right" as const },
    { title: "规格下限", dataIndex: "lsl", key: "lsl", width: 90, align: "right" as const },
    { title: "目标值", dataIndex: "target", key: "target", width: 80, align: "right" as const },
    { title: "均值", dataIndex: "mean", key: "mean", width: 80, align: "right" as const },
    { title: "标准差", dataIndex: "std", key: "std", width: 80, align: "right" as const },
    {
      title: "Cpk",
      dataIndex: "cpk",
      key: "cpk",
      width: 80,
      align: "right" as const,
      render: (v: number) => <span style={{ fontWeight: 700, color: cpkColor(v) }}>{v.toFixed(2)}</span>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (v: string) => <Tag color={statusColorMap[v]}>{v}</Tag>,
    },
  ];

  return (
    <>
      <PageHeader
        title="SPC 统计过程控制"
        description="对关键特性（扭矩、孔位偏差、面差、间隙）进行统计过程控制，实时监控 Cpk 与过程状态，及时发现异常趋势并预警。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="监控特性数" value={total} prefix={<DashboardOutlined />} suffix="项" />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="受控率" value={controlledRate} prefix={<CheckCircleOutlined />} suffix="%" valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="预警数" value={warning} prefix={<WarningOutlined />} suffix="项" valueStyle={{ color: "#d46b08" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="失控数" value={outOfControl} prefix={<StopOutlined />} suffix="项" valueStyle={{ color: "#c93636" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="控制图监控项" subtitle="关键特性过程能力与状态一览">
        <Table rowKey="key" size="small" pagination={false} columns={columns} dataSource={spcData} scroll={{ x: 900 }} />
      </SurfaceCard>
    </>
  );
}
