<template lang="pug"></template>

<script setup lang="ts">
import { Object3D, Scene } from "three";
import type { RenderDataflow } from "~~/composables/RenderDataflow";
const props = defineProps<{ scene: Object3D }>();
/* start render flow */
// get flow
let flow: RenderDataflow<{}, {}, {}, {}> = inject<
  RenderDataflow<{}, {}, {}, {}>
>("flow0", null);
let nestCount = 0;
for (var i = 0; flow; i++) {
  flow = inject<RenderDataflow<{}, {}, {}, {}>>("flow" + i, null);
  flow && (nestCount = i);
}
flow = inject<RenderDataflow<{}, {}, {}, {}>>("flow" + nestCount, null);
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
childFlow.inject("object3d").add(props.scene);
onUnmounted(() => {
  childFlow.inject("object3d").remove(props.scene);
});
</script>
