"use client";

import { CheckCircleFilled, CloseCircleFilled, FileTextOutlined, RightOutlined } from "@ant-design/icons";
import { App, Breadcrumb, Button, Col, Descriptions, Progress, Row, Space, Table, Tabs, Tag } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { downloadJson } from "@/lib/export";
import { mainProjectId } from "@/lib/demo-data";
import { useDemoStore } from "@/lib/demo-store";

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { state } = useDemoStore();
  const { message } = App.useApp();
  const project = state.projects.find((item) => item.id === params.id) ?? state.projects[0];
  const stages = ["需求受理", "方案冻结", "准备确认", "拆解", "装配", "调试检验", "交付归档"];

  const exportSnapshot = () => {
    downloadJson(`项目快照-${project.id}-${new Date().toISOString().slice(0, 10)}.json`, {
      generatedAt: new Date().toISOString(),
      project,
      门禁: state.gates,
      车辆: state.vehicles,
      执行方案版本: state.activeVersion,
    });
    message.success(`已导出项目「${project.name}」快照`);
  };

  return (
    <>
      <Breadcrumb style={{ marginBottom: 14 }} items={[{ title: <Link href="/projects">项目与任务</Link> }, { title: project.id }]} />
      <PageHeader
        title={project.name}
        description={`${project.id} · ${project.wbs} · ${project.type}。以车辆为颗粒度独立排产、执行、质量和交付。`}
        actions={<Space><Button icon={<FileTextOutlined />} onClick={exportSnapshot}>生成项目快照</Button><StatusPill status={project.status} /></Space>}
      />

      <Row gutter={[14, 14]}>
        <Col xs={24} xl={16}>
          <SurfaceCard title="项目总体进度" subtitle={`当前执行依据：改制方案 ${state.activeVersion}${state.versionFrozen ? "（已冻结）" : "（沿用上一冻结版）"}`}>
            <Progress percent={project.progress} strokeColor={{ "0%": "#146ec8", "100%": "#16845b" }} />
            <div className="process-line" style={{ marginTop: 20 }}>
              {stages.map((stage, index) => (
                <div key={stage} className={`process-step ${index < 2 ? "done" : index < 5 ? "active" : ""}`}>
                  <div className="process-index">0{index + 1}</div>
                  <div className="process-name">{stage}</div>
                  <div className="process-meta">{index < 2 ? "已完成" : index < 5 ? "进行中" : "待启动"}</div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={8}>
          <SurfaceCard title="项目基本信息">
            <Descriptions column={1} size="small" items={[
              { key: "owner", label: "项目负责人", children: project.owner },
              { key: "workshop", label: "主责车间", children: project.workshop },
              { key: "vehicle", label: "车辆范围", children: `${project.vehicles} 台` },
              { key: "date", label: "承诺交付", children: `2026-${project.promisedAt}` },
              { key: "source", label: "需求来源", children: "TOCC 二期 / LIMS 委托" },
              { key: "sync", label: "最后同步", children: "刚刚" },
            ]} />
          </SurfaceCard>
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col span={24}>
          <SurfaceCard title="六项开工门禁" subtitle="任一门禁未通过，车辆任务保持“准备中”且不可开工">
            <div className="gate-grid">
              {state.gates.map((gate) => (
                <div key={gate.key} className={`gate-card ${gate.passed ? "passed" : "blocked"}`}>
                  <div className="gate-name">
                    <span>{gate.name}</span>
                    {gate.passed ? <CheckCircleFilled style={{ color: "#16845b" }} /> : <CloseCircleFilled style={{ color: "#c93636" }} />}
                  </div>
                  <div className="gate-detail">{gate.detail}</div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col span={24}>
          <SurfaceCard title="车辆级任务" subtitle="标准项目中的每台车辆独立执行和交付">
            <Tabs
              items={[
                {
                  key: "vehicles",
                  label: "车辆任务",
                  children: (
                    <Table
                      rowKey="id"
                      pagination={false}
                      dataSource={state.vehicles}
                      scroll={{ x: 820 }}
                      columns={[
                        { title: "车辆", key: "vehicle", render: (_, record) => <div><Link href={`/vehicles/${record.id}`} style={{ color: "#0b4f91", fontWeight: 700 }}>{record.prototypeNo}</Link><div style={{ color: "#718096", fontSize: 11 }}>{record.uid}</div></div> },
                        { title: "车型配置", key: "model", render: (_, record) => <div>{record.model}<div style={{ color: "#718096", fontSize: 11 }}>{record.config}</div></div> },
                        { title: "当前阶段", dataIndex: "stage", key: "stage", width: 110 },
                        { title: "位置", dataIndex: "location", key: "location", width: 180 },
                        { title: "进度", dataIndex: "progress", key: "progress", width: 145, render: (value) => <Progress percent={value} size="small" /> },
                        { title: "状态", dataIndex: "status", key: "status", width: 95, render: (value) => <StatusPill status={value} /> },
                        { title: "", key: "action", width: 60, render: (_, record) => <Link href={`/vehicles/${record.id}`}><Button type="text" aria-label={`查看${record.prototypeNo}`} icon={<RightOutlined />} /></Link> },
                      ]}
                    />
                  ),
                },
                { key: "change", label: "变更影响", children: <div style={{ padding: "20px 4px", color: "#5b6b7f" }}>{state.versionFrozen ? `${state.activeVersion} 变更评审已冻结，涉及拆换件清单与计划窗口的影响已确认。` : "V4.0 变更评审涉及拆换件清单与计划窗口，系统已标记对 E8-03 物料与排产的潜在影响。"}</div> },
              ]}
            />
          </SurfaceCard>
        </Col>
      </Row>

      {project.id !== mainProjectId && <Tag style={{ marginTop: 14 }}>当前为组合项目示例数据，重点汇报建议进入 PRJ-2026-SM-017。</Tag>}
    </>
  );
}
