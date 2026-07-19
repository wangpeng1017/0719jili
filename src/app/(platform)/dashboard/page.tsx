"use client";

import {
  AlertOutlined,
  ApartmentOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Col, Progress, Row, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { projects, scheduleRows } from "@/lib/demo-data";

const process = [
  { name: "需求受理", meta: "TOCC/WBS", state: "done" },
  { name: "方案评审", meta: "执行版 V3 已冻结", state: "done" },
  { name: "准备确认", meta: "5/6 门禁通过", state: "active" },
  { name: "排产派工", meta: "L1 下午班", state: "active" },
  { name: "改制执行", meta: "装配阶段 71%", state: "active" },
  { name: "质量放行", meta: "2 项待闭环", state: "" },
  { name: "交付归档", meta: "计划 07-25", state: "" },
];

const projectColumns: ColumnsType<(typeof projects)[number]> = [
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
  const occupied = scheduleRows.filter((row) => row.am !== "空闲" || row.pm !== "空闲").length;

  return (
    <>
      <PageHeader
        title="改制业务驾驶舱"
        description="以车辆为主线监控项目进度、物料齐套、举升机占用、质量闭环和交付风险。数据口径：2026-07-18 16:30。"
        actions={
          <Space>
            <Button>导出汇报快照</Button>
            <Link href="/projects/PRJ-2026-SM-017">
              <Button type="primary">进入重点项目</Button>
            </Link>
          </Space>
        }
      />

      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="在制车辆" value={14} suffix="台" detail="较昨日 +2，3 台计划本周交付" color="#146ec8" icon={<CarOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="核心项目完成率" value="68%" detail="重点 SM 改制处于装配阶段" color="#16845b" icon={<CheckCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="举升机利用率" value="74%" detail={`${occupied} 个资源今日有任务，1 台维护`} color="#6d5dd3" icon={<ApartmentOutlined />} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <MetricCard label="未关闭质量问题" value={7} suffix="项" detail="高风险 1 项，逾期 1 项" color="#c93636" icon={<SafetyCertificateOutlined />} />
        </Col>
      </Row>

      <Row gutter={[14, 14]} style={{ marginTop: 14 }}>
        <Col xs={24} xl={17}>
          <SurfaceCard
            title="重点项目业务闭环"
            subtitle="银河 E8 智驾验证车改制 · PRJ-2026-SM-017"
            extra={<StatusPill status="in_progress" />}
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
                <div style={{ color: "#5b6b7f", fontSize: 12 }}>当前车辆 GEELY-VH-7E001</div>
                <div style={{ marginTop: 5, fontWeight: 700 }}>装配完成 71%，等待调拨线束到齐与孔位偏差问题复验</div>
              </div>
              <Link href="/vehicles/VH-7E001">
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
                <div><div className="risk-title">举升机 L2 存在插单冲突</div><div className="risk-detail">准备车间下午班 EX5 测量与 E8-03 插单重叠，等待生产平衡确认。</div></div>
              </div>
              <div className="risk-item">
                <div className="risk-icon"><SafetyCertificateOutlined /></div>
                <div><div className="risk-title">高风险质量问题待复验</div><div className="risk-detail">前舱支架孔位偏差已整改，未复验前不得进入终检。</div></div>
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
            <Table columns={projectColumns} dataSource={projects} rowKey="id" pagination={false} scroll={{ x: 780 }} size="middle" />
          </SurfaceCard>
        </Col>
      </Row>
    </>
  );
}

