import { Loader2, Terminal } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-6 h-6 text-[#00f3ff] animate-pulse" />
                <span className="text-[#00f3ff] font-mono tracking-widest text-lg">SYSTEM_INITIALIZING</span>
            </div>

            <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 rounded-full border-4 border-[#1a1a1a] border-t-[#00f3ff] animate-spin" />

                {/* Inner ring */}
                <div className="absolute inset-0 w-10 h-10 m-auto rounded-full border-4 border-[#1a1a1a] border-b-[#00ff88] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>

            <p className="text-[#444] text-xs tracking-[0.2em] animate-pulse mt-4">ESTABLISHING SECURE CONNECTION...</p>
        </div>
    )
}
