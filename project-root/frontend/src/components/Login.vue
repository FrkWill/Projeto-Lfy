<template>
  <div class="background-container" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
    <div style="border:1px solid #ddd;padding:24px;border-radius:8px;max-width:400px;margin:auto;width: -webkit-fill-available;background-color: white;">
      <h2 v-if="!showRegister">Login</h2>
      <h2 v-else>Cadastro</h2>
      <form v-if="!showRegister" @submit.prevent="submitLogin">
        <div style="margin-bottom:8px;">
          <label>Usuário</label><br/>
          <input v-model="username" required class="form-control" />
        </div>
        <div style="margin-bottom:8px; position: relative;">
          <label>Senha</label><br/>
          <input :type="showPassword ? 'text' : 'password'" v-model="password" required class="form-control">
          <span @click="togglePassword" style="position: absolute; right: 10px; top: 50%; cursor: pointer;">
            <i v-if="showPassword" class="fas fa-eye-slash"></i>
            <i v-else class="fas fa-eye"></i>
          </span>
        </div>
        <div>
          <button class="btn btn-success" type="submit">Entrar</button>
          <button type="button" class="btn btn-link" @click="showRegister = true;" style="margin-left:8px">Criar conta</button>
        </div>
      </form>
      <form v-else @submit.prevent="submitRegister">
        <div style="margin-bottom:8px;">
          <label>Usuário</label><br/>
          <input v-model="username" required class="form-control" />
        </div>
        <div style="margin-bottom:8px;">
          <label>Senha</label><br/>
          <input type="text" v-model="password" required class="form-control" />
        </div>
        <div>
          <button class="btn btn-primary" type="submit">Cadastrar</button>
          <button type="button" class="btn btn-link" @click="showRegister = false" style="margin-left:8px">Já tenho conta</button>
        </div>
      </form>

      <div v-if="error" style="color:red;margin-top:8px">{{ error }}</div>
      <div v-if="success" style="color:green;margin-top:8px">{{ success }}</div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return { 
      username: '', 
      password: '', 
      error: null,
      success: null,
      showRegister: false,
      showPassword: false // ✅ declarando aqui
    }
  },
  methods: {
    // Alterna visibilidade da senha
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    //validar e enviar login
    async submitLogin() {
      try {
        const res = await api.post('/auth/login', { username: this.username, password: this.password });
        this.$emit('logged');
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro no login';
        this.success = null;
      }
    },
    //validar e enviar cadastro
    async submitRegister() {
      try {
        const res = await api.post('/auth/register', { username: this.username, password: this.password });
        this.success = 'Usuário cadastrado com sucesso! Agora faça login.';
        this.error = null;
        this.showRegister = false;
        this.password = '';
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao cadastrar usuário';
        this.success = null;
      }
    }
  }
};
</script>

<style scoped>
.background-container { 
  background-image: url('/src/assets/Background.jpg');
}
</style>
