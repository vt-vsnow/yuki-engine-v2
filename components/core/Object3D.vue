<template lang="pug"></template>

<script setup lang="ts">
import type { RenderDataflow } from "~~/composables/RenderDataflow";
const flow = inject<RenderDataflow<{}, {}, {}, {}>>("flow");
const childFlow = flow.newChild({}, {});
const id = useRandomId();
childFlow.emit("updateCounts", [id, 1]);
childFlow.emit("updateLoadings", [id, 0]);
childFlow.emit("updateSuspendings", [id, 0]);
watchEffect(() => {
  if (flow.props.loadings[id] === -1) {
    childFlow.emit("updateLoadings", [id, 0]);
  }
});
watchEffect(() => {
  if (flow.props.suspendings[id] === -1) {
    childFlow.emit("updateSuspendings", [id, 0]);
  }
});
</script>
