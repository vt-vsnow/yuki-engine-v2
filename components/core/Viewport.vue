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
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
defineProps<{ flow: ReturnType<typeof useRenderDataflow> | undefined }>();
const emit = defineEmits<{
  (e: "update:flow", val: ReturnType<typeof useRenderDataflow>): void;
}>();
const flow = useRenderDataflow({}, {});
emit("update:flow", flow);
provide("flow0", flow);
const renderer = toRaw(flow.provides.renderer);
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(
  toRaw(flow.provides.object3d as Scene),
  flow.provides.camera
);
const fxaaPass = new ShaderPass(FXAAShader);
composer.addPass(renderPass);
composer.addPass(fxaaPass);
const pixelRatio = renderer.getPixelRatio();
if (fxaaPass.material.uniforms["resolution"]) {
  fxaaPass.material.uniforms["resolution"].value.x =
    1 / (renderer.domElement.offsetWidth * pixelRatio);
  fxaaPass.material.uniforms["resolution"].value.y =
    1 / (renderer.domElement.offsetHeight * pixelRatio);
}
let running = true;
onUnmounted(() => {
  running = false;
});
const render = () => {
  running && requestAnimationFrame(render);
  flow.props.renderRequired = true;
};
render();
let control: OrbitControls;
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
      composer.render();
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
