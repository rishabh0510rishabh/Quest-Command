"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Shield, Sword, Trophy, Zap } from "lucide-react"

interface ProfileStatsProps {
  completedQuests: number
  activeQuests: number
  totalQuests: number
  xp: number
  level: number
}

export function ProfileStats({ completedQuests, activeQuests, totalQuests, xp, level }: ProfileStatsProps) {
  const xpProgress = ((xp % 3) / 3) * 100

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="lg:w-72 shrink-0"
    >
      <div className="glass rounded-lg border border-[#1a1a1a] p-4 space-y-6 relative overflow-hidden">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff]" />

        {/* Header */}
        <div className="text-center">
          <h2 className="text-[#00f3ff] text-xs tracking-[0.3em] mb-2">OPERATOR PROFILE</h2>
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#00f3ff] flex items-center justify-center bg-[#0a0a0a]">
            <Shield className="w-8 h-8 text-[#00f3ff]" />
          </div>
          <p className="text-white mt-2 font-bold">AGENT_X7</p>
          <p className="text-[#666] text-xs">CLEARANCE: ALPHA</p>
        </div>

        {/* Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#666] text-xs tracking-wider">LEVEL</span>
            <span className="text-[#00ff88] font-bold text-lg">{level}</span>
          </div>
          <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #00f3ff, #00ff88)",
                boxShadow: "0 0 10px #00f3ff",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-[#666] text-xs text-right">{xp % 3}/3 XP TO NEXT LEVEL</p>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <StatItem
            icon={<Trophy className="w-4 h-4" />}
            label="QUESTS COMPLETED"
            value={completedQuests}
            color="#00ff88"
          />
          <StatItem icon={<Sword className="w-4 h-4" />} label="ACTIVE BOUNTIES" value={activeQuests} color="#00f3ff" />
          <StatItem icon={<Zap className="w-4 h-4" />} label="TOTAL MISSIONS" value={totalQuests} color="#ffcc00" />
        </div>

        {/* Decorative line */}
        <div
          className="h-[1px] w-full"
          style={{
            background: "linear-gradient(90deg, transparent, #00f3ff, transparent)",
          }}
        />

        {/* Status */}
        <div className="text-center">
          <p className="text-[#666] text-xs tracking-wider mb-1">SYSTEM STATUS</p>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[#00ff88] text-xs tracking-wider">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}

function StatItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded border border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-[#999] text-xs tracking-wider">{label}</span>
      </div>
      <span style={{ color }} className="font-bold text-lg">
        {value}
      </span>
    </div>
  )
}
