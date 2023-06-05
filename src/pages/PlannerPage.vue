<template>
  <div class="subcontent">
    <q-dialog v-model="showFormDialog" no-backdrop-dismiss>
      <div>
        <q-form
          ref='event'
          @submit="onSubmit"
          @reset="onReset"
        >
          <q-card v-if="showFormDialog" style="width: 400px;">
            <q-toolbar class="bg-primary text-white">
              <q-toolbar-title>
                {{ eventForm.entryId? "Edit":"Add" }} Entry
              </q-toolbar-title>
              <q-btn flat round color="white" icon="close" v-close-popup></q-btn>
            </q-toolbar>
            <q-card-section class="inset-shadow q-gutter-y-sm">
              <q-input
                v-model="eventForm.title"
                label="Title"
                :rules="[v => v && v.length > 0 || 'Field cannot be empty']"
                autofocus
              />
              <q-input
                v-model="eventForm.description"
                label="Description"
                type="textarea"
                filled
              />

              <q-input v-model="eventForm.startDate" mask="date" label="Start Date">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="eventForm.startDate">
                        <div class="row items-center justify-end">
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
                v-model="eventForm.color"
                label="Color"
                outlined
                clearable
              >
                <template #append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-color v-model="eventForm.color"></q-color>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <!-- <q-input
                v-model="eventForm.icon"
                label="Icon"
                outlined
                clearable
                style="padding-bottom: 20px;"
              >
                <template #append>
                  <q-icon name="extension" class="cursor-pointer">
                    <q-popup-proxy v-model="showIconPicker">

                      <q-icon-picker
                        v-model="iconpickerValue"
                        :filter="iconpickerValue"
                        icon-set="material-icons"
                        tooltips
                        :pagination.sync="pagination"
                        style="height: 300px; width: 300px; background-color: white;"
                      />

                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input> -->

            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Cancel" type="reset" color="primary" v-close-popup></q-btn>
              <q-btn unelevated label="Save" type="submit" color="primary" v-close-popup></q-btn>
            </q-card-actions>
          </q-card>
        </q-form>
      </div>
    </q-dialog>

    <!-- <EntryForm @add-entry="showFormDialog"/> -->


    <q-dialog v-model="showViewEventModal">
      <q-card style="width: 500px; max-width: 80vw; margin-bottom: 20px">
        <q-toolbar class="q-gutter-sm" style="padding-right: 0">
          <q-toolbar-title>Entry Details</q-toolbar-title>

          <q-btn flat round dense icon="edit" v-close-popup @click="showEditForm" title="Edit"><q-tooltip>edit</q-tooltip></q-btn>
          <q-btn flat round dense icon="content_copy" v-close-popup @click="showDuplicateForm"><q-tooltip>Duplicate</q-tooltip></q-btn>
          <q-btn flat round dense icon="delete" v-close-popup @click="deleteEvent" title="Delete"><q-tooltip>Delete</q-tooltip></q-btn>
          <q-btn flat round dense icon="close" v-close-popup title="Close"><q-tooltip>Close</q-tooltip></q-btn>
        </q-toolbar>

        <q-card-section style="overflow-y: auto; " class="">
          <div class="row full-width justify-start" style="padding-top: 12px;">
            <div class="col-12 q-gutter-y-sm">
              <div class="row full-width justify-start" v-for="[key, value] in Object.entries(viewEvent)" :key="key">
                 <div class="col-4" style="padding-left: 20px;">
                  <strong>{{ key }}:</strong>
                </div>
                <div class="col-8">
                  <span>{{ (value? value:'-') }}</span>
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
      <div style="display: flex; width: 100%;" class="calendar-container">
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
// import EntryForm from '../components/EntryForm.vue';

import axios from 'axios';
import dayjs from 'dayjs';

import { logout } from '../layouts/Login.vue'

const formDefault = {
  title: '',
  description: '',
  icon: '',
  // color: '#0000FF',
  startDate: dayjs().format('YYYY/MM/DD'),
  endDate: dayjs().format('YYYY/MM/DD')
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
    QCalendarMonth,
    // EntryForm
  },
  data () {
    return {
      selectedDate: today(),
      showFormDialog: false,
      eventForm: {...formDefault},
      showViewEventModal: false,
      testStartDate: new Date().toJSON().slice(0, 10),
      viewEvent: {},
      events: [],
      showIconPicker: false,
      pagination: {
        itemsPerPage: 35,
        page: 1
      },
      iconpickerValue: null,
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
          // [ `bg-${ computedEvent.event.bgcolor }` ]: true,
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
      if(computedEvent.event){
        s.background = computedEvent.event.bgcolor;
      }
      return s;
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
      this.showFormDialog = true;
    },
    onClickDay ({scope}) {
      console.log('onClickDay', scope)
      this.eventForm = {...formDefault, startDate: scope.timestamp.date.split('-').join('/'), endDate: scope.timestamp.date.split('-').join('/')};
      this.showFormDialog = true;
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
    saveAddEntry(){
      const formPayload = {
        title: this.eventForm.title,
        description: this.eventForm.description,
        startDate: this.eventForm.startDate,
        endDate: this.eventForm.endDate,
        color: this.eventForm.color,
        icon: this.eventForm.icon,
      }

      axios
        .post(`${process.env.BACKEND_URL}/add-entry`, formPayload, {
          params: {
            token: localStorage.getItem("token"),
            source: localStorage.getItem("source")
          },
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(({response}) => {
          console.log(response);
          this.eventForm = {};
          this.getEntries();
        })
        .catch(({error}) => {
          console.log(error);
        });
    },
    saveEditEntry(){
      const putPayload = {...this.eventForm};
      putPayload.startDate = `${dayjs(putPayload.startDate).format('YYYY-MM-DD')}`
      putPayload.endDate = `${dayjs(putPayload.endDate).format('YYYY-MM-DD')}`

      axios
        .put(`${process.env.BACKEND_URL}/edit-entry`, putPayload, {
          params: {entryId: putPayload.entryId, token: localStorage.getItem("token"), source: localStorage.getItem("source")},
          headers: {"Content-Type": "application/json"}
        })
        .then(({response}) => {
          this.eventForm = {};
          this.getEntries();
        })
        .catch(({error}) => {
          console.log(error);
        });
    },
    onSubmit(){
      console.log(this.eventForm, !this.eventForm.entryId);

      if(!this.eventForm.entryId){
        this.saveAddEntry();
      }
      else{
        this.saveEditEntry();
      }
    },
    viewEventDetails({event}){
      this.viewEvent = {...event}
      this.showViewEventModal = true;
    },
    formatMonthValue(val, toSlash){
      console.log('formatMonthValue');
      return toSlash? `${dayjs(val).format('YYYY/MM/DD')}`: `${dayjs(val).format('YYYY-MM-DD')}`;
    },
    getEntries(){
      axios
        .get(`${process.env.BACKEND_URL}/get-entries`, {
          params: {
            token: localStorage.getItem("token"),
            source: localStorage.getItem("source")
          }
        })
        .then(({data}) => {
          const localData = [...data].map(element => ({
            ...element,
            details: element.description,
            start: element.startDate,
            startDate: dayjs(element.startDate).format("YYYY/MM/DD"),
            startDateDisplay: dayjs(element.startDate).format("ddd, MMM D, YYYY"),
            end: element.endDate,
            endDate: dayjs(element.endDate).format("YYYY/MM/DD"),
            endDateDisplay: dayjs(element.endDate).format("ddd, MMM-D-YYYY"),
            bgcolor: element.color,
          }));

          this.events = [...localData];
        })
        .catch(({response}) => {
          console.log(response);
          if(response.status == 401){
            logout();
          }
          // An error happened.
        });
    },
    deleteEvent(){
      axios
        .delete(`${process.env.BACKEND_URL}/delete-entry`, {
          params: {
            token: localStorage.getItem("token"),
            entryId: this.viewEvent.entryId,
            source: localStorage.getItem("source")
          }
        })
        .then(({response}) => {
          console.log(response);
          this.getEntries();
        })
        .catch(({error}) => {
          console.log(error);
        });
    },
    showEditForm(){
      this.eventForm = {...this.viewEvent}
      this.showFormDialog = true;
    },
    showDuplicateForm(){
      this.eventForm = {...this.viewEvent, entryId: undefined};

      this.showFormDialog = true;
    }
  },
  mounted() {
    this.getEntries()
  },
  watch: {
    iconpickerValue () {
      this.showIconPicker = false
    }
  },
})
</script>

<style lang="css" scoped>
  .my-event{
    position: relative;
    display: inline-flex;
    white-space: nowrap;
    font-size: 12px;
    height: 16px;
    max-height: 16px;
    margin: 1px 0 0 0;
    justify-content: center;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
  }

  .title{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .my-void-event{
    display: inline-flex;
    white-space: nowrap;
    height: 1px;
  }

  .text-white{
    color: white;
  }

  .rounded-border{
    border-radius: 2px;
  }

  .calendar-container{
    position: relative;
  }

  .q-calendar-month__week--days:hover, .q-calendar-month__day--content:hover{
    background: rgba(0,0,255,.1);
  }
</style>
