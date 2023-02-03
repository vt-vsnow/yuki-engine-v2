<template lang="pug">
Teleport(:to="flow.provides.element")
  .fullscreen
    slot(name="2d", :flow="flow")
.d-none Viewport
  slot(name="3d")
</template>

<script setup lang="ts">
defineProps<{ flow: ReturnType<typeof useRenderDataflow> | undefined }>();
const emit = defineEmits<{
  (e: "update:flow", val: ReturnType<typeof useRenderDataflow>): void;
}>();
const flow = useRenderDataflow({}, {});
emit("update:flow", flow);
provide("flow0", flow);

const windowHeight = ref(window.innerHeight + "px");
const onResize = () => {
  windowHeight.value = window.innerHeight + "px"
}
window.addEventListener("resize", onResize)
onUnmounted(() => {
  window.removeEventListener("resize", onResize)
})
</script>

<style scoped lang="scss">
.fullscreen {
  position: absolute;
  width: 100vw;
  height: v-bind("windowHeight");
}

.d-none {
  display: none;
}
</style>
