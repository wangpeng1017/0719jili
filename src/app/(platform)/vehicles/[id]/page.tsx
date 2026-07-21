"use client";

import { CheckCircleFilled, CloseCircleFilled, DownloadOutlined, FileDoneOutlined, QrcodeOutlined } from "@ant-design/icons";
import { App, Breadcrumb, Button, Col, Descriptions, Modal, Progress, Row, Space, Tabs, Tag, Timeline } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { QrCode } from "@/components/qr-code";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { downloadJson } from "@/lib/export";
import { useDemoStore } from "@/lib/demo-store";

export default function VehicleDossierPage() {
  const params = useParams<{ id: string }>();
  const { state } = useDemoStore();
  const { message } = App.useApp();
  const vehicle = state.vehicles.find((item) => item.id === params.id) ?? state.vehicles[0];
  const [qrOpen, setQrOpen] = useState(false);

  const vehicleIssues = state.qualityIssues.filter((item) => item.vehicle === vehicle.prototypeNo);
  const openIssues = vehicleIssues.filter((item) => item.status !== "closed");
  const finalInspectionReady = openIssues.length === 0 && vehicle.progress >= 100;

  const exportDossier = () => {
    downloadJson(`一车一档-${vehicle.prototypeNo}-${new Date().toISOString().slice(0, 10)}.json`, {
      generatedAt: new Date().toISOString(),
      车辆主档: vehicle,
      执行方案: state.activeVersion,
      质量问题: vehicleIssues,
      履历时间轴: state.vehicleTimeline,
    });
    message.success(`已导出车辆「${vehicle.prototypeNo}」档案`);
  };

  return (
    <>
      <Breadcrumb style={{ marginBottom: 14 }} items={[{ title: <Link href="/projects/PRJ-2026-SM-017">银河 E8 智驾验证车改制</Link> }, { title: vehicle.prototypeNo }]} />
      <PageHeader
        title={`一车一档 · ${vehicle.prototypeNo}`}
        description="按车辆唯一身份回放需求来源、方案版本、排产资源、拆换件、作业证据、质量问题和交付文件。"
        actions={<Space><Button icon={<QrcodeOutlined />} onClick={() => setQrOpen(true)}>车辆二维码</Button><Button type="primary" icon={<DownloadOutlined />} onClick={exportDossier}>导出车辆档案</Button></Space>}
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} xl={9}>
          <SurfaceCard title="车辆主档" extra={<StatusPill status={vehicle.status} />}>
            <Descriptions column={1} size="small" items={[
              { key: "uid", label: "车辆 UID", children: vehicle.uid },
              { key: "vin", label: "VIN", children: vehicle.vin },
              { key: "prototype", label: "样车编号", children: vehicle.prototypeNo },
              { key: "model", label: "车型配置", children: `${vehicle.model} · ${vehicle.config}` },
              { key: "source", label: "权威来源", children: vehicle.source },
              { key: "location", label: "当前位置", children: vehicle.location },
              { key: "version", label: "执行方案", children: <Tag color="cyan">{state.activeVersion} {state.versionFrozen ? "已冻结" : "沿用上一冻结版"}</Tag> },
            ]} />
            <div style={{ marginTop: 18 }}><div style={{ display: "flex", justifyContent: "space-between" }}><b>整车改制进度</b><span>{vehicle.progress}%</span></div><Progress percent={vehicle.progress} strokeColor="#16845b" /></div>
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={15}>
          <SurfaceCard title="车辆履历时间轴" subtitle="每条记录都保留人员、时间、任务、版本和证据附件">
            <Timeline
              items={state.vehicleTimeline.map((item) => ({
                color: item.color,
                children: <div style={{ paddingBottom: 5 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><b>{item.title}</b><span style={{ color: "#718096", fontFamily: "Fira Code, monospace", fontSize: 11 }}>{item.time}</span></div><div style={{ marginTop: 4, color: "#5b6b7f", lineHeight: 1.55 }}>{item.detail}</div></div>,
              }))}
            />
          </SurfaceCard>
        </Col>
      </Row>
      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col span={24}>
          <SurfaceCard title="业务证据包" subtitle="按车辆自动聚合，不再依赖人工从 PPT、Excel、纸单和群消息中拼接">
            <Tabs items={[
              { key: "solution", label: "方案与文件", children: <EvidenceList items={[`改制方案 ${state.activeVersion}（${state.versionFrozen ? "冻结版" : "沿用 V3.0 冻结版"}）`, "总装作业指导书 WI-E8-017-V2", "质量检查表 QP-E8-017-V1", "V4.0 变更评审摘要"]} /> },
              { key: "material", label: "物料与拆换件", children: <EvidenceList items={["5 类物料需求与齐套记录", `关键件扫码装车记录 ${state.scanCount} 条`, "拆车件容器 CT-017", "LES 配送与车间接收记录"]} /> },
              {
                key: "quality",
                label: "质量与放行",
                children: (
                  <Row gutter={[12, 12]}>
                    {vehicleIssues.map((issue) => (
                      <Col xs={24} md={12} key={issue.id}>
                        <div className={`gate-card ${issue.status === "closed" ? "passed" : "blocked"}`}>
                          <div className="gate-name">
                            <span>{issue.id} · {issue.title}</span>
                            {issue.status === "closed" ? <CheckCircleFilled style={{ color: "#16845b" }} /> : <CloseCircleFilled style={{ color: "#c93636" }} />}
                          </div>
                          <div className="gate-detail">{issue.action}</div>
                        </div>
                      </Col>
                    ))}
                    <Col xs={24} md={12}>
                      <div className={`gate-card ${finalInspectionReady ? "passed" : "blocked"}`}>
                        <div className="gate-name"><span>终检报告</span>{finalInspectionReady ? <CheckCircleFilled style={{ color: "#16845b" }} /> : <CloseCircleFilled style={{ color: "#c93636" }} />}</div>
                        <div className="gate-detail">{finalInspectionReady ? "质量问题已全部关闭，进度 100%，终检报告已生成" : `待生成：还需关闭 ${openIssues.length} 项质量问题${vehicle.progress < 100 ? "，且改制进度未到 100%" : ""}`}</div>
                      </div>
                    </Col>
                  </Row>
                ),
              },
              { key: "delivery", label: "交付包", children: <EvidenceList items={[finalInspectionReady ? "实车交接信息（已确认）" : "实车交接信息（待确认）", "冻结文件包（已完整）", "拆换件清单（已生成）", state.versionFrozen ? "TOCC 状态回写（已触发）" : "TOCC 状态回写（待交付后触发）"]} /> },
            ]} />
          </SurfaceCard>
        </Col>
      </Row>

      <Modal title="车辆二维码" open={qrOpen} onCancel={() => setQrOpen(false)} footer={<Button onClick={() => setQrOpen(false)}>关闭</Button>}>
        <div style={{ display: "grid", placeItems: "center", gap: 12, padding: "8px 0" }}>
          <QrCode value={vehicle.uid} size={180} />
          <b style={{ fontFamily: "Fira Code, monospace" }}>{vehicle.uid}</b>
          <span style={{ color: "#718096", fontSize: 12 }}>扫码可直达该车辆一车一档</span>
        </div>
      </Modal>
    </>
  );
}

function EvidenceList({ items }: { items: string[] }) {
  return (
    <Row gutter={[12, 12]}>
      {items.map((item, index) => (
        <Col xs={24} md={12} key={item}>
          <div className="gate-card passed"><div className="gate-name"><span>{item}</span><FileDoneOutlined style={{ color: index === items.length - 1 && item.includes("待") ? "#d68b00" : "#16845b" }} /></div><div className="gate-detail">已与车辆 UID、项目任务和方案版本建立关联</div></div>
        </Col>
      ))}
    </Row>
  );
}
