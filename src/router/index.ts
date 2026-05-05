// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      redirect: { name: 'dashboard' },
      children: [
        { path: 'dashboard', name: 'dashboard', component: () => import('../pages/Dashboard.vue') },
        { path: 'tour-dates', name: 'tour-dates', component: () => import('../pages/TourDates.vue') },
        { path: 'shows', name: 'shows', component: () => import('../pages/Shows.vue') },
        { path: 'itinerary', name: 'itinerary', component: () => import('../pages/Itinerary.vue') },
        { path: 'travel', name: 'travel', component: () => import('../pages/Travel.vue') },
        { path: 'contacts', name: 'contacts', component: () => import('../pages/Contacts.vue') },
        { path: 'tasks', name: 'tasks', component: () => import('../pages/Tasks.vue') },
        { path: 'documents', name: 'documents', component: () => import('../pages/Documents.vue') },
        { path: 'settlements', name: 'settlements', component: () => import('../pages/Settlements.vue') },
        { path: 'notes', name: 'notes', component: () => import('../pages/Notes.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../pages/NotFound.vue') },
  ],
})
