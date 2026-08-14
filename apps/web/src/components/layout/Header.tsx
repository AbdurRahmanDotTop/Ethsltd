"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, X, User, ChevronDown, LogOut, LayoutDashboard, Shield, Settings, Bell, Info } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { useTradingModeStore } from "@/stores/trading-mode-store"
import { apiClient } from "@ethsltd/api-client"
        </div>
      )}
    </header>
  )
}
