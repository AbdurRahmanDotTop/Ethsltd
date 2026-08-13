export type UserStatus =
  | "ACTIVE"
  | "EMAIL_UNVERIFIED"
  | "LOCKED"
  | "SUSPENDED"
  | "CLOSED";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  status: UserStatus;
  createdAt: string;
  avatarUrl?: string;
  role?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device: string;
  browser: string;
  os: string;
  isCurrentSession: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export interface SecurityEvent {
  id: string;
  eventType: string;
  timestamp: string;
  device: string;
  success: boolean;
}

export type DisplayCurrency = "USD";
