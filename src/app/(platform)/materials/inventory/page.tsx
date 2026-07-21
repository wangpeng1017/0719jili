"use client";

import { DatabaseOutlined, WarningOutlined } from "@ant-design/icons";
import { Col, Row, Statistic, Table, Tag } from "antd";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const MATERIAL_TYPE_COLORS: Record<string, string> = {
  标准件: "blue",
  调拨件: "purple",
  新开件: "cyan",
  拆车件: "orange",
};

const inventoryData = [
  { key: "1", code: "MAT-STD-0012", name: "前保险杠总成", spec: "PP+EPDM-T20 黑色", location: "A-01-03", batch: "B20260618-01", qty: 24, unit: "件", type: "标准件", inDate: "2026-06-18", expiry: "—" },
  { key: "2", code: "MAT-STD-0035", name: "线束总成(前舱)", spec: "12V/48V 混合 32Pin", location: "A-02-07", batch: "B20260615-03", qty: 18, unit: "套", type: "标准件", inDate: "2026-06-15", expiry: "—" },
  { key: "3", code: "MAT-ALC-0008", name: "电池包下壳体", spec: "铝合金 6061-T6", location: "B-01-02", batch: "B20260610-02", qty: 6, unit: "件", type: "调拨件", inDate: "2026-06-10", expiry: "—" },
  { key: "4", code: "MAT-NEW-0021", name: "域控制器支架", spec: "冷轧钢板 1.5mm", location: "B-03-05", batch: "B20260620-01", qty: 40, unit: "件", type: "新开件", inDate: "2026-06-20", expiry: "—" },
  { key: "5", code: "MAT-REM-0003", name: "前防撞梁组件", spec: "热成型钢 1500MPa", location: "L-03-01", batch: "B20260617-R1", qty: 3, unit: "件", type: "拆车件", inDate: "2026-06-17", expiry: "—" },
  { key: "6", code: "MAT-STD-0048", name: "密封胶条(车门)", spec: "EPDM 三元乙丙", location: "C-02-04", batch: "B20260520-05", qty: 120, unit: "米", type: "标准件", inDate: "2026-05-20", expiry: "2026-11-20" },
  { key: "7", code: "MAT-STD-0052", name: "结构胶(车身)", spec: "聚氨酯 PU 310ml", location: "C-01-08", batch: "B20260410-02", qty: 85, unit: "支", type: "标准件", inDate: "2026-04-10", expiry: "2026-07-10" },
  { key: "8", code: "MAT-ALC-0015", name: "电机悬置支架", spec: "铸铝 ZL104", location: "B-02-06", batch: "B20260612-01", qty: 10, unit: "件", type: "调拨件", inDate: "2026-06-12", expiry: "—" },
  { key: "9", code: "MAT-NEW-0009", name: "高压线束护板", spec: "PA6+GF30 阻燃V0", location: "A-04-02", batch: "B20260622-01", qty: 55, unit: "件", type: "新开件", inDate: "2026-06-22", expiry: "—" },
  { key: "10", code: "MAT-REM-0007", name: "后副车架总成", spec: "高强度钢 焊接件", location: "L-05-02", batch: "B20260619-R2", qty: 2, unit: "件", type: "拆车件", inDate: "2026-06-19", expiry: "—" },
];

const columns = [
  { title: "物料编码", dataIndex: "code", key: "code", width: 140, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
  { title: "物料名称", dataIndex: "name", key: "name", width: 150 },
  { title: "规格", dataIndex: "spec", key: "spec", width: 170 },
  { title: "库位", dataIndex: "location", key: "location", width: 90, render: (v: string) => <Tag>{v}</Tag> },
  { title: "批次号", dataIndex: "batch", key: "batch", width: 140, render: (v: string) => <span style={{ fontFamily: "Fira Code, monospace", fontSize: 12 }}>{v}</span> },
  { title: "库存数量", dataIndex: "qty", key: "qty", width: 90, align: "right" as const },
  { title: "单位", dataIndex: "unit", key: "unit", width: 60 },
  { title: "物料类型", dataIndex: "type", key: "type", width: 100, render: (v: string) => <Tag color={MATERIAL_TYPE_COLORS[v] ?? "default"}>{v}</Tag> },
  { title: "入库日期", dataIndex: "inDate", key: "inDate", width: 110 },
  { title: "保质期/有效期", dataIndex: "expiry", key: "expiry", width: 120, render: (v: string) => (v === "—" ? <span style={{ color: "#a0aec0" }}>—</span> : <span style={{ color: v <= "2026-07-15" ? "#c93636" : undefined, fontWeight: v <= "2026-07-15" ? 600 : undefined }}>{v}</span>) },
];

export default function InventoryPage() {
  const totalSku = inventoryData.length;
  const estimatedValue = inventoryData.reduce((sum, item) => sum + item.qty * (item.type === "拆车件" ? 3200 : item.type === "调拨件" ? 5800 : item.type === "新开件" ? 420 : 860), 0);
  const expiringCount = inventoryData.filter((item) => item.expiry !== "—" && item.expiry <= "2026-07-15").length;

  return (
    <>
      <PageHeader
        title="库存台账"
        description="线边库与中心仓库库存统一管理，实时掌握物料分布、批次与有效期状态。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="SKU 总数" value={totalSku} suffix="种" prefix={<DatabaseOutlined />} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="库存总金额（估算）" value={estimatedValue} prefix="¥" precision={0} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard compact>
            <Statistic title="临期预警数" value={expiringCount} suffix="项" prefix={<WarningOutlined />} valueStyle={{ color: "#c93636" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="库存明细" subtitle="线边库 + 中心仓库全量台账">
        <Table
          rowKey="key"
          size="small"
          pagination={false}
          dataSource={inventoryData}
          columns={columns}
          scroll={{ x: 1100 }}
        />
      </SurfaceCard>
    </>
  );
}
