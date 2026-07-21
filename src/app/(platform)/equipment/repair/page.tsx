"use client";

import { ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const STATUS_MAP: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  waiting: { color: "default", label: "待派工", icon: <ClockCircleOutlined /> },
  repairing: { color: "processing", label: "维修中", icon: <SyncOutlined spin /> },
  verifying: { color: "warning", label: "待验收", icon: <CheckCircleOutlined /> },
  closed: { color: "success", label: "已关闭", icon: <CloseCircleOutlined /> },
};

const TYPE_COLOR: Record<string, string> = {
  机械: "blue",
  电气: "orange",
  液压: "purple",
  软件: "cyan",
};

const REPAIR_ORDERS = [
  { id: "WO-2026-0601", equipment: "双柱举升机 L2（准备）", fault: "举升臂下降时异响，疑似液压缸内泄", reporter: "叶师傅", reportTime: "2026-06-25 08:30", repairer: "赵工", type: "液压", status: "repairing", downtime: "16h" },
  { id: "WO-2026-0602", equipment: "CO2 气体保护焊机", fault: "送丝机构卡丝频繁，焊接电流不稳", reporter: "王师傅", reportTime: "2026-06-25 14:15", repairer: "孙工", type: "机械", status: "verifying", downtime: "4h" },
  { id: "WO-2026-0603", equipment: "三坐标测量机", fault: "X 轴光栅尺读数漂移，测量重复性超差", reporter: "周工", reportTime: "2026-06-24 10:00", repairer: "厂家工程师", type: "电气", status: "waiting", downtime: "8h" },
  { id: "WO-2026-0604", equipment: "激光切割机", fault: "切割头随动系统响应迟缓，Z 轴报警", reporter: "李师傅", reportTime: "2026-06-24 16:45", repairer: "赵工", type: "软件", status: "closed", downtime: "2h" },
  { id: "WO-2026-0605", equipment: "气动扳手", fault: "输出扭矩不足，无法达到工艺要求", reporter: "张师傅", reportTime: "2026-06-26 09:20", repairer: "—", type: "机械", status: "waiting", downtime: "1h" },
  { id: "WO-2026-0606", equipment: "等离子切割机", fault: "引弧失败率升高，电极烧损严重", reporter: "李师傅", reportTime: "2026-06-23 11:30", repairer: "孙工", type: "电气", status: "closed", downtime: "6h" },
];

export default function RepairPage() {
  const columns = [
    { title: "工单号", dataIndex: "id", key: "id", width: 130, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12, color: "#0b4f91" }}>{v}</span> },
    { title: "设备名称", dataIndex: "equipment", key: "equipment", width: 180 },
    { title: "故障描述", dataIndex: "fault", key: "fault", ellipsis: true },
    { title: "报修人", dataIndex: "reporter", key: "reporter", width: 80 },
    { title: "报修时间", dataIndex: "reportTime", key: "reportTime", width: 140 },
    { title: "维修人员", dataIndex: "repairer", key: "repairer", width: 110 },
    { title: "维修类型", dataIndex: "type", key: "type", width: 90, render: (v: string) => <Tag color={TYPE_COLOR[v]}>{v}</Tag> },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (v: string) => {
        const s = STATUS_MAP[v];
        return <Tag color={s.color} icon={s.icon}>{s.label}</Tag>;
      },
    },
    { title: "停机时长", dataIndex: "downtime", key: "downtime", width: 90, align: "center" as const },
  ];

  return (
    <>
      <PageHeader
        title="维修工单"
        description="管理设备故障报修、派工、维修执行与验收关闭的全流程工单，跟踪停机时长与维修效率，支撑设备可靠性分析。"
      />

      <SurfaceCard title="维修工单列表" subtitle="当前周期内的设备维修工单">
        <Table rowKey="id" size="small" pagination={false} columns={columns} dataSource={REPAIR_ORDERS} scroll={{ x: 1020 }} />
      </SurfaceCard>
    </>
  );
}
