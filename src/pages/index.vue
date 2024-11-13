<script setup lang="ts">
import { SECURE_PATH } from "~/constants";

const { loggedIn, user, clear } = useUserSession()

const landingpage = {
  primary: {
    heading: "Focus Mode for Todoist",
    subtitle:
      "Flowist help you focus on what matters. Rather than being overwhelmed by a big list of tasks, gain clarity from working on one task at a time. Free to use.",
  },
  quote: {
    author: "— Cal Newport",
  },
}

const sections = [
  {
    heading: "A more brain-friendly way",
    src: "/imgs/secondary1-img.png",
    alt: "two screens, the one to the left running Flowist with a task called Weekly Reflection",
    content: `<p>Our brains are not made for todo-lists. When we see a list of tasks that is long and diverse, the planning apparatus of our brain locks up. It can’t deal with these 10 or 15 things that have to be done. So it freezes. No motivation is generated, nothing gets done and procrastination kicks in.</p><p>Flowist is a companion for Todoist. It pulls in the tasks and lets you focus. On one task at a time. One thing, right there in front of you. Our brains can handle that. Skip the overwhelm and find flow.</p>`
  },
  {
    heading: "Filters and Sorting",
    src: '/imgs/secondary2-img.png', alt: 'man in a white shirt holding a phone displaying the Flowist actions',
    content: `<p><span>Flowist supports every </span><a href="https://todoist.com/help/articles/introduction-to-filters" target="_blank" rel="noopener noreferrer">Todoist filter</a><span> out of the box. Want to focus only on tasks in your Work project? Only want to hone in on todos tagged @deep? Ready to tackle all those jobs that are overdue or scheduled for today but not in the “Routines” project? Flowist got you.</span></p><p><span>To make sure you get started on your most important task first, Flowist supports sorting. You can sort your todos by priority, due date or project. And of course, Filters and Sorting combines to make sure you tackle your top task first. You can learn more about Filters and Sorting in the </span><a href="https://github.com/selfire1/todoist-focus-mode/tree/main#documentation" target="_blank" rel="noopener noreferrer">documentation on GitHub</a><span>.</span></p>`
  },
  {
    heading: "URL scheme",
    src: '/imgs/secondary3-img.png', alt: 'two screens with one running code and the other showing Todoist focus mode',
    content: `<p>This is for my fellow automation nerds. Flowist’s Filters and Sorting are stored via parameters in the URL. That means you can tailor which tasks are displayed, then copy the URL and jump into this view straight away.</p><p><span>Paste the url to your tasks tagged @deep into the timeblock in your calendar. Put a link into your project notes and start working with one click. Flowist allows you to skip the distraction and jump into your work, straight away. Read more in the </span><a href="https://github.com/selfire1/todoist-focus-mode/tree/main#documentation" target="_blank" rel="noopener noreferrer">documentation</a><span>.</span></p>`
  },
]

const gtm = useGtm() // auto-imported by the module

const isLoginPending = ref(false)
async function enterSecure(ctx: 'login' | 'auth') {
  isLoginPending.value = true
  if (ctx === 'login') {
    trackLoggedin()
  } else {
    trackLoggedinAuth()
  }
}

function trackLoggedin() {
  gtm?.trackEvent({
    event: 'enter',
    category: 'homepage',
    action: 'click',
    label: 'Entering, already authentificated',
  })
}

function trackLoggedinAuth() {
  gtm?.trackEvent({
    event: 'login',
    category: 'homepage',
    action: 'click',
    label: 'Starting oauth flow',
  })
}
</script>

<template lang="pug">
UIContainer
  DebugUser
  TheHeader
  main.is-section-1
    .grid.is-grid-auto.fl-gap-xl.h-full
      .is-section-3.max-w-prose
        .is-section-text-6
          .is-section-text-8
            h1.is-display-4 {{ landingpage.primary.heading }}
            p.is-size-6.is-text-secondary Flowist helps you focus on what matters.
          p.is-size-7.is-text-secondary Rather than being overwhelmed by a big list of tasks, gain clarity from working on one task at a time. Free to use.

        p
          a.is-size-8.is-button.is-primary(type='button' :href="loggedIn ? SECURE_PATH : '/api/auth/todoist'" @click="enterSecure(loggedIn ? 'login' : 'auth')" :data-disabled="isLoginPending")
            template(v-if="isLoginPending")
              span Loading...
              svg.spinner(viewBox='0 0 50 50')
                circle.path(cx='25', cy='25', r='20', fill='none', stroke='currentColor', stroke-width='5')
            template(v-else-if="loggedIn")
              span Enter focus mode
            template(v-else)
              span Login with Todoist

        p.is-size-8.is-text-tertiary This application is not created by, affiliated with, or supported by Doist.

      figure
        NuxtImg.rounded-lg.object-cover.w-full(src='/imgs/lp-primary.png', alt='a phone running flowist in a serene environment')

    .mx-auto.is-size-6(class="max-w-[45ch]")
      figure.is-section-3
        blockquote.is-text-prose.is-section-text-7(cite='https://youtu.be/aOWL59-y82I')
          p
            span “That feeling of task freeze that we see when we have a 
            span.is-text-primary.font-medium long and diverse list
            span  is actually the neuroscientific correlate of our planning apparatus freezing itself.
          p
            span This way of work and organisation … really is
            span.is-text-primary.font-medium  incompatible with our brain
            span ”
        figcaption.is-size-7.font-semibold {{ landingpage.quote.author }}
          cite , 
            a.is-size-8.not-italic.is-text-secondary(href='https://www.youtube.com/watch?v=aOWL59-y82I', target='_blank', rel='noopener noreferrer') To-Do Lists Are Inhumane

    template(v-for="(item, index) in sections" :key="index")
      ImageSection(v-bind="item" :is-odd="index % 2 === 0")
TheFooter
</template>
