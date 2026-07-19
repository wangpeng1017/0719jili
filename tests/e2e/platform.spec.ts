import { expect, test } from "@playwright/test";

const pages = [
  ["/dashboard", "改制业务驾驶舱"],
  ["/projects", "项目与任务台账"],
  ["/projects/PRJ-2026-SM-017", "银河 E8 智驾验证车改制"],
  ["/review", "方案评审与版本冻结"],
  ["/schedule", "项目 + 资源双线排产"],
  ["/materials", "物料齐套与拆换件追溯"],
  ["/workshop", "数字工位 · 管理车间 L1"],
  ["/quality", "质量问题闭环"],
  ["/vehicles/VH-7E001", "一车一档 · E8-SM-017-01"],
  ["/integrations", "一体化集成中心"],
] as const;

test("all customer-report routes render and fit viewport", async ({ page }, testInfo) => {
  for (const [path, heading] of pages) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow, `${path} should not overflow viewport in ${testInfo.project.name}`).toBeFalsy();
  }
});

test("review comments can close and V4 can freeze", async ({ page }) => {
  await page.goto("/review");
  const closeButton = page.getByRole("button", { name: "演示：关闭一条意见" });
  await closeButton.click();
  await closeButton.click();
  await closeButton.click();
  const freezeButton = page.getByRole("button", { name: "冻结 V4.0" });
  await expect(freezeButton).toBeEnabled();
  await freezeButton.click();
  await expect(page.getByText("V4.0 已冻结，可发布到工位")).toBeVisible();
});

test("workshop scan updates visible operation feedback", async ({ page }) => {
  await page.goto("/workshop");
  await page.getByRole("button", { name: "扫码拆 / 装件" }).click();
  await expect(page.getByText("扫码校验通过：车辆、任务、工位、件码一致")).toBeVisible();
  await expect(page.getByText(/关键件 SN-DEMO-/)).toBeVisible();
});

test("dashboard visual snapshots", async ({ page }, testInfo) => {
  await page.goto("/dashboard");
  await page.screenshot({ path: `artifacts/dashboard-${testInfo.project.name}.png`, fullPage: true });
});
