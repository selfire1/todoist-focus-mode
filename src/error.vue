<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template lang="pug">
.container
  header
    nav(aria-label='main')
      ul.hp-nav(role='list')
        li
          .nav-logo
            a(href='/')
              span flowist
              span.accent-dot .

  main.error-container
    div
      h1 Error
      p We are sorry, something went wrong.
    div
      p If you think something is broken, please report it to
        | 
        a(href='https://github.com/selfire1/todoist-focus-mode/issues', target='_blank', rel='noopener noreferrer') the Flowist issue tracker
        | .
    div
      h2 Message
      pre {{ error.message }}
    div
      button.is-button.btn-logout(@click="handleError") Clear error

  footer.lp-footer
    nav(aria-label='external')
      ul.navigation(role='list')
        li.li-home
          a(href='/')
            svg.w-5.h-5(xmlns='http://www.w3.org/2000/svg', viewBox='0 0 20 20', fill='currentColor')
              path(fill-rule='evenodd', d='M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z', clip-rule='evenodd')
            span Home
        li
          a(href='https://github.com/selfire1/todoist-focus-mode/tree/main#documentation', target='_blank', rel='noopener noreferrer')
            svg.w-5.h-5(xmlns='http://www.w3.org/2000/svg', viewBox='0 0 20 20', fill='currentColor')
              path(fill-rule='evenodd', d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.061-1.061 3 3 0 112.871 5.026v.345a.75.75 0 01-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 108.94 6.94zM10 15a1 1 0 100-2 1 1 0 000 2z', clip-rule='evenodd')
            span Help
        li
          a(href='https://github.com/selfire1/todoist-focus-mode', target='_blank', rel='noopener noreferrer')
            svg.w-5.h-5(xmlns='http://www.w3.org/2000/svg', viewBox='0 0 20 20', fill='currentColor')
              path(fill-rule='evenodd', d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z', clip-rule='evenodd')
            span About
    p.heart
      span Created with 
      svg.w-6.h-6(xmlns='http://www.w3.org/2000/svg', fill='none', viewBox='0 0 24 24', stroke-width='1.5', stroke='currentColor')
        path(stroke-linecap='round', stroke-linejoin='round', d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z')
      span by 
      a.j-link(href='https://joschua.io/', target='_blank', rel='noopener noreferrer') Joschua
      span .
    p This application is not created by, affiliated with, or supported by Doist.
</template>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xlarge);
}
</style>
