<template lang="pug">
div Object3D
</template>

<script setup lang="ts">
import { Object3D, Vector2 } from "three";
import type { Intersection } from "three"
import type { RenderDataflow } from "~~/utils/RenderDataflow";
const props = withDefaults(
  defineProps<{
    object3d: Object3D;
    dx?: number;
    dy?: number;
    dz?: number;
    rx?: number;
    ry?: number;
    rz?: number;
    sx?: number;
    sy?: number;
    sz?: number;
    rotOrder?: string;
    onClickListener?: (event: Intersection, top: boolean) => unknown
    onScrollListener?: (event: Intersection, amount: number, top: boolean) => unknown
    onDrugListener?: (amount: Vector2, finished: boolean, top: boolean) => unknown
  }>(),
  {
    dx: 0,
    dy: 0,
    dz: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    sx: 1,
    sy: 1,
    sz: 1,
    rotOrder: "XYZ",
  }
);
/* start render flow */
// get flow
let flow = inject<RenderDataflow<{}, {}> | null>("flow0", null);
let nestCount = 0;
for (var i = 0; flow; i++) {
  flow = inject<RenderDataflow<{}, {}> | null>("flow" + i, null);
  flow && (nestCount = i);
}
flow = inject<RenderDataflow<{}, {}> | null>("flow" + nestCount, null);
// new child flow
const childFlow = flow?.newChild({}, {});
// provide child flow
provide("flow" + (nestCount + 1), childFlow);
// get random id
const id = useRandomId();
// add this to callback
childFlow?.emit?.("addCallback", [id, 1]);
onUnmounted(() => {
  // remove this from callback
  childFlow?.emit?.("removeCallback", id);
});

watchEffect(() => {
  if (flow?.props.loadings[id] === -1) {
    // on load
    childFlow?.emit?.("updateLoadings", [id, 0]);
  }
});
watchEffect(() => {
  if (flow?.props.suspendings[id] === -1) {
    // on suspend
    childFlow?.emit?.("updateSuspendings", [id, 0]);
  }
});
watchEffect(() => {
  if (flow?.props.renderRequireds[id]) {
    // on draw
    childFlow?.emit?.("updateRenderRequired", [id, false]);
  }
});
/* end render flow */
watch([toRef(props, "onClickListener"), toRef(props, "object3d")], (newVal, oldVal) => {
  const clickables = flow?.inject!("clickables")!
  // console.log(newVal, oldVal)
  if (newVal[0]) {
    clickables.push({ object: newVal[1], callback: newVal[0] })
  }
  const filtered = clickables.filter((object) => !(object.object === oldVal[1] && object.callback === oldVal[0]))
  clickables.length = 0;
  filtered.forEach((val) => {
    clickables.push(val)
  })
}, { immediate: true })
watch([toRef(props, "onScrollListener"), toRef(props, "object3d")], (newVal, oldVal) => {
  const scrollables = flow?.inject!("scrollables")!
  // console.log(newVal, oldVal)
  if (newVal[0]) {
    scrollables.push({ object: newVal[1], callback: newVal[0] })
  }
  const filtered = scrollables.filter((object) => !(object.object === oldVal[1] && object.callback === oldVal[0]))
  scrollables.length = 0;
  filtered.forEach((val) => {
    scrollables.push(val)
  })
}, { immediate: true })
const wrapper = new Object3D();
wrapper.add(toRaw(props.object3d));
childFlow?.inject?.("object3d").add(wrapper);
onUnmounted(() => {
  childFlow?.inject?.("object3d").remove(wrapper);
});
watchEffect(() => {
  wrapper.position.set(props.dx, props.dy, props.dz);
  wrapper.rotation.set(props.rx, props.ry, props.rz, props.rotOrder);
  wrapper.scale.set(props.sx, props.sy, props.sz);
  wrapper.traverse((object) => {
    object.updateMatrix();
  });
  wrapper.updateMatrix();
});
</script>
