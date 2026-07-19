"use client";

import { CheckCircleOutlined, ExportOutlined, PlusOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Select, Space, Statistic, Table, Tag } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { qualityIssues } from "@/lib/demo-data";

export default function QualityPage() {
  const [issues, setIssues] = useState(qualityIssues);
  const verify = (id: string) => {
    setIssues((items) => items.map((item) => item.id === id ? { ...item, status: "closed", action: `${item.action}；质量复验通过并关闭` } : item));
    message.success(`${id} 已复验关闭，交付门禁同步刷新`);
  };

  return (
    <>
      <PageHeader
        title="质量问题闭环"
        description="质量问题必须完成分类、责任分派、整改、复验和横展；未关闭问题无让步审批时，系统阻断终检和交付。"
        actions={<Space><Button icon={<ExportOutlined />}>导出问题清单</Button><Button type="primary" icon={<PlusOutlined />}>新建质量问题</Button></Space>}
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="未关闭问题" value={issues.filter((item) => item.status !== "closed").length} suffix="项" valueStyle={{ color: "#c93636" }} /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="整改中" value={issues.filter((item) => item.status === "rectifying").length} suffix="项" /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="待复验" value={issues.filter((item) => item.status === "verifying").length} suffix="项" valueStyle={{ color: "#087b83" }} /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="本月闭环率" value={91.4} suffix="%" valueStyle={{ color: "#16845b" }} /></SurfaceCard></Col>
      </Row>
      <SurfaceCard
        title="问题台账"
        subtitle="按项目、车辆、阶段、方案版本、物料和责任组织形成关联"
        extra={<Select defaultValue="all" style={{ width: 140 }} options={[{ value: "all", label: "全部分类" }, { value: "process", label: "制成问题" }, { value: "design", label: "设计/方案" }, { value: "supplier", label: "供应件" }]} />}
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
            { title: "操作", key: "actionButton", fixed: "right", width: 110, render: (_, record) => record.status === "verifying" ? <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => verify(record.id)}>复验通过</Button> : <Button size="small" icon={<SafetyCertificateOutlined />}>查看</Button> },
          ]}
        />
      </SurfaceCard>
    </>
  );
}

