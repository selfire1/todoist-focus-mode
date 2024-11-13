<script setup lang="ts">
callOnce(() => {
  useState('show-modal', () => false)
})
</script>

<template lang="pug">
NuxtLayout
  NuxtPage
</template>
