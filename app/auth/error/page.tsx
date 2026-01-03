"use client"
import { AlertTriangle, Terminal } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden scanlines">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 0, 60, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 0, 60, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-4 px-4">
          <Terminal className="w-5 h-5 text-[#ff003c]" />
          <span className="text-[#ff003c] text-sm font-mono tracking-wider flicker">GATEKEEPER_AUTH://ERROR</span>
        </div>

        {/* Main card */}
        <div className="relative glass border border-[#ff003c]/50 rounded-lg overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff003c]" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff003c]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff003c]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff003c]" />

          <div className="p-8 text-center">
            {/* Error icon */}
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto rounded-full border-2 border-[#ff003c] flex items-center justify-center relative pulse-danger">
                <AlertTriangle className="w-10 h-10 text-[#ff003c]" />
              </div>
            </div>

            {/* Header */}
            <h1 className="text-2xl font-bold text-[#ff003c] mb-2 tracking-wider glitch-text">SYSTEM ERROR</h1>

            <p className="text-[#666] text-sm mb-6 tracking-wide">AUTHENTICATION PROTOCOL FAILED</p>

            {/* Error message */}
            <div className="bg-[#ff003c]/10 border border-[#ff003c]/30 rounded p-4 mb-6">
              <p className="text-[#ff003c] text-xs font-mono">ERROR_CODE: {error || "UNKNOWN_ERROR"}</p>
            </div>

            {/* Back to login */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#00f3ff] text-sm hover:underline tracking-wider"
            >
              RETRY_CONNECTION
            </Link>
          </div>

          {/* Bottom neon line */}
          <div
            className="h-[2px] bg-gradient-to-r from-transparent via-[#ff003c] to-transparent"
            style={{ boxShadow: "0 0 10px #ff003c" }}
          />
        </div>
      </div>
    </div>
  )
}
