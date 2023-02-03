export default async (text: string) => {
  try {
    return (await $fetch(
      "/api/translation/" + encodeURIComponent(text)
    )) as string;
  } catch (e) {
    console.log("translation wasn't available on hosting service.");
    return null;
  }
};
