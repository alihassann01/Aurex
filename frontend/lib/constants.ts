import type { RequestStatus, RequestPriority, RequestCategory, PermitStatus, AnnouncementPriority, UserRole } from '@/types';

// ── Status Colors ─────────────────────────────────────────────
export const STATUS_COLORS: Record<RequestStatus, string> = {
  Submitted: 'bg-slate-500',
  'Under Review': 'bg-blue-500',
  Assigned: 'bg-indigo-500',
  'In Progress': 'bg-amber-500',
  Resolved: 'bg-emerald-500',
  Closed: 'bg-gray-400',
};

export const STATUS_LABELS: RequestStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

// ── Priority Colors ───────────────────────────────────────────
export const PRIORITY_COLORS: Record<RequestPriority, string> = {
  Low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  High: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Emergency: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

// ── Category Options ──────────────────────────────────────────
export const CATEGORY_OPTIONS: { value: RequestCategory; label: string }[] = [
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Permits', label: 'Permits' },
  { value: 'Safety', label: 'Safety' },
];

export const PRIORITY_OPTIONS: { value: RequestPriority; label: string }[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Emergency', label: 'Emergency' },
];

// ── Permit Status Colors ─────────────────────────────────────
export const PERMIT_STATUS_COLORS: Record<PermitStatus, string> = {
  Draft: 'bg-gray-500',
  Submitted: 'bg-slate-500',
  'Document Verification': 'bg-blue-500',
  'Field Inspection': 'bg-amber-500',
  Approved: 'bg-emerald-500',
  Rejected: 'bg-red-500',
};

export const PERMIT_STATUS_LABELS: PermitStatus[] = [
  'Submitted',
  'Document Verification',
  'Field Inspection',
  'Approved',
  'Rejected',
];

// ── Announcement Priority Colors ──────────────────────────────
export const ANNOUNCEMENT_PRIORITY_COLORS: Record<AnnouncementPriority, string> = {
  Low: 'bg-gray-100 text-gray-800',
  Normal: 'bg-blue-100 text-blue-800',
  High: 'bg-orange-100 text-orange-800',
  Emergency: 'bg-red-100 text-red-800',
};

// ── Role Colors (using exact backend role strings) ────────────
export const ROLE_COLORS: Record<UserRole, string> = {
  resident: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
  staff: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
  department_admin: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  super_admin: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  resident: 'Resident',
  staff: 'Staff',
  department_admin: 'Dept Admin',
  super_admin: 'Super Admin',
};

// ── SLA Colors ────────────────────────────────────────────────
export const SLA_COLORS = {
  green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
} as const;
