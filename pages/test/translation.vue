<template lang="pug">
div
  CoreViewport(v-model:flow="flow")
    template(#2d="{}")
      textarea(v-model="translationSet.src" style="width:90%;height:10rem")
      div {{ translationSet.dst }}
</template>

<script setup lang="ts">
const flow = ref<ReturnType<typeof useRenderDataflow>>();
const translationSet = useTranslation()
translationSet.src = "翻訳する文章を入力"
</script>