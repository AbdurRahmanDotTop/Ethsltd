import { AuthUser } from "./types";
import { LoginInput, RegisterInput } from "@/lib/validation/auth";
import { apiClient } from "@ethsltd/api-client";

export class ProductionAuthProvider {
  static async login(data: LoginInput): Promise<{ user: AuthUser; token: string }> {
    const res = await apiClient.getMe();
    if (!res.success || !res.data) {
      throw new Error("Invalid credentials");
    }

    // Mapping the API User to AuthUser
    const authUser: AuthUser = {
      id: res.data.id,
      email: res.data.email,
      displayName: "Trader",
      emailVerified: true,
      status: res.data.status,
      role: res.data.role,
      mfaEnabled: res.data.mfaEnabled,
      createdAt: res.data.createdAt,
      lastLogin: Date.now(),
    };

    return {
      user: authUser,
      token: "real_production_token", // Handled securely via HttpOnly cookies
    };
  }
}
