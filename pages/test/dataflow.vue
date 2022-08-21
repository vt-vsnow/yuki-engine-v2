<template lang="pug">
div {{ flow }}
</template>
<script setup lang="ts">
const flow = useRenderDataflow({}, {});
const child = flow.newChild({}, {});

child.emit("updateCounts", ["xxx", 25]);
child.emit("updateCounts", ["yyy", 12]);
child.emit("updateSuspendings", ["xxx", 0]);
child.emit("updateSuspendings", ["yyy", 0]);
child.emit("updateLoadings", ["xxx", 0]);
child.emit("updateLoadings", ["yyy", 0]);
child.emit("updateRenderRequired", ["xxx", false]);
child.emit("updateRenderRequired", ["yyy", false]);

flow.props.loading = -1;
flow.props.renderRequired = true;

child.emit("updateLoadings", ["xxx", 12]);
child.emit("updateRenderRequired", ["xxx", false]);
child.emit("updateRenderRequired", ["yyy", false]);
console.log(flow.props.loading);
</script>
