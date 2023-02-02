<template lang="pug">
div LightHemi
  CoreObject3D(v-bind="props", :object3d="light")
</template>
<script setup lang="ts">

import { HemisphereLight } from "three";
import type { RenderDataflow } from "~~/utils/RenderDataflow";
const props = withDefaults(
  defineProps<{
    dx?: number;
    dy?: number;
    dz?: number;
    rx?: number;
    ry?: number;
    rz?: number;
    sx?: number;
    sy?: number;
    sz?: number;
    strength?: number;
    sky?: number;
    ground?: number;
  }>(),
  { strength: 1, sky: 0xffffff, ground: 0x000000 }
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
const light = new HemisphereLight();
watchEffect(() => {
  light.color.set(props.sky);
  light.groundColor.set(props.ground);
  light.intensity = props.strength;
});
</script>
