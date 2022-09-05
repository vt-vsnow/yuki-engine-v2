<template lang="pug">
div
  CoreViewport
    template(#2d="{ flow }")
      span(style="color: white") {{ flow.props.loading }},{{ flow.props.suspending }}/{{ flow.props.count }}
    template(#3d="{}")
      CoreMeshGLTF(:path="path")
      CoreLightSpot(
        :dy="5",
        :strength="50",
        :color="0xff88ff",
        :penumbra="1",
        :angle="3.1415 / 4"
      )
      CoreLightAmbient
</template>

<script setup lang="ts">
const path: string = (await import("/assets/desk.glb?url")).default;
</script>
