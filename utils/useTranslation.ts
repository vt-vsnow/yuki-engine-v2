export default () => {
  const ret = reactive({ src: "", dst: "" });
  let needsUpdate = ref(false);
  let processing = false;
  watch(toRef(ret, "src"), async () => {
    needsUpdate.value = true;
  });
  watch(needsUpdate, async () => {
    if (needsUpdate.value && !processing) {
      processing = true;
      while (needsUpdate.value) {
        needsUpdate.value = false;
        if (ret.src) {
          ret.dst = await translate(ret.src);
        } else {
          ret.dst = "";
        }
      }
      processing = false;
    }
  });
  return ret;
};
