<template>
  <div>
    <component :is="logged ? 'Dashboard' : 'Login'" @logged="onLogged" />
  </div>
</template>

<script>
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  components: {
    Login,
    Dashboard
  },
  // Estado de autenticação
  data() {
    return {
      logged: false
    }
  },
  methods: {
    // Atualiza estado de autenticação
    onLogged() {
      this.logged = true
    }
  }
}
</script>
