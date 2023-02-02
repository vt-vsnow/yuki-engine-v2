<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#3d="{}")
      CoreGroup
        CoreMeshGLTF(v-bind="{ path }")
        CoreMeshCube(v-bind="{ dx: -6, dy: 1, dz: 1, rx, ry, rz }")
</template>

<script setup lang="ts">
import { Clock } from "three";
import roomModelPath from "/assets/部屋.glb?url";

const path = roomModelPath;
const flow = ref<ReturnType<typeof useRenderDataflow>>();
const clock = new Clock();
const rx = ref(0);
const ry = ref(0);
const rz = ref(0);
watch(flow, () => {
  if (flow.value) {
    watch(
      toRef(flow.value.props, "renderRequired"),
      (val) => {
        if (val) {
          const time = clock.getElapsedTime();

          rx.value = time * 2;
          ry.value = time * 1.2 * 2;
          rz.value = time * 1.4 * 2;
        }
      },
      { flush: "sync" }
    );
  }
});
</script>
