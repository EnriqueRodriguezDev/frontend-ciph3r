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
        <div class="text-subtitle-1 text-medium-emphasis">Registro</div>
  
        <v-text-field
          density="compact"
          placeholder="Correo electrónico"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="email"
        ></v-text-field>
  
        <v-text-field
          density="compact"
          placeholder="Nombre"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          v-model="name"
        ></v-text-field>
  
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
  
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Confirme su contraseña"
          prepend-inner-icon="mdi-lock-check-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          v-model="c_password"
        ></v-text-field>
  
        <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          :disabled="loading"
          @click="handleRegister"
        >
          <template v-if="loading">
            <v-progress-circular
              indeterminate
              color="white"
              size="20"
            ></v-progress-circular>
          </template>
          <template v-else>
            Registrarse
          </template>
        </v-btn>

        <v-card-text 
            class="text-center"
            @click="handleGoBack"
        >
          <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
          >
            <v-icon icon="mdi-chevron-left"></v-icon> Iniciar Sesión 
          </a>
        </v-card-text>

      </v-card>
    </div>
  </template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';

export default defineComponent({
  setup() {

    const authStore = useAuthStore();
    const router = useRouter();

    const email = ref<string>('');
    const name = ref<string>('');
    const password = ref<string>('');
    const c_password = ref<string>('');
    const visible = ref(false);
    const loading = ref(false);


const handleRegister = async () => {

 const registerData = { 
    name: name.value.toUpperCase(), 
    email: email.value.toLowerCase(), 
    password: password.value.toLowerCase(), 
    c_password: c_password.value.toLowerCase()
};

  if (registerData.password !== registerData.c_password) {
    alert('Las contraseñas no coinciden');
    return;
  }

  loading.value = true;

  await authStore.register(registerData).then((response) => {
                        if (response.success) {
                            alert(response.message);
                            router.push('/login'); // Redirige al login
                        } else {
                            alert('Registro fallido: ' + response.message);
                        }
                    }).catch((error) => {
                        console.error('Error al registrarse:', error);
                        alert('Ocurrió un error al registrarse. Por favor, inténtelo más tarde.');
                    })
                    .finally(() => {
                        loading.value = false;
                    });
    };

    const handleGoBack = () => {
        router.push('/login')
    };

    return {
      email,
      name,
      password,
      c_password,
      visible,
      loading,
      handleRegister,
      handleGoBack
    };
  },
});
</script>

  