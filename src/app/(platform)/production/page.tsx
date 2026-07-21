"use client";

import { KeyOutlined, PauseCircleOutlined, PlayCircleOutlined, ToolOutlined, UserAddOutlined } from "@ant-design/icons";
import { App, Button, Col, Empty, Input, Modal, Radio, Row, Select, Space, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type OperationItem, type ProcessRoute } from "@/lib/demo-store";

const OPERATORS = ["陈师傅", "叶师傅", "王师傅", "总装一班"];

function actualMinutes(op: OperationItem) {
  if (!op.startedAt || !op.finishedAt) return null;
  return Math.max(0, Math.round((new Date(op.finishedAt).getTime() - new Date(op.startedAt).getTime()) / 60000));
}

export default function ProductionPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const routes = state.processRoutes;

  const [routeId, setRouteId] = useState<string>(routes.find((r) => r.id === "GY-E8-017-ZP")?.id ?? routes[0]?.id ?? "");
  const route: ProcessRoute | undefined = routes.find((r) => r.id === routeId) ?? routes[0];

  const [dispatchOp, setDispatchOp] = useState<OperationItem | null>(null);
  const [assignee, setAssignee] = useState(OPERATORS[0]);
  const [reportOp, setReportOp] = useState<OperationItem | null>(null);
  const [reportForm, setReportForm] = useState({ operator: OPERATORS[0], measured: "", result: "passed", note: "" });

  const reports = useMemo(
    () => state.workReports.filter((w) => w.routeNo === route?.id),
    [state.workReports, route]
  );

  const occupying = route?.operations.filter((op) => op.status === "in_progress" || op.status === "paused" || op.status === "dispatched") ?? [];
  const doneCount = route?.operations.filter((op) => op.status === "completed").length ?? 0;

  const openDispatch = (op: OperationItem) => {
    setAssignee(OPERATORS[0]);
    setDispatchOp(op);
  };

  const confirmDispatch = () => {
    if (!route || !dispatchOp) return;
    dispatch({ type: "DISPATCH_OPERATION", payload: { routeId: route.id, opId: dispatchOp.id, assignee } });
    message.success(`工序 ${dispatchOp.id} 已派工至 ${assignee}`);
    setDispatchOp(null);
  };

  const openReport = (op: OperationItem) => {
    setReportForm({ operator: op.assignee || OPERATORS[0], measured: "", result: "passed", note: "" });
    setReportOp(op);
  };

  const confirmReport = () => {
    if (!route || !reportOp) return;
    dispatch({
      type: "REPORT_OPERATION",
      payload: { routeId: route.id, opId: reportOp.id, operator: reportForm.operator, measured: reportForm.measured, result: reportForm.result, note: reportForm.note },
    });
    message.success(`工序 ${reportOp.id} 结构化报工完成，执行证据已写入一车一档`);
    setReportOp(null);
  };

  const startOp = (op: OperationItem) => {
    if (!route) return;
    dispatch({ type: "START_OPERATION", payload: { routeId: route.id, opId: op.id } });
    message.success(`工序 ${op.id} 已开工`);
  };

  const pauseOp = (op: OperationItem) => {
    if (!route) return;
    dispatch({ type: "PAUSE_OPERATION", payload: { routeId: route.id, opId: op.id } });
    message.success(`工序 ${op.id} 已暂停，资源待释放`);
  };

  const resumeOp = (op: OperationItem) => {
    if (!route) return;
    dispatch({ type: "RESUME_OPERATION", payload: { routeId: route.id, opId: op.id } });
    message.success(`工序 ${op.id} 已恢复作业`);
  };

  const operationColumns = [
    {
      title: "工序号",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id: string, op: OperationItem) => (
        <span>
          {id}
          {op.isKey && <Tag color="gold" style={{ marginLeft: 6 }} icon={<KeyOutlined />}>关键</Tag>}
        </span>
      ),
    },
    { title: "工序名称", dataIndex: "name", key: "name" },
    { title: "操作人", dataIndex: "assignee", key: "assignee", width: 90, render: (v: string) => v || <span style={{ color: "#a0aec0" }}>未派工</span> },
    { title: "工作中心", dataIndex: "workCenter", key: "workCenter", width: 120 },
    {
      title: "工时（实际/标准）",
      key: "duration",
      width: 130,
      render: (_: unknown, op: OperationItem) => {
        const actual = actualMinutes(op);
        if (actual !== null) return <span>{actual} / {op.standardMinutes} 分</span>;
        if (op.status === "in_progress" || op.status === "paused") return <span style={{ color: "#0b4f91" }}>执行中 / {op.standardMinutes} 分</span>;
        return <span style={{ color: "#a0aec0" }}>— / {op.standardMinutes} 分</span>;
      },
    },
    { title: "状态", dataIndex: "status", key: "status", width: 90, render: (status: string) => <StatusPill status={status} /> },
    {
      title: "操作",
      key: "action",
      width: 200,
      render: (_: unknown, op: OperationItem) => {
        if (op.status === "completed") return <span style={{ color: "#16845b" }}>已完成转序</span>;
        if (op.status === "pending") return <Button size="small" icon={<UserAddOutlined />} onClick={() => openDispatch(op)}>派工</Button>;
        if (op.status === "dispatched") return <Button size="small" type="primary" icon={<PlayCircleOutlined />} onClick={() => startOp(op)}>开工</Button>;
        if (op.status === "paused")
          return (
            <Space size={6}>
              <Button size="small" icon={<PlayCircleOutlined />} onClick={() => resumeOp(op)}>恢复</Button>
              <Button size="small" type="primary" icon={<ToolOutlined />} onClick={() => openReport(op)}>报工</Button>
            </Space>
          );
        return (
          <Space size={6}>
            <Button size="small" icon={<PauseCircleOutlined />} onClick={() => pauseOp(op)}>暂停</Button>
            <Button size="small" type="primary" icon={<ToolOutlined />} onClick={() => openReport(op)}>报工</Button>
          </Space>
        );
      },
    },
  ];

  const reportColumns = [
    { title: "工序号", dataIndex: "opNo", key: "opNo", width: 110 },
    { title: "操作人", dataIndex: "operator", key: "operator", width: 90 },
    { title: "实测 / 参数", dataIndex: "measured", key: "measured", render: (v: string) => v || "—" },
    { title: "结果", dataIndex: "result", key: "result", width: 80, render: (v: string) => (v === "failed" ? <Tag color="red">不合格</Tag> : <Tag color="green">合格</Tag>) },
    { title: "备注", dataIndex: "note", key: "note", render: (v: string) => v || "—" },
    { title: "报工时间", dataIndex: "reportedAt", key: "reportedAt", width: 160, render: (v: string) => new Date(v).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) },
  ];

  return (
    <>
      <PageHeader
        title="生产执行 · 工序状态机"
        description="任务按工序流转：派工 → 开工 → 暂停/恢复 → 结构化报工完工转序；实时反映资源占用与在制时长，报工形成执行证据。"
        actions={
          <Select
            style={{ minWidth: 280 }}
            value={route?.id}
            onChange={setRouteId}
            options={routes.map((r) => ({ value: r.id, label: `${r.name}（${r.version}）` }))}
          />
        }
      />

      {route ? (
        <>
          <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
            <Col xs={24} md={8}>
              <SurfaceCard title="执行进度" subtitle={route.id} compact>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: "#0b4f91" }}>{doneCount}</span>
                  <span style={{ color: "#6b7a8c" }}>/ {route.operations.length} 工序完成</span>
                </div>
                <StatusPill status={route.status} />
              </SurfaceCard>
            </Col>
            <Col xs={24} md={8}>
              <SurfaceCard title="资源占用" subtitle="正在占用工作中心的工序" compact>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: occupying.length > 0 ? "#d69e2e" : "#16845b" }}>{occupying.length}</span>
                  <span style={{ color: "#6b7a8c" }}>道工序占用 {route.operations[0]?.workCenter ?? "工作中心"}</span>
                </div>
                <div style={{ color: "#6b7a8c", fontSize: 12, marginTop: 6 }}>
                  {occupying.length > 0 ? occupying.map((op) => op.id).join("、") + " 在制" : "当前无工序占用，资源空闲"}
                </div>
              </SurfaceCard>
            </Col>
            <Col xs={24} md={8}>
              <SurfaceCard title="结构化报工" subtitle="已采集的执行证据" compact>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 700, color: "#16845b" }}>{reports.length}</span>
                  <span style={{ color: "#6b7a8c" }}>条报工记录（含扭矩/操作人/时间）</span>
                </div>
              </SurfaceCard>
            </Col>
          </Row>

          <SurfaceCard title="工序执行看板" subtitle={`${route.name} · ${route.version}（${route.status === "frozen" ? "冻结版" : "未冻结"}）`}>
            <Table rowKey="id" size="small" pagination={false} columns={operationColumns} dataSource={route.operations} scroll={{ x: 860 }} />
          </SurfaceCard>

          <div style={{ height: 14 }} />

          <SurfaceCard title="结构化报工记录" subtitle="操作人、实测扭矩/参数、结果与时间，同步存入一车一档">
            <Table rowKey="id" size="small" pagination={false} columns={reportColumns} dataSource={reports} scroll={{ x: 720 }} locale={{ emptyText: <Empty description="暂无报工记录，完成工序报工后自动生成" /> }} />
          </SurfaceCard>
        </>
      ) : (
        <SurfaceCard title="生产执行">
          <Empty description="暂无工艺路线" />
        </SurfaceCard>
      )}

      <Modal
        title={`工序派工 · ${dispatchOp?.id ?? ""}`}
        open={!!dispatchOp}
        onCancel={() => setDispatchOp(null)}
        onOk={confirmDispatch}
        okText="确认派工"
        cancelText="取消"
      >
        <p style={{ color: "#6b7a8c", marginBottom: 12 }}>{dispatchOp?.name} · {dispatchOp?.workCenter} · 标准 {dispatchOp?.standardMinutes} 分钟</p>
        <div style={{ marginBottom: 6 }}>指派操作人 / 班组</div>
        <Select style={{ width: "100%" }} value={assignee} onChange={setAssignee} options={OPERATORS.map((o) => ({ value: o, label: o }))} />
      </Modal>

      <Modal
        title={`结构化报工 · ${reportOp?.id ?? ""}`}
        open={!!reportOp}
        onCancel={() => setReportOp(null)}
        onOk={confirmReport}
        okText="提交报工并转序"
        cancelText="取消"
      >
        <p style={{ color: "#6b7a8c", marginBottom: 12 }}>{reportOp?.name} · {reportOp?.workCenter}{reportOp?.isKey ? " · 关键工序" : ""}</p>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div>
            <div style={{ marginBottom: 6 }}>操作人</div>
            <Select style={{ width: "100%" }} value={reportForm.operator} onChange={(v) => setReportForm((f) => ({ ...f, operator: v }))} options={OPERATORS.map((o) => ({ value: o, label: o }))} />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>实测扭矩 / 参数（如 25.2 N·m）</div>
            <Input placeholder="关键工序建议填写实测值" value={reportForm.measured} onChange={(e) => setReportForm((f) => ({ ...f, measured: e.target.value }))} />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>报工结果</div>
            <Radio.Group value={reportForm.result} onChange={(e) => setReportForm((f) => ({ ...f, result: e.target.value }))}>
              <Radio value="passed">合格</Radio>
              <Radio value="failed">不合格（触发质量问题）</Radio>
            </Radio.Group>
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>备注</div>
            <Input.TextArea rows={2} placeholder="过程说明、异常或证据补充" value={reportForm.note} onChange={(e) => setReportForm((f) => ({ ...f, note: e.target.value }))} />
          </div>
        </Space>
      </Modal>
    </>
  );
}
