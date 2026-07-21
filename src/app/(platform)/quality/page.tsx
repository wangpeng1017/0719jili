"use client";

import { BranchesOutlined, CheckCircleOutlined, ExportOutlined, PlusOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Col, Descriptions, Empty, Form, Input, Modal, Row, Select, Space, Statistic, Table, Tag } from "antd";
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
  const [deploySource, setDeploySource] = useState<QualityIssue | null>(null);
  const [deployTargets, setDeployTargets] = useState<string[]>([]);
  const [form] = Form.useForm();

  const prototypeNos = useMemo(() => state.vehicles.map((v) => v.prototypeNo), [state.vehicles]);
  const deployCandidates = useMemo(
    () => (deploySource ? prototypeNos.filter((no) => no !== deploySource.vehicle) : []),
    [prototypeNos, deploySource]
  );
  const horizontalGroups = useMemo(() => {
    const sources = state.qualityIssues.filter((item) => item.horizontal);
    return sources.map((source) => ({
      source,
      linked: state.qualityIssues.filter((item) => item.sourceIssueNo === source.id),
    }));
  }, [state.qualityIssues]);

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

  const openDeploy = (issue: QualityIssue) => {
    setDeployTargets([]);
    setDeploySource(issue);
  };

  const confirmDeploy = () => {
    if (!deploySource) return;
    if (deployTargets.length === 0) {
      message.warning("请至少选择一台横展目标车辆");
      return;
    }
    dispatch({ type: "HORIZONTAL_DEPLOY", payload: { id: deploySource.id, vehicles: deployTargets } });
    message.success(`${deploySource.id} 已横展至同批 ${deployTargets.length} 台车`);
    setDeploySource(null);
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
            { title: "问题描述", key: "title", width: 270, render: (_, record) => <div><b>{record.title}</b><div style={{ marginTop: 4, color: "#718096", fontSize: 11, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>{record.vehicle}{record.horizontal && <Tag color="gold" style={{ marginInlineEnd: 0 }}>已横展</Tag>}{record.sourceIssueNo && <Tag color="purple" style={{ marginInlineEnd: 0 }}>横展自 {record.sourceIssueNo}</Tag>}</div></div> },
            { title: "分类", dataIndex: "category", key: "category", width: 130, render: (value) => <Tag>{value}</Tag> },
            { title: "等级", dataIndex: "severity", key: "severity", width: 70, render: (value) => <Tag color={value === "高" ? "red" : "gold"}>{value}</Tag> },
            { title: "责任人", dataIndex: "owner", key: "owner", width: 100 },
            { title: "截止", dataIndex: "due", key: "due", width: 100 },
            { title: "整改/复验", dataIndex: "action", key: "action", width: 280 },
            { title: "状态", dataIndex: "status", key: "status", width: 100, render: (value) => <StatusPill status={value} /> },
            { title: "操作", key: "actionButton", fixed: "right", width: 190, render: (_, record) => <Space size={6}>{record.status === "verifying" && <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => verify(record.id)}>复验通过</Button>}{!record.sourceIssueNo && record.status !== "closed" && <Button size="small" icon={<BranchesOutlined />} onClick={() => openDeploy(record)}>横展</Button>}<Button size="small" icon={<SafetyCertificateOutlined />} onClick={() => setDetail(record)}>查看</Button></Space> },
          ]}
        />
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard title="横展清单" subtitle="同源质量问题向同批次车辆横向展开，逐车自查关闭，避免同类问题重复发生">
        {horizontalGroups.length === 0 ? (
          <Empty description="暂无横展记录，对问题点击「横展」可向同批车辆展开" />
        ) : (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {horizontalGroups.map(({ source, linked }) => (
              <div key={source.id} style={{ border: "1px solid #e6ebf2", borderRadius: 10, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <BranchesOutlined style={{ color: "#d69e2e" }} />
                  <b>{source.id}</b>
                  <span style={{ color: "#5b6b7f" }}>{source.title}</span>
                  <Tag color="gold" style={{ marginInlineEnd: 0 }}>已横展 {linked.length} 台</Tag>
                </div>
                {linked.length === 0 ? (
                  <div style={{ color: "#a0aec0", fontSize: 12 }}>暂无横展子项</div>
                ) : (
                  <Space size={[8, 8]} wrap>
                    {linked.map((item) => (
                      <Tag key={item.id} color="purple" style={{ marginInlineEnd: 0 }}>{item.vehicle} · {item.id} · <StatusPill status={item.status} /></Tag>
                    ))}
                  </Space>
                )}
              </div>
            ))}
          </Space>
        )}
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

      <Modal
        title={`质量横展 · ${deploySource?.id ?? ""}`}
        open={Boolean(deploySource)}
        onCancel={() => setDeploySource(null)}
        onOk={confirmDeploy}
        okText="确认横展"
        cancelText="取消"
      >
        {deploySource && (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <div style={{ color: "#5b6b7f" }}>{deploySource.title}（{deploySource.vehicle}）将作为同源问题向以下同批次车辆横向展开自查。</div>
            <div style={{ marginBottom: 6 }}>选择横展目标车辆</div>
            <Checkbox.Group value={deployTargets} onChange={(values) => setDeployTargets(values as string[])} options={deployCandidates.map((no) => ({ value: no, label: no }))} style={{ display: "flex", flexDirection: "column", gap: 8 }} />
            {deployCandidates.length === 0 && <div style={{ color: "#a0aec0", fontSize: 12 }}>无其他可横展车辆</div>}
          </Space>
        )}
      </Modal>
    </>
  );
}
