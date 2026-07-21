"use client";

import { NodeIndexOutlined } from "@ant-design/icons";
import { Col, Row, Table, Tag, Timeline } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const STATUS_COLORS: Record<string, string> = {
  已装车: "green",
  待装车: "blue",
  检验中: "gold",
  已入库: "cyan",
  已退库: "red",
};

const traceData = [
  { key: "1", traceCode: "TR-2026-0618-001", name: "前保险杠总成", batch: "B20260618-01", supplier: "宁波华翔电子", inTime: "2026-06-18 08:30", vehicle: "E8-SM-017-01", process: "OP30 前保安装", operator: "陈师傅", status: "已装车" },
  { key: "2", traceCode: "TR-2026-0615-003", name: "线束总成(前舱)", batch: "B20260615-03", supplier: "莱尼电气系统", inTime: "2026-06-15 14:20", vehicle: "E8-SM-017-02", process: "OP45 线束敷设", operator: "周工", status: "已装车" },
  { key: "3", traceCode: "TR-2026-0610-002", name: "电池包下壳体", batch: "B20260610-02", supplier: "宁德时代", inTime: "2026-06-10 09:15", vehicle: "E8-SM-017-01", process: "OP60 电池包装配", operator: "叶师傅", status: "检验中" },
  { key: "4", traceCode: "TR-2026-0620-001", name: "域控制器支架", batch: "B20260620-01", supplier: "吉利内部调拨", inTime: "2026-06-20 10:45", vehicle: "—", process: "—", operator: "王班长", status: "已入库" },
  { key: "5", traceCode: "TR-2026-0617-R01", name: "前防撞梁组件", batch: "B20260617-R1", supplier: "拆车件(来源E8-03)", inTime: "2026-06-17 16:00", vehicle: "E8-SM-017-03", process: "OP25 车身结构", operator: "陈师傅", status: "待装车" },
  { key: "6", traceCode: "TR-2026-0612-001", name: "电机悬置支架", batch: "B20260612-01", supplier: "万向集团", inTime: "2026-06-12 11:30", vehicle: "E8-SM-017-02", process: "OP55 动力总成", operator: "李工", status: "已装车" },
  { key: "7", traceCode: "TR-2026-0622-001", name: "高压线束护板", batch: "B20260622-01", supplier: "科世达", inTime: "2026-06-22 08:50", vehicle: "—", process: "—", operator: "王班长", status: "已入库" },
  { key: "8", traceCode: "TR-2026-0619-R02", name: "后副车架总成", batch: "B20260619-R2", supplier: "拆车件(来源E8-05)", inTime: "2026-06-19 15:20", vehicle: "E8-SM-017-01", process: "OP20 底盘装配", operator: "叶师傅", status: "已退库" },
];

const columns = [
  { title: "追溯码", dataIndex: "traceCode", key: "traceCode", width: 160, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12, color: "#0b4f91" }}>{v}</span> },
  { title: "物料名称", dataIndex: "name", key: "name", width: 140 },
  { title: "批次号", dataIndex: "batch", key: "batch", width: 130, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
  { title: "供应商", dataIndex: "supplier", key: "supplier", width: 150 },
  { title: "入库时间", dataIndex: "inTime", key: "inTime", width: 140 },
  { title: "绑定车辆", dataIndex: "vehicle", key: "vehicle", width: 130 },
  { title: "绑定工序", dataIndex: "process", key: "process", width: 130 },
  { title: "操作人", dataIndex: "operator", key: "operator", width: 80 },
  { title: "当前状态", dataIndex: "status", key: "status", width: 90, render: (v: string) => <Tag color={STATUS_COLORS[v] ?? "default"}>{v}</Tag> },
];

export default function TracePage() {
  return (
    <>
      <PageHeader
        title="批次追溯"
        description="支持正向追踪（物料→车辆）与反向追溯（车辆→物料来源），实现全链路批次关联与质量回溯。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} xl={8}>
          <SurfaceCard title="追溯链路示例" subtitle="前保险杠总成 · B20260618-01">
            <Timeline
              items={[
                { color: "blue", children: <div><b>供应商出货</b><div style={{ color: "#718096", fontSize: 12 }}>宁波华翔电子 · 2026-06-17 16:00 发运</div></div> },
                { color: "cyan", children: <div><b>入库检验</b><div style={{ color: "#718096", fontSize: 12 }}>IQC 抽检合格 · 2026-06-18 08:30 入库 A-01-03</div></div> },
                { color: "gold", children: <div><b>线边配送</b><div style={{ color: "#718096", fontSize: 12 }}>AGV 配送至线边 L-03 · 2026-06-18 09:15</div></div> },
                { color: "green", children: <div><b>扫码装车</b><div style={{ color: "#718096", fontSize: 12 }}>绑定 E8-SM-017-01 / OP30 · 操作人 陈师傅</div></div> },
                { color: "green", children: <div><b>质量检验</b><div style={{ color: "#718096", fontSize: 12 }}>OP30 工序检验合格 · 2026-06-18 11:40</div></div> },
              ]}
            />
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={16}>
          <SurfaceCard title="追溯记录" subtitle="全量物料批次追溯台账" extra={<NodeIndexOutlined style={{ fontSize: 18, color: "#0b4f91" }} />}>
            <Table
              rowKey="key"
              size="small"
              pagination={false}
              dataSource={traceData}
              columns={columns}
              scroll={{ x: 1100 }}
            />
          </SurfaceCard>
        </Col>
      </Row>
    </>
  );
}
