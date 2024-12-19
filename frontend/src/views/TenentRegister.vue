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
import axios from "axios";

import { ref } from "vue";

const FormData = ref({
  tenantName: "",
});

const registerTenent = async () => {
  console.log(FormData.value);
  try {
    const response = await axios.post("http://localhost:5000/api/tenant/register", FormData.value, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    
  } catch (error) { 
    console.error(error);
  }

}
</script>

<template>
  <div class="flex justify-center items-center py-10">
    <Card class="w-[350px]">
      <form @submit.prevent="registerTenent()">
        <CardHeader>
          <CardTitle>Register Tenent</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="name">Tenent name</Label>
              <Input id="name" v-model="FormData.tenantName" type="text" placeholder="Your Tenent Name" />
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-center flex-col px-6 pb-6 gap-5">
          <Button class="w-full">Create</Button>

          <p>
            Already have an account?
            <RouterLink to="/login" class="text-blue-500">Login</RouterLink>
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>
