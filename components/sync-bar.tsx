"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Wifi, WifiOff, Database, AlertTriangle, RefreshCw, LogOut, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface SyncBarProps {
  isOnline: boolean
  onToggle: () => void
  user?: SupabaseUser | null
}

export function SyncBar({ isOnline, onToggle, user }: SyncBarProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 h-14 glass border-b border-[#1a1a1a]"
      >
        <div className="h-full flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-[#00f3ff] font-bold text-sm lg:text-base tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              QUEST_COMMAND://
            </motion.div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#1a1a1a] bg-[#0a0a0a]/50">
                  <User className="w-3 h-3 text-[#00f3ff]" />
                  <span className="text-[#00f3ff] text-xs tracking-wider truncate max-w-32">{user.email}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded border border-[#ff003c]/50 text-[#ff003c] text-xs tracking-wider hover:bg-[#ff003c]/10 transition-all disabled:opacity-50"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden md:inline">DISCONNECT</span>
                </motion.button>
              </div>
            )}

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded border transition-all duration-300"
              style={{
                borderColor: isOnline ? "#00ff88" : "#ff8800",
                boxShadow: isOnline ? "0 0 10px rgba(0, 255, 136, 0.3)" : "0 0 10px rgba(255, 136, 0, 0.3)",
                background: isOnline ? "rgba(0, 255, 136, 0.05)" : "rgba(255, 136, 0, 0.05)",
              }}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-[#00ff88]" />
                  <Database className="w-4 h-4 text-[#00ff88]" />
                  <span className="text-[#00ff88] text-xs lg:text-sm font-medium tracking-wider hidden sm:inline">
                    LINK ESTABLISHED
                  </span>
                </>
              ) : (
                <motion.div
                  className="flex items-center gap-2 flicker"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <WifiOff className="w-4 h-4 text-[#ff8800]" />
                  <AlertTriangle className="w-4 h-4 text-[#ff8800]" />
                  <span className="text-[#ff8800] text-xs lg:text-sm font-medium tracking-wider hidden sm:inline">
                    OFFLINE
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Neon line at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background: isOnline
              ? "linear-gradient(90deg, transparent, #00f3ff, transparent)"
              : "linear-gradient(90deg, transparent, #ff8800, transparent)",
            boxShadow: isOnline ? "0 0 10px #00f3ff" : "0 0 10px #ff8800",
          }}
        />
      </motion.header>

      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-14 left-0 right-0 z-40 out-of-sync-banner border-b border-[#ff8800]/50 overflow-hidden"
          >
            <div className="flex items-center justify-center gap-3 px-4 py-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 text-[#ff8800]" />
              </motion.div>

              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  className="text-[#ff8800] text-xs lg:text-sm font-bold tracking-widest"
                >
                  OUT OF SYNC
                </motion.span>
                <span className="text-[#ff8800]/70 text-xs tracking-wider hidden sm:inline">
                  — Changes saved locally
                </span>
              </div>

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <AlertTriangle className="w-4 h-4 text-[#ff8800]" />
              </motion.div>
            </div>

            {/* Animated warning stripe */}
            <div
              className="h-1 w-full"
              style={{
                background:
                  "repeating-linear-gradient(90deg, #ff8800 0px, #ff8800 10px, transparent 10px, transparent 20px)",
                backgroundSize: "200% 100%",
                animation: "warning-slide 20s linear infinite",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
