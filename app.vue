<template>
  <div>
    <NuxtWelcome />
  </div>
</template>
<script setup lang="ts">
const dataflow = newDataflow({ 1: 2, 3: "4" }, { 5: 6, 7: "8" });

const child = dataflow.add({ 10: 11 }, {});
const child2 = child.add({}, {});
child.emit(3, "hello");
console.log(dataflow);
console.log(child2.inject(7));
</script>
