<template lang="pug">
.is-wrapper
  slot
</template>

<style scoped>
.is-wrapper {
  --padding: var(--fs-xs);
  --max-width: 75rem;
  width: min(var(--max-width), 100% - (var(--padding) * 2));
  @apply mx-auto;
}
</style>
