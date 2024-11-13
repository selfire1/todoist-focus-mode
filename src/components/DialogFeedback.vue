<script setup lang="ts">
import { watch } from 'vue';

const dialog = ref()

const showModal = useState('show-modal')

const config = useRuntimeConfig()
const key = config.public.storeFeedbackModalShow as string;

const hasModalShown = ref(true);
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
  const isShown = localStorage.getItem(key)
  if (isShown) {
    return
  }
  hasModalShown.value = false
})

watch(showModal, () => {
  console.log("show modal update")
  if (!showModal.value || hasModalShown.value) {
    console.log("returning early")
    return
  }
  dialog.value?.showModal()
  hasModalShown.value = true
  if (!isMounted.value) {
    return
  }
  localStorage.setItem(key, 'true')
})
</script>

<template lang="pug">
dialog.fl-my-s.shadow-lg.rounded.relative.fl-p-m.z-10.bg-muted-50(ref="dialog")
  div
    button.group.transition-color.flex.items-center.justify-center.rounded.size-8.absolute.top-2.right-2.bg-white.border.border-muted-200(@click="dialog.close()" aria-label="Close dialog" title="Close dialog" class="hover:bg-muted-200 hover:text-white")
      svg.is-text-secondary.size-6(xmlns='http://www.w3.org/2000/svg', fill='none', viewBox='0 0 24 24', stroke-width='1.5', stroke='currentColor' class="group-hover:text-white")
        path(stroke-linecap='round', stroke-linejoin='round', d='M6 18 18 6M6 6l12 12')
    div
      h2.is-display-5 Help us improve!
      p.is-text-secondary We'd love your feedback on Flowist. It's just three quick questions.
    iframe(src='https://docs.google.com/forms/d/e/1FAIpQLSdT1wuvXBn24GBmGMLTHnd88A5IPhYQmSddhJH-8gOn0LC91Q/viewform?embedded=true', width='640', height='845', frameborder='0', marginheight='0', marginwidth='0') Loading…
</template>
