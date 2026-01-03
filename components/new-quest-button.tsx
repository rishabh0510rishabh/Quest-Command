"use client"

import { motion } from "framer-motion"
import { Plus } from "lucide-react"

interface NewQuestButtonProps {
  onClick: () => void
}

export function NewQuestButton({ onClick }: NewQuestButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-sm tracking-wider transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #00f3ff, #00ff88)",
        color: "#050505",
        boxShadow: "0 0 20px rgba(0, 243, 255, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)",
      }}
    >
      <Plus className="w-5 h-5" />
      <span className="hidden sm:inline">INITIALIZE NEW QUEST</span>
      <span className="sm:hidden">NEW QUEST</span>
    </motion.button>
  )
}
