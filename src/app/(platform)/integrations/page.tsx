"use client";

import { ApiOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { App, Button, Col, Descriptions, Modal, Row, Space, Table, Tag } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { projectedHealthCheck, useDemoStore } from "@/lib/demo-store";

const connectorConfig = [
  { key: "tocc", label: "TOCC 二期", children: "REST · OAuth2 · 5 分钟增量轮询" },
  { key: "sap", label: "SAP", children: "IDoc · 定时批同步 · 每日 02:00" },
  { key: "les", label: "LES", children: "REST · 事件回调 · 实时" },
];

export default function IntegrationsPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const [configOpen, setConfigOpen] = useState(false);
  const [checking, setChecking] = useState(false);

  const healthCheck = () => {
    setChecking(true);
    const projected = state.integrationSystems.map(projectedHealthCheck);
    window.setTimeout(() => {
      dispatch({ type: "HEALTH_CHECK" });
      setChecking(false);
      const stillWarning = projected.some((item) => item.status === "warning");
      message.success(stillWarning ? "健康检查完成：LES 延迟已下降，仍高于阈值" : "健康检查完成：全部系统恢复正常");
    }, 600);
  };

  const retry = (log: (typeof state.integrationLogs)[number]) => {
    dispatch({ type: "RETRY_INTEGRATION", time: log.time, business: log.business });
    message.success(`已重新处理 ${log.business}，同步成功`);
  };

  return (
    <>
      <PageHeader
        title="一体化集成中心"
        description="TOCC 管车辆与项目总账，SAP 管物料主数据，LES 管库存与配送；改制系统沉淀执行明细、业务门禁和一车一档。"
        actions={<Space><Button icon={<SettingOutlined />} onClick={() => setConfigOpen(true)}>连接器配置</Button><Button type="primary" icon={<ReloadOutlined />} loading={checking} onClick={healthCheck}>健康检查</Button></Space>}
      />
      <Row gutter={[14, 14]}>
        {state.integrationSystems.map((system) => (
          <Col xs={24} lg={8} key={system.name}>
            <SurfaceCard compact>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 12 }}><div className="risk-icon" style={{ color: "#0b4f91", background: "#e7f2fc" }}><ApiOutlined /></div><div><div style={{ fontWeight: 800 }}>{system.name}</div><div className="section-subtitle" style={{ lineHeight: 1.5 }}>{system.purpose}</div></div></div>
                <StatusPill status={system.status} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 18 }}>
                <div><div className="section-subtitle">平均延迟</div><b>{system.latency}</b></div>
                <div><div className="section-subtitle">成功率</div><b>{system.success}</b></div>
                <div><div className="section-subtitle">最后同步</div><b style={{ fontSize: 12 }}>{system.lastSync}</b></div>
              </div>
            </SurfaceCard>
          </Col>
        ))}
      </Row>
      <div style={{ marginTop: 14 }}>
        <SurfaceCard title="接口调用记录" subtitle="失败数据可查看原因并重新处理；来源版本、同步时间和业务键全部留痕">
          <Table
            rowKey={(record) => `${record.time}-${record.business}`}
            dataSource={state.integrationLogs}
            pagination={false}
            scroll={{ x: 880 }}
            columns={[
              { title: "时间", dataIndex: "time", key: "time", width: 100, render: (value) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12 }}>{value}</span> },
              { title: "系统", dataIndex: "system", key: "system", width: 110 },
              { title: "接口", dataIndex: "interface", key: "interface", width: 180 },
              { title: "业务键", dataIndex: "business", key: "business", width: 180 },
              { title: "方向", dataIndex: "direction", key: "direction", width: 80, render: (value) => <Tag>{value}</Tag> },
              { title: "处理结果", dataIndex: "message", key: "message" },
              { title: "状态", dataIndex: "status", key: "status", width: 90, render: (value) => <StatusPill status={value} /> },
              { title: "", key: "action", width: 95, render: (_, record) => <Button size="small" disabled={record.status === "healthy"} onClick={() => retry(record)}>重新处理</Button> },
            ]}
          />
        </SurfaceCard>
      </div>

      <Modal title="连接器配置" open={configOpen} onCancel={() => setConfigOpen(false)} footer={<Button onClick={() => setConfigOpen(false)}>关闭</Button>}>
        <Descriptions column={1} size="small" items={connectorConfig} />
      </Modal>
    </>
  );
}
