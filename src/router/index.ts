// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
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
        { path: 'issues', name: 'issues', component: () => import('../pages/Issues.vue') },
        { path: 'artists', name: 'artists', component: () => import('../pages/Artists.vue') },
        { path: 'artists/:id', name: 'artist-detail', component: () => import('../pages/ArtistDetail.vue') },
        { path: 'documents', name: 'documents', component: () => import('../pages/Documents.vue') },
        { path: 'settlements', name: 'settlements', component: () => import('../pages/Settlements.vue') },
        { path: 'notes', name: 'notes', component: () => import('../pages/Notes.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../pages/NotFound.vue') },
  ],
})
