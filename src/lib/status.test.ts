import { readinessLevel, statusLabel } from "./status";

describe("status helpers", () => {
  it("converts internal status into customer-facing Chinese", () => {
    expect(statusLabel("in_progress")).toBe("执行中");
    expect(statusLabel("frozen")).toBe("已冻结");
  });

  it("classifies material readiness", () => {
    expect(readinessLevel(100)).toBe("ready");
    expect(readinessLevel(92)).toBe("warning");
    expect(readinessLevel(61)).toBe("shortage");
  });
});

