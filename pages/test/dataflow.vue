<template lang="pug">
div {{ flow }}
</template>
<script setup lang="ts">
const flow = useRenderDataflow({}, {});
const child = flow.addChild({}, {});

child.emit("updateLoadings", ["xxx", 10]);
child.emit("updateLoadings", ["yyy", 12]);
await nextTick();
console.log(flow.props.loading);
</script>
