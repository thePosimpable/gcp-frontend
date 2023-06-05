
<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <q-page class="bg-light-blue-2 window-height window-width row justify-center items-center">
        <div class="column">
          <div class="row">
            <q-card square bordered class="q-pa-lg shadow-1">
              <q-card-section>
                <q-form class="q-gutter-md">
                  <q-input square filled clearable v-model="email" type="email" label="email" />
                  <q-input square filled clearable v-model="password" type="password" label="password" />
                </q-form>
              </q-card-section>
              <q-card-actions class="q-px-md">
                <q-btn unelevated color="light-blue-7" size="lg" class="full-width" label="Login" @click="login" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const relogin = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("source");

  window.location.href = './#/login';
}

export const logout = () => {
  const auth = getAuth();
  signOut(auth).then((response) => {
    relogin();
    console.log("successful signout", response)
  })
  .catch((error) => {
    console.log(error);
    // An error happened.
  });
}

export default defineComponent({
  name: 'Login',

  components: {

  },

  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login(){
      const auth = getAuth();

      signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        console.log('login success');

        const user = userCredential.user;

        localStorage.setItem("token", user.accessToken);
        localStorage.setItem("source", "firebase");

        this.$router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
    }
  }
})
</script>

<style>
.q-card {
  width: 360px;
}

</style>
