"use client";

import { CalendarOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row, Space, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface TaskCard {
  id: string;
  project: string;
  vehicle: string;
  owner: string;
  progress: number;
  deadline: string;
}

const BOARD_COLUMNS: { title: string; color: string; tasks: TaskCard[] }[] = [
  {
    title: "待启动",
    color: "#8c8c8c",
    tasks: [
      { id: "T-001", project: "星享V6E货箱改装", vehicle: "V6E-03", owner: "赵刚", progress: 0, deadline: "08-05" },
      { id: "T-002", project: "新车型试制验证", vehicle: "NX-01", owner: "李明", progress: 0, deadline: "09-15" },
    ],
  },
  {
    title: "进行中",
    color: "#1677ff",
    tasks: [
      { id: "T-003", project: "银河E8智驾验证车改制", vehicle: "E8-01", owner: "王欣", progress: 45, deadline: "07-25" },
      { id: "T-004", project: "银河E8智驾验证车改制", vehicle: "E8-02", owner: "刘洋", progress: 20, deadline: "07-31" },
      { id: "T-005", project: "领克900冬季标定改制", vehicle: "LK900-01", owner: "陈磊", progress: 35, deadline: "08-15" },
    ],
  },
  {
    title: "检验中",
    color: "#fa8c16",
    tasks: [
      { id: "T-006", project: "EX5车身切割焊接", vehicle: "EX5-02", owner: "张伟", progress: 85, deadline: "07-20" },
      { id: "T-007", project: "银河E8智驾验证车改制", vehicle: "E8-03", owner: "张伟", progress: 80, deadline: "07-24" },
    ],
  },
  {
    title: "已交付",
    color: "#52c41a",
    tasks: [
      { id: "T-008", project: "EX5车身切割焊接", vehicle: "EX5-01", owner: "赵刚", progress: 100, deadline: "07-10" },
      { id: "T-009", project: "远程星享V6E改装", vehicle: "V6E-01", owner: "王欣", progress: 100, deadline: "07-08" },
    ],
  },
];

export default function ProjectsBoardPage() {
  return (
    <>
      <PageHeader
        title="项目看板"
        description="以看板形式追踪各改制任务在待启动、进行中、检验中、已交付各阶段的流转状态，快速掌握项目全局进度。"
      />

      <SurfaceCard title="任务看板" subtitle="按阶段分列展示，卡片含项目名、车辆、负责人、进度与截止日期">
        <Row gutter={12}>
          {BOARD_COLUMNS.map((col) => (
            <Col key={col.title} xs={24} sm={12} lg={6}>
              <div style={{ marginBottom: 12 }}>
                <Space>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: col.color }} />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{col.title}</span>
                  <Tag>{col.tasks.length}</Tag>
                </Space>
              </div>
              <Space direction="vertical" size={10} style={{ width: "100%" }}>
                {col.tasks.map((task) => (
                  <Card
                    key={task.id}
                    size="small"
                    style={{ borderTop: `3px solid ${col.color}` }}
                    styles={{ body: { padding: "12px 14px" } }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{task.project}</div>
                    <div style={{ fontSize: 12, color: "#718096", marginBottom: 4 }}>
                      <Tag style={{ fontSize: 11 }}>{task.vehicle}</Tag>
                      <span><UserOutlined style={{ marginRight: 4 }} />{task.owner}</span>
                    </div>
                    <Progress percent={task.progress} size="small" status={task.progress >= 100 ? "success" : "active"} style={{ marginBottom: 6 }} />
                    <div style={{ fontSize: 12, color: "#718096" }}>
                      <CalendarOutlined style={{ marginRight: 4 }} />截止 {task.deadline}
                    </div>
                  </Card>
                ))}
              </Space>
            </Col>
          ))}
        </Row>
      </SurfaceCard>
    </>
  );
}
