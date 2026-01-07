"use client"

import { motion } from "framer-motion"
import { QuestCard } from "./quest-card"
import type { Quest, QuestStatus } from "@/lib/types"

interface QuestGridProps {
  title: string
  quests: Quest[]
  onStatusChange: (id: string, status: QuestStatus, isRecurringReset?: boolean) => void
  onDelete: (id: string) => void
  onEdit?: (quest: Quest) => void
  variant?: "default" | "danger" | "urgent" | "muted"
}

export function QuestGrid({ title, quests, onStatusChange, onDelete, onEdit, variant = "default" }: QuestGridProps) {
  // Simplified container - no stagger to prevent visibility issues with dynamic items
  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
    },
  }

  // Don't render section if no quests
  if (quests.length === 0) return null

  const titleColor = {
    default: "#00f3ff",
    danger: "#ff003c",
    urgent: "#ffcc00",
    muted: "#666",
  }[variant]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className={`text-lg lg:text-xl font-bold tracking-widest ${variant === "danger" ? "glitch-text" : ""}`}
          style={{ color: titleColor }}
        >
          {title}
        </h2>
        <span className="text-[#666] text-xs tracking-wider">[{quests.length}] MISSIONS</span>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </motion.div>
    </div>
  )
}
