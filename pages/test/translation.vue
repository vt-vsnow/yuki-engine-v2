<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#2d="{}")
      div {{ translationSet.src }}
      div {{ translationSet.dst }}
</template>

<script setup lang="ts">
const flow = ref<ReturnType<typeof useRenderDataflow>>();
const translationSet = useTranslation();
// @ts-ignore
const recognition = new (webkitSpeechRecognition || SpeechRecognition)();
recognition.interimResults = true;

recognition.onresult = (event: any) => {
  translationSet.src = event.results[event.results.length - 1][0].transcript;
  console.log(
    event.results[event.results.length - 1].isFinal
      ? "speaking finished"
      : "speaking"
  );
};
recognition.onend = () => {
  console.log("ended");
  recognition.start();
};
recognition.start();
</script>
