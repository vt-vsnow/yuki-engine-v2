<template lang="pug">
div
  CoreViewport
    template(#2d="{ flow }")
      span(style="color: white") {{ flow.props.loading }},{{ flow.props.suspending }}/{{ flow.props.count }}
    template(#3d="{}")
      CoreMeshGLTF(:path="path")
</template>

<script setup lang="ts">
const path: string = (await import("/assets/部屋.glb?url")).default;
</script>
