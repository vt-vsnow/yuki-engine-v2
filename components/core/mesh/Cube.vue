<template lang="pug">
div MeshCube
  CoreObject3D(v-bind="props", :object3d="o.mesh")
</template>
<script setup lang="ts">
import { BoxBufferGeometry, Material, Mesh, MeshStandardMaterial, Vector2 } from "three";
import type { Intersection } from "three"
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
const o = useGLObjects() as {
  mesh: Mesh;
  geometry: BoxBufferGeometry;
  material: Material;
};
o.material = new MeshStandardMaterial();
o.geometry = new BoxBufferGeometry(1, 1, 1);
o.mesh = new Mesh(o.geometry, o.material);
onUnmounted(() => {
  finalizeGLObjects(o);
});
o.mesh.receiveShadow = true;
o.mesh.castShadow = true;
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
</script>
