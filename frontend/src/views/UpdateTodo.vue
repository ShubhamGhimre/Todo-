<script setup lang="ts">
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { useTodoStore } from "@/stores/todostore";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const todoStore = useTodoStore();

const { toast } = useToast();


const TodoId = route.params.id;

const formData = ref({
  task: "",
  description: "",
  status: "",
})


const getTodobyId = () => {
  // todoStore.getTodoById(TodoId);
  todoStore.getTodoById(TodoId).then(todo => {
    if(todo){
      formData.value.task = todo.task;
      formData.value.description = todo.description;
      formData.value.status = todo.status;
    }
  })
};

const updateTodo = () => {
  console.log(formData.value);
  todoStore.updateTodo(TodoId, formData.value);
  toast({
    title: "Todo Updated Sucessfully",
    description: "You have updated a todo",
  });
  router.push("/");
};

onMounted(() => {
  getTodobyId();
});
</script>

<template>
  <Toaster />
  <div class="flex items-center justify-center py-10">
    <form action="" @submit.prevent="updateTodo">
      <Card class="w-[350px]">
        <CardHeader>
          <CardTitle>Update Todo title</CardTitle>
          <CardDescription>Description.</CardDescription>
        </CardHeader>

        <CardContent>
          <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="tile" class="text-right"> Title </Label>
              <Input id="name" v-model="formData.task" default-value="Make dinner" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="description" class="text-right"> Description </Label>
              <Input id="name" default-value="Make dinner" v-model="formData.description" class="col-span-3" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
              <Label for="status" class="text-right"> Status </Label>
              <Select  v-model="formData.status">
                <SelectTrigger class="w-[220px]">
                  <SelectValue placeholder="select Status"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="highPriority">highPriority</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between px-6 pb-6">
          <Button type="submit">Update</Button>
          <Button variant="outline"> Cancel </Button>
        </CardFooter>
      </Card>
    </form>
  </div>
</template>
