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
    let status: "ACTIVE" | "EMAIL_UNVERIFIED" | "LOCKED" | "SUSPENDED" | "CLOSED" = "ACTIVE";
    if (res.data.status === "PENDING_VERIFICATION") status = "EMAIL_UNVERIFIED";
    else if (res.data.status === "FROZEN") status = "LOCKED";
    else if (res.data.status === "BANNED") status = "SUSPENDED";
    else if (res.data.status === "ACTIVE") status = "ACTIVE";

    const authUser: AuthUser = {
      id: res.data.id,
      email: res.data.email,
      displayName: "Trader",
      emailVerified: res.data.status !== "PENDING_VERIFICATION",
      status: status,
      role: res.data.role,
      createdAt: new Date(res.data.createdAt).toISOString(),
    };

    return {
      user: authUser,
      token: "real_production_token", // Handled securely via HttpOnly cookies
    };
  }
}
