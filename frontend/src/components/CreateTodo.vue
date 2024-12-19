<script setup>
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { onUnmounted, ref } from "vue";
import axios from "axios";
import Select from "./ui/select/Select.vue";
import SelectTrigger from "./ui/select/SelectTrigger.vue";
import SelectValue from "./ui/select/SelectValue.vue";
import SelectContent from "./ui/select/SelectContent.vue";
import SelectItem from "./ui/select/SelectItem.vue";
import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from "vue-router";
import { useTodoStore } from "@/stores/todostore";
import { useAuthStore } from "@/stores/authstore";


const FormData = ref({
  task: "",
  description: "",
  status: "",
});

 const router = useRouter();
 const authStore = useAuthStore()

const { toast } = useToast()
const emit = defineEmits(["update:modelValue"]);

const todoStore = useTodoStore();

const onSelectChange = (value) => {
  emit("update:modelValue", value);
};

const createTodo = async () => {
  console.log(FormData.value);
  try {
    const response = await axios.post(
      `http://${authStore.tenant}.localhost:5000/api/todos`,
      FormData.value,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      toast({
        title: "Todo Created Sucessfully",
        description: "You have created a new todo",
      })
      console.log(response.data);
      location.reload();

    }
  } catch (error) {
    console.error(error);
  }
};

onUnmounted(()=> {
  console.log("unmounted");
})
</script>
<template>
  <Toaster />
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline"> Create New </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="createTodo()">
        <DialogHeader>
          <DialogTitle>Create Todo</DialogTitle>
          <DialogDescription> Create a a todo list </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right"> Title </Label>
            <Input
              default-value="Make dinner"
              class="col-span-3"
              v-model="FormData.task"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right"> Description </Label>
            <Input
              default-value="Make dinner"
              class="col-span-3"
              v-model="FormData.description"
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right"> Status </Label>

            <Select v-model="FormData.status" @click="onSelectChange" >
              <SelectTrigger class="w-[220px]">
                <SelectValue  placeholder="select Status"></SelectValue>
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="pending">pending</SelectItem>
                <SelectItem value="highPriority">highPriority</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" variant="secondary"> Create </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
