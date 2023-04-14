<template>
  <q-layout view="HHh LpR lFf">

    <q-header elevated>
      <q-resize-observer @resize="onTitlebarResized"></q-resize-observer>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu"></q-icon>
        </q-btn>

        <q-icon name="far fa-calendar-alt" class="q-ml-md" size="1.5rem"></q-icon>

        <q-toolbar-title>
          QCalendar <span class="text-subtitle2">v{{ version }}</span>
        </q-toolbar-title>

        <q-btn flat dense label="Today" class="q-mx-md" @click="setToday"></q-btn>
        <q-btn flat dense round icon="keyboard_arrow_left" @click="onPrev"></q-btn>
        <q-btn flat dense round icon="keyboard_arrow_right" @click="onNext"></q-btn>
        <span class="q-mr-xl q-toolbar__title nowrap">{{ title }}</span>
        <q-select
          v-model="calendarView"
          :options="viewOptions"
          outlined
          dark
          :options-dark="$q.dark.isActive"
          dense
          options-dense
          emit-value
          map-options
          :input-class="contentClass"
          :popup-content-class="contentClass"
          style="min-width: 120px; background: transparent; color: white"
        ></q-select>

        <q-space></q-space>

        <q-btn flat round @click="$q.dark.toggle()" :icon="$q.dark.isActive ? 'brightness_2' : 'brightness_5'" />
        <div v-if="$q.screen.width > 500">Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      aria-label="Menu"
      class="menu"
      :width="350"
    >
      <div class="row justify-around col-12">
        <!-- <q-date
          v-model="selectedDateForQDate"
          minimal
          class="fit"
          :first-day-of-week="firstDayMonday === true ? 1 : 0"
          :options="options"
        ></q-date> -->
      </div>
      <q-separator />
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>


<style>
.q-date {
    box-shadow: none!important;
    border-radius: 0!important;
}
.q-date__view {
    padding: 0!important;
}
.q-date--portrait-minimal {
    width: auto!important;
}
</style>
