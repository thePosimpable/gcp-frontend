<template>
  <q-page-layout>
    <q-page class="flex full-height ">
      <div class="row full-width">
        <q-table
          class="col"
          title="Table Title"
          :rows="rows"
          :columns="columns"
          row-key="name"
          :rows-per-page-options="[25, 50, 75, 100, 0]"
        >
        <template v-slot:top="props">
          <div class="row col q-gutter-sm">
            <div class="col-2 q-table__title">Entries</div>

            <q-space />

            <q-btn flat dense icon="add" label="Add Entry"/>
            <q-btn flat dense icon="delete" label="Delete Entry"/>
          </div>

        </template>

        <template v-slot:body-cell-color="props">
        <q-td :props="props">
          <div>
            <span :style="`color: ${props.value}`">{{props.value}}</span>
            <!-- <q-badge color="purple" :label="props.value" /> -->

          </div>
          <div class="my-table-details">
            {{ props.row.details }}
          </div>
        </q-td>
      </template>
        </q-table>
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
    }
  },
  methods: {
    getEntries(){
      axios
        .get(`${process.env.BACKEND_URL}/get-entries`, {
          params: {
            token: localStorage.getItem("token"),
            source: localStorage.getItem("source")
          }
        })
        .then(({data}) => {
          this.rows = [...data];
        })
        .catch(({response}) => {
          console.log(response);
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
