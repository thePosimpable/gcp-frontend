<template>
  <q-dialog v-model="addEntry" no-backdrop-dismiss>
    <div>
      <q-form
        ref='event'
        @submit="onSubmit"
        @reset="onReset"
      >
        <q-card v-if="addEntry" style="width: 400px;">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>
              {{ eventForm.entryId? "Edit":"Add" }} Entry
            </q-toolbar-title>
            <q-btn flat round color="white" icon="close" v-close-popup></q-btn>
          </q-toolbar>
          <q-card-section class="inset-shadow">
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
            <q-input
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
            </q-input>

          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" type="reset" color="primary" v-close-popup></q-btn>
            <q-btn unelevated label="Save" type="submit" color="primary" v-close-popup></q-btn>
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  props: ['addEntry']
}
</script>
