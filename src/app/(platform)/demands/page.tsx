"use client";

import { App, Button, Col, Empty, Input, Modal, Row, Select, Space, Statistic, Table, Tag, Tooltip } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore } from "@/lib/demo-store";

const ASSIGNEE_OPTIONS = ["王欣", "李徐燕", "叶剑华", "单鑫磊"];

const TASK_TYPE_MAP: Record<string, string> = {
  standard: "标准改制",
  quick: "快速工单",
  development: "开发任务",
};

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  received: { color: "gold", label: "待受理" },
  accepted: { color: "green", label: "已受理" },
  rejected: { color: "red", label: "已退回" },
};

export default function DemandsPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const requests = state.demandRequests;

  const [acceptOpen, setAcceptOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const [assignee, setAssignee] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const receivedCount = useMemo(() => requests.filter((r) => r.status === "received").length, [requests]);
  const acceptedCount = useMemo(() => requests.filter((r) => r.status === "accepted").length, [requests]);
  const rejectedCount = useMemo(() => requests.filter((r) => r.status === "rejected").length, [requests]);

  const openAccept = (id: string) => {
    setActiveId(id);
    setAssignee("");
    setAcceptOpen(true);
  };

  const openReject = (id: string) => {
    setActiveId(id);
    setRejectReason("");
    setRejectOpen(true);
  };

  const handleAccept = () => {
    if (!assignee) {
      message.warning("请选择责任人");
      return;
    }
    dispatch({ type: "ACCEPT_DEMAND", payload: { requestId: activeId, assignee } });
    message.success(`需求 ${activeId} 已受理，责任人：${assignee}`);
    setAcceptOpen(false);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.warning("请填写退回原因");
      return;
    }
    dispatch({ type: "REJECT_DEMAND", payload: { requestId: activeId, reason: rejectReason.trim() } });
    message.success(`需求 ${activeId} 已退回`);
    setRejectOpen(false);
  };

  const columns = [
    { title: "需求单号", dataIndex: "id", key: "id", width: 160 },
    {
      title: "来源",
      dataIndex: "sourceSystem",
      key: "sourceSystem",
      width: 90,
      render: (value: string) => <Tag color={value === "TOCC" ? "blue" : "default"}>{value}</Tag>,
    },
    {
      title: "WBS",
      dataIndex: "wbsNo",
      key: "wbsNo",
      width: 150,
      render: (value: string) => value || "—",
    },
    { title: "项目名称", dataIndex: "projectName", key: "projectName" },
    { title: "车辆数", dataIndex: "vehicleCount", key: "vehicleCount", width: 80 },
    {
      title: "任务类型",
      dataIndex: "taskType",
      key: "taskType",
      width: 100,
      render: (value: string) => TASK_TYPE_MAP[value] ?? value,
    },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 90,
      render: (value: string) => {
        if (value === "high") return <Tag color="red">高</Tag>;
        if (value === "low") return <Tag>低</Tag>;
        return <Tag>普通</Tag>;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (value: string) => {
        const cfg = STATUS_MAP[value];
        return cfg ? <Tag color={cfg.color}>{cfg.label}</Tag> : value;
      },
    },
    {
      title: "责任人",
      dataIndex: "assignee",
      key: "assignee",
      width: 90,
      render: (value: string) => value || "—",
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      render: (_: unknown, record: (typeof requests)[number]) => {
        if (record.status === "received") {
          return (
            <Space>
              <Button size="small" type="primary" onClick={() => openAccept(record.id)}>受理</Button>
              <Button size="small" danger onClick={() => openReject(record.id)}>退回</Button>
            </Space>
          );
        }
        if (record.status === "rejected" && record.rejectReason) {
          return (
            <Tooltip title={record.rejectReason}>
              <Tag color="red">退回原因</Tag>
            </Tooltip>
          );
        }
        return null;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="需求承接 · 任务受理"
        description="TOCC/Excel 需求接收 → 分类 → 责任人分配 → 受理/退回，避免重复录入"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="待受理" value={receivedCount} valueStyle={{ color: "#d4a017" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="已受理" value={acceptedCount} valueStyle={{ color: "#52c41a" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="已退回" value={rejectedCount} valueStyle={{ color: "#ff4d4f" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="需求台账" subtitle="来自 TOCC 二期与 Excel 导入的改制需求">
        <Table
          rowKey="id"
          dataSource={requests}
          columns={columns}
          pagination={false}
          scroll={{ x: 1100 }}
          locale={{ emptyText: <Empty description="暂无需求" /> }}
        />
      </SurfaceCard>

      <Modal
        title="受理需求"
        open={acceptOpen}
        onOk={handleAccept}
        onCancel={() => setAcceptOpen(false)}
        okText="确认受理"
        cancelText="取消"
      >
        <p style={{ marginBottom: 12 }}>需求单号：<b>{activeId}</b></p>
        <Select
          style={{ width: "100%" }}
          placeholder="请选择责任人"
          value={assignee || undefined}
          onChange={setAssignee}
          options={ASSIGNEE_OPTIONS.map((name) => ({ label: name, value: name }))}
        />
      </Modal>

      <Modal
        title="退回需求"
        open={rejectOpen}
        onOk={handleReject}
        onCancel={() => setRejectOpen(false)}
        okText="确认退回"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p style={{ marginBottom: 12 }}>需求单号：<b>{activeId}</b></p>
        <Input.TextArea
          rows={3}
          placeholder="请填写退回原因"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </>
  );
}
