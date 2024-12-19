<script setup>
import Card from './ui/card/Card.vue';
import CardHeader from './ui/card/CardHeader.vue';
import CardTitle from './ui/card/CardTitle.vue';
import CardDescription from './ui/card/CardDescription.vue';
import CardFooter from './ui/card/CardFooter.vue';
import Button from './ui/button/Button.vue';
import { useTodoStore } from '@/stores/todostore';

import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authstore';

const authStore = useAuthStore();
console.log(authStore.user);

const { toast } = useToast();
const router = useRouter();

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});
defineEmits(["dragStart"]);

const todoStore = useTodoStore();

function onDragStart(event) {
  // Make sure to access the _id of the Proxy object correctly
  event.dataTransfer.setData("todoId", props.todo._id);
  // console.log("drag start:", props.todo._id);
}

// formate the date with time as well
const formatedDate = new Date(props.todo.postedAt).toLocaleString();

function deleteTodo() {
  todoStore.deleteTodobyId(props.todo._id);
  toast({
    title: "Todo Deleted Successfully",
    description: "You have deleted a todo",
  });
  location.reload();
}
</script>

<template>
  <Toaster />
  <Card
    draggable="true"
    @dragstart="onDragStart"
    class="cursor-pointer "
  >
    <CardHeader class="flex-row justify-between">
      <div>
        <CardTitle>{{ todo.task }}</CardTitle>
        <CardDescription>{{ todo.description }}</CardDescription>
      </div>
      <div class="flex flex-col">
        <CardDescription>{{ authStore.user.username || 'Name' }}</CardDescription>
        <CardDescription>{{ formatedDate|| 'Date' }}</CardDescription>
      </div>
    </CardHeader>
    <CardFooter class="flex justify-end gap-10 px-6 pb-6">
      <RouterLink :to="`/todo/update/${todo._id}`">
        <Button variant="secondary">Edit</Button>
      </RouterLink>
      <Button variant="destructive" @click="deleteTodo">Delete</Button>
    </CardFooter>
  </Card>
</template>
