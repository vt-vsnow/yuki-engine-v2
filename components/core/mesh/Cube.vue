<template lang="pug">
CoreObject3D(v-bind="{ scene: o.scene }")
</template>
<script setup lang="ts">
import {
  BoxBufferGeometry,
  Material,
  Mesh,
  MeshNormalMaterial,
  Scene,
} from "three";
import type { RenderDataflow } from "~~/composables/RenderDataflow";

const o = useGLObjects() as {
  scene: Scene;
  mesh: Mesh;
  geometry: BoxBufferGeometry;
  material: Material;
};
o.scene = new Scene();
o.material = new MeshNormalMaterial();
o.geometry = new BoxBufferGeometry(1, 1, 1);
o.mesh = new Mesh(o.geometry, o.material);
o.scene.add(o.mesh);
onUnmounted(() => {
  finalizeGLObjects(o);
});
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
</script>
