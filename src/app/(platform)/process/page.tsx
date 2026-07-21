"use client";

import { ApartmentOutlined, KeyOutlined } from "@ant-design/icons";
import { App, Button, Col, Empty, Row, Table, Tag } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type OperationItem, type ProcessRoute } from "@/lib/demo-store";

export default function ProcessRoutePage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const routes = state.processRoutes;
  const [selectedId, setSelectedId] = useState<string>(routes[0]?.id ?? "");
  const selected = routes.find((route) => route.id === selectedId) ?? routes[0];

  const doneCount = (route: ProcessRoute) => route.operations.filter((op) => op.status === "completed").length;

  const startOperation = (op: OperationItem) => {
    if (!selected) return;
    dispatch({ type: "START_OPERATION", payload: { routeId: selected.id, opId: op.id } });
    message.success(`工序 ${op.id} 已开工`);
  };

  const completeOperation = (op: OperationItem) => {
    if (!selected) return;
    dispatch({ type: "COMPLETE_OPERATION", payload: { routeId: selected.id, opId: op.id } });
    message.success(`工序 ${op.id} 完成并转序，SOP 记录已存入一车一档`);
  };

  const operationColumns = [
    {
      title: "工序号",
      dataIndex: "id",
      key: "id",
      width: 110,
      render: (id: string, op: OperationItem) => (
        <span>
          {id}
          {op.isKey && <Tag color="gold" style={{ marginLeft: 6 }} icon={<KeyOutlined />}>关键</Tag>}
        </span>
      ),
    },
    { title: "工序名称", dataIndex: "name", key: "name" },
    { title: "工作中心", dataIndex: "workCenter", key: "workCenter", width: 130 },
    { title: "标准工时", dataIndex: "standardMinutes", key: "standardMinutes", width: 90, render: (v: number) => `${v} 分钟` },
    { title: "状态", dataIndex: "status", key: "status", width: 90, render: (status: string) => <StatusPill status={status} /> },
    {
      title: "操作",
      key: "action",
      width: 170,
      render: (_: unknown, op: OperationItem) => {
        if (op.status === "completed") return <span style={{ color: "#16845b" }}>已完成</span>;
        if (op.status === "in_progress")
          return <Button size="small" type="primary" onClick={() => completeOperation(op)}>报工完成</Button>;
        return <Button size="small" onClick={() => startOperation(op)}>开工</Button>;
      },
    },
  ];

  const instructionColumns = [
    { title: "序号", dataIndex: "seq", key: "seq", width: 60 },
    { title: "作业步骤", dataIndex: "step", key: "step" },
    { title: "扭矩 / 参数", dataIndex: "torqueSpec", key: "torqueSpec", width: 130, render: (v: string) => v || "—" },
    { title: "工装 / 工具", dataIndex: "tooling", key: "tooling", width: 120, render: (v: string) => v || "—" },
    { title: "质量要求", dataIndex: "qualityReq", key: "qualityReq", render: (v: string) => v || "—" },
  ];

  return (
    <>
      <PageHeader
        title="工艺路线 · 工序管理"
        description="按任务类型配置工艺路线与工序，冻结后作为现场执行依据；每道工序挂载结构化作业指导书（SOP）。"
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} lg={9}>
          <SurfaceCard title="工艺路线台账" subtitle={`共 ${routes.length} 条路线`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {routes.map((route) => {
                const active = route.id === selected?.id;
                return (
                  <button
                    key={route.id}
                    type="button"
                    onClick={() => setSelectedId(route.id)}
                    style={{
                      textAlign: "left",
                      border: `1px solid ${active ? "#0b4f91" : "#e3e8ef"}`,
                      background: active ? "rgba(11,79,145,.06)" : "#fff",
                      borderRadius: 10,
                      padding: "12px 14px",
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <b style={{ fontSize: 14 }}>{route.name}</b>
                      <StatusPill status={route.status} />
                    </div>
                    <div style={{ color: "#6b7a8c", fontSize: 12, marginTop: 6 }}>
                      {route.id} · {route.stage} · {route.version} · {route.author}
                    </div>
                    <div style={{ color: "#6b7a8c", fontSize: 12, marginTop: 2 }}>
                      {route.project} · 工序 {doneCount(route)}/{route.operations.length} 完成
                    </div>
                  </button>
                );
              })}
            </div>
          </SurfaceCard>
        </Col>
        <Col xs={24} lg={15}>
          {selected ? (
            <SurfaceCard
              title={selected.name}
              subtitle={`${selected.id} · ${selected.stage} · ${selected.version} · 编制 ${selected.author}`}
              extra={<StatusPill status={selected.status} />}
            >
              <Table
                rowKey="id"
                size="small"
                pagination={false}
                columns={operationColumns}
                dataSource={selected.operations}
                scroll={{ x: 720 }}
                expandable={{
                  expandedRowRender: (op: OperationItem) => (
                    <Table
                      rowKey="seq"
                      size="small"
                      pagination={false}
                      columns={instructionColumns}
                      dataSource={op.instructions}
                    />
                  ),
                  rowExpandable: (op: OperationItem) => op.instructions.length > 0,
                }}
              />
              <div style={{ marginTop: 12, color: "#6b7a8c", fontSize: 12 }}>
                <ApartmentOutlined style={{ marginRight: 6 }} />
                展开工序可查看结构化作业指导书（SOP）；关键工序（金色标记）为质量控制点，完成后自动写入一车一档。
              </div>
            </SurfaceCard>
          ) : (
            <SurfaceCard title="工艺路线详情">
              <Empty description="暂无工艺路线" />
            </SurfaceCard>
          )}
        </Col>
      </Row>
    </>
  );
}
