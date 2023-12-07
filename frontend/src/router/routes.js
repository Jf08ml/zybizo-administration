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
        component: () => import("pages/manageProducts/ManageProducts.vue"),
      },
      {
        name: "FinancialAnalysis",
        path: "/financial",
        component: () =>
          import("pages/financialAnalysis/financialAnalysis.vue"),
      },
      {
        name: "SalesManagement",
        path: "/sales",
        component: () => import("pages/salesManagement/SalesManagement.vue"),
      },
      {
        name: "ExpenseManagement",
        path: "/expense",
        component: () =>
          import("pages/expenseManagement/expenseManagement.vue"),
      },
      {
        name: "Catalogue",
        path: "/catalogozybizo",
        component: () => import("pages/catalogue/ProductCatalog.vue"),
      },
      {
        name: "Lottery",
        path: "/sorteozybizo",
        component: () => import("pages/lottery/LotteryView.vue"),
      },
      {
        path: "/Login",
        component: () => import("pages/login/LoginUsers.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
