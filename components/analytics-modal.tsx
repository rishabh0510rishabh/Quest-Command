"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BarChart3, PieChart, Activity } from "lucide-react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts"
import type { Quest } from "@/lib/types"

interface AnalyticsModalProps {
    isOpen: boolean
    onClose: () => void
    quests: Quest[]
}

const COLORS = ["#00f3ff", "#00ff88", "#ff003c", "#ffcc00"]

export function AnalyticsModal({ isOpen, onClose, quests }: AnalyticsModalProps) {
    // 1. Workload (Quests by Deadline - Next 7 Days)
    const workloadData = useMemo(() => {
        const next7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() + i)
            return d.toISOString().split("T")[0]
        })

        const data = next7Days.map((date) => {
            const dayQuests = quests.filter((q) => q.deadline.split("T")[0] === date)
            return {
                date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
                count: dayQuests.length,
            }
        })
        return data
    }, [quests])

    // 2. Status Distribution
    const statusData = useMemo(() => {
        const completed = quests.filter((q) => q.status === "COMPLETED").length
        const inProgress = quests.filter((q) => q.status === "IN_PROGRESS").length
        const notStarted = quests.filter((q) => q.status === "NOT_STARTED").length

        return [
            { name: "COMPLETED", value: completed },
            { name: "ACTIVE", value: inProgress },
            { name: "PENDING", value: notStarted },
        ].filter((d) => d.value > 0)
    }, [quests])

    // 3. XP Projection (Cumulative Completed Quests over time - using created_at/deadline)
    // Since we don't have completed_at, we'll simulate "Growth" based on created dates of completed quests
    const growthData = useMemo(() => {
        const completedQuests = quests
            .filter((q) => q.status === "COMPLETED")
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

        let cumulative = 0
        return completedQuests.map((q) => {
            cumulative += 1
            return {
                date: new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                xp: cumulative,
            }
        })
    }, [quests])

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
                        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header Accent */}
                        <div className="h-[2px] bg-gradient-to-r from-[#00f3ff] via-[#00ff88] to-[#00f3ff]" />

                        <div className="p-6 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-[#00f3ff]" />
                                    <h2 className="text-[#00f3ff] text-lg font-bold tracking-wider">MISSION_ANALYTICS</h2>
                                </div>
                                <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Workload Chart */}
                                <div className="p-4 rounded border border-[#1a1a1a] bg-[#050505]">
                                    <h3 className="text-[#00ff88] text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        7-DAY WORKLOAD PROJECTION
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={workloadData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                                                <YAxis stroke="#666" fontSize={12} tickLine={false} allowDecimals={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }}
                                                    itemStyle={{ color: "#00f3ff" }}
                                                    cursor={{ fill: "rgba(0, 243, 255, 0.1)" }}
                                                />
                                                <Bar dataKey="count" fill="#00f3ff" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Status Chart */}
                                <div className="p-4 rounded border border-[#1a1a1a] bg-[#050505]">
                                    <h3 className="text-[#00ff88] text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <PieChart className="w-4 h-4" />
                                        MISSION STATUS DISTRIBUTION
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RechartsPieChart>
                                                <Pie
                                                    data={statusData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {statusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }}
                                                    itemStyle={{ color: "#fff" }}
                                                />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Growth Chart (Full Width) */}
                                <div className="lg:col-span-2 p-4 rounded border border-[#1a1a1a] bg-[#050505]">
                                    <h3 className="text-[#00ff88] text-xs tracking-widest mb-4 flex items-center gap-2">
                                        <Activity className="w-4 h-4" />
                                        XP ACQUISITION VELOCITY
                                    </h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={growthData.length > 0 ? growthData : [{ date: "Start", xp: 0 }]}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                                                <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} />
                                                <YAxis stroke="#666" fontSize={12} tickLine={false} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#000", border: "1px solid #333" }}
                                                    itemStyle={{ color: "#00ff88" }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="xp"
                                                    stroke="#00ff88"
                                                    strokeWidth={2}
                                                    dot={{ fill: "#00ff88", r: 4 }}
                                                    activeDot={{ r: 6, fill: "#fff" }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom accent */}
                        <div className="h-[2px] bg-gradient-to-r from-[#00f3ff] via-[#00ff88] to-[#00f3ff]" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
