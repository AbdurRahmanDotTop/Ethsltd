import { AuthUser, UserSession, SecurityEvent } from "./types";
import { LoginInput, RegisterInput, ProfileInput, ChangePasswordInput } from "@/lib/validation/auth";
import { apiClient } from "@ethsltd/api-client";

// Replaced mock delays with real API calls
export class MockAuthProvider {
  static async login(data: LoginInput): Promise<{ user: AuthUser; token: string }> {
    const res = await apiClient.login(data.email, data.password);
    if (!res.success) throw new Error(res.error || "Login failed");
    return {
      user: res.data as AuthUser,
      token: res.token,
    };
  }

  static async register(data: RegisterInput): Promise<void> {
    const res = await apiClient.register(data.email, data.password);
    if (!res.success) throw new Error(res.error || "Registration failed");
  }

  static async verifyEmail(token: string): Promise<void> {}
  static async resendVerification(): Promise<void> {}
  static async requestPasswordReset(email: string): Promise<void> {}
  static async resetPassword(password: string, token: string): Promise<void> {}
  static async changePassword(data: ChangePasswordInput): Promise<void> {}

  static async updateProfile(data: ProfileInput): Promise<AuthUser> {
    return { id: "real", email: "real", emailVerified: true, status: "ACTIVE", createdAt: "", ...data } as AuthUser;
  }

  static async getSessions(): Promise<UserSession[]> {
    return [];
  }

  static async revokeSession(sessionId: string): Promise<void> {}
  static async revokeAllSessions(): Promise<void> {}
  static async logout(): Promise<void> {}
}
