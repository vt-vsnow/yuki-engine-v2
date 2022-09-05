<template lang="pug">
Teleport(:to="flow.provides.element")
  .fullscreen
    slot(name="2d", :flow="flow")
.d-none
  slot(name="3d")
</template>

<script setup lang="ts">
import type { Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const flow = useRenderDataflow({}, {});
provide("flow0", flow);
let running = true;
onUnmounted(() => {
  running = false;
});
const render = () => {
  running && requestAnimationFrame(render);
  flow.props.renderRequired = true;
};
render();
let control;
flow.provides.camera.matrixAutoUpdate = true;
watch(
  toRef(flow.props, "renderRequired"),
  (val) => {
    if (!val) {
      if (!control) {
        const targetElement = document.getElementsByClassName("fullscreen")[0];
        targetElement &&
          //@ts-ignore
          (control = new OrbitControls(flow.provides.camera, targetElement));
      }
      control.update();
      flow.provides.renderer.render(
        toRaw(flow.provides.object3d as Scene),
        flow.provides.camera
      );
    }
  },
  { flush: "sync" }
);
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
