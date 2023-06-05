<template>
  <q-page class="flex q-pa-md">
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>


      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <AuthComponent :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <AuthComponent :tab="tab"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthComponent',
  data (){
    return {
      formData: {
        email: '',
        password: ''
      },
      resetPwdDialog: false
    }
  },
  methods: {
    submitForm () {
      if (this.tab === 'login') {
         this.signInExistingUser(this.formData.email, this.formData.password)
      } else {
        this.createUser(this.formData.email, this.formData.password)
      }
    },
    google () {
      console.log('google login & signup')
    },
     signInExistingUser (email, password) {
      console.log(email, password)
    },
    createUser(email, password) {
      console.log(email, password)
    },
    forgotPassword () {
      this.resetPwdDialog = true
    }
  },
})


</script>
