"use client";

import { CheckCircleFilled, FileProtectOutlined, PauseCircleOutlined, PlayCircleOutlined, QrcodeOutlined, ToolOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Descriptions, List, Modal, Progress, Row, Segmented, Space, Steps, message } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { mainVehicle, useDemoStore } from "@/lib/demo-store";

export default function WorkshopPage() {
  const { state, dispatch } = useDemoStore();
  const [mode, setMode] = useState<string | number>("工位模式");
  const [filesOpen, setFilesOpen] = useState(false);
  const vehicle = mainVehicle(state);
  const disabled = state.workshopPaused;
  const projectMaterialReady = state.gates.find((gate) => gate.key === "material")?.passed ?? false;
  const taskGates = state.gates.map((gate) =>
    gate.key === "material"
      ? { ...gate, passed: true, detail: "本车辆当前阶段所需物料已齐套" }
      : gate
  );
  const frozenFiles = [
    `改制方案 ${state.activeVersion}（冻结版）`,
    "总装作业指导书 WI-E8-017-V2",
    "质量检查表 QP-E8-017-V1",
    "六项开工门禁核验单",
  ];
  const scanComplete = state.scanCount >= 6;
  const checkpointComplete = state.checkpointsDone >= state.checkpointsTotal;
  const progressComplete = vehicle.progress >= 100;

  const scan = () => {
    dispatch({ type: "SCAN_PART" });
    message.success("扫码校验通过：车辆、任务、工位、件码一致");
  };

  const report = () => {
    dispatch({ type: "REPORT_PROGRESS" });
    message.success("阶段进度已更新，一车一档同步生成报工证据");
  };

  const checkpoint = () => {
    dispatch({ type: "QC_CHECKPOINT" });
    message.success(`质量点检已完成 ${Math.min(state.checkpointsTotal, state.checkpointsDone + 1)}/${state.checkpointsTotal} 项`);
  };

  const togglePause = () => {
    dispatch({ type: "TOGGLE_PAUSE" });
    message.success(state.workshopPaused ? "任务已恢复执行" : "任务已暂停，扫码/点检/报工已锁定");
  };

  return (
    <>
      <PageHeader
        title="数字工位 · 管理车间 L1"
        description="现场人员只看到当前车辆任务、冻结文件、所需物料和质量点；扫码、点检与报工自动形成过程证据。"
        actions={<Space><Segmented options={["工位模式", "PDA 模式"]} value={mode} onChange={setMode} /><Button icon={disabled ? <PlayCircleOutlined /> : <PauseCircleOutlined />} onClick={togglePause}>{disabled ? "恢复任务" : "暂停任务"}</Button></Space>}
      />
      {disabled && <Alert type="warning" showIcon style={{ marginBottom: 14 }} message="任务已暂停" description="现场人员已暂停当前任务，扫码、质量点检和报工暂时锁定，点击“恢复任务”可继续。" />}
      <Alert
        showIcon
        type={projectMaterialReady ? "success" : "warning"}
        message={projectMaterialReady ? "项目级物料门禁已通过" : "项目级物料门禁仍有 1 项风险，但本车辆当前装配所需物料已齐套"}
        description={projectMaterialReady ? "项目物料已全部齐套，项目详情与业务提醒已同步刷新。" : "E8-03 缺料不影响 E8-01 当前工位动作；系统按车辆级需求控制开工和报工。"}
        style={{ marginBottom: 14 }}
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} xl={16}>
          <SurfaceCard title="当前任务" subtitle={`RT-2026-0718-E8-01 · 冻结方案 ${state.activeVersion}`} extra={<StatusPill status={vehicle.status} />}>
            {mode === "PDA 模式" ? (
              <List
                size="small"
                dataSource={[
                  ["车辆", "E8-SM-017-01"],
                  ["VIN", vehicle.vin],
                  ["当前阶段", "装配"],
                  ["工位/设备", "管理车间 L1"],
                ]}
                renderItem={([label, value]) => <List.Item><b style={{ width: 90, display: "inline-block" }}>{label}</b>{value}</List.Item>}
              />
            ) : (
              <Descriptions bordered size="small" column={{ xs: 1, sm: 2, lg: 3 }} items={[
                { key: "vehicle", label: "车辆", children: "E8-SM-017-01" },
                { key: "vin", label: "VIN", children: vehicle.vin },
                { key: "stage", label: "当前阶段", children: "装配" },
                { key: "team", label: "责任班组", children: "总装一班" },
                { key: "resource", label: "工位/设备", children: "管理车间 L1" },
                { key: "elapsed", label: "已执行", children: "5小时 51分" },
              ]} />
            )}
            <div style={{ marginTop: 22 }}>
              <Steps
                current={3}
                items={["接车", "拆解", "改制", "装配", "调试", "检验", "交付"].map((title) => ({ title }))}
                responsive
              />
            </div>
            <div style={{ marginTop: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><b>装配阶段完成度</b><span>{vehicle.progress}%</span></div>
              <Progress percent={vehicle.progress} strokeColor="#16845b" />
            </div>
            <Row gutter={[12, 12]} style={{ marginTop: 18 }}>
              <Col xs={24} md={8}><Button block size="large" type="primary" icon={<QrcodeOutlined />} disabled={disabled || scanComplete} onClick={scan}>{scanComplete ? "扫码已完成" : "扫码拆 / 装件"}</Button></Col>
              <Col xs={24} md={8}><Button block size="large" icon={<CheckCircleFilled />} disabled={disabled || checkpointComplete} onClick={checkpoint}>{checkpointComplete ? "点检已完成" : "质量点检"}</Button></Col>
              <Col xs={24} md={8}><Button block size="large" icon={<ToolOutlined />} disabled={disabled || progressComplete} onClick={report}>{progressComplete ? "报工已完成" : "阶段报工"}</Button></Col>
            </Row>
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={8}>
          <SurfaceCard title="开工校验" subtitle={`该车辆任务 ${taskGates.filter((gate) => gate.passed).length}/${taskGates.length} 条件已满足`}>
            <div className="gate-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {taskGates.map((gate) => (
                <div key={gate.key} className="gate-card passed">
                  <div className="gate-name"><span>{gate.name}</span><CheckCircleFilled style={{ color: "#16845b" }} /></div>
                  <div className="gate-detail">{gate.detail}</div>
                </div>
              ))}
            </div>
            <Button block style={{ marginTop: 14 }} icon={<FileProtectOutlined />} onClick={() => setFilesOpen(true)}>查看冻结文件包</Button>
          </SurfaceCard>
        </Col>
      </Row>
      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} lg={12}>
          <SurfaceCard title="关键件扫码结果" subtitle={`已完成 ${state.scanCount} / 6 项绑定`}>
            <div className="activity-log">
              <div className="activity-item"><div className="activity-time">通过</div><div><div className="activity-title">车辆与工单一致</div><div className="activity-detail">GEELY-VH-7E001 · RT-2026-0718-E8-01</div></div></div>
              <div className="activity-item"><div className="activity-time">通过</div><div><div className="activity-title">件码与方案 BOM 一致</div><div className="activity-detail">错件、漏扫、重复扫码将被自动拦截</div></div></div>
              <div className="activity-item"><div className="activity-time">通过</div><div><div className="activity-title">操作人与工位一致</div><div className="activity-detail">陈师傅 · 管理车间 L1</div></div></div>
            </div>
          </SurfaceCard>
        </Col>
        <Col xs={24} lg={12}>
          <SurfaceCard title="实时作业记录" subtitle={`所有动作同步写入车辆履历 · 质量点检 ${state.checkpointsDone}/${state.checkpointsTotal}`}>
            <div className="activity-log">
              {state.workLogs.slice(0, 5).map((log, index) => <div className="activity-item" key={`${log.time}-${index}`}><div className="activity-time">{log.time}</div><div><div className="activity-title">{log.title}</div><div className="activity-detail">{log.detail}</div></div></div>)}
            </div>
          </SurfaceCard>
        </Col>
      </Row>

      <Modal title="冻结文件包" open={filesOpen} onCancel={() => setFilesOpen(false)} footer={<Button onClick={() => setFilesOpen(false)}>关闭</Button>}>
        <List size="small" dataSource={frozenFiles} renderItem={(item) => <List.Item><CheckCircleFilled style={{ marginRight: 8, color: "#16845b" }} />{item}</List.Item>} />
      </Modal>
    </>
  );
}
