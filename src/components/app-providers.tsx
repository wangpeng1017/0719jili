"use client";

import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import { DemoStoreProvider } from "@/lib/demo-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DemoStoreProvider>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            colorPrimary: "#0B4F91",
            colorInfo: "#146EC8",
            colorSuccess: "#16845B",
            colorWarning: "#D68B00",
            colorError: "#C93636",
            borderRadius: 10,
            colorText: "#13243A",
            colorTextSecondary: "#5B6B7F",
            fontFamily: '"Fira Sans", "PingFang SC", "Microsoft YaHei", Arial, sans-serif',
          },
          components: {
            Table: { headerBg: "#EDF3F8", headerColor: "#40546A" },
            Menu: { darkItemBg: "transparent", darkItemSelectedBg: "rgba(68, 163, 247, 0.24)" },
          },
        }}
      >
        <App>{children}</App>
      </ConfigProvider>
    </DemoStoreProvider>
  );
}
