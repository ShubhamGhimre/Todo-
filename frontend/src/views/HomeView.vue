<script setup>
import TodoCard from "@/components/TodoCard.vue";
import { useTodoStore } from "@/stores/todostore";
import { computed, onMounted } from "vue";

const todoStore = useTodoStore();

const pendingTodos = computed(() =>
  todoStore.todos.filter((t) => t.status === "pending")
);
const highPriorityTodos = computed(() =>
  todoStore.todos.filter((t) => t.status === "highPriority")
);
const completedTodos = computed(() =>
  todoStore.todos.filter((t) => t.status === "Completed")
);

defineEmits(["dragStart"]);

function handleDragStart(event, todo) {
  console.log("drag start:", todo._id);
}

function handleDrop(event, newStatus) {
  event.preventDefault();
  const todoId = event.dataTransfer.getData("todoId");
  todoStore.updateTodoStatus(todoId, newStatus); // Call the store action to update the status
}

function allowDrop(event) {
  event.preventDefault();
}
onMounted(async () => {
  await todoStore.fetchTodos();
});
</script>

<template>
  <div class="flex flex-col xl:grid md:grid-cols-2 xl:grid-cols-3 gap-10 p-10">
    <!-- Pending Tasks -->
    <div
      class="flex flex-col gap-10 border border-gray-200 p-4"
      @drop="handleDrop($event, 'pending')"
      @dragover="allowDrop"
    >
      <h1 class="text-xl text-center">Pending Tasks</h1>
      <TodoCard
        v-for="todo in pendingTodos"
        :key="todo._id"
        :todo="todo"
        :onDragStart="handleDragStart"
      />
    </div>

    <!-- High Priority Tasks -->
    <div
      class="flex flex-col gap-10 border border-gray-200 p-4"
      @drop="handleDrop($event, 'highPriority')"
      @dragover="allowDrop"
    >
      <h1 class="text-xl text-center">High Priority Tasks</h1>
      <TodoCard
        v-for="todo in highPriorityTodos"
        :key="todo._id"
        :todo="todo"
        :onDragStart="handleDragStart"
      />
    </div>

    <!-- Completed Tasks -->
    <div
      class="flex flex-col gap-10 border border-gray-200 p-4"
      @drop="handleDrop($event, 'Completed')"
      @dragover="allowDrop"
    >
      <h1 class="text-xl text-center">Completed Tasks</h1>
      <TodoCard
        v-for="todo in completedTodos"
        :key="todo._id"
        :todo="todo"
        :onDragStart="handleDragStart"
      />
    </div>
  </div>
</template>
