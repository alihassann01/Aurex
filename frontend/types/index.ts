// ============================================================
// CivicConnect — TypeScript Interfaces & Types
// ============================================================

// ── Auth ─────────────────────────────────────────────────────
export type UserRole = 'resident' | 'staff' | 'department_admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  staffId?: string;
  profilePhoto?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ProfileResponse {
  user: User;
}

// ── CRMS (Module A) ──────────────────────────────────────────
export type RequestCategory = 'Infrastructure' | 'Permits' | 'Safety';
export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type RequestStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export interface CivicRequest {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  location: string;
  latitude?: number;
  longitude?: number;
  attachments: Attachment[];
  assignedTo?: User;
  department?: string;
  sla: SLAInfo;
  comments: Comment[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRequestPayload {
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  location: string;
  latitude?: number;
  longitude?: number;
  attachments?: File[];
}

export interface SLAInfo {
  deadline: string;
  daysLeft: number;
  status: 'green' | 'amber' | 'red';
  breached: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  isInternal: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
}

// ── Permits (Module B) ───────────────────────────────────────
export type PermitType = 'construction' | 'event' | 'business';
export type PermitStatus =
  | 'Draft'
  | 'Submitted'
  | 'Document Verification'
  | 'Field Inspection'
  | 'Approved'
  | 'Rejected';

export interface Permit {
  id: string;
  permitNumber: string;
  type: PermitType;
  status: PermitStatus;
  applicantName: string;
  businessName?: string;
  address: string;
  description: string;
  documents: Attachment[];
  fee: number;
  rejectionReason?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermitFormData {
  type: PermitType;
  applicantName: string;
  businessName?: string;
  address: string;
  description: string;
  startDate: string;
  endDate: string;
  documents: File[];
  // Construction-specific
  projectScope?: string;
  contractorName?: string;
  estimatedCost?: number;
  // Event-specific
  eventName?: string;
  expectedAttendees?: number;
  venueDetails?: string;
  // Business-specific
  businessType?: string;
  numberOfEmployees?: number;
}

// ── Announcements (Module C) ─────────────────────────────────
export type AnnouncementPriority = 'Low' | 'Normal' | 'High' | 'Emergency';
export type AnnouncementCategory = 'Health' | 'Infrastructure' | 'Culture' | 'Emergency' | 'General';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  category: AnnouncementCategory;
  author: User;
  isRead: boolean;
  expiryDate?: string;
  createdAt: string;
}

export interface CityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  registered: number;
  isRegistered: boolean;
  imageUrl?: string;
}

// ── Analytics (Module D) ─────────────────────────────────────
export interface AnalyticsOverview {
  totalRequests: number;
  openTickets: number;
  slaBreachRate: number;
  avgResolutionTime: number;
  ticketsByStatus: StatusCount[];
  resolutionTimeByDept: DeptResolution[];
  slaBreachOverTime: WeeklyBreach[];
  permitFunnel: FunnelStage[];
  topIssues: TopIssue[];
  complaintHeatmap: HeatmapPoint[];
}

export interface StatusCount {
  status: RequestStatus;
  count: number;
}

export interface DeptResolution {
  department: string;
  avgDays: number;
}

export interface WeeklyBreach {
  week: string;
  breachRate: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface TopIssue {
  rank: number;
  category: string;
  location: string;
  count: number;
}

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  intensity: number;
  area: string;
}

// ── Notifications ────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: string;
}

// ── API ──────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
