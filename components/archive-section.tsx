"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Archive, ChevronDown, ChevronUp, RotateCcw, Trash2, Check } from "lucide-react"
import type { Quest } from "@/lib/types"

interface ArchiveSectionProps {
  quests: Quest[]
  onRestore: (id: string) => void
  onDelete: (id: string) => void
}

export function ArchiveSection({ quests, onRestore, onDelete }: ArchiveSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (quests.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Archive Header - Always visible */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-4 p-4 rounded-lg border border-[#00ff88]/30 bg-[#00ff88]/5 hover:bg-[#00ff88]/10 transition-all duration-300"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isExpanded ? 0 : [0, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: isExpanded ? 0 : Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          >
            <Archive className="w-5 h-5 text-[#00ff88]" />
          </motion.div>
          <span className="text-[#00ff88] font-bold tracking-widest text-lg">ARCHIVE://COMPLETED_MISSIONS</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[#666] text-sm tracking-wider">[{quests.length}] ARCHIVED</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-[#00ff88]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#00ff88]" />
            )}
          </motion.div>
        </div>
      </motion.button>

      {/* Archive Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
              {quests.map((quest, index) => (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-lg border border-[#00ff88]/20 p-4 space-y-3 relative overflow-hidden opacity-70 hover:opacity-100 transition-opacity"
                >
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ff88]/50" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff88]/50" />

                  {/* Title with checkmark */}
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded bg-[#00ff88]/20">
                      <Check className="w-3 h-3 text-[#00ff88]" />
                    </div>
                    <h4 className="text-sm font-bold text-[#00ff88]/80 line-through tracking-wider flex-1">
                      {quest.title}
                    </h4>
                  </div>

                  {/* Notes preview */}
                  <p className="text-xs text-[#666] line-clamp-2 pl-6">{quest.notes}</p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                    <button
                      onClick={() => onRestore(quest.id)}
                      className="flex items-center gap-2 text-xs text-[#00f3ff] hover:text-[#00ff88] transition-colors group"
                    >
                      <RotateCcw className="w-3 h-3 group-hover:rotate-[-360deg] transition-transform duration-500" />
                      <span className="tracking-wider">RESTORE</span>
                    </button>
                    <button
                      onClick={() => onDelete(quest.id)}
                      className="flex items-center gap-2 text-xs text-[#666] hover:text-[#ff003c] transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span className="tracking-wider">DELETE</span>
                    </button>
                  </div>

                  {/* Bottom line */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[1px]"
                    style={{
                      background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
                      opacity: 0.3,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
