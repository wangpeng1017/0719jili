"use client";

import { CheckCircleOutlined, FilePdfOutlined, LockOutlined, MessageOutlined } from "@ant-design/icons";
import { Alert, Button, Col, List, message, Progress, Row, Space, Table, Tag, Timeline } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { reviewPages } from "@/lib/demo-data";

export default function ReviewPage() {
  const [pages, setPages] = useState(reviewPages);
  const [frozen, setFrozen] = useState(false);
  const openComments = pages.reduce((sum, item) => sum + item.comments, 0);
  const passRate = useMemo(() => Math.round((pages.filter((item) => item.status === "passed").length / pages.length) * 100), [pages]);

  const closeOne = () => {
    const target = pages.find((item) => item.comments > 0);
    if (!target) return;
    setPages((items) => items.map((item) => item.page === target.page ? { ...item, comments: item.comments - 1, status: item.comments - 1 === 0 ? "passed" : item.status } : item));
    message.success(`已关闭第 ${target.page} 页一条评审意见`);
  };

  const freeze = () => {
    setFrozen(true);
    message.success("方案 V4.0 已冻结并生成现场发布版本");
  };

  return (
    <>
      <PageHeader
        title="方案评审与版本冻结"
        description="结构化字段与原始附件共同构成完整方案；页级意见必须闭环后，才能冻结为生产执行依据。"
        actions={<Space><Button icon={<FilePdfOutlined />}>查看 V3.0 执行版</Button><Button type="primary" icon={<LockOutlined />} disabled={openComments > 0 || frozen} onClick={freeze}>{frozen ? "V4.0 已冻结" : "冻结 V4.0"}</Button></Space>}
      />

      <Alert
        type={frozen ? "success" : "warning"}
        showIcon
        message={frozen ? "V4.0 已冻结，可发布到工位" : `V4.0 仍有 ${openComments} 条未关闭意见，不可发布到现场`}
        description="当前生产任务继续引用 V3.0 冻结版；V4.0 变更涉及拆换件清单与计划窗口，冻结后将触发物料和排产影响确认。"
        style={{ marginBottom: 14 }}
      />

      <Row gutter={[14, 14]}>
        <Col xs={24} xl={17}>
          <SurfaceCard
            title="V4.0 页级评审清单"
            subtitle="关键页通过率达到 100%，且意见全部关闭后可整体冻结"
            extra={<Space><Progress type="circle" percent={passRate} size={54} /><Button icon={<MessageOutlined />} disabled={openComments === 0} onClick={closeOne}>演示：关闭一条意见</Button></Space>}
          >
            <Table
              rowKey="page"
              pagination={false}
              dataSource={pages}
              scroll={{ x: 760 }}
              columns={[
                { title: "页码", dataIndex: "page", key: "page", width: 70, render: (value) => `P${String(value).padStart(2, "0")}` },
                { title: "评审对象", dataIndex: "title", key: "title" },
                { title: "责任角色", dataIndex: "owner", key: "owner", width: 130 },
                { title: "未关闭意见", dataIndex: "comments", key: "comments", width: 110, render: (value) => <Tag color={value > 0 ? "gold" : "green"}>{value} 条</Tag> },
                { title: "状态", dataIndex: "status", key: "status", width: 100, render: (value) => <StatusPill status={value} /> },
              ]}
            />
          </SurfaceCard>
        </Col>
        <Col xs={24} xl={7}>
          <SurfaceCard title="版本链" subtitle="冻结版本只读，变更必须升版">
            <Timeline
              items={[
                { color: "green", children: <div><b>V3.0 · 生产执行版</b><div className="section-subtitle">07-16 冻结 · 现场正在引用</div></div> },
                { color: frozen ? "green" : "blue", children: <div><b>V4.0 · 变更评审版</b><div className="section-subtitle">拆换件与计划窗口调整</div></div> },
                { color: "gray", children: <div><b>V2.0 · 历史版本</b><div className="section-subtitle">07-12 冻结，已被 V3 替代</div></div> },
              ]}
            />
            <List
              size="small"
              header={<b>V4.0 变更摘要</b>}
              dataSource={["新增 1 套激光雷达线束", "E8-03 计划窗口后移 0.5 天", "前舱支架孔位质量点升级为必检"]}
              renderItem={(item) => <List.Item><CheckCircleOutlined style={{ marginRight: 8, color: "#146ec8" }} />{item}</List.Item>}
            />
          </SurfaceCard>
        </Col>
      </Row>
    </>
  );
}

