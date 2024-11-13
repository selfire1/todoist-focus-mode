<script setup lang="ts">
const props = defineProps<{ icon: string; }>()
</script>

<template lang="pug">
Icon(:name="'heroicons:' + icon")
</template>
