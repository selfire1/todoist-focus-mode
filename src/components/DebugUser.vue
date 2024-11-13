<script setup lang="ts">
const props = defineProps<{ show?: boolean }>()
const { loggedIn, user, session, clear } = useUserSession()
</script>

<template lang="pug">
DevOnly
  aside(v-if="show")
    pre {{ {user, loggedIn} }}
</template>
