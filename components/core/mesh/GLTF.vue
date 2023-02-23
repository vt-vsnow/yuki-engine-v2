<template lang="pug">
div MeshGLTF
  CoreObject3D(v-if="object3d", v-bind="props", :object3d="object3d")
</template>

<script setup lang="ts">
import { Light, Mesh, Object3D, Vector2 } from "three";
import type { RenderDataflow } from "~~/utils/RenderDataflow";
import type { Intersection } from "three"
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
    onClickListener?: (event: Intersection, top: boolean) => unknown
    onScrollListener?: (event: Intersection, amount: number, top: boolean) => unknown
    onDragListener?: (amount: Vector2, finished: boolean, top: boolean) => unknown
  }>(),
  {
    shadow: true,
  }
);
const object3d = ref<Object3D>();

let resourceRef: { dispose: () => unknown }[] | undefined;
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

watchEffect(async () => {
  if (flow?.props.loadings[id] === -1) {
    // on load
    const result = await useResource(props.path, "gltf");
    object3d.value = result?.[0].scene;
    resourceRef = result?.[1];
    if (props.shadow) {
      object3d?.value?.traverse((object) => {
        if (object.type === "Mesh") {
          (object as Mesh).castShadow = true;
          (object as Mesh).receiveShadow = true;
        } else if (object instanceof Light) {
          (object as Light).castShadow = true;
          // (object as Light).shadow.bias = -0.0005;
          (object as Light).shadow.camera.matrixAutoUpdate = true;
          (object as Light).shadow.mapSize.set(2048, 2048);
        }
      });
    }
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
onUnmounted(() => {
  if (resourceRef) {
    for (const object of resourceRef) {
      object.dispose();
    }
  }
});
</script>
