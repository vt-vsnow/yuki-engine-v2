<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#3d="{}")
      CoreGroup
        CoreMeshCube
        CoreLightDirectional(:strength="2" v-bind="{dx:3,dy:2,dz:1}")
</template>

<script setup lang="ts">

const flow = ref<ReturnType<typeof useRenderDataflow>>();

let running = true;
onUnmounted(() => {
  running = false;
});

const unsub = watch(flow, () => {
  if (flow.value) {
    unsub()
    onRenderFlowInjected(flow.value)
  }
});
const onRenderFlowInjected = (flow: ReturnType<typeof useRenderDataflow>) => {
  // console.log(JSON.stringify(flow.provides.clickables))

  const render = () => {
    running && requestAnimationFrame(render)
    flow.props.renderRequired = true;
  }
  render()
  // 毎フレーム実行
  watch(
    toRef(flow.props, "renderRequired"),
    (val) => {
      if (val) {
        // before render
        // console.log("before render")
      } else {
        // after render
        // console.log("render")
        flow.provides.renderer.render(toRaw(flow.provides.object3d),
          flow.provides.camera)
        // console.log("after render")
      }
    }, { flush: "sync" })
}
</script>