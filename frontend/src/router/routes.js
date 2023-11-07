const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/products",
        component: () => import("pages/ManageProducts/ManageProducts.vue"),
      },
      {
        path: "/financial",
        component: () =>
          import("pages/FinancialAnalysis/FinancialAnalysis.vue"),
      },
      {
        path: "/sales",
        component: () => import("pages/SalesManagement/SalesManagement.vue"),
      },
      {
        path: "/expense",
        component: () =>
          import("pages/ExpenseManagement/ExpenseManagement.vue"),
      },
      {
        path: "/catalogozybizo",
        component: () => import("pages/Catalogue/ProductCatalog.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
