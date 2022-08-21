import { beforeEach, describe, expect, it } from "vitest";
import { useRenderDataflow } from "./RenderDataflow";
import { nextTick } from "vue";

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
    await nextTick();
    expect(flow.props.loading).toBe(22);
  });
  it("xxx:20,yyy:12 => suspending is 32", async () => {
    child.emit("updateSuspendings", ["xxx", 20]);
    child.emit("updateSuspendings", ["yyy", 12]);
    await nextTick();
    expect(flow.props.suspending).toBe(32);
  });
  it("xxx:15,yyy:12 => suspending is 27", async () => {
    child.emit("updateCounts", ["xxx", 15]);
    child.emit("updateCounts", ["yyy", 12]);
    await nextTick();
    expect(flow.props.count).toBe(27);
  });
});
