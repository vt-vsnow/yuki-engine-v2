import { beforeEach, describe, expect, it } from "vitest";
import { useRenderDataflow } from "./RenderDataflow";

describe("render-dataflow", () => {
  let flow = useRenderDataflow({}, {});
  let child = flow.addChild({}, {});
  beforeEach(() => {
    flow = useRenderDataflow({}, {});
    child = flow.addChild({}, {});
  });
  it("xxx:10,yyy:12 => loading is 22", async () => {
    child.emit("updateLoadings", ["xxx", 10]);
    child.emit("updateLoadings", ["yyy", 12]);

    expect(flow.props.loading).toBe(22);
  });
  it("xxx:20,yyy:12 => suspending is 32", async () => {
    child.emit("updateSuspendings", ["xxx", 20]);
    child.emit("updateSuspendings", ["yyy", 12]);

    expect(flow.props.suspending).toBe(32);
  });
  it("xxx:15,yyy:12 => suspending is 27", async () => {
    child.emit("updateCounts", ["xxx", 15]);
    child.emit("updateCounts", ["yyy", 12]);

    expect(flow.props.count).toBe(27);
  });
  describe("-1 fetching", () => {
    beforeEach(() => {
      child.emit("updateCounts", ["xxx", 25]);
      child.emit("updateCounts", ["yyy", 12]);
      child.emit("updateSuspendings", ["xxx", 20]);
      child.emit("updateSuspendings", ["yyy", 12]);
      child.emit("updateLoadings", ["xxx", 10]);
      child.emit("updateLoadings", ["yyy", 12]);
    });
    it("loading", async () => {
      flow.props.loading = -1;

      expect(flow.props.loading).toBe(37);
      child.emit("updateLoadings", ["xxx", 12]);

      expect(flow.props.loading).toBe(24);
    });
    it("suspending", async () => {
      flow.props.suspending = -1;

      expect(flow.props.suspending).toBe(37);
      child.emit("updateSuspendings", ["xxx", 12]);

      expect(flow.props.suspending).toBe(24);
    });
    it("count => loading", async () => {
      flow.props.loading = -1;
      expect(flow.props.loading).toBe(37);
      child.emit("updateCounts", ["xxx", 35]);
      expect(flow.props.loading).toBe(47);
    });
    it("count => suspending", async () => {
      flow.props.suspending = -1;
      expect(flow.props.suspending).toBe(37);
      child.emit("updateCounts", ["xxx", 27]);
      expect(flow.props.suspending).toBe(39);
    });
  });
  it("provide", () => {
    expect(flow.provides.camera).toBeDefined();
    expect(child.inject("camera")).toBeDefined();
  });
});
