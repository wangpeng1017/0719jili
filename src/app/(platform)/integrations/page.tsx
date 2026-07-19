"use client";

import { ApiOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Col, message, Row, Space, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { integrationSystems } from "@/lib/demo-data";

const logs = [
  { time: "16:28:12", system: "TOCC 二期", interface: "车辆主档增量同步", business: "GEELY-VH-7E003", direction: "接收", status: "healthy", message: "车辆状态与项目 WBS 同步成功" },
  { time: "16:21:46", system: "LES", interface: "齐套状态查询", business: "PRJ-2026-SM-017", direction: "接收", status: "warning", message: "1 项调拨件预计到料时间发生变化" },
  { time: "16:09:08", system: "SAP", interface: "物料主数据同步", business: "6601200U7300", direction: "接收", status: "healthy", message: "名称、规格与状态同步成功" },
  { time: "15:52:33", system: "TOCC 二期", interface: "任务执行状态回写", business: "RT-2026-0718-E8-01", direction: "发送", status: "healthy", message: "装配阶段状态回写成功" },
];

export default function IntegrationsPage() {
  return (
    <>
      <PageHeader
        title="一体化集成中心"
        description="TOCC 管车辆与项目总账，SAP 管物料主数据，LES 管库存与配送；改制系统沉淀执行明细、业务门禁和一车一档。"
        actions={<Space><Button icon={<SettingOutlined />}>连接器配置</Button><Button type="primary" icon={<ReloadOutlined />} onClick={() => message.success("已完成健康检查，LES 延迟仍高于阈值")}>健康检查</Button></Space>}
      />
      <Row gutter={[14, 14]}>
        {integrationSystems.map((system) => (
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
            dataSource={logs}
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
              { title: "", key: "action", width: 95, render: (_, record) => <Button size="small" disabled={record.status === "healthy"} onClick={() => message.success("已提交重新处理")}>重新处理</Button> },
            ]}
          />
        </SurfaceCard>
      </div>
    </>
  );
}

