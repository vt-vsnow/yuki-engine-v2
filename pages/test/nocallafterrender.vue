<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#3d="{}")
      //- CoreGroup
      //- CoreMeshCube(v-bind="{ rx, ry, rz }")
      //- CoreLightHemi(:strength="2")
</template>

<script setup lang="ts">
import type { Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { Clock } from "three";

const flow = ref<ReturnType<typeof useRenderDataflow>>();
const clock = new Clock();
const rx = ref(0);
const ry = ref(0);
const rz = ref(0);
let running = true;
onUnmounted(() => {
  running = false;
});
watch(flow, () => {
  if (flow.value) {
    onRenderFlowInjected(flow.value)
  }
});
const onRenderFlowInjected = (flow: ReturnType<typeof useRenderDataflow>) => {
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

  const render = () => {
    running && requestAnimationFrame(render);
    flow.props.renderRequired = true;
  };
  render();
  let control: OrbitControls;
  flow.provides.camera.matrixAutoUpdate = true;

  // 毎フレーム実行
  watch(
    toRef(flow.props, "renderRequired"),
    (val) => {
      if (val) {
        console.log("before render")
        if (!control) {
          const targetElement = document.getElementsByClassName("fullscreen")[0];
          targetElement &&
            //@ts-ignore
            (control = new OrbitControls(flow.provides.camera, targetElement));
        }
        control.update();

        const time = clock.getElapsedTime();

        rx.value = time * 2;
        ry.value = time * 1.2 * 2;
        rz.value = time * 1.4 * 2;
        composer.render();
      } else {
        console.log("after render")
      }
    },
    { flush: "sync" }
  );
}
</script>
