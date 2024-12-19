// src/stores/todoStore.js
import axios from "axios";
import { defineStore } from "pinia";
import { toast } from "../components/ui/toast";
const tenentId = window.location.hostname.split(".")[0];

export const useTodoStore = defineStore("todoStore", {
  state: () => ({
    tenant: tenentId,
    todos: [],
  }),
  actions: {
    async fetchTodos() {
      try {
        const response = await axios.get(`http://${this.tenant}.localhost:5000/api/todos`, {
          withCredentials: true,
        });
        this.todos = response.data || [];
        console.log(this);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    },
    async updateTodoStatus(todoId, newStatus) {
      const todo = this.todos.find((t) => t._id === todoId);
      if (!todo) return;

      const oldStatus = todo.status;
      todo.status = newStatus;

      try {
        // Make the request to update the status on the backend
        await axios.patch(
          `http://${this.tenant}.localhost:5000/api/todos/${todoId}/status`,
          { status: newStatus },
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error updating todo status:", error);
        // Revert the status change in case of error
        todo.status = oldStatus;
        alert("Failed to update the todo status. Please try again.");
      }
    },

    // get a specific todo
    async getTodoById(todoId) {
      try {
        const response = await axios.get(
          `http://${this.tenant}.localhost:5000/api/todos/${todoId}`,
          {
            withCredentials: true,
          }
        );
        // console.log("response", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching todo by id:", error);
        toast({
          title: "Error",
          description: "Failed to fetch the todo. Please try again.",
        });
      }
    },

    // for Todo Update
    async updateTodo(todoId, updatedTodo) {
      try {
        const response = await axios.patch(
          `http://${this.tenant}.localhost:5000/api/todos/${todoId}`,
          updatedTodo,
          {
            withCredentials: true,
          }
        );
        // console.log("response", response.data);
        return response.data;
      } catch (error) {
        console.error("Error updating todo by id:", error);
        toast({
          title: "Error",
          description: "Failed to update the todo. Please try again.",
        });
      }
    },

    // for Todo Delete
    async deleteTodobyId(todoId) {
      try {
        const response = await axios.delete(
          `http://${this.tenant}.localhost:5000/api/todos/${todoId}`,
          {
            withCredentials: true,
          }
        );
        // console.log("response", response.data);
        return response.data;
      } catch (error) {
        console.error("Error deleting todo by id:", error);
        // Revert optimistic UI update if the API fails
        this.todos.push(deletedTodo);
        toast({
          title: "Error",
          description: "Failed to delete the todo. Please try again.",
        });
      }
    },
  },
});
