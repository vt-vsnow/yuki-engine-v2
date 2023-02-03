<template lang="pug">
div
  div alpha: {{ alpha }}
  div beta: {{ beta }}
  div gamma: {{ gamma }}
  div absolute: {{ absolute }}
  hr
  div ax: {{ ax }}
  div ay: {{ ay }}
  div az: {{ az }}
  div interval: {{ interval }}
  div dalpha: {{ dalpha }}
  div dbeta: {{ dbeta }}
  div dgamma: {{ dgamma }}
  div dx: {{ dx }}
  div dy: {{ dy }}
  div dz: {{ dz }}
  div x: {{ x }}
  div y: {{ y }}
  div z: {{ z }}
</template>

<script setup lang="ts">
// 回転取得
const alpha = ref(0)
const beta = ref(0)
const gamma = ref(0)
const absolute = ref(false)
function onOrientation(event: DeviceOrientationEvent) {
  alpha.value = event.alpha || 0
  beta.value = event.beta || 0
  gamma.value = event.gamma || 0;
  absolute.value = event.absolute;
  console.log(event.alpha, event.beta, event.gamma, event.absolute)
}

window.addEventListener("deviceorientation", onOrientation, true)
onUnmounted(() => {
  window.removeEventListener("deviceorientation", onOrientation, true)
})

// 動き取得
const ax = ref(0)
const ay = ref(0)
const az = ref(0)
const interval = ref(0)
const dalpha = ref(0)
const dbeta = ref(0)
const dgamma = ref(0)
const dx = ref(0)
const dy = ref(0)
const dz = ref(0)
const x = ref(0)
const y = ref(0)
const z = ref(0)
function onMotion(event: DeviceMotionEvent) {
  const lax = ax.value = event.acceleration?.x || 0;
  const lay = ay.value = event.acceleration?.y || 0;
  const laz = az.value = event.acceleration?.z || 0;
  const lInterval = interval.value = event.interval;
  const fac = lInterval / 1000;
  dalpha.value = event.rotationRate?.alpha || 0;
  dbeta.value = event.rotationRate?.beta || 0;
  dgamma.value = event.rotationRate?.gamma || 0;
  dx.value += lax * fac;
  dy.value += lay * fac;
  dz.value += laz * fac;
  x.value += dx.value * fac;
  y.value += dy.value * fac;
  z.value += dz.value * fac;
}
window.addEventListener("devicemotion", onMotion, true)
onUnmounted(() => {
  window.removeEventListener("devicemotion", onMotion, true)
})
</script>