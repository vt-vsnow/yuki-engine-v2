<template lang="pug">
Teleport(:to="flow.provides.element")
  .fullscreen
    slot(name="2d")
.d-none
  slot(name="3d")
</template>

<script setup lang="ts">
const flow = useRenderDataflow({}, {});
provide("flow", flow);
</script>

<style scoped lang="scss">
.fullscreen {
  position: absolute;
  width: 100vw;
  height: 100vh;
}
.d-none {
  display: none;
}
</style>
