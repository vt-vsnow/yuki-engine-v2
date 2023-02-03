<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#2d="{}")
      template(v-if="isArSupported")
        button(v-if="!isArRunning" @click="startAr") Enable ar
        button(v-else @click="endAr") Disable ar 
      template(v-else) AR is not supported
    template(#3d="{}")
      CoreMeshCube
</template>

<script setup lang="ts">
import type { WebGLRenderer } from 'three';


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
            const pm = view.projectionMatrix;
            flow.provides.camera.projectionMatrix.set(pm[0]!, pm[1]!, pm[2]!, pm[3]!,
              pm[4]!, pm[5]!, pm[6]!, pm[7]!,
              pm[8]!, pm[9]!, pm[10]!, pm[11]!,
              pm[12]!, pm[13]!, pm[14]!, pm[15]!)
            const tm = view.transform.matrix;
            flow.provides.camera.matrix.set(tm[0]!, tm[1]!, tm[2]!, tm[3]!,
              tm[4]!, tm[5]!, tm[6]!, tm[7]!,
              tm[8]!, tm[9]!, tm[10]!, tm[11]!,
              tm[12]!, tm[13]!, tm[14]!, tm[15]!)
          })
          renderer.render(toRaw(flow.provides.object3d),
            flow.provides.camera)
        } else {
          console.log("位置認識不可")
        }
      } else {
        // レンダリング直後
        // console.log("after render")
      }
    },
    { flush: "sync" }
  );
}
</script>