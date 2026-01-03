
"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Mail, AlertTriangle, Loader2, ArrowLeft, KeyRound } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ResetPasswordPage() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()
        setIsLoading(true)
        setError(null)
        setSuccess(false)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            })
            if (error) throw error
            setSuccess(true)
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "RESET REQUEST FAILED")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#050505]">
            <div className="w-full max-w-md">
                {/* Terminal header */}
                <div className="flex items-center gap-2 mb-4 px-2">
                    <KeyRound className="w-4 h-4 text-[#ff00ff]" />
                    <span className="text-[#ff00ff] text-xs font-mono tracking-wider">GATEKEEPER_AUTH://RESET_KEY</span>
                </div>

                {/* Main card */}
                <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
                    {/* Top accent line */}
                    <div className="h-[2px] bg-gradient-to-r from-[#ff00ff] via-[#bf00ff] to-[#ff00ff]" />

                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-[#ff00ff] mb-2 tracking-wider">
                                RESET ACCESS
                            </h1>
                            <p className="text-[#666] text-sm tracking-wide">KEY RECOVERY PROTOCOL</p>
                        </div>

                        {!success ? (
                            <form onSubmit={handleReset} className="space-y-5">
                                {/* Email field */}
                                <div className="space-y-2">
                                    <label className="text-[#ff00ff] text-xs tracking-widest flex items-center gap-2 uppercase">
                                        <Mail className="w-3 h-3" />
                                        Operator_ID
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="operator@system.net"
                                        className="w-full bg-[#000] border border-[#1a1a1a] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#444] focus:outline-none focus:border-[#ff00ff] font-mono text-sm"
                                    />
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-[#ff003c]/10 border border-[#ff003c]/30 rounded">
                                        <AlertTriangle className="w-4 h-4 text-[#ff003c] flex-shrink-0" />
                                        <span className="text-[#ff003c] text-xs tracking-wide">{error}</span>
                                    </div>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#ff00ff]/10 border border-[#ff00ff] text-[#ff00ff] rounded py-3 font-bold text-sm tracking-widest hover:bg-[#ff00ff]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>TRANSMITTING...</span>
                                        </>
                                    ) : (
                                        "SEND RECOVERY LINK"
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-full border border-[#00ff88] flex items-center justify-center mx-auto bg-[#00ff88]/10">
                                    <Mail className="w-8 h-8 text-[#00ff88]" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-[#00ff88] font-bold tracking-wider">TRANSMISSION COMPLETE</h3>
                                    <p className="text-[#888] text-xs leading-relaxed">
                                        Recovery instructions have been sent to {email}. Check your secure inbox to restore access.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-[#1a1a1a]" />
                            <div className="w-1 h-1 rounded-full bg-[#333]" />
                            <div className="flex-1 h-px bg-[#1a1a1a]" />
                        </div>

                        {/* Back to login */}
                        <div className="text-center">
                            <Link href="/" className="inline-flex items-center gap-2 text-[#666] text-sm hover:text-[#e0e0e0] transition-colors tracking-wide group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                RETURN TO TERMINAL
                            </Link>
                        </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-[2px] bg-gradient-to-r from-[#ff00ff] via-[#bf00ff] to-[#ff00ff]" />
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-center gap-2 mt-4 text-[#444] text-xs">
                    <div className="w-2 h-2 rounded-full bg-[#ff00ff]" />
                    <span>SYSTEM_STATUS: RECOVERY_MODE</span>
                </div>
            </div>
        </div>
    )
}
