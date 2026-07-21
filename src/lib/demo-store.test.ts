import {
  buildInitialState,
  mainProject,
  mainVehicle,
  projectedHealthCheck,
  reducer,
  unclosedQualityCount,
} from "@/lib/demo-store";

describe("demo store business flows", () => {
  it("blocks version freeze until every review comment is closed", () => {
    let state = buildInitialState();

    expect(reducer(state, { type: "FREEZE_VERSION" })).toBe(state);

    state = reducer(state, { type: "CLOSE_REVIEW_COMMENT" });
    state = reducer(state, { type: "CLOSE_REVIEW_COMMENT" });
    state = reducer(state, { type: "CLOSE_REVIEW_COMMENT" });
    state = reducer(state, { type: "FREEZE_VERSION" });

    expect(state.activeVersion).toBe("V4.0");
    expect(state.versionFrozen).toBe(true);
    expect(state.gates.find((gate) => gate.key === "solution")?.detail).toContain("V4.0");
  });

  it("propagates workshop progress and quality closure into shared state", () => {
    let state = buildInitialState();
    const initialProjectProgress = mainProject(state).progress;
    const initialVehicleProgress = mainVehicle(state).progress;
    const initialOpenIssues = unclosedQualityCount(state);

    state = reducer(state, { type: "REPORT_PROGRESS" });
    state = reducer(state, { type: "VERIFY_QUALITY_ISSUE", id: "QI-2026-0717-11" });

    expect(mainProject(state).progress).toBe(initialProjectProgress + 2);
    expect(mainVehicle(state).progress).toBe(initialVehicleProgress + 8);
    expect(unclosedQualityCount(state)).toBe(initialOpenIssues - 1);
    expect(state.qualityIssues.find((issue) => issue.id === "QI-2026-0717-11")?.status).toBe("closed");
  });

  it("clears the project material gate when the final shortage is received", () => {
    const state = reducer(buildInitialState(), { type: "RECEIVE_MATERIAL", code: "8882001U9000" });

    expect(state.materials.find((item) => item.code === "8882001U9000")?.ready).toBe(6);
    expect(state.gates.find((gate) => gate.key === "material")?.passed).toBe(true);
    expect(mainProject(state).readiness).toBe(100);
    expect(mainProject(state).risk).toBe("正常");
  });

  it("does not create duplicate capped workshop actions", () => {
    let state = buildInitialState();
    state = { ...state, scanCount: 6, checkpointsDone: state.checkpointsTotal };

    expect(reducer(state, { type: "SCAN_PART" })).toBe(state);
    expect(reducer(state, { type: "QC_CHECKPOINT" })).toBe(state);

    const paused = reducer(state, { type: "TOGGLE_PAUSE" });
    expect(reducer(paused, { type: "REPORT_PROGRESS" })).toBe(paused);
  });

  it("normalizes integration latency units across repeated health checks", () => {
    const les = buildInitialState().integrationSystems.find((system) => system.name === "LES");
    expect(les).toBeDefined();

    const first = projectedHealthCheck(les!);
    const second = projectedHealthCheck(first);
    const third = projectedHealthCheck(second);

    expect(first.latency).toBe("900ms");
    expect(second.latency).toBe("450ms");
    expect(third.latency).toBe("225ms");
    expect(third.status).toBe("healthy");
  });
});
