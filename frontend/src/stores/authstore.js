import axios from "axios";
import { defineStore } from "pinia";

const tenentId = window.location.hostname.split(".")[0];


export const useAuthStore = defineStore("authStore", {
  state: () => ({
    tenant: tenentId,
    isAuthenticated: false,
    user: []
  }),
  actions: {
    
    async checkAuthentication() {
      try {
        const response = await axios.get(`http://${this.tenant}.localhost:5000/api/auth/check`, {
          withCredentials: true,
        });

        if (response.data.isAuthenticated) {
          this.isAuthenticated = true;
          this.user =  response.data.user.userId|| [];
          console.log(this.user);
        } else {
          this.isAuthenticated = false;
          this.user = [];
        }
        return this.isAuthenticated;
      } catch (error) {
        console.error("Error Checkiing Authentication", error);
        this.isAuthenticated = false;
        this.user = [];
        return false;
      }
    },
    logout() {
      this.isAuthenticated = false;
      this.user = [];
      axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
    },
  },
});
