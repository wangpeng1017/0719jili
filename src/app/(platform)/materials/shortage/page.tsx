"use client";

import { AlertOutlined, ClockCircleOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  待催: { color: "red", label: "待催" },
  已催: { color: "orange", label: "已催" },
  在途: { color: "blue", label: "在途" },
  已到: { color: "green", label: "已到" },
  关闭: { color: "default", label: "关闭" },
};

const shortageData = [
  { key: "1", orderNo: "EXP-2026-0625-001", matCode: "MAT-STD-0061", name: "高压连接器(4P)", project: "E8-SM-017 电池包", required: 20, received: 8, gap: 12, dueDate: "2026-06-28", status: "待催", owner: "张采购", times: 0 },
  { key: "2", orderNo: "EXP-2026-0624-003", matCode: "MAT-STD-0072", name: "热管理管路总成", project: "E8-SM-017 热管理", required: 15, received: 10, gap: 5, dueDate: "2026-06-27", status: "已催", owner: "李采购", times: 2 },
  { key: "3", orderNo: "EXP-2026-0623-002", matCode: "MAT-ALC-0019", name: "电驱壳体(铸铝)", project: "E8-SM-018 电驱", required: 8, received: 4, gap: 4, dueDate: "2026-07-01", status: "在途", owner: "张采购", times: 3 },
  { key: "4", orderNo: "EXP-2026-0622-005", matCode: "MAT-STD-0088", name: "车身密封垫圈", project: "E8-SM-017 白车身", required: 200, received: 200, gap: 0, dueDate: "2026-06-25", status: "已到", owner: "王采购", times: 1 },
  { key: "5", orderNo: "EXP-2026-0620-001", matCode: "MAT-NEW-0025", name: "激光雷达安装支架", project: "E8-SM-018 智驾", required: 12, received: 6, gap: 6, dueDate: "2026-06-30", status: "已催", owner: "李采购", times: 1 },
  { key: "6", orderNo: "EXP-2026-0618-004", matCode: "MAT-STD-0045", name: "底盘护板螺栓(M10)", project: "E8-SM-017 底盘", required: 500, received: 500, gap: 0, dueDate: "2026-06-22", status: "关闭", owner: "王采购", times: 2 },
];

const columns = [
  { title: "催料单号", dataIndex: "orderNo", key: "orderNo", width: 160, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12, color: "#0b4f91" }}>{v}</span> },
  { title: "物料编码", dataIndex: "matCode", key: "matCode", width: 130, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
  { title: "物料名称", dataIndex: "name", key: "name", width: 150 },
  { title: "需求项目", dataIndex: "project", key: "project", width: 150 },
  { title: "需求数量", dataIndex: "required", key: "required", width: 90, align: "right" as const },
  { title: "已到位", dataIndex: "received", key: "received", width: 80, align: "right" as const },
  { title: "缺口", dataIndex: "gap", key: "gap", width: 70, align: "right" as const, render: (v: number) => <span style={{ color: v > 0 ? "#c93636" : "#16845b", fontWeight: 600 }}>{v}</span> },
  { title: "需求日期", dataIndex: "dueDate", key: "dueDate", width: 110 },
  { title: "催料状态", dataIndex: "status", key: "status", width: 90, render: (v: string) => { const cfg = STATUS_CONFIG[v] ?? { color: "default", label: v }; return <Tag color={cfg.color}>{cfg.label}</Tag>; } },
  { title: "责任人", dataIndex: "owner", key: "owner", width: 80 },
  { title: "催料次数", dataIndex: "times", key: "times", width: 80, align: "center" as const, render: (v: number) => <Tag color={v >= 3 ? "red" : v >= 1 ? "orange" : "default"}>{v} 次</Tag> },
];

export default function ShortagePage() {
  const totalShortage = shortageData.filter((item) => item.gap > 0).length;
  const urgentCount = shortageData.filter((item) => item.status === "待催" || (item.status === "已催" && item.gap > 0)).length;
  const arrivingThisWeek = shortageData.filter((item) => item.status === "在途").length;

  return (
    <>
      <PageHeader
        title="缺件催料"
        description="物料缺口跟踪与催料闭环管理，实时掌握缺件状态、催料进度与预计到货时间。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="缺件总数" value={totalShortage} suffix="项" prefix={<AlertOutlined />} valueStyle={{ color: "#c93636" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="紧急缺件" value={urgentCount} suffix="项" prefix={<ThunderboltOutlined />} valueStyle={{ color: "#d46b08" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="本周预计到货" value={arrivingThisWeek} suffix="项" prefix={<ClockCircleOutlined />} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="催料明细" subtitle="缺件催料单全量跟踪">
        <Table
          rowKey="key"
          size="small"
          pagination={false}
          dataSource={shortageData}
          columns={columns}
          scroll={{ x: 1200 }}
        />
      </SurfaceCard>
    </>
  );
}
