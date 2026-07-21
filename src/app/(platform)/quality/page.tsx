"use client";

import { CheckCircleOutlined, ExportOutlined, PlusOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { App, Button, Col, Descriptions, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { downloadCsv } from "@/lib/export";
import { useDemoStore, type QualityIssue } from "@/lib/demo-store";

const categoryOptions = [
  { value: "all", label: "全部分类" },
  { value: "制成问题", label: "制成问题" },
  { value: "设计/方案问题", label: "设计/方案" },
  { value: "供应件问题", label: "供应件" },
];

export default function QualityPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const [category, setCategory] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<QualityIssue | null>(null);
  const [form] = Form.useForm();

  const issues = useMemo(
    () => state.qualityIssues.filter((item) => category === "all" || item.category === category),
    [state.qualityIssues, category]
  );

  const verify = (id: string) => {
    dispatch({ type: "VERIFY_QUALITY_ISSUE", id });
    message.success(`${id} 已复验关闭，交付门禁同步刷新`);
  };

  const exportIssues = () => {
    downloadCsv(
      `质量问题清单-${new Date().toISOString().slice(0, 10)}.csv`,
      ["编号", "问题描述", "分类", "等级", "责任人", "截止", "整改/复验", "状态"],
      state.qualityIssues.map((item) => [item.id, item.title, item.category, item.severity, item.owner, item.due, item.action, item.status])
    );
    message.success(`已导出 ${state.qualityIssues.length} 条质量问题`);
  };

  const submitCreate = async () => {
    const values = await form.validateFields();
    dispatch({ type: "CREATE_QUALITY_ISSUE", payload: values });
    message.success("新质量问题已建立，进入整改流程");
    form.resetFields();
    setCreateOpen(false);
  };

  return (
    <>
      <PageHeader
        title="质量问题闭环"
        description="质量问题必须完成分类、责任分派、整改、复验和横展；未关闭问题无让步审批时，系统阻断终检和交付。"
        actions={<Space><Button icon={<ExportOutlined />} onClick={exportIssues}>导出问题清单</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>新建质量问题</Button></Space>}
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="未关闭问题" value={state.qualityIssues.filter((item) => item.status !== "closed").length} suffix="项" valueStyle={{ color: "#c93636" }} /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="整改中" value={state.qualityIssues.filter((item) => item.status === "rectifying").length} suffix="项" /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="待复验" value={state.qualityIssues.filter((item) => item.status === "verifying").length} suffix="项" valueStyle={{ color: "#087b83" }} /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="本月闭环率" value={91.4} suffix="%" valueStyle={{ color: "#16845b" }} /></SurfaceCard></Col>
      </Row>
      <SurfaceCard
        title="问题台账"
        subtitle="按项目、车辆、阶段、方案版本、物料和责任组织形成关联"
        extra={<Select value={category} style={{ width: 140 }} options={categoryOptions} onChange={setCategory} />}
      >
        <Table
          rowKey="id"
          dataSource={issues}
          pagination={false}
          scroll={{ x: 1080 }}
          columns={[
            { title: "问题编号", dataIndex: "id", key: "id", width: 150, render: (value) => <span style={{ color: "#0b4f91", fontFamily: "Fira Code, monospace", fontSize: 12 }}>{value}</span> },
            { title: "问题描述", key: "title", width: 270, render: (_, record) => <div><b>{record.title}</b><div style={{ marginTop: 4, color: "#718096", fontSize: 11 }}>{record.vehicle}</div></div> },
            { title: "分类", dataIndex: "category", key: "category", width: 130, render: (value) => <Tag>{value}</Tag> },
            { title: "等级", dataIndex: "severity", key: "severity", width: 70, render: (value) => <Tag color={value === "高" ? "red" : "gold"}>{value}</Tag> },
            { title: "责任人", dataIndex: "owner", key: "owner", width: 100 },
            { title: "截止", dataIndex: "due", key: "due", width: 100 },
            { title: "整改/复验", dataIndex: "action", key: "action", width: 280 },
            { title: "状态", dataIndex: "status", key: "status", width: 100, render: (value) => <StatusPill status={value} /> },
            { title: "操作", key: "actionButton", fixed: "right", width: 110, render: (_, record) => record.status === "verifying" ? <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => verify(record.id)}>复验通过</Button> : <Button size="small" icon={<SafetyCertificateOutlined />} onClick={() => setDetail(record)}>查看</Button> },
          ]}
        />
      </SurfaceCard>

      <Modal title="新建质量问题" open={createOpen} onCancel={() => setCreateOpen(false)} onOk={submitCreate} okText="创建" cancelText="取消">
        <Form form={form} layout="vertical" initialValues={{ category: "制成问题", severity: "中", vehicle: "E8-SM-017-01" }}>
          <Form.Item name="title" label="问题描述" rules={[{ required: true, message: "请输入问题描述" }]}>
            <Input placeholder="如：线束卡扣松动" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select options={categoryOptions.filter((item) => item.value !== "all")} />
          </Form.Item>
          <Form.Item name="vehicle" label="车辆" rules={[{ required: true, message: "请输入车辆编号" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="severity" label="等级" rules={[{ required: true }]}>
            <Select options={[{ value: "高", label: "高" }, { value: "中", label: "中" }, { value: "低", label: "低" }]} />
          </Form.Item>
          <Form.Item name="owner" label="责任人" rules={[{ required: true, message: "请输入责任人" }]}>
            <Input placeholder="如：张工" />
          </Form.Item>
          <Form.Item name="due" label="截止" rules={[{ required: true, message: "请输入截止时间" }]}>
            <Input placeholder="如：今天 18:00" />
          </Form.Item>
          <Form.Item name="action" label="整改措施" rules={[{ required: true, message: "请输入整改措施" }]}>
            <Input.TextArea rows={2} placeholder="如：更换支架并复验" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={detail?.id} open={Boolean(detail)} onCancel={() => setDetail(null)} footer={<Button onClick={() => setDetail(null)}>关闭</Button>}>
        {detail && (
          <Descriptions column={1} size="small" items={[
            { key: "title", label: "问题描述", children: detail.title },
            { key: "category", label: "分类", children: detail.category },
            { key: "vehicle", label: "车辆", children: detail.vehicle },
            { key: "severity", label: "等级", children: detail.severity },
            { key: "owner", label: "责任人", children: detail.owner },
            { key: "due", label: "截止", children: detail.due },
            { key: "action", label: "整改/复验", children: detail.action },
            { key: "status", label: "状态", children: <StatusPill status={detail.status} /> },
          ]} />
        )}
      </Modal>
    </>
  );
}
