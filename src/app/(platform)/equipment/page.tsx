"use client";

import { ToolOutlined, CheckCircleOutlined, WarningOutlined, StopOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  running: { color: "green", label: "运行" },
  idle: { color: "blue", label: "空闲" },
  repair: { color: "orange", label: "维修" },
  disabled: { color: "red", label: "停用" },
};

const EQUIPMENT_LIST = [
  { id: "EQ-001", name: "双柱举升机 L1", type: "举升机", workshop: "总装车间", model: "QJY-4.0T", startDate: "2023-03-15", status: "running", owner: "陈师傅" },
  { id: "EQ-002", name: "双柱举升机 L2", type: "举升机", workshop: "总装车间", model: "QJY-4.0T", startDate: "2023-03-15", status: "running", owner: "陈师傅" },
  { id: "EQ-003", name: "双柱举升机 L1", type: "举升机", workshop: "准备车间", model: "QJY-5.0T", startDate: "2023-05-20", status: "idle", owner: "叶师傅" },
  { id: "EQ-004", name: "双柱举升机 L2", type: "举升机", workshop: "准备车间", model: "QJY-5.0T", startDate: "2023-05-20", status: "repair", owner: "叶师傅" },
  { id: "EQ-005", name: "CO2 气体保护焊机", type: "焊机", workshop: "焊接车间", model: "NBC-350", startDate: "2022-11-08", status: "running", owner: "王师傅" },
  { id: "EQ-006", name: "三坐标测量机", type: "测量设备", workshop: "检测中心", model: "Global S 07.10.07", startDate: "2022-09-01", status: "running", owner: "周工" },
  { id: "EQ-007", name: "激光切割机", type: "切割设备", workshop: "下料车间", model: "FiberCut-3015", startDate: "2023-01-10", status: "running", owner: "李师傅" },
  { id: "EQ-008", name: "气动扳手", type: "气动工具", workshop: "总装车间", model: "TW-3/4-850", startDate: "2024-02-18", status: "idle", owner: "张师傅" },
  { id: "EQ-009", name: "等离子切割机", type: "切割设备", workshop: "下料车间", model: "LGK-100", startDate: "2022-06-22", status: "disabled", owner: "李师傅" },
  { id: "EQ-010", name: "氩弧焊机", type: "焊机", workshop: "焊接车间", model: "WSE-315", startDate: "2023-08-30", status: "running", owner: "王师傅" },
];

export default function EquipmentPage() {
  const totalCount = EQUIPMENT_LIST.length;
  const runningCount = EQUIPMENT_LIST.filter((e) => e.status === "running").length;
  const repairCount = EQUIPMENT_LIST.filter((e) => e.status === "repair").length;
  const utilization = Math.round((runningCount / totalCount) * 100);

  const columns = [
    { title: "设备编号", dataIndex: "id", key: "id", width: 100, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12, color: "#0b4f91" }}>{v}</span> },
    { title: "设备名称", dataIndex: "name", key: "name", width: 160 },
    { title: "类型", dataIndex: "type", key: "type", width: 100, render: (v: string) => <Tag>{v}</Tag> },
    { title: "所属车间", dataIndex: "workshop", key: "workshop", width: 100 },
    { title: "规格型号", dataIndex: "model", key: "model", width: 150 },
    { title: "启用日期", dataIndex: "startDate", key: "startDate", width: 110 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (v: string) => {
        const s = STATUS_MAP[v];
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    { title: "负责人", dataIndex: "owner", key: "owner", width: 90 },
  ];

  return (
    <>
      <PageHeader
        title="设备台账"
        description="管理改装车间全部生产设备的注册信息、技术规格与生命周期状态，支撑设备利用率分析与预防性维护决策。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="设备总数" value={totalCount} suffix="台" prefix={<ToolOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="运行中" value={runningCount} suffix="台" prefix={<CheckCircleOutlined />} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="维修中" value={repairCount} suffix="台" prefix={<WarningOutlined />} valueStyle={{ color: "#d69e2e" }} />
          </SurfaceCard>
        </Col>
        <Col xs={12} md={6}>
          <SurfaceCard compact>
            <Statistic title="综合利用率" value={utilization} suffix="%" prefix={<StopOutlined />} valueStyle={{ color: utilization >= 70 ? "#16845b" : "#d69e2e" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="设备清单" subtitle="全部在册设备及其当前运行状态">
        <Table rowKey="id" size="small" pagination={false} columns={columns} dataSource={EQUIPMENT_LIST} scroll={{ x: 900 }} />
      </SurfaceCard>
    </>
  );
}
