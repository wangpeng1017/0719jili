"use client";

import {
  AppstoreOutlined,
  ApartmentOutlined,
  AuditOutlined,
  BellOutlined,
  CarOutlined,
  ControlOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Drawer, Input, Layout, Menu, Space, Tag, Tooltip } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

const { Sider, Content } = Layout;

const navigation = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "管理驾驶舱" },
  { key: "/projects", icon: <ProjectOutlined />, label: "项目与任务" },
  { key: "/review", icon: <AuditOutlined />, label: "方案评审" },
  { key: "/schedule", icon: <ApartmentOutlined />, label: "计划与排产" },
  { key: "/materials", icon: <AppstoreOutlined />, label: "物料与追溯" },
  { key: "/workshop", icon: <ToolOutlined />, label: "数字工位" },
  { key: "/quality", icon: <SafetyCertificateOutlined />, label: "质量闭环" },
  { key: "/vehicles/VH-7E001", icon: <CarOutlined />, label: "一车一档" },
  { key: "/integrations", icon: <ControlOutlined />, label: "集成中心" },
];

function NavigationMenu({ selectedKey, close }: { selectedKey: string; close?: () => void }) {
  return (
    <Menu
      className="platform-menu"
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={navigation.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: (
          <Link href={item.key} onClick={close}>
            {item.label}
          </Link>
        ),
      }))}
    />
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const selectedKey = useMemo(() => {
    if (pathname.startsWith("/vehicles")) return "/vehicles/VH-7E001";
    if (pathname.startsWith("/projects")) return "/projects";
    return navigation.find((item) => pathname.startsWith(item.key))?.key ?? "/dashboard";
  }, [pathname]);

  const pageName = navigation.find((item) => item.key === selectedKey)?.label ?? "业务工作台";

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
              placeholder="搜索项目 / VIN / 任务"
              style={{ width: 250 }}
              aria-label="搜索项目、车辆或任务"
            />
            <Tag color="blue">汇报演示环境</Tag>
            <Tooltip title="3 条业务提醒">
              <Badge count={3} size="small">
                <Button type="text" aria-label="业务提醒" icon={<BellOutlined />} />
              </Badge>
            </Tooltip>
            <Space size={8}>
              <Avatar style={{ background: "#0b4f91" }}>王</Avatar>
              <div className="desktop-user" style={{ lineHeight: 1.25 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>王欣</div>
                <div style={{ color: "#6b7a8c", fontSize: 11 }}>试制策划经理</div>
              </div>
            </Space>
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
