<template>
  <q-page-layout>

    <q-page class="flex full-height ">

      <div class="full-width">
        <div>
          <q-table
            class="my-sticky-header-table"
            flat bordered
            title="Table Title"
            :rows="rows"
            :columns="columns"
            row-key="name"
            :rows-per-page-options="[25, 50, 75, 100, 0]"
            :loading="showLoading"
          >
            <template v-slot:top="props">
              <div class="row col q-gutter-sm">
                <div class="col-2 q-table__title">Entries</div>

                <q-space />

                <q-btn flat dense icon="add" label="Add Entry"/>
                <q-btn flat dense icon="delete" label="Delete Entry"/>
              </div>
            </template>

            <template v-slot:body-cell-title="props">
              <q-td :props="props" style="white-space: wrap">
                <p>{{ props.value }}</p>
              </q-td>
            </template>

            <template v-slot:body-cell-description="props">
              <q-td :props="props" style="white-space: wrap">
                <p>{{ props.value }}</p>
              </q-td>
            </template>

            <template v-slot:body-cell-color="props">
              <q-td :props="props">
                <div>
                  <span :style="`color: ${props.value}`">{{props.value}}</span>
                  <!-- <q-badge color="purple" :label="props.value" /> -->

                </div>
              </q-td>
            </template>
          </q-table>
      </div>
      </div>


    </q-page>
  </q-page-layout>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { logout } from '../layouts/Login.vue'

const columns = [
  // {
  //   name: 'title',
  //   required: true,
  //   label: 'Dessert (100g serving)',
  //   align: 'left',
  //   field: row => row.name,
  //   format: val => `${val}`,
  //   sortable: true
  // },
  // { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
  // { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  // { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  // { name: 'protein', label: 'Protein (g)', field: 'protein' },
  // { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
  // { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
  // { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
  {name: 'title', label: 'Title', field: 'title', align: 'left'},
  {name: 'description', label: 'Description', field: 'description', align: 'left'},
  {name: 'startDate', label: 'Start', field: 'startDate', format: val => `${dayjs(val).format('MM/DD/YYYY')}`, align: 'center'},
  {name: 'endDate', label: 'End', field: 'endDate', format: val => `${dayjs(val).format('MM/DD/YYYY')}`, align: 'center'},
  {name: 'color', label: 'Color', field: 'color', align: 'center'},
  {name: 'icon', label: 'Icon', field: 'icon', align: 'center'},
]


export default defineComponent({
  name: 'EventsPage',
  data(){
    return {
      columns: columns,
      rows: [],
      events: [],
      showLoading: false,
    }
  },
  methods: {
    getEntries(){
      this.showLoading = true;

      axios
        .get(`${process.env.BACKEND_URL}/get-entries`, {
          params: {
            token: localStorage.getItem("token"),
            source: localStorage.getItem("source")
          }
        })
        .then(({data}) => {
          this.rows = [...data];
          this.showLoading = false;
        })
        .catch(({response}) => {
          console.log(response);
          this.showLoading = false;

          if(response.status == 401){
            logout();
          }
          // An error happened.
        });
    }
  },
  mounted() {
    this.getEntries()
  },
})


</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 92vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: white

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
