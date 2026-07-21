"use client";

import { ClockCircleOutlined, FieldTimeOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Col, Progress, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface WorkerHours {
  key: string;
  name: string;
  team: string;
  weekHours: number;
  overtimeHours: number;
  effectiveHours: number;
  utilization: number;
  project: string;
  mainProcess: string;
}

const hoursData: WorkerHours[] = [
  { key: "1", name: "张伟", team: "总装一班", weekHours: 44, overtimeHours: 4, effectiveHours: 40.5, utilization: 92, project: "E8-SM-017", mainProcess: "底盘装配" },
  { key: "2", name: "李强", team: "总装一班", weekHours: 42, overtimeHours: 2, effectiveHours: 38.2, utilization: 91, project: "E8-SM-017", mainProcess: "内饰装配" },
  { key: "3", name: "王磊", team: "总装二班", weekHours: 46, overtimeHours: 6, effectiveHours: 41.8, utilization: 91, project: "E8-SM-022", mainProcess: "焊接" },
  { key: "4", name: "赵鹏", team: "总装二班", weekHours: 40, overtimeHours: 0, effectiveHours: 37.6, utilization: 94, project: "E8-SM-022", mainProcess: "总装" },
  { key: "5", name: "陈刚", team: "钣金班", weekHours: 45, overtimeHours: 5, effectiveHours: 40.1, utilization: 89, project: "E8-SM-017", mainProcess: "钣金修复" },
  { key: "6", name: "刘洋", team: "钣金班", weekHours: 43, overtimeHours: 3, effectiveHours: 38.5, utilization: 90, project: "E8-SM-022", mainProcess: "焊接" },
  { key: "7", name: "孙涛", team: "质检班", weekHours: 41, overtimeHours: 1, effectiveHours: 38.8, utilization: 95, project: "E8-SM-017", mainProcess: "终检" },
  { key: "8", name: "周明", team: "质检班", weekHours: 40, overtimeHours: 0, effectiveHours: 37.2, utilization: 93, project: "E8-SM-022", mainProcess: "过程检验" },
];

export default function HoursPage() {
  const totalWeekHours = hoursData.reduce((sum, w) => sum + w.weekHours, 0);
  const avgUtilization = Math.round(hoursData.reduce((sum, w) => sum + w.utilization, 0) / hoursData.length);
  const totalOvertime = hoursData.reduce((sum, w) => sum + w.overtimeHours, 0);

  const columns = [
    { title: "姓名", dataIndex: "name", key: "name", width: 90 },
    { title: "班组", dataIndex: "team", key: "team", width: 110 },
    { title: "本周工时(h)", dataIndex: "weekHours", key: "weekHours", width: 110, align: "right" as const },
    { title: "加班工时(h)", dataIndex: "overtimeHours", key: "overtimeHours", width: 110, align: "right" as const, render: (v: number) => <span style={{ color: v > 0 ? "#d46b08" : undefined }}>{v}</span> },
    { title: "有效工时(h)", dataIndex: "effectiveHours", key: "effectiveHours", width: 110, align: "right" as const },
    { title: "工时利用率", dataIndex: "utilization", key: "utilization", width: 160, render: (v: number) => <Progress percent={v} size="small" strokeColor={v >= 92 ? "#52c41a" : v >= 85 ? "#1677ff" : "#faad14"} /> },
    { title: "参与项目", dataIndex: "project", key: "project", width: 120, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "主要工序", dataIndex: "mainProcess", key: "mainProcess", width: 110 },
  ];

  return (
    <>
      <PageHeader
        title="工时统计"
        description="人员工时跟踪与效率分析，统计本周工时、加班、有效工时及利用率，支撑产能评估与人力调配。"
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="本周总工时" value={totalWeekHours} suffix="h" prefix={<ClockCircleOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="平均利用率" value={avgUtilization} suffix="%" prefix={<ThunderboltOutlined />} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="加班总时长" value={totalOvertime} suffix="h" prefix={<FieldTimeOutlined />} valueStyle={{ color: "#d46b08" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <div style={{ height: 14 }} />

      <SurfaceCard title="人员工时明细" subtitle="本周（07-14 至 07-18）各人员工时统计">
        <Table
          rowKey="key"
          dataSource={hoursData}
          columns={columns}
          pagination={false}
          scroll={{ x: 900 }}
          size="middle"
        />
      </SurfaceCard>
    </>
  );
}
