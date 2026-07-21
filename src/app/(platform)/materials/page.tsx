"use client";

import { BarcodeOutlined, InboxOutlined, QrcodeOutlined } from "@ant-design/icons";
import { App, Button, Col, Drawer, Modal, Progress, Row, Space, Statistic, Table, Tag } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { QrCode } from "@/components/qr-code";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore } from "@/lib/demo-store";

const CONTAINER_CODE = "CT-017";
const REMOVED_PART_CODE = "REM-E8-0317";

export default function MaterialsPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const [qrOpen, setQrOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const shortage = state.materials.find((item) => item.ready < item.required);
  const containerItems = state.materials.filter((item) => item.type === "拆车件" || item.code === REMOVED_PART_CODE);

  const receive = () => {
    if (!shortage) {
      message.info("当前所有物料已齐套，无待接收缺料");
      return;
    }
    dispatch({ type: "RECEIVE_MATERIAL", code: shortage.code });
    message.success(`车间接收扫码成功：${shortage.name} 齐套 +1，交接记录已留痕`);
  };

  const readinessRate = Math.round((state.materials.reduce((sum, item) => sum + item.ready, 0) / state.materials.reduce((sum, item) => sum + item.required, 0)) * 100);
  const shortageCount = state.materials.filter((item) => item.ready < item.required).length;

  return (
    <>
      <PageHeader
        title="物料齐套与拆换件追溯"
        description="把标准件、调拨件、新开件和拆车件统一聚合到车辆任务，齐套结果直接参与排产和开工门禁。"
        actions={<Space><Button icon={<BarcodeOutlined />} onClick={() => setQrOpen(true)}>打印件码</Button><Button type="primary" icon={<QrcodeOutlined />} onClick={receive}>车间接收</Button></Space>}
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="项目总体齐套率" value={readinessRate} suffix="%" valueStyle={{ color: "#0b4f91" }} /><Progress percent={readinessRate} showInfo={false} /></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="缺料项" value={shortageCount} suffix="项" valueStyle={{ color: "#c93636" }} /><div className="section-subtitle">{shortage ? `${shortage.name}缺 ${shortage.required - shortage.ready} 套` : "已全部齐套"}</div></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="拆车件容器" value={4} suffix="个" /><div className="section-subtitle">待回装 2 · 暂存 1 · 报废 1</div></SurfaceCard></Col>
        <Col xs={24} sm={12} xl={6}><SurfaceCard compact><Statistic title="线边接收" value={18} suffix="批" /><div className="section-subtitle">今日差异 0 批</div></SurfaceCard></Col>
      </Row>
      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={17}>
          <SurfaceCard title="车辆物料需求" subtitle="GEELY-VH-7E001 / PRJ-2026-SM-017">
            <Table
              rowKey="code"
              pagination={false}
              dataSource={state.materials}
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
          <SurfaceCard title={`拆车件容器 ${CONTAINER_CODE}`} subtitle="件码 + 箱码两级追溯">
            <div style={{ display: "grid", placeItems: "center", padding: "12px 0 20px" }}>
              <QrCode value={`${CONTAINER_CODE}|${REMOVED_PART_CODE}`} size={120} />
              <b style={{ marginTop: 12, fontFamily: "Fira Code, monospace" }}>{CONTAINER_CODE}</b>
            </div>
            <div className="activity-log">
              <div className="activity-item"><div className="activity-time">07-17</div><div><div className="activity-title">绑定来源车辆</div><div className="activity-detail">E8-SM-017-01 · 前防撞梁组件</div></div></div>
              <div className="activity-item"><div className="activity-time">17:40</div><div><div className="activity-title">线边暂存区接收</div><div className="activity-detail">库位 L-03 · 操作人 陈师傅</div></div></div>
              <div className="activity-item"><div className="activity-time">当前</div><div><div className="activity-title">状态：待回装</div><div className="activity-detail">目标车辆与方案版本校验通过</div></div></div>
            </div>
            <Button block style={{ marginTop: 16 }} icon={<InboxOutlined />} onClick={() => setListOpen(true)}>查看箱内清单</Button>
          </SurfaceCard>
        </Col>
      </Row>

      <Modal title="拆车件二维码" open={qrOpen} onCancel={() => setQrOpen(false)} footer={<Button onClick={() => setQrOpen(false)}>关闭</Button>}>
        <div style={{ display: "grid", placeItems: "center", gap: 12, padding: "8px 0" }}>
          <QrCode value={REMOVED_PART_CODE} size={180} />
          <b style={{ fontFamily: "Fira Code, monospace" }}>{REMOVED_PART_CODE}</b>
          <span style={{ color: "#718096", fontSize: 12 }}>扫码可核对件码、来源车辆与目标容器</span>
        </div>
      </Modal>

      <Drawer title={`容器 ${CONTAINER_CODE} 箱内清单`} open={listOpen} onClose={() => setListOpen(false)} width={380}>
        <Table
          rowKey="code"
          pagination={false}
          dataSource={containerItems}
          columns={[
            { title: "件码", dataIndex: "code", key: "code" },
            { title: "名称", dataIndex: "name", key: "name" },
            { title: "状态", dataIndex: "status", key: "status", render: (value) => <StatusPill status={value} /> },
          ]}
        />
      </Drawer>
    </>
  );
}
