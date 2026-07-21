"use client";

import { ApartmentOutlined, CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Progress, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface WbsNode {
  key: string;
  code: string;
  name: string;
  owner: string;
  duration: number;
  status: string;
  progress: number;
  children?: WbsNode[];
}

const WBS_DATA: WbsNode[] = [
  {
    key: "1",
    code: "PRJ-2026-SM-017",
    name: "银河E8智驾验证车改制",
    owner: "王欣",
    duration: 20,
    status: "进行中",
    progress: 45,
    children: [
      {
        key: "1-1",
        code: "1.0",
        name: "准备阶段",
        owner: "李明",
        duration: 3,
        status: "已完成",
        progress: 100,
        children: [
          { key: "1-1-1", code: "1.1", name: "方案评审与冻结", owner: "李明", duration: 1, status: "已完成", progress: 100 },
          { key: "1-1-2", code: "1.2", name: "物料齐套确认", owner: "张伟", duration: 1, status: "已完成", progress: 100 },
          { key: "1-1-3", code: "1.3", name: "工位/设备预约", owner: "赵刚", duration: 1, status: "已完成", progress: 100 },
        ],
      },
      {
        key: "1-2",
        code: "2.0",
        name: "拆解阶段",
        owner: "赵刚",
        duration: 4,
        status: "进行中",
        progress: 75,
        children: [
          { key: "1-2-1", code: "2.1", name: "内饰拆除", owner: "赵刚", duration: 1, status: "已完成", progress: 100 },
          { key: "1-2-2", code: "2.2", name: "线束拆除与标记", owner: "刘洋", duration: 1.5, status: "进行中", progress: 60 },
          { key: "1-2-3", code: "2.3", name: "底盘件拆除", owner: "赵刚", duration: 1.5, status: "待启动", progress: 0 },
        ],
      },
      {
        key: "1-3",
        code: "3.0",
        name: "装配阶段",
        owner: "刘洋",
        duration: 6,
        status: "待启动",
        progress: 0,
        children: [
          { key: "1-3-1", code: "3.1", name: "智驾传感器支架安装", owner: "刘洋", duration: 2, status: "待启动", progress: 0 },
          { key: "1-3-2", code: "3.2", name: "线束布置与接插", owner: "刘洋", duration: 2, status: "待启动", progress: 0 },
          { key: "1-3-3", code: "3.3", name: "ECU安装与刷写", owner: "陈磊", duration: 1, status: "待启动", progress: 0 },
          { key: "1-3-4", code: "3.4", name: "内饰恢复", owner: "赵刚", duration: 1, status: "待启动", progress: 0 },
        ],
      },
      {
        key: "1-4",
        code: "4.0",
        name: "检验阶段",
        owner: "张伟",
        duration: 4,
        status: "待启动",
        progress: 0,
        children: [
          { key: "1-4-1", code: "4.1", name: "功能点检", owner: "张伟", duration: 1.5, status: "待启动", progress: 0 },
          { key: "1-4-2", code: "4.2", name: "路试验证", owner: "张伟", duration: 1.5, status: "待启动", progress: 0 },
          { key: "1-4-3", code: "4.3", name: "数据回传校验", owner: "陈磊", duration: 1, status: "待启动", progress: 0 },
        ],
      },
      {
        key: "1-5",
        code: "5.0",
        name: "交付阶段",
        owner: "王欣",
        duration: 3,
        status: "待启动",
        progress: 0,
        children: [
          { key: "1-5-1", code: "5.1", name: "文档归档", owner: "李明", duration: 1, status: "待启动", progress: 0 },
          { key: "1-5-2", code: "5.2", name: "客户验收", owner: "王欣", duration: 1, status: "待启动", progress: 0 },
          { key: "1-5-3", code: "5.3", name: "车辆移交", owner: "王欣", duration: 1, status: "待启动", progress: 0 },
        ],
      },
    ],
  },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  已完成: { color: "success", icon: <CheckCircleOutlined /> },
  进行中: { color: "processing", icon: <SyncOutlined spin /> },
  待启动: { color: "default", icon: <ClockCircleOutlined /> },
};

const columns: ColumnsType<WbsNode> = [
  { title: "WBS编码", dataIndex: "code", key: "code", width: 140, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
  { title: "名称", dataIndex: "name", key: "name", width: 220 },
  { title: "负责人", dataIndex: "owner", key: "owner", width: 90 },
  { title: "计划工期(天)", dataIndex: "duration", key: "duration", width: 110, render: (v: number) => `${v} 天` },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 110,
    render: (v: string) => {
      const cfg = statusConfig[v] || statusConfig["待启动"];
      return <Tag color={cfg.color} icon={cfg.icon}>{v}</Tag>;
    },
  },
  {
    title: "完成度",
    dataIndex: "progress",
    key: "progress",
    width: 160,
    render: (v: number) => <Progress percent={v} size="small" status={v >= 100 ? "success" : "active"} />,
  },
];

export default function ProjectsWbsPage() {
  return (
    <>
      <PageHeader
        title="WBS 工作分解结构"
        description="将改制项目按阶段、工序、工步逐级分解为可执行、可追踪的工作包，明确责任人与工期，支撑进度管控与资源协调。"
        actions={<Tag color="blue" icon={<ApartmentOutlined />}>PRJ-2026-SM-017</Tag>}
      />

      <SurfaceCard
        title="工作分解结构树"
        subtitle="项目 → 阶段 → 工序 → 工步，展开查看层级明细"
      >
        <Table
          dataSource={WBS_DATA}
          columns={columns}
          rowKey="key"
          pagination={false}
          size="small"
          defaultExpandAllRows
          scroll={{ x: 830 }}
        />
      </SurfaceCard>
    </>
  );
}
