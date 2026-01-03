"use client"

import { useRef, useEffect, useState, Suspense } from "react"
import { motion } from "framer-motion"
import { Mail, CheckCircle, Terminal } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden scanlines">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 px-4">
          <Terminal className="w-5 h-5 text-[#00ff88]" />
          <span className="text-[#00ff88] text-sm font-mono tracking-wider">GATEKEEPER_AUTH://PENDING</span>
        </div>

        {/* Main card */}
        <div className="relative glass border border-[#1a1a1a] rounded-lg overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff88]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff88]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff88]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff88]" />

          <div className="p-8 text-center">
            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#00ff88] flex items-center justify-center relative">
                <CheckCircle className="w-10 h-10 text-[#00ff88]" />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
                  }}
                />
              </div>
            </motion.div>

            {/* Header */}
            <motion.h1
              className="text-2xl font-bold text-[#00ff88] mb-2 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              REGISTRATION COMPLETE
            </motion.h1>

            <motion.p
              className="text-[#666] text-sm mb-6 tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              VERIFICATION SEQUENCE INITIATED
            </motion.p>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Mail className="w-5 h-5 text-[#00f3ff]" />
                <span className="text-[#00f3ff] text-sm tracking-wider">CHECK_INBOX</span>
              </div>
              <p className="text-[#888] text-xs leading-relaxed">
                A verification link has been transmitted to {email ? <span className="text-[#00ff88]">{email}</span> : "your email address"}. Click the link to activate your
                operative credentials.
              </p>
            </motion.div>

            {/* Back to login */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#00f3ff] text-sm hover:underline tracking-wider"
            >
              RETURN_TO_TERMINAL
            </Link>
          </div>

          {/* Bottom neon line */}
          <div
            className="h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
            style={{ boxShadow: "0 0 10px #00ff88" }}
          />
        </div>
      </motion.div>
    </div>
  )
}

export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <SuccessContent />
    </Suspense>
  )
}
