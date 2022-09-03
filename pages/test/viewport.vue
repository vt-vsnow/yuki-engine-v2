<template lang="pug">
div
  CoreViewport
    template(#2d="{ flow }")
      | {{ flow.props.loading }},{{ flow.props.suspending }}/{{ flow.props.count }}
    template(#3d)
      CoreMeshCube(:path="path")
</template>

<script setup lang="ts">
const path: string = (await import(`/assets/desk.glb?url`)).default;
</script>
