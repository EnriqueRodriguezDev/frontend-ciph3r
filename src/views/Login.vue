<template>
    <div>
      <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
      ></v-img>
  
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
        <div class="text-subtitle-1 text-medium-emphasis">Cuenta</div>
  
        <v-text-field
          density="compact"
          placeholder="Correo electrónico"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
        ></v-text-field>
  
        <div
          class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
        >
          Contraseña
  
          <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Olvidó su contraseña?</a
          >
        </div>
  
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Digite su contraseña"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="password"
        ></v-text-field>
  
        <v-btn class="mb-8" 
               color="blue" 
               size="large" 
               variant="tonal" 
               block
               @click="handleLogin"
        >
          Iniciar Sesión
        </v-btn>
  
        <v-card-text 
            class="text-center"
            @click="handleRegister"
        >
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
          >
            Registrarse <v-icon icon="mdi-chevron-right"></v-icon>
          </a>
        </v-card-text>
      </v-card>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useAuthStore } from '../store/auth';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    data: () => ({
      visible: false,
    }),
  
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const email = ref<string>('');
      const password = ref<string>('');
      
      const handleLogin = async () => {

        const loginData = { email: email.value.toLowerCase(), password: password.value.toLowerCase() };

        if (!loginData.email || !loginData.password){
          alert('Todos los campos son obligatorios');
          return;
        }

        await authStore.login(loginData).then(response => {
          if(response.success) {
            router.push('/mainMenu'); 
          } else {
            alert('Error iniciando sesión, intenté más tarde');
          }
          
        }).catch(error => {
          alert('Error iniciando sesión, comuníquese con TIC');
          console.log('Error iniciando sesión', error);
        });
      };
  
      const handleRegister = async () => {
        try {
          await router.push('/register');
        } catch (error) {
          console.log('Register failed', error);
        }
      };
  
      return {
        email,
        password,
        handleLogin,
        handleRegister
      };
    },
  });
  </script>