"use client";

import { Table, Tag, Space, Row, Col, Statistic, Card } from "antd";
import {
  CarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface WipItem {
  key: string;
  vehicleNo: string;
  project: string;
  currentProcess: string;
  station: string;
  stayDuration: string;
  status: "加工中" | "等待" | "检验" | "转运";
  operator: string;
  startTime: string;
}

const wipData: WipItem[] = [
  {
    key: "1",
    vehicleNo: "VIN-E8-20250618-003",
    project: "银河E8 改装",
    currentProcess: "底盘防护改装",
    station: "A-03 底盘工位",
    stayDuration: "2h 15min",
    status: "加工中",
    operator: "张伟",
    startTime: "2025-06-26 08:30",
  },
  {
    key: "2",
    vehicleNo: "VIN-E8-20250619-007",
    project: "银河E8 改装",
    currentProcess: "电气系统升级",
    station: "B-01 电气工位",
    stayDuration: "4h 40min",
    status: "等待",
    operator: "李强",
    startTime: "2025-06-26 06:15",
  },
  {
    key: "3",
    vehicleNo: "VIN-EX5-20250620-012",
    project: "EX5 改装",
    currentProcess: "内饰包覆改造",
    station: "C-02 内饰工位",
    stayDuration: "1h 05min",
    status: "加工中",
    operator: "王芳",
    startTime: "2025-06-26 09:50",
  },
  {
    key: "4",
    vehicleNo: "VIN-900-20250621-001",
    project: "领克900 改装",
    currentProcess: "座椅通风加热改装",
    station: "C-05 座椅工位",
    stayDuration: "0h 45min",
    status: "检验",
    operator: "赵敏",
    startTime: "2025-06-26 10:10",
  },
  {
    key: "5",
    vehicleNo: "VIN-EX5-20250622-008",
    project: "EX5 改装",
    currentProcess: "制动系统升级",
    station: "A-01 制动工位",
    stayDuration: "3h 20min",
    status: "加工中",
    operator: "陈刚",
    startTime: "2025-06-26 07:35",
  },
  {
    key: "6",
    vehicleNo: "VIN-900-20250623-004",
    project: "领克900 改装",
    currentProcess: "隔音降噪处理",
    station: "D-01 转运区",
    stayDuration: "0h 20min",
    status: "转运",
    operator: "刘洋",
    startTime: "2025-06-26 10:35",
  },
];

const statusColorMap: Record<WipItem["status"], string> = {
  加工中: "processing",
  等待: "warning",
  检验: "success",
  转运: "default",
};

const columns: ColumnsType<WipItem> = [
  {
    title: "车辆编号",
    dataIndex: "vehicleNo",
    key: "vehicleNo",
    width: 190,
    render: (text: string) => (
      <Space>
        <CarOutlined style={{ color: "#1677ff" }} />
        <span style={{ fontFamily: "monospace", fontSize: 12 }}>{text}</span>
      </Space>
    ),
  },
  {
    title: "项目",
    dataIndex: "project",
    key: "project",
    width: 120,
  },
  {
    title: "当前工序",
    dataIndex: "currentProcess",
    key: "currentProcess",
    width: 150,
  },
  {
    title: "工位",
    dataIndex: "station",
    key: "station",
    width: 130,
  },
  {
    title: "停留时长",
    dataIndex: "stayDuration",
    key: "stayDuration",
    width: 100,
    align: "center",
    render: (text: string) => {
      const hours = parseInt(text);
      return (
        <span style={{ color: hours >= 4 ? "#ff4d4f" : undefined, fontWeight: hours >= 4 ? 600 : 400 }}>
          {text}
        </span>
      );
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 90,
    align: "center",
    render: (status: WipItem["status"]) => (
      <Tag color={statusColorMap[status]}>{status}</Tag>
    ),
  },
  {
    title: "操作工",
    dataIndex: "operator",
    key: "operator",
    width: 80,
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    key: "startTime",
    width: 150,
  },
];

export default function WipPage() {
  return (
    <div>
      <PageHeader
        title="在制品跟踪"
        description="实时追踪各改装车辆在产状态，监控工序停留时长，及时发现超时预警，确保生产节拍正常。"
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="总在制品数"
              value={6}
              prefix={<CarOutlined />}
              suffix="台"
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="平均停留时长"
              value={2.08}
              precision={1}
              prefix={<ClockCircleOutlined />}
              suffix="小时"
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="超时预警数"
              value={1}
              prefix={<WarningOutlined />}
              suffix="台"
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <SurfaceCard
        title="在制品明细"
        subtitle="当前产线在制车辆实时状态"
        extra={
          <Space>
            <Tag color="processing">加工中 3</Tag>
            <Tag color="warning">等待 1</Tag>
            <Tag color="success">检验 1</Tag>
            <Tag>转运 1</Tag>
          </Space>
        }
      >
        <Table<WipItem>
          columns={columns}
          dataSource={wipData}
          pagination={false}
          size="middle"
          scroll={{ x: 1100 }}
        />
      </SurfaceCard>
    </div>
  );
}
