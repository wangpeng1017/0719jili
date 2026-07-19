"use client";

import { BarcodeOutlined, InboxOutlined, QrcodeOutlined } from "@ant-design/icons";
import { Button, Col, message, Progress, Row, Space, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { materials } from "@/lib/demo-data";

export default function MaterialsPage() {
  return (
    <>
      <PageHeader
        title="物料齐套与拆换件追溯"
        description="把标准件、调拨件、新开件和拆车件统一聚合到车辆任务，齐套结果直接参与排产和开工门禁。"
        actions={<Space><Button icon={<BarcodeOutlined />} onClick={() => message.success("已生成拆车件二维码：REM-E8-0317")}>打印件码</Button><Button type="primary" icon={<QrcodeOutlined />} onClick={() => message.success("车间接收扫码成功，交接记录已留痕")}>车间接收</Button></Space>}
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="项目总体齐套率" value={92} suffix="%" valueStyle={{ color: "#0b4f91" }} /><Progress percent={92} showInfo={false} /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="缺料项" value={1} suffix="项" valueStyle={{ color: "#c93636" }} /><div className="section-subtitle">激光雷达线束缺 1 套</div></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="拆车件容器" value={4} suffix="个" /><div className="section-subtitle">待回装 2 · 暂存 1 · 报废 1</div></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="线边接收" value={18} suffix="批" /><div className="section-subtitle">今日差异 0 批</div></SurfaceCard></Col>
      </Row>
      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={17}>
          <SurfaceCard title="车辆物料需求" subtitle="GEELY-VH-7E001 / PRJ-2026-SM-017">
            <Table
              rowKey="code"
              pagination={false}
              dataSource={materials}
              scroll={{ x: 880 }}
              columns={[
                { title: "物料编码", dataIndex: "code", key: "code", width: 145, render: (value) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12 }}>{value}</span> },
                { title: "名称", dataIndex: "name", key: "name", width: 190 },
                { title: "类型", dataIndex: "type", key: "type", width: 90, render: (value) => <Tag>{value}</Tag> },
                { title: "需求 / 齐套", key: "qty", width: 110, render: (_, record) => `${record.required} / ${record.ready}` },
                { title: "齐套率", dataIndex: "readiness", key: "readiness", width: 145, render: (value) => <Progress percent={value} size="small" status={value < 90 ? "exception" : "success"} /> },
                { title: "到料/处置", dataIndex: "eta", key: "eta" },
                { title: "状态", dataIndex: "status", key: "status", width: 95, render: (value) => <StatusPill status={value} /> },
              ]}
            />
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={7}>
          <SurfaceCard title="拆车件容器 CT-017" subtitle="件码 + 箱码两级追溯">
            <div style={{ display: "grid", placeItems: "center", padding: "12px 0 20px" }}>
              <div style={{ width: 112, height: 112, display: "grid", placeItems: "center", border: "8px solid #13243a", background: "repeating-conic-gradient(#13243a 0 25%, #fff 0 50%) 50% / 22px 22px" }}><div style={{ padding: 5, background: "#fff" }}><QrcodeOutlined style={{ fontSize: 36 }} /></div></div>
              <b style={{ marginTop: 12, fontFamily: "Fira Code, monospace" }}>CT-017</b>
            </div>
            <div className="activity-log">
              <div className="activity-item"><div className="activity-time">07-17</div><div><div className="activity-title">绑定来源车辆</div><div className="activity-detail">E8-SM-017-01 · 前防撞梁组件</div></div></div>
              <div className="activity-item"><div className="activity-time">17:40</div><div><div className="activity-title">线边暂存区接收</div><div className="activity-detail">库位 L-03 · 操作人 陈师傅</div></div></div>
              <div className="activity-item"><div className="activity-time">当前</div><div><div className="activity-title">状态：待回装</div><div className="activity-detail">目标车辆与方案版本校验通过</div></div></div>
            </div>
            <Button block style={{ marginTop: 16 }} icon={<InboxOutlined />} onClick={() => message.success("容器清单已打开")}>查看箱内清单</Button>
          </SurfaceCard>
        </Col>
      </Row>
    </>
  );
}

