<template lang="pug">
div Object3D
</template>

<script setup lang="ts">
import { Object3D } from "three";
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
let flow = inject<RenderDataflow<{}, {}>>("flow0", null);
let nestCount = 0;
for (var i = 0; flow; i++) {
  flow = inject<RenderDataflow<{}, {}>>("flow" + i, null);
  flow && (nestCount = i);
}
flow = inject<RenderDataflow<{}, {}>>("flow" + nestCount, null);
// new child flow
const childFlow = flow.newChild({}, {});
// provide child flow
provide("flow" + (nestCount + 1), childFlow);
// get random id
const id = useRandomId();
// add this to callback
childFlow.emit("addCallback", [id, 1]);
onUnmounted(() => {
  // remove this from callback
  childFlow.emit("removeCallback", id);
});

watchEffect(() => {
  if (flow.props.loadings[id] === -1) {
    // on load
    childFlow.emit("updateLoadings", [id, 0]);
  }
});
watchEffect(() => {
  if (flow.props.suspendings[id] === -1) {
    // on suspend
    childFlow.emit("updateSuspendings", [id, 0]);
  }
});
watchEffect(() => {
  if (flow.props.renderRequireds[id]) {
    // on draw
    childFlow.emit("updateRenderRequired", [id, false]);
  }
});
/* end render flow */
const wrapper = new Object3D();
wrapper.add(toRaw(props.object3d));
childFlow.inject("object3d").add(wrapper);
onUnmounted(() => {
  childFlow.inject("object3d").remove(wrapper);
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
