<template>
  <q-layout view="hHh Lpr lff">
    <q-header elevated class="header-gradient">
      <InstallBanner />
      <q-toolbar class="q-px-md q-px-lg-xl">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
        >
          <q-tooltip class="bg-primary">Menú</q-tooltip>
        </q-btn>

        <q-toolbar-title class="text-weight-medium">
          {{ fullTitle || "Galaxia Glamour Store" }}
        </q-toolbar-title>

        <!-- Spacer for better layout -->
        <q-space />

        <!-- Authentication buttons for non-authenticated users -->
        <div v-if="!isAuthenticated" class="auth-buttons q-gutter-sm">
          <q-btn
            :size="reSize"
            outline
            rounded
            no-caps
            class="text-no-wrap login-btn"
            label="Iniciar sesión"
            @click="redirectToLogin"
          >
            <q-icon name="login" left />
          </q-btn>
          <q-btn
            :size="reSize"
            unelevated
            rounded
            no-caps
            color="primary"
            class="register-btn"
            label="Registrarse"
            @click="redirectToRegister"
          >
            <q-icon name="person_add" left />
          </q-btn>
        </div>

        <!-- Shopping cart button -->
        <q-btn flat round class="cart-btn q-mx-sm" @click="goToPay">
          <q-icon name="shopping_cart" size="md" />
          <q-badge
            v-if="itemsCar > 0"
            floating
            rounded
            color="red"
            :label="itemsCar"
            class="cart-badge"
          />
          <q-tooltip class="bg-primary"
            >Ver carrito ({{ itemsCar }} items)</q-tooltip
          >
        </q-btn>

        <!-- User menu for authenticated users -->
        <div v-if="isAuthenticated" class="user-menu">
          <q-btn-dropdown flat rounded no-caps class="user-dropdown">
            <template v-slot:label>
              <q-avatar size="32px" class="q-mr-sm">
                <img
                  src="https://ik.imagekit.io/6cx9tc1kx/galaxia/zoomed_rounded_image_dSaieoj4-.png?updatedAt=1753479123734"
                  alt="avatar-galaxia"
                />
              </q-avatar>
              <span class="gt-xs">Mi cuenta</span>
            </template>

            <q-list>
              <q-item clickable v-close-popup @click="$router.push('/profile')">
                <q-item-section avatar>
                  <q-icon name="person" />
                </q-item-section>
                <q-item-section>Perfil</q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="$router.push('/orders')">
                <q-item-section avatar>
                  <q-icon name="receipt_long" />
                </q-item-section>
                <q-item-section>Mis pedidos</q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-close-popup @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Cerrar sesión</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      overlay
      bordered
      :width="280"
      :breakpoint="500"
      class="drawer-custom"
    >
      <div class="drawer-header q-pa-md text-center">
        <q-avatar size="60px" class="q-mb-sm">
          <img
            src="https://ik.imagekit.io/6cx9tc1kx/galaxia/zoomed_rounded_image_dSaieoj4-.png?updatedAt=1753479123734"
            alt="Galaxia Logo"
          />
        </q-avatar>
        <div class="text-h6 text-weight-medium">Galaxia Glamour Store</div>
        <div class="text-caption text-grey-6">Distribuidora oficial</div>
      </div>

      <q-separator />

      <q-list class="q-pt-md">
        <q-item-label header class="text-weight-medium q-px-md">
          <q-icon name="menu" class="q-mr-sm" />
          Navegación
        </q-item-label>

        <EssentialLink
          v-for="link in filteredLinksList"
          :key="link.title"
          v-bind="link"
          @click="leftDrawerOpen = false"
          class="link-item"
        />
      </q-list>

      <q-separator class="q-mt-md" />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";
import { useCarStore } from "src/stores/car.js";
import EssentialLink from "components/EssentialLink.vue";
import InstallBanner from "components/InstallBanner.vue";
import { useQuasar } from "quasar";

const $router = useRouter();
const authStore = useAuthStore();
const carStore = useCarStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);
const $q = useQuasar();

const reSize = computed(() => {
  if ($q.screen.lt.sm) {
    return "xs";
  } else {
    return "md";
  }
});

const itemsCar = computed(() => carStore.itemCount);

const leftDrawerOpen = ref(false);

const goToPay = () => {
  $router.push({
    name: "PaymentPage",
    query: { type: "car", time: Date.now() },
  });
};

const redirectToLogin = () => {
  $router.push({ name: "Login" });
};

const redirectToRegister = () => {
  $router.push({ name: "Register" });
};

const linksList = [
  {
    title: "Inicio",
    caption: "",
    icon: "bi-house",
    link: "/home",
  },
  {
    title: "Catálogo",
    caption: "",
    icon: "bi-cart-check",
    link: "/catalogo",
  },
  {
    title: "Sorteo de descuentos",
    caption: "",
    icon: "bi-gift-fill",
    link: "/sorteozybizo",
  },
  {
    title: "Stock de productos",
    caption: "",
    icon: "bi-card-checklist",
    link: "/products",
    role: "Administrator",
  },
  {
    title: "Punto de Venta (POS)",
    caption: "",
    icon: "bi-cash-coin",
    link: "/pos",
    role: "Administrator",
  },
  {
    title: "Análisis financiero",
    caption: "",
    icon: "bi-graph-up",
    link: "/financial",
    role: "Administrator",
  },
  {
    title: "Ventas",
    caption: "",
    icon: "bi-cash-stack",
    link: "/sales",
    role: "Administrator",
  },
  {
    title: "Gastos",
    caption: "",
    icon: "bi-credit-card",
    link: "/expense",
    role: "Administrator",
  },
  {
    title: "Categorías",
    caption: "",
    icon: "bi-tags",
    link: "/categories",
    role: "Administrator",
  },
  {
    title: "Facebook",
    caption: "/zybizo.bazar",
    icon: "bi-facebook",
    link: "https://www.facebook.com/zybizo.bazar",
  },
  {
    title: "Instagram",
    caption: "@zybizobazar",
    icon: "bi-instagram",
    link: "https://www.instagram.com/zybizobazar",
  },
  {
    title: "Whatsapp",
    caption: "@ZybizoBazar",
    icon: "bi-whatsapp",
    link: "https://wa.me/message/LRMCRWYN6JRNO1",
  },
  {
    title: "Zybizo page",
    caption: "Page official",
    icon: "bi-globe-americas",
    link: "https://www.zybizobazar.com/catalogo",
  },
];

const filteredLinksList = computed(() => {
  return linksList.filter((link) => {
    if (link.title === "Iniciar sesión" && isAuthenticated.value) {
      return false;
    }
    if (link.role && link.role !== authStore.userRole) {
      return false;
    }
    return true;
  });
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const logout = () => {
  authStore.logout();
  $router.push({ name: "Home" });
};

const fullTitle = computed(() => {
  const matchedLink = linksList.find(
    (link) => link.link === $router.currentRoute.value.path
  );
  const subTitle = matchedLink ? matchedLink.title : "";
  return `${subTitle}`;
});
</script>

<style scoped>
/* Header gradient background */
.header-gradient {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

/* Authentication buttons styling */
.auth-buttons {
  display: flex;
  align-items: center;
}

.login-btn {
  border: 2px solid rgba(255, 255, 255, 0.7);
  color: white;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

.register-btn {
  transition: all 0.3s ease;
  background: #333333;
  border: 2px solid #333333;
  color: white;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(51, 51, 51, 0.4);
  background: #444444;
  border-color: #444444;
}

/* Shopping cart button */
.cart-btn {
  position: relative;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.cart-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

.cart-badge {
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  background: #000000;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  color: white;
}

/* User dropdown menu */
.user-menu .user-dropdown {
  padding: 4px 8px;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.user-menu .user-dropdown:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

/* Drawer custom styling */
.drawer-custom {
  background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
}

.drawer-header {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  margin: -1px -1px 0 -1px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}


/* Link items styling */
.link-item {
  margin: 2px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.link-item:hover {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%);
  transform: translateX(6px);
  border-left-color: #000000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .auth-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .auth-buttons .q-btn {
    min-width: 120px;
    font-size: 12px;
  }
}

@media (max-width: 479px) {
  .q-toolbar {
    padding-left: 8px;
    padding-right: 8px;
  }

  .cart-btn {
    padding: 6px;
  }
}

/* Animation for drawer */
.q-drawer {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Improved tooltips */
.q-tooltip {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: white;
}

/* Better focus states for accessibility */
.q-btn:focus {
  outline: 2px solid #666666;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(102, 102, 102, 0.2);
}

/* Loading states */
.q-btn.loading {
  pointer-events: none;
  opacity: 0.7;
}

/* Additional color enhancements */
.q-toolbar-title {
  color: white;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Menu button enhancement */
.q-btn[aria-label="Menu"] {
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.q-btn[aria-label="Menu"]:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* Tooltip styling */
.q-tooltip {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: white;
}
</style>
