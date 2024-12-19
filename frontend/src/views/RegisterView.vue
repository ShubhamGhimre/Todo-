<script setup>
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { useAuthStore } from "@/stores/authstore";


const { toast } = useToast()

const router = useRouter();
const authStore = useAuthStore();


const formData = ref({
  username: "",
  password: "",
});
console.log(authStore.tenant)
// const tenantId = window.location.hostname.split(".")[0];
// console.log(tenantId);

const registerUser = async () => {
  // get the subdomain from the url
  try {
    const response = await axios.post(`http://${authStore.tenant}.localhost:5000/api/auth/register`,formData.value, {
      headers: {
        "Content-Type": "application/json",
      },
      withcredentials: true,
    });

    if (response.status === 201) {
      toast({
        title: "register Success",
        description: "You have successfully registered",
      })
    }
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <Toaster />
  <div class="flex justify-center items-center py-10">
    <Card class="w-[350px]">
      <form @submit.prevent="registerUser()"> 
        <CardHeader>
          <CardTitle class="text-center">Register User</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Username</Label>
              <Input type="text" placeholder="Your Full Name"
              v-model="formData.username"
              />
            </div>
            <!-- <div class="flex flex-col space-y-1.5">
              <Label for="name">Email</Label>
              <Input id="name" type="email" placeholder="Your Email" />
            </div> -->
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Password</Label>
              <Input  type="password" 
              placeholder="Your Password"
              v-model="formData.password"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-center flex-col px-6 pb-6 gap-5">
          <Button class="w-full" type="submit">Create</Button>

          <p>
            Already have an account?
            <RouterLink to="/login" class="text-blue-500">Login</RouterLink>
          </p>

        </CardFooter>
      </form>
    </Card>
  </div>
</template>
