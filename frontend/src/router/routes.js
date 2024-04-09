const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "Home",
        path: "/",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "ManageProducts",
        path: "/products",
        component: () => import("pages/ManageProducts/ManageProducts.vue"),
      },
      {
        name: "FinancialAnalysis",
        path: "/financial",
        component: () =>
          import("pages/FinancialAnalysis/FinancialAnalysis.vue"),
      },
      {
        name: "SalesManagement",
        path: "/sales",
        component: () => import("pages/SalesManagement/SalesManagement.vue"),
      },
      {
        name: "ExpenseManagement",
        path: "/expense",
        component: () =>
          import("pages/ExpenseManagement/ExpenseManagement.vue"),
      },
      {
        name: "Catalogue",
        path: "/catalogozybizo",
        component: () => import("pages/Catalogue/ProductCatalog.vue"),
      },
      {
        name: "Lottery",
        path: "/sorteozybizo",
        component: () => import("pages/lottery/LotteryView.vue"),
      },
      {
        name: "Login",
        path: "/login",
        component: () => import("pages/Authentication/LoginUsers.vue"),
      },
      {
        name: "Register",
        path: "/register",
        component: () => import("pages/Authentication/RegisterUser.vue"),
      },
      {
        name: "Profile",
        path: "/profile",
        component: () => import("pages/Profile/ProfilePage.vue"),
      },
      {
        name: "DetailProduct",
        path: "/detailproduct/:productId",
        component: () => import("pages/DetailProduct/DetailProduct.vue"),
      },
      {
        name: "PaymentPage",
        path: "/payment",
        component: () => import("pages/Payments/PaymentsPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
