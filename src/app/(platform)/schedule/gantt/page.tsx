"use client";

import { BarChartOutlined } from "@ant-design/icons";
import { Space, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const DATES = ["07-14", "07-15", "07-16", "07-17", "07-18", "07-19", "07-20", "07-21", "07-22", "07-23", "07-24", "07-25"];

const PHASE_COLORS: Record<string, string> = {
  拆解: "#1677ff",
  装配: "#52c41a",
  检验: "#fa8c16",
  等待: "#d9d9d9",
  交付: "#13c2c2",
};

const GANTT_DATA: { key: string; task: string; schedule: Record<string, string> }[] = [
  { key: "1", task: "E8-01 银河E8 智驾拆解", schedule: { "07-14": "拆解", "07-15": "拆解", "07-16": "拆解", "07-17": "等待", "07-18": "装配", "07-19": "装配", "07-20": "", "07-21": "检验", "07-22": "检验", "07-23": "", "07-24": "交付", "07-25": "交付" } },
  { key: "2", task: "E8-02 银河E8 二批准备", schedule: { "07-14": "", "07-15": "", "07-16": "", "07-17": "拆解", "07-18": "拆解", "07-19": "拆解", "07-20": "", "07-21": "装配", "07-22": "装配", "07-23": "装配", "07-24": "检验", "07-25": "检验" } },
  { key: "3", task: "EX5 车身切割焊接", schedule: { "07-14": "拆解", "07-15": "装配", "07-16": "装配", "07-17": "装配", "07-18": "检验", "07-19": "检验", "07-20": "", "07-21": "交付", "07-22": "", "07-23": "", "07-24": "", "07-25": "" } },
  { key: "4", task: "领克900 首台标定改制", schedule: { "07-14": "拆解", "07-15": "拆解", "07-16": "等待", "07-17": "等待", "07-18": "装配", "07-19": "装配", "07-20": "", "07-21": "装配", "07-22": "装配", "07-23": "检验", "07-24": "检验", "07-25": "交付" } },
  { key: "5", task: "星享V6E 货箱改装", schedule: { "07-14": "", "07-15": "", "07-16": "", "07-17": "", "07-18": "", "07-19": "", "07-20": "", "07-21": "拆解", "07-22": "拆解", "07-23": "装配", "07-24": "装配", "07-25": "装配" } },
  { key: "6", task: "E8-03 银河E8 插单急件", schedule: { "07-14": "", "07-15": "", "07-16": "", "07-17": "", "07-18": "拆解", "07-19": "装配", "07-20": "", "07-21": "装配", "07-22": "检验", "07-23": "检验", "07-24": "交付", "07-25": "" } },
];

export default function ScheduleGanttPage() {
  return (
    <>
      <PageHeader
        title="排产甘特图"
        description="以甘特图形式可视化展示各车辆/任务的时间排布，直观呈现拆解、装配、检验、等待、交付各阶段的时间跨度与并行关系。"
        actions={<Tag color="blue" icon={<BarChartOutlined />}>2026-07-14 ~ 07-25</Tag>}
      />

      <SurfaceCard
        title="排产时间线"
        subtitle="行=车辆任务，列=日期，色块=当日工序阶段"
      >
        {/* Legend */}
        <div style={{ marginBottom: 16 }}>
          <Space size={16}>
            {Object.entries(PHASE_COLORS).map(([label, color]) => (
              <Space key={label} size={4}>
                <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, backgroundColor: color }} />
                <span style={{ fontSize: 13 }}>{label}</span>
              </Space>
            ))}
          </Space>
        </div>

        {/* Gantt table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "2px solid #f0f0f0", minWidth: 200, position: "sticky", left: 0, background: "#fff" }}>任务</th>
                {DATES.map((date) => (
                  <th key={date} style={{ padding: "8px 4px", textAlign: "center", borderBottom: "2px solid #f0f0f0", minWidth: 52, fontSize: 12, color: "#718096" }}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GANTT_DATA.map((row) => (
                <tr key={row.key}>
                  <td style={{ padding: "10px 12px", borderBottom: "1px solid #f5f5f5", fontWeight: 500, whiteSpace: "nowrap", position: "sticky", left: 0, background: "#fff" }}>{row.task}</td>
                  {DATES.map((date) => {
                    const phase = row.schedule[date];
                    return (
                      <td key={date} style={{ padding: "4px 2px", borderBottom: "1px solid #f5f5f5", textAlign: "center" }}>
                        {phase ? (
                          <div
                            title={`${row.task} - ${date} - ${phase}`}
                            style={{
                              height: 24,
                              borderRadius: 4,
                              backgroundColor: PHASE_COLORS[phase] || "#d9d9d9",
                              opacity: 0.85,
                            }}
                          />
                        ) : (
                          <div style={{ height: 24 }} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SurfaceCard>
    </>
  );
}
