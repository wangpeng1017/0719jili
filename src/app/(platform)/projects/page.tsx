"use client";

import { FilterOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Progress, Select, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type Project } from "@/lib/demo-store";

const typeOptions = [
  { value: "all", label: "全部类型" },
  { value: "SM 改制", label: "SM 改制" },
  { value: "车身改制", label: "车身改制" },
  { value: "零星改制", label: "零星改制" },
  { value: "开发任务", label: "开发任务" },
];

const statusOptions = [
  { value: "active", label: "进行中" },
  { value: "all", label: "全部状态" },
  { value: "risk", label: "仅看风险" },
];

const columns: ColumnsType<Project> = [
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
  const { state, dispatch } = useDemoStore();
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [createOpen, setCreateOpen] = useState(false);
  const [form] = Form.useForm();

  const filtered = useMemo(() => {
    return state.projects.filter((item) => {
      const term = keyword.trim().toLowerCase();
      const matchesKeyword = !term || item.name.toLowerCase().includes(term) || item.wbs.toLowerCase().includes(term) || item.id.toLowerCase().includes(term);
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" && item.status !== "completed") || (statusFilter === "risk" && item.risk !== "正常");
      return matchesKeyword && matchesType && matchesStatus;
    });
  }, [state.projects, keyword, typeFilter, statusFilter]);

  const submitCreate = async () => {
    const values = await form.validateFields();
    dispatch({
      type: "CREATE_PROJECT",
      payload: {
        name: values.name,
        type: values.type,
        workshop: values.workshop,
        owner: values.owner,
        promisedAt: values.promisedAt,
        vehicles: values.vehicles,
      },
    });
    message.success(`任务「${values.name}」已创建，进入准备中`);
    form.resetFields();
    setCreateOpen(false);
  };

  return (
    <>
      <PageHeader
        title="项目与任务台账"
        description="统一承接 TOCC 需求、WBS 和车辆范围，支持快速工单、标准改制项目与开发任务三类模式。"
        actions={<Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>新建任务</Button>}
      />
      <SurfaceCard compact>
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="项目名称 / WBS / 车辆"
            style={{ width: 280 }}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            allowClear
          />
          <Select value={typeFilter} style={{ width: 130 }} options={typeOptions} onChange={setTypeFilter} />
          <Select value={statusFilter} style={{ width: 130 }} options={statusOptions} onChange={setStatusFilter} />
          <Button icon={<FilterOutlined />} onClick={() => { setKeyword(""); setTypeFilter("all"); setStatusFilter("active"); }}>重置筛选</Button>
        </Space>
        <Table columns={columns} dataSource={filtered} rowKey="id" pagination={{ pageSize: 8, showSizeChanger: false }} scroll={{ x: 1120 }} />
      </SurfaceCard>

      <Modal title="新建改制任务" open={createOpen} onCancel={() => setCreateOpen(false)} onOk={submitCreate} okText="创建" cancelText="取消">
        <Form form={form} layout="vertical" initialValues={{ type: "SM 改制", vehicles: 1 }}>
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: "请输入项目名称" }]}>
            <Input placeholder="如：领克 900 冬季标定改制" />
          </Form.Item>
          <Form.Item name="type" label="任务类型" rules={[{ required: true }]}>
            <Select options={typeOptions.filter((item) => item.value !== "all")} />
          </Form.Item>
          <Form.Item name="workshop" label="主责车间" rules={[{ required: true, message: "请输入主责车间" }]}>
            <Input placeholder="如：管理车间" />
          </Form.Item>
          <Form.Item name="owner" label="责任人" rules={[{ required: true, message: "请输入责任人" }]}>
            <Input placeholder="如：王欣" />
          </Form.Item>
          <Form.Item name="vehicles" label="车辆数量" rules={[{ required: true }]}>
            <InputNumber min={1} max={99} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="promisedAt" label="承诺交付（MM-DD）" rules={[{ required: true, message: "请输入承诺交付日期" }]}>
            <Input placeholder="如：08-15" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
