import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import dateTimeFilter from '@/filters/datetime'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.use(Vuelidate)
Vue.filter('dateTime', dateTimeFilter)
Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBkWYH19IV7DRylgPdO4iiqQ03pIhl4Qm8",
  authDomain: "vue-tasks-c16f9.firebaseapp.com",
  databaseURL: "https://vue-tasks-c16f9.firebaseio.com",
  projectId: "vue-tasks-c16f9",
  storageBucket: "vue-tasks-c16f9.appspot.com",
  messagingSenderId: "169529562637",
  appId: "1:169529562637:web:1c7051d810eb8c5cad6744"
};

firebase.initializeApp(firebaseConfig)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
