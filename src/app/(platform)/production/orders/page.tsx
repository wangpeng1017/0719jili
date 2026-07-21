"use client";

import { Table, Tag, Space, Badge } from "antd";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface WorkOrder {
  key: string;
  orderNo: string;
  project: string;
  vehicle: string;
  process: string;
  planQty: number;
  doneQty: number;
  status: "待排产" | "已下发" | "执行中" | "已完工" | "已关闭";
  planStart: string;
  planEnd: string;
  priority: "高" | "中" | "低";
}

const orders: WorkOrder[] = [
  {
    key: "1",
    orderNo: "WO-20250626-001",
    project: "银河E8 改装",
    vehicle: "银河E8 旗舰版",
    process: "底盘防护改装",
    planQty: 12,
    doneQty: 8,
    status: "执行中",
    planStart: "2025-06-20",
    planEnd: "2025-06-28",
    priority: "高",
  },
  {
    key: "2",
    orderNo: "WO-20250626-002",
    project: "银河E8 改装",
    vehicle: "银河E8 性能版",
    process: "电气系统升级",
    planQty: 8,
    doneQty: 8,
    status: "已完工",
    planStart: "2025-06-15",
    planEnd: "2025-06-25",
    priority: "高",
  },
  {
    key: "3",
    orderNo: "WO-20250626-003",
    project: "EX5 改装",
    vehicle: "EX5 标准版",
    process: "内饰包覆改造",
    planQty: 20,
    doneQty: 5,
    status: "执行中",
    planStart: "2025-06-22",
    planEnd: "2025-07-05",
    priority: "中",
  },
  {
    key: "4",
    orderNo: "WO-20250626-004",
    project: "领克900 改装",
    vehicle: "领克900 行政版",
    process: "座椅通风加热改装",
    planQty: 6,
    doneQty: 0,
    status: "已下发",
    planStart: "2025-06-27",
    planEnd: "2025-07-03",
    priority: "高",
  },
  {
    key: "5",
    orderNo: "WO-20250626-005",
    project: "领克900 改装",
    vehicle: "领克900 旗舰版",
    process: "空气悬架安装",
    planQty: 4,
    doneQty: 0,
    status: "待排产",
    planStart: "2025-07-01",
    planEnd: "2025-07-10",
    priority: "中",
  },
  {
    key: "6",
    orderNo: "WO-20250626-006",
    project: "银河E8 改装",
    vehicle: "银河E8 旗舰版",
    process: "外观套件安装",
    planQty: 15,
    doneQty: 15,
    status: "已关闭",
    planStart: "2025-06-10",
    planEnd: "2025-06-20",
    priority: "低",
  },
  {
    key: "7",
    orderNo: "WO-20250626-007",
    project: "EX5 改装",
    vehicle: "EX5 运动版",
    process: "制动系统升级",
    planQty: 10,
    doneQty: 3,
    status: "执行中",
    planStart: "2025-06-24",
    planEnd: "2025-07-02",
    priority: "高",
  },
  {
    key: "8",
    orderNo: "WO-20250626-008",
    project: "领克900 改装",
    vehicle: "领克900 行政版",
    process: "隔音降噪处理",
    planQty: 8,
    doneQty: 0,
    status: "待排产",
    planStart: "2025-07-05",
    planEnd: "2025-07-12",
    priority: "低",
  },
];

const statusColorMap: Record<WorkOrder["status"], string> = {
  待排产: "default",
  已下发: "processing",
  执行中: "warning",
  已完工: "success",
  已关闭: "default",
};

const priorityColorMap: Record<WorkOrder["priority"], string> = {
  高: "red",
  中: "orange",
  低: "green",
};

const columns: ColumnsType<WorkOrder> = [
  {
    title: "工单号",
    dataIndex: "orderNo",
    key: "orderNo",
    width: 170,
    render: (text: string) => (
      <Space>
        <FileTextOutlined style={{ color: "#1677ff" }} />
        <span style={{ fontFamily: "monospace" }}>{text}</span>
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
    title: "车辆",
    dataIndex: "vehicle",
    key: "vehicle",
    width: 150,
  },
  {
    title: "工序",
    dataIndex: "process",
    key: "process",
    width: 150,
  },
  {
    title: "计划数量",
    dataIndex: "planQty",
    key: "planQty",
    width: 90,
    align: "center",
  },
  {
    title: "完成数量",
    dataIndex: "doneQty",
    key: "doneQty",
    width: 90,
    align: "center",
    render: (val: number, record: WorkOrder) => (
      <span style={{ color: val >= record.planQty ? "#52c41a" : undefined }}>
        {val}
      </span>
    ),
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    align: "center",
    render: (status: WorkOrder["status"]) => (
      <Tag color={statusColorMap[status]}>{status}</Tag>
    ),
  },
  {
    title: "计划开始",
    dataIndex: "planStart",
    key: "planStart",
    width: 110,
  },
  {
    title: "计划完成",
    dataIndex: "planEnd",
    key: "planEnd",
    width: 110,
  },
  {
    title: "优先级",
    dataIndex: "priority",
    key: "priority",
    width: 80,
    align: "center",
    render: (p: WorkOrder["priority"]) => (
      <Tag color={priorityColorMap[p]}>{p}</Tag>
    ),
  },
];

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="工单管理"
        description="管理车辆改装工单全生命周期，涵盖排产、下发、执行、完工及关闭各阶段，实时掌握生产进度。"
      />
      <SurfaceCard
        title="工单列表"
        subtitle="当前共 8 条工单记录"
        extra={
          <Space>
            <Badge status="processing" text="执行中 3" />
            <Badge status="success" text="已完工 1" />
            <Badge status="default" text="待排产 2" />
          </Space>
        }
      >
        <Table<WorkOrder>
          columns={columns}
          dataSource={orders}
          pagination={false}
          size="middle"
          scroll={{ x: 1200 }}
        />
      </SurfaceCard>
    </div>
  );
}
