// store/auth.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { auth } from '../api/auth';
import type { UserData, Token, Register, Login } from '../types';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as Token['value'],
    userData: null as UserData | null
  }),
  
  actions: {
    
    async login({email, password} : Login) {
      
      const response = await axios.post(auth.LOGIN, { email, password });

      this.token = response.data.token;
      this.userData = {
        success: response.data.success,
        token: response.data.data.token,
        email: response.data.data.email,
        name: response.data.data.name,
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;

      return this.userData;
    },

    async register({ name, email, password, c_password }: Register) {
      const response = await axios.post(auth.REGISTER, { name, email, password, c_password });
      return response.data;
    },

    getUserData(): UserData | null {
      return this.userData;
      //return this.userData || { success: false, token: "", email: "", name: "" }; 
    },

  },
});
