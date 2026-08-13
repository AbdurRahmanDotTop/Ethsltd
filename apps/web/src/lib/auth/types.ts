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
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  emailVerified?: boolean;
  status: UserStatus | string;
  createdAt: string | Date | number;
  avatarUrl?: string | null;
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
