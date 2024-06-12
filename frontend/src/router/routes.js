const routes = [
  {
    path: "/",
    redirect: "/catalogozybizo",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Home",
        path: "home",
        component: () => import("pages/IndexPage.vue"),
        meta: {
          title: 'Zybizo - Inicio'
        }
      },
      {
        name: "ManageProducts",
        path: "products",
        component: () => import("pages/ManageProducts/ManageProducts.vue"),
        meta: {
          title: 'Productos'
        }
      },
      {
        name: "FinancialAnalysis",
        path: "financial",
        component: () =>
          import("pages/FinancialAnalysis/FinancialAnalysis.vue"),
        meta: {
          title: 'Resumen financiero'
        }
      },
      {
        name: "SalesManagement",
        path: "sales",
        component: () => import("pages/SalesManagement/SalesManagement.vue"),
        meta: {
          title: 'Ventas'
        }
      },
      {
        name: "ExpenseManagement",
        path: "expense",
        component: () =>
          import("pages/ExpenseManagement/ExpenseManagement.vue"),
        meta: {
          title: 'Gastos'
        }
      },
      {
        name: "Catalogue",
        path: "catalogozybizo",
        component: () => import("pages/Catalogue/ProductCatalog.vue"),
        meta: {
          title: 'Zybizo - Catálogo'
        }
      },
      {
        name: "Lottery",
        path: "sorteozybizo",
        component: () => import("pages/lottery/LotteryView.vue"),
        meta: {
          title: 'Sorteo Zybizo Bazar'
        }
      },
      {
        name: "Login",
        path: "login",
        component: () => import("pages/Authentication/LoginUsers.vue"),
        meta: {
          title: 'Iniciar sesión en Zybizo Bazar'
        }
      },
      {
        name: "Register",
        path: "register",
        component: () => import("pages/Authentication/RegisterUser.vue"),
        meta: {
          title: 'Registarse en Zybizo Bazar'
        }
      },
      {
        name: "Profile",
        path: "profile",
        component: () => import("pages/Profile/ProfilePage.vue"),
        meta: {
          title: 'Perfil del usuario'
        }
      },
      {
        name: "DetailProduct",
        path: "detailproduct/:productId",
        component: () => import("pages/DetailProduct/DetailProduct.vue"),
        meta: {
          title: 'Detalles del producto'
        }
      },
      {
        name: "PaymentPage",
        path: "payment",
        component: () => import("pages/Payments/PaymentsPage.vue"),
        meta: {
          title: 'Hacer/Pagar pedido'
        }
      },
      {
        name: "PrivacyPolicy",
        path: "privacypolicy",
        component: () => import("pages/PrivacyPolicy.vue"),
      },
      {
        name: "TermsOfService",
        path: "termservice",
        component: () => import("pages/TermsOfService.vue"),
      },
      {
        name: "OrderSend",
        path: "ordersend",
        component: () => import("components/SuccessOrder.vue"),
        meta: {
          title: 'Pedido exitoso'
        }
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
