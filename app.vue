<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
<script setup lang="ts">
const dataflow = newDataflow({ 1: 2, 3: "4" }, { 5: 6, 7: "8" });
const child = dataflow.add({ 10: 11 }, {});
child.emit(1, 3);

console.log(dataflow);
console.log(child.inject(5));
</script>
