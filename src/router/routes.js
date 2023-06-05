
const routes = [
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
    // children: [
    //   { path: '', component: () => import('src/pages/Auth.vue') }
    // ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PlannerPage.vue') }
    ]
  },

  {
    path: '/entries',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/EntriesPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
