"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Save, Loader2, Shield } from "lucide-react"
import type { Profile } from "@/lib/types"

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: Partial<Profile>) => Promise<void>
    profile: Profile
    stats?: {
        completed: number
        streak: number
        nightOwl: boolean
    }
}

const BADGES = [
    { id: "NOVICE", label: "NOVICE_AGENT", icon: "🔰", description: "Complete 1 Mission", condition: (stats: any) => stats.completed >= 1 },
    { id: "PRO", label: "PRO_OPERATIVE", icon: "⭐", description: "Complete 10 Missions", condition: (stats: any) => stats.completed >= 10 },
    { id: "ELITE", label: "ELITE_UNIT", icon: "👑", description: "Complete 50 Missions", condition: (stats: any) => stats.completed >= 50 },
    { id: "STREAK_3", label: "CONSISTENCY", icon: "🔥", description: "3 Day Login Streak", condition: (stats: any) => stats.streak >= 3 },
    { id: "STREAK_7", label: "UNSTOPPABLE", icon: "⚡", description: "7 Day Login Streak", condition: (stats: any) => stats.streak >= 7 },
    { id: "NIGHT_OWL", label: "NIGHT_OWL", icon: "🦉", description: "Mission after 10PM", condition: (stats: any) => stats.nightOwl },
]

export function SettingsModal({ isOpen, onClose, onSubmit, profile, stats = { completed: 0, streak: 0, nightOwl: false } }: SettingsModalProps) {
    const [activeTab, setActiveTab] = useState("PROFILE")
    const [displayName, setDisplayName] = useState(profile.display_name)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        await onSubmit({ display_name: displayName })
        setIsLoading(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl"
                    >
                        {/* Header Accent */}
                        <div className="h-[2px] bg-gradient-to-r from-[#00f3ff] via-[#00ff88] to-[#00f3ff]" />

                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-[#00f3ff] text-lg font-bold tracking-wider">SYSTEM_SETTINGS</h2>
                                <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-4 border-b border-[#1a1a1a]">
                                <button
                                    onClick={() => setActiveTab("PROFILE")}
                                    className={`pb-2 text-xs tracking-wider transition-colors ${activeTab === "PROFILE" ? "text-[#00f3ff] border-b border-[#00f3ff]" : "text-gray-500"}`}
                                >
                                    PROFILE
                                </button>
                                <button
                                    onClick={() => setActiveTab("BADGES")}
                                    className={`pb-2 text-xs tracking-wider transition-colors ${activeTab === "BADGES" ? "text-yellow-400 border-b border-yellow-400" : "text-gray-500"}`}
                                >
                                    BADGES
                                </button>
                            </div>

                            {activeTab === "PROFILE" ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs text-[#666] uppercase tracking-widest">Codename_Display</label>
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f3ff] to-[#00ff88] rounded opacity-20 group-hover:opacity-40 transition duration-500" />
                                            <div className="relative flex items-center bg-[#050505] rounded border border-[#1a1a1a]">
                                                <User className="w-4 h-4 text-[#666] ml-3" />
                                                <input
                                                    type="text"
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    className="w-full bg-transparent border-none text-[#e0e0e0] placeholder-[#333] focus:ring-0 text-sm py-2 px-3 tracking-wider font-mono"
                                                    placeholder="ENTER_CODENAME"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs text-[#666] uppercase tracking-widest">Clearance_Level</label>
                                        <div className="p-3 bg-[#050505] border border-[#1a1a1a] rounded flex items-center justify-between">
                                            <span className="text-sm text-[#00ff88] font-mono">LEVEL {profile.level}</span>
                                            <span className="text-xs text-[#666]">{profile.xp} XP</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-xs text-[#666] hover:text-white transition-colors tracking-wider"
                                        >
                                            CANCEL
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-2 bg-[#00f3ff]/10 border border-[#00f3ff]/50 text-[#00f3ff] text-xs font-bold tracking-widest hover:bg-[#00f3ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? "SAVING..." : "SAVE_CHANGES"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {BADGES.map((badge) => {
                                        const isUnlocked = badge.condition(stats)
                                        return (
                                            <div
                                                key={badge.id}
                                                className={`flex flex-col items-center justify-center p-3 rounded border ${isUnlocked ? "border-yellow-500/50 bg-yellow-500/10" : "border-[#1a1a1a] bg-[#050505] opacity-50 grayscale"} transition-all`}
                                            >
                                                <span className="text-2xl mb-2">{badge.icon}</span>
                                                <span className={`text-[10px] tracking-widest font-bold ${isUnlocked ? "text-yellow-400" : "text-gray-600"}`}>{badge.label}</span>
                                                <span className="text-[9px] text-gray-500 text-center mt-1">{badge.description}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Bottom accent */}
                        <div className="h-[2px] bg-gradient-to-r from-[#00f3ff] via-[#00ff88] to-[#00f3ff]" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
