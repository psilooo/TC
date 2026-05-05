// src/data/tasks.ts — Tasks & Follow-Ups fixtures (matches mock 6)
import type { Kpi, TaskCategory, TaskDeadline, TaskItem } from './types'

export const tasksKpis: Kpi[] = [
  { icon: 'mso-task_alt', label: 'Open Tasks', value: '27', sub: 'Across all shows' },
  { icon: 'mso-event', label: 'Due Today', value: '6', sub: 'Need attention' },
  { icon: 'mso-mail', label: 'Waiting on Reply', value: '9', sub: 'Pending response' },
  { icon: 'mso-trending_up', label: 'Completed This Week', value: '14', sub: 'Last 7 days' },
]

export const tasksTodo: TaskItem[] = [
  {
    id: 'td1',
    title: 'Send guest list update to box office',
    due: 'Today',
    tags: ['Box Office', 'Nashville'],
    assigneeInitials: 'JM',
    column: 'todo',
  },
  {
    id: 'td2',
    title: 'Confirm runner pickup time',
    due: 'Today',
    tags: ['Logistics'],
    assigneeInitials: 'JM',
    column: 'todo',
  },
  {
    id: 'td3',
    title: 'Finalize merch quantities for Atlanta',
    due: 'May 21',
    tags: ['Merch'],
    assigneeInitials: 'TS',
    column: 'todo',
  },
  {
    id: 'td4',
    title: 'Update advance for Charlotte',
    due: 'May 22',
    tags: ['Advance'],
    assigneeInitials: 'JM',
    column: 'todo',
  },
]

export const tasksWaiting: TaskItem[] = [
  {
    id: 'w1',
    title: 'Hospitality rider sign-off — promoter',
    due: 'May 21',
    tags: ['Hospitality', 'Atlanta'],
    assigneeInitials: 'JM',
    column: 'waiting',
  },
  {
    id: 'w2',
    title: 'Hotel block contract — NOLA',
    due: 'May 22',
    tags: ['Hotel'],
    assigneeInitials: 'JM',
    column: 'waiting',
  },
  {
    id: 'w3',
    title: 'Press release approval — label',
    due: 'May 23',
    tags: ['Promo'],
    assigneeInitials: 'AC',
    column: 'waiting',
  },
]

export const tasksDueSoon: TaskItem[] = [
  {
    id: 'ds1',
    title: 'Submit settlement for The Ryman',
    due: 'May 22',
    tags: ['Settlement'],
    assigneeInitials: 'JM',
    column: 'duesoon',
  },
  {
    id: 'ds2',
    title: 'Confirm soundcheck for Iron City',
    due: 'May 23',
    tags: ['Production', 'Birmingham'],
    assigneeInitials: 'LC',
    column: 'duesoon',
  },
  {
    id: 'ds3',
    title: 'Send tech rider to Charlotte',
    due: 'May 24',
    tags: ['Production'],
    assigneeInitials: 'LC',
    column: 'duesoon',
  },
]

export const tasksDone: TaskItem[] = [
  {
    id: 'd1',
    title: 'Confirm Nashville hotel block',
    due: 'May 19',
    tags: ['Hotel'],
    assigneeInitials: 'JM',
    column: 'done',
  },
  {
    id: 'd2',
    title: 'Approve Tabernacle stage plot',
    due: 'May 18',
    tags: ['Production'],
    assigneeInitials: 'LC',
    column: 'done',
  },
  {
    id: 'd3',
    title: 'Send guest list invites — Nashville',
    due: 'May 17',
    tags: ['Box Office'],
    assigneeInitials: 'JM',
    column: 'done',
  },
]

export const tasksDeadlines: TaskDeadline[] = [
  { id: 'dd1', title: 'Submit advance — Atlanta', date: '2026-05-21' },
  { id: 'dd2', title: 'Hotel block — Birmingham', date: '2026-05-22' },
  { id: 'dd3', title: 'Settlement — The Ryman', date: '2026-05-22' },
  { id: 'dd4', title: 'Press release — May 24 show', date: '2026-05-23' },
  { id: 'dd5', title: 'Tour merch reorder', date: '2026-05-26' },
]

export const tasksCategories: TaskCategory[] = [
  { name: 'Advance', count: 9 },
  { name: 'Travel', count: 6 },
  { name: 'Hotel', count: 5 },
  { name: 'Settlement', count: 4 },
  { name: 'Promo', count: 2 },
  { name: 'Other', count: 1 },
]
