"use client";

import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined, SearchOutlined } from "@ant-design/icons";
import { App, Button, Col, Row, Select, Space, Table, Tag } from "antd";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

const dataSourceOptions = [
  { value: "production", label: "生产数据" },
  { value: "quality", label: "质量数据" },
  { value: "material", label: "物料数据" },
  { value: "equipment", label: "设备数据" },
  { value: "personnel", label: "人员数据" },
];

const timeRangeOptions = [
  { value: "week", label: "本周" },
  { value: "month", label: "本月" },
  { value: "quarter", label: "本季度" },
  { value: "year", label: "本年度" },
];

const projectOptions = [
  { value: "all", label: "全部项目" },
  { value: "E8-SM-017", label: "E8-SM-017" },
  { value: "E8-SM-022", label: "E8-SM-022" },
  { value: "E8-SM-025", label: "E8-SM-025" },
];

interface QueryResult {
  key: string;
  date: string;
  project: string;
  category: string;
  metric1: string;
  metric2: string;
  metric3: string;
  status: string;
}

const sampleResults: QueryResult[] = [
  { key: "1", date: "07-14", project: "E8-SM-017", category: "生产", metric1: "6 台", metric2: "42 h", metric3: "0 min", status: "正常" },
  { key: "2", date: "07-15", project: "E8-SM-017", category: "质量", metric1: "95.3%", metric2: "2 项", metric3: "1 项", status: "正常" },
  { key: "3", date: "07-15", project: "E8-SM-022", category: "生产", metric1: "4 台", metric2: "40 h", metric3: "0 min", status: "正常" },
  { key: "4", date: "07-16", project: "E8-SM-022", category: "物料", metric1: "128 件", metric2: "3 件", metric3: "97.7%", status: "预警" },
  { key: "5", date: "07-16", project: "E8-SM-017", category: "设备", metric1: "98.2%", metric2: "1 次", metric3: "15 min", status: "正常" },
  { key: "6", date: "07-17", project: "E8-SM-025", category: "人员", metric1: "8 人", metric2: "92%", metric3: "4 h", status: "正常" },
  { key: "7", date: "07-17", project: "E8-SM-017", category: "生产", metric1: "6 台", metric2: "43 h", metric3: "0 min", status: "正常" },
  { key: "8", date: "07-18", project: "E8-SM-022", category: "质量", metric1: "93.0%", metric2: "1 项", metric3: "0 项", status: "正常" },
];

export default function CustomQueryPage() {
  const { message } = App.useApp();
  const [dataSource, setDataSource] = useState<string | undefined>(undefined);
  const [timeRange, setTimeRange] = useState<string | undefined>(undefined);
  const [project, setProject] = useState<string | undefined>(undefined);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleQuery = () => {
    setResults(sampleResults);
    setSearched(true);
    message.success("查询完成，共返回 8 条记录");
  };

  const handleExportExcel = () => {
    message.info("Excel 导出功能开发中，敬请期待");
  };

  const handleExportPdf = () => {
    message.info("PDF 导出功能开发中，敬请期待");
  };

  const columns = [
    { title: "日期", dataIndex: "date", key: "date", width: 90 },
    { title: "项目", dataIndex: "project", key: "project", width: 120, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "数据类别", dataIndex: "category", key: "category", width: 100, render: (v: string) => <Tag>{v}</Tag> },
    { title: "指标一", dataIndex: "metric1", key: "metric1", width: 100, align: "right" as const },
    { title: "指标二", dataIndex: "metric2", key: "metric2", width: 100, align: "right" as const },
    { title: "指标三", dataIndex: "metric3", key: "metric3", width: 100, align: "right" as const },
    { title: "状态", dataIndex: "status", key: "status", width: 90, render: (v: string) => <Tag color={v === "正常" ? "green" : "orange"}>{v}</Tag> },
  ];

  return (
    <>
      <PageHeader
        title="自定义查询"
        description="灵活数据查询与导出，支持按数据源、时间范围、项目筛选组合查询，结果可导出为 Excel 或 PDF。"
      />

      <SurfaceCard title="查询条件" subtitle="选择数据源与筛选条件后点击查询">
        <Row gutter={[14, 14]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <div style={{ marginBottom: 6, fontSize: 12, color: "#718096" }}>数据源</div>
            <Select
              placeholder="选择数据源"
              style={{ width: "100%" }}
              options={dataSourceOptions}
              value={dataSource}
              onChange={setDataSource}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <div style={{ marginBottom: 6, fontSize: 12, color: "#718096" }}>时间范围</div>
            <Select
              placeholder="选择时间范围"
              style={{ width: "100%" }}
              options={timeRangeOptions}
              value={timeRange}
              onChange={setTimeRange}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <div style={{ marginBottom: 6, fontSize: 12, color: "#718096" }}>项目筛选</div>
            <Select
              placeholder="选择项目"
              style={{ width: "100%" }}
              options={projectOptions}
              value={project}
              onChange={setProject}
              allowClear
            />
          </Col>
          <Col xs={24} sm={24} md={6}>
            <div style={{ marginBottom: 6, fontSize: 12, color: "transparent" }}>操作</div>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>
              查询
            </Button>
          </Col>
        </Row>
      </SurfaceCard>

      <div style={{ height: 14 }} />

      <SurfaceCard
        title="查询结果"
        subtitle={searched ? "共 8 条记录" : "请设置查询条件后点击查询"}
        extra={
          <Space>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} disabled={!searched}>
              导出Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={handleExportPdf} disabled={!searched}>
              导出PDF
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="key"
          dataSource={results}
          columns={columns}
          pagination={false}
          scroll={{ x: 700 }}
          size="middle"
          locale={{ emptyText: searched ? "暂无数据" : "请输入查询条件" }}
        />
      </SurfaceCard>
    </>
  );
}
