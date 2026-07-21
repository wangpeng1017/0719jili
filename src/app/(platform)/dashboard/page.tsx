"use client";

import {
  AlertOutlined,
  ApartmentOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { App, Button, Col, Progress, Row, Space, Statistic, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { downloadJson } from "@/lib/export";
import { liftUtilisationRate, mainProject, mainVehicle, unclosedQualityCount, useDemoStore, type Project } from "@/lib/demo-store";

const projectColumns: ColumnsType<Project> = [
  {
    title: "项目 / WBS",
    dataIndex: "name",
    key: "name",
    render: (_, record) => (
      <div>
        <Link href={`/projects/${record.id}`} style={{ color: "#0b4f91", fontWeight: 700 }}>
          {record.name}
        </Link>
        <div style={{ marginTop: 3, color: "#718096", fontSize: 11 }}>{record.wbs}</div>
      </div>
    ),
  },
  { title: "类型", dataIndex: "type", key: "type", width: 100 },
  {
    title: "进度",
    dataIndex: "progress",
    key: "progress",
    width: 145,
    render: (value: number) => <Progress percent={value} size="small" strokeColor="#146ec8" />,
  },
  {
    title: "齐套率",
    dataIndex: "readiness",
    key: "readiness",
    width: 90,
    render: (value: number) => <span style={{ color: value < 90 ? "#b82727" : "#137252", fontWeight: 700 }}>{value}%</span>,
  },
  { title: "责任人", dataIndex: "owner", key: "owner", width: 85 },
  {
    title: "风险",
    dataIndex: "risk",
    key: "risk",
    width: 105,
    render: (value: string) => <Tag color={value === "正常" ? "green" : "gold"}>{value}</Tag>,
  },
];

export default function DashboardPage() {
  const { state } = useDemoStore();
  const { message } = App.useApp();
  const project = mainProject(state);
  const vehicle = mainVehicle(state);
  const unclosed = unclosedQualityCount(state);
  const highRiskIssues = state.qualityIssues.filter((item) => item.status !== "closed" && item.severity === "高").length;
  const totalVehicles = state.projects.reduce((sum, item) => sum + item.vehicles, 0);
  const occupied = state.scheduleRows.filter((row) => row.am !== "空闲" || row.pm !== "空闲").length;
  const liftUtilisation = liftUtilisationRate(state.scheduleRows);
  const deliveredCount = state.deliveryRecords.filter((item) => item.status === "delivered").length;
  const receivedDemandCount = state.demandRequests.filter((item) => item.status === "received").length;
  const openExceptionCount = state.productionExceptions.filter((item) => item.status !== "closed").length;
  const activeReworkCount = state.reworkTasks.filter((item) => item.status !== "completed").length;

  const process = [
    { name: "需求受理", meta: "TOCC/WBS", state: "done" },
    { name: "方案评审", meta: state.versionFrozen ? `${state.activeVersion} 已冻结，现场执行依据升级` : `执行版 ${state.activeVersion} 已冻结，V4.0 评审中`, state: "done" },
    { name: "准备确认", meta: `${state.gates.filter((gate) => gate.passed).length}/${state.gates.length} 门禁通过`, state: "active" },
    { name: "排产派工", meta: "L1 下午班", state: "active" },
    { name: "改制执行", meta: `装配阶段 ${vehicle.progress}%`, state: "active" },
    { name: "质量放行", meta: `${unclosed} 项待闭环`, state: unclosed === 0 ? "done" : "" },
    { name: "交付归档", meta: `计划 ${project.promisedAt}`, state: "" },
  ];

  const exportSnapshot = () => {
    downloadJson(`驾驶舱快照-${project.id}-${new Date().toISOString().slice(0, 10)}.json`, {
      generatedAt: new Date().toISOString(),
      kpi: { 在制车辆: totalVehicles, 核心项目完成率: `${project.progress}%`, 举升机利用率: `${liftUtilisation}%`, 未关闭质量问题: unclosed },
      重点项目: project,
      重点车辆: vehicle,
      项目组合: state.projects,
    });
    message.success("汇报快照已导出为本地 JSON 文件");
  };

  return (
    <>
      <PageHeader
        title="改制业务驾驶舱"
        description="以车辆为主线监控项目进度、物料齐套、举升机占用、质量闭环和交付风险。数据口径：实时演示数据。"
        actions={
          <Space>
            <Button icon={<DownloadOutlined />} onClick={exportSnapshot}>导出汇报快照</Button>
            <Link href={`/projects/${project.id}`}>
              <Button type="primary">进入重点项目</Button>
            </Link>
          </Space>
        }
      />

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="在制车辆" value={totalVehicles} suffix="台" detail={`跨 ${state.projects.length} 个项目统计`} color="#146ec8" icon={<CarOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="核心项目完成率" value={`${project.progress}%`} detail="重点 SM 改制处于装配阶段" color="#16845b" icon={<CheckCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="举升机利用率" value={`${liftUtilisation}%`} detail={`${occupied} 个资源今日有任务`} color="#6d5dd3" icon={<ApartmentOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="未关闭质量问题" value={unclosed} suffix="项" detail={`高风险 ${highRiskIssues} 项`} color="#c93636" icon={<SafetyCertificateOutlined />} />
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={17}>
          <SurfaceCard
            title="重点项目业务闭环"
            subtitle={`${project.name} · ${project.id}`}
            extra={<StatusPill status={project.status} />}
          >
            <div className="process-line">
              {process.map((item, index) => (
                <div key={item.name} className={`process-step ${item.state}`}>
                  <div className="process-index">0{index + 1}</div>
                  <div className="process-name">{item.name}</div>
                  <div className="process-meta">{item.meta}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 16 }}>
              <div>
                <div style={{ color: "#5b6b7f", fontSize: 12 }}>当前车辆 {vehicle.uid}</div>
                <div style={{ marginTop: 5, fontWeight: 700 }}>装配完成 {vehicle.progress}%，等待调拨线束到齐与孔位偏差问题复验</div>
              </div>
              <Link href={`/vehicles/${vehicle.id}`}>
                <Button type="link" iconPosition="end" icon={<RightOutlined />}>查看一车一档</Button>
              </Link>
            </div>
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={7}>
          <SurfaceCard title="今日风险中心" subtitle="按交付影响优先排序">
            <div className="risk-list">
              <div className="risk-item">
                <div className="risk-icon"><AlertOutlined /></div>
                <div><div className="risk-title">1 项调拨件未到线边</div><div className="risk-detail">激光雷达线束缺 1 套，预计 07-19 10:30 到货，影响 E8-03 开工。</div></div>
              </div>
              <div className="risk-item">
                <div className="risk-icon"><ClockCircleOutlined /></div>
                <div><div className="risk-title">举升机 L2 存在插单冲突</div><div className="risk-detail">{state.scheduleRows.some((row) => row.status === "warning") ? "准备车间下午班 EX5 测量与 E8-03 插单重叠，等待生产平衡确认。" : "冲突已通过采纳建议解决，排程恢复健康。"}</div></div>
              </div>
              <div className="risk-item">
                <div className="risk-icon"><SafetyCertificateOutlined /></div>
                <div><div className="risk-title">{unclosed} 项质量问题待复验</div><div className="risk-detail">前舱支架孔位偏差已整改，未复验前不得进入终检。</div></div>
              </div>
            </div>
          </SurfaceCard>
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col span={24}>
          <SurfaceCard
            title="项目组合"
            subtitle="按项目、车型、车间和风险统一查看"
            extra={<Link href="/projects"><Button type="link">查看全部</Button></Link>}
          >
            <Table columns={projectColumns} dataSource={state.projects} rowKey="id" pagination={false} scroll={{ x: 780 }} size="middle" />
          </SurfaceCard>
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="交付达成" value={deliveredCount} suffix={`/ ${state.deliveryRecords.length}`} valueStyle={{ color: "#146ec8" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="需求待受理" value={receivedDemandCount} valueStyle={{ color: "#6d5dd3" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="异常待处理" value={openExceptionCount} valueStyle={{ color: "#c93636" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <SurfaceCard compact>
            <Statistic title="返工进行中" value={activeReworkCount} valueStyle={{ color: "#b8741a" }} />
          </SurfaceCard>
        </Col>
      </Row>
    </>
  );
}
