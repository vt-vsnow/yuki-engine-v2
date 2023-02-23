<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#2d="{}")
      template(v-if="isArSupported")
        button(v-if="!isArRunning" @click="startAr") Enable ar
        button(v-else @click="endAr") Disable ar 
      template(v-else) AR is not supported
    template(#3d="{}")
      CoreMeshGLTF(v-bind="{ path:roomModelPath }")
      CoreLightHemi
</template>

<script setup lang="ts">
import type { WebGLRenderer } from 'three';
import roomModelPath from "/assets/部屋.glb?url";


const isArSupported = navigator.xr && await navigator.xr.isSessionSupported('immersive-ar');
let xrSession: XRSession;
let referenceSpace: XRReferenceSpace;
const isArRunning = ref(false)
// function onDrawFrame(timeStamp: number, xrFrame: XRFrame) {
//   console.log(timeStamp)
//   running && xrSession.requestAnimationFrame(onDrawFrame)
//   const pose = xrFrame.getViewerPose(referenceSpace)!;
//   pose.views.forEach((view) => {
//     console.log(view.transform.position)
//   })
// }
let xrWebGLLayer: XRWebGLLayer;
const startAr = async () => {

  xrSession = await navigator.xr!.requestSession('immersive-ar');
  referenceSpace = await xrSession.requestReferenceSpace('local');
  console.log("ar started")
  running = true;
  isArRunning.value = true;
  await renderer.getContext().makeXRCompatible();
  xrWebGLLayer = new XRWebGLLayer(xrSession, renderer.getContext());
  xrSession.updateRenderState({ baseLayer: xrWebGLLayer })
  xrSession.onend = () => {
    isArRunning.value = false;
    console.log("ar ended")
  }
  xrSession.requestAnimationFrame(render);
  // flow.value!.provides.renderer.domElement.requestFullscreen()
}

const endAr = () => {
  xrSession.end()
}

const flow = ref<ReturnType<typeof useRenderDataflow>>();
let running = false;
onUnmounted(() => {
  running = false;
});
const unsub = watch(flow, () => {
  if (flow.value) {
    unsub()
    onRenderFlowInjected(flow.value)
  }
});
let renderer: WebGLRenderer;
let timeStamp: number;
let xrFrame: XRFrame;
let render: (timeStamp: number, xrFrame: XRFrame) => void;
const onRenderFlowInjected = (flow: ReturnType<typeof useRenderDataflow>) => {
  // 初期化処理

  renderer = toRaw(flow.provides.renderer);
  render = (timeStampL: number, xrFrameL: XRFrame) => {
    running && xrSession.requestAnimationFrame(render);
    timeStamp = timeStampL;
    xrFrame = xrFrameL;
    flow.props.renderRequired = true;
  };
  // 毎フレーム実行
  watch(
    toRef(flow.props, "renderRequired"),
    (val) => {
      if (val) {
        // レンダリング直前
        // console.log("before render")
        // console.log(xrFrame)
        const pose = xrFrame.getViewerPose(referenceSpace);
        if (pose) {
          const gl = renderer.getContext()
          gl.bindFramebuffer(gl.FRAMEBUFFER, xrWebGLLayer.framebuffer);

          pose.views.forEach((view) => {
            let viewport = xrWebGLLayer.getViewport(view);
            gl.viewport(viewport!.x, viewport!.y, viewport!.width, viewport!.height);
            const pm = view.projectionMatrix;
            flow.provides.camera.projectionMatrix.fromArray(pm)
            // const tm = view.transform.matrix;
            // flow.provides.camera.matrix.fromArray(tm)
            flow.provides.camera.position.set(view.transform.position.x, view.transform.position.y, view.transform.position.z)
            flow.provides.camera.quaternion.set(view.transform.orientation.x, view.transform.orientation.y, view.transform.orientation.z, view.transform.orientation.w)
            // flow.provides.camera.updateMatrixWorld(true);
            // const viewport = xrWebGLLayer.getViewport(view);
            // renderer.setSize(viewport!.width, viewport!.height);
            renderer.clearColor();
            renderer.render(toRaw(flow.provides.object3d),
              flow.provides.camera)
            // console.log(view.transform.position.x,
            //   view.transform.position.y,
            //   view.transform.position.z,)
          })
        } else {
          renderer.clear(true, true);
          console.log("位置認識不可")
        }
        // console.log(toRaw(flow.provides.camera))
        // renderer.render(toRaw(flow.provides.object3d),
        //   flow.provides.camera)
      } else {
        // レンダリング直後
        // console.log("after render")
      }
    },
    { flush: "sync" }
  );
  // flow.props.renderRequired = true;
}
</script>