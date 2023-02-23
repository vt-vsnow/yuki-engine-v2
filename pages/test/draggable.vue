<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#3d="{}")
      CoreGroup
        CoreMeshCube(:onDragListener="(amount,_finished,top)=>top&&log('hello'+amount.x+','+amount.y)")
        CoreMeshCube(:onDragListener="(amount,_finished,top)=>top&&log('world'+amount.x+','+amount.y)" v-bind="{dx:1}")
        CoreMeshCube(v-bind="{dz:-1}")
        CoreLightPoint(:strength="30" v-bind="{dx:3,dy:2,dz:2}")
</template>

<script setup lang="ts">

function log(text: string) {
  console.log(text)
}

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
onUnmounted(() => {
  removeDraggables(flow.value!.provides.camera, flow.value!.provides.draggables)
})
const onRenderFlowInjected = (flow: ReturnType<typeof useRenderDataflow>) => {
  // console.log(JSON.stringify(flow.provides.clickables))
  addDraggables(flow.provides.camera, flow.provides.draggables)

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