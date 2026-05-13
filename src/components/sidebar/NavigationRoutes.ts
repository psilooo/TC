// src/components/sidebar/NavigationRoutes.ts
export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: { name: '/', displayName: 'navigationRoutes.home' },
  routes: [
    { name: 'dashboard', displayName: 'menu.dashboard', meta: { icon: 'mso-home' } },
    { name: 'tour-dates', displayName: 'menu.tour-dates', meta: { icon: 'mso-calendar_today' } },
    { name: 'shows', displayName: 'menu.shows', meta: { icon: 'mso-confirmation_number' } },
    { name: 'itinerary', displayName: 'menu.itinerary', meta: { icon: 'mso-map' } },
    { name: 'travel', displayName: 'menu.travel', meta: { icon: 'mso-flight' } },
    { name: 'contacts', displayName: 'menu.contacts', meta: { icon: 'mso-group' } },
    { name: 'tasks', displayName: 'menu.tasks', meta: { icon: 'mso-task_alt' } },
    { name: 'issues', displayName: 'menu.issues', meta: { icon: 'mso-priority_high' } },
    { name: 'documents', displayName: 'menu.documents', meta: { icon: 'mso-folder' } },
    { name: 'settlements', displayName: 'menu.settlements', meta: { icon: 'mso-attach_money' } },
    { name: 'notes', displayName: 'menu.notes', meta: { icon: 'mso-sticky_note_2' } },
  ] as INavigationRoute[],
}
