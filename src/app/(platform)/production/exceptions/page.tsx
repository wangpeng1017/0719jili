"use client";

import { App, Button, Col, Empty, Input, Modal, Row, Select, Space, Statistic, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type ProductionException, type ReworkTask } from "@/lib/demo-store";

const TYPE_COLOR: Record<string, string> = {
  质量异常: "red",
  物料异常: "gold",
  设备异常: "orange",
  方案变更: "blue",
};

const EXCEPTION_STATUS: Record<string, { color: string; label: string }> = {
  open: { color: "red", label: "待处理" },
  handling: { color: "gold", label: "处理中" },
  closed: { color: "green", label: "已关闭" },
};

const REWORK_STATUS: Record<string, { color: string; label: string }> = {
  open: { color: "red", label: "待处理" },
  in_progress: { color: "gold", label: "进行中" },
  completed: { color: "green", label: "已完成" },
};

const SOURCE_TYPE_LABEL: Record<string, string> = {
  quality_issue: "质量问题",
  return_repair: "返修回流",
};

export default function ProductionExceptionsPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();

  const exceptions = state.productionExceptions;
  const reworkTasks = state.reworkTasks;

  const openCount = useMemo(() => exceptions.filter((e) => e.status === "open" || e.status === "handling").length, [exceptions]);
  const closedCount = useMemo(() => exceptions.filter((e) => e.status === "closed").length, [exceptions]);
  const reworkActiveCount = useMemo(() => reworkTasks.filter((r) => r.status !== "completed").length, [reworkTasks]);

  // Create exception modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ type: "质量异常", description: "", vehicleId: "", reporter: "" });

  // Resolve exception modal
  const [resolveTarget, setResolveTarget] = useState<ProductionException | null>(null);
  const [resolveForm, setResolveForm] = useState({ handler: "", resolution: "" });

  const openCreate = () => {
    setCreateForm({ type: "质量异常", description: "", vehicleId: state.vehicles[0]?.uid ?? "", reporter: "" });
    setCreateOpen(true);
  };

  const confirmCreate = () => {
    dispatch({
      type: "CREATE_EXCEPTION",
      payload: {
        type: createForm.type,
        description: createForm.description,
        vehicleId: createForm.vehicleId,
        routeId: "",
        opId: "",
        reporter: createForm.reporter,
      },
    });
    message.success("异常单已创建");
    setCreateOpen(false);
  };

  const openResolve = (record: ProductionException) => {
    setResolveForm({ handler: "", resolution: "" });
    setResolveTarget(record);
  };

  const confirmResolve = () => {
    if (!resolveTarget) return;
    dispatch({
      type: "RESOLVE_EXCEPTION",
      payload: { exceptionId: resolveTarget.id, handler: resolveForm.handler, resolution: resolveForm.resolution },
    });
    message.success(`异常 ${resolveTarget.id} 已关闭`);
    setResolveTarget(null);
  };

  const completeRework = (record: ReworkTask) => {
    dispatch({ type: "COMPLETE_REWORK", reworkId: record.id });
    message.success(`返工任务 ${record.id} 已完工`);
  };

  const exceptionColumns = [
    { title: "异常单号", dataIndex: "id", key: "id", width: 160 },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type: string) => <Tag color={TYPE_COLOR[type] ?? "default"}>{type}</Tag>,
    },
    { title: "描述", dataIndex: "description", key: "description", ellipsis: true },
    { title: "车辆", dataIndex: "vehicleId", key: "vehicleId", width: 100 },
    { title: "工序", dataIndex: "opId", key: "opId", width: 110 },
    { title: "报告人", dataIndex: "reporter", key: "reporter", width: 80 },
    { title: "处理人", dataIndex: "handler", key: "handler", width: 80, render: (v: string) => v || "—" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) => {
        const s = EXCEPTION_STATUS[status] ?? { color: "default", label: status };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      render: (_: unknown, record: ProductionException) => {
        if (record.status === "closed") {
          return <span style={{ color: "#6b7a8c", fontSize: 12 }}>{record.resolution || "已关闭"}</span>;
        }
        return <Button size="small" onClick={() => openResolve(record)}>处理</Button>;
      },
    },
  ];

  const reworkColumns = [
    { title: "返工单号", dataIndex: "id", key: "id", width: 160 },
    {
      title: "来源",
      dataIndex: "sourceType",
      key: "sourceType",
      width: 100,
      render: (v: string) => SOURCE_TYPE_LABEL[v] ?? v,
    },
    { title: "关联单号", dataIndex: "sourceId", key: "sourceId", width: 150 },
    { title: "车辆", dataIndex: "vehicleId", key: "vehicleId", width: 100 },
    { title: "描述", dataIndex: "description", key: "description", ellipsis: true },
    {
      title: "优先级",
      dataIndex: "priority",
      key: "priority",
      width: 80,
      render: (v: string) => <Tag color={v === "high" ? "red" : "default"}>{v === "high" ? "高" : "普通"}</Tag>,
    },
    { title: "责任人", dataIndex: "assignee", key: "assignee", width: 90, render: (v: string) => v || "待分配" },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (status: string) => {
        const s = REWORK_STATUS[status] ?? { color: "default", label: status };
        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      width: 90,
      render: (_: unknown, record: ReworkTask) => {
        if (record.status === "completed") return <span style={{ color: "#16845b" }}>已完成</span>;
        return <Button size="small" onClick={() => completeRework(record)}>完工</Button>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="生产异常 · 返工返修"
        description="缺料、方案变更、质量问题、设备超时等异常的反馈跟踪；返工返修任务重新下达与执行"
        actions={<Button type="primary" onClick={openCreate}>新增异常</Button>}
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} md={8}>
          <SurfaceCard compact>
            <Statistic title="异常待处理" value={openCount} valueStyle={{ color: "#cf1322" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} md={8}>
          <SurfaceCard compact>
            <Statistic title="异常已关闭" value={closedCount} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} md={8}>
          <SurfaceCard compact>
            <Statistic title="返工进行中" value={reworkActiveCount} valueStyle={{ color: "#d69e2e" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="生产异常" subtitle="异常反馈与处理跟踪">
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          columns={exceptionColumns}
          dataSource={exceptions}
          scroll={{ x: 960 }}
          locale={{ emptyText: <Empty description="暂无生产异常" /> }}
        />
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard title="返工返修任务" subtitle="返工返修任务下达与执行">
        <Table
          rowKey="id"
          size="small"
          pagination={false}
          columns={reworkColumns}
          dataSource={reworkTasks}
          scroll={{ x: 960 }}
          locale={{ emptyText: <Empty description="暂无返工返修任务" /> }}
        />
      </SurfaceCard>

      {/* 新增异常 Modal */}
      <Modal
        title="新增异常"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={confirmCreate}
        okText="提交"
        cancelText="取消"
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div>
            <div style={{ marginBottom: 6 }}>异常类型</div>
            <Select
              style={{ width: "100%" }}
              value={createForm.type}
              onChange={(v) => setCreateForm((f) => ({ ...f, type: v }))}
              options={[
                { value: "质量异常", label: "质量异常" },
                { value: "物料异常", label: "物料异常" },
                { value: "设备异常", label: "设备异常" },
                { value: "方案变更", label: "方案变更" },
              ]}
            />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>异常描述</div>
            <Input
              placeholder="请描述异常内容"
              value={createForm.description}
              onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>关联车辆</div>
            <Select
              style={{ width: "100%" }}
              value={createForm.vehicleId}
              onChange={(v) => setCreateForm((f) => ({ ...f, vehicleId: v }))}
              options={state.vehicles.map((v) => ({ value: v.uid, label: `${v.uid}（${v.prototypeNo}）` }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>报告人</div>
            <Input
              placeholder="报告人姓名"
              value={createForm.reporter}
              onChange={(e) => setCreateForm((f) => ({ ...f, reporter: e.target.value }))}
            />
          </div>
        </Space>
      </Modal>

      {/* 处理异常 Modal */}
      <Modal
        title={`处理异常 · ${resolveTarget?.id ?? ""}`}
        open={!!resolveTarget}
        onCancel={() => setResolveTarget(null)}
        onOk={confirmResolve}
        okText="确认关闭"
        cancelText="取消"
      >
        <p style={{ color: "#6b7a8c", marginBottom: 12 }}>{resolveTarget?.description}</p>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div>
            <div style={{ marginBottom: 6 }}>处理人</div>
            <Input
              placeholder="处理人姓名"
              value={resolveForm.handler}
              onChange={(e) => setResolveForm((f) => ({ ...f, handler: e.target.value }))}
            />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>处理措施</div>
            <Input.TextArea
              rows={3}
              placeholder="描述处理措施与结果"
              value={resolveForm.resolution}
              onChange={(e) => setResolveForm((f) => ({ ...f, resolution: e.target.value }))}
            />
          </div>
        </Space>
      </Modal>
    </>
  );
}
