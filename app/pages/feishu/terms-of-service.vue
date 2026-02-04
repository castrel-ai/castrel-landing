<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const { data: page } = await useAsyncData("feishu-terms", async () => {
  const allDocs = await queryCollection("docs").all();
  const targetPath = "/feishu/terms-of-service";
  const found = allDocs?.find((doc) => doc.path === targetPath);

  // Debug: log available paths if not found
  if (!found && process.dev) {
    console.log("Looking for path:", targetPath);
    console.log(
      "Available feishu paths:",
      allDocs
        ?.filter((doc) => doc.path?.startsWith("/feishu"))
        .map((d) => d.path)
    );
  }

  return found || null;
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found",
  });
}

if (page.value) {
  useSeoMeta({
    title: page.value.title,
    description: page.value.description,
  });
}
</script>

<template>
  <div v-if="page" class="mx-auto max-w-4xl px-6 py-12">
    <div
      class="prose prose-lg prose-neutral dark:prose-invert mx-auto max-w-none"
    >
      <ContentRenderer :value="page" />
    </div>
  </div>
</template>
