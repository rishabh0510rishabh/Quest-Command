"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Lock, Mail, AlertTriangle, Loader2, Terminal, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!isLogin) {
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
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push("/dashboard")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
        router.push(`/auth/sign-up-success?email=${encodeURIComponent(email)}`)
      }
    } catch (error: any) {
      if (!isLogin && (error.message?.includes("already registered") || error.code === 'user_already_exists')) {
        setError("ACCOUNT ALREADY EXISTS - PLEASE LOGIN")
      } else {
        setError(error instanceof Error ? error.message : isLogin ? "ACCESS DENIED" : "REGISTRATION FAILED")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setRepeatPassword("")
    setError(null)
  }

  const toggleMode = () => {
    resetForm()
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#050505]">
      <div className="w-full max-w-md">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 px-2">
          {isLogin ? (
            <Terminal className="w-4 h-4 text-[#00f3ff]" />
          ) : (
            <UserPlus className="w-4 h-4 text-[#00ff88]" />
          )}
          <span className={`text-xs font-mono tracking-wider ${isLogin ? 'text-[#00f3ff]' : 'text-[#00ff88]'}`}>
            GATEKEEPER_AUTH://{isLogin ? 'LOGIN' : 'REGISTER'}
          </span>
        </div>

        {/* Main card */}
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
          {/* Top accent line */}
          <div className={`h-[2px] bg-gradient-to-r ${isLogin ? 'from-[#00f3ff] via-[#00ff88] to-[#00f3ff]' : 'from-[#00ff88] via-[#00f3ff] to-[#00ff88]'}`} />

          {/* Tab switcher */}
          <div className="flex border-b border-[#1a1a1a]">
            <button
              type="button"
              onClick={() => { if (!isLogin) toggleMode() }}
              className={`flex-1 py-3 text-sm font-bold tracking-wider ${isLogin ? 'text-[#00f3ff] bg-[#00f3ff]/5 border-b-2 border-[#00f3ff]' : 'text-[#666] hover:text-[#888]'}`}
            >
              LOGIN
            </button>
            <button
              type="button"
              onClick={() => { if (isLogin) toggleMode() }}
              className={`flex-1 py-3 text-sm font-bold tracking-wider ${!isLogin ? 'text-[#00ff88] bg-[#00ff88]/5 border-b-2 border-[#00ff88]' : 'text-[#666] hover:text-[#888]'}`}
            >
              REGISTER
            </button>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={`text-2xl font-bold mb-2 tracking-wider ${isLogin ? 'text-[#00f3ff]' : 'text-[#00ff88]'}`}>
                {isLogin ? 'ACCESS TERMINAL' : 'NEW OPERATIVE'}
              </h1>
              <p className="text-[#666] text-sm tracking-wide">
                {isLogin ? 'IDENTITY VERIFICATION REQUIRED' : 'IDENTITY CREATION PROTOCOL'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div className="space-y-2">
                <label className={`text-xs tracking-widest flex items-center gap-2 uppercase ${isLogin ? 'text-[#00f3ff]' : 'text-[#00ff88]'}`}>
                  <Mail className="w-3 h-3" />
                  Operator_ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="operator@system.net"
                  className={`w-full bg-[#000] border border-[#1a1a1a] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#444] focus:outline-none font-mono text-sm ${isLogin ? 'focus:border-[#00f3ff]' : 'focus:border-[#00ff88]'}`}
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className={`text-xs tracking-widest flex items-center gap-2 uppercase ${isLogin ? 'text-[#00f3ff]' : 'text-[#00ff88]'}`}>
                  <Lock className="w-3 h-3" />
                  Access_Key
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className={`w-full bg-[#000] border border-[#1a1a1a] rounded px-4 py-3 text-[#e0e0e0] placeholder-[#444] focus:outline-none font-mono text-sm ${isLogin ? 'focus:border-[#00f3ff]' : 'focus:border-[#00ff88]'}`}
                />
              </div>

              {/* Repeat Password field (signup only) */}
              {!isLogin && (
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
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-[#ff003c]/10 border border-[#ff003c]/30 rounded">
                  <AlertTriangle className="w-4 h-4 text-[#ff003c] flex-shrink-0" />
                  <span className="text-[#ff003c] text-xs tracking-wide">{error}</span>
                </div>
              )}

              {/* Forgot Password Link */}
              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/auth/reset-password"
                    className="text-[#00f3ff]/70 text-[10px] hover:text-[#00f3ff] hover:underline tracking-wider transition-colors"
                  >
                    FORGOT_ACCESS_KEY?
                  </Link>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full border rounded py-3 font-bold text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${isLogin
                  ? 'bg-[#00f3ff]/10 border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff]/20'
                  : 'bg-[#00ff88]/10 border-[#00ff88] text-[#00ff88] hover:bg-[#00ff88]/20'
                  }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isLogin ? 'AUTHENTICATING...' : 'CREATING IDENTITY...'}</span>
                  </>
                ) : (
                  isLogin ? "INITIALIZE CONNECTION" : "REGISTER OPERATIVE"
                )}
              </button>
            </form>
          </div>

          {/* Bottom accent line */}
          <div className={`h-[2px] bg-gradient-to-r ${isLogin ? 'from-[#00f3ff] via-[#00ff88] to-[#00f3ff]' : 'from-[#00ff88] via-[#00f3ff] to-[#00ff88]'}`} />
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
