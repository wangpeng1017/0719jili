"use client";

import {
  CheckCircleFilled,
  ClockCircleFilled,
  ExclamationCircleFilled,
  InboxOutlined,
  ShoppingOutlined,
  SwapOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Col, Progress, Row, Space, Statistic, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface BomItem {
  key: string;
  materialCode: string;
  materialName: string;
  spec: string;
  unit: string;
  requiredQty: number;
  receivedQty: number;
  type: "新增件" | "替换件" | "拆除件" | "保留件";
  source: "采购" | "调拨" | "拆车" | "新开";
  status: "已齐套" | "部分到位" | "待采购" | "待拆车";
}

const bomData: BomItem[] = [
  { key: "1", materialCode: "ZJ-2024-001", materialName: "电池包支架总成", spec: "Q235B / 1200×800×150mm", unit: "套", requiredQty: 2, receivedQty: 2, type: "新增件", source: "采购", status: "已齐套" },
  { key: "2", materialCode: "XS-2024-015", materialName: "高压线束总成", spec: "95mm² / 橙色 / 3.5m", unit: "根", requiredQty: 4, receivedQty: 4, type: "新增件", source: "采购", status: "已齐套" },
  { key: "3", materialCode: "LD-2024-008", materialName: "毫米波雷达", spec: "77GHz / 前向 / 210m", unit: "个", requiredQty: 1, receivedQty: 0, type: "新增件", source: "采购", status: "待采购" },
  { key: "4", materialCode: "KZ-2024-022", materialName: "整车控制器 VCU", spec: "32bit / AUTOSAR / IP67", unit: "个", requiredQty: 1, receivedQty: 1, type: "替换件", source: "调拨", status: "已齐套" },
  { key: "5", materialCode: "LS-2024-031", materialName: "六角法兰面螺栓", spec: "M8×25 / 8.8级 / 镀锌", unit: "颗", requiredQty: 48, receivedQty: 30, type: "新增件", source: "采购", status: "部分到位" },
  { key: "6", materialCode: "JG-2024-005", materialName: "前保险杠骨架", spec: "PP+EPDM / 黑色 / 改款", unit: "件", requiredQty: 1, receivedQty: 0, type: "替换件", source: "新开", status: "待采购" },
  { key: "7", materialCode: "CD-2024-012", materialName: "原车收音机天线", spec: "AM/FM / 鲨鱼鳍式", unit: "根", requiredQty: 1, receivedQty: 1, type: "拆除件", source: "拆车", status: "已齐套" },
  { key: "8", materialCode: "XS-2024-019", materialName: "低压信号线束", spec: "0.5mm² / 12芯 / 屏蔽", unit: "根", requiredQty: 6, receivedQty: 6, type: "新增件", source: "采购", status: "已齐套" },
  { key: "9", materialCode: "DG-2024-003", materialName: "动力电池模组", spec: "NCM811 / 102Ah / 3.7V", unit: "个", requiredQty: 8, receivedQty: 0, type: "新增件", source: "拆车", status: "待拆车" },
  { key: "10", materialCode: "BJ-2024-027", materialName: "原车仪表板总成", spec: "保留原车 / 不更换", unit: "套", requiredQty: 1, receivedQty: 1, type: "保留件", source: "拆车", status: "已齐套" },
];

const typeColorMap: Record<BomItem["type"], string> = {
  新增件: "blue",
  替换件: "orange",
  拆除件: "red",
  保留件: "default",
};

const sourceIconMap: Record<BomItem["source"], React.ReactNode> = {
  采购: <ShoppingOutlined />,
  调拨: <SwapOutlined />,
  拆车: <ToolOutlined />,
  新开: <InboxOutlined />,
};

const statusConfig: Record<BomItem["status"], { color: string; icon: React.ReactNode }> = {
  已齐套: { color: "success", icon: <CheckCircleFilled /> },
  部分到位: { color: "warning", icon: <ExclamationCircleFilled /> },
  待采购: { color: "processing", icon: <ClockCircleFilled /> },
  待拆车: { color: "default", icon: <ClockCircleFilled /> },
};

const columns: ColumnsType<BomItem> = [
  { title: "物料编码", dataIndex: "materialCode", key: "materialCode", width: 130 },
  { title: "物料名称", dataIndex: "materialName", key: "materialName", width: 160 },
  { title: "规格型号", dataIndex: "spec", key: "spec", width: 220 },
  { title: "单位", dataIndex: "unit", key: "unit", width: 60, align: "center" },
  { title: "需求数量", dataIndex: "requiredQty", key: "requiredQty", width: 90, align: "center" },
  {
    title: "已到位",
    dataIndex: "receivedQty",
    key: "receivedQty",
    width: 90,
    align: "center",
    render: (val: number, record: BomItem) => (
      <span style={{ color: val >= record.requiredQty ? "#16845b" : val > 0 ? "#d48806" : "#cf1322", fontWeight: 600 }}>
        {val}
      </span>
    ),
  },
  {
    title: "类型",
    dataIndex: "type",
    key: "type",
    width: 90,
    render: (type: BomItem["type"]) => <Tag color={typeColorMap[type]}>{type}</Tag>,
  },
  {
    title: "来源",
    dataIndex: "source",
    key: "source",
    width: 90,
    render: (source: BomItem["source"]) => (
      <Space size={4}>{sourceIconMap[source]}<span>{source}</span></Space>
    ),
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 110,
    render: (status: BomItem["status"]) => {
      const cfg = statusConfig[status];
      return <Tag color={cfg.color} icon={cfg.icon}>{status}</Tag>;
    },
  },
];

export default function BomPage() {
  const totalItems = bomData.length;
  const readyItems = bomData.filter((item) => item.status === "已齐套").length;
  const kitRate = Math.round((readyItems / totalItems) * 100);
  const totalRequired = bomData.reduce((sum, item) => sum + item.requiredQty, 0);
  const totalReceived = bomData.reduce((sum, item) => sum + item.receivedQty, 0);

  return (
    <>
      <PageHeader
        title="改制 BOM"
        description="改制物料清单管理：跟踪每台改制车辆所需物料的编码、规格、数量及到位情况，支持新增件、替换件、拆除件与保留件分类，确保齐套后开工。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="总物料数" value={totalItems} suffix="项" prefix={<InboxOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="总需求量 / 已到位" value={totalReceived} suffix={`/ ${totalRequired}`} prefix={<SwapOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <div style={{ marginBottom: 4, color: "#6b7a8c", fontSize: 14 }}>齐套率</div>
            <Progress
              percent={kitRate}
              status={kitRate === 100 ? "success" : "active"}
              strokeColor={kitRate === 100 ? "#16845b" : "#0b4f91"}
              format={(pct) => `${pct}%（${readyItems}/${totalItems}）`}
            />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="改制物料清单" subtitle="按改制任务单关联，齐套率 100% 后方可下发开工">
        <Table
          rowKey="key"
          size="small"
          columns={columns}
          dataSource={bomData}
          pagination={false}
          scroll={{ x: 1100 }}
        />
      </SurfaceCard>
    </>
  );
}
