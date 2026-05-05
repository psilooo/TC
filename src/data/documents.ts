// src/data/documents.ts — Documents & Settlements fixtures (matches mock 7)
import type { DocsMissingItem, DocsSelectedFile, FileEntry, Kpi, Settlement, TravelIssue } from './types'

export const docsKpis: Kpi[] = [
  { icon: 'mso-folder', label: 'Total Files', value: '132', sub: 'All shows' },
  { icon: 'mso-warning', label: 'Missing Docs', value: '18', sub: 'Need attention' },
  { icon: 'mso-attach_money', label: 'Pending Settlements', value: '9', sub: 'Awaiting close' },
  { icon: 'mso-payments', label: 'Net Due', value: '$128,740.00', sub: 'Outstanding' },
]

export const docsSelectedId = 'sel'

export const docsFiles: FileEntry[] = [
  {
    id: 'sel',
    type: 'PDF',
    name: 'The Ryman.pdf',
    category: 'Venue Contract',
    show: 'The Ryman — Nashville',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-15',
    status: 'Approved',
  },
  {
    id: 'f2',
    type: 'PDF',
    name: 'Tabernacle_Contract.pdf',
    category: 'Venue Contract',
    show: 'Tabernacle — Atlanta',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-12',
    status: 'Pending',
  },
  {
    id: 'f3',
    type: 'PDF',
    name: 'Fillmore_NOLA_Contract.pdf',
    category: 'Venue Contract',
    show: 'The Fillmore — New Orleans',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-10',
    status: 'Approved',
  },
  {
    id: 'f4',
    type: 'Doc',
    name: 'Hospitality_Rider_v3.doc',
    category: 'Rider',
    show: 'The Ryman — Nashville',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-18',
    status: 'Approved',
  },
  {
    id: 'f5',
    type: 'PDF',
    name: 'StagePlot_v3.pdf',
    category: 'Production',
    show: 'The Ryman — Nashville',
    uploadedBy: 'LC',
    uploadedDate: '2026-05-19',
    status: 'Approved',
  },
  {
    id: 'f6',
    type: 'PDF',
    name: 'IronCity_Contract.pdf',
    category: 'Venue Contract',
    show: 'Iron City — Birmingham',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-08',
    status: 'Action Needed',
  },
  {
    id: 'f7',
    type: 'Sheet',
    name: 'GuestList_AtlantaMay21.xlsx',
    category: 'Guest List',
    show: 'Tabernacle — Atlanta',
    uploadedBy: 'JM',
    uploadedDate: '2026-05-19',
    status: 'Pending',
  },
  {
    id: 'f8',
    type: 'Image',
    name: 'StagePhoto_NOLA.jpg',
    category: 'Reference',
    show: 'The Fillmore — New Orleans',
    uploadedBy: 'LC',
    uploadedDate: '2026-05-17',
    status: 'Approved',
  },
]

export const docsSelectedFile: DocsSelectedFile = {
  id: 'sel',
  type: 'PDF',
  name: 'The Ryman.pdf',
  category: 'Venue Contract',
  show: 'The Ryman — Nashville',
  uploadedBy: 'JM',
  uploadedDate: '2026-05-15',
  status: 'Approved',
  sizeKb: 412,
  preview:
    'Standard venue contract for the May 20 show. Includes capacity, deal points, settlement terms, deductions, advance schedule, and a hospitality addendum signed by both parties.',
  signers: ['Sarah Williams (Venue)', 'Jane Manager (Tour)'],
}

export const docsSettlements: Settlement[] = [
  {
    id: 's1',
    show: 'The Ryman — Nashville',
    date: '2026-05-20',
    grossUsd: 165400,
    expensesUsd: 22300,
    netUsd: 143100,
    status: 'Pending',
  },
  {
    id: 's2',
    show: 'Tabernacle — Atlanta',
    date: '2026-05-21',
    grossUsd: 142800,
    expensesUsd: 19800,
    netUsd: 123000,
    status: 'Pending',
  },
  {
    id: 's3',
    show: 'The Fillmore — New Orleans',
    date: '2026-05-22',
    grossUsd: 128400,
    expensesUsd: 17900,
    netUsd: 110500,
    status: 'Pending',
  },
  {
    id: 's4',
    show: 'Iron City — Birmingham',
    date: '2026-05-23',
    grossUsd: 116200,
    expensesUsd: 16400,
    netUsd: 99800,
    status: 'Disputed',
  },
  {
    id: 's5',
    show: 'The Fillmore — Charlotte',
    date: '2026-05-24',
    grossUsd: 124000,
    expensesUsd: 17200,
    netUsd: 106800,
    status: 'Pending',
  },
  {
    id: 's6',
    show: 'House of Blues — Houston',
    date: '2026-04-28',
    grossUsd: 138600,
    expensesUsd: 19100,
    netUsd: 119500,
    status: 'Confirmed',
  },
]

export const docsMissing: DocsMissingItem[] = [
  { id: 'dm1', title: 'Tech rider', show: 'Tabernacle — Atlanta', severity: 'High' },
  { id: 'dm2', title: 'Insurance certificate', show: 'Iron City — Birmingham', severity: 'High' },
  { id: 'dm3', title: 'Settlement worksheet', show: 'Charlotte', severity: 'Medium' },
  { id: 'dm4', title: 'Stage plot', show: 'House of Blues — Houston', severity: 'Low' },
]

export const docsIssues: TravelIssue[] = [
  { id: 'di1', title: 'Settlement disputed', sub: 'Iron City — May 23', severity: 'High' },
  { id: 'di2', title: 'Net Due overdue', sub: 'Houston — Apr 28', severity: 'Medium' },
  { id: 'di3', title: 'Missing signature', sub: 'Charlotte contract', severity: 'Low' },
]
