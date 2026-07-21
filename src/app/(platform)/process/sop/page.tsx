"use client";

import { CheckCircleFilled, FileTextOutlined, KeyOutlined } from "@ant-design/icons";
import { Alert, Col, Empty, Row, Select, Space, Tag } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore } from "@/lib/demo-store";

export default function SopPage() {
  const { state } = useDemoStore();
  const routes = state.processRoutes;

  const [routeId, setRouteId] = useState<string>(routes.find((r) => r.status === "frozen")?.id ?? routes[0]?.id ?? "");
  const route = routes.find((r) => r.id === routeId) ?? routes[0];

  const defaultOpId = useMemo(() => {
    if (!route) return "";
    const current = route.operations.find((op) => op.status === "in_progress") ?? route.operations.find((op) => op.status === "pending") ?? route.operations[0];
    return current?.id ?? "";
  }, [route]);

  const [opId, setOpId] = useState<string>("");
  const effectiveOpId = opId && route?.operations.some((op) => op.id === opId) ? opId : defaultOpId;
  const operation = route?.operations.find((op) => op.id === effectiveOpId);

  return (
    <>
      <PageHeader
        title="作业指导书 · SOP"
        description="现场技师按冻结工艺卡查询对应工序的作业指导书，按其拆装；扭矩、工装与质量要求逐步展示。"
        actions={
          <Space wrap>
            <Select
              style={{ minWidth: 260 }}
              value={route?.id}
              onChange={(value) => { setRouteId(value); setOpId(""); }}
              options={routes.map((r) => ({ value: r.id, label: `${r.name}（${r.version}）` }))}
            />
            <Select
              style={{ minWidth: 220 }}
              value={effectiveOpId}
              onChange={setOpId}
              options={route?.operations.map((op) => ({ value: op.id, label: `${op.id} ${op.name}` })) ?? []}
            />
          </Space>
        }
      />

      {route && route.status !== "frozen" && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 14 }}
          message={`该工艺路线状态为「${route.status === "reviewing" ? "评审中" : "草稿"}」，尚未冻结`}
          description="未冻结的工艺路线不能作为现场执行依据，请先完成评审并冻结后下发工位。"
        />
      )}

      {operation ? (
        <Row gutter={[14, 14]}>
          <Col xs={24} lg={8}>
            <SurfaceCard title="工序信息" subtitle={operation.id}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><div style={{ color: "#6b7a8c", fontSize: 12 }}>工序名称</div><b style={{ fontSize: 16 }}>{operation.name}</b></div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <StatusPill status={operation.status} />
                  {operation.isKey && <Tag color="gold" icon={<KeyOutlined />}>关键工序 · 质量控制点</Tag>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div><div style={{ color: "#6b7a8c", fontSize: 12 }}>工作中心</div><b>{operation.workCenter}</b></div>
                  <div><div style={{ color: "#6b7a8c", fontSize: 12 }}>标准工时</div><b>{operation.standardMinutes} 分钟</b></div>
                  <div><div style={{ color: "#6b7a8c", fontSize: 12 }}>所属工艺路线</div><b>{route?.id}</b></div>
                  <div><div style={{ color: "#6b7a8c", fontSize: 12 }}>路线版本</div><b>{route?.version}（{route?.status === "frozen" ? "冻结版" : "未冻结"}）</b></div>
                </div>
                <Alert type="info" showIcon message={`本工序 SOP 共 ${operation.instructions.length} 步`} description="请按顺序逐步作业，扭矩与质量要求以本指导书为准。" />
              </div>
            </SurfaceCard>
          </Col>
          <Col xs={24} lg={16}>
            <SurfaceCard title="作业步骤" subtitle="按冻结工艺卡逐步执行">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {operation.instructions.map((wi) => (
                  <div key={wi.seq} style={{ display: "flex", gap: 14, border: "1px solid #e3e8ef", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ flex: "0 0 34px", height: 34, borderRadius: "50%", background: "#0b4f91", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700 }}>{wi.seq}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{wi.step}</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                        {wi.torqueSpec && <Tag color="blue">扭矩 {wi.torqueSpec}</Tag>}
                        {wi.tooling && <Tag>工装 {wi.tooling}</Tag>}
                        {wi.qualityReq && <Tag color="green" icon={<CheckCircleFilled />}>{wi.qualityReq}</Tag>}
                      </div>
                    </div>
                  </div>
                ))}
                {operation.instructions.length === 0 && <Empty description="该工序暂无作业步骤" />}
              </div>
              <div style={{ marginTop: 12, color: "#6b7a8c", fontSize: 12 }}>
                <FileTextOutlined style={{ marginRight: 6 }} />
                作业指导书与冻结工艺路线版本绑定，设变前版本可追溯；现场发现文件问题请反馈工艺工程师升版。
              </div>
            </SurfaceCard>
          </Col>
        </Row>
      ) : (
        <SurfaceCard title="作业指导书">
          <Empty description="请选择工艺路线与工序" />
        </SurfaceCard>
      )}
    </>
  );
}
