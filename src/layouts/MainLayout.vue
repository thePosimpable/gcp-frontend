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
          cTracker
        </q-toolbar-title>

        <span class="q-mr-xl q-toolbar__title nowrap">{{ title }}</span>

        <q-space></q-space>

        <div v-if="$q.screen.width > 500">Version {{ version }}</div>
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
        <q-date
          v-model="selectedDateForQDate"
          minimal
          class="fit"
          :first-day-of-week="firstDayMonday === true ? 1 : 0"
          :options="options"
        ></q-date>
      </div>
      <q-separator />

      <q-list class="menu">
        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="calendar_today" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Planner</q-item-label>
            <q-item-label caption>All Entries</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable to="/entries">
          <q-item-section avatar>
            <q-icon name="table_view" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Entries</q-item-label>
            <q-item-label caption>All Entries</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import version from '../../package.json';

export default defineComponent({
  name: 'MainLayout',

  components: {

  },

  data(){
    return{
      version: version.version,
    }
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },

  methods: {
    onPrev () {
      /* eslint-disable-next-line */
      this.$root.$emit('calendar:prev')
    },
    onNext () {
      /* eslint-disable-next-line */
      this.$root.$emit('calendar:next')
    },
  },
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
