<script setup>
import { Button } from "@/components/ui/button";
import CreateTodo from "./CreateTodo.vue";
import { useRouter } from "vue-router";
import { useToast } from "./ui/toast";
import Toaster from "./ui/toast/Toaster.vue";
import { useAuthStore } from "@/stores/authstore";

const { toast } = useToast()
const authStore = useAuthStore();
const router = useRouter();
const Logout = () => {
  authStore.logout();
  router.push("/login");
  toast({
    title: "Logout Sucessfully",
    description: "You have logged out",
  });

};

</script>
<template>
  <Toaster />
  <nav
    class="h-full py-5 bg-slate-400 w-screen justify-around flex item-center"
  >
    <div class="text-xl font-bold">
      <RouterLink to="/">
        
        <h1 v-if="authStore.isAuthenticated">Welcome, {{ authStore.user.username }}</h1>
        <h1 v-else>Todo</h1>
      </RouterLink>
    </div>
    <ul
      v-if="!authStore.isAuthenticated"
      class="text-xl text-pretty font-medium flex gap-10"
    >
      <RouterLink to="login">
        <li>Login</li>
      </RouterLink>
      <RouterLink to="register">
        <li>signin</li>
      </RouterLink>
    </ul>

    <ul v-else class="text-xl text-pretty font-medium flex gap-10">
      <CreateTodo />
      <Button variant="outline" @click="Logout()"> Logout </Button>
    </ul>
  </nav>
</template>
