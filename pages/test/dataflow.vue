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

flow.props.loading = -1;

child.emit("updateLoadings", ["xxx", 12]);

console.log(flow.props.loading);
</script>
