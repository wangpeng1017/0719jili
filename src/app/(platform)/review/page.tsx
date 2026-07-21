"use client";

import { CheckCircleOutlined, FilePdfOutlined, LockOutlined, MessageOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, App, Button, Col, Descriptions, Input, List, Modal, Progress, Row, Select, Space, Table, Tag, Timeline } from "antd";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { SurfaceCard } from "@/components/surface-card";
import { useDemoStore, type ReviewComment } from "@/lib/demo-store";

const pageOptions = [1, 2, 3, 4, 5, 6].map((p) => ({ value: p, label: `P${String(p).padStart(2, "0")}` }));

export default function ReviewPage() {
  const { state, dispatch } = useDemoStore();
  const { message } = App.useApp();
  const [previewOpen, setPreviewOpen] = useState(false);
  const pages = state.reviewPages;
  const sections = state.solutionSections;
  const comments = state.reviewComments;
  const openComments = pages.reduce((sum, item) => sum + item.comments, 0);
  const passRate = useMemo(() => Math.round((pages.filter((item) => item.status === "passed").length / pages.length) * 100), [pages]);

  // 新增意见 modal state
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ page: 3, author: "", content: "" });

  // 回复关闭 modal state
  const [resolveTarget, setResolveTarget] = useState<ReviewComment | null>(null);
  const [reply, setReply] = useState("");

  const closeOne = () => {
    const target = pages.find((item) => item.comments > 0);
    if (!target) return;
    dispatch({ type: "CLOSE_REVIEW_COMMENT" });
    message.success(`已关闭第 ${target.page} 页一条评审意见`);
  };

  const freeze = () => {
    dispatch({ type: "FREEZE_VERSION" });
    message.success("方案 V4.0 已冻结并生成现场发布版本");
  };

  const openAdd = () => {
    setAddForm({ page: 3, author: "", content: "" });
    setAddOpen(true);
  };

  const confirmAdd = () => {
    if (!addForm.author.trim() || !addForm.content.trim()) {
      message.warning("请填写提出人与意见内容");
      return;
    }
    dispatch({ type: "ADD_REVIEW_COMMENT", payload: { page: addForm.page, author: addForm.author.trim(), content: addForm.content.trim() } });
    message.success(`已新增第 ${addForm.page} 页评审意见`);
    setAddOpen(false);
  };

  const openResolve = (comment: ReviewComment) => {
    setResolveTarget(comment);
    setReply("");
  };

  const confirmResolve = () => {
    if (!resolveTarget) return;
    if (!reply.trim()) {
      message.warning("请填写回复内容");
      return;
    }
    dispatch({ type: "RESOLVE_REVIEW_COMMENT", payload: { commentId: resolveTarget.id, reply: reply.trim() } });
    message.success(`已回复并关闭意见 ${resolveTarget.id}`);
    setResolveTarget(null);
  };

  return (
    <>
      <PageHeader
        title="方案评审与版本冻结"
        description="结构化字段与原始附件共同构成完整方案；页级意见必须闭环后，才能冻结为生产执行依据。"
        actions={<Space><Button icon={<FilePdfOutlined />} onClick={() => setPreviewOpen(true)}>查看 V3.0 执行版</Button><Button type="primary" icon={<LockOutlined />} disabled={openComments > 0 || state.versionFrozen} onClick={freeze}>{state.versionFrozen ? "V4.0 已冻结" : "冻结 V4.0"}</Button></Space>}
      />

      <Alert
        type={state.versionFrozen ? "success" : "warning"}
        showIcon
        message={state.versionFrozen ? "V4.0 已冻结，可发布到工位" : `V4.0 仍有 ${openComments} 条未关闭意见，不可发布到现场`}
        description="当前生产任务继续引用 V3.0 冻结版；V4.0 变更涉及拆换件清单与计划窗口，冻结后将触发物料和排产影响确认。"
        style={{ marginBottom: 14 }}
      />

      <SurfaceCard
        title="结构化方案"
        subtitle="V4.0 结构化字段：与原始附件共同构成完整方案，作为评审与冻结依据"
        compact
      >
        <Descriptions
          column={{ xs: 1, md: 2 }}
          size="small"
          bordered
          items={sections.map((item) => ({ key: item.fieldKey, label: item.label, children: item.content }))}
        />
      </SurfaceCard>

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
                { color: state.versionFrozen ? "green" : "blue", children: <div><b>V4.0 · 变更评审版</b><div className="section-subtitle">拆换件与计划窗口调整</div></div> },
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

      <SurfaceCard
        title="评审议题"
        subtitle="页级意见需逐条回复并关闭，方可满足冻结条件"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>新增意见</Button>}
      >
        <Table
          rowKey="id"
          pagination={false}
          dataSource={comments}
          scroll={{ x: 860 }}
          columns={[
            { title: "页码", dataIndex: "page", key: "page", width: 70, render: (value) => `P${String(value).padStart(2, "0")}` },
            { title: "提出人", dataIndex: "author", key: "author", width: 150 },
            { title: "内容", dataIndex: "content", key: "content" },
            {
              title: "状态",
              dataIndex: "status",
              key: "status",
              width: 100,
              render: (value) => (value === "open" ? <Tag color="gold">待处理</Tag> : <Tag color="green">已关闭</Tag>),
            },
            { title: "回复", dataIndex: "reply", key: "reply", width: 200, render: (value) => value || "—" },
            {
              title: "操作",
              key: "action",
              width: 110,
              render: (_, record) =>
                record.status === "open" ? (
                  <Button size="small" onClick={() => openResolve(record)}>回复关闭</Button>
                ) : (
                  <span style={{ color: "#9aa7b5" }}>—</span>
                ),
            },
          ]}
        />
      </SurfaceCard>

      <Modal title="V3.0 执行版 · 只读预览" open={previewOpen} onCancel={() => setPreviewOpen(false)} footer={<Button onClick={() => setPreviewOpen(false)}>关闭</Button>} width={640}>
        <List
          size="small"
          dataSource={pages.map((item) => ({ ...item }))}
          renderItem={(item) => (
            <List.Item>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <span>P{String(item.page).padStart(2, "0")} · {item.title}</span>
                <Tag color="green">已冻结通过</Tag>
              </div>
            </List.Item>
          )}
        />
      </Modal>

      <Modal
        title="新增评审意见"
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        onOk={confirmAdd}
        okText="提交意见"
        cancelText="取消"
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <div>
            <div style={{ marginBottom: 6 }}>页码</div>
            <Select style={{ width: "100%" }} value={addForm.page} onChange={(v) => setAddForm((f) => ({ ...f, page: v }))} options={pageOptions} />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>提出人</div>
            <Input placeholder="如：质量工程师 · 周工" value={addForm.author} onChange={(e) => setAddForm((f) => ({ ...f, author: e.target.value }))} />
          </div>
          <div>
            <div style={{ marginBottom: 6 }}>意见内容</div>
            <Input.TextArea rows={3} placeholder="填写评审意见" value={addForm.content} onChange={(e) => setAddForm((f) => ({ ...f, content: e.target.value }))} />
          </div>
        </Space>
      </Modal>

      <Modal
        title={`回复并关闭意见 · ${resolveTarget?.id ?? ""}`}
        open={!!resolveTarget}
        onCancel={() => setResolveTarget(null)}
        onOk={confirmResolve}
        okText="回复关闭"
        cancelText="取消"
      >
        {resolveTarget && (
          <>
            <p style={{ color: "#6b7a8c", marginBottom: 12 }}>
              P{String(resolveTarget.page).padStart(2, "0")} · {resolveTarget.author}：{resolveTarget.content}
            </p>
            <div style={{ marginBottom: 6 }}>回复内容</div>
            <Input.TextArea rows={3} placeholder="填写处理回复，关闭后该意见计入闭环" value={reply} onChange={(e) => setReply(e.target.value)} />
          </>
        )}
      </Modal>
    </>
  );
}
