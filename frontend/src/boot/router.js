// src/boot/router.js
export default ({ router }) => {
    router.beforeEach((to, from, next) => {
      if (to.meta.title) {
        document.title = to.meta.title;
      }
      next();
    });
  };
  