"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        message.error(data.error || "登录失败");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      message.error("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #082f58 0%, #0b4f91 100%)" }}>
      <Card style={{ width: 380, borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#0b4f91", color: "#fff", display: "inline-grid", placeItems: "center", fontSize: 18, fontWeight: 800 }}>GX</div>
          <Typography.Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>试制改制数字化平台</Typography.Title>
          <Typography.Text type="secondary">Vehicle Retrofit OS</Typography.Text>
        </div>
        <Form onFinish={onFinish} size="large" initialValues={{ username: "wangxin", password: "demo123" }}>
          <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>登录</Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary" style={{ display: "block", textAlign: "center", fontSize: 12 }}>
          演示账号：wangxin / demo123
        </Typography.Text>
      </Card>
    </div>
  );
}
