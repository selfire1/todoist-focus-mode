<script setup lang="ts">
import markdownIt from "markdown-it";
import type { Task, Project } from "~/types"

const { loggedIn, user, session, clear } = useUserSession()


//
const gtm = useGtm() // auto-imported by the module

if (!loggedIn.value) {
  // TODO: GTM track exception
  await navigateTo({ path: "/", query: { reason: 'not-authorised' } })
}

async function logoutHandler() {
  clear();
  await navigateTo({ path: "/", query: { reason: 'logged-out' } })
  gtm?.trackEvent({
    event: 'logout',
    category: 'secure',
    action: 'click',
    label: 'Logged out in `secure`.',
  })

}

const token = user.value?.access_token;
const isMounted = ref(false);
const index = ref(0);
const route = useRoute();
const filterInput = ref(route.query?.filter as string || '');
const sortQuery = ref(route.query?.sort as string || '');

const currentTaskText = computed(() => {
  if (taskPending.value) {
    return '';
  }
  const i = index.value;
  const activeTask = tasks.value?.[i]

  if (!activeTask?.content || !tasks.value?.length) {
    return '';
  }
  return mdToHtmlElement(activeTask.content ?? "");
});

const currentTaskDescription = computed(() => {
  if (taskPending.value) {
    return '';
  }
  const i = index.value;
  const activeTask = tasks.value?.[i]

  if (!activeTask?.description || !tasks.value?.length) {
    return '';
  }
  return mdToHtmlElement(activeTask.description ?? "");
});


const currentProjectName = computed(() => {
  const i = index.value;
  if (!tasks.value?.[i]) {
    return '';
  }
  const project = findProject(tasks.value[i].project_id, projects.value ?? []);
  return project?.name ?? "";
});

const filterHandler = () => {
  mergeRouterQuery({ filter: filterInput.value });
  fetchFilter.value = filterInput.value
  gtm?.trackEvent({
    event: 'filter_submitted',
    category: 'secure',
    action: 'form',
    label: 'filter submitted through input'
  })

}

function mergeRouterQuery(newQuery: any) {
  const existingQuery = useRoute().query
  useRouter().push({ query: { ...existingQuery, ...newQuery } })
}


useSeoMeta({
  title: 'Flowist. — App'
})

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
}

const fetchFilter = ref(route.query?.filter as string || '');

const { data: fetchedTasks, pending: taskPending } = useFetch<Task[]>("https://api.todoist.com/rest/v2/tasks", {
  method: 'get',
  headers,
  query: {
    filter: fetchFilter,
  },
})

const { customSort } = useTasks();
const tasks = computed(() => {
  if (!sortQuery.value) {
    return fetchedTasks.value;
  }
  return customSort(fetchedTasks.value, sortQuery.value);
});

const { data: projects } = useFetch<Project[]>("https://api.todoist.com/rest/v2/projects", {
  method: 'get',
  headers
})

onMounted(async () => {
  isMounted.value = true;
  document.onkeydown = function keyMove(e) {
    if (isUltraFocus.value) {
      return
    }
    switch (e.keyCode) {
      case 229:
        break;
      case 37:
        // Left -> Previous
        if (index.value <= 0) {
          break;
        }
        btnCounter(tasks?.value ?? [], false);
        btnPrev.value?.classList.add('hover');
        setTimeout(() => { btnPrev.value?.classList.remove('hover'); }, 100);
        break;
      case 39:
        // Right -> Next
        if (index.value >= (tasks.value?.length ?? 0) - 1) {
          break;
        }
        btnCounter(tasks.value ?? []);
        btnNext.value?.classList.add('hover');
        setTimeout(() => { btnNext.value?.classList.remove('hover'); }, 100);
        break;
      default:
        break;
    }
  };

  // Create a reference for the Wake Lock.
  // create an async function to request a wake lock
  try {
    await navigator.wakeLock.request("screen");
  } catch (err) {
    // The Wake Lock request has failed - usually system related, such as battery.
    console.warn("Failed to get wake lock", err);
  }
});
const pendingDone = ref(false)

// Closing a task
async function taskDone(taskId: string) {
  pendingDone.value = true;
  if (!taskId) {
    console.warn('No task id');
    gtm?.trackEvent({
      event: 'exception',
      category: 'secure',
      label: 'No task id',
    })

    pendingDone.value = false;
    return;
  }
  const url = `https://api.todoist.com/rest/v2/tasks/${taskId}/close`;
  const response = await fetch(url, {
    method: 'POST',
    headers,
  });
  if (response.ok) {
    notify('☑ Marked task as done');
    tasks.value?.splice(index.value, 1);
    index.value = Math.max(0, index.value - 1);
    gtm?.trackEvent({
      event: 'task_done',
      category: 'secure',
      action: 'click',
      label: 'Task marked done',
    })
    if (isMounted.value) {
      console.log("is mounted")
      const config = useRuntimeConfig()
      const modalShownKey = config.public.storeFeedbackModalShow as string;
      const hasBeenShown = localStorage.getItem(modalShownKey)
      console.log("hasBeenShown", hasBeenShown)
      if (hasBeenShown) {
        console.log("dialog has shown, aborting")
        pendingDone.value = false;
        return
      }
      const key = config.public.storeCountKey as string;
      const count = localStorage.getItem(key)
      const countToWrite = count ? (parseInt(count) + 1) : 1
      localStorage.setItem(key, countToWrite.toString())
      const showModal = useState('show-modal')
      if (countToWrite >= 3) {
        console.log("count is bigger than three, showing modal")
        showModal.value = true;
      }
    }

  } else {
    alert(`HTTP-Error: ${response.status}`);
    gtm?.trackEvent({
      event: 'exception',
      category: 'secure',
      // action: 'click',
      label: 'HTTP-Error: ' + response.status,
      value: JSON.stringify(response)
    })

  }
  pendingDone.value = false;
}
const btnPrev = ref<HTMLButtonElement>()
const btnNext = ref<HTMLButtonElement>()

const hasPrevious = computed(() => {
  return index.value > 0
});

const hasNext = computed(() => {
  return index.value < (tasks.value?.length ?? 0) - 1
})
// Button Counter
function btnCounter(tasks: Task[], increase = true) {
  if (!tasks.length) {
    console.warn('No tasks');
    gtm?.trackEvent({
      event: 'exception',
      category: 'secure',
      label: 'No tasks',
    })
    return;
  }
  if (increase) {
    index.value += 1;
  } else {
    index.value -= 1;
  }
  if (index.value <= 0 && btnPrev.value) {
    btnPrev.value.disabled = true;
  } else if (btnPrev.value) {
    btnPrev.value.disabled = false;
  }
  if (index.value >= tasks.length - 1 && btnNext.value) {
    btnNext.value.disabled = true;
  } else if (btnNext.value) {
    btnNext.value.disabled = false;
  }
}
// Action buttons

function copyUrlHandler() {
  if (!isMounted) {
    console.warn('Not mounted yet');
    gtm?.trackEvent({
      event: 'exception',
      category: 'secure',
      label: 'Not mounted yet',
    })
    console.trace()
    return;
  }

  const url = document.location.href;
  navigator.clipboard.writeText(url).then(() => {
    notify('📋 Copied link to clipboard');
  }, () => {
    notify('⚠️ Error! Please copy manually');
  });
}

function openTodoistHandler() {
  if (!isMounted) {
    console.warn('Not mounted yet');
    gtm?.trackEvent({
      event: 'exception',
      category: 'secure',
      label: 'Not mounted yet in open todoist',
    })

    console.trace()
    return;
  }

  const isMobile = ('ontouchstart' in document.documentElement && navigator.userAgent.match(/Mobi/));
  const current = tasks.value?.[index.value];
  if (!current) {
    console.warn('No current task');
    gtm?.trackEvent({
      event: 'exception',
      category: 'secure',
      label: 'No current task',
    })
    return;
  }
  if (isMobile) {
    // On mobile, open into the app
    const url = `todoist://task?id=${current.id}`;
    window.open(url, 'todoist tab');
  } else {
    window.open(current.url, 'todoist tab');
  }
};
function notify(str: string) {
  if (!isMounted) {
    console.warn('Not mounted yet');
    console.trace()
    return;
  }

  const notifyBanner = document.getElementById('notify');
  if (!notifyBanner) {
    console.warn('No notify banner');
    return;
  }
  notifyBanner.innerText = str;
  unfade(notifyBanner);
  setTimeout(() => {
    fade(notifyBanner);
  }, 3000);
}

// Fade out element
function fade(element: HTMLElement) {
  let op = 1; // initial opacity
  const timer = setInterval(() => {
    const el = element;
    if (op <= 0.1) {
      clearInterval(timer);
      el.style.display = 'none';
    }
    el.style.opacity = op.toString();
    el.style.filter = `alpha(opacity=${op * 100})`;
    op -= op * 0.1;
  }, 50);
}
// Fade in element
function unfade(element: HTMLElement) {
  let op = 0.1; // initial opacity
  const el = element;
  el.style.display = 'block';
  const timer = setInterval(() => {
    if (op >= 1) {
      clearInterval(timer);
    }
    el.style.opacity = op.toString();
    el.style.filter = `alpha(opacity=${op * 100})`;
    op += op * 0.15;
  }, 10);
}
// Parse Todoist's Markdown
function mdToHtmlElement(str: string) {
  const md = markdownIt({
    typographer: true,
  });
  const result = md.render(str);
  return result;
}

function findProject(tasksProjectID: string, projects: Project[]) {
  return projects.find(el => el.id === tasksProjectID)
}

/*!
 * Sanitize and encode all HTML in a user-submitted string
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
function sanitizeHTML(str: string): string {
  if (!isMounted) {
    console.warn('Not mounted yet');
    console.trace()
    return "";
  }

  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}


const isOptionsOpen = ref(false)

function openSettingsHandler() {
  isOptionsOpen.value = true
}

function closeSettingsHandler() {
  isOptionsOpen.value = false
}

const selectedAlignment = ref('Left')
const alignments = ['Left', 'Center', 'Right']

onMounted(() => {
  selectedAlignment.value = localStorage.getItem('textAlignment') || 'Left'
  isUltraFocus.value = localStorage.getItem('ultraFocus') === 'true'
})

function trySetLocalStorage(key: string, value: string) {
  if (!isMounted.value) {
    console.warn("Not mounted yet")
    return
  }
  localStorage.setItem(key, value)
}
watch(selectedAlignment, () => {
  trySetLocalStorage('textAlignment', selectedAlignment.value)
})

const alignmentClass = computed(() => {
  switch (selectedAlignment.value) {
    case 'Left':
      return 'text-left';
    case 'Center':
      return 'text-center mx-auto';
    case 'Right':
      return 'text-right ml-auto';
    default:
      return 'text-left';
  }
});

const isUltraFocus = ref(false)

watch(isUltraFocus, () => {
  trySetLocalStorage('ultraFocus', isUltraFocus.value.toString())
})

</script>

<template lang="pug">
div(:class="isUltraFocus ? 'is-ultrafocus' : ''")
  .duration-200.transition-all.fixed.inset-0(class="bg-black/75" :class="isOptionsOpen ? 'z-10 opacity-100' : 'z-[-1] opacity-0'")
  .z-20.duration-300.transition-transform.bg-white.fixed.top-0.left-0.right-0(:class="isOptionsOpen ? 'translate-y-0' : '-translate-y-full'" class="dark:bg-neutral-800")
    UIContainer.fl-py-xs
      .flex.items-start.justify-between.fl-gap-xs
        div
          h2.is-display-6 Settings
          p.is-text-secondary.is-size-7 Preferences are stored locally in your browser.
        button.is-text-secondary.flex.items-center.gap-1.is-button(@click='closeSettingsHandler' class="hover:bg-muted-100 hover:text-primary hover:dark:bg-neutral-700 hover:dark:text-neutral-100" title="Close")
          span.sr-only Close
          HeroIcon.size-5(icon="x-mark-16-solid")
      .fl-space-y-xs.fl-py-s
        .fl-space-y-3xs
          div
            h2.is-display-8#opt-align Text alignment
            p.is-text-secondary.is-size-8 Choose the alignment for the task text.
          PSelectButton(v-model="selectedAlignment" :options="alignments" class="w-full md:w-56" aria-labelledby="opt-align")
        .fl-space-y-3xs
          div
            h2.is-display-8#opt-align Ultrafocus mode
            p.is-text-secondary.is-size-8 Hide everything except the active task and the done button.
          .flex.gap-2
            PToggleSwitch(v-model="isUltraFocus")
            p.is-display-8 {{ isUltraFocus ? 'Enabled' : 'Disabled' }}

  UIContainer
    DialogFeedback
    DebugUser
    #notify.notify
    .min-h-screen.fl-py-xs.flex.flex-col
      .flex.items-center.justify-between.fl-gap-xs.is-text-secondary
        .no-ultra.fl-gap-2xs.flex.items-center.is-size-8(v-show="!taskPending && currentTaskText")
          .flex.items-center.gap-1
            HeroIcon.w-5.h-5(icon="inbox-16-solid")
            p {{ currentProjectName || 'No project' }}
          template(v-if="currentTaskText")
            button.flex.items-center.gap-1.is-button(@click='openTodoistHandler' class="hover:bg-muted-100 hover:text-primary")
              SvgSquareArrow
              span Open in Todoist
        button.ml-auto.flex.items-center.gap-1.is-button(@click='openSettingsHandler' class="hover:bg-muted-100 hover:text-primary hover:dark:bg-neutral-700 hover:dark:text-neutral-100" title="Open Options" :class="isUltraFocus ? 'opacity-50' : ''")
          span.sr-only Options
          HeroIcon.size-5(icon="cog-16-solid")

      .fl-py-s.fl-space-y-3xs
        .is-display-1.text-pretty
          p(v-show="!taskPending && !currentTaskText") No tasks in this filter at the moment.
          p(v-show="taskPending") Loading...
          .is-prose(v-show="currentTaskText", v-html="currentTaskText" :class="alignmentClass")
        .max-w-prose.is-text-secondary.is-size-6.is-prose(v-if="currentTaskDescription" :class="alignmentClass")
          div(v-html="currentTaskDescription")

      .flex.fl-gap-2xs.mt-auto.fl-mb-3xs
        button.no-ultra.flex-col.is-button.is-muted(ref='btnPrev', :disabled="taskPending || !hasPrevious" @click="index = Math.max(0, index - 1)")
          SvgCaretLeft.size-8
          span.is-size-8 Back

        button.fl-py-xs.w-full.is-button.is-primary(@click="taskDone(tasks?.[index].id)" :disabled="pendingDone")
          SvgCircleCheck.size-8
          span.is-size-6 {{ pendingDone ? 'Loading...' : 'Done' }}
        button.no-ultra.flex-col.is-button.is-muted(ref='btnNext', :disabled="taskPending || !hasNext" @click="index = Math.min(tasks.length, index + 1)")
          SvgCaretRight.size-8
          span.is-size-8 Next

  .bg-muted-50.is-text-secondary.rounded-t.is-text-7.no-ultra(class="dark:bg-neutral-900")
    div
      LazyUIContainer.fl-my-l.fl-py-l
        aside
          .fl-space-y-m
            h2.is-display-8.is-uppercase.text-center Actions

            .grid.grid-cols-2.fl-gap-m
              .is-section-text-6
                form.is-section-text-7(@submit.prevent='filterHandler')
                  div
                    label.space-y-1(for='filter')
                      .flex.items-center.gap-1
                        SvgFilter
                        h3.is-display-7 Filter
                    p Enter a filter to display matching tasks. 
                  .flex.items-center.fl-gap-3xs
                    input.border.border-muted-200.w-full.block.h-10.rounded.py-1.px-2#filter(minlength='2', type='text', name='filter' v-model="filterInput" placeholder="No filter")
                    button.bg-muted-200.text-white.is-button(type='submit' :disabled="taskPending" class="hover:bg-muted-300 dark:text-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-800") {{ taskPending ? 'Loading...' : 'Open'}}
                p
                  NuxtLink.underline.is-text-8.is-text-tertiary(href='https://todoist.com/help/articles/introduction-to-filters' class="hover:is-text-secondary") About Todoist filters

              .is-section-text-7
                div
                  .flex.items-center.gap-1
                    svg.w-5.h-5(xmlns='http://www.w3.org/2000/svg', viewBox='0 0 20 20', fill='currentColor')
                      path(fill-rule='evenodd', d='M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z', clip-rule='evenodd')
                    h3.is-display-7 Sort
                  p Sort tasks with URL parameters.

                p
                  NuxtLink.underline.is-text-8.is-text-tertiary(href='https://github.com/selfire1/todoist-focus-mode/tree/main#sorting', target='_blank', rel='noopener noreferrer' class="hover:is-text-secondary") Learn more

            .flex.fl-gap-3xs
              button.gap-1.bg-muted-200.text-white.is-button(class="hover:bg-muted-300 dark:text-neutral-300 dark:bg-neutral-700 hover:dark:bg-neutral-800" @click='copyUrlHandler')
                svg.w-5.h-5(xmlns='http://www.w3.org/2000/svg', viewBox='0 0 20 20', fill='currentColor')
                  path(d='M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z')
                  path(d='M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z')
                span Copy link to this view
              .ml-auto
                button.border.border-muted-200.is-text-secondary.is-button(class="hover:bg-muted-300 hover:text-white" @click="logoutHandler") Logout


    footer
      TheFooter
</template>

<style>
.is-ultrafocus .no-ultra {
  @apply hidden;
}

/* .p-drawer-top .p-drawer { */
/*   height: auto; */
/* } */
</style>
