"use client";

import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

type ShiftType = "早" | "中" | "晚" | "休";

const shiftColorMap: Record<ShiftType, string> = {
  早: "blue",
  中: "green",
  晚: "orange",
  休: "default",
};

interface TeamShift {
  key: string;
  team: string;
  mon: ShiftType;
  tue: ShiftType;
  wed: ShiftType;
  thu: ShiftType;
  fri: ShiftType;
  sat: ShiftType;
  sun: ShiftType;
}

const shiftData: TeamShift[] = [
  { key: "1", team: "总装一班", mon: "早", tue: "早", wed: "早", thu: "早", fri: "早", sat: "休", sun: "休" },
  { key: "2", team: "总装二班", mon: "中", tue: "中", wed: "中", thu: "中", fri: "中", sat: "早", sun: "休" },
  { key: "3", team: "钣金班", mon: "早", tue: "早", wed: "晚", thu: "晚", fri: "早", sat: "休", sun: "休" },
  { key: "4", team: "质检班", mon: "早", tue: "中", wed: "早", thu: "中", fri: "早", sat: "早", sun: "休" },
];

const weekDays = [
  { title: "周一", dataIndex: "mon", key: "mon" },
  { title: "周二", dataIndex: "tue", key: "tue" },
  { title: "周三", dataIndex: "wed", key: "wed" },
  { title: "周四", dataIndex: "thu", key: "thu" },
  { title: "周五", dataIndex: "fri", key: "fri" },
  { title: "周六", dataIndex: "sat", key: "sat" },
  { title: "周日", dataIndex: "sun", key: "sun" },
];

const renderShift = (shift: ShiftType) => (
  <Tag color={shiftColorMap[shift]} style={{ marginInlineEnd: 0 }}>
    {shift}
  </Tag>
);

export default function ShiftPage() {
  const todayOnDuty = 32;
  const weeklyOvertime = 46.5;

  const columns = [
    { title: "班组", dataIndex: "team", key: "team", width: 120, fixed: "left" as const },
    ...weekDays.map((day) => ({
      ...day,
      width: 80,
      align: "center" as const,
      render: (value: ShiftType) => renderShift(value),
    })),
  ];

  return (
    <>
      <PageHeader
        title="排班管理"
        description="班组周排班计划，展示各班组每日班次安排（早/中/晚/休），支持产能规划与人员调配。"
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={12}>
          <SurfaceCard compact>
            <Statistic title="今日在岗人数" value={todayOnDuty} suffix="人" prefix={<CalendarOutlined />} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={12}>
          <SurfaceCard compact>
            <Statistic title="本周加班工时" value={weeklyOvertime} suffix="h" prefix={<ClockCircleOutlined />} valueStyle={{ color: "#d46b08" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <div style={{ height: 14 }} />

      <SurfaceCard title="本周排班表" subtitle="早班 07:00-15:30 / 中班 15:00-23:30 / 晚班 23:00-07:30">
        <Table
          rowKey="key"
          dataSource={shiftData}
          columns={columns}
          pagination={false}
          scroll={{ x: 700 }}
          size="middle"
        />
      </SurfaceCard>
    </>
  );
}
