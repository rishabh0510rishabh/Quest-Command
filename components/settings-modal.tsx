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
}

export function SettingsModal({ isOpen, onClose, onSubmit, profile }: SettingsModalProps) {
    const [displayName, setDisplayName] = useState(profile.display_name)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await onSubmit({ display_name: displayName })
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
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
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl"
                    >
                        {/* Top accent */}
                        <div className="h-[2px] bg-gradient-to-r from-[#00f3ff] via-[#00ff88] to-[#00f3ff]" />

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-[#00f3ff]" />
                                    <h2 className="text-[#00f3ff] text-lg font-bold tracking-wider">OPERATIVE_SETTINGS</h2>
                                </div>
                                <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[#00ff88] text-xs tracking-widest flex items-center gap-2 uppercase">
                                        <Shield className="w-3 h-3" />
                                        Codename (Display Name)
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-[#050505] border border-[#1a1a1a] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#444] focus:outline-none focus:border-[#00ff88] font-mono text-sm"
                                        placeholder="ENTER_CODENAME"
                                        required
                                    />
                                </div>

                                <div className="bg-[#1a1a1a]/50 p-4 rounded border border-[#1a1a1a]">
                                    <h3 className="text-[#666] text-xs tracking-widest mb-2">CLEARANCE_LEVEL</h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[#00f3ff] font-bold text-sm">LEVEL {profile.level}</span>
                                        <span className="text-[#444] text-xs font-mono">{profile.xp} XP</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#00f3ff]/10 border border-[#00f3ff] text-[#00f3ff] rounded py-3 font-bold text-sm tracking-widest hover:bg-[#00f3ff]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>UPDATING_RECORDS...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>SAVE_CHANGES</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Bottom accent */}
                        <div className="h-[2px] bg-gradient-to-r from-[#00f3ff] via-[#00ff88] to-[#00f3ff]" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
