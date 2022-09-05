<template lang="pug">
div
  CoreViewport
    template(#3d="{}")
      CoreGroup
        CoreMeshGLTF(v-bind="{ path }")
        CoreMeshCube(v-bind="{ dx: -6, dy: 1, dz: 1 }")
</template>

<script setup lang="ts">
const path: string = (await import("/assets/部屋.glb?url")).default;
</script>
