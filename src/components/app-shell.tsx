"use client";

import {
  AppstoreOutlined,
  ApartmentOutlined,
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  CarOutlined,
  ControlOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  PartitionOutlined,
  ProjectOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SendOutlined,
  TeamOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { App, Avatar, Badge, Button, Drawer, Input, Layout, Menu, Popconfirm, Popover, Space, Tooltip } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useDemoStore } from "@/lib/demo-store";

const { Sider, Content } = Layout;

type NavLeaf = { key: string; label: string };
type NavItem = { key: string; icon: React.ReactNode; label: string; children?: NavLeaf[] };

const navigation: NavItem[] = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "管理驾驶舱" },
  { key: "/demands", icon: <SendOutlined />, label: "需求承接" },
  {
    key: "project-group",
    icon: <ProjectOutlined />,
    label: "项目管理",
    children: [
      { key: "/projects", label: "项目列表" },
      { key: "/projects/wbs", label: "WBS 分解" },
      { key: "/projects/board", label: "项目看板" },
    ],
  },
  { key: "/review", icon: <AuditOutlined />, label: "方案评审" },
  {
    key: "schedule-group",
    icon: <ApartmentOutlined />,
    label: "计划排产",
    children: [
      { key: "/schedule", label: "日调度板" },
      { key: "/schedule/plan", label: "周/月计划" },
      { key: "/schedule/capacity", label: "产能模型" },
      { key: "/schedule/gantt", label: "排产甘特图" },
    ],
  },
  {
    key: "production-group",
    icon: <ScheduleOutlined />,
    label: "生产管理",
    children: [
      { key: "/production/orders", label: "工单管理" },
      { key: "/production", label: "生产执行" },
      { key: "/production/wip", label: "在制品跟踪" },
      { key: "/production/exceptions", label: "异常与返工" },
      { key: "/production/board", label: "生产看板" },
    ],
  },
  {
    key: "process-group",
    icon: <PartitionOutlined />,
    label: "工艺管理",
    children: [
      { key: "/process", label: "工艺路线" },
      { key: "/process/sop", label: "作业指导书" },
      { key: "/process/bom", label: "改制 BOM" },
      { key: "/process/ecn", label: "工艺变更" },
      { key: "/process/tooling", label: "工装夹具" },
    ],
  },
  { key: "/workshop", icon: <ToolOutlined />, label: "数字工位" },
  {
    key: "quality-group",
    icon: <SafetyCertificateOutlined />,
    label: "质量管理",
    children: [
      { key: "/quality", label: "质量闭环" },
      { key: "/quality/inspection", label: "质量检验" },
      { key: "/quality/spc", label: "SPC 统计" },
      { key: "/quality/cost", label: "质量成本" },
    ],
  },
  {
    key: "material-group",
    icon: <AppstoreOutlined />,
    label: "物料管理",
    children: [
      { key: "/materials", label: "齐套与配送" },
      { key: "/materials/inventory", label: "库存台账" },
      { key: "/materials/trace", label: "批次追溯" },
      { key: "/materials/shortage", label: "缺件催料" },
    ],
  },
  {
    key: "equipment-group",
    icon: <DatabaseOutlined />,
    label: "设备管理",
    children: [
      { key: "/equipment", label: "设备台账" },
      { key: "/equipment/maintenance", label: "点检保养" },
      { key: "/equipment/repair", label: "维修工单" },
      { key: "/equipment/oee", label: "OEE 分析" },
    ],
  },
  {
    key: "personnel-group",
    icon: <TeamOutlined />,
    label: "人员班组",
    children: [
      { key: "/personnel/skills", label: "技能矩阵" },
      { key: "/personnel/shift", label: "排班管理" },
      { key: "/personnel/hours", label: "工时统计" },
    ],
  },
  { key: "/delivery", icon: <FileProtectOutlined />, label: "交付归档" },
  { key: "/vehicles/VH-7E001", icon: <CarOutlined />, label: "一车一档" },
  { key: "/integrations", icon: <ControlOutlined />, label: "集成中心" },
  {
    key: "report-group",
    icon: <BarChartOutlined />,
    label: "报表中心",
    children: [
      { key: "/reports/production", label: "生产报表" },
      { key: "/reports/quality", label: "质量报表" },
      { key: "/reports/custom", label: "自定义查询" },
    ],
  },
];

function NavigationMenu({ selectedKey, close }: { selectedKey: string; close?: () => void }) {
  return (
    <Menu
      className="platform-menu"
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      defaultOpenKeys={["project-group", "schedule-group", "production-group", "process-group", "quality-group", "material-group", "equipment-group", "personnel-group", "report-group"]}
      items={navigation.map((item) =>
        item.children
          ? {
              key: item.key,
              icon: item.icon,
              label: item.label,
              children: item.children.map((child) => ({
                key: child.key,
                label: (
                  <Link href={child.key} onClick={close}>
                    {child.label}
                  </Link>
                ),
              })),
            }
          : {
              key: item.key,
              icon: item.icon,
              label: (
                <Link href={item.key} onClick={close}>
                  {item.label}
                </Link>
              ),
            }
      )}
    />
  );
}

function useGlobalSearch() {
  const router = useRouter();
  const { state } = useDemoStore();
  const { message } = App.useApp();

  return (keyword: string) => {
    const term = keyword.trim().toLowerCase();
    if (!term) return;
    const project = state.projects.find(
      (item) => item.id.toLowerCase().includes(term) || item.name.toLowerCase().includes(term) || item.wbs.toLowerCase().includes(term)
    );
    if (project) {
      router.push(`/projects/${project.id}`);
      return;
    }
    const vehicle = state.vehicles.find(
      (item) => item.id.toLowerCase().includes(term) || item.vin.toLowerCase().includes(term) || item.prototypeNo.toLowerCase().includes(term) || item.uid.toLowerCase().includes(term)
    );
    if (vehicle) {
      router.push(`/vehicles/${vehicle.id}`);
      return;
    }
    const issue = state.qualityIssues.find((item) => item.id.toLowerCase().includes(term) || item.title.toLowerCase().includes(term));
    if (issue) {
      router.push("/quality");
      return;
    }
    message.warning(`未找到与"${keyword}"匹配的项目、车辆或质量问题`);
  };
}

function NotificationBell() {
  const { state } = useDemoStore();
  const router = useRouter();
  const unclosed = state.qualityIssues.filter((item) => item.status !== "closed").length;
  const scheduleConflict = state.scheduleRows.some((item) => item.status === "warning");
  const materialShortage = state.materials.some((item) => item.ready < item.required);
  const items = [
    ...(unclosed > 0 ? [{ title: `${unclosed} 项质量问题未关闭`, href: "/quality" }] : []),
    ...(scheduleConflict ? [{ title: "举升机 L2 存在插单冲突", href: "/schedule" }] : []),
    ...(materialShortage ? [{ title: "激光雷达线束缺 1 套", href: "/materials" }] : []),
  ];

  return (
    <Popover
      trigger="click"
      title="业务提醒"
      content={
        <Space direction="vertical" size={4} style={{ width: 260 }}>
          {items.length === 0 ? <span style={{ color: "#718096" }}>暂无业务提醒</span> : items.map((item) => (
              <Button key={item.title} type="text" block style={{ textAlign: "left" }} onClick={() => router.push(item.href)}>
                {item.title}
              </Button>
            ))}
        </Space>
      }
    >
      <Badge count={items.length} size="small">
        <Button type="text" aria-label="业务提醒" icon={<BellOutlined />} />
      </Badge>
    </Popover>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const search = useGlobalSearch();
  const { dispatch } = useDemoStore();
  const { message } = App.useApp();

  const leafKeys = useMemo(() => {
    const keys: string[] = [];
    for (const item of navigation) {
      if (item.children) keys.push(...item.children.map((c) => c.key));
      else keys.push(item.key);
    }
    return keys.sort((a, b) => b.length - a.length);
  }, []);

  const selectedKey = useMemo(() => {
    if (pathname.startsWith("/vehicles")) return "/vehicles/VH-7E001";
    if (pathname.startsWith("/projects")) return "/projects";
    return leafKeys.find((key) => pathname.startsWith(key)) ?? "/dashboard";
  }, [pathname, leafKeys]);

  const pageName = useMemo(() => {
    for (const item of navigation) {
      if (item.key === selectedKey) return item.label;
      const child = item.children?.find((c) => c.key === selectedKey);
      if (child) return child.label;
    }
    return "业务工作台";
  }, [selectedKey]);

  return (
    <Layout className="platform-layout">
      <Sider
        className="platform-sider"
        width={240}
        collapsedWidth={80}
        collapsed={collapsed}
        trigger={null}
      >
        <div className="brand">
          <div className="brand-mark">GX</div>
          {!collapsed && (
            <div>
              <div className="brand-title">试制改制数字化平台</div>
              <div className="brand-subtitle">Vehicle Retrofit OS</div>
            </div>
          )}
        </div>
        <NavigationMenu selectedKey={selectedKey} />
        <div style={{ position: "absolute", right: 12, bottom: 14, left: 12 }}>
          <Button
            block
            type="text"
            style={{ color: "rgba(255,255,255,.72)" }}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed((value) => !value)}
          >
            {!collapsed && "收起导航"}
          </Button>
        </div>
      </Sider>

      <Layout className={`platform-main${collapsed ? " collapsed" : ""}`}>
        <header className="platform-header">
          <Space size={12} style={{ minWidth: 0 }}>
            <Button
              className="mobile-only"
              type="text"
              aria-label="打开导航菜单"
              icon={<MenuOutlined />}
              onClick={() => setMobileOpen(true)}
            />
            <div className="header-context">
              <div className="header-eyebrow">吉利试制中心 · 改制业务</div>
              <div className="header-title">{pageName}</div>
            </div>
          </Space>
          <Space size={12}>
            <Input
              className="header-search"
              prefix={<SearchOutlined />}
              placeholder="搜索项目 / VIN / 任务，回车跳转"
              style={{ width: 250 }}
              aria-label="搜索项目、车辆或任务"
              onPressEnter={(event) => search(event.currentTarget.value)}
            />
            <Popconfirm
              title="重置演示数据"
              description="将清除本次演示产生的全部改动，恢复到初始状态"
              okText="重置"
              cancelText="取消"
              onConfirm={() => {
                dispatch({ type: "RESET" });
                message.success("演示数据已重置");
              }}
            >
              <Tooltip title="重置演示数据">
                <Button type="text" aria-label="重置演示数据" icon={<ReloadOutlined />} />
              </Tooltip>
            </Popconfirm>
            <Tooltip title="点击查看业务提醒">
              <span>
                <NotificationBell />
              </span>
            </Tooltip>
            <Space size={8}>
              <Avatar style={{ background: "#0b4f91" }}>王</Avatar>
              <div className="desktop-user" style={{ lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>王欣</div>
                <div style={{ color: "#6b7a8c", fontSize: 11 }}>试制策划经理</div>
              </div>
            </Space>
            <Tooltip title="退出登录">
              <Button
                type="text"
                aria-label="退出登录"
                icon={<LogoutOutlined />}
                onClick={async () => {
                  await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/auth/logout`, { method: "POST" });
                  window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/login`;
                }}
              />
            </Tooltip>
          </Space>
        </header>
        <Content className="platform-content">
          <main className="page-shell">{children}</main>
        </Content>
      </Layout>

      <Drawer
        title="试制改制数字化平台"
        placement="left"
        width={280}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        styles={{ body: { padding: 0, background: "#082f58" }, header: { color: "#fff", background: "#082f58" } }}
      >
        <NavigationMenu selectedKey={selectedKey} close={() => setMobileOpen(false)} />
      </Drawer>
    </Layout>
  );
}
