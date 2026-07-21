"use client";

import { App, Button, Col, Empty, Input, Modal, Row, Space, Statistic, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type DeliveryRecord } from "@/lib/demo-store";

export default function DeliveryPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();

  const [signoffTarget, setSignoffTarget] = useState<DeliveryRecord | null>(null);
  const [signoffBy, setSignoffBy] = useState("");
  const [repairTarget, setRepairTarget] = useState<DeliveryRecord | null>(null);
  const [repairReason, setRepairReason] = useState("");
  const [repairDescription, setRepairDescription] = useState("");

  const pendingCount = useMemo(
    () => state.deliveryRecords.filter((d) => d.status === "pending_acceptance").length,
    [state.deliveryRecords]
  );
  const deliveredCount = useMemo(
    () => state.deliveryRecords.filter((d) => d.status === "delivered").length,
    [state.deliveryRecords]
  );
  const repairCount = useMemo(
    () => state.returnRepairs.filter((r) => r.status !== "completed").length,
    [state.returnRepairs]
  );

  const openSignoff = (record: DeliveryRecord) => {
    setSignoffBy("");
    setSignoffTarget(record);
  };

  const confirmSignoff = () => {
    if (!signoffTarget) return;
    if (!signoffBy.trim()) {
      message.warning("请输入签收人");
      return;
    }
    dispatch({ type: "SIGN_OFF_DELIVERY", payload: { deliveryId: signoffTarget.id, signOffBy: signoffBy.trim() } });
    message.success(`${signoffTarget.id} 已签收确认，交付归档完成`);
    setSignoffTarget(null);
  };

  const syncTocc = (record: DeliveryRecord) => {
    dispatch({ type: "SYNC_DELIVERY_TOCC", deliveryId: record.id });
    message.success(`${record.id} 交付状态已回写 TOCC`);
  };

  const openRepair = (record: DeliveryRecord) => {
    setRepairReason("");
    setRepairDescription("");
    setRepairTarget(record);
  };

  const confirmRepair = () => {
    if (!repairTarget) return;
    if (!repairReason.trim()) {
      message.warning("请输入返修原因");
      return;
    }
    dispatch({
      type: "CREATE_RETURN_REPAIR",
      payload: {
        deliveryId: repairTarget.id,
        vehicleId: repairTarget.vehicleId,
        reason: repairReason.trim(),
        description: repairDescription.trim(),
      },
    });
    message.success(`已为 ${repairTarget.vehicleId} 发起返修回流`);
    setRepairTarget(null);
  };

  const deliveryColumns = [
    { title: "交付单号", dataIndex: "id", key: "id", width: 150, render: (v: string) => <span style={{ color: "#0b4f91", fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
    { title: "车辆", dataIndex: "vehicleId", key: "vehicleId", width: 100 },
    { title: "项目", dataIndex: "projectId", key: "projectId", width: 150 },
    { title: "交付包摘要", dataIndex: "packageSummary", key: "packageSummary", ellipsis: true },
    { title: "客户", dataIndex: "customerName", key: "customerName", width: 140 },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) =>
        status === "pending_acceptance" ? <Tag color="gold">待验收</Tag> : <Tag color="green">已交付</Tag>,
    },
    { title: "签收人", dataIndex: "signOffBy", key: "signOffBy", width: 90, render: (v: string) => v || <span style={{ color: "#a0aec0" }}>—</span> },
    {
      title: "TOCC回写",
      dataIndex: "toccSynced",
      key: "toccSynced",
      width: 90,
      render: (v: boolean) => (v ? <Tag color="green">已回写</Tag> : <Tag>未回写</Tag>),
    },
    {
      title: "操作",
      key: "action",
      width: 220,
      render: (_: unknown, record: DeliveryRecord) => (
        <Space size={6}>
          {record.status === "pending_acceptance" && (
            <>
              <Button size="small" type="primary" onClick={() => openSignoff(record)}>签收确认</Button>
              <Button size="small" disabled>TOCC回写</Button>
            </>
          )}
          {record.status === "delivered" && !record.toccSynced && (
            <Button size="small" onClick={() => syncTocc(record)}>TOCC回写</Button>
          )}
          {record.status === "delivered" && (
            <Button size="small" onClick={() => openRepair(record)}>发起返修</Button>
          )}
        </Space>
      ),
    },
  ];

  const repairStatusMap: Record<string, { color: string; label: string }> = {
    open: { color: "red", label: "待处理" },
    in_progress: { color: "gold", label: "处理中" },
    completed: { color: "green", label: "已完成" },
  };

  const repairColumns = [
    { title: "返修单号", dataIndex: "id", key: "id", width: 150, render: (v: string) => <span style={{ color: "#0b4f91", fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
    { title: "关联交付", dataIndex: "deliveryId", key: "deliveryId", width: 150 },
    { title: "车辆", dataIndex: "vehicleId", key: "vehicleId", width: 100 },
    { title: "原因", dataIndex: "reason", key: "reason", ellipsis: true },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) => {
        const cfg = repairStatusMap[status] ?? { color: "default", label: status };
        return <Tag color={cfg.color}>{cfg.label}</Tag>;
      },
    },
    { title: "责任人", dataIndex: "assignee", key: "assignee", width: 100, render: (v: string) => v || <span style={{ color: "#a0aec0" }}>待分配</span> },
  ];

  return (
    <>
      <PageHeader
        title="交付归档 · 返修回流"
        description="车辆交付验收后生成完整归档包（需求、方案、物料、报工、质检、问题闭环），签收状态回写 TOCC；客户反馈问题可发起返修回流，形成售后闭环。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="待验收" value={pendingCount} suffix="单" valueStyle={{ color: "#d69e2e" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="已交付" value={deliveredCount} suffix="单" valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="返修中" value={repairCount} suffix="单" valueStyle={{ color: "#c93636" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="交付记录" subtitle="验收签收 → 归档包生成 → TOCC 状态回写">
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          columns={deliveryColumns}
          dataSource={state.deliveryRecords}
          scroll={{ x: 1080 }}
          locale={{ emptyText: <Empty description="暂无交付记录" /> }}
        />
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard title="返修回流" subtitle="客户反馈问题回流至改制流程，修复后重新交付">
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          columns={repairColumns}
          dataSource={state.returnRepairs}
          scroll={{ x: 820 }}
          locale={{ emptyText: <Empty description="暂无返修记录" /> }}
        />
      </SurfaceCard>

      <Modal
        title={`签收确认 · ${signoffTarget?.id ?? ""}`}
        open={!!signoffTarget}
        onCancel={() => setSignoffTarget(null)}
        onOk={confirmSignoff}
        okText="确认签收"
        cancelText="取消"
      >
        {signoffTarget && (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <div style={{ color: "#5b6b7f" }}>
              车辆 {signoffTarget.vehicleId} · 客户 {signoffTarget.customerName}
            </div>
            <div style={{ color: "#6b7a8c", fontSize: 12 }}>
              交付包：{signoffTarget.packageSummary}
            </div>
            <div>
              <div style={{ marginBottom: 6 }}>签收人</div>
              <Input
                placeholder="请输入签收人姓名"
                value={signoffBy}
                onChange={(e) => setSignoffBy(e.target.value)}
              />
            </div>
          </Space>
        )}
      </Modal>

      <Modal
        title={`发起返修 · ${repairTarget?.vehicleId ?? ""}`}
        open={!!repairTarget}
        onCancel={() => setRepairTarget(null)}
        onOk={confirmRepair}
        okText="确认发起返修"
        cancelText="取消"
      >
        {repairTarget && (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <div style={{ color: "#5b6b7f" }}>
              关联交付 {repairTarget.id} · 车辆 {repairTarget.vehicleId}
            </div>
            <div>
              <div style={{ marginBottom: 6 }}>返修原因</div>
              <Input
                placeholder="如：试验反馈线束接插件松动"
                value={repairReason}
                onChange={(e) => setRepairReason(e.target.value)}
              />
            </div>
            <div>
              <div style={{ marginBottom: 6 }}>问题描述</div>
              <Input.TextArea
                rows={3}
                placeholder="详细描述返修问题及处理要求"
                value={repairDescription}
                onChange={(e) => setRepairDescription(e.target.value)}
              />
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
}
