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
        path: "/Login",
        component: () => import("pages/Login/LoginUsers.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
