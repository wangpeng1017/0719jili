"use client";

import { FilterOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Progress, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { projects } from "@/lib/demo-data";

const columns: ColumnsType<(typeof projects)[number]> = [
  {
    title: "项目",
    key: "project",
    width: 310,
    render: (_, record) => (
      <div>
        <Link href={`/projects/${record.id}`} style={{ color: "#0b4f91", fontWeight: 700 }}>{record.name}</Link>
        <div style={{ marginTop: 4, color: "#718096", fontFamily: "Fira Code, monospace", fontSize: 11 }}>{record.id} · {record.wbs}</div>
      </div>
    ),
  },
  { title: "类型", dataIndex: "type", key: "type", width: 105, render: (value) => <Tag>{value}</Tag> },
  { title: "车间", dataIndex: "workshop", key: "workshop", width: 110 },
  { title: "车辆", dataIndex: "vehicles", key: "vehicles", width: 75, render: (value) => `${value} 台` },
  { title: "责任人", dataIndex: "owner", key: "owner", width: 85 },
  { title: "承诺交付", dataIndex: "promisedAt", key: "promisedAt", width: 100 },
  { title: "进度", dataIndex: "progress", key: "progress", width: 155, render: (value) => <Progress percent={value} size="small" /> },
  { title: "状态", dataIndex: "status", key: "status", width: 95, render: (value) => <StatusPill status={value} /> },
  { title: "风险", dataIndex: "risk", key: "risk", width: 100, render: (value) => <Tag color={value === "正常" ? "green" : "gold"}>{value}</Tag> },
];

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="项目与任务台账"
        description="统一承接 TOCC 需求、WBS 和车辆范围，支持快速工单、标准改制项目与开发任务三类模式。"
        actions={<Button type="primary" icon={<PlusOutlined />}>新建任务</Button>}
      />
      <SurfaceCard compact>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input prefix={<SearchOutlined />} placeholder="项目名称 / WBS / 车辆" style={{ width: 280 }} />
          <Select defaultValue="all" style={{ width: 130 }} options={[{ value: "all", label: "全部类型" }, { value: "sm", label: "SM 改制" }, { value: "body", label: "车身改制" }, { value: "quick", label: "零星改制" }]} />
          <Select defaultValue="active" style={{ width: 130 }} options={[{ value: "active", label: "进行中" }, { value: "all", label: "全部状态" }, { value: "risk", label: "仅看风险" }]} />
          <Button icon={<FilterOutlined />}>更多筛选</Button>
        </Space>
        <Table columns={columns} dataSource={projects} rowKey="id" pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: 1120 }} />
      </SurfaceCard>
    </>
  );
}

