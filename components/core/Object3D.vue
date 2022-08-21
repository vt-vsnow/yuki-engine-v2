<template lang="pug"></template>

<script setup lang="ts">
import { BoxBufferGeometry, Mesh, MeshNormalMaterial, Scene } from "three";
import type { RenderDataflow } from "~~/composables/RenderDataflow";
const props = defineProps<{ scene?: Scene }>();
const flow = inject<RenderDataflow<{}, {}, {}, {}>>("flow");
const childFlow = flow.newChild({}, {});
const id = useRandomId();
childFlow.emit("addCallback", [id, 1]);
onUnmounted(() => {
  childFlow.emit("removeCallback", id);
});

watchEffect(() => {
  if (flow.props.loadings[id] === -1) {
    childFlow.emit("updateLoadings", [id, 0]);
  }
});
watchEffect(() => {
  if (flow.props.suspendings[id] === -1) {
    childFlow.emit("updateSuspendings", [id, 0]);
  }
});

const renderer = childFlow.inject("renderer");
const camera = childFlow.inject("camera");
const scene = props.scene || new Scene();
scene.add(new Mesh(new BoxBufferGeometry(1, 1, 1), new MeshNormalMaterial()));
renderer.render(scene, camera);
watchEffect(() => {
  if (flow.props.renderRequireds[id]) {
    scene.rotation.set(Math.random(), Math.random(), Math.random());
    renderer.render(scene, camera);
    childFlow.emit("updateRenderRequired", [id, false]);
  }
});
</script>
