"use client";

import { AuditOutlined, FileSearchOutlined } from "@ant-design/icons";
import { App, Button, Col, Empty, Input, Modal, Radio, Row, Select, Space, Statistic, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type InspectionRecord, type InspectionTemplate } from "@/lib/demo-store";

const INSPECTORS = ["周工", "陈师傅", "叶师傅", "质量一班"];

type DraftItem = { seq: number; checkPoint: string; spec: string; measured: string; judged: string };

export default function QualityInspectionPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const templates = state.inspectionTemplates;

  const [templateId, setTemplateId] = useState<string>(templates[0]?.id ?? "");
  const template: InspectionTemplate | undefined = templates.find((t) => t.id === templateId) ?? templates[0];

  const [vehicleId, setVehicleId] = useState<string>(state.vehicles[0]?.id ?? "");
  const [inspector, setInspector] = useState(INSPECTORS[0]);
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [detail, setDetail] = useState<InspectionRecord | null>(null);

  const records = useMemo(() => state.inspectionRecords, [state.inspectionRecords]);
  const passedCount = records.filter((r) => r.result !== "failed").length;

  const openInspect = () => {
    if (!template) return;
    setDraft(template.items.map((item) => ({ seq: item.seq, checkPoint: item.checkPoint, spec: item.spec, measured: "", judged: "passed" })));
    setInspectOpen(true);
  };

  const setItem = (seq: number, patch: Partial<DraftItem>) => {
    setDraft((items) => items.map((item) => (item.seq === seq ? { ...item, ...patch } : item)));
  };

  const overallResult = draft.some((item) => item.judged === "failed") ? "failed" : "passed";

  const submitInspect = () => {
    if (!template) return;
    dispatch({
      type: "SUBMIT_INSPECTION",
      payload: { templateId: template.id, vehicleId, inspector, result: overallResult, items: draft },
    });
    message.success(`${template.name} 检验${overallResult === "failed" ? "不合格，已触发质量问题" : "合格"}，记录存入一车一档`);
    setInspectOpen(false);
  };

  const vehicleLabel = (id: string) => state.vehicles.find((v) => v.id === id)?.prototypeNo ?? id;

  const templateColumns = [
    { title: "序号", dataIndex: "seq", key: "seq", width: 60 },
    { title: "检查点", dataIndex: "checkPoint", key: "checkPoint" },
    { title: "检验方法", dataIndex: "method", key: "method", width: 120 },
    { title: "规格 / 判定标准", dataIndex: "spec", key: "spec", width: 160 },
  ];

  const recordColumns = [
    { title: "检验规程", dataIndex: "templateNo", key: "templateNo", width: 150, render: (v: string) => <span style={{ color: "#0b4f91", fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
    { title: "车辆", key: "vehicle", width: 130, render: (_: unknown, r: InspectionRecord) => vehicleLabel(r.vehicleId) },
    { title: "检验人", dataIndex: "inspector", key: "inspector", width: 90 },
    { title: "检查项", key: "count", width: 80, render: (_: unknown, r: InspectionRecord) => `${r.items.length} 项` },
    { title: "结论", dataIndex: "result", key: "result", width: 90, render: (v: string) => (v === "failed" ? <Tag color="red">不合格</Tag> : <Tag color="green">合格</Tag>) },
    { title: "检验时间", dataIndex: "inspectedAt", key: "inspectedAt", width: 160, render: (v: string) => new Date(v).toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }) },
    { title: "操作", key: "action", width: 90, render: (_: unknown, r: InspectionRecord) => <Button size="small" icon={<FileSearchOutlined />} onClick={() => setDetail(r)}>明细</Button> },
  ];

  return (
    <>
      <PageHeader
        title="质量检验 · 文件驱动结构化检验"
        description="按已发布的质量检验规程（检查点、方法、判定标准）逐项采集实测值并判定，结论与明细自动存入一车一档，替代纸质点检表。"
        actions={
          <Select
            style={{ minWidth: 300 }}
            value={template?.id}
            onChange={setTemplateId}
            options={templates.map((t) => ({ value: t.id, label: `${t.name}（${t.id}）` }))}
          />
        }
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} md={8}>
          <SurfaceCard title="检验规程" subtitle="已发布的质量文件" compact>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: "#0b4f91" }}>{templates.length}</span>
              <span style={{ color: "#6b7a8c" }}>份检验规程可执行</span>
            </div>
            {template && <StatusPill status={template.status} />}
          </SurfaceCard>
        </Col>
        <Col xs={24} md={8}>
          <SurfaceCard title="检验记录" subtitle="已采集的结构化检验证据" compact>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: "#16845b" }}>{records.length}</span>
              <span style={{ color: "#6b7a8c" }}>条检验记录</span>
            </div>
          </SurfaceCard>
        </Col>
        <Col xs={24} md={8}>
          <SurfaceCard title="一次合格率" subtitle="按检验记录结论统计" compact>
            <Statistic value={records.length === 0 ? 100 : Math.round((passedCount / records.length) * 1000) / 10} suffix="%" valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
      </Row>

      {template ? (
        <SurfaceCard
          title="检验规程明细"
          subtitle={`${template.name} · 关联工序 ${template.opNo ?? "—"} · 编制 ${template.author}`}
          extra={<Button type="primary" icon={<AuditOutlined />} onClick={openInspect}>执行检验</Button>}
        >
          <Table rowKey="seq" size="small" pagination={false} columns={templateColumns} dataSource={template.items} scroll={{ x: 560 }} />
        </SurfaceCard>
      ) : (
        <SurfaceCard title="检验规程"><Empty description="暂无检验规程" /></SurfaceCard>
      )}

      <div style={{ height: 14 }} />

      <SurfaceCard title="检验记录" subtitle="逐项实测值与判定，同步存入对应车辆一车一档">
        <Table rowKey="id" size="small" pagination={false} columns={recordColumns} dataSource={records} scroll={{ x: 760 }} locale={{ emptyText: <Empty description="暂无检验记录，执行检验后自动生成" /> }} />
      </SurfaceCard>

      <Modal
        title={`执行检验 · ${template?.id ?? ""}`}
        open={inspectOpen}
        onCancel={() => setInspectOpen(false)}
        onOk={submitInspect}
        okText={overallResult === "failed" ? "提交（不合格）" : "提交检验"}
        cancelText="取消"
        width={680}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Row gutter={12}>
            <Col span={12}>
              <div style={{ marginBottom: 6 }}>受检车辆</div>
              <Select style={{ width: "100%" }} value={vehicleId} onChange={setVehicleId} options={state.vehicles.map((v) => ({ value: v.id, label: v.prototypeNo }))} />
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 6 }}>检验人</div>
              <Select style={{ width: "100%" }} value={inspector} onChange={setInspector} options={INSPECTORS.map((o) => ({ value: o, label: o }))} />
            </Col>
          </Row>
          <Table
            rowKey="seq"
            size="small"
            pagination={false}
            dataSource={draft}
            columns={[
              { title: "检查点", dataIndex: "checkPoint", key: "checkPoint", render: (v: string, item: DraftItem) => <div><b>{v}</b><div style={{ color: "#718096", fontSize: 11 }}>标准 {item.spec}</div></div> },
              { title: "实测值", key: "measured", width: 160, render: (_: unknown, item: DraftItem) => <Input placeholder="实测值" value={item.measured} onChange={(e) => setItem(item.seq, { measured: e.target.value })} /> },
              { title: "判定", key: "judged", width: 150, render: (_: unknown, item: DraftItem) => <Radio.Group value={item.judged} onChange={(e) => setItem(item.seq, { judged: e.target.value })}><Radio value="passed">合格</Radio><Radio value="failed">不合格</Radio></Radio.Group> },
            ]}
          />
          <div style={{ color: overallResult === "failed" ? "#c93636" : "#16845b", fontWeight: 600 }}>
            综合结论：{overallResult === "failed" ? "不合格（任一项不合格即判不合格，触发质量问题）" : "合格"}
          </div>
        </Space>
      </Modal>

      <Modal title={`检验明细 · ${detail?.templateNo ?? ""}`} open={Boolean(detail)} onCancel={() => setDetail(null)} footer={<Button onClick={() => setDetail(null)}>关闭</Button>} width={640}>
        {detail && (
          <>
            <Space style={{ marginBottom: 12 }} wrap>
              <Tag>车辆 {vehicleLabel(detail.vehicleId)}</Tag>
              <Tag>检验人 {detail.inspector}</Tag>
              {detail.result === "failed" ? <Tag color="red">不合格</Tag> : <Tag color="green">合格</Tag>}
              <span style={{ color: "#718096", fontSize: 12 }}>{new Date(detail.inspectedAt).toLocaleString("zh-CN")}</span>
            </Space>
            <Table
              rowKey="seq"
              size="small"
              pagination={false}
              dataSource={detail.items}
              columns={[
                { title: "检查点", dataIndex: "checkPoint", key: "checkPoint", render: (v: string, item: { spec: string }) => <div><b>{v}</b><div style={{ color: "#718096", fontSize: 11 }}>标准 {item.spec}</div></div> },
                { title: "实测值", dataIndex: "measured", key: "measured", width: 150, render: (v: string) => v || "—" },
                { title: "判定", dataIndex: "judged", key: "judged", width: 90, render: (v: string) => (v === "failed" ? <Tag color="red">不合格</Tag> : <Tag color="green">合格</Tag>) },
              ]}
            />
          </>
        )}
      </Modal>
    </>
  );
}
