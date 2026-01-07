"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, ExternalLink, Trash2, Skull, RefreshCcw, Edit2 } from "lucide-react"
import { StatusToggle } from "./status-toggle"
import type { Quest, QuestStatus } from "@/lib/types"

interface QuestCardProps {
  quest: Quest
  onStatusChange: (id: string, status: QuestStatus, isRecurringReset?: boolean) => void
  onDelete: (id: string) => void
  onEdit?: (quest: Quest) => void
}

export function QuestCard({ quest, onStatusChange, onDelete, onEdit }: QuestCardProps) {
  // Initialize with null to avoid hydration mismatch - will calculate on client
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calculateTimeLeft> | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Calculate time on client mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    setTimeLeft(calculateTimeLeft(quest.deadline))

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(quest.deadline))
    }, 1000)
    return () => clearInterval(timer)
  }, [quest.deadline])

  // Use safe defaults before client mount
  const safeTimeLeft = timeLeft ?? { days: 0, hours: 0, minutes: 0, totalHours: 999 }

  const isBossFight = quest.status !== "COMPLETED" && safeTimeLeft.totalHours < 24 && safeTimeLeft.totalHours > 0
  const isOverdue = safeTimeLeft.totalHours <= 0 && quest.status !== "COMPLETED"
  const isCompleted = quest.status === "COMPLETED"
  const isRecurring = quest.frequency !== "SINGLE"

  const handleStatusChange = (status: QuestStatus) => {
    if (status === "COMPLETED" && isRecurring) {
      // Show success animation first
      onStatusChange(quest.id, "COMPLETED")

      // Then trigger reset animation after a brief delay
      setTimeout(() => {
        setIsResetting(true)
        setTimeout(() => {
          setIsResetting(false)
          onStatusChange(quest.id, "NOT_STARTED", true) // Pass flag to indicate recurring reset
        }, 800)
      }, 600)
    } else {
      onStatusChange(quest.id, status)
    }
  }

  // Animation variant - start fully visible to avoid invisible cards on dynamic add
  const item = {
    hidden: { y: 0, opacity: 1 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.02 }}
      className={`glass rounded-lg border relative overflow-hidden transition-all duration-300 ${isResetting
        ? "border-[#00f3ff] animate-pulse"
        : isBossFight
          ? "boss-mode-card boss-glitch-bg pulse-danger border-[#ff003c]"
          : isCompleted
            ? "border-[#00ff88] opacity-80"
            : "border-[#1a1a1a] hover:border-[#00f3ff]"
        }`}
      style={{
        boxShadow: isResetting
          ? "0 0 40px rgba(0, 243, 255, 0.6), inset 0 0 30px rgba(0, 243, 255, 0.2)"
          : isCompleted
            ? "0 0 20px rgba(0, 255, 136, 0.2)"
            : isBossFight
              ? "0 0 40px rgba(255, 0, 60, 0.5), inset 0 0 80px rgba(255, 0, 60, 0.15)"
              : "0 0 20px rgba(0, 243, 255, 0.1)",
      }}
    >
      <AnimatePresence>
        {isResetting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#050505]/90"
          >
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [0, 360] }}
              className="flex flex-col items-center gap-2"
            >
              <RefreshCcw className="w-8 h-8 text-[#00f3ff] drop-shadow-[0_0_15px_#00f3ff]" />
              <motion.span
                className="text-[#00f3ff] text-xs font-bold tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
              >
                SYSTEM RESET
              </motion.span>
            </motion.div>
            {/* Glitch lines */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[2px] bg-[#00f3ff] opacity-50"
                style={{ top: `${20 + i * 15}%`, left: 0, right: 0 }}
                initial={{ scaleX: 0, x: "-100%" }}
                animate={{ scaleX: [0, 1, 0], x: ["-100%", "0%", "100%"] }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner accents */}
      <div
        className="absolute top-0 left-0 w-3 h-3 border-t border-l z-10"
        style={{
          borderColor: isBossFight ? "#ff003c" : isCompleted ? "#00ff88" : "#00f3ff",
        }}
      />
      <div
        className="absolute top-0 right-0 w-3 h-3 border-t border-r z-10"
        style={{
          borderColor: isBossFight ? "#ff003c" : isCompleted ? "#00ff88" : "#00f3ff",
        }}
      />
      {isBossFight && (
        <>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l z-10 border-[#ff003c]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r z-10 border-[#ff003c]" />
        </>
      )}

      <div className="p-4 space-y-4 relative z-10">
        {isBossFight && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-2 text-[#ff003c] bg-[#ff003c]/25 px-3 py-2 rounded border border-[#ff003c]/70"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: [0, -15, 15, -15, 0],
                  scale: [1, 1.2, 1, 1.2, 1],
                }}
                transition={{ duration: 0.4, repeat: Number.POSITIVE_INFINITY, repeatDelay: 0.5 }}
              >
                <Skull className="w-5 h-5" />
              </motion.div>
              <motion.span
                className="text-xs font-bold tracking-wider"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY }}
              >
                BOSS FIGHT MODE
              </motion.span>
            </div>
            <motion.div
              animate={{ opacity: [1, 0.3, 1], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.2, repeat: Number.POSITIVE_INFINITY }}
            >
              <AlertTriangle className="w-4 h-4" />
            </motion.div>
          </motion.div>
        )}

        {/* Title with recurring indicator */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {isRecurring && (
              <motion.div
                animate={{
                  opacity: [0.6, 1, 0.6],
                  filter: [
                    "drop-shadow(0 0 4px #00f3ff)",
                    "drop-shadow(0 0 10px #00f3ff)",
                    "drop-shadow(0 0 4px #00f3ff)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                title={`Recurring: ${quest.frequency}`}
              >
                <RefreshCcw className="w-4 h-4 text-[#00f3ff]" />
              </motion.div>
            )}
            <h3
              className={`font-bold text-sm tracking-wider ${isBossFight
                ? "text-[#ff003c] glitch-text"
                : isCompleted
                  ? "text-[#00ff88] line-through opacity-70"
                  : "text-white"
                }`}
              style={isBossFight ? { textShadow: "0 0 10px rgba(255, 0, 60, 0.5)" } : undefined}
            >
              {quest.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit?.(quest)}
              className="text-[#666] hover:text-[#00f3ff] transition-colors p-1"
              title="Edit Mission Intel"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(quest.id)} className="text-[#666] hover:text-[#ff003c] transition-colors p-1">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Toggle - use custom handler */}
        <StatusToggle status={quest.status} onChange={handleStatusChange} isBossFight={isBossFight} />

        {/* Deadline Ticker - Hide if completed */}
        {!isCompleted && (
          <div className="space-y-1">
            <p className="text-[#666] text-xs tracking-wider">DEADLINE</p>
            <div
              className={`font-mono text-lg tracking-widest ${isOverdue ? "text-[#ff003c]" : isBossFight ? "text-[#ff003c]" : "text-[#00f3ff]"
                }`}
              style={isBossFight ? { textShadow: "0 0 15px rgba(255, 0, 60, 0.8)" } : undefined}
            >
              {isOverdue ? (
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  OVERDUE
                </motion.span>
              ) : (
                <motion.span
                  animate={isBossFight ? { opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  {String(safeTimeLeft.days).padStart(2, "0")}:{String(safeTimeLeft.hours).padStart(2, "0")}:
                  {String(safeTimeLeft.minutes).padStart(2, "0")}
                </motion.span>
              )}
            </div>
            {isRecurring && (
              <motion.p
                className="text-[10px] text-[#00f3ff]/60 tracking-wider"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                {`// CYCLE: ${quest.frequency}`}
              </motion.p>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1">
          <p className="text-[#666] text-xs tracking-wider">INTEL</p>
          <p
            className={`text-xs line-clamp-2 p-2 rounded border ${isBossFight
              ? "text-[#ffaaaa] bg-[#ff003c]/15 border-[#ff003c]/40"
              : isCompleted
                ? "text-[#666] bg-[#0a0a0a] border-[#1a1a1a] opacity-70"
                : "text-[#999] bg-[#0a0a0a] border-[#1a1a1a]"
              }`}
          >
            {quest.notes}
          </p>
        </div>

        {/* Mission Intel Button */}
        <a
          href={quest.notion_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-xs tracking-wider transition-colors group ${isBossFight
            ? "text-[#ff003c] hover:text-[#ff6666]"
            : isCompleted
              ? "text-[#00ff88]/70 hover:text-[#00ff88]"
              : "text-[#00f3ff] hover:text-[#00ff88]"
            }`}
        >
          <ExternalLink className="w-3 h-3" />
          <span className="border-b border-dashed border-current group-hover:border-solid">OPEN MISSION INTEL</span>
        </a>
      </div>

      {/* Bottom neon line */}
      <div
        className="h-[2px] w-full relative z-10"
        style={{
          background: isBossFight
            ? "linear-gradient(90deg, transparent, #ff003c, transparent)"
            : isCompleted
              ? "linear-gradient(90deg, transparent, #00ff88, transparent)"
              : "linear-gradient(90deg, transparent, #00f3ff, transparent)",
          boxShadow: isBossFight ? "0 0 10px #ff003c" : undefined,
        }}
      />
    </motion.div>
  )
}

function calculateTimeLeft(deadline: string | Date) {
  const now = new Date().getTime()
  const target = new Date(deadline).getTime()
  const diff = target - now

  const totalHours = diff / (1000 * 60 * 60)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return { days, hours, minutes, totalHours }
}
