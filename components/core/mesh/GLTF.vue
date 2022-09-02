<template lang="pug">
CoreObject3D(v-if="scene", v-bind="{ scene }")
</template>

<script setup lang="ts">
import type { Object3D } from "three";
import type { RenderDataflow } from "~~/composables/RenderDataflow";

const props = defineProps<{ path: string }>();
const scene = ref<Object3D>();
let resourceRef;
/* start render flow */
// get flow
let flow: RenderDataflow<{}, {}, {}, {}>;
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

watchEffect(async () => {
  if (flow.props.loadings[id] === -1) {
    // on load
    console.log(props.path);
    const result = await useResource(props.path, "gltf");
    scene.value = result[0].scene;
    resourceRef = result[1];
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
</script>
