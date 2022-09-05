<template lang="pug">
div
  Viewport(v-model:flow="flow")
    template(#3d="{}")
      Group
        GLTF(v-bind="{ path }")
        Cube(v-bind="{ dx: -6, dy: 1, dz: 1, rx, ry, rz }")
</template>

<script setup lang="ts">
import Viewport from "@/components/core/Viewport.vue";
import Group from "@/components/core/Group.vue";
import GLTF from "@/components/core/mesh/GLTF.vue";
import Cube from "@/components/core/mesh/Cube.vue";
import { Clock } from "three";

const path: string = (await import("/assets/部屋.glb?url")).default;
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
