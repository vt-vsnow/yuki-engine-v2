export default async (text: string) => {
  return (await $fetch(
    "/api/translation/" + encodeURIComponent(text)
  )) as string;
};
