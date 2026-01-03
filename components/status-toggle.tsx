"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Circle, Clock, Check, ChevronRight } from "lucide-react"
import type { QuestStatus } from "@/lib/types"

interface StatusToggleProps {
  status: QuestStatus
  onChange: (status: QuestStatus) => void
  isBossFight?: boolean
}

const statusConfig = {
  NOT_STARTED: {
    label: "NOT DONE",
    shortLabel: "NOT",
    icon: Circle,
    color: "#666",
    activeColor: "#00f3ff",
    bgColor: "rgba(0, 243, 255, 0.1)",
    glowColor: "rgba(0, 243, 255, 0.3)",
    index: 0,
  },
  IN_PROGRESS: {
    label: "PARTIALLY DONE",
    shortLabel: "PARTIAL",
    icon: Clock,
    color: "#ffcc00",
    activeColor: "#ffcc00",
    bgColor: "rgba(255, 204, 0, 0.15)",
    glowColor: "rgba(255, 204, 0, 0.4)",
    index: 1,
  },
  COMPLETED: {
    label: "DONE",
    shortLabel: "DONE",
    icon: Check,
    color: "#00ff88",
    activeColor: "#00ff88",
    bgColor: "rgba(0, 255, 136, 0.15)",
    glowColor: "rgba(0, 255, 136, 0.4)",
    index: 2,
  },
}

const statusOrder: QuestStatus[] = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]

export function StatusToggle({ status, onChange, isBossFight }: StatusToggleProps) {
  const [showPowerUp, setShowPowerUp] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<"forward" | "backward">("forward")
  const config = statusConfig[status]
  const Icon = config.icon

  const cycleStatus = () => {
    const currentIndex = statusOrder.indexOf(status)
    const nextIndex = (currentIndex + 1) % statusOrder.length
    setTransitionDirection(nextIndex > currentIndex || (currentIndex === 2 && nextIndex === 0) ? "forward" : "backward")
    setShowPowerUp(true)
    setTimeout(() => setShowPowerUp(false), 600)
    onChange(statusOrder[nextIndex])
  }

  const displayColor = isBossFight && status !== "COMPLETED" ? "#ff003c" : config.activeColor
  const displayBgColor = isBossFight && status !== "COMPLETED" ? "rgba(255, 0, 60, 0.15)" : config.bgColor

  return (
    <div className="relative space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        {statusOrder.map((s, idx) => {
          const sConfig = statusConfig[s]
          const isActive = statusOrder.indexOf(status) >= idx
          const isCurrent = status === s
          const barColor = isBossFight && status !== "COMPLETED" && isActive ? "#ff003c" : sConfig.activeColor

          return (
            <motion.div
              key={s}
              className="flex-1 h-2 rounded-full relative overflow-hidden"
              style={{
                backgroundColor: isActive ? barColor : "#1a1a1a",
                boxShadow: isCurrent ? `0 0 12px ${barColor}` : "none",
              }}
              animate={
                isCurrent
                  ? {
                      opacity: [1, 0.6, 1],
                      boxShadow: [`0 0 8px ${barColor}`, `0 0 16px ${barColor}`, `0 0 8px ${barColor}`],
                    }
                  : { opacity: 1 }
              }
              transition={{ duration: 1, repeat: isCurrent ? Number.POSITIVE_INFINITY : 0 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      <motion.button
        onClick={cycleStatus}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.01 }}
        className="w-full flex items-center justify-between gap-2 px-3 py-3 rounded border transition-all duration-300"
        style={{
          borderColor: displayColor,
          backgroundColor: displayBgColor,
          boxShadow: `0 0 20px ${config.glowColor}`,
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            key={status}
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              ...(status === "IN_PROGRESS"
                ? {
                    rotate: [0, 360],
                  }
                : {}),
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              ...(status === "IN_PROGRESS" ? { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" } : {}),
            }}
            className="relative"
          >
            <Icon className="w-5 h-5" style={{ color: displayColor }} />
            {status === "COMPLETED" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.8, 1.5],
                  opacity: [0.8, 0, 0.3],
                }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: config.activeColor }}
              />
            )}
          </motion.div>

          <div className="flex flex-col items-start">
            <motion.span
              key={status}
              initial={{ y: transitionDirection === "forward" ? 10 : -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xs font-bold tracking-wider"
              style={{ color: displayColor }}
            >
              {config.label}
            </motion.span>
            <motion.span
              className="text-[10px] text-[#666] tracking-wider"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              CLICK TO CYCLE STATUS
            </motion.span>
          </div>
        </div>

        <motion.div
          className="flex items-center gap-1"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronRight className="w-4 h-4" style={{ color: displayColor }} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showPowerUp && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 rounded pointer-events-none"
              style={{
                border: `2px solid ${config.activeColor}`,
                boxShadow: `0 0 40px ${config.activeColor}`,
              }}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="absolute inset-0 rounded pointer-events-none"
              style={{
                border: `1px solid ${config.activeColor}`,
              }}
            />
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded pointer-events-none"
              style={{ backgroundColor: config.activeColor }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
