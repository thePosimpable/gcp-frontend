<template>
  <div class="subcontent">
    <q-dialog v-model="addEvent" no-backdrop-dismiss>
      <div>
        <q-form
          ref='event'
          @submit="onSubmit"
          @reset="onReset"
        >
          <q-card v-if="addEvent" style="width: 400px;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>
                {{ addOrUpdateEvent }} Event
              </q-toolbar-title>
              <q-btn flat round color="white" icon="add" v-close-popup></q-btn>
            </q-toolbar>
            <q-card-section class="inset-shadow">
              <q-input
                v-model="eventForm.title"
                label="Title"
                :rules="[v => v && v.length > 0 || 'Field cannot be empty']"
                autofocus
              />
              <q-input
                v-model="eventForm.details"
                label="Details"
              />

              <q-input v-model="eventForm.startDate" mask="date" label="Start Date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="eventForm.startDate">
                        <div class="row items-center justify-end">
                          {{ eventForm.startDate }}
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="eventForm.endDate" mask="date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="eventForm.endDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input
                v-model="eventForm.bgcolor"
                label="Color"
                outlined
                clearable
              >
                <template #append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-color v-model="eventForm.bgcolor"></q-color>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="OK" type="submit" color="primary" v-close-popup></q-btn>
              <q-btn flat label="Cancel" type="reset" color="primary" v-close-popup></q-btn>
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </q-dialog>

    <q-dialog v-model="showViewEventModal">
      <q-card style="min-height: 30vh; max-height: 60vh;">
        <q-toolbar>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>

          <q-toolbar-title><span class="text-weight-bold">Quasar</span> Framework</q-toolbar-title>

          <q-btn flat round dense icon="edit" v-close-popup @click="showEditForm" />
          <q-btn flat round dense icon="delete" v-close-popup @click="deleteEvent"/>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section style="overflow-y: auto">
          <div class="row full-width justify-start" style="padding-top: 12px;">
            <div class="col-12">
              <div class="row full-width justify-start" v-for="[key, value] in Object.entries(viewEvent)" :key="key">
                 <div class="col-5" style="padding-left: 20px;">
                  <strong>{{ key }}:</strong>
                </div>
                <div class="col-7">
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- <navigation-bar
      @today="onToday"
      @prev="onPrev"
      @next="onNext"
    /> -->

    <q-toolbar class="text-primary row justify-between items-center">
      <q-btn-group flat class="col-3">
        <q-btn color="primary" flat label="Prev" @click="onPrev" />
        <q-btn color="primary" flat label="Next" @click="onNext" />
      </q-btn-group>

      <div class="col-4" style="text-align: center;">
      {{ title }}
      </div>

    </q-toolbar>
    <q-separator class="full-width" />

    <div class="row justify-center">
      <div style="display: flex; width: 100%;">
        <q-calendar-month
          ref="calendar"
          style="height: 80vh"
          v-model="selectedDate"
          animated
          bordered
          focusable
          hoverable
          @change="onChange"
          @moved="onMoved"
          @click-date="onClickDate"
          @click-day="onClickDay"
          @click-workweek="onClickWorkweek"
          @click-head-workweek="onClickHeadWorkweek"
          @click-head-day="onClickHeadDay"
        >
          <template #week="{ scope: { week, weekdays } }">
            <template
              v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
              :key="index"
            >
              <div
                :class="badgeClasses(computedEvent)"
                :style="badgeStyles(computedEvent, week.length)"
                @click = "viewEventDetails(computedEvent)"
              >
                <div
                  v-if="computedEvent.event"
                  class="title q-calendar__ellipsis"
                >
                  {{ computedEvent.event.title }}
                  <q-tooltip>{{ computedEvent.event.details? computedEvent.event.details:'no details' }}</q-tooltip>
                </div>
              </div>
            </template>
          </template>
        </q-calendar-month>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QCalendarMonth,
  daysBetween,
  isOverlappingDates,
  parsed,
  parseDate,
  today,
  indexOf
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import { defineComponent, ref } from 'vue'
import NavigationBar from '../components/NavigationBar.vue'

import axios, { Axios } from 'axios';

const formDefault = {
  title: '',
  description: '',
  icon: '',
  // color: '#0000FF',
  startDate: new Date().toJSON().slice(0, 10).split('-').join('/'),
  endDate: new Date().toJSON().slice(0, 10).split('-').join('/')
}

// The function below is used to set up our demo data
const CURRENT_DAY = new Date()
function getCurrentDay (day) {
  const newDay = new Date(CURRENT_DAY)
  newDay.setDate(day)
  const tm = parseDate(newDay)
  return tm.date
}

export default defineComponent({
  name: 'MonthSlotWeek',
  components: {
    NavigationBar,
    QCalendarMonth
  },
  data () {
    return {
      selectedDate: today(),
      addEvent: false,
      eventForm: {...formDefault},
      showViewEventModal: false,
      testStartDate: new Date().toJSON().slice(0, 10),
      viewEvent: {},
      events: [
        {
          id: 1,
          title: '1st of the Month',
          details: 'Everything is funny as long as it is happening to someone else',
          start: getCurrentDay(1),
          end: getCurrentDay(1),
          bgcolor: 'orange'
        },
        {
          id: 2,
          title: 'Sisters Birthday',
          details: 'Buy a nice present',
          start: getCurrentDay(4),
          end: getCurrentDay(4),
          bgcolor: 'green',
          icon: 'fas fa-birthday-cake'
        },
        {
          id: 3,
          title: 'Meeting',
          details: 'Time to pitch my idea to the company',
          start: getCurrentDay(10),
          end: getCurrentDay(10),
          time: '10:00',
          duration: 120,
          bgcolor: 'red',
          icon: 'fas fa-handshake'
        },
        {
          id: 4,
          title: 'Lunch',
          details: 'Company is paying!',
          start: getCurrentDay(10),
          end: getCurrentDay(10),
          time: '11:30',
          duration: 90,
          bgcolor: 'teal',
          icon: 'fas fa-hamburger'
        },
        {
          id: 5,
          title: 'Visit mom',
          details: 'Always a nice chat with mom',
          start: getCurrentDay(20),
          end: getCurrentDay(20),
          time: '17:00',
          duration: 90,
          bgcolor: 'grey',
          icon: 'fas fa-car'
        },
        {
          id: 6,
          title: 'Conference',
          details: 'Teaching Javascript 101',
          start: getCurrentDay(22),
          end: getCurrentDay(22),
          time: '08:00',
          duration: 540,
          bgcolor: 'blue',
          icon: 'fas fa-chalkboard-teacher'
        },
        {
          id: 7,
          title: 'Girlfriend',
          details: 'Meet GF for dinner at Swanky Restaurant',
          start: getCurrentDay(22),
          end: getCurrentDay(22),
          time: '19:00',
          duration: 180,
          bgcolor: 'teal',
          icon: 'fas fa-utensils'
        },
        {
          id: 8,
          title: 'Rowing',
          details: 'Stay in shape!',
          start: getCurrentDay(27),
          end: getCurrentDay(28),
          bgcolor: 'purple',
          icon: 'rowing'
        },
        {
          id: 9,
          title: 'Fishing',
          details: 'Time for some weekend R&R',
          start: getCurrentDay(22),
          end: getCurrentDay(29),
          bgcolor: 'purple',
          icon: 'fas fa-fish'
        },
        {
          id: 10,
          title: 'Vacation',
          details: 'Trails and hikes, going camping! Don\'t forget to bring bear spray!',
          start: getCurrentDay(22),
          end: getCurrentDay(29),
          bgcolor: 'purple',
          icon: 'fas fa-plane'
        }
      ]
    }
  },
  methods: {
    getWeekEvents (week, weekdays) {
      const firstDay = parsed(week[ 0 ].date + ' 00:00')
      const lastDay = parsed(week[ week.length - 1 ].date + ' 23:59')

      const eventsWeek = []
      this.events.forEach((event, id) => {
        const startDate = parsed(event.start + ' 00:00')
        const endDate = parsed(event.end + ' 23:59')

        if (isOverlappingDates(startDate, endDate, firstDay, lastDay)) {
          const left = daysBetween(firstDay, startDate, true)
          const right = daysBetween(endDate, lastDay, true)

          eventsWeek.push({
            id, // index event
            left, // Position initial day [0-6]
            right, // Number days available
            size: week.length - (left + right), // Size current event (in days)
            event // Info
          })
        }
      })

      const events = []
      if (eventsWeek.length > 0) {
        const infoWeek = eventsWeek.sort((a, b) => a.left - b.left)
        infoWeek.forEach((_, i) => {
          this.insertEvent(events, week.length, infoWeek, i, 0, 0)
        })
      }

      return events
    },

    insertEvent (events, weekLength, infoWeek, index, availableDays, level) {
      const iEvent = infoWeek[ index ]
      if (iEvent !== undefined && iEvent.left >= availableDays) {
        // If you have space available, more events are placed
        if (iEvent.left - availableDays) {
          // It is filled with empty events
          events.push({ size: iEvent.left - availableDays })
        }
        // The event is built
        events.push({ size: iEvent.size, event: iEvent.event })

        if (level !== 0) {
          // If it goes into recursion, then the item is deleted
          infoWeek.splice(index, 1)
        }

        const currentAvailableDays = iEvent.left + iEvent.size

        if (currentAvailableDays < weekLength) {
          const indexNextEvent = indexOf(infoWeek, e => e.id !== iEvent.id && e.left >= currentAvailableDays)

          this.insertEvent(
            events,
            weekLength,
            infoWeek,
            indexNextEvent !== -1 ? indexNextEvent : index,
            currentAvailableDays,
            level + 1
          )
        } // else: There are no more days available, end of iteration
      }
      else {
        events.push({ size: weekLength - availableDays })
        // end of iteration
      }
    },

    badgeClasses (computedEvent) {
      if (computedEvent.event !== undefined) {
        return {
          'my-event': true,
          'text-white': true,
          [ `bg-${ computedEvent.event.bgcolor }` ]: true,
          'rounded-border': true,
          'q-calendar__ellipsis': true
        }
      }
      return {
        'my-void-event': true
      }
    },

    badgeStyles (computedEvent, weekLength) {
      const s = {}
      if (computedEvent.size !== undefined) {
        s.width = ((100 / weekLength) * computedEvent.size) + '%'
      }
      return s
    },

    isBetweenDatesWeek (dateStart, dateEnd, weekStart, weekEnd) {
      return (
        (dateEnd < weekEnd && dateEnd >= weekStart)
          || dateEnd === weekEnd
          || (dateEnd > weekEnd && dateStart <= weekEnd)
      )
    },

    onToday () {
      this.$refs.calendar.moveToToday()
    },
    onPrev () {
      this.$refs.calendar.prev()
    },
    onNext () {
      this.$refs.calendar.next()
    },
    onMoved (data) {
      console.log('onMoved', data)
    },
    onChange (data) {
      console.log('onChange', data)
    },
    onClickDate ({scope}) {
      this.eventForm = {...formDefault, startDate: scope.timestamp.date.split('-').join('/'), endDate: scope.timestamp.date.split('-').join('/')};
      this.addEvent = true;
      console.log(this.events);
    },
    onClickDay ({scope}) {
      console.log('onClickDay', scope)
      this.eventForm = {...formDefault, startDate: scope.timestamp.date.split('-').join('/'), endDate: scope.timestamp.date.split('-').join('/')};
      this.addEvent = true;
      console.log(this.events);
    },
    onClickWorkweek (data) {
      console.log('onClickWorkweek', data)
    },
    onClickHeadDay (data) {
      console.log('onClickHeadDay', data)
    },
    onClickHeadWorkweek (data) {
      console.log('onClickHeadWorkweek', data)
    },
    onSubmit(data){
      console.log(data);

      axios
        .post(`${process.env.BACKEND_URL}/entries/`, {...this.eventForm})
        .then(({response}) => {
          console.log(response);
          this.getData();
        })
        .catch(({error}) => {
          console.log(error);
        });
    },
    viewEventDetails({event}){
      this.showViewEventModal = true;
      this.viewEvent = {...event};
    },
    getData(){
      axios
        .get(`${process.env.BACKEND_URL}/entries/`, {})
        .then(({data}) => {
          this.events = [...data];
        });
    },
    deleteEvent(){
      console.log(this.viewEvent);
      axios
        .delete(`${process.env.BACKEND_URL}/entries/${this.viewEvent.entryId}`, {})
        .then(({response}) => {
          console.log(response);
          this.getData();
        })
        .catch(({error}) => {
          console.log(error);
        });
    },
    showEditForm(){
      this.eventForm = {
        title: this.viewEvent.title,
        description: this.viewEvent.details,
        startDate: this.viewEvent.start.split('-').join('/'),
        endDate: this.viewEvent.end.split('-').join('/'),
        color: this.viewEvent.bgcolor,
        icon: this.viewEvent.icon,
        entryId: this.viewEvent.entryId
      };

      this.addEvent = true;
    }
  },
  mounted() {
    this.getData()
  },
})
</script>

<style lang="sass" scoped>
.my-event
  position: relative
  display: inline-flex
  white-space: nowrap
  font-size: 12px
  height: 16px
  max-height: 16px
  margin: 1px 0 0 0
  justify-content: center
  text-overflow: ellipsis
  overflow: hidden
  cursor: pointer

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 100%

.my-void-event
  display: inline-flex
  white-space: nowrap
  height: 1px

.text-white
  color: white

.bg-blue
  background: blue

.bg-green
  background: green

.bg-orange
  background: orange

.bg-red
  background: red

.bg-teal
  background: teal

.bg-grey
  background: grey

.bg-purple
  background: purple

.rounded-border
  border-radius: 2px
</style>
