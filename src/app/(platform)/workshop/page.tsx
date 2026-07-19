"use client";

import { CheckCircleFilled, FileProtectOutlined, PauseCircleOutlined, QrcodeOutlined, ToolOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Descriptions, message, Progress, Row, Segmented, Space, Steps } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { gates } from "@/lib/demo-data";

export default function WorkshopPage() {
  const [scanCount, setScanCount] = useState(4);
  const [progress, setProgress] = useState(71);
  const [logs, setLogs] = useState([
    { time: "14:22", title: "装配阶段报工", detail: "前舱支架完成，进入质量点检" },
    { time: "13:56", title: "异常反馈", detail: "孔位偏差 1.8mm，生成 QI-2026-0718-03" },
    { time: "10:12", title: "扫码装车", detail: "线束 SN-LR-260718-01 绑定车辆" },
  ]);

  const scan = () => {
    const next = scanCount + 1;
    setScanCount(next);
    setLogs((items) => [{ time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), title: "扫码装车", detail: `关键件 SN-DEMO-${String(next).padStart(3, "0")} 已绑定车辆` }, ...items]);
    message.success("扫码校验通过：车辆、任务、工位、件码一致");
  };

  const report = () => {
    setProgress((value) => Math.min(100, value + 8));
    message.success("阶段进度已更新，一车一档同步生成报工证据");
  };

  return (
    <>
      <PageHeader
        title="数字工位 · 管理车间 L1"
        description="现场人员只看到当前车辆任务、冻结文件、所需物料和质量点；扫码、点检与报工自动形成过程证据。"
        actions={<Space><Segmented options={["工位模式", "PDA 模式"]} defaultValue="工位模式" /><Button icon={<PauseCircleOutlined />}>暂停任务</Button></Space>}
      />
      <Alert
        showIcon
        type="warning"
        message="项目级物料门禁仍有 1 项风险，但本车辆当前装配所需物料已齐套"
        description="E8-03 缺料不影响 E8-01 当前工位动作；系统按车辆级需求控制开工和报工。"
        style={{ marginBottom: 14 }}
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} xl={16}>
          <SurfaceCard title="当前任务" subtitle="RT-2026-0718-E8-01 · 冻结方案 V3.0" extra={<StatusPill status="in_progress" />}>
            <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }} items={[
              { key: "vehicle", label: "车辆", children: "E8-SM-017-01" },
              { key: "vin", label: "VIN", children: "L6T79L2Z9SG000317" },
              { key: "stage", label: "当前阶段", children: "装配" },
              { key: "team", label: "责任班组", children: "总装一班" },
              { key: "resource", label: "工位/设备", children: "管理车间 L1" },
              { key: "elapsed", label: "已执行", children: "5小时 51分" },
            ]} />
            <div style={{ marginTop: 22 }}>
              <Steps
                current={3}
                items={["接车", "拆解", "改制", "装配", "调试", "检验", "交付"].map((title) => ({ title }))}
                responsive
              />
            </div>
            <div style={{ marginTop: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><b>装配阶段完成度</b><span>{progress}%</span></div>
              <Progress percent={progress} strokeColor="#16845b" />
            </div>
            <Row gutter={[12, 12]} style={{ marginTop: 18 }}>
              <Col xs={24} md={8}><Button block size="large" type="primary" icon={<QrcodeOutlined />} onClick={scan}>扫码拆 / 装件</Button></Col>
              <Col xs={24} md={8}><Button block size="large" icon={<CheckCircleFilled />} onClick={() => message.success("12 项质量点检已完成 9 项")}>质量点检</Button></Col>
              <Col xs={24} md={8}><Button block size="large" icon={<ToolOutlined />} onClick={report}>阶段报工</Button></Col>
            </Row>
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={8}>
          <SurfaceCard title="开工校验" subtitle="该车辆任务 6/6 条件已满足">
            <div className="gate-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {gates.map((gate) => (
                <div key={gate.key} className="gate-card passed">
                  <div className="gate-name"><span>{gate.name}</span><CheckCircleFilled style={{ color: "#16845b" }} /></div>
                  <div className="gate-detail">{gate.key === "material" ? "本车辆当前阶段所需物料已齐套" : gate.detail}</div>
                </div>
              ))}
            </div>
            <Button block style={{ marginTop: 14 }} icon={<FileProtectOutlined />}>查看冻结文件包</Button>
          </SurfaceCard>
        </Col>
      </Row>
      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} lg={12}>
          <SurfaceCard title="关键件扫码结果" subtitle={`已完成 ${scanCount} / 6 项绑定`}>
            <div className="activity-log">
              <div className="activity-item"><div className="activity-time">通过</div><div><div className="activity-title">车辆与工单一致</div><div className="activity-detail">GEELY-VH-7E001 · RT-2026-0718-E8-01</div></div></div>
              <div className="activity-item"><div className="activity-time">通过</div><div><div className="activity-title">件码与方案 BOM 一致</div><div className="activity-detail">错件、漏扫、重复扫码将被自动拦截</div></div></div>
              <div className="activity-item"><div className="activity-time">通过</div><div><div className="activity-title">操作人与工位一致</div><div className="activity-detail">陈师傅 · 管理车间 L1</div></div></div>
            </div>
          </SurfaceCard>
        </Col>
        <Col xs={24} lg={12}>
          <SurfaceCard title="实时作业记录" subtitle="所有动作同步写入车辆履历">
            <div className="activity-log">
              {logs.slice(0, 5).map((log, index) => <div className="activity-item" key={`${log.time}-${index}`}><div className="activity-time">{log.time}</div><div><div className="activity-title">{log.title}</div><div className="activity-detail">{log.detail}</div></div></div>)}
            </div>
          </SurfaceCard>
        </Col>
      </Row>
    </>
  );
}
