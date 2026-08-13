import { AuthUser, UserSession, SecurityEvent } from "./types";
import { LoginInput, RegisterInput, ProfileInput, ChangePasswordInput } from "@/lib/validation/auth";

// A mock provider that simulates backend authentication delays and responses
export class MockAuthProvider {
  private static mockDelay = (ms: number = 800) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  static async login(data: LoginInput): Promise<{ user: AuthUser; token: string }> {
    await this.mockDelay();
    
    if (data.email === "wrong@example.com") {
      throw new Error("Email or password is incorrect.");
    }
    if (data.email === "locked@example.com") {
      throw new Error("Your account has been temporarily locked for security.");
    }

    return {
      user: {
        id: "ETH-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
        email: data.email,
        displayName: "Trader",
        emailVerified: true,
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        role: "SUPER_ADMIN",
      },
      token: "mock_jwt_token_123",
    };
  }

  static async register(data: RegisterInput): Promise<void> {
    await this.mockDelay();
    if (data.email === "exists@example.com") {
      throw new Error("If an account exists with this email, follow the instructions we sent.");
    }
  }

  static async verifyEmail(token: string): Promise<void> {
    await this.mockDelay();
    if (token === "invalid") throw new Error("Invalid or expired verification link");
  }

  static async resendVerification(): Promise<void> {
    await this.mockDelay(500);
  }

  static async requestPasswordReset(email: string): Promise<void> {
    await this.mockDelay();
  }

  static async resetPassword(password: string, token: string): Promise<void> {
    await this.mockDelay();
  }

  static async changePassword(data: ChangePasswordInput): Promise<void> {
    await this.mockDelay();
    if (data.currentPassword === "wrong") throw new Error("Incorrect current password.");
  }

  static async updateProfile(data: ProfileInput): Promise<AuthUser> {
    await this.mockDelay();
    // Normally this returns the updated user from backend
    return {
      id: "mock",
      email: "mock",
      emailVerified: true,
      status: "ACTIVE",
      createdAt: "",
      ...data
    } as AuthUser;
  }

  static async getSessions(): Promise<UserSession[]> {
    await this.mockDelay(400);
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    
    return [
      {
        id: "sess_1",
        userId: "mock",
        device: "Desktop",
        browser: "Chrome",
        os: "Windows",
        isCurrentSession: true,
        lastActiveAt: now.toISOString(),
        createdAt: yesterday.toISOString(),
      },
      {
        id: "sess_2",
        userId: "mock",
        device: "Mobile",
        browser: "Safari",
        os: "iOS",
        isCurrentSession: false,
        lastActiveAt: yesterday.toISOString(),
        createdAt: new Date(yesterday.getTime() - 86400000).toISOString(),
      }
    ];
  }

  static async revokeSession(sessionId: string): Promise<void> {
    await this.mockDelay(300);
  }

  static async revokeAllSessions(): Promise<void> {
    await this.mockDelay(600);
  }

  static async logout(): Promise<void> {
    await this.mockDelay(300);
  }
}
