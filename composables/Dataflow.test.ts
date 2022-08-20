import { expect, describe, it, beforeEach } from "vitest";
import { Dataflow } from "./Dataflow";
describe("dataflow", () => {
  let flow = new Dataflow({ 1: 2, 3: 4 }, { 5: 6, 7: 8 });
  let child = flow.addChild({ 9: 10, 11: 12 }, { 13: 14, 15: 16 });
  let childChild = child.addChild({}, {});
  beforeEach(() => {
    flow = new Dataflow({ 1: 2, 3: 4 }, { 5: 6, 7: 8 });
    child = flow.addChild({ 9: 10, 11: 12 }, { 13: 14, 15: 16 });
    childChild = child.addChild({}, {});
  });

  it("flow.props.3 is 4", () => {
    expect(flow.props[3]).toBe(4);
  });

  it("flow.provides.5 is 6", () => {
    expect(flow.provides[5]).toBe(6);
  });

  it("childChild.inject.7 is 8", () => {
    expect(childChild.inject(7)).toBe(8);
  });

  it("childChild.emit(9,99) => child.props.9 is 99", () => {
    childChild.emit(9, 99);
    expect(child.props[9]).toBe(99);
  });
});
