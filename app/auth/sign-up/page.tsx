"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Lock, Mail, AlertTriangle, Loader2, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("ACCESS_KEY MISMATCH - VERIFICATION FAILED")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("ACCESS_KEY TOO WEAK - MINIMUM 6 CHARACTERS")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "REGISTRATION FAILED")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#050505]">
      <div className="w-full max-w-md">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 px-2">
          <UserPlus className="w-4 h-4 text-[#00ff88]" />
          <span className="text-[#00ff88] text-xs font-mono tracking-wider">GATEKEEPER_AUTH://REGISTER</span>
        </div>

        {/* Main card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
          {/* Top accent line */}
          <div className="h-[2px] bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#00ff88]" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#00ff88] mb-2 tracking-wider">
                NEW OPERATIVE
              </h1>
              <p className="text-[#666] text-sm tracking-wide">IDENTITY CREATION PROTOCOL</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-[#00ff88] text-xs tracking-widest flex items-center gap-2 uppercase">
                  <Mail className="w-3 h-3" />
                  Operator_ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="operator@system.net"
                  className="w-full bg-[#000] border border-[#1a1a1a] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#444] focus:outline-none focus:border-[#00ff88] font-mono text-sm"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-[#00ff88] text-xs tracking-widest flex items-center gap-2 uppercase">
                  <Lock className="w-3 h-3" />
                  Access_Key
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#000] border border-[#1a1a1a] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#444] focus:outline-none focus:border-[#00ff88] font-mono text-sm"
                />
              </div>

              {/* Repeat Password field */}
              <div className="space-y-2">
                <label className="text-[#00ff88] text-xs tracking-widest flex items-center gap-2 uppercase">
                  <Lock className="w-3 h-3" />
                  Verify_Access_Key
                </label>
                <input
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-[#000] border border-[#1a1a1a] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#444] focus:outline-none focus:border-[#00ff88] font-mono text-sm"
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
                className="w-full bg-[#00ff88]/10 border border-[#00ff88] text-[#00ff88] rounded py-3 font-bold text-sm tracking-widest hover:bg-[#00ff88]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CREATING IDENTITY...</span>
                  </>
                ) : (
                  "REGISTER OPERATIVE"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#1a1a1a]" />
              <span className="text-[#444] text-xs">OR</span>
              <div className="flex-1 h-px bg-[#1a1a1a]" />
            </div>

            {/* Login link */}
            <div className="text-center">
              <span className="text-[#666] text-sm">EXISTING OPERATIVE? </span>
              <Link href="/auth/login" className="text-[#00f3ff] text-sm hover:underline tracking-wider">
                ACCESS_TERMINAL
              </Link>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="h-[2px] bg-gradient-to-r from-[#00ff88] via-[#00f3ff] to-[#00ff88]" />
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 text-[#444] text-xs">
          <div className="w-2 h-2 rounded-full bg-[#00ff88]" />
          <span>SYSTEM_STATUS: OPERATIONAL</span>
        </div>
      </div>
    </div>
  )
}
