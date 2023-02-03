<template lang="pug">
div
  template(v-if="isArSupported")
    button(v-if="!isArRunning" @click="startAr") Enable ar
    button(v-else @click="endAr") Disable ar 
  template(v-else) AR is not supported
</template>

<script setup lang="ts">

const isArSupported = navigator.xr && await navigator.xr.isSessionSupported('immersive-ar');
let xrSession: XRSession;
let referenceSpace: XRReferenceSpace;
let rendering = false;
const isArRunning = ref(false)
function onDrawFrame(timeStamp: number, xrFrame: XRFrame) {
  console.log(timeStamp)
  rendering && xrSession.requestAnimationFrame(onDrawFrame)
  const pose = xrFrame.getViewerPose(referenceSpace)!;
  pose.views.forEach((view) => {
    console.log(view.transform.position)
  })
}
const startAr = async () => {
  xrSession = await navigator.xr!.requestSession('immersive-ar');
  referenceSpace = await xrSession.requestReferenceSpace('local');
  console.log("ar started")
  rendering = true;
  isArRunning.value = true;
  xrSession.updateRenderState()
  xrSession.requestAnimationFrame(onDrawFrame)
}
onUnmounted(() => {
  rendering = false;
})
const endAr = () => {
  xrSession.end().then(() => {
    isArRunning.value = false;
    console.log("ar ended")
  })
}
</script>