<script setup>
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from "@/stores/authstore";

const { toast } = useToast();
const router = useRouter();

import { ref } from "vue";
import { useRouter } from "vue-router";
const authStore = useAuthStore();
const formData = ref({
  username: "",
  password: "",
});
const errors = ref({
  username: "",
  password: "",
  general:  "",
})
// const tenantId = window.location.hostname.split(".")[0];

const validateForm = () => {
  let valid = true;
  if (!formData.value.username) {
    errors.value.username = "Username is required.";
    valid = false;
  } else {
    errors.value.username = "";
  }
  if (!formData.value.password) {
    errors.value.password = "Password is required.";
    valid = false;
  } else {
    errors.value.password = "";
  }
  return valid;
}

const loginUser = async() => {
  if (!validateForm()) return;
  try {
    const response = await axios.post(`http://${authStore.tenant}.localhost:5000/api/auth/login`, formData.value, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (response.status === 200) {
      console.log(response.data);
      toast({
        title: "Login Success",
        description: "You have successfully logged in",
      })
      router.push("/");
    }
  } catch (error) {
    console.error(error);
    errors.value.general =
      error.response?.data?.message || "An error occurred. Please try again.";
    toast({
      title: "Login Failed",
      description: errors.value.general,
      variant: "",
    });
  }
}


</script>

<template>
  <Toaster />
  <div class="flex justify-center items-center py-10">
    <Card class="w-[350px]">
      <form @submit.prevent="loginUser()">
        <CardHeader>
          <CardTitle class="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">username</Label>
              <Input  type="text" placeholder="Your Username" 
              v-model="formData.username"
              />
              <p v-if="errors.username" class="text-red-500 text-sm">
                {{ errors.username }}
              </p>
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Password</Label>
              <Input type="password" placeholder="Your Password" 
              v-model="formData.password"
              />
              <p v-if="errors.password" class="text-red-500 text-sm">
                {{ errors.password }}
              </p>
            </div>

          </div>
        </CardContent>
        <CardFooter class="flex justify-center flex-col px-6 pb-6 gap-5">
          <Button class="w-full" type="submit">Login</Button>

          <p>
            Dont have an account?
            <RouterLink to="/register" class="text-blue-500">Register</RouterLink>
          </p>
        </CardFooter>
      </form>
    </Card>
    
    
  </div>
</template>
