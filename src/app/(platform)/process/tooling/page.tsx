"use client";

import {
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleFilled,
  ToolOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { Col, Row, Space, Statistic, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface ToolingItem {
  key: string;
  toolingNo: string;
  name: string;
  type: "夹具" | "模具" | "量具" | "辅具";
  applicableProcess: string;
  location: string;
  status: "在用" | "空闲" | "维修" | "报废";
  lastCalibration: string;
  nextCalibration: string;
  calibrationStatus: "合格" | "即将到期" | "已过期";
}

const toolingData: ToolingItem[] = [
  { key: "1", toolingNo: "GZ-J-001", name: "电池包定位夹具", type: "夹具", applicableProcess: "电池包装配 OP-030", location: "A区-工位03", status: "在用", lastCalibration: "2024-05-20", nextCalibration: "2024-11-20", calibrationStatus: "合格" },
  { key: "2", toolingNo: "GZ-M-003", name: "前保险杠注塑模具", type: "模具", applicableProcess: "注塑成型 OP-005", location: "模具库-B12", status: "空闲", lastCalibration: "2024-04-15", nextCalibration: "2024-10-15", calibrationStatus: "合格" },
  { key: "3", toolingNo: "GZ-L-007", name: "扭矩扳手（数显）", type: "量具", applicableProcess: "全部紧固工序", location: "工具柜-C01", status: "在用", lastCalibration: "2024-06-01", nextCalibration: "2024-07-01", calibrationStatus: "即将到期" },
  { key: "4", toolingNo: "GZ-F-012", name: "线束插接辅助工具", type: "辅具", applicableProcess: "线束安装 OP-040", location: "A区-工位05", status: "在用", lastCalibration: "2024-03-10", nextCalibration: "2024-09-10", calibrationStatus: "合格" },
  { key: "5", toolingNo: "GZ-J-005", name: "雷达安装定位夹具", type: "夹具", applicableProcess: "雷达安装 OP-060", location: "B区-工位02", status: "维修", lastCalibration: "2024-02-28", nextCalibration: "2024-08-28", calibrationStatus: "合格" },
  { key: "6", toolingNo: "GZ-L-011", name: "间隙面差测量尺", type: "量具", applicableProcess: "外观检测 OP-080", location: "质检室-Q02", status: "空闲", lastCalibration: "2024-01-15", nextCalibration: "2024-06-15", calibrationStatus: "已过期" },
  { key: "7", toolingNo: "GZ-F-008", name: "密封胶涂布辅助支架", type: "辅具", applicableProcess: "涂胶工序 OP-050", location: "A区-工位06", status: "在用", lastCalibration: "2024-05-05", nextCalibration: "2024-11-05", calibrationStatus: "合格" },
  { key: "8", toolingNo: "GZ-M-006", name: "仪表板卡扣压装模具", type: "模具", applicableProcess: "内饰装配 OP-075", location: "模具库-B07", status: "报废", lastCalibration: "2023-11-20", nextCalibration: "—", calibrationStatus: "已过期" },
];

const typeColorMap: Record<ToolingItem["type"], string> = {
  夹具: "blue",
  模具: "purple",
  量具: "cyan",
  辅具: "geekblue",
};

const statusConfig: Record<ToolingItem["status"], { color: string; icon: React.ReactNode }> = {
  在用: { color: "success", icon: <CheckCircleFilled /> },
  空闲: { color: "default", icon: <ClockCircleFilled /> },
  维修: { color: "warning", icon: <ToolOutlined /> },
  报废: { color: "error", icon: <WarningFilled /> },
};

const calibrationConfig: Record<ToolingItem["calibrationStatus"], { color: string; icon: React.ReactNode }> = {
  合格: { color: "success", icon: <CheckCircleFilled /> },
  即将到期: { color: "warning", icon: <ExclamationCircleFilled /> },
  已过期: { color: "error", icon: <WarningFilled /> },
};

const columns: ColumnsType<ToolingItem> = [
  { title: "工装编号", dataIndex: "toolingNo", key: "toolingNo", width: 110 },
  { title: "名称", dataIndex: "name", key: "name", width: 180 },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 80,
    render: (type: ToolingItem["type"]) => <Tag color={typeColorMap[type]}>{type}</Tag>,
  },
  { title: "适用工序", dataIndex: "applicableProcess", key: "applicableProcess", width: 170 },
  { title: "存放位置", dataIndex: "location", key: "location", width: 120 },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 90,
    render: (status: ToolingItem["status"]) => {
      const cfg = statusConfig[status];
      return <Tag color={cfg.color} icon={cfg.icon}>{status}</Tag>;
    },
  },
  { title: "上次校验", dataIndex: "lastCalibration", key: "lastCalibration", width: 110 },
  { title: "下次校验", dataIndex: "nextCalibration", key: "nextCalibration", width: 110 },
  {
    title: "校验状态",
    dataIndex: "calibrationStatus",
    key: "calibrationStatus",
    width: 110,
    render: (status: ToolingItem["calibrationStatus"]) => {
      const cfg = calibrationConfig[status];
      return <Tag color={cfg.color} icon={cfg.icon}>{status}</Tag>;
    },
  },
];

export default function ToolingPage() {
  const totalTooling = toolingData.length;
  const inUse = toolingData.filter((t) => t.status === "在用").length;
  const calOk = toolingData.filter((t) => t.calibrationStatus === "合格").length;
  const calExpiring = toolingData.filter((t) => t.calibrationStatus === "即将到期").length;
  const calExpired = toolingData.filter((t) => t.calibrationStatus === "已过期").length;

  return (
    <>
      <PageHeader
        title="工装夹具管理"
        description="工装夹具全生命周期管理：涵盖夹具、模具、量具、辅具的台账、使用状态跟踪与校验周期管理，确保改制工序使用的工装均在有效校验期内。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} sm={6}>
          <SurfaceCard>
            <Statistic title="工装总数" value={totalTooling} suffix="件" prefix={<ToolOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={6}>
          <SurfaceCard>
            <Statistic title="在用" value={inUse} suffix="件" valueStyle={{ color: "#16845b" }} prefix={<CheckCircleFilled />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={6}>
          <SurfaceCard>
            <Statistic title="校验合格" value={calOk} suffix="件" valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={6}>
          <SurfaceCard>
            <Space direction="vertical" size={0}>
              <span style={{ color: "#6b7a8c", fontSize: 14 }}>校验预警</span>
              <Space size={12}>
                <span style={{ color: "#d48806", fontWeight: 600 }}>{calExpiring} 即将到期</span>
                <span style={{ color: "#cf1322", fontWeight: 600 }}>{calExpired} 已过期</span>
              </Space>
            </Space>
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="工装夹具台账" subtitle="校验过期或即将到期的工装禁止用于关键工序，请及时送检">
        <Table
          rowKey="key"
          size="small"
          columns={columns}
          dataSource={toolingData}
          pagination={false}
          scroll={{ x: 1100 }}
        />
      </SurfaceCard>
    </>
  );
}
