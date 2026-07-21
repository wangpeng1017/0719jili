"use client";

import { TeamOutlined, SafetyCertificateOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

type SkillLevel = "初级" | "中级" | "高级" | "专家";

const levelColorMap: Record<SkillLevel, string> = {
  初级: "default",
  中级: "blue",
  高级: "green",
  专家: "gold",
};

const starMap: Record<SkillLevel, string> = {
  初级: "★",
  中级: "★★",
  高级: "★★★",
  专家: "★★★+",
};

interface Worker {
  key: string;
  name: string;
  team: string;
  position: string;
  disassembly: SkillLevel;
  assembly: SkillLevel;
  welding: SkillLevel;
  inspection: SkillLevel;
  electrical: SkillLevel;
  measurement: SkillLevel;
}

const workers: Worker[] = [
  { key: "1", name: "张伟", team: "总装一班", position: "装配技师", disassembly: "高级", assembly: "专家", welding: "中级", inspection: "高级", electrical: "中级", measurement: "高级" },
  { key: "2", name: "李强", team: "总装一班", position: "装配技师", disassembly: "中级", assembly: "高级", welding: "初级", inspection: "中级", electrical: "高级", measurement: "中级" },
  { key: "3", name: "王磊", team: "总装二班", position: "焊接技师", disassembly: "中级", assembly: "中级", welding: "专家", inspection: "中级", electrical: "初级", measurement: "中级" },
  { key: "4", name: "赵鹏", team: "总装二班", position: "装配技师", disassembly: "高级", assembly: "高级", welding: "中级", inspection: "高级", electrical: "中级", measurement: "高级" },
  { key: "5", name: "陈刚", team: "钣金班", position: "钣金技师", disassembly: "专家", assembly: "中级", welding: "高级", inspection: "中级", electrical: "初级", measurement: "中级" },
  { key: "6", name: "刘洋", team: "钣金班", position: "焊接技师", disassembly: "中级", assembly: "初级", welding: "高级", inspection: "中级", electrical: "初级", measurement: "初级" },
  { key: "7", name: "孙涛", team: "质检班", position: "质检员", disassembly: "中级", assembly: "中级", welding: "初级", inspection: "专家", electrical: "高级", measurement: "专家" },
  { key: "8", name: "周明", team: "质检班", position: "质检员", disassembly: "初级", assembly: "中级", welding: "初级", inspection: "高级", electrical: "中级", measurement: "高级" },
];

const skillColumns = [
  { title: "拆解", dataIndex: "disassembly", key: "disassembly" },
  { title: "装配", dataIndex: "assembly", key: "assembly" },
  { title: "焊接", dataIndex: "welding", key: "welding" },
  { title: "检验", dataIndex: "inspection", key: "inspection" },
  { title: "电气", dataIndex: "electrical", key: "electrical" },
  { title: "测量", dataIndex: "measurement", key: "measurement" },
];

const renderSkill = (level: SkillLevel) => (
  <Tag color={levelColorMap[level]} style={{ marginInlineEnd: 0 }}>
    {starMap[level]} {level}
  </Tag>
);

export default function SkillsPage() {
  const totalWorkers = workers.length;
  const multiSkilled = workers.filter((w) => {
    const levels = [w.disassembly, w.assembly, w.welding, w.inspection, w.electrical, w.measurement];
    const advancedCount = levels.filter((l) => l === "高级" || l === "专家").length;
    return advancedCount >= 3;
  }).length;
  const certifiedRate = 87.5;

  const columns = [
    { title: "姓名", dataIndex: "name", key: "name", width: 90, fixed: "left" as const },
    { title: "班组", dataIndex: "team", key: "team", width: 110 },
    { title: "岗位", dataIndex: "position", key: "position", width: 110 },
    ...skillColumns.map((col) => ({
      ...col,
      width: 120,
      render: (value: SkillLevel) => renderSkill(value),
    })),
  ];

  return (
    <>
      <PageHeader
        title="技能矩阵"
        description="人员技能资质矩阵，展示各岗位人员在关键工序上的技能等级分布，支撑多能工培养与持证上岗管理。"
      />
      <Row gutter={[14, 14]}>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="总人数" value={totalWorkers} suffix="人" prefix={<TeamOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="多能工占比" value={((multiSkilled / totalWorkers) * 100).toFixed(1)} suffix="%" prefix={<UserSwitchOutlined />} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="关键工序持证率" value={certifiedRate} suffix="%" prefix={<SafetyCertificateOutlined />} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <div style={{ height: 14 }} />

      <SurfaceCard title="技能等级矩阵" subtitle="★ 初级 / ★★ 中级 / ★★★ 高级 / ★★★+ 专家">
        <Table
          rowKey="key"
          dataSource={workers}
          columns={columns}
          pagination={false}
          scroll={{ x: 900 }}
          size="middle"
        />
      </SurfaceCard>
    </>
  );
}
