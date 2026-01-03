"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Crosshair, Zap, Calendar, CalendarDays, CalendarRange } from "lucide-react"
import type { Quest, QuestFrequency } from "@/lib/types"

interface NewQuestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (quest: Omit<Quest, "id" | "user_id" | "created_at" | "status">) => void
}

const frequencyOptions: { value: QuestFrequency; label: string; icon: React.ElementType }[] = [
  { value: "SINGLE", label: "SINGLE RUN", icon: Zap },
  { value: "DAILY", label: "DAILY GRIND", icon: Calendar },
  { value: "WEEKLY", label: "WEEKLY RAID", icon: CalendarDays },
  { value: "MONTHLY", label: "MONTHLY RESET", icon: CalendarRange },
]

export function NewQuestModal({ isOpen, onClose, onSubmit }: NewQuestModalProps) {
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [notionUrl, setNotionUrl] = useState("")
  const [deadline, setDeadline] = useState("")
  const [frequency, setFrequency] = useState<QuestFrequency>("SINGLE")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !deadline) return

    onSubmit({
      title: title.toUpperCase(),
      notes,
      notion_url: notionUrl || "https://notion.so",
      deadline: new Date(deadline).toISOString(),
      frequency,
    })

    setTitle("")
    setNotes("")
    setNotionUrl("")
    setDeadline("")
    setFrequency("SINGLE")
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="glass rounded-lg border border-[#00f3ff] relative overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00f3ff]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00f3ff]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00f3ff]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00f3ff]" />

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-[#00f3ff]" />
                  <h2 className="text-[#00f3ff] font-bold tracking-widest">NEW QUEST INITIALIZATION</h2>
                </div>
                <button onClick={onClose} className="text-[#666] hover:text-[#ff003c] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-[#666] text-xs tracking-wider">MISSION TITLE</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ENTER QUEST NAME..."
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-3 py-2 text-white text-sm focus:border-[#00f3ff] focus:outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all placeholder:text-[#444]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[#666] text-xs tracking-wider">DEADLINE</label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-3 py-2 text-white text-sm focus:border-[#00f3ff] focus:outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all [color-scheme:dark]"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[#666] text-xs tracking-wider">{"// CYCLE PROTOCOL"}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {frequencyOptions.map((option) => {
                      const Icon = option.icon
                      const isSelected = frequency === option.value
                      return (
                        <motion.button
                          key={option.value}
                          type="button"
                          onClick={() => setFrequency(option.value)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative flex items-center gap-2 px-3 py-2.5 rounded border text-xs font-bold tracking-wider transition-all duration-300 overflow-hidden ${isSelected
                            ? "border-[#00f3ff] bg-[#00f3ff]/10 text-[#00f3ff]"
                            : "border-[#1a1a1a] bg-[#0a0a0a] text-[#666] hover:border-[#333] hover:text-[#999]"
                            }`}
                          style={{
                            boxShadow: isSelected
                              ? "0 0 20px rgba(0, 243, 255, 0.3), inset 0 0 20px rgba(0, 243, 255, 0.1)"
                              : "none",
                          }}
                        >
                          {/* Glow effect when selected */}
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00f3ff]/20 to-transparent"
                              animate={{ x: ["-100%", "100%"] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 1 }}
                            />
                          )}
                          <Icon
                            className={`w-4 h-4 relative z-10 ${isSelected ? "drop-shadow-[0_0_8px_#00f3ff]" : ""}`}
                          />
                          <span className="relative z-10">{option.label}</span>
                          {/* Corner accents for selected */}
                          {isSelected && (
                            <>
                              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f3ff]" />
                              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00f3ff]" />
                              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00f3ff]" />
                              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f3ff]" />
                            </>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Helper text for recurring options */}
                  <AnimatePresence>
                    {frequency !== "SINGLE" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="overflow-hidden"
                      >
                        <motion.p
                          className="text-[10px] text-[#00f3ff]/70 tracking-wider px-2 py-1.5 bg-[#00f3ff]/5 rounded border border-[#00f3ff]/20"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          {"// AUTO-RESET ENABLED: Quest resets upon completion or cycle end."}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <label className="text-[#666] text-xs tracking-wider">NOTION URL (OPTIONAL)</label>
                  <input
                    type="url"
                    value={notionUrl}
                    onChange={(e) => setNotionUrl(e.target.value)}
                    placeholder="https://notion.so/..."
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-3 py-2 text-white text-sm focus:border-[#00f3ff] focus:outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all placeholder:text-[#444]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[#666] text-xs tracking-wider">MISSION INTEL</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter mission details..."
                    rows={3}
                    className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded px-3 py-2 text-white text-sm focus:border-[#00f3ff] focus:outline-none focus:ring-1 focus:ring-[#00f3ff] transition-all resize-none placeholder:text-[#444]"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded font-bold text-sm tracking-widest transition-all"
                  style={{
                    background: "linear-gradient(135deg, #00f3ff, #00ff88)",
                    color: "#050505",
                    boxShadow: "0 0 20px rgba(0, 243, 255, 0.3)",
                  }}
                >
                  DEPLOY QUEST
                </motion.button>
              </form>

              {/* Bottom neon line */}
              <div
                className="h-[1px] w-full"
                style={{
                  background: "linear-gradient(90deg, transparent, #00f3ff, transparent)",
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
