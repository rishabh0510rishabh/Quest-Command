

export function CyberpunkBackground() {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505] min-h-[100dvh]">
            {/* Static Mobile Gradient (Replaces Image & Fingerprint) */}
            <div
                className="absolute inset-0 md:hidden"
                style={{
                    background: "radial-gradient(circle at center, #1a1a1a 0%, #050505 100%)"
                }}
            />

            {/* Desktop Background Image */}
            <div
                className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat hidden md:block"
                style={{
                    backgroundImage: `url('/bg-cyberpunk.png')`,
                }}
            />
            <div className="absolute inset-0 bg-black/50" />

            {/* Animated Grid Overlay - Hidden on mobile */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none hidden md:block"
                style={{
                    backgroundImage: `
              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
            `,
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Scanline Effect - REMOVED */}
            <div className="absolute inset-0 pointer-events-none opacity-50 hidden md:block" />
        </div>
    )
}
