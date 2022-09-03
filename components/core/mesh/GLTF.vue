<template lang="pug">
CoreObject3D(v-if="object3d", v-bind="props", :object3d="object3d")
</template>

<script setup lang="ts">
import type { Mesh, Object3D } from "three";
import { useResource } from "~~/composables/core";
import type { RenderDataflow } from "~~/composables/RenderDataflow";

const props = withDefaults(
  defineProps<{
    path: string;
    shadow?: boolean;
    dx?: number;
    dy?: number;
    dz?: number;
    rx?: number;
    ry?: number;
    rz?: number;
    sx?: number;
    sy?: number;
    sz?: number;
  }>(),
  {
    shadow: true,
  }
);
const object3d = ref<Object3D>();
// @ts-ignore
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
    object3d.value = result[0].scene;
    resourceRef = result[1];
    if (props.shadow) {
      object3d.value.traverse((object) => {
        if (object.type === "Mesh") {
          (object as Mesh).castShadow = true;
          (object as Mesh).receiveShadow = true;
        }
      });
    }
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
