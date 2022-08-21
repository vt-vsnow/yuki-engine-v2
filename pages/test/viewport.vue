<template lang="pug">
div
  CoreViewport
    template(#2d="{ flow }")
      | {{ flow.props.loading }},{{ flow.props.suspending }}/{{ flow.props.count }}
    template(#3d)
      CoreObject3D
</template>

<script setup lang="ts"></script>
