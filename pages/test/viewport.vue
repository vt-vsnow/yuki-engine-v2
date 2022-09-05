<template lang="pug">
div
  Viewport
    template(#3d="{}")
      Group
        GLTF(v-bind="{ path }")
        Cube(v-bind="{ dx: -6, dy: 1, dz: 1 }")
</template>

<script setup lang="ts">
import Viewport from "@/components/core/Viewport.vue";
import Group from "@/components/core/Group.vue";
import GLTF from "@/components/core/mesh/GLTF.vue";
import Cube from "@/components/core/mesh/Cube.vue";

const path: string = (await import("/assets/部屋.glb?url")).default;
</script>
