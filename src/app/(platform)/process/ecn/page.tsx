"use client";

import {
  AuditOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  EditOutlined,
  FileSyncOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Col, Row, Space, Statistic, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PageHeader } from "@/components/page-header";
import { SurfaceCard } from "@/components/surface-card";

interface EcnRecord {
  key: string;
  ecnNo: string;
  title: string;
  changeType: "工艺" | "设计" | "物料" | "设备";
  impactScope: string;
  applicant: string;
  applyDate: string;
  status: "草稿" | "审批中" | "已批准" | "已实施" | "已关闭";
  priority: "高" | "中" | "低";
}

const ecnData: EcnRecord[] = [
  { key: "1", ecnNo: "ECN-2024-0061", title: "电池包安装工序扭矩标准变更", changeType: "工艺", impactScope: "电池包装配工序 OP-030", applicant: "张伟", applyDate: "2024-06-18", status: "审批中", priority: "高" },
  { key: "2", ecnNo: "ECN-2024-0058", title: "前雷达支架结构优化（减重）", changeType: "设计", impactScope: "前保险杠总成 / 雷达安装位", applicant: "李娜", applyDate: "2024-06-15", status: "已批准", priority: "中" },
  { key: "3", ecnNo: "ECN-2024-0055", title: "高压线束接插件供应商切换", changeType: "物料", impactScope: "高压线束总成 / 全部改制车辆", applicant: "王强", applyDate: "2024-06-12", status: "已实施", priority: "高" },
  { key: "4", ecnNo: "ECN-2024-0052", title: "涂胶工位机器人程序升级", changeType: "设备", impactScope: "涂胶工序 OP-050 / 密封胶涂布", applicant: "赵敏", applyDate: "2024-06-10", status: "已关闭", priority: "低" },
  { key: "5", ecnNo: "ECN-2024-0049", title: "VCU 刷写流程增加版本校验步骤", changeType: "工艺", impactScope: "电控刷写工序 OP-070", applicant: "陈晨", applyDate: "2024-06-08", status: "草稿", priority: "中" },
  { key: "6", ecnNo: "ECN-2024-0045", title: "拆除件回收分类标识规范更新", changeType: "物料", impactScope: "拆解工序 OP-010 / 全部拆除件", applicant: "刘洋", applyDate: "2024-06-05", status: "已实施", priority: "低" },
];

const changeTypeColorMap: Record<EcnRecord["changeType"], string> = {
  工艺: "blue",
  设计: "purple",
  物料: "cyan",
  设备: "geekblue",
};

const statusConfig: Record<EcnRecord["status"], { color: string; icon: React.ReactNode }> = {
  草稿: { color: "default", icon: <EditOutlined /> },
  审批中: { color: "processing", icon: <AuditOutlined /> },
  已批准: { color: "warning", icon: <ClockCircleFilled /> },
  已实施: { color: "success", icon: <CheckCircleFilled /> },
  已关闭: { color: "default", icon: <CloseCircleFilled /> },
};

const priorityColorMap: Record<EcnRecord["priority"], string> = {
  高: "red",
  中: "orange",
  低: "default",
};

const columns: ColumnsType<EcnRecord> = [
  { title: "变更单号", dataIndex: "ecnNo", key: "ecnNo", width: 150 },
  { title: "标题", dataIndex: "title", key: "title", width: 260 },
  {
    title: "变更类型",
    dataIndex: "changeType",
    key: "changeType",
    width: 90,
    render: (type: EcnRecord["changeType"]) => <Tag color={changeTypeColorMap[type]}>{type}</Tag>,
  },
  { title: "影响范围", dataIndex: "impactScope", key: "impactScope", width: 220 },
  { title: "申请人", dataIndex: "applicant", key: "applicant", width: 80 },
  { title: "申请日期", dataIndex: "applyDate", key: "applyDate", width: 110 },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 110,
    render: (status: EcnRecord["status"]) => {
      const cfg = statusConfig[status];
      return <Tag color={cfg.color} icon={cfg.icon}>{status}</Tag>;
    },
  },
  {
    title: "优先级",
    dataIndex: "priority",
    key: "priority",
    width: 80,
    render: (priority: EcnRecord["priority"]) => <Tag color={priorityColorMap[priority]}>{priority}</Tag>,
  },
];

export default function EcnPage() {
  const totalEcn = ecnData.length;
  const pendingApproval = ecnData.filter((r) => r.status === "审批中").length;
  const implemented = ecnData.filter((r) => r.status === "已实施" || r.status === "已关闭").length;

  return (
    <>
      <PageHeader
        title="工艺变更管理"
        description="ECN/ECR 工程变更全流程管理：从变更申请、评审、批准到实施与关闭，确保改制工艺变更受控、可追溯，影响范围清晰。"
      />

      <Row gutter={[14, 14]} style={{ marginBottom: 14 }}>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="变更单总数" value={totalEcn} suffix="单" prefix={<FileSyncOutlined />} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="审批中" value={pendingApproval} suffix="单" prefix={<AuditOutlined />} valueStyle={{ color: "#0b4f91" }} />
          </SurfaceCard>
        </Col>
        <Col xs={24} sm={8}>
          <SurfaceCard>
            <Statistic title="已实施 / 已关闭" value={implemented} suffix="单" prefix={<RocketOutlined />} valueStyle={{ color: "#16845b" }} />
          </SurfaceCard>
        </Col>
      </Row>

      <SurfaceCard title="工程变更单台账" subtitle="ECN 状态流转：草稿 → 审批中 → 已批准 → 已实施 → 已关闭">
        <Table
          rowKey="key"
          size="small"
          columns={columns}
          dataSource={ecnData}
          pagination={false}
          scroll={{ x: 1100 }}
        />
        <div style={{ marginTop: 12, color: "#6b7a8c", fontSize: 12 }}>
          <Tooltip title="变更实施后，关联工艺路线与 SOP 自动触发升版评审">
            <span style={{ cursor: "help", borderBottom: "1px dashed #6b7a8c" }}>
              变更实施后，关联工艺路线与 SOP 将自动触发升版评审，确保现场文件与最新工艺一致。
            </span>
          </Tooltip>
        </div>
      </SurfaceCard>
    </>
  );
}
