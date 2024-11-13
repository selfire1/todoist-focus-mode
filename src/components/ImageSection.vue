<script setup lang="ts">
const props = defineProps<{
  src: string;
  alt: string;
  heading: string;
  content: string;
  isOdd: boolean;
}>()
</script>

<template lang="pug">
.grid.is-grid-auto.fl-gap-xl
  template(v-if="!isOdd")
    div
      NuxtImg.rounded-lg.object-cover.w-full(:src='src', :alt='alt')

  .is-section-text-7.max-w-prose
    h2.is-display-5 {{ heading }}
    .is-prose.is-section-text-6.is-size-7.is-text-prose(v-html="content")

  template(v-if="isOdd")
    div
      NuxtImg.rounded-lg.object-cover.w-full(:src='src', :alt='alt')
</template>
