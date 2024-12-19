import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import { useAuthStore } from "@/stores/authstore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: { requiresAuth: false },
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/adminView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/register/tenent",
      name: "admin",
      component: () => import("../views/TenentRegister.vue"),
      // meta: { requiresAuth: true },
    },
    {
      path: "/todo/update/:id",
      name: "update-todo",
      component: () => import("../views/UpdateTodo.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuthentication();
    if (isAuthenticated) {
      next(); // Allow access
    } else {
      next("/login"); // Redirect to login if not authenticated
    }
  } else {
    next(); // Public route, allow access
  }
});

export default router;
